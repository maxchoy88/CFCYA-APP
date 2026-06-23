import React, { useState } from 'react';
import { CloudConfig, ImgConfig } from '../types';
import { X, Cloud, Image, Download, Upload, Trash2, Key, Layers, RefreshCw } from 'lucide-react';

interface DataToolsModalProps {
  onClose: () => void;
  lang: string;
  t: (k: string, sk?: string) => string;
  cloudConfig: CloudConfig;
  setCloudConfig: React.Dispatch<React.SetStateAction<CloudConfig>>;
  isCloudConnected: boolean;
  cloudStatus: string;
  imgConfig: ImgConfig;
  setImgConfig: React.Dispatch<React.SetStateAction<ImgConfig>>;
  isImgCloudReady: boolean;
  setIsImgCloudReady: (val: boolean) => void;
  handleBackupToDrive: () => void;
  handleImportFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleManualPush: () => Promise<void>;
  handleManualPull: () => void;
  createCloudBin: () => Promise<void>;
  handleDisconnect: () => void;
  testCloudinary: () => Promise<void>;
  saveImgConfig: () => void;
  backupInputRef: React.RefObject<HTMLInputElement | null>;
}

export default function DataToolsModal({
  onClose,
  lang,
  t,
  cloudConfig,
  setCloudConfig,
  isCloudConnected,
  cloudStatus,
  imgConfig,
  setImgConfig,
  isImgCloudReady,
  setIsImgCloudReady,
  handleBackupToDrive,
  handleImportFile,
  handleManualPush,
  handleManualPull,
  createCloudBin,
  handleDisconnect,
  testCloudinary,
  saveImgConfig,
  backupInputRef,
}: DataToolsModalProps) {
  const [activeTab, setActiveTab] = useState<'cloud' | 'local' | 'cloudinary'>('cloud');

  return (
    <div 
      className="fixed inset-0 z-[10002] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-zinc-900 w-full max-w-md rounded-3xl border border-zinc-800 shadow-2xl p-6 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 shrink-0">
          <h2 className="text-xl font-bold text-white uppercase flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-500 animate-pulse" />
            {t('backupTools')}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-zinc-800 rounded-full transition-all">
            <X className="w-6 h-6 text-zinc-500 hover:text-white" />
          </button>
        </div>

        {/* Tab selections */}
        <div className="flex bg-zinc-950 p-1 rounded-2xl mb-6 border border-zinc-800 shrink-0 shadow-inner">
          <button 
            onClick={() => setActiveTab('cloud')}
            className={`flex-grow py-2.5 text-xs font-bold rounded-xl transition-all uppercase ${activeTab === 'cloud' ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-500'}`}
          >
            云端 Sync
          </button>
          <button 
            onClick={() => setActiveTab('local')}
            className={`flex-grow py-2.5 text-xs font-bold rounded-xl transition-all uppercase ${activeTab === 'local' ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-500'}`}
          >
            本地 Local
          </button>
          <button 
            onClick={() => setActiveTab('cloudinary')}
            className={`flex-grow py-2.5 text-xs font-bold rounded-xl transition-all uppercase ${activeTab === 'cloudinary' ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-500'}`}
          >
            图床 Image
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar pr-1 pb-2">
          {activeTab === 'cloud' && (
            <div className="space-y-4">
              <p className="text-xs text-zinc-400 leading-relaxed uppercase tracking-wider">{t('cloudDesc')}</p>
              
              <div className="bg-black p-3 rounded-xl border border-zinc-800 shrink-0">
                <label className="text-[10px] text-zinc-500 block mb-1 font-black uppercase tracking-widest">{t('cloud', 'key')}</label>
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-zinc-600" />
                  <input 
                    className="w-full bg-transparent text-white outline-none font-mono text-sm" 
                    placeholder="X-Master-Key" 
                    value={cloudConfig.key} 
                    onChange={(e) => setCloudConfig({ ...cloudConfig, key: e.target.value })} 
                  />
                </div>
              </div>

              <div className="bg-black p-3 rounded-xl border border-zinc-800 shrink-0">
                <label className="text-[10px] text-zinc-500 block mb-1 font-black uppercase tracking-widest">{t('cloud', 'bin')}</label>
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-zinc-600" />
                  <input 
                    className="w-full bg-transparent text-white outline-none font-mono text-sm" 
                    placeholder="Bin ID" 
                    value={cloudConfig.binId} 
                    onChange={(e) => setCloudConfig({ ...cloudConfig, binId: e.target.value })} 
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  onClick={handleManualPull} 
                  className="flex-1 py-3.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-2xl text-xs uppercase flex flex-col items-center gap-1 active:scale-95 transition-all shadow-lg"
                >
                  <Download className="w-4 h-4" />
                  {lang === 'zh' ? '加载云端 Pull' : 'Pull from Cloud'}
                </button>
                <button 
                  onClick={handleManualPush} 
                  className="flex-1 py-3.5 bg-blue-700 hover:bg-blue-600 text-white font-bold rounded-2xl text-xs uppercase flex flex-col items-center gap-1 active:scale-95 transition-all shadow-lg"
                >
                  <Upload className="w-4 h-4" />
                  {lang === 'zh' ? '上传云端 Push' : 'Push to Cloud'}
                </button>
              </div>

              <div className="flex gap-2 pt-1 border-t border-zinc-800 mt-4">
                <button 
                  onClick={createCloudBin} 
                  className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-black rounded-xl border border-zinc-700 uppercase tracking-wider active:scale-95 transition-all"
                >
                  {t('cloudCreate')}
                </button>
                {isCloudConnected && (
                  <button 
                    onClick={handleDisconnect} 
                    className="flex-1 py-3 bg-red-950/40 hover:bg-red-950/60 text-red-400 text-xs font-black rounded-xl border border-red-500/20 uppercase tracking-wider active:scale-95 transition-all"
                  >
                    断开 Disconnect
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === 'local' && (
            <div className="space-y-4">
              <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 flex flex-col gap-3">
                <h3 className="text-zinc-200 font-bold uppercase text-xs flex items-center gap-2">
                  <Download className="w-4 h-4 text-emerald-500" />
                  下载备份 Backup Data
                </h3>
                <p className="text-[11px] text-zinc-500 uppercase leading-relaxed">{t('exportDesc')}</p>
                <button 
                  onClick={handleBackupToDrive} 
                  className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 border border-emerald-500 active:scale-95 transition-all"
                >
                  <Download className="w-4.5 h-4.5" />
                  {t('backupToDrive')}
                </button>
              </div>

              <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 flex flex-col gap-3">
                <h3 className="text-zinc-200 font-bold uppercase text-xs flex items-center gap-2">
                  <Upload className="w-4 h-4 text-indigo-500" />
                  恢复数据 Restore Data
                </h3>
                <p className="text-[11px] text-zinc-500 uppercase leading-relaxed">{t('restoreDesc')}</p>
                <button 
                  className="w-full py-3.5 bg-zinc-800 hover:bg-zinc-700 text-indigo-400 border border-indigo-900/50 rounded-xl font-bold text-sm shadow-lg transition flex items-center justify-center gap-2 active:scale-95"
                  onClick={() => backupInputRef.current?.click()}
                >
                  <Upload className="w-4.5 h-4.5" />
                  {t('selectFile')}
                </button>
                <input 
                  type="file" 
                  ref={backupInputRef} 
                  className="hidden" 
                  accept=".json" 
                  onChange={handleImportFile} 
                />
              </div>
            </div>
          )}

          {activeTab === 'cloudinary' && (
            <div className="space-y-4">
              <label className="text-sm text-indigo-400 font-bold flex items-center gap-2 uppercase tracking-wide">
                <Image className="w-5 h-5 text-indigo-500" />
                {t('imgCloudSetup')}
              </label>
              <p className="text-xs text-zinc-500 leading-relaxed uppercase">{t('imgCloudDesc')}</p>
              
              <div className="bg-black p-3 rounded-lg border border-zinc-700 shrink-0">
                <label className="text-xs text-zinc-500 block mb-1 font-bold uppercase">{t('imgCloudName')}</label>
                <input 
                  className="w-full bg-transparent text-white outline-none font-mono text-sm" 
                  placeholder="e.g. dxyz..." 
                  value={imgConfig.cloudName} 
                  onChange={(e) => setImgConfig({ ...imgConfig, cloudName: e.target.value })} 
                />
              </div>

              <div className="bg-black p-3 rounded-lg border border-zinc-700 shrink-0">
                <label className="text-xs text-zinc-500 block mb-1 font-bold uppercase">{t('imgUploadPreset')}</label>
                <input 
                  className="w-full bg-transparent text-white outline-none font-mono text-sm" 
                  placeholder="e.g. cfc_preset" 
                  value={imgConfig.uploadPreset} 
                  onChange={(e) => setImgConfig({ ...imgConfig, uploadPreset: e.target.value })} 
                />
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={testCloudinary} 
                  className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-xl border border-zinc-600 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-zinc-400" />
                  {t('imgTest')}
                </button>
                <button 
                  onClick={saveImgConfig} 
                  className="flex-[2] py-3 bg-blue-900/50 hover:bg-blue-800 text-blue-400 text-xs font-extrabold rounded-xl border border-blue-900/30 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <CheckIcon className="w-3.5 h-3.5" />
                  {t('imgSave')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={3}
      stroke="currentColor"
      className={props.className || 'w-4 h-4'}
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}
