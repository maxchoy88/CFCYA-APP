import React from 'react';
import { Trainee, Coach } from '../types';
import { X, Calendar, Edit, Clipboard, Sparkles, Search, Check, Send, FileText, History, ListCollapse } from 'lucide-react';

interface AttendanceModalProps {
  onClose: () => void;
  lang: string;
  t: (k: string, sk?: string) => string;
  attendanceDate: string;
  setAttendanceDate: (val: string) => void;
  attTab: 'trainees' | 'coaches';
  setAttTab: (val: 'trainees' | 'coaches') => void;
  importText: string;
  setImportText: (val: string) => void;
  parseImportText: () => void;
  attendanceSearchTerm: string;
  setAttendanceSearchTerm: (val: string) => void;
  attendanceList: string[]; // checked player IDs
  coachAttendanceList: string[]; // checked coach IDs
  toggleAttendance: (id: string) => void;
  toggleAllAttendanceStatus: () => void;
  attendanceFiltered: (Trainee | Coach)[];
  submitAttendance: () => void;
  handleWhatsappShare: () => void;
  handleExportAttendanceExcel: () => void;
  handleExportFullHistory: () => void;
  setIsMonthlyReportOpen: (val: boolean) => void;
  setReportSchool: (val: string) => void;
  selectedTeam: string;
}

