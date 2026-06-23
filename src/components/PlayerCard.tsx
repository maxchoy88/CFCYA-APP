import React from 'react';
import { Trainee } from '../types';
import { Share2, Edit2, Trash2, Shield, Calendar, Award } from 'lucide-react';

interface PlayerCardProps {
  key?: React.Key;
  trainee: Trainee;
  userRole: string | null;
  getStatGrade: (v: number) => string;
  getGradeColor: (g: string) => string;
  getAttendanceColor: (v: number) => string;
  getPositionCode: (s: string) => string;
  getOptimizedImageUrl: (url: string) => string;
  handleSystemShare: (t: Trainee) => void;
  toggleQuickAttendance: (e: React.MouseEvent, player: Trainee) => void;
  handleEdit: (t: Trainee) => void;
  deleteTrainee: (id: string) => void;
  t: (k: string, sk?: string) => string;
  DEFAULT_IMAGE: string;
}

export default function PlayerCard({
  trainee,
  userRole,
  getStatGrade,
  getGradeColor,
  getAttendanceColor,
  getPositionCode,
  getOptimizedImageUrl,
  handleSystemShare,
  toggleQuickAttendance,
  handleEdit,
  deleteTrainee,
  t,
  DEFAULT_IMAGE,
}: PlayerCardProps) {
  const vals = Object.values(trainee.stats || {});
  const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
  const grade = getStatGrade(avg);
  
  // Find last attendance date
  const lastAtt = trainee.attendanceHistory?.length 
    ? [...trainee.attendanceHistory].sort((a: any, b: any) => {
        const dateA = typeof a === 'string' ? a : a.date;
        const dateB = typeof b === 'string' ? b : b.date;
        return dateB.localeCompare(dateA);
      })[0] 
    : null;
  
  const lastDate = lastAtt 
    ? (typeof lastAtt === 'string' ? lastAtt : lastAtt.date) 
    : 'N/A';

  const today = new Date().toISOString().slice(0, 10);
  const isPresentToday = trainee.attendanceHistory?.some((h: any) => {
    const d = typeof h === 'string' ? h : h.date;
    return d === today;
  });

  return (
    <div className="bg-zinc-90 w-full bg-zinc-900 rounded-3xl border border-zinc-800/80 overflow-hidden flex flex-col group hover:border-zinc-700 hover:shadow-2xl transition-all relative">
      {/* Visual Avatar Cover */}
      <div className="h-32 relative overflow-hidden shrink-0 select-none">
        <img 
          src={getOptimizedImageUrl(trainee.image)} 
          className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" 
          alt={trainee.name}
          onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_IMAGE; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent opacity-90"></div>
        
        {/* Position Tag badge */}
        <span className="absolute top-3 left-3 bg-yellow-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded shadow-lg uppercase leading-none tracking-widest border border-yellow-400/20">
          {getPositionCode(trainee.primaryPosition) || 'FW'}
        </span>
        
        {/* Visual Level badge S/A/B/C/D */}
        <div className="absolute top-2.5 right-3 flex flex-col items-center select-none" title={`Overall Grade: ${grade}`}>
          <span className={`text-xl italic leading-none font-bold uppercase transition-transform group-hover:scale-110 ${getGradeColor(grade)}`}>
            {grade}
          </span>
        </div>

        {/* Dynamic lower summary banner */}
        <div className="absolute bottom-3 left-4 right-4 truncate leading-tight font-black uppercase text-white drop-shadow flex items-center gap-1.5">
          <span className="truncate max-w-[70%]">{trainee.name}</span>
          {trainee.category && (
            <span className="bg-zinc-850 border border-zinc-800 text-[8px] tracking-widest px-1.5 py-0.5 rounded-md text-zinc-400 font-extrabold select-none">
              {trainee.category}
            </span>
          )}
        </div>

        {/* WhatsApp/System share buttons */}
        <button 
          onClick={() => handleSystemShare(trainee)} 
          className="absolute bottom-2.5 right-3.5 w-7 h-7 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-indigo-650 hover:bg-white/20 transition-all border border-white/20 shadow z-20 active:scale-90"
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Attributes stats body section */}
      <div className="p-3.5 flex-1 flex flex-col">
        <div className="grid grid-cols-3 gap-1 mb-3 shrink-0">
          {(['pace', 'shooting', 'passing'] as Array<keyof typeof trainee.stats>).map(s => {
            const sVal = trainee.stats?.[s] || 50;
            const sGrade = getStatGrade(sVal);
            return (
              <div 
                key={s} 
                className="bg-black/35 p-1 rounded-xl flex flex-col items-center border border-zinc-800/40 shadow-inner select-none"
                title={`${s}: ${sVal}`}
              >
                <span className="text-zinc-600 text-[8.5px] uppercase font-black tracking-widest">{s.slice(0, 3)}</span>
                <span className={`text-xs mt-1 ${getGradeColor(sGrade)}`}>
                  {sGrade}
                </span>
              </div>
            );
          })}
        </div>

        {/* Coach Comment Inline Preview banner */}
        {trainee.coachComment && (
          <div className="mb-2.5 px-1 shrink-0">
            <p className="text-[9.5px] text-zinc-500 truncate italic font-medium leading-none">
              💬 "{trainee.coachComment}"
            </p>
          </div>
        )}

        {/* Height and Weight values */}
        {(trainee.height || trainee.weight) && (
          <div className="flex gap-2 justify-between items-center px-1 mb-3 text-[9px] text-zinc-550 font-mono font-bold leading-none uppercase tracking-wider shrink-0 select-none">
            {trainee.height && <span>H: {trainee.height}cm</span>}
            {trainee.weight && <span>W: {trainee.weight}kg</span>}
          </div>
        )}

        {/* Action controllers footer */}
        <div className="mt-auto pt-3 border-t border-zinc-805 flex justify-between items-center select-none uppercase font-sans">
          
          {/* Quick attendance toggle trigger */}
          <div 
            onClick={(e) => toggleQuickAttendance(e, trainee)}
            className={`flex flex-col gap-0.5 ${userRole === 'admin' ? 'cursor-pointer hover:opacity-100' : 'opacity-85'}`}
          >
            <div className="flex items-center gap-1.5">
              <div className={`relative w-2.5 h-2.5 rounded-full ${getAttendanceColor(trainee.attendance || 0)}`}>
                {isPresentToday && (
                  <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60"></span>
                )}
              </div>
              <span className="text-[10px] text-zinc-400 font-extrabold tracking-widest">
                {trainee.attendance || 0}% 
                <span className="text-zinc-600 text-[8.5px] font-sans pl-1 font-bold">
                  ({trainee.attendedSessions || 0}/{trainee.totalSessions || 52})
                </span>
              </span>
            </div>
            {/* Last present seen indicator */}
            <span className="text-[8px] text-zinc-650 tracking-widest leading-none text-left font-mono font-bold block mt-0.5">
              LAST: {lastDate}
            </span>
          </div>

          {userRole === 'admin' && (
            <div className="flex gap-1.5 items-center">
              <button 
                onClick={() => handleEdit(trainee)} 
                className="w-7 h-7 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center active:scale-90 transition-all border border-zinc-750"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => deleteTrainee(trainee.id)} 
                className="w-7 h-7 rounded-xl bg-red-950/20 text-red-500 hover:bg-red-500/10 flex items-center justify-center active:scale-90 transition-all border border-red-950/15"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
