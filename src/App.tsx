import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Trainee, 
  Coach, 
  Stats, 
  CloudConfig, 
  ImgConfig, 
  AttendanceRecord 
} from './types';
import PlayerCard from './components/PlayerCard';
import PlayerEditor from './components/PlayerEditor';
import AttendanceModal from './components/AttendanceModal';
import FinanceModal from './components/FinanceModal';
import CoachHubModal from './components/CoachHubModal';
import DataToolsModal from './components/DataToolsModal';
import MonthlyReportModal from './components/MonthlyReportModal';
import ImageCropper from './components/ImageCropper';

// Lucide React Icons
import { 
  Shield, 
  Search, 
  Plus, 
  FolderSync, 
  Calendar, 
  Coins, 
  Users, 
  UserPlus, 
  Settings, 
  FileSpreadsheet, 
  Cloud, 
  BookOpen, 
  UserCheck, 
  Undo2, 
  Key, 
  Globe,
  X,
  Check
} from 'lucide-react';

const MY_MASTER_KEY = "$2a$10$JuGSKsBRirNG95vYP0fbSuotikgzUSy8nphUaCtjGq0qsdCalvBo2"; 
const JSONBIN_URL = "https://api.jsonbin.io/v3/b";
const MY_CLOUD_NAME = "dtlsbbj1v"; 
const ADMIN_PIN = "1413"; 
const PRESET_YEARLY_TOTAL = 52;
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1552667466-07770ae110d0?w=400&h=400&fit=crop';
const BANK_INFO = { bankName: "OCBC BANK", accNum: "7091258844", holder: "CFC YOUTH ACADEMY SB" };

const INITIAL_TEAMS = ['DAMANSARA', 'SAN YUK', 'KHEOW BIN', 'DESAJAYA', 'ELMINA', '南洋公学', '光辉中学', '风暴竞技', '银河实验', '泰坦中学'];
const CATEGORIES = ['U8', 'U10', 'U12', 'A12'];
const POSITIONS = ['前锋 (FW)', '左边锋 (LW)', '右边锋 (RW)', '前腰 (CAM)', '中场 (CM)', '后腰 (CDM)', '后卫 (DF)', '门将 (GK)'];
const COACH_RANKS = ['Director', 'Senior', 'Junior', 'Trainee'];
const COACH_ROLES = ['Head Coach', 'Assistant', 'GK Coach', 'Admin'];

const INITIAL_TRAINEES: Trainee[] = [
  { 
    id: '1', 
    name: 'ARTHUR', 
    category: 'U12', 
    primaryPosition: '前腰 (CAM)', 
    secondaryPosition: '中场 (CM)', 
    team: 'DAMANSARA', 
    parentName: 'Uther Pendragon', 
    phone: '0123456789', 
    email: 'uther@camelot.com', 
    tin: 'TIN-001',
    stats: { pace: 75, shooting: 82, passing: 95, dribbling: 85, defending: 60, physical: 70 }, 
    image: DEFAULT_IMAGE, 
    attendance: 0, 
    attendanceHistory: [], 
    feeHistory: {},
    height: '155', 
    weight: '45'
  }
];

const INITIAL_COACHES: Coach[] = [
  { id: 'c1', name: 'Coach Mourinho', role: 'Head Coach', rank: 'Director', rate: 200, phone: '60123456789', attendanceHistory: [], paymentHistory: {} },
  { id: 'c2', name: 'Coach Pep', role: 'Assistant', rank: 'Senior', rate: 150, phone: '60198765432', attendanceHistory: [], paymentHistory: {} }
];

const DEFAULT_FORM_DATA = { 
  name: '', 
  team: '', 
  category: '', 
  primaryPosition: '前腰 (CAM)', 
  secondaryPosition: '无',
  parentName: '', 
  phone: '', 
  email: '', 
  tin: '',
  stats: { pace: 50, shooting: 50, passing: 50, dribbling: 50, defending: 50, physical: 50 }, 
  image: DEFAULT_IMAGE,
  height: '', 
  weight: '',
  attendanceHistory: [],
  attendedSessions: 0,
  totalSessions: PRESET_YEARLY_TOTAL,
  coachComment: ''
};

const TRANSLATIONS: Record<string, Record<string, any>> = {
  zh: {
    appTitle: "CFC YOUTH ACADEMY", localMode: "本地版", cloudMode: "云端同步",
    attendanceTool: "出席库", financeTool: "财务", register: "注册", coachTool: "教练", backupTools: "备份",
    manageSchools: "学校", addSchool: "增加新学校", coachDetails: "查看明细",
    auth: { welcome: "YOUR FUTURE IS NOW!", adminMode: "MASTER MODE", userMode: "PLAYER MODE", enterPin: "请输入管理员密码", wrongPin: "密码错误" },
    alerts: { deleteConfirm: "确定要删除吗？", updated: "✅ 数据已同步！", resetConfirm: "确定重置统计数据吗？", linkCopied: "链接已复制！", fileError: "文件解析失败", copied: "已复制", renamePrompt: "请输入新日期 (YYYY-MM-DD):" },
    stats: { pace: "速度", shooting: "射门", passing: "传球", dribbling: "盘带", defending: "防守", physical: "体能" },
    msgTemplates: { gentle: "Gentle Reminder", friendly: "Friendly Tone", soft: "Soft Reminder", formal: "Formal Notice" },
    msgs: {
      gentle: "Hi Parents 👋, just a gentle reminder that {name}'s {month} fees (RM{amount}) are pending. Please arrange payment when convenient. Thank you for your support! 🙏🏻",
      friendly: "Hello! 👋 Just a quick note regarding {name}'s {month} fees (RM{amount}). If you've already paid, please ignore this. Thanks! ⚽️",
      soft: "Hi Parents 😊, hope you're well! Just checking on {name}'s {month} fees (RM{amount}). Please settle it when you have a moment. Thanks! ✨",
      formal: "【CFC FINANCE】Dear Parent, please be informed that {name}'s fees for {month} (RM{amount}) are due. Please arrange for payment. Thank you."
    },
    bankDetails: "\n\n🏦 汇款资料:\n{bankName}\n{accNum}\n{holder}\n\n汇款后请发收据，谢谢！",
    common: { name: "姓名", age: "年龄", nationality: "国籍", school: "学校", category: "组别", phone: "电话", email: "电邮", tin: "TIN", cancel: "取消", save: "保存", confirm: "确认", paid: "已交", unpaid: "未交", parent: "家长", secPos: "副位置", all: "全部", comment: "教练评语", generate: "AI生成", role: "角色", rank: "等级", rate: "课时费", sessionUnit: "节", unknown: "未知", attendanceRate: "出席率", attendedCount: "次数", totalCycle: "总次数", attHistory: "考勤记录", addDate: "补录日期", lastAtt: "最后出席", monthlySummary: "月度考勤概览", reportTitle: "月度考勤报表", height: "身高 (cm)", weight: "体重 (kg)" },
    player: { title: "球员资料" },
    coach: { list: "名单", attendance: "考勤", finance: "薪资", register: "注册教练", update: "更新资料", sessions: "课时" },
    coachTotalPayout: "本月总支出", coachExport: "导出薪资单",
    cloud: { setup: "云端设置", key: "Master Key", bin: "Bin ID", connect: "连接云端", create: "创建新库" },
    cloudDesc: "输入 JSONBin.io 的 Key 和 Bin ID 以启用多设备同步。",
    cloudCreate: "一键创建新数据库",
    imgCloudSetup: "图片云设置", imgCloudDesc: "连接 Cloudinary 以节省空间", imgCloudName: "Cloud Name", imgUploadPreset: "Upload Preset", imgTest: "测试", imgSave: "保存",
    attTitle: "考勤打卡", attTabTrainees: "球员", attTabCoaches: "教练", attPaste: "粘贴名单", attPlaceholder: "粘贴包含姓名的文本...", attPasteDesc: "识别名单", attSearch: "搜索人员...", attToggleAll: "全选/反选", attConfirm: "提交考勤", attExcel: "导出单日表", attHistoryFull: "导出完整历史", attMonthly: "导出月度报表", attWhatsapp: "分享到WhatsApp",
    finTitle: "财务管理", finCopy: "复制账户", finTotal: "总收入", finPending: "待收取", finSearch: "搜索...", finToggleAll: "一键全选/反选", finFee: "月费", finPaid: "已付", finUnpaid: "未付", finRemind: "发送提醒", finExport: "导出报表",
    backupToDrive: "备份数据", exportDesc: "下载 JSON 文件以防数据丢失", restoreData: "恢复数据", restoreDesc: "上传 JSON 文件覆盖当前数据", selectFile: "选择文件", dataSafe: "数据仅保存在本地或您指定的云端",
    copyLink: "复制链接分享", noData: "暂无数据"
  },
  en: {
    appTitle: "CFC YOUTH ACADEMY", systemName: "ACADEMY SYSTEM", localMode: "Local", cloudMode: "Cloud Sync",
    backupRestore: "Backup", manageSchools: "Schools", attendanceTool: "Attendance", financeTool: "Finance",
    register: "Register", searchPlaceholder: "Search...", noData: "No Data",
    auth: { welcome: "YOUR FUTURE IS NOW!", selectMode: "Select Login Mode", adminMode: "MASTER MODE", userMode: "PLAYER MODE", enterPin: "Enter Master Pin", wrongPin: "Wrong PIN" },
    alerts: { deleteConfirm: "Confirm delete?", updated: "✅ Data synced!", linkCopied: "Link copied!", copied: "Copied!" },
    stats: { pace: "Pace", shooting: "Shooting", passing: "Passing", dribbling: "Dribbling", defending: "Defending", physical: "Physical" },
    common: { name: "Name", age: "Age", nationality: "Nationality", school: "School", category: "Category", phone: "Phone", email: "Email", tin: "TIN", cancel: "Cancel", save: "Save", confirm: "Confirm", paid: "PAID", unpaid: "UNPAID", parent: "Parent", secPos: "Sub-Pos", all: "All", comment: "Comment", generate: "AI Generate", role: "Role", rank: "Rank", rate: "Rate/Session", sessionUnit: "Session", unknown: "Unknown", attendanceRate: "Attendance Rate", attendedCount: "Attended", totalCycle: "Total", attHistory: "Attendance Log", addDate: "Add Date", lastAtt: "Last Seen", monthlySummary: "Monthly Summary", reportTitle: "Monthly Report", height: "Height (cm)", weight: "Weight (kg)" },
    player: { title: "Player Profile" },
    coach: { list: "List", attendance: "Attendance", finance: "Payroll", register: "Register Coach", update: "Update Coach", sessions: "Sessions" },
    coachTotalPayout: "Total Payout", coachExport: "Export Payroll",
    cloud: { setup: "Cloud Setup", key: "Master Key", bin: "Bin ID", connect: "Connect", create: "Create New" },
    cloudDesc: "Sync data across devices using JSONBin.io",
    cloudCreate: "Create New Bin",
    imgCloudSetup: "Image Cloud", imgCloudDesc: "Cloudinary Setup", imgCloudName: "Cloud Name", imgUploadPreset: "Upload Preset", imgTest: "Test", imgSave: "Save",
    attTitle: "Attendance", attTabTrainees: "Players", attTabCoaches: "Coaches", attPaste: "Paste List", attPlaceholder: "Paste text...", attPasteDesc: "Parse", attSearch: "Search...", attToggleAll: "Select All", attConfirm: "Submit", attExcel: "Export Day CSV", attHistoryFull: "Export Full History", attMonthly: "Export Month Report", attWhatsapp: "WhatsApp",
    finTitle: "Finance", finCopy: "Copy Acc", finTotal: "Total", finPending: "Pending", finSearch: "Search...", finToggleAll: "Toggle All", finFee: "Fee", finPaid: "PAID", fontUnpaid: "UNPAID", finRemind: "Remind", finExport: "Export",
    backupToDrive: "Backup", exportDesc: "Download JSON", restoreData: "Restore", restoreDesc: "Upload JSON", selectFile: "Select File", dataSafe: "Data is local.",
    copyLink: "Copy Link", addSchool: "Add School", coachTool: "Coach", backupTools: "Backup", coachDetails: "Details"
  },
  ms: {
    appTitle: "AKADEMI BELIA CFC", localMode: "Tempatan", cloudMode: "Awan",
    attendanceTool: "Kehadiran", financeTool: "Kewangan", register: "Daftar", coachTool: "Jurulatih", backupTools: "Sandaran",
    manageSchools: "Sekolah", addSchool: "Tambah", coachDetails: "Butiran",
    auth: { welcome: "MASA DEPAN ANDA BERMULA SEKAANG!", adminMode: "MOD UTAMA", userMode: "MOD PEMAIN", enterPin: "Masukkan Pin", wrongPin: "Pin Salah" },
    alerts: { deleteConfirm: "Padam?", updated: "✅ Dikemaskini!", linkCopied: "Disalin!", imgLocalWarning: "⚠️ Gambar tempatan, sila lampirkan.", copied: "Disalin!" },
    stats: { pace: "Laju", shooting: "Tendang", passing: "Hantar", dribbling: "Gelecek", defending: "Pertahanan", physical: "Fizikal" },
    common: { name: "Nama", age: "Umur", nationality: "Warganegara", school: "Sekolah", category: "Kategori", phone: "Tel", email: "E-mel", tin: "TIN", cancel: "Batal", save: "Simpan", confirm: "Sahkan", paid: "BAYAR", unpaid: "BELUM", parent: "Ibu Bapa", secPos: "Posisi 2", all: "Semua", comment: "Komen", generate: "AI", role: "Peranan", rank: "Pangkat", rate: "Kadar", sessionUnit: "Sesi", unknown: "Tidak Diketahui", attendanceRate: "Kadar Kehadiran", attendedCount: "Hadir", totalCycle: "Jumlah", attHistory: "Rekod Kehadiran", addDate: "Tambah Tarikh", lastAtt: "Terakhir", monthlySummary: "Ringkasan Bulanan", reportTitle: "Laporan Bulanan", height: "Tinggi (cm)", weight: "Berat (kg)" },
    player: { title: "Profil Pemain" },
    coach: { list: "Senarai", attendance: "Kehadiran", finance: "Gaji", register: "Daftar Jurulatih", update: "Kemaskini", sessions: "Sesi" },
    coachTotalPayout: "Jumlah Gaji", coachExport: "Eksport Gaji",
    cloud: { setup: "Awan", key: "Kunci", bin: "ID Bin", connect: "Sambung", create: "Cipta" },
    cloudDesc: "Segerakkan data",
    cloudCreate: "Cipta Baru",
    imgCloudSetup: "Awan Imej", imgCloudDesc: "Tetapan Cloudinary", imgCloudName: "Nama Awan", imgUploadPreset: "Preset", imgTest: "Uji", imgSave: "Simpan",
    attTitle: "Kehadiran", attTabTrainees: "Pemain", attTabCoaches: "Jurulatih", attPaste: "Tampal", attPlaceholder: "Teks...", attPasteDesc: "Proses", attSearch: "Cari...", attToggleAll: "Pilih Semua", attConfirm: "Hantar", attExcel: "Eksport Hari", attHistoryFull: "Eksport Sejarah Penuh", attMonthly: "Eksport Bulanan", attWhatsapp: "WhatsApp",
    finTitle: "Kewangan", finCopy: "Salin Akaun", finTotal: "Jumlah", finPending: "Belum", finSearch: "Cari...", finToggleAll: "Pilih Semua", finFee: "Yuran", finPaid: "BAYAR", finUnpaid: "BELUM", finRemind: "Ingatkan", finExport: "Eksport",
    backupToDrive: "Sandaran", exportDesc: "Muat Turun JSON", restoreData: "Pulihkan", restoreDesc: "Muat Naik JSON", selectFile: "Pilih Fail", dataSafe: "Data tempatan.",
    copyLink: "Salin Pautan", noData: "Tiada Data"
  }
};

