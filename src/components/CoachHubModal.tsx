import React, { useState } from 'react';
import { Coach } from '../types';
import { X, Briefcase, Clipboard, Landmark, Trash2, Send, Edit, MessageSquare, Plus, Check } from 'lucide-react';

interface CoachHubModalProps {
  onClose: () => void;
  lang: string;
  t: (k: string, sk?: string) => string;
  teams: string[];
  coaches: Coach[];
  coachView: string;
  setCoachView: (val: string) => void;
  coachForm: { name: string; phone: string; role: string; rank: string; rate: number };
  setCoachForm: React.Dispatch<React.SetStateAction<{ name: string; phone: string; role: string; rank: string; rate: number }>>;
  expandedCoachId: string | null;
  setExpandedCoachId: (val: string | null) => void;
  editingCoach: Coach | null;
  handleEditCoach: (c: Coach) => void;
  cancelEditCoach: () => void;
  saveCoach: () => void;
  deleteCoach: (id: string) => void;
  removeCoachRecord: (coachId: string, dateToRemove: string, schoolToRemove: string) => void;
  payrollData: { list: any[]; total: number };
  shareCoachPayslip: (c: any) => void;
  toggleCoachPayment: (id: string) => void;
  exportCoachPayrollExcel: () => void;
  financeMonth: string;
  setFinanceMonth: (val: string) => void;
  coachAttDate: string;
  setCoachAttDate: (val: string) => void;
  coachAttSchool: string;
  setCoachAttSchool: (val: string) => void;
  toggleCoachAttendance: (id: string) => void;
  COACH_ROLES: string[];
  COACH_RANKS: string[];
  sendCoachMessage: (c: Coach) => void;
}

