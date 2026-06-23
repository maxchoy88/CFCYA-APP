import React from 'react';
import { Trainee } from '../types';
import { X, Copy, Landmark, AlertTriangle, FileSpreadsheet, Key, Check, HelpCircle, MessageSquare } from 'lucide-react';

interface FinanceModalProps {
  onClose: () => void;
  lang: string;
  t: (k: string, sk?: string) => string;
  financeMonth: string;
  setFinanceMonth: (val: string) => void;
  financeSearchTerm: string;
  setFinanceSearchTerm: (val: string) => void;
  financeFiltered: Trainee[];
  financeSummary: { total: number; paid: number; pending: number; paidCount: number };
  toggleFeeStatus: (id: string) => void;
  toggleAllFeeStatus: () => void;
  monthlyFee: number;
  setMonthlyFee: (val: number) => void;
  msgTemplate: string;
  setMsgTemplate: (val: string) => void;
  sendFeeReminder: (trainee: Trainee) => void;
  exportFinanceExcel: () => void;
  copyBankInfo: () => void;
  bankInfo: { bankName: string; accNum: string; holder: string };
}

export default function FinanceModal({
  onClose,
  lang,
  t,
  financeMonth,
  setFinanceMonth,
  financeSearchTerm,
  setFinanceSearchTerm,
  financeFiltered,
  financeSummary,
  toggleFeeStatus,
  toggleAllFeeStatus,
  monthlyFee,
  setMonthlyFee,
  msgTemplate,
  setMsgTemplate,
  sendFeeReminder,
  exportFinanceExcel,
  copyBankInfo,
  bankInfo,
}: FinanceModalProps) {
  return (
    <div className="fixed inset-0 z-[10002] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm fade-in">
      <div 
        className="bg-zinc-900 w-full max-w-lg rounded-3xl border border-yellow-600 shadow-2xl p-6 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4 shrink-0">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 uppercase">
            <Landmark className="w-5 h-5 text-yellow-500 animate-bounce" />
            {t('finTitle')}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-zinc-800 rounded-full transition-all">
            <X className="w-6 h-6 text-zinc-500 hover:text-white" />
          </button>
        </div>

        {/* Bank transfer info card with copy */}
        <div className="bg-yellow-900/10 border border-yellow-800/40 p-4 rounded-2xl mb-4 flex justify-between items-center relative group shrink-0">
          <div className="text-xs text-yellow-200">
            <p className="font-black text-xs uppercase tracking-widest text-yellow-500 mb-1">{bankInfo.bankName}</p>
            <p className="font-mono text-yellow-400 text-base font-black my-1 select-all">{bankInfo.accNum}</p>
            <p className="text-[10px] uppercase font-bold tracking-wider opacity-70">{bankInfo.holder}</p>
          </div>
          <button 
            onClick={copyBankInfo} 
            className="bg-yellow-500/10 hover:bg-yellow-500 hover:text-black border border-yellow-500/20 px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Copy className="w-3.5 h-3.5" />
            {t('finCopy')}
          </button>
        </div>

        {/* Finance statistics layout */}
        <div className="grid grid-cols-2 gap-3 mb-4 shrink-0">
          <div className="bg-emerald-950/20 border border-emerald-800/30 p-3 rounded-2xl flex flex-col items-center shadow-lg">
            <span className="text-[10px] text-emerald-400 uppercase font-black tracking-widest mb-1">{t('finTotal')}</span>
            <span className="text-xl font-black text-white">RM {financeSummary.total}</span>
            <span className="text-[10px] font-bold text-zinc-500 mt-1">({financeSummary.paidCount} PAID)</span>
          </div>
          <div className="bg-red-950/20 border border-red-800/30 p-3 rounded-2xl flex flex-col items-center shadow-lg">
            <span className="text-[10px] text-red-400 uppercase font-black tracking-widest mb-1">{t('finPending')}</span>
            <span className="text-xl font-black text-white">RM {financeSummary.pending}</span>
            <span className="text-[10px] font-bold text-zinc-500 mt-1">({financeFiltered.length - financeSummary.paidCount} UNPAID)</span>
          </div>
        </div>

        {/* Live Search and Date Inputs */}
        <div className="mb-3 shrink-0 grid grid-cols-3 gap-2">
          <div className="col-span-2">
            <input 
              className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl text-xs px-3 py-2.5 text-white focus:border-yellow-500 outline-none font-bold" 
              placeholder={t('finSearch')} 
              value={financeSearchTerm} 
              onChange={e => setFinanceSearchTerm(e.target.value)} 
            />
          </div>
          <div>
            <input 
              type="month" 
              className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl text-xs px-2 py-2 text-white outline-none focus:border-yellow-500 font-bold" 
              value={financeMonth} 
              onChange={e => setFinanceMonth(e.target.value)} 
            />
          </div>
        </div>

        {/* Toggle selectors / Select all */}
        <div className="flex justify-between items-center mb-3 px-1 shrink-0">
          <span className="text-xs text-zinc-500 uppercase font-bold">List Size: {financeFiltered.length}</span>
          <button 
            onClick={toggleAllFeeStatus} 
            className="text-[10px] text-indigo-400 hover:text-indigo-300 font-black border border-indigo-500/20 hover:border-indigo-500/50 px-3 py-1.5 rounded-full uppercase"
          >
            {t('finToggleAll')}
          </button>
        </div>

        {/* Global fee config and message template selection */}
        <div className="flex gap-2 mb-4 shrink-0 font-sans uppercase">
          <div className="flex-1 flex justify-between items-center bg-zinc-950 border border-zinc-800 px-3 py-2 rounded-xl">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{t('finFee')}</span>
            <div className="flex items-center gap-1">
              <span className="text-xs text-zinc-400 font-mono">RM</span>
              <input 
                type="number" 
                className="w-16 bg-black text-white text-right text-sm px-1.5 py-0.5 rounded border border-zinc-800 focus:border-yellow-500 outline-none font-mono font-bold" 
                value={monthlyFee} 
                onChange={e => setMonthlyFee(parseInt(e.target.value) || 0)} 
              />
            </div>
          </div>
          <select 
            className="w-[45%] bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-300 text-[10px] font-bold px-3 py-2 outline-none uppercase" 
            value={msgTemplate} 
            onChange={(e) => setMsgTemplate(e.target.value)}
          >
            <option value="gentle">🌸 Remind: Gentle</option>
            <option value="friendly">🤝 Remind: Friendly</option>
            <option value="soft">🍃 Remind: Soft</option>
            <option value="formal">👔 Remind: Formal</option>
          </select>
        </div>

        {/* Fee entries scroll area */}
        <div className="flex-1 overflow-y-auto space-y-2 mb-4 pr-1 no-scrollbar border-t border-zinc-800/50 pt-2">
          {financeFiltered.map(trainee => { 
            const isPaid = trainee.feeHistory && trainee.feeHistory[financeMonth]; 
            return (
              <div key={trainee.id} className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-950/20 hover:border-zinc-700/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${isPaid ? 'bg-emerald-600 text-white' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                    {isPaid ? <Check className="w-4.5 h-4.5" /> : "RM"}
                  </div>
                  <div className="leading-none uppercase">
                    <p className="text-sm font-black text-white">{trainee.name}</p>
                    <p className="text-[9px] text-zinc-500 tracking-wider font-bold mt-1 text-left">{trainee.team}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => sendFeeReminder(trainee)} 
                    className="w-8 h-8 rounded-xl bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white flex items-center justify-center active:scale-90 transition-all border border-[#25D366]/20 shadow-lg shadow-[#25D366]/5"
                    title="Send WhatsApp Reminder"
                  >
                    <MessageIcon className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => toggleFeeStatus(trainee.id)} 
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all border ${isPaid ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-950/20' : 'bg-transparent border-zinc-700 text-zinc-400 hover:border-yellow-500 hover:text-yellow-500'}`}
                  >
                    {isPaid ? t('common', 'paid') : t('common', 'unpaid')}
                  </button>
                </div>
              </div>
            ); 
          })}
          {financeFiltered.length === 0 && (
            <p className="text-center font-bold text-xs py-10 opacity-40 italic">{t('noData')}</p>
          )}
        </div>

        {/* Footer Actions */}
        <button 
          onClick={exportFinanceExcel} 
          className="w-full shrink-0 py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-2xl border border-zinc-700 flex items-center justify-center gap-2 active:scale-95 transition-all uppercase text-xs tracking-wider"
        >
          <FileSpreadsheet className="w-4 h-4 text-yellow-500" />
          {t('finExport')}
        </button>
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
