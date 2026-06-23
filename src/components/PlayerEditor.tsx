import React from 'react';
import { Trainee, Stats } from '../types';
import { X, Camera, Wand2, Plus, Trash2, ArrowUp, Calendar, School, Trophy, Award, Sliders, Settings } from 'lucide-react';

interface PlayerEditorProps {
  onClose: () => void;
  lang: string;
  t: (k: string, sk?: string) => string;
  teams: string[];
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  editingTrainee: Trainee | null;
  handleSaveTrainee: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleTraineeFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  mockAI: () => void;
  aiLoading: boolean;
  historyDateInput: string;
  setHistoryDateInput: (val: string) => void;
  addHistoryRecord: () => void;
  removeHistoryDate: (date: string) => void;
  monthlyGroups: [string, string[]][];
  POSITIONS: string[];
  CATEGORIES: string[];
  DEFAULT_IMAGE: string;
}

export default function PlayerEditor({
  onClose,
  lang,
  t,
  teams,
  formData,
  setFormData,
  editingTrainee,
  handleSaveTrainee,
  fileInputRef,
  handleTraineeFile,
  mockAI,
  aiLoading,
  historyDateInput,
  setHistoryDateInput,
  addHistoryRecord,
  removeHistoryDate,
  monthlyGroups,
  POSITIONS,
  CATEGORIES,
  DEFAULT_IMAGE,
}: PlayerEditorProps) {

  const getStatGrade = (v: number) => {
    const val = parseInt(v as any) || 0;
    return val >= 90 ? 'S' : val >= 80 ? 'A' : val >= 70 ? 'B' : val >= 60 ? 'C' : 'D';
  };

  const getGradeColor = (g: string) => {
    switch (g) {
      case 'S': return 'text-fuchsia-400 font-black drop-shadow-[0_0_8px_rgba(192,38,211,0.6)]';
      case 'A': return 'text-emerald-400 font-black';
      case 'B': return 'text-blue-400 font-bold';
      case 'C': return 'text-yellow-400 font-bold';
      default: return 'text-zinc-500 font-bold';
    }
  };

  const handleStatChange = (stat: keyof Stats, value: number) => {
    setFormData((prev: any) => ({
      ...prev,
      stats: {
        ...prev.stats,
        [stat]: value,
      },
    }));
  };

  return (
    <div 
      className="fixed inset-0 z-[10002] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-[2.5rem] p-6 sm:p-8 overflow-y-auto max-h-[90vh] shadow-2xl shadow-black font-black uppercase tracking-tighter scrollbar-none"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 shrink-0 font-bold text-white uppercase tracking-tighter leading-none border-b border-zinc-800/50 pb-4">
          <h2 className="text-xl sm:text-2xl flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500 animate-pulse" />
            {t('player', 'title')}
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-zinc-800 rounded-full transition-all">
            <X className="w-5 h-5 text-zinc-500 hover:text-white" />
          </button>
        </div>

        <div className="space-y-6 pb-2">
          {/* Main profile avatar and basic textual fields inputs */}
          <div className="flex flex-col sm:flex-row items-center gap-6 font-black uppercase leading-none border-b border-zinc-800/10 pb-5">
            <div 
              className="w-28 h-28 bg-zinc-950 rounded-[2rem] border-2 border-zinc-800 cursor-pointer shadow-xl flex items-center justify-center overflow-hidden shrink-0 group relative" 
              onClick={() => fileInputRef.current?.click()}
            >
              <img 
                src={formData.image || DEFAULT_IMAGE} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                alt="Avatar"
                onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_IMAGE; }}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleTraineeFile}
              />
            </div>
            
            <div className="flex-1 w-full space-y-3.5">
              <input 
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-5 py-3 font-extrabold text-sm text-white focus:border-indigo-500 outline-none uppercase placeholder-zinc-700" 
                placeholder={t('common', 'name')} 
                value={formData.name || ''} 
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
              
              <div className="flex gap-2">
                <input 
                  className="w-1/2 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 font-bold text-white text-[11px] outline-none uppercase placeholder-zinc-700 focus:border-indigo-500" 
                  placeholder={t('common', 'parent')} 
                  value={formData.parentName || ''} 
                  onChange={e => setFormData({ ...formData, parentName: e.target.value })}
                />
                <input 
                  className="w-1/2 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 font-bold text-white text-[11px] outline-none uppercase placeholder-zinc-700 focus:border-indigo-500 font-mono" 
                  placeholder={t('common', 'phone')} 
                  value={formData.phone || ''} 
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="flex gap-2">
                <input 
                  className="w-1/2 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 font-bold text-white text-[11px] outline-none uppercase placeholder-zinc-700 focus:border-indigo-500" 
                  placeholder={t('common', 'email')} 
                  value={formData.email || ''} 
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
                <input 
                  className="w-1/2 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 font-bold text-white text-[11px] outline-none uppercase placeholder-zinc-700 focus:border-indigo-500" 
                  placeholder={t('common', 'tin')} 
                  value={formData.tin || ''} 
                  onChange={e => setFormData({ ...formData, tin: e.target.value })}
                />
              </div>

              <div className="flex gap-2">
                <select 
                  className="w-2/3 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-zinc-300 text-[11px] font-bold outline-none uppercase appearance-none" 
                  value={formData.team} 
                  onChange={e => setFormData({ ...formData, team: e.target.value })}
                >
                  <option value="">-- {t('common', 'school')} --</option>
                  {teams.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <select 
                  className="w-1/3 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-zinc-300 text-[11px] font-bold outline-none uppercase appearance-none" 
                  value={formData.category} 
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="">CAT</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="flex gap-2">
                <select 
                  className="w-1/2 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-zinc-300 text-[10px] font-bold outline-none uppercase" 
                  value={formData.primaryPosition} 
                  onChange={e => setFormData({ ...formData, primaryPosition: e.target.value })}
                >
                  {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <select 
                  className="w-1/2 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-zinc-300 text-[10px] font-bold outline-none uppercase" 
                  value={formData.secondaryPosition || '无'} 
                  onChange={e => setFormData({ ...formData, secondaryPosition: e.target.value })}
                >
                  <option value="无">{t('common', 'secPos')}</option>
                  {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div className="flex gap-2">
                <input 
                  className="w-1/2 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 font-bold text-white text-[11px] outline-none uppercase placeholder-zinc-700 focus:border-indigo-500" 
                  placeholder={t('common', 'height')} 
                  value={formData.height || ''} 
                  onChange={e => setFormData({ ...formData, height: e.target.value })}
                />
                <input 
                  className="w-1/2 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 font-bold text-white text-[11px] outline-none uppercase placeholder-zinc-700 focus:border-indigo-500" 
                  placeholder={t('common', 'weight')} 
                  value={formData.weight || ''} 
                  onChange={e => setFormData({ ...formData, weight: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* AI Comments section */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] tracking-wider text-zinc-550 border-b border-zinc-850 pb-1.5 font-bold">
              <span className="uppercase">{t('common', 'comment')}</span>
              <button 
                type="button"
                onClick={mockAI} 
                className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 transition-colors uppercase font-black tracking-widest text-[9px]"
              >
                <Wand2 className={`w-3.5 h-3.5 ${aiLoading ? 'animate-spin text-fuchsia-500' : 'text-indigo-500'}`} />
                {t('common', 'generate')}
              </button>
            </div>
            <textarea 
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-3 font-semibold text-white focus:border-indigo-500 outline-none text-xs h-20 resize-none leading-relaxed uppercase" 
              placeholder="..." 
              value={formData.coachComment || ''} 
              onChange={e => setFormData({ ...formData, coachComment: e.target.value })}
            ></textarea>
          </div>

          {/* Sliders stats list */}
          <div className="space-y-4 border-t border-b border-zinc-850 py-4">
            <h3 className="text-xs font-black uppercase text-zinc-500 tracking-widest flex items-center gap-1.5 mb-2">
              <Sliders className="w-4 h-4 text-zinc-600" />
              Football Attributes
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 uppercase font-black text-[10px] tracking-widest">
              {(Object.keys(formData.stats || {}) as Array<keyof Stats>).map(s => (
                <div key={s} className="bg-zinc-950/40 p-3 rounded-2xl border border-zinc-800">
                  <div className="flex justify-between mb-1.5 text-zinc-500 leading-none items-center">
                    <span>{t('stats', s)}</span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black tracking-widest ${getGradeColor(getStatGrade(formData.stats?.[s]))}`}>
                      {formData.stats?.[s] || 50}
                    </span>
                  </div>
                  <input 
                    type="range" 
                    className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-yellow-500" 
                    value={formData.stats?.[s] || 50} 
                    min="0" 
                    max="99" 
                    onChange={e => handleStatChange(s, parseInt(e.target.value))}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Simple attended config rates */}
          <div className="bg-zinc-950/50 p-4 rounded-3xl border border-zinc-850 shadow-inner mt-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">{t('common', 'attendanceRate')}</span>
              <span className="text-emerald-400 bg-zinc-90 w-auto border border-emerald-500/20 px-3 py-1 rounded-lg leading-none text-xs font-black select-none shadow">
                {Math.round(((formData.attendedSessions || 0) / (formData.totalSessions || 52)) * 100) || 0}%
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[9px] text-zinc-550 block mb-1 uppercase font-bold tracking-wider">{t('common', 'attendedCount')}</label>
                <input 
                  type="number" 
                  className="w-full bg-black/60 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 outline-none text-center font-mono font-bold" 
                  value={formData.attendedSessions || 0} 
                  onChange={e => setFormData({ ...formData, attendedSessions: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="text-[9px] text-zinc-550 block mb-1 uppercase font-bold tracking-wider">{t('common', 'totalCycle')}</label>
                <input 
                  type="number" 
                  className="w-full bg-black/60 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 outline-none text-center font-mono font-bold" 
                  value={formData.totalSessions || 52} 
                  onChange={e => setFormData({ ...formData, totalSessions: parseInt(e.target.value) || 52 })}
                />
              </div>
            </div>
          </div>

          {/* Monthly Supplemental Log Feed */}
          <div className="bg-zinc-950/50 p-4 rounded-3xl border border-zinc-850 shadow-inner mt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">{t('common', 'monthlySummary')}</span>
              
              <div className="flex gap-2">
                <input 
                  type="date" 
                  className="bg-black/60 border border-zinc-800 rounded-lg px-2 py-1 text-[10px] text-white outline-none focus:border-emerald-500 font-mono font-bold" 
                  value={historyDateInput} 
                  onChange={e => setHistoryDateInput(e.target.value)} 
                />
                <button 
                  onClick={addHistoryRecord} 
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded-lg font-bold text-[10px] active:scale-95 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            
            {/* Log Feed */}
            <div className="max-h-56 overflow-y-auto no-scrollbar space-y-4 pr-1 border-t border-zinc-900 pt-3">
              {monthlyGroups.length > 0 ? (
                monthlyGroups.map(([month, dates]) => (
                  <div key={month} className="relative pl-4 border-l border-zinc-800">
                    <div className="absolute -left-1 top-1 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                    
                    <div className="flex justify-between items-end mb-1.5 uppercase font-bold tracking-wider">
                      <span className="text-xs text-white font-mono">{month}</span>
                      <span className="text-[9px] text-emerald-400 bg-emerald-990/15 border border-emerald-950/20 px-2 py-0.5 rounded-md">
                        {dates.length} {t('common', 'sessionUnit')}
                      </span>
                    </div>
                    
                    <div className="w-full bg-zinc-900 h-1 rounded-full overflow-hidden mb-2.5">
                      <div 
                        className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full rounded-full" 
                        style={{ width: `${Math.min(100, (dates.length / 8) * 100)}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1.5">
                      {dates.map((d, i) => (
                        <button 
                          key={i} 
                          onClick={() => removeHistoryDate(d)}
                          className="group relative bg-zinc-900/60 hover:bg-red-950/40 text-zinc-400 hover:text-red-400 border border-zinc-800 hover:border-red-900 px-2.5 py-1 rounded-lg text-[9px] font-mono font-bold transition-all duration-205 active:scale-95 flex items-center gap-1 uppercase"
                          title="Click to delete this date log record"
                        >
                          <span className="group-hover:hidden">{d.slice(5)}</span>
                          <span className="hidden group-hover:inline flex items-center justify-center">
                            <Trash2 className="w-3 h-3 text-red-500" />
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-[10px] text-zinc-600 italic py-8 uppercase font-bold tracking-widest">{t('noData')}</p>
              )}
            </div>
          </div>

          {/* Action Trigger */}
          <button 
            onClick={handleSaveTrainee} 
            className="w-full py-4.5 bg-white text-zinc-900 rounded-[2rem] font-bold text-base shadow-2xl active:scale-[0.98] transition-all mt-4 uppercase tracking-wider leading-none"
          >
            {t('common', 'save')}
          </button>
        </div>
      </div>
    </div>
  );
}