const getStatGrade = (v: number): string => { 
  const val = parseInt(v as any) || 0; 
  return val >= 90 ? 'S' : val >= 80 ? 'A' : val >= 70 ? 'B' : val >= 60 ? 'C' : 'D'; 
};

const getGradeColor = (g: string): string => { 
  switch(g) { 
    case 'S': return 'text-fuchsia-400 font-extrabold drop-shadow-[0_0_8px_rgba(192,38,211,0.9)]'; 
    case 'A': return 'text-emerald-400 font-black'; 
    case 'B': return 'text-blue-400 font-bold'; 
    case 'C': return 'text-yellow-400 font-bold'; 
    default: return 'text-zinc-500 font-bold'; 
  } 
};

const getAttendanceColor = (v: number): string => {
  return v >= 90 
    ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' 
    : (v >= 70 ? 'bg-yellow-500 shadow-lg shadow-yellow-500/20' : 'bg-red-500 shadow-lg shadow-red-500/20');
};

const getPositionCode = (s: string) => {
  return (s && s !== '无') ? s.match(/\((.*?)\)/)?.[1] || s.substring(0, 2) : '';
};

const getOptimizedImageUrl = (url: string) => {
  if (!url || typeof url !== 'string' || !url.includes('cloudinary.com')) {
    return url || DEFAULT_IMAGE;
  }
  return url.replace(/([^:])\/\/+/g, "$1/").replace('/upload/', '/upload/f_avif,q_auto/');
};

const safeCopy = (text: string, successMsg?: string) => {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed"; 
  textArea.style.left = "-9999px";
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand('copy');
    if (successMsg) alert(successMsg);
  } catch (err) { 
    console.error('Copy failed', err); 
  }
  document.body.removeChild(textArea);
};