export default function CoachHubModal({
  onClose,
  lang,
  t,
  teams,
  coaches,
  coachView,
  setCoachView,
  coachForm,
  setCoachForm,
  expandedCoachId,
  setExpandedCoachId,
  editingCoach,
  handleEditCoach,
  cancelEditCoach,
  saveCoach,
  deleteCoach,
  removeCoachRecord,
  payrollData,
  shareCoachPayslip,
  toggleCoachPayment,
  exportCoachPayrollExcel,
  financeMonth,
  setFinanceMonth,
  coachAttDate,
  setCoachAttDate,
  coachAttSchool,
  setCoachAttSchool,
  toggleCoachAttendance,
  COACH_ROLES,
  COACH_RANKS,
  sendCoachMessage,
}: CoachHubModalProps) {
  return (
    <div 
      className="fixed inset-0 z-[10002] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-zinc-900 border border-zinc-850 w-full max-w-lg h-[85vh] rounded-[2.5rem] p-6 flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 shrink-0 font-black">
          <h2 className="text-xl flex items-center gap-2 text-white uppercase font-bold">
            <Briefcase className="w-5 h-5 text-blue-500" />
            {t('coachTool')}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-zinc-805 rounded-full transition-all">
            <X className="w-6 h-6 text-zinc-500 hover:text-white" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-zinc-950 p-1 rounded-2xl mb-6 border border-zinc-800 shrink-0 shadow-inner">
          {['list', 'attendance', 'finance'].map(v => (
            <button 
              key={v} 
              onClick={() => setCoachView(v)} 
              className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all uppercase ${coachView === v ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/10' : 'text-zinc-500'}`}
            >
              {t('coach', v)}
            </button>
          ))}
        </div>

        {/* Scrollable Context Box */}
        <div className="flex-1 overflow-y-auto pr-1 no-scrollbar space-y-4">
          
          {/* PAYROLL TRACKING TAB */}
          {coachView === 'finance' && (
            <>
              {/* Top Summary Bar */}
              <div className="bg-zinc-950 p-4 rounded-3xl border border-zinc-800 flex justify-between items-center mb-2 sticky top-0 z-10 backdrop-blur-lg shadow-lg shrink-0">
                <input 
                  type="month" 
                  className="bg-zinc-900 text-white px-3 py-1.5 rounded-xl border border-zinc-700 text-sm font-bold outline-none focus:border-blue-500 font-mono uppercase" 
                  value={financeMonth} 
                  onChange={e => setFinanceMonth(e.target.value)}
                />
                <div className="text-right leading-none font-black uppercase tracking-tighter">
                  <p className="text-[9px] text-zinc-550 tracking-widest mb-1.5">{t('coachTotalPayout')}</p>
                  <p className="text-2xl text-emerald-400 font-black tracking-wider leading-none">RM {payrollData.total}</p>
                </div>
              </div>

              {/* Payroll Items list */}
              {payrollData.list.map(c => (
                <div key={c.id} className="bg-zinc-850/55 p-5 rounded-3xl border border-zinc-800 flex flex-col gap-4 shadow-lg">
                  <div className="flex justify-between items-center gap-2">
                    <div className="flex-1 leading-tight uppercase font-black">
                      <div className="flex flex-wrap items-center gap-2 font-bold text-white text-base leading-none">
                        <span>{c.name}</span>
                        <button 
                          onClick={() => setExpandedCoachId(expandedCoachId === c.id ? null : c.id)} 
                          className="text-[9px] font-black text-zinc-400 bg-zinc-950 px-3 py-1 rounded-full border border-zinc-750 active:scale-95 transition-transform"
                        >
                          {t('coachDetails')}
                        </button>
                      </div>
                      <p className="text-[10px] text-zinc-500 mt-2 font-bold tracking-wide">
                        {t('coach', 'sessions')}: {c.sessions} x RM{c.rate}
                      </p>
                    </div>
                    
                    <div className="text-right font-black uppercase tracking-widest leading-none">
                      <p className="text-lg text-white font-black leading-none mb-2">RM {c.amount}</p>
                      <div className="flex items-center justify-end gap-1.5">
                        <button 
                          onClick={() => shareCoachPayslip(c)} 
                          className="w-8 h-8 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center active:scale-90 transition-transform border border-[#25D366]/20 hover:bg-[#25D366] hover:text-white shadow-lg" 
                          title="WhatsApp Payslip Summary"
                        >
                          {/* Low-spec inline SVG for WA */}
                          <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.458h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => toggleCoachPayment(c.id)} 
                          className={`text-[9px] px-3 py-1.5 rounded-full transition-all font-black shadow-lg ${c.isPaid ? 'bg-emerald-600 text-white shadow-emerald-900/10' : 'bg-zinc-950 border border-zinc-750 text-zinc-550'}`}
                        >
                          {c.isPaid ? t('common', 'paid') : t('common', 'unpaid')}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Inline list of session hours logged */}
                  {expandedCoachId === c.id && (
                    <div className="bg-zinc-950 p-4 rounded-2xl space-y-3 border border-zinc-800 fade-in max-h-56 overflow-y-auto no-scrollbar shadow-inner">
                      {(c.details && c.details.length > 0) ? c.details.map((d: any, i: number) => (
                        <div 
                          key={i} 
                          className="flex justify-between items-center text-[11px] border-b border-zinc-900 pb-3 last:border-0 last:pb-0 font-bold uppercase tracking-widest leading-none"
                        >
                          <div className="flex flex-col tracking-wider leading-tight text-left">
                            <span className="text-zinc-300 font-mono text-xs">{d.date}</span>
                            <span className="text-blue-400 text-[9px] uppercase font-black mt-1">{d.school || t('common', 'unknown')}</span>
                          </div>
                          <button 
                            onClick={() => removeCoachRecord(c.id, d.date, d.school)} 
                            className="w-8 h-8 rounded-xl bg-red-950/20 text-red-500 hover:bg-red-500/15 active:scale-95 transition-all border border-red-950/20 shadow"
                          >
                            <Trash2 className="w-3.5 h-3.5 mx-auto" />
                          </button>
                        </div>
                      )) : (
                        <p className="text-center text-zinc-600 text-[10px] italic py-4 font-black uppercase tracking-wider">{t('noData')}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
              
              <button 
                onClick={exportCoachPayrollExcel} 
                className="w-full shrink-0 py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-2xl border border-zinc-700 flex items-center justify-center gap-2 text-xs uppercase tracking-wider active:scale-95 transition-all"
              >
                <Trash2 className="w-4 h-4 text-emerald-500 rotate-180" />
                {t('coachExport')}
              </button>
            </>
          )}

          {/* REGISTER & MANAGE COACHES TAB */}
          {coachView === 'list' && (
            <div className="space-y-4 font-black uppercase tracking-tighter">
              {/* Creator dashboard */}
              <div className="bg-zinc-950 p-5 rounded-[2.5rem] border border-zinc-850 mb-2 shadow-xl shrink-0 uppercase">
                <div className="grid grid-cols-2 gap-3 mb-3 leading-none">
                  <input 
                    className="bg-zinc-900 border border-zinc-750 rounded-xl px-4 py-3.5 text-xs text-white focus:border-blue-500 outline-none font-bold placeholder-zinc-600" 
                    placeholder={t('common', 'name')} 
                    value={coachForm.name} 
                    onChange={e => setCoachForm({ ...coachForm, name: e.target.value })} 
                  />
                  <input 
                    className="bg-zinc-900 border border-zinc-750 rounded-xl px-4 py-3.5 text-xs text-white font-mono focus:border-blue-500 outline-none placeholder-zinc-600" 
                    placeholder={t('common', 'phone')} 
                    value={coachForm.phone} 
                    onChange={e => setCoachForm({ ...coachForm, phone: e.target.value })} 
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4 leading-none">
                  <select 
                    className="bg-zinc-900 border border-zinc-750 rounded-xl px-2 py-3 text-[10px] text-zinc-300 focus:border-blue-500 outline-none uppercase font-bold" 
                    value={coachForm.role} 
                    onChange={e => setCoachForm({ ...coachForm, role: e.target.value })}
                  >
                    {COACH_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <select 
                    className="bg-zinc-900 border border-zinc-750 rounded-xl px-2 py-3 text-[10px] text-zinc-300 focus:border-blue-500 outline-none uppercase font-bold" 
                    value={coachForm.rank} 
                    onChange={e => setCoachForm({ ...coachForm, rank: e.target.value })}
                  >
                    {COACH_RANKS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-[10px] font-mono leading-none">RM</span>
                    <input 
                      type="number" 
                      className="w-full bg-zinc-900 border border-zinc-750 rounded-xl pl-8 pr-2 py-3 text-xs text-white font-mono font-bold focus:border-blue-500 outline-none" 
                      placeholder={t('common', 'rate')} 
                      value={coachForm.rate || ''} 
                      onChange={e => setCoachForm({ ...coachForm, rate: parseInt(e.target.value) || 0 })} 
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {editingCoach && (
                    <button 
                      onClick={cancelEditCoach} 
                      className="flex-1 py-4 bg-zinc-850 hover:bg-zinc-800 text-zinc-400 text-xs font-black rounded-2xl active:scale-95 transition-all uppercase tracking-widest leading-none"
                    >
                      {t('common', 'cancel')}
                    </button>
                  )}
                  <button 
                    onClick={saveCoach} 
                    className={`flex-[2] py-4 text-white text-xs font-black rounded-2xl active:scale-95 transition-all shadow-lg uppercase tracking-widest leading-none ${editingCoach ? 'bg-emerald-600 shadow-emerald-900/10' : 'bg-blue-600 shadow-blue-900/10'}`}
                  >
                    {editingCoach ? t('common', 'save') : t('coach', 'register')}
                  </button>
                </div>
              </div>
              
              {/* Registered items array list */}
              {coaches.map(c => (
                <div 
                  key={c.id} 
                  className="bg-zinc-850/45 p-4 rounded-3xl border border-zinc-800/80 flex justify-between items-center shadow-lg leading-none group"
                >
                  <div className="text-left font-sans uppercase">
                    <p className="font-extrabold text-white text-base tracking-widest leading-none mb-2 flex items-center gap-2">
                      {c.name}
                      <span className={`text-[8px] px-2 py-0.5 rounded border leading-none tracking-widest ${c.rank === 'Director' ? 'bg-purple-950/30 text-purple-400 border-purple-500/20' : c.rank === 'Senior' ? 'bg-yellow-950/30 text-yellow-500 border-yellow-500/20' : 'bg-zinc-900 text-zinc-400 border-zinc-750'}`}>
                        {c.rank || 'Junior'}
                      </span>
                    </p>
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-wider">
                      {c.role} • RM{c.rate} / {t('common', 'sessionUnit')}
                    </p>
                  </div>
                  
                  <div className="flex gap-1.5 shrink-0">
                    <button 
                      onClick={() => sendCoachMessage(c)} 
                      className="w-9 h-9 rounded-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white flex items-center justify-center active:scale-90 transition-transform shadow-lg border border-[#25D366]/10"
                    >
                      <MessageIcon className="w-4.5 h-4.5" />
                    </button>
                    <button 
                      onClick={() => handleEditCoach(c)} 
                      className="w-9 h-9 rounded-full bg-blue-900/10 text-blue-400 hover:bg-blue-600 hover:text-white flex items-center justify-center active:scale-90 transition-transform shadow-lg border border-blue-900/10"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => deleteCoach(c.id)} 
                      className="w-9 h-9 rounded-full bg-red-950/20 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center active:scale-90 transition-transform shadow-lg border border-red-950/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* MARK CHANNELS ATTENDANCE LOGS TAB */}
          {coachView === 'attendance' && (
            <div className="space-y-4">
              <div className="bg-zinc-950 p-4 rounded-3xl border border-zinc-800 mb-4 sticky top-0 z-10 flex gap-3 shadow-lg shrink-0">
                <input 
                  type="date" 
                  className="flex-1 bg-zinc-900 text-white px-4 py-2 rounded-2xl border border-zinc-700 font-bold outline-none uppercase text-xs" 
                  value={coachAttDate} 
                  onChange={e => setCoachAttDate(e.target.value)}
                />
                <select 
                  className="flex-1 bg-zinc-900 text-zinc-300 px-4 py-2 rounded-2xl border border-zinc-700 text-xs font-bold uppercase outline-none" 
                  value={coachAttSchool} 
                  onChange={e => setCoachAttSchool(e.target.value)}
                >
                  {teams.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {coaches.map(c => {
                const isPresent = (c.attendanceHistory || []).some(h => h.date === coachAttDate && h.school === coachAttSchool);
                return (
                  <div 
                    key={c.id} 
                    onClick={() => toggleCoachAttendance(c.id)} 
                    className={`flex items-center justify-between p-4.5 rounded-3xl border cursor-pointer transition-all ${isPresent ? 'bg-emerald-950/15 border-emerald-500 shadow-lg shadow-emerald-500/5' : 'bg-zinc-850/20 border-zinc-800/80 opacity-60'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-5.5 h-5.5 rounded-lg flex items-center justify-center border ${isPresent ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-zinc-700'}`}>
                        {isPresent && <Check className="w-4.5 h-4.5 stroke-[3]" />}
                      </div>
                      <div className="leading-tight font-black uppercase tracking-widest text-left font-sans">
                        <p className="text-white text-base font-black leading-none">{c.name}</p>
                        <p className="text-[9px] text-zinc-550 font-bold mt-1.5 uppercase leading-none">{c.role}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

function MessageIcon(props: React.SVGProps<SVGSVGElement>) {
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
