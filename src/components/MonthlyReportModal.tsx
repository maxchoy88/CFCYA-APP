import React from 'react';
import { Trainee } from '../types';
import { X, Calendar, Plus, BookOpen, Check, FileSpreadsheet } from 'lucide-react';

interface MonthlyReportModalProps {
  onClose: () => void;
  lang: string;
  t: (k: string, sk?: string) => string;
  reportMonth: string;
  setReportMonth: (val: string) => void;
  reportSchool: string;
  setReportSchool: (val: string) => void;
  teams: string[];
  reportData: { dates: string[]; list: any[]; targetSchool: string };
  toggleReportAttendance: (playerId: string, date: string) => void;
  renameReportDate: (oldDate: string) => void;
  addReportDate: () => void;
  reportDateInput: string;
  setReportDateInput: (val: string) => void;
  handleDownloadReport: () => void;
}

export default function MonthlyReportModal({
  onClose,
  lang,
  t,
  reportMonth,
  setReportMonth,
  reportSchool,
  setReportSchool,
  teams,
  reportData,
  toggleReportAttendance,
  renameReportDate,
  addReportDate,
  reportDateInput,
  setReportDateInput,
  handleDownloadReport,
}: MonthlyReportModalProps) {
  return (
    <div 
      className="fixed inset-0 z-[10005] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-zinc-900 border border-zinc-800 w-full max-w-4xl h-[85vh] rounded-[2.5rem] p-6 sm:p-8 flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 shrink-0">
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-blue-500 animate-pulse" />
            {t('common', 'reportTitle')}
          </h2>
          
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Quick date bulk injector */}
            <div className="flex bg-black/50 rounded-xl border border-zinc-800 p-1 items-center grow sm:grow-0">
              <input 
                type="date" 
                className="bg-transparent text-white text-xs px-2 outline-none w-28 uppercase font-bold" 
                value={reportDateInput} 
                onChange={e => setReportDateInput(e.target.value)} 
              />
              <button 
                onClick={addReportDate} 
                title="Bulk Add Colum date"
                className="bg-zinc-800 hover:bg-emerald-600 hover:text-white text-zinc-300 px-3 py-1 rounded-lg text-xs font-bold transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="w-px h-6 bg-zinc-800 hidden sm:block mx-1"></div>
            
            {/* Month filter value */}
            <input 
              type="month" 
              className="bg-zinc-950 text-white px-3 py-2 rounded-xl border border-zinc-800 text-xs font-bold outline-none focus:border-blue-500" 
              value={reportMonth} 
              onChange={e => setReportMonth(e.target.value)} 
            />
            
            <button 
              onClick={onClose} 
              className="text-zinc-505 hover:bg-zinc-800 p-1.5 rounded-full text-zinc-400 hover:text-white transition-all ml-auto sm:ml-0"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* School/Team Filtering Tabs */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar mb-4 pb-2 shrink-0 border-b border-zinc-800/60">
          <button 
            onClick={() => setReportSchool('全部')} 
            className={`px-3.5 py-2 rounded-xl text-[10px] font-black border transition-all uppercase whitespace-nowrap ${reportSchool === '全部' ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/10' : 'bg-zinc-950 border-zinc-800 text-zinc-500'}`}
          >
            {t('common', 'all')}
          </button>
          {teams.map(team => (
            <button 
              key={team} 
              onClick={() => setReportSchool(team)} 
              className={`px-3.5 py-2 rounded-xl text-[10px] font-black border transition-all uppercase whitespace-nowrap ${reportSchool === team ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/10' : 'bg-zinc-950 border-zinc-800 text-zinc-500'}`}
            >
              {team}
            </button>
          ))}
        </div>

        {/* Scalable Report Table viewport */}
        <div className="flex-1 overflow-auto border border-zinc-800/80 rounded-2xl bg-black/20 no-scrollbar relative shadow-inner">
          <table className="w-full text-left border-collapse table-auto">
            <thead className="bg-zinc-900/95 sticky top-0 z-10 shadow border-b border-zinc-805">
              <tr>
                <th className="p-4 text-[10px] font-black text-zinc-500 uppercase tracking-wider sticky left-0 bg-zinc-900/95 z-20 w-32 border-r border-zinc-800/30">
                  Player Name
                </th>
                {reportData.dates.map(d => (
                  <th 
                    key={d} 
                    onClick={() => renameReportDate(d)} 
                    className="p-3 text-[9px] font-mono font-black text-zinc-400 border-r border-zinc-800/30 text-center min-w-[50px] cursor-pointer hover:text-white hover:bg-white/5 transition-colors select-none"
                    title="Click header to rename date"
                  >
                    <span className="bg-black/30 px-1.5 py-1 rounded border border-zinc-800 shadow-inner">
                      {d.slice(5)} {/* MM-DD format */}
                    </span>
                  </th>
                ))}
                <th className="p-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-center sticky right-0 bg-zinc-900/95 z-20 w-16 border-l border-zinc-800/50 shadow-2xl">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 uppercase">
              {reportData.list.map(p => {
                const history = p.attendanceHistory || []; 
                const presentDates = new Set(history.map((h: any) => (typeof h === 'string' ? h : h?.date)));
                let count = 0;
                
                return (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors group/row">
                    <td className="p-4 text-xs font-bold text-white border-r border-zinc-800/30 sticky left-0 bg-zinc-900/95 z-10 group-hover/row:bg-zinc-805 transition-colors">
                      <div className="truncate w-24 font-black">{p.name}</div>
                      <div className="text-[8px] text-zinc-500 font-normal mt-0.5 truncate w-24">{p.team}</div>
                    </td>
                    {reportData.dates.map(d => {
                      const isPresent = presentDates.has(d);
                      if (isPresent) count++;
                      return (
                        <td 
                          key={d} 
                          onClick={() => toggleReportAttendance(p.id, d)} 
                          className="p-3 text-center border-r border-zinc-800/30 cursor-pointer hover:bg-white/10 transition-all select-none"
                        >
                          {isPresent ? (
                            <span className="inline-flex w-5 h-5 bg-emerald-500 text-black font-black text-xs rounded shadow-lg shadow-emerald-950/20 items-center justify-center animate-pulse">
                              ✓
                            </span>
                          ) : (
                            <span className="text-zinc-800 text-xs font-black group-hover/row:text-zinc-700/60 transition-colors">-</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="p-4 text-xs font-mono font-black text-blue-400 text-center sticky right-0 bg-zinc-900/95 z-10 border-l border-zinc-800/50 group-hover/row:bg-zinc-805 shadow-2xl">
                      {count}
                    </td>
                  </tr>
                );
              })}
              {reportData.list.length === 0 && (
                <tr>
                  <td colSpan={(reportData.dates?.length || 0) + 2} className="p-8 text-center text-zinc-500 italic text-xs uppercase font-black">
                    {t('noData')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Grid Export to CSV footer sheet */}
        <div className="mt-4 flex justify-end shrink-0">
          <button 
            onClick={handleDownloadReport} 
            className="px-8 py-3.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-2xl border border-zinc-700 flex items-center gap-2 text-xs uppercase tracking-wider active:scale-95 transition-all shadow-lg"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
            导出报表 Export CSV
          </button>
        </div>
      </div>
    </div>
  );
}