export default function App() {
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null); 
  const [lang, setLang] = useState<'zh' | 'ms' | 'en'>('zh');
  const [pinInput, setPinInput] = useState("");
  const [showPinInput, setShowPinInput] = useState(false);

  const [teams, setTeams] = useState<string[]>(INITIAL_TEAMS);
  const [trainees, setTrainees] = useState<Trainee[]>([]);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [leagueName, setLeagueName] = useState('CFC YOUTH ACADEMY');
  const [appLogo, setAppLogo] = useState<string>('CFCYA LOGO.jpg');

  const [cloudConfig, setCloudConfig] = useState<CloudConfig>({ key: MY_MASTER_KEY || '', binId: '' });
  const [isCloudConnected, setIsCloudConnected] = useState(false);
  const [cloudStatus, setCloudStatus] = useState("");
  const [imgConfig, setImgConfig] = useState<ImgConfig>({ cloudName: MY_CLOUD_NAME, uploadPreset: '' });
  const [isImgCloudReady, setIsImgCloudReady] = useState(false);
  const [uploadingStatus, setUploadingStatus] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
  const [isFinanceOpen, setIsFinanceOpen] = useState(false); 
  const [isCoachOpen, setIsCoachOpen] = useState(false);
  const [isCloudModalOpen, setIsCloudModalOpen] = useState(false);
  const [isDataToolsOpen, setIsDataToolsOpen] = useState(false);
  const [isSchoolManagerOpen, setIsSchoolManagerOpen] = useState(false);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [isMonthlyReportOpen, setIsMonthlyReportOpen] = useState(false); 

  const [coachView, setCoachView] = useState('list');
  const [coachForm, setCoachForm] = useState({ name: '', phone: '', role: 'Assistant', rank: 'Junior', rate: 100 });
  const [expandedCoachId, setExpandedCoachId] = useState<string | null>(null);
  const [editingCoach, setEditingCoach] = useState<Coach | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('全部');
  const [formData, setFormData] = useState<any>(DEFAULT_FORM_DATA);
  const [editingTrainee, setEditingTrainee] = useState<Trainee | null>(null);
  const [renamingTeam, setRenamingTeam] = useState({ original: '', current: '' });

  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().slice(0, 10));
  const [attendanceList, setAttendanceList] = useState<string[]>([]);
  const [coachAttendanceList, setCoachAttendanceList] = useState<string[]>([]);
  const [attTab, setAttTab] = useState<'trainees' | 'coaches'>('trainees');
  const [importText, setImportText] = useState("");
  const [attendanceSearchTerm, setAttendanceSearchTerm] = useState('');
  
  const [reportMonth, setReportMonth] = useState(new Date().toISOString().slice(0, 7));
  const [reportSchool, setReportSchool] = useState('全部');

  const [coachAttDate, setCoachAttDate] = useState(new Date().toISOString().slice(0, 10)); 
  const [coachAttSchool, setCoachAttSchool] = useState(INITIAL_TEAMS[0]);
  const [financeMonth, setFinanceMonth] = useState(new Date().toISOString().slice(0, 7));
  const [financeSearchTerm, setFinanceSearchTerm] = useState('');
  const [monthlyFee, setMonthlyFee] = useState(60);
  const [msgTemplate, setMsgTemplate] = useState('gentle'); 

  const [tempImage, setTempImage] = useState<string | null>(null);
  const [isLogoCrop, setIsLogoCrop] = useState(false);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const backupInputRef = useRef<HTMLInputElement>(null);
  const [aiLoading, setAiLoading] = useState(false);
  
  const [historyDateInput, setHistoryDateInput] = useState('');
  const [reportDateInput, setReportDateInput] = useState('');

  const t = (k: string, sk?: string): string => {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS['zh'];
    if (sk) return dict[k]?.[sk] || (TRANSLATIONS['zh'][k]?.[sk] || k);
    return dict[k] || (TRANSLATIONS['zh'][k] || k);
  };

  const safeTrainees = useMemo(() => Array.isArray(trainees) ? trainees : [], [trainees]);
  const safeCoaches = useMemo(() => Array.isArray(coaches) ? coaches : [], [coaches]);
  const safeTeams = useMemo(() => Array.isArray(teams) ? teams : [], [teams]);

  const filteredTrainees = useMemo(() => safeTrainees.filter(tItem => {
    const searchLower = searchTerm.toLowerCase();
    const teamMatch = selectedTeam === '全部' || selectedTeam === 'All' || selectedTeam === 'Semua' || tItem.team === selectedTeam;
    const searchMatch = (tItem.name || '').toLowerCase().includes(searchLower) || 
                        (tItem.parentName || '').toLowerCase().includes(searchLower) || 
                        (tItem.phone || '').includes(searchLower);
    return teamMatch && searchMatch;
  }), [safeTrainees, selectedTeam, searchTerm]);
  
  const financeFiltered = useMemo(() => filteredTrainees.filter(tItem => 
    (tItem.name || '').toLowerCase().includes(financeSearchTerm.toLowerCase())
  ), [filteredTrainees, financeSearchTerm]);
  
  const attendanceFiltered = useMemo(() => { 
    const term = attendanceSearchTerm.toLowerCase(); 
    const sourceList = attTab === 'trainees' ? safeTrainees : safeCoaches;
    
    return sourceList.filter(item => {
      const name = item.name ? item.name.toLowerCase() : '';
      const nameMatch = name.includes(term);
      
      if (attTab === 'trainees' && selectedTeam !== '全部' && selectedTeam !== 'All' && selectedTeam !== 'Semua') {
        const trItem = item as Trainee;
        return nameMatch && trItem.team === selectedTeam;
      }
      return nameMatch;
    });
  }, [attTab, safeTrainees, safeCoaches, attendanceSearchTerm, selectedTeam]);
  
  const financeSummary = useMemo(() => { 
    const paidCount = financeFiltered.filter(tItem => tItem.feeHistory?.[financeMonth]).length; 
    return { 
      total: financeFiltered.length * monthlyFee, 
      paid: paidCount * monthlyFee, 
      pending: (financeFiltered.length - paidCount) * monthlyFee, 
      paidCount 
    }; 
  }, [financeFiltered, financeMonth, monthlyFee]);

  const payrollData = useMemo(() => {
    let total = 0;
    const list = safeCoaches.map(c => {
      const monthSessions = (c.attendanceHistory || []).filter(h => {
        const d = h.date;
        return d && d.startsWith(financeMonth);
      });
      const amount = monthSessions.length * (c.rate || 0);
      const isPaid = c.paymentHistory?.[financeMonth]?.status === 'paid';
      if (isPaid) total += amount;
      const sorted = monthSessions.map(h => ({ date: h.date, school: h.school || '' })).sort((a, b) => b.date.localeCompare(a.date));
      return { ...c, sessions: monthSessions.length, amount, isPaid, details: sorted };
    });
    return { list, total };
  }, [safeCoaches, financeMonth]);

  const monthlyGroups = useMemo(() => {
    const history = formData.attendanceHistory || [];
    const groups: Record<string, string[]> = {};
    history.forEach((h: any) => {
      const dateStr = typeof h === 'string' ? h : (h?.date || 'N/A');
      if (dateStr === 'N/A') return;
      const month = dateStr.slice(0, 7); 
      if (!groups[month]) groups[month] = [];
      groups[month].push(dateStr);
    });
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [formData.attendanceHistory]);

  const reportData = useMemo(() => {
    const targetSchool = reportSchool === '全部' || reportSchool === 'All' || reportSchool === 'Semua' ? 'All' : reportSchool;
    const list = safeTrainees; 
    
    const filteredList = list.filter(p => targetSchool === 'All' || p.team === targetSchool);

    const allDates = new Set<string>();
    filteredList.forEach(item => {
      (item.attendanceHistory || []).forEach(h => {
        if (!h) return;
        const d = (typeof h === 'string' ? h : h.date);
        if (d && d.startsWith(reportMonth)) allDates.add(d);
      });
    });
    const sortedDates = Array.from(allDates).sort();

    const rows = filteredList.map(item => {
      const history = item.attendanceHistory || [];
      const presentDates = new Set(history.map(h => {
        if (!h) return '';
        return (typeof h === 'string' ? h : h.date);
      }));
      let count = 0;
      sortedDates.forEach(date => { if (presentDates.has(date)) count++; });
      const totalDays = sortedDates.length || 1;
      const percentage = Math.round((count / totalDays) * 100);
      return { 
        name: item.name, 
        category: item.category, 
        team: item.team, 
        count, 
        percentage, 
        id: item.id, 
        attendanceHistory: item.attendanceHistory 
      };
    });

    rows.sort((a, b) => b.percentage - a.percentage);

    return { dates: sortedDates, list: rows, targetSchool }; 
  }, [reportMonth, reportSchool, safeTrainees]);


  const updateData = (newData: Partial<{ trainees: Trainee[]; coaches: Coach[]; leagueName: string; appLogo: string; teams: string[] }>) => {
    const updated = {
      trainees: newData.trainees !== undefined ? newData.trainees : trainees,
      coaches: newData.coaches !== undefined ? newData.coaches : coaches,
      leagueName: newData.leagueName !== undefined ? newData.leagueName : leagueName,
      appLogo: newData.appLogo !== undefined ? newData.appLogo : appLogo,
      teams: newData.teams !== undefined ? newData.teams : teams
    };
    
    setTrainees(updated.trainees); 
    setCoaches(updated.coaches); 
    
    if (updated.appLogo !== undefined) {
      setAppLogo(updated.appLogo);
      document.querySelectorAll("link[rel='icon'], link[rel='apple-touch-icon']").forEach(link => {
        (link as HTMLLinkElement).href = updated.appLogo;
      });
    }

    setLeagueName(updated.leagueName); 
    setTeams(updated.teams);
    
    localStorage.setItem('cfc_local_db', JSON.stringify(updated));
    if (isCloudConnected) syncToCloud(updated);
  };

  const syncFromCloud = async (key: string, binId: string) => {
    setCloudStatus("⏳");
    try {
      const res = await fetch(`${JSONBIN_URL}/${binId}/latest`, { headers: { 'X-Master-Key': key } });
      if (res.ok) {
        const json = await res.json();
        updateData(json.record); 
        setIsCloudConnected(true); 
        setCloudStatus("✅");
      }
    } catch (e) { 
      setCloudStatus("❌"); 
    }
  };

  const syncToCloud = async (data: any) => {
    if (!isCloudConnected || !cloudConfig.binId) return;
    try {
      const stripped = { 
        ...data, 
        trainees: data.trainees.map((tItem: any) => tItem.image.startsWith('data:') ? { ...tItem, image: DEFAULT_IMAGE } : tItem) 
      };
      await fetch(`${JSONBIN_URL}/${cloudConfig.binId}`, {
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json', 'X-Master-Key': cloudConfig.key },
        body: JSON.stringify(stripped)
      });
    } catch (e) {}
  };

  const uploadToCloudinary = async (base64: string) => {
    if (!imgConfig.cloudName || !imgConfig.uploadPreset) return null;
    setUploadingStatus("☁️");
    const url = `https://api.cloudinary.com/v1_1/${imgConfig.cloudName}/image/upload`;
    const fd = new FormData();
    fd.append('file', base64); 
    fd.append('upload_preset', imgConfig.uploadPreset);
    try {
      const response = await fetch(url, { method: 'POST', body: fd });
      const data = await response.json();
      setUploadingStatus("");
      return data.secure_url;
    } catch (error) { 
      setUploadingStatus("❌"); 
      return null; 
    }
  };

  const handleLogin = (role: 'admin' | 'user') => {
    if (role === 'admin') {
      if (pinInput === ADMIN_PIN) { 
        setUserRole('admin'); 
        setPinInput(""); 
        setShowPinInput(false); 
      } else { 
        alert(t('auth', 'wrongPin')); 
        setPinInput(""); 
      }
    } else {
      setUserRole('user');
    }
  };

  useEffect(() => {
    if (pinInput.length === 4 && showPinInput) {
      const timer = setTimeout(() => {
        if (pinInput === ADMIN_PIN) {
          setUserRole('admin');
          setPinInput("");
          setShowPinInput(false);
        } else {
          alert(t('auth', 'wrongPin'));
          setPinInput("");
        }
      }, 100); 
      return () => clearTimeout(timer);
    }
  }, [pinInput, showPinInput]);

  const handleRegister = () => { 
    setEditingTrainee(null); 
    setFormData({ ...DEFAULT_FORM_DATA, totalSessions: PRESET_YEARLY_TOTAL }); 
    setIsModalOpen(true); 
  };

  const handleEdit = (tItem: Trainee) => { 
    setEditingTrainee(tItem); 
    setFormData({ 
      ...tItem, 
      totalSessions: tItem.totalSessions || PRESET_YEARLY_TOTAL, 
      attendedSessions: tItem.attendedSessions || (tItem.attendanceHistory ? tItem.attendanceHistory.length : 0),
      coachComment: tItem.coachComment || ''
    }); 
    setIsModalOpen(true); 
  };
  
  const openAttendanceModal = () => {
    const today = new Date().toISOString().slice(0, 10);
    setAttendanceDate(today);
    setAttTab('trainees');
    setIsAttendanceOpen(true); 
  };

  const handleSaveTrainee = () => {
    if (!formData.name) return;
    let history = [...(formData.attendanceHistory || [])];
    history.sort((a, b) => {
      const dateA = typeof a === 'string' ? a : a.date;
      const dateB = typeof b === 'string' ? b : b.date;
      return dateB.localeCompare(dateA); 
    });

    const finalTotal = formData.totalSessions || PRESET_YEARLY_TOTAL;
    const finalAttended = formData.attendedSessions || 0;
    const finalRate = Math.round((finalAttended / finalTotal) * 100);
    
    const data = { 
      ...formData, 
      name: formData.name.toUpperCase(), 
      image: formData.image || DEFAULT_IMAGE, 
      attendance: finalRate,
      attendanceHistory: history 
    };
    let newTrainees = editingTrainee 
      ? trainees.map(tItem => tItem.id === editingTrainee.id ? { ...data, id: tItem.id } : tItem)
      : [{ ...data, id: Date.now().toString(), attendanceHistory: [], feeHistory: {} }, ...trainees];
    updateData({ trainees: newTrainees }); 
    setIsModalOpen(false);
  };

  const deleteTrainee = (id: string) => { 
    if (confirm(t('alerts', 'deleteConfirm'))) {
      updateData({ trainees: trainees.filter(tItem => tItem.id !== id) }); 
    }
  };

  const handleAddTeam = () => { 
    const nt = [...teams, `New School ${teams.length + 1}`]; 
    setTeams(nt); 
    updateData({ teams: nt }); 
  };

  const handleRenameTeam = (old: string) => { 
    const n = renamingTeam.current.trim(); 
    if (!n || n === old) return setRenamingTeam({ original: '', current: '' });
    const nt = teams.map(tItem => tItem === old ? n : tItem); 
    const ntr = trainees.map(tr => tr.team === old ? { ...tr, team: n } : tr);
    updateData({ teams: nt, trainees: ntr }); 
    setRenamingTeam({ original: '', current: '' }); 
  };

  const handleDeleteTeam = (n: string) => { 
    if (confirm(`${t('alerts', 'deleteConfirm')} ${n}?`)) { 
      const nt = teams.filter(tItem => tItem !== n); 
      const ntr = trainees.map(tr => tr.team === n ? { ...tr, team: 'Free Agent' } : tr); 
      updateData({ teams: nt, trainees: ntr }); 
    } 
  };

  const addHistoryRecord = () => {
    if (!historyDateInput) return;
    const list = [...(formData.attendanceHistory || [])];
    const exists = list.some(h => (typeof h === 'string' ? h : h.date) === historyDateInput);
    if (exists) return alert("Date already exists!");
    
    list.push({ date: historyDateInput, status: 'present' });
    list.sort((a, b) => {
      const dateA = typeof a === 'string' ? a : a.date;
      const dateB = typeof b === 'string' ? b : b.date;
      return dateB.localeCompare(dateA);
    });
    
    setFormData({ 
      ...formData, 
      attendanceHistory: list, 
      attendedSessions: (formData.attendedSessions || 0) + 1 
    });
    setHistoryDateInput('');
  };

  const removeHistoryDate = (dateToRemove: string) => {
    if (!confirm(t('alerts', 'deleteConfirm'))) return;
    const list = (formData.attendanceHistory || []).filter(h => {
         const d = typeof h === 'string' ? h : h.date;
         return d !== dateToRemove;
    });
    setFormData({ 
      ...formData, 
      attendanceHistory: list, 
      attendedSessions: Math.max(0, (formData.attendedSessions || 1) - 1) 
    });
  };

  const toggleQuickAttendance = (e: React.MouseEvent, player: Trainee) => {
    e.stopPropagation(); 
    if (userRole !== 'admin') return;

    const today = new Date().toISOString().slice(0, 10);
    let history = Array.isArray(player.attendanceHistory) ? [...player.attendanceHistory] : [];
    const exists = history.some(h => (typeof h === 'string' ? h : h.date) === today);
    
    let currentCount = player.attendedSessions !== undefined ? player.attendedSessions : history.length;

    if (exists) {
      history = history.filter(h => (typeof h === 'string' ? h : h.date) !== today);
      currentCount = Math.max(0, currentCount - 1);
    } else {
      history.push({ date: today, status: 'present' });
      currentCount++;
    }

    const total = player.totalSessions || PRESET_YEARLY_TOTAL;
    const newRate = Math.min(100, Math.round((currentCount / total) * 100));

    const updatedPlayer = { 
      ...player, 
      attendance: newRate, 
      attendanceHistory: history, 
      attendedSessions: currentCount 
    };

    const newTrainees = trainees.map(tItem => tItem.id === player.id ? updatedPlayer : tItem);
    updateData({ trainees: newTrainees });
  };

  const handleEditCoach = (c: Coach) => {
    setEditingCoach(c);
    setCoachForm({ 
      name: c.name, 
      phone: c.phone, 
      role: c.role || 'Assistant', 
      rank: c.rank || 'Junior', 
      rate: c.rate || 100 
    });
  };

  const cancelEditCoach = () => {
    setEditingCoach(null);
    setCoachForm({ name: '', phone: '', role: 'Assistant', rank: 'Junior', rate: 100 });
  };

  const saveCoach = () => {
    if (!coachForm.name) return;
    let newCoaches;
    const upperName = coachForm.name.toUpperCase();
    const formWithUpperName = { ...coachForm, name: upperName };

    if (editingCoach) {
      newCoaches = coaches.map(c => c.id === editingCoach.id ? { ...c, ...formWithUpperName, id: c.id, attendanceHistory: c.attendanceHistory, paymentHistory: c.paymentHistory } : c);
    } else {
      newCoaches = [...coaches, { ...formWithUpperName, id: Date.now().toString(), attendanceHistory: [], paymentHistory: {} }];
    }
    updateData({ coaches: newCoaches });
    cancelEditCoach();
  };

  const deleteCoach = (id: string) => { 
    if (!confirm("Delete Coach?")) return; 
    updateData({ coaches: coaches.filter(c => c.id !== id) }); 
  };

  const removeCoachRecord = (coachId: string, dateToRemove: string, schoolToRemove: string) => {
    if (!confirm(`Delete record?`)) return;
    const newCoaches = coaches.map(c => {
      if (c.id === coachId) {
        const newHistory = (c.attendanceHistory || []).filter(h => {
          const hDate = h.date;
          const hSchool = h.school || '';
          return !(hDate === dateToRemove && (hSchool === schoolToRemove || (schoolToRemove === '' && hSchool === '')));
        });
        return { ...c, attendanceHistory: newHistory };
      }
      return c;
    });
    updateData({ coaches: newCoaches });
  };

  const toggleCoachPayment = (id: string) => {
    const newCoaches = coaches.map(c => {
      if (c.id === id) {
        const history = c.paymentHistory || {};
        const isPaid = history[financeMonth]?.status === 'paid';
        return { ...c, paymentHistory: { ...history, [financeMonth]: { status: isPaid ? 'unpaid' : 'paid' } } };
      }
      return c;
    });
    updateData({ coaches: newCoaches });
  };

  const toggleCoachAttendance = (id: string) => {
    const newCoaches = coaches.map(c => {
      if (c.id === id) {
        const history = c.attendanceHistory || [];
        const exists = history.some(h => h.date === coachAttDate && h.school === coachAttSchool);
        const newHistory = exists ? history.filter(h => !(h.date === coachAttDate && h.school === coachAttSchool)) : [...history, { date: coachAttDate, school: coachAttSchool }];
        return { ...c, attendanceHistory: newHistory };
      }
      return c;
    });
    updateData({ coaches: newCoaches });
  };

  const toggleAttendance = (id: string) => {
    if (attTab === 'trainees') {
      setAttendanceList(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    } else {
      setCoachAttendanceList(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    }
  };

  const submitAttendance = () => {
    const newTrainees = trainees.map(tItem => {
      let history = Array.isArray(tItem.attendanceHistory) ? [...tItem.attendanceHistory] : [];
      history = history.filter(h => (typeof h === 'string' ? h : h.date) !== attendanceDate);
      
      if (attendanceList.includes(tItem.id)) {
        history.push({ date: attendanceDate, status: 'present' });
      } 
      
      history.sort((a, b) => {
        const dateA = typeof a === 'string' ? a : a.date;
        const dateB = typeof b === 'string' ? b : b.date;
        return dateB.localeCompare(dateA); 
      });

      const customTotal = tItem.totalSessions || PRESET_YEARLY_TOTAL;
      const actualCount = history.length;
      const rate = Math.round((actualCount / customTotal) * 100);
      
      return { 
        ...tItem, 
        attendance: rate, 
        attendanceHistory: history, 
        attendedSessions: actualCount
      };
    });

    const newCoaches = coaches.map(c => {
      let history = Array.isArray(c.attendanceHistory) ? [...c.attendanceHistory] : [];
      history = history.filter(h => h.date !== attendanceDate);
      
      if (coachAttendanceList.includes(c.id)) {
        history.push({ date: attendanceDate, school: teams[0] });
      }
      return { ...c, attendanceHistory: history };
    });

    updateData({ trainees: newTrainees, coaches: newCoaches }); 
    setIsAttendanceOpen(false); 
    alert("Saved successfully!");
  };

  const toggleReportAttendance = (playerId: string, date: string) => {
    const newTrainees = trainees.map(tItem => {
      if (tItem.id !== playerId) return tItem;

      let history = [...(tItem.attendanceHistory || [])];
      const exists = history.some(h => (typeof h === 'string' ? h : h.date) === date);

      if (exists) {
        history = history.filter(h => (typeof h === 'string' ? h : h.date) !== date);
      } else {
        history.push({ date, status: 'present' });
      }

      history.sort((a, b) => {
        const dateA = typeof a === 'string' ? a : a.date;
        const dateB = typeof b === 'string' ? b : b.date;
        return dateB.localeCompare(dateA); 
      });

      const customTotal = tItem.totalSessions || PRESET_YEARLY_TOTAL;
      const rate = Math.round((history.length / customTotal) * 100);

      return { ...tItem, attendance: rate, attendanceHistory: history, attendedSessions: history.length };
    });
    updateData({ trainees: newTrainees });
  };

  const renameReportDate = (oldDate: string) => {
    const newDate = prompt(t('alerts', 'renamePrompt'), oldDate);
    if (!newDate || newDate === oldDate) return;

    const newTrainees = trainees.map(tItem => {
      if (!tItem.attendanceHistory) return tItem;
      let changed = false;
      const history = tItem.attendanceHistory.map(h => {
        const d = typeof h === 'string' ? h : h.date;
        if (d === oldDate) {
          changed = true;
          return typeof h === 'string' ? newDate : { ...h, date: newDate };
        }
        return h;
      });
      
      if (changed) {
        history.sort((a, b) => (typeof b==='string'?b:b.date).localeCompare(typeof a==='string'?a:a.date));
        return { ...tItem, attendanceHistory: history };
      }
      return tItem;
    });
    updateData({ trainees: newTrainees });
  };

  const addReportDate = () => {
    if (!reportDateInput) return;
    
    if (!confirm(`Bulk add attendance for ${reportDateInput} to ALL visible players?`)) return;

    const targetSchool = reportSchool === '全部' || reportSchool === 'All' ? 'All' : reportSchool;
    const newTrainees = trainees.map(tItem => {
      if (targetSchool !== 'All' && tItem.team !== targetSchool) return tItem;
      let history = [...(tItem.attendanceHistory || [])];
      if (!history.some(h => (typeof h === 'string' ? h : h.date) === reportDateInput)) {
        history.push({ date: reportDateInput, status: 'present' });
        history.sort((a, b) => (typeof b==='string'?b:b.date).localeCompare(typeof a==='string'?a:a.date));
        const rate = Math.round((history.length / (tItem.totalSessions || 52)) * 100);
        return { ...tItem, attendance: rate, attendanceHistory: history, attendedSessions: history.length };
      }
      return tItem;
    });
    updateData({ trainees: newTrainees });
    setReportDateInput('');
  };

  const handleBackupToDrive = () => { 
    const d = JSON.stringify({ trainees, teams, leagueName, appLogo, coaches }, null, 2); 
    const a = document.createElement('a'); 
    a.href = URL.createObjectURL(new Blob([d], { type: "application/json" })); 
    a.download = `CFC_Backup.json`; 
    a.click(); 
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => { 
    const f = e.target.files?.[0]; 
    if (!f) return; 
    const r = new FileReader(); 
    r.onload = (ev) => { 
      try { 
        const p = JSON.parse(ev.target?.result as string); 
        if (confirm("Overwrite local database with this backup file?")) { 
          updateData(p); 
          setIsDataToolsOpen(false); 
        } 
      } catch (e) { 
        alert("Error restoring data from file"); 
      } 
    }; 
    r.readAsText(f); 
  };

  const handleDisconnect = () => {
    if (!confirm("Disconnect from JSONBin cloud?")) return;
    setCloudConfig({ key: '', binId: '' });
    localStorage.removeItem('cfc_jsonbin_config');
    setIsCloudConnected(false);
    setCloudStatus("");
  };

  const handleManualPush = async () => {
    if (!cloudConfig.key || !cloudConfig.binId) return alert("Key & Bin ID required");
    if (!confirm("⚠️ Overwrite CLOUD data with LOCAL data?")) return;
    
    localStorage.setItem('cfc_jsonbin_config', JSON.stringify(cloudConfig));
    setCloudStatus("⏳");
    
    try {
      const currentData = { 
        trainees: safeTrainees, 
        coaches: safeCoaches, 
        teams: safeTeams,
        leagueName, 
        appLogo 
      };
      
      const stripped = { 
        ...currentData, 
        trainees: currentData.trainees.map(tItem => (tItem.image && tItem.image.length > 1000) ? { ...tItem, image: DEFAULT_IMAGE } : tItem) 
      };
      
      const res = await fetch(`${JSONBIN_URL}/${cloudConfig.binId}`, {
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json', 'X-Master-Key': cloudConfig.key },
        body: JSON.stringify(stripped)
      });
      
      if (res.ok) {
        setIsCloudConnected(true);
        setCloudStatus("✅");
        alert("✅ Push Successful! Data saved to JSONBin.io cloud.");
        setIsCloudModalOpen(false);
        setTimeout(() => setCloudStatus("☁️"), 3000);
      } else {
        const errorText = await res.text();
        throw new Error(`API Error (${res.status}): ${errorText}`);
      }
    } catch (e: any) {
      setCloudStatus("❌");
      console.error("Push Error:", e);
      alert("Push Failed: " + e.message);
    }
  };

  const handleManualPull = () => {
    if (!cloudConfig.key || !cloudConfig.binId) return alert("Key & Bin ID required");
    if (!confirm("⚠️ Overwrite LOCAL data with CLOUD data?")) return;
    
    localStorage.setItem('cfc_jsonbin_config', JSON.stringify(cloudConfig));
    syncFromCloud(cloudConfig.key, cloudConfig.binId);
    setIsCloudModalOpen(false);
  };

  const createCloudBin = async () => { 
    if (!cloudConfig.key) return alert("Key Required"); 
    try { 
      const res = await fetch(JSONBIN_URL, { 
        method: "POST", 
        headers: { "Content-Type": "application/json", "X-Master-Key": cloudConfig.key, "X-Bin-Private": "true" }, 
        body: JSON.stringify({ trainees, coaches, teams }) 
      }); 
      if (res.ok) { 
        const json = await res.json(); 
        setCloudConfig(p => ({ ...p, binId: json.metadata.id })); 
        setIsCloudConnected(true); 
        alert("JSONBin custom instance registered successfully!"); 
      } 
    } catch (e) { 
      alert("Failed creating cloud instance"); 
    } 
  };
  
  const handleLogoFile = (e: React.ChangeEvent<HTMLInputElement>) => { 
    const f = e.target.files?.[0]; 
    if (!f) return; 
    const r = new FileReader(); 
    r.onload = (ev) => {
      setTempImage(ev.target?.result as string);
      setIsLogoCrop(true);
      setIsCropperOpen(true);
    }; 
    r.readAsDataURL(f); 
    e.target.value = ""; 
  };

  const handleTraineeFile = (e: React.ChangeEvent<HTMLInputElement>) => { 
    const f = e.target.files?.[0]; 
    if (!f) return; 
    const r = new FileReader(); 
    r.onload = (ev) => {
      setTempImage(ev.target?.result as string);
      setIsLogoCrop(false);
      setIsCropperOpen(true);
    }; 
    r.readAsDataURL(f); 
    e.target.value = ""; 
  };
  
  const handleCropConfirm = async (croppedBase64: string) => {
    let finalUrl = croppedBase64;
    if (isImgCloudReady) { 
      const cloudUrl = await uploadToCloudinary(croppedBase64); 
      if (cloudUrl) finalUrl = cloudUrl; 
    }
    if (isLogoCrop) {
      updateData({ appLogo: finalUrl });
    } else {
      setFormData((p: any) => ({ ...p, image: finalUrl }));
    }
    setIsCropperOpen(false);
  };

  const sendCoachMessage = (coach: Coach) => { 
    window.open(`https://wa.me/${coach.phone.replace(/[^0-9]/g, '')}`, '_blank'); 
  };

  const exportCoachPayrollExcel = () => {
    let csvContent = "\uFEFFName,Role,Rank,Sessions,Rate,Total,Status\n";
    payrollData.list.forEach(c => {
      csvContent += `${c.name.toUpperCase()},${c.role},${c.rank || '-'},${c.sessions},${c.rate},${c.amount},${c.isPaid ? 'PAID' : 'PENDING'}\n`;
    });
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a"); 
    link.href = URL.createObjectURL(blob); 
    link.download = `CFC_Payroll_${financeMonth}.csv`; 
    link.click();
  };

  const shareCoachPayslip = (c: any) => {
    const detailsText = c.details.map((d: any) => `- ${d.date}: ${d.school || 'Unknown'}`).join('\n');
    const statusText = c.isPaid ? 'PAID ✅' : 'PENDING ⏳';
    const text = `⚽ *CFC ACADEMY PAYSLIP* ⚽\n\n👤 Coach: ${c.name.toUpperCase()}\n📅 Month: ${financeMonth}\n\n💵 Rate: RM ${c.rate} / Session\n📝 Sessions: ${c.sessions}\n💰 *TOTAL: RM ${c.amount}*\n📊 Status: ${statusText}\n\n📌 *Session Details:*\n${detailsText}\n\nThank you for your hard work! 🙏`;
    const phone = c.phone ? c.phone.replace(/[^0-9]/g, '') : '';
    if (phone) window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
    else alert("No phone number found.");
  };

  const toggleFeeStatus = (traineeId: string) => { 
    const newTrainees = trainees.map(trainee => { 
      if (trainee.id === traineeId) { 
        const history = trainee.feeHistory || {}; 
        const currentStatus = history[financeMonth] || false; 
        return { ...trainee, feeHistory: { ...history, [financeMonth]: !currentStatus } }; 
      } 
      return trainee; 
    }); 
    updateData({ trainees: newTrainees }); 
  };

  const toggleAllFeeStatus = () => { 
    const allPaid = financeFiltered.every(trainee => trainee.feeHistory && trainee.feeHistory[financeMonth]); 
    const targetStatus = !allPaid; 
    if (!confirm(`Mark all as ${targetStatus ? 'Paid' : 'Unpaid'}?`)) return; 
    const newTrainees = trainees.map(trainee => { 
      if (financeFiltered.some(rt => rt.id === trainee.id)) { 
        const history = trainee.feeHistory || {}; 
        return { ...trainee, feeHistory: { ...history, [financeMonth]: targetStatus } }; 
      } 
      return trainee; 
    }); 
    updateData({ trainees: newTrainees }); 
  };

  const toggleAllAttendanceStatus = () => { 
    const currentIds = attTab === 'trainees' ? attendanceList : coachAttendanceList; 
    const filteredIds = attendanceFiltered.map(i => i.id); 
    const allSelected = filteredIds.every(id => currentIds.includes(id)); 
    if (allSelected) { 
      if (attTab === 'trainees') {
        setAttendanceList(attendanceList.filter(id => !filteredIds.includes(id))); 
      } else {
        setCoachAttendanceList(coachAttendanceList.filter(id => !filteredIds.includes(id))); 
      }
    } else { 
      if (attTab === 'trainees') {
        setAttendanceList([...new Set([...attendanceList, ...filteredIds])]); 
      } else {
        setCoachAttendanceList([...new Set([...coachAttendanceList, ...filteredIds])]); 
      }
    } 
  };
  
  const handleWhatsappShare = () => { 
    const names = attendanceFiltered
      .filter(i => attTab === 'trainees' ? attendanceList.includes(i.id) : coachAttendanceList.includes(i.id))
      .map((i, index) => `${index + 1}. ${i.name.toUpperCase()}`); 
    
    let header = "";
    if (attTab === 'trainees') {
      const schoolName = (selectedTeam === '全部' || selectedTeam === 'All' || selectedTeam === 'Semua') ? 'All Schools' : selectedTeam;
      header = `🏫 ${schoolName}`;
    } else {
      header = `⚽ Coaches`;
    }

    const text = `📅 ${attendanceDate} Attendance\n${header} (${names.length} Pax)\n\n${names.join('\n')}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank'); 
  };

  const handleExportAttendanceExcel = () => { 
    let csvContent = "\uFEFFName,Team,Status\n";
    const list = attTab === 'trainees' ? filteredTrainees : safeCoaches;
    const ids = attTab === 'trainees' ? attendanceList : coachAttendanceList;
    list.forEach(item => {
      const status = ids.includes(item.id) ? "Present" : "Absent";
      csvContent += `${item.name.toUpperCase()},${(item as Trainee).team || (item as Coach).role},${status}\n`;
    });
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a"); 
    link.href = URL.createObjectURL(blob); 
    link.download = `CFC_Att_${attendanceDate}.csv`; 
    link.click(); 
  };

  const handleExportFullHistory = () => {
    const targetSchool = selectedTeam === '全部' || selectedTeam === 'All' || selectedTeam === 'Semua' ? 'All_Schools' : selectedTeam;
    const list = attTab === 'trainees' ? filteredTrainees : safeCoaches;
    let csvContent = `\uFEFFName,School/Role,Date,Status\n`;
    list.forEach(item => {
      const history = item.attendanceHistory || [];
      if (history.length > 0) {
        history.forEach(h => {
          const dateStr = (typeof h === 'string') ? h : (h.date || 'N/A');
          csvContent += `"${item.name.toUpperCase()}","${(item as Trainee).team || (item as Coach).role}","${dateStr}","PRESENT"\n`;
        });
      } else {
        csvContent += `"${item.name.toUpperCase()}","${(item as Trainee).team || (item as Coach).role}","N/A","NO_HISTORY"\n`;
      }
    });
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a"); 
    link.href = URL.createObjectURL(blob); 
    link.download = `CFC_FullHistory_${targetSchool}_${new Date().toISOString().slice(0, 10)}.csv`; 
    link.click();
  };

  const handleDownloadReport = () => {
    if (!reportData.list || reportData.list.length === 0) return alert("No data to export");
    
    let csvContent = `\uFEFFCFC YOUTH ACADEMY - MONTHLY ATTENDANCE REPORT\n`;
    csvContent += `School/Team:,${reportData.targetSchool}\n`;
    csvContent += `Month:,${reportMonth}\n`;
    csvContent += `Generated At:,${new Date().toLocaleString()}\n\n`; 

    const dateHeaders = reportData.dates.map(d => d.slice(5)); 
    const headers = ['No.', 'Name', 'Category', 'Team', ...dateHeaders, 'Total', 'Rate (%)'];
    csvContent += headers.join(',') + '\n';
    
    reportData.list.forEach((row, index) => {
      const history = row.attendanceHistory || [];
      const presentDates = new Set(history.map((h: any) => (typeof h === 'string' ? h : (h?.date))));
      
      let rowData = [
        index + 1,
        `"${row.name.toUpperCase()}"`, 
        `"${row.category || '-'}"`,
        `"${row.team}"`
      ];

      reportData.dates.forEach(date => {
        rowData.push(presentDates.has(date) ? '1' : ''); 
      });

      rowData.push(row.count);
      rowData.push(`${row.percentage}%`);

      csvContent += rowData.join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a"); 
    link.href = URL.createObjectURL(blob); 
    link.download = `CFC_Report_${reportData.targetSchool}_${reportMonth}.csv`; 
    link.click();
  };

  const exportFinanceExcel = () => { 
    let csvContent = "\uFEFFName,Team,Status,Amount\n";
    financeFiltered.forEach(tItem => {
      const isPaid = tItem.feeHistory && tItem.feeHistory[financeMonth];
      csvContent += `${tItem.name.toUpperCase()},${tItem.team},${isPaid ? 'PAID' : 'PENDING'},${monthlyFee}\n`;
    });
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a"); 
    link.href = URL.createObjectURL(blob); 
    link.download = `CFC_Finance_${financeMonth}.csv`; 
    link.click();
  };

  const handleSystemShare = (tItem: Trainee) => { 
    const text = generateShareText(tItem);
    if (navigator.share) {
      navigator.share({ title: tItem.name, text }).catch(err => {
        if (err.name !== 'AbortError') {
          safeCopy(text, 'Player profile details link generated! Link copied to clipboard.');
        }
      });
    } else {
      safeCopy(text, 'Player profile details link generated! Link copied to clipboard.');
    }
  };

  const generateShareText = (tItem: Trainee) => {
    const L = TRANSLATIONS[lang] || TRANSLATIONS['zh'];
    let text = `⚽ ${L.appTitle}\n\n👤 ${tItem.name.toUpperCase()}\n🏫 ${tItem.team}\n📍 ${tItem.primaryPosition}`;
    if (tItem.secondaryPosition && tItem.secondaryPosition !== '无') {
      text += ` / ${tItem.secondaryPosition}`;
    }
    text += `\n\n📊 ${L.stats.pace}: ${tItem.stats.pace} | ${L.stats.shooting}: ${tItem.stats.shooting}\n${L.stats.passing}: ${tItem.stats.passing} | ${L.stats.dribbling}: ${tItem.stats.dribbling}\n${L.stats.defending}: ${tItem.stats.defending} | ${L.stats.physical}: ${tItem.stats.physical}\n\n📈 Attendance: ${tItem.attendance}%`;
    if (tItem.coachComment) {
      text += `\n\n💬 Coach: ${tItem.coachComment}`;
    }
    return text;
  };

  const mockAI = () => { 
    setAiLoading(true); 
    setTimeout(() => { 
      const s = formData.stats || { pace: 50, shooting: 50, passing: 50, dribbling: 50, defending: 50, physical: 50 };
      const values = Object.values(s) as number[];
      const avg = values.reduce((a, b) => a + b, 0) / (values.length || 1);
      
      let grade = 'D级';
      let enGrade = 'Grade D';
      if (avg >= 90) { grade = 'S级'; enGrade = 'Grade S'; }
      else if (avg >= 80) { grade = 'A级'; enGrade = 'Grade A'; }
      else if (avg >= 70) { grade = 'B级'; enGrade = 'Grade B'; }
      else if (avg >= 60) { grade = 'C级'; enGrade = 'Grade C'; }
      
      const statMap: Record<string, string> = { pace: '速度', shooting: '射门', passing: '传球', dribbling: '盘带', defending: '防守', physical: '体能' };
      const enStatMap: Record<string, string> = { pace: 'Pace', shooting: 'Shooting', passing: 'Passing', dribbling: 'Dribbling', defending: 'Defending', physical: 'Physical' };
      
      let bestStat: keyof Stats = 'pace'; 
      let maxVal = -1;
      for (const key in s) { 
        if (s[key as keyof Stats] > maxVal) { 
          maxVal = s[key as keyof Stats]; 
          bestStat = key as keyof Stats; 
        } 
      }
      
      const bestStatName = statMap[bestStat] || '综合';
      const bestStatEnName = enStatMap[bestStat] || 'Overall';
      const name = (formData.name || '球员').toUpperCase();
      
      const template = lang === 'en' 
        ? `【Coach Assessment Report】\n\n⭐ Overall Level: ${enGrade}\n🔥 Core Strength: ${bestStatEnName} (${maxVal})\n\n💬 Coach Assessment Comment:\n"${name} - Shows exceptional talent and solid commitment. Needs to keep working on structural attributes."`
        : `【教练评估报告】\n\n⭐ 综合评级：${grade}\n🔥 核心竞争力：${bestStatName} (${maxVal})\n\n💬 教练评语：\n"${name} - 潜力不错，训练态度非常积极。建议在未来的比赛周期中继续观察和培养其球场大局观。"`;
      
      setFormData((prev: any) => ({ ...prev, coachComment: template }));
      setAiLoading(false); 
    }, 800); 
  };

  const sendFeeReminder = (trainee: Trainee) => {
    const templateKey = msgTemplate || 'gentle';
    let rawMsg = t('msgs', templateKey);
    if (!rawMsg) rawMsg = "Reminder: Fees due.";

    let text = rawMsg
      .replace('{name}', trainee.name.toUpperCase())
      .replace('{month}', financeMonth)
      .replace('{amount}', monthlyFee.toString());

    const bankInfoText = t('bankDetails')
      .replace('{bankName}', BANK_INFO.bankName)
      .replace('{accNum}', BANK_INFO.accNum)
      .replace('{holder}', BANK_INFO.holder);
    
    text += bankInfoText;

    const phone = trainee.phone ? trainee.phone.replace(/[^0-9]/g, '') : '';
    if (phone) {
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
    } else {
      alert("No phone number found (号码缺失)");
    }
  };

  const parseImportText = () => { 
    if (!importText) return; 
    const text = importText.toLowerCase(); 
    const matchedIds = (attTab === 'trainees' ? filteredTrainees : safeCoaches)
      .filter(item => text.includes(item.name.toLowerCase()))
      .map(item => item.id); 
    
    if (attTab === 'trainees') {
      setAttendanceList(matchedIds); 
    } else {
      setCoachAttendanceList(matchedIds); 
    }
    alert(`Matched ${matchedIds.length} names from pasted list!`); 
  };

  const copyBankInfo = () => { 
    const text = `${BANK_INFO.bankName}\n${BANK_INFO.accNum}\n${BANK_INFO.holder}`; 
    safeCopy(text, t('alerts', 'copied')); 
  };

  const saveImgConfig = () => { 
    if (imgConfig.cloudName) { 
      localStorage.setItem('cfc_cloudinary_config', JSON.stringify(imgConfig)); 
      setIsImgCloudReady(true); 
      alert("Cloudinary photo presets saved!"); 
    } 
  };

  const testCloudinary = async () => { 
    const testPixel = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="; 
    const url = await uploadToCloudinary(testPixel); 
    if (url) alert("Connected & tested successfully! Cloudinary integration live.");
    else alert("Unable to connect to Cloudinary. Check presets or cloud name.");
  };

  useEffect(() => {
    const local = JSON.parse(localStorage.getItem('cfc_local_db') || '{}');
    setTrainees(local.trainees || INITIAL_TRAINEES);
    setCoaches(local.coaches || INITIAL_COACHES);
    setLeagueName(local.leagueName || 'CFC YOUTH ACADEMY');
    
    if (local.appLogo) {
      setAppLogo(local.appLogo);
    } else {
      setAppLogo('CFCYA LOGO.jpg');
    }

    if (local.teams) setTeams(local.teams);
    
    const savedCloud = JSON.parse(localStorage.getItem('cfc_jsonbin_config') || '{}');
    if (savedCloud.binId) { 
      setCloudConfig(savedCloud); 
      syncFromCloud(savedCloud.key, savedCloud.binId); 
    }
    
    const savedImgCloud = JSON.parse(localStorage.getItem('cfc_cloudinary_config') || '{}');
    if (savedImgCloud.cloudName) { 
      setImgConfig(savedImgCloud); 
      setIsImgCloudReady(true); 
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0c0a09] bg-grid py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col relative select-none">
      
      {/* Dynamic top bar header */}
      <header className="relative z-30 flex flex-col xl:flex-row justify-between items-center gap-6 mb-8 mt-4">
        <div className="flex items-center gap-4 w-full">
          {/* Logo container wrapper */}
          <div 
            className="w-16 h-16 rounded-2xl overflow-hidden border border-zinc-800 cursor-pointer bg-zinc-950 shrink-0 shadow-lg shadow-black/40 p-1 group flex items-center justify-center relative" 
            onClick={() => userRole === 'admin' && logoInputRef.current?.click()}
          >
            <img 
              src={appLogo || 'CFCYA LOGO.jpg'} 
              className="w-full h-full object-contain rounded-xl transition-all group-hover:opacity-90" 
              alt="Logo" 
              onError={(e) => { 
                (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=CFC&background=0D8ABC&color=fff'; 
              }}
            />
            <input 
              type="file" 
              ref={logoInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleLogoFile}
            />
          </div>
          
          <div className="flex-1 text-left leading-none uppercase">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tighter hover:text-yellow-500 transition-colors">
              {leagueName}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-zinc-550 font-black text-[10px] tracking-wider">
              <span className={`px-2 py-0.5 rounded-md text-[9px] font-black border leading-none tracking-widest ${userRole === 'admin' ? 'bg-emerald-950/20 text-emerald-400 border-emerald-500/20' : 'bg-blue-950/20 text-blue-400 border-blue-500/20'}`}>
                {userRole ? userRole.toUpperCase() : 'VISITOR'}
              </span>
              
              {userRole === 'admin' && (
                <button 
                  onClick={() => setIsCloudModalOpen(true)} 
                  className={`px-2 py-0.5 rounded-md flex items-center gap-1 transition-all border text-[9px] font-black leading-none ${isCloudConnected ? 'bg-indigo-950/30 text-indigo-400 border-indigo-500/20' : 'bg-zinc-900 border-zinc-800 text-zinc-550'}`}
                >
                  <Cloud className={`w-3 h-3 ${isCloudConnected ? 'animate-pulse' : ''}`} /> 
                  {cloudStatus || "STANDALONE"}
                </button>
              )}
              
              {/* Copy URL trigger */}
              <button 
                onClick={() => { safeCopy(window.location.href, 'System web link copied to clipboard successfully!'); }} 
                title="Copy Application Link" 
                className="hover:text-white transition-colors"
              >
                {lang === 'en' ? 'Share link' : '分享系统'}
              </button>
              
              <button 
                onClick={() => setUserRole(null)} 
                title="Logout" 
                className="hover:text-red-400 transition-colors pl-2"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Admin Actions Toolbar */}
        {userRole === 'admin' ? (
          <div className="w-full xl:w-auto overflow-x-auto no-scrollbar py-1 self-start shrink-0">
            <div className="flex gap-2">
              <button 
                onClick={() => setIsFinanceOpen(true)} 
                className="px-4 py-3 bg-yellow-600 hover:bg-yellow-500 text-black rounded-2xl font-black text-[10px] shadow-lg uppercase active:scale-95 transition-all flex flex-col items-center justify-center gap-1.5 whitespace-nowrap min-w-[76px] tracking-wider"
              >
                <Coins className="w-5 h-5 text-zinc-950" />
                {t('financeTool')}
              </button>
              
              <button 
                onClick={openAttendanceModal} 
                className="px-4 py-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded-2xl font-black text-[10px] shadow-lg uppercase active:scale-95 transition-all flex flex-col items-center justify-center gap-1.5 whitespace-nowrap min-w-[76px] tracking-wider"
              >
                <Calendar className="w-5 h-5" />
                {t('attendanceTool')}
              </button>
              
              <button 
                onClick={() => { setIsCoachOpen(true); setCoachView('list'); }} 
                className="px-4 py-3 bg-blue-800 hover:bg-blue-700 text-white rounded-2xl font-black text-[10px] shadow-lg uppercase active:scale-95 transition-all flex flex-col items-center justify-center gap-1.5 whitespace-nowrap min-w-[76px] tracking-wider"
              >
                <Users className="w-5 h-5 text-blue-200" />
                {t('coachTool')}
              </button>
              
              <button 
                onClick={() => setIsSchoolManagerOpen(true)} 
                className="px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-2xl font-black text-[10px] border border-zinc-700 active:scale-95 shadow-lg uppercase flex flex-col items-center justify-center gap-1.5 whitespace-nowrap min-w-[76px] tracking-wider"
              >
                <Shield className="w-5 h-5" />
                {t('manageSchools')}
              </button>
              
              <button 
                onClick={() => setIsDataToolsOpen(true)} 
                className="px-4 py-3 bg-indigo-805 bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 border border-indigo-500/20 rounded-2xl font-black text-[10px] shadow-lg uppercase active:scale-95 transition-all flex flex-col items-center justify-center gap-1.5 whitespace-nowrap min-w-[76px] tracking-wider"
              >
                <FolderSync className="w-5 h-5" />
                {t('backupTools')}
              </button>
              
              <button 
                onClick={handleRegister} 
                className="px-5 py-3 bg-white text-zinc-950 hover:bg-zinc-100 rounded-2xl font-extrabold text-[10px] active:scale-95 shadow-2xl uppercase tracking-widest min-w-[76px] flex flex-col items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <UserCheck className="w-5 h-5 text-indigo-600" />
                {t('register')}
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full xl:w-auto flex justify-end shrink-0 py-1">
            <button 
              onClick={() => setShowPinInput(true)} 
              className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 rounded-xl font-bold uppercase text-xs tracking-wider flex items-center gap-2 active:scale-95 transition-all shadow"
            >
              <Key className="w-4 h-4 text-emerald-500" />
              Manage Academy
            </button>
          </div>
        )}
      </header>

      {/* Internal login view screen if overlay active */}
      {showPinInput && (
        <div className="fixed inset-0 z-[10003] bg-black/95 flex flex-col items-center justify-center p-6 fade-in font-sans">
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-zinc-400 text-xs uppercase font-black tracking-widest leading-none">
                {t('auth', 'enterPin')}
              </h3>
              <button 
                onClick={() => { setShowPinInput(false); setPinInput(""); }} 
                className="p-1 hover:bg-zinc-800 rounded-full transition-all"
              >
                <X className="w-5 h-5 text-zinc-500" />
              </button>
            </div>
            
            {/* Visual Dot Indication Code indicators */}
            <div className="flex justify-center gap-4 mb-8">
              {[...Array(4)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-4.5 h-4.5 rounded-full transition-all duration-300 ${i < pinInput.length ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.9)] scale-110' : 'bg-zinc-800'}`}
                ></div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                <button 
                  key={n} 
                  onClick={() => setPinInput(p => (p + n).slice(0, 4))} 
                  className="py-4 bg-zinc-800 hover:bg-zinc-750 rounded-xl font-black text-2xl text-white active:bg-zinc-700 active:scale-95 transition-all shadow-md select-none"
                >
                  {n}
                </button>
              ))}
              
              <button 
                onClick={() => setPinInput(p => p.slice(0, -1))} 
                className="py-4 bg-zinc-800/40 text-zinc-500 hover:text-white rounded-xl font-bold text-xl active:bg-zinc-700/50 active:scale-95 transition-all flex items-center justify-center"
              >
                <Undo2 className="w-5 h-5" />
              </button>
              
              <button 
                onClick={() => setPinInput(p => (p + '0').slice(0, 4))} 
                className="py-4 bg-zinc-800 hover:bg-zinc-750 rounded-xl font-black text-2xl text-white active:bg-zinc-700 active:scale-95 transition-all shadow-md"
              >
                0
              </button>
              
              <button 
                onClick={() => handleLogin('admin')} 
                className="py-4 bg-emerald-600/20 text-emerald-500 hover:bg-emerald-600 hover:text-white rounded-xl flex items-center justify-center active:scale-95 transition-all border border-emerald-500/10 shadow"
              >
                <Check className="w-6 h-6 stroke-[3]" />
              </button>
            </div>

            <div className="flex justify-center gap-6 mt-8 border-t border-zinc-800/60 pt-6">
              {['zh', 'ms', 'en'].map(l => (
                <button 
                  key={l} 
                  onClick={() => setLang(l as any)} 
                  className={`text-xl transition-all ${lang === l ? 'opacity-100 scale-110' : 'opacity-40 grayscale'}`}
                >
                  {l === 'zh' ? '🇨🇳' : l === 'ms' ? '🇲🇾' : '🇬🇧'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main search filtering and schools selector buttons */}
      <div className="mb-8 space-y-4 shrink-0 uppercase tracking-tighter">
        <div className="relative">
          <input 
            className="w-full bg-zinc-900 border border-zinc-800/80 rounded-2xl py-4.5 pl-14 pr-6 outline-none focus:border-indigo-505 focus:border-zinc-750 text-base shadow-xl text-white placeholder-zinc-700 font-extrabold uppercase leading-none" 
            placeholder={t('searchPlaceholder')} 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)} 
          />
          <Search className="w-5 h-5 text-zinc-550 absolute left-5 top-1/2 -translate-y-1/2" />
        </div>
        
        {/* Teams/schools quick filters bar */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1.5 relative border-b border-zinc-900">
          {[t('common', 'all'), ...teams].map(team => (
            <button 
              key={team} 
              onClick={() => setSelectedTeam(team)} 
              className={`px-4 py-2 text-[10px] font-black rounded-xl border transition-all whitespace-nowrap uppercase tracking-wider ${selectedTeam === team ? 'bg-yellow-500 text-black border-yellow-500 shadow-lg' : 'bg-zinc-900/60 text-zinc-550 border-zinc-800/80 hover:border-zinc-700'}`}
            >
              {team}
            </button>
          ))}
        </div>
      </div>

      {/* Players list card layout grid viewport */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 flex-1 items-start">
        {filteredTrainees.map(trainee => (
          <PlayerCard 
            key={trainee.id}
            trainee={trainee}
            userRole={userRole}
            getStatGrade={getStatGrade}
            getGradeColor={getGradeColor}
            getAttendanceColor={getAttendanceColor}
            getPositionCode={getPositionCode}
            getOptimizedImageUrl={getOptimizedImageUrl}
            handleSystemShare={handleSystemShare}
            toggleQuickAttendance={toggleQuickAttendance}
            handleEdit={handleEdit}
            deleteTrainee={deleteTrainee}
            t={t}
            DEFAULT_IMAGE={DEFAULT_IMAGE}
          />
        ))}

        {filteredTrainees.length === 0 && (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-center opacity-40 uppercase tracking-widest text-xs font-black">
            <Shield className="w-12 h-12 mb-3 text-zinc-700" />
            {t('noData')}
          </div>
        )}
      </div>

      {/* Modals injection portals */}
      
      {/* 1. Player Creator/Editor details form Modal */}
      {isModalOpen && (
        <PlayerEditor 
          onClose={() => setIsModalOpen(false)}
          lang={lang}
          t={t}
          teams={teams}
          formData={formData}
          setFormData={setFormData}
          editingTrainee={editingTrainee}
          handleSaveTrainee={handleSaveTrainee}
          fileInputRef={fileInputRef}
          handleTraineeFile={handleTraineeFile}
          mockAI={mockAI}
          aiLoading={aiLoading}
          historyDateInput={historyDateInput}
          setHistoryDateInput={setHistoryDateInput}
          addHistoryRecord={addHistoryRecord}
          removeHistoryDate={removeHistoryDate}
          monthlyGroups={monthlyGroups}
          POSITIONS={POSITIONS}
          CATEGORIES={CATEGORIES}
          DEFAULT_IMAGE={DEFAULT_IMAGE}
        />
      )}

      {/* 2. Single Day Attendance Marker modal portal */}
      {isAttendanceOpen && (
        <AttendanceModal 
          onClose={() => setIsAttendanceOpen(false)}
          lang={lang}
          t={t}
          attendanceDate={attendanceDate}
          setAttendanceDate={setAttendanceDate}
          attTab={attTab}
          setAttTab={setAttTab}
          importText={importText}
          setImportText={setImportText}
          parseImportText={parseImportText}
          attendanceSearchTerm={attendanceSearchTerm}
          setAttendanceSearchTerm={setAttendanceSearchTerm}
          attendanceList={attendanceList}
          coachAttendanceList={coachAttendanceList}
          toggleAttendance={toggleAttendance}
          toggleAllAttendanceStatus={toggleAllAttendanceStatus}
          attendanceFiltered={attendanceFiltered}
          submitAttendance={submitAttendance}
          handleWhatsappShare={handleWhatsappShare}
          handleExportAttendanceExcel={handleExportAttendanceExcel}
          handleExportFullHistory={handleExportFullHistory}
          setIsMonthlyReportOpen={setIsMonthlyReportOpen}
          setReportSchool={setReportSchool}
          selectedTeam={selectedTeam}
        />
      )}

      {/* 3. Global Finance payment editor modal portal */}
      {isFinanceOpen && (
        <FinanceModal 
          onClose={() => setIsFinanceOpen(false)}
          lang={lang}
          t={t}
          financeMonth={financeMonth}
          setFinanceMonth={setFinanceMonth}
          financeSearchTerm={financeSearchTerm}
          setFinanceSearchTerm={setFinanceSearchTerm}
          financeFiltered={financeFiltered}
          financeSummary={financeSummary}
          toggleFeeStatus={toggleFeeStatus}
          toggleAllFeeStatus={toggleAllFeeStatus}
          monthlyFee={monthlyFee}
          setMonthlyFee={setMonthlyFee}
          msgTemplate={msgTemplate}
          setMsgTemplate={setMsgTemplate}
          sendFeeReminder={sendFeeReminder}
          exportFinanceExcel={exportFinanceExcel}
          copyBankInfo={copyBankInfo}
          bankInfo={BANK_INFO}
        />
      )}

      {/* 4. Coach Management payroll hours log modal portal */}
      {isCoachOpen && (
        <CoachHubModal 
          onClose={() => setIsCoachOpen(false)}
          lang={lang}
          t={t}
          teams={teams}
          coaches={coaches}
          coachView={coachView}
          setCoachView={setCoachView}
          coachForm={coachForm}
          setCoachForm={setCoachForm}
          expandedCoachId={expandedCoachId}
          setExpandedCoachId={setExpandedCoachId}
          editingCoach={editingCoach}
          handleEditCoach={handleEditCoach}
          cancelEditCoach={cancelEditCoach}
          saveCoach={saveCoach}
          deleteCoach={deleteCoach}
          removeCoachRecord={removeCoachRecord}
          payrollData={payrollData}
          shareCoachPayslip={shareCoachPayslip}
          toggleCoachPayment={toggleCoachPayment}
          exportCoachPayrollExcel={exportCoachPayrollExcel}
          financeMonth={financeMonth}
          setFinanceMonth={setFinanceMonth}
          coachAttDate={coachAttDate}
          setCoachAttDate={setCoachAttDate}
          coachAttSchool={coachAttSchool}
          setCoachAttSchool={setCoachAttSchool}
          toggleCoachAttendance={toggleCoachAttendance}
          COACH_RANKS={COACH_RANKS}
          COACH_ROLES={COACH_ROLES}
          sendCoachMessage={sendCoachMessage}
        />
      )}

      {/* 5. Cloud integration manual Syncs configuration modal Portal */}
      {isCloudModalOpen && (
        <DataToolsModal 
          onClose={() => setIsCloudModalOpen(false)}
          lang={lang}
          t={t}
          cloudConfig={cloudConfig}
          setCloudConfig={setCloudConfig}
          isCloudConnected={isCloudConnected}
          cloudStatus={cloudStatus}
          imgConfig={imgConfig}
          setImgConfig={setImgConfig}
          isImgCloudReady={isImgCloudReady}
          setIsImgCloudReady={setIsImgCloudReady}
          handleBackupToDrive={handleBackupToDrive}
          handleImportFile={handleImportFile}
          handleManualPush={handleManualPush}
          handleManualPull={handleManualPull}
          createCloudBin={createCloudBin}
          handleDisconnect={handleDisconnect}
          testCloudinary={testCloudinary}
          saveImgConfig={saveImgConfig}
          backupInputRef={backupInputRef}
        />
      )}

      {/* 6. JSON database standalone backcups Portal */}
      {isDataToolsOpen && (
        <DataToolsModal 
          onClose={() => setIsDataToolsOpen(false)}
          lang={lang}
          t={t}
          cloudConfig={cloudConfig}
          setCloudConfig={setCloudConfig}
          isCloudConnected={isCloudConnected}
          cloudStatus={cloudStatus}
          imgConfig={imgConfig}
          setImgConfig={setImgConfig}
          isImgCloudReady={isImgCloudReady}
          setIsImgCloudReady={setIsImgCloudReady}
          handleBackupToDrive={handleBackupToDrive}
          handleImportFile={handleImportFile}
          handleManualPush={handleManualPush}
          handleManualPull={handleManualPull}
          createCloudBin={createCloudBin}
          handleDisconnect={handleDisconnect}
          testCloudinary={testCloudinary}
          saveImgConfig={saveImgConfig}
          backupInputRef={backupInputRef}
        />
      )}

      {/* 7. Interactive Month Reports grid Modal Portal */}
      {isMonthlyReportOpen && (
        <MonthlyReportModal 
          onClose={() => setIsMonthlyReportOpen(false)}
          lang={lang}
          t={t}
          reportMonth={reportMonth}
          setReportMonth={setReportMonth}
          reportSchool={reportSchool}
          setReportSchool={setReportSchool}
          teams={teams}
          reportData={reportData}
          toggleReportAttendance={toggleReportAttendance}
          renameReportDate={renameReportDate}
          addReportDate={addReportDate}
          reportDateInput={reportDateInput}
          setReportDateInput={setReportDateInput}
          handleDownloadReport={handleDownloadReport}
        />
      )}

      {/* 8. School Managers CRUD modal portal */}
      {isSchoolManagerOpen && (
        <div 
          className="fixed inset-0 z-[10002] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 fade-in"
          onClick={() => setIsSchoolManagerOpen(false)}
        >
          <div 
            className="bg-zinc-900 border border-zinc-800 w-full max-w-sm rounded-[2.5rem] p-8 flex flex-col shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6 shrink-0 font-black font-bold uppercase tracking-widest leading-none border-b border-zinc-800/50 pb-4">
              <h2 className="text-lg text-white">{t('manageSchools')}</h2>
              <button onClick={() => setIsSchoolManagerOpen(false)} className="p-1 hover:bg-zinc-800 rounded-full transition-all">
                <X className="w-5 h-5 text-zinc-500 hover:text-white" />
              </button>
            </div>
            
            <div className="space-y-3 flex-grow overflow-y-auto max-h-[50vh] pr-1 no-scrollbar mb-6">
              {teams.map(team => (
                <div 
                  key={team} 
                  className="bg-zinc-950 p-4 rounded-2xl border border-zinc-850 flex justify-between items-center group shadow-lg uppercase font-black leading-none"
                >
                  {renamingTeam.original === team ? (
                    <div className="flex gap-2 w-full">
                      <input 
                        autoFocus 
                        className="flex-1 bg-zinc-900 px-3 py-1.5 rounded-xl text-xs text-white focus:border-indigo-500 outline-none shadow-inner" 
                        value={renamingTeam.current} 
                        onChange={e => setRenamingTeam({ ...renamingTeam, current: e.target.value })} 
                        onKeyDown={e => e.key === 'Enter' && handleRenameTeam(team)}
                      />
                      <button 
                        onClick={() => handleRenameTeam(team)} 
                        className="bg-emerald-600 text-white px-3 py-1.5 rounded-xl active:scale-90 shadow-lg leading-none"
                      >
                        OK
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="font-extrabold text-sm text-zinc-300 uppercase tracking-widest">{team}</span>
                      <div className="flex gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setRenamingTeam({ original: team, current: team })} 
                          className="p-1 text-zinc-500 hover:text-white transition-colors"
                        >
                          <EditIcon className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteTeam(team)} 
                          className="p-1 text-zinc-500 hover:text-red-500 transition-colors"
                        >
                          <TrashIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
            
            {/* Create new school Column trigger */}
            <button 
              onClick={handleAddTeam} 
              className="w-full py-4.5 bg-white hover:bg-zinc-100 text-zinc-950 rounded-[2rem] font-bold uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 shadow-xl leading-none text-xs"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              {t('addSchool')}
            </button>
          </div>
        </div>
      )}

      {/* 9. Standalone responsive Image Touch-Cropper layer overlay portal */}
      {isCropperOpen && tempImage && (
        <ImageCropper 
          imageSrc={tempImage}
          onCrop={handleCropConfirm}
          onCancel={() => {
            setIsCropperOpen(false);
            setTempImage(null);
          }}
        />
      )}

      {/* Footer credits panel */}
      <footer className="mt-auto pt-16 pb-4 tracking-widest uppercase font-mono text-[9px] text-zinc-650 opacity-60 flex justify-between select-none">
        <span>© 2026 {leagueName} PRO Engine</span>
        <span>Local & Sync Secured</span>
      </footer>

    </div>
  );
}

function EditIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
  );
}

function TrashIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.108 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  );
}