export default function AttendanceModal({
  onClose,
  lang,
  t,
  attendanceDate,
  setAttendanceDate,
  attTab,
  setAttTab,
  importText,
  setImportText,
  parseImportText,
  attendanceSearchTerm,
  setAttendanceSearchTerm,
  attendanceList,
  coachAttendanceList,
  toggleAttendance,
  toggleAllAttendanceStatus,
  attendanceFiltered,
  submitAttendance,
  handleWhatsappShare,
  handleExportAttendanceExcel,
  handleExportFullHistory,
  setIsMonthlyReportOpen,
  setReportSchool,
  selectedTeam,
}: AttendanceModalProps) {
  const currentCount = attTab === 'trainees' ? attendanceList.length : coachAttendanceList.length;

  return (
    <div className="fixed inset-0 z-[10001] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 fade-in">
      <div 
        className="bg-zinc-900 w-full max-w-lg rounded-3xl border border-zinc-800 shadow-2xl p-6 max-h-[90vh] overflow-y-auto flex flex-col relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4 shrink-0">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 uppercase">
            <Clipboard className="w-5 h-5 text-emerald-500 animate-pulse" />
            {t('attTitle')}
          </h2>
          
          <div className="flex items-center gap-2">
            <input 
              type="date" 
              className="bg-zinc-950 border border-zinc-700 text-white text-xs px-3 py-2 rounded-xl outline-none focus:border-emerald-500 font-mono font-bold" 
              value={attendanceDate} 
              onChange={(e) => setAttendanceDate(e.target.value)} 
            />
            <button onClick={onClose} className="p-1 hover:bg-zinc-805 rounded-full transition-all">
              <X className="w-5 h-5 text-zinc-500 hover:text-white" />
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-zinc-950 rounded-xl p-1 mb-4 border border-zinc-800 shrink-0 shadow-inner">
          <button 
            onClick={() => setAttTab('trainees')}
            className={`flex-1 py-2 text-xs font-black rounded-lg transition-all uppercase ${attTab === 'trainees' ? 'bg-emerald-600 text-white shadow-lg' : 'text-zinc-500'}`}
          >
            {t('attTabTrainees')}
          </button>
          <button 
            onClick={() => setAttTab('coaches')}
            className={`flex-1 py-2 text-xs font-black rounded-lg transition-all uppercase ${attTab === 'coaches' ? 'bg-blue-600 text-white shadow-lg' : 'text-zinc-500'}`}
          >
            {t('attTabCoaches')}
          </button>
        </div>

        {/* Bulk Parser Area */}
        <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-850 mb-4 shrink-0 shadow-inner">
          <label className="text-[10px] text-zinc-500 font-black uppercase tracking-widest block mb-2">{t('attPaste')}</label>
          <textarea 
            className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-xs text-white h-16 mb-2 focus:border-emerald-500 outline-none resize-none leading-relaxed" 
            placeholder={t('attPlaceholder')} 
            value={importText} 
            onChange={e => setImportText(e.target.value)}
          ></textarea>
          <button 
            onClick={parseImportText} 
            className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-emerald-400 border border-emerald-950/20 rounded-xl text-xs font-black uppercase tracking-wider active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-yellow-500" />
            {t('attPasteDesc')}
          </button>
        </div>

        {/* Internal Live Search */}
        <div className="mb-2 shrink-0 relative">
          <input 
            className="w-full bg-black/50 border border-zinc-800 rounded-xl text-xs pl-9 pr-3 py-2.5 text-white focus:border-emerald-500 outline-none font-bold" 
            placeholder={t('attSearch')} 
            value={attendanceSearchTerm} 
            onChange={e => setAttendanceSearchTerm(e.target.value)} 
          />
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Selected count / Toggle all selection */}
        <div className="flex justify-between items-center mb-2 px-1 shrink-0 uppercase tracking-wider font-bold">
          <span className="text-[10px] text-zinc-500">Checked: {currentCount} Items</span>
          <button 
            onClick={toggleAllAttendanceStatus} 
            className="text-[9px] text-indigo-400 hover:text-indigo-300 border border-indigo-500/20 hover:border-indigo-500/40 px-2.5 py-1.5 rounded-full"
          >
            {t('attToggleAll')}
          </button>
        </div>

        {/* Check list layout scrollable viewport */}
        <div className="flex-1 overflow-y-auto space-y-2 mb-4 pr-1 no-scrollbar min-h-[140px] border-t border-zinc-800/10 pt-2">
          {attendanceFiltered?.map(item => {
            const isChecked = attTab === 'trainees' 
              ? attendanceList.includes(item.id) 
              : coachAttendanceList.includes(item.id);
            return (
              <div 
                key={item.id} 
                onClick={() => toggleAttendance(item.id)} 
                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${isChecked ? 'bg-emerald-950/15 border-emerald-500/40 shadow shadow-emerald-950/30' : 'bg-zinc-800/20 border-zinc-800/50 opacity-60'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded flex items-center justify-center border ${isChecked ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-zinc-700'}`}>
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3.5]" />}
                  </div>
                  <div className="leading-none uppercase">
                    <p className="text-sm font-black text-white">{item.name}</p>
                    <p className="text-[9px] text-zinc-500 font-bold mt-1 text-left">
                      {(item as Trainee).team || (item as Coach).role}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          {attendanceFiltered?.length === 0 && (
            <p className="text-center italic text-xs py-10 opacity-30 text-white font-bold uppercase">{t('noData')}</p>
          )}
        </div>

        {/* Dashboard bottom control bars */}
        <div className="flex gap-2 shrink-0 border-t border-zinc-800/80 pt-4">
          <button 
            onClick={submitAttendance} 
            className="flex-[2] py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-xl uppercase tracking-wider text-xs active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4 text-zinc-900" />
            {t('attConfirm')}
          </button>
          
          {/* WA Direct trigger */}
          <button 
            onClick={handleWhatsappShare} 
            className="flex-1 py-4 bg-[#25D366] hover:bg-[#1fbc57] text-white font-bold rounded-2xl shadow-xl flex items-center justify-center active:scale-95 transition-all border border-[#25D366]/20" 
            title="Share via WhatsApp"
          >
            <WAIcon className="w-5 h-5" />
          </button>
          
          {/* CSV Download */}
          <button 
            onClick={handleExportAttendanceExcel} 
            className="flex-1 py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl border border-zinc-750 flex items-center justify-center active:scale-95 transition-all" 
            title="Download Day CSV"
          >
            <FileText className="w-4.5 h-4.5 text-yellow-500" />
          </button>
          
          {/* Complete database cycle export */}
          <button 
            onClick={handleExportFullHistory} 
            className="flex-1 py-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-2xl border border-zinc-750 flex items-center justify-center active:scale-95 transition-all" 
            title="Export Full History CSV"
          >
            <History className="w-4.5 h-4.5 text-blue-400" />
          </button>
          
          {/* Open full month reports table */}
          <button 
            onClick={() => {
              setIsMonthlyReportOpen(true);
              setReportSchool(selectedTeam);
              onClose();
            }} 
            className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl shadow-xl flex items-center justify-center active:scale-95 transition-all" 
            title="Open Interactive Month Table"
          >
            <ListCollapse className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function WAIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 24 24"
      className={props.className || 'w-4 h-4'}
      {...props}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.458h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
