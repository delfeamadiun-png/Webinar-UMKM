import React, { useState } from 'react';
import { User, Webinar, SystemSettings, DB } from '../database';
import { TopicCategory, RundownItem } from '../types';
import { Plus, Trash2, Edit, Save, Globe, Shield, UserX, Calendar, Key, Check, BarChart2, TrendingUp, Users, DollarSign, Settings, RefreshCw, Layers, Award, Coffee, Flag, Search, Lock, X } from 'lucide-react';

interface DashboardSuperAdminProps {
  currentUser: User;
  onRefreshAllData?: () => void;
}

export default function DashboardSuperAdmin({ currentUser, onRefreshAllData }: DashboardSuperAdminProps) {
  const [webinars, setWebinars] = useState<Webinar[]>(DB.getWebinars());
  const [users, setUsers] = useState<User[]>(DB.getUsers());
  const [settings, setSettings] = useState<SystemSettings>(DB.getSettings());
  
  // Webinar CRUD Form States
  const [isEditingWebinar, setIsEditingWebinar] = useState<string | null>(null); // webinarId or 'new'
  const [title, setTitle] = useState('');
  const [speaker, setSpeaker] = useState('');
  const [speakerTitle, setSpeakerTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [status, setStatus] = useState<'upcoming' | 'live' | 'completed'>('upcoming');
  const [description, setDescription] = useState('');
  const [materialUrl, setMaterialUrl] = useState('');
  const [materialAudioUrl, setMaterialAudioUrl] = useState('');
  const [materialVideoUrl, setMaterialVideoUrl] = useState('');
  const [recordingUrl, setRecordingUrl] = useState('');
  const [zoomJoinUrl, setZoomJoinUrl] = useState('');
  const [zoomStartUrl, setZoomStartUrl] = useState('');
  const [webinarPrice, setWebinarPrice] = useState<number>(0);

  // Webinar Rundown Management States
  const [rundownList, setRundownList] = useState<RundownItem[]>([]);
  const [rdTime, setRdTime] = useState('');
  const [rdTitle, setRdTitle] = useState('');
  const [rdType, setRdType] = useState<'start' | 'session' | 'break' | 'end'>('session');
  const [editingRdId, setEditingRdId] = useState<string | null>(null);

  // API Integration States
  const [zoomApiKey, setZoomApiKey] = useState(settings.zoomApiKey);
  const [zoomConnected, setZoomConnected] = useState(settings.zoomConnected);
  const [googleCalendarConnected, setGoogleCalendarConnected] = useState(settings.googleCalendarConnected);
  const [midtransConnected, setMidtransConnected] = useState(settings.midtransConnected);
  const [midtransClientKey, setMidtransClientKey] = useState(settings.midtransClientKey);
  const [ticketPrice, setTicketPrice] = useState(settings.ticketPrice);
  const [restrictZoomUnpaid, setRestrictZoomUnpaid] = useState(settings.restrictZoomUnpaid || false);
  const [bankInfoBank, setBankInfoBank] = useState(settings.bankInfoBank || 'Bank BCA');
  const [bankInfoNumber, setBankInfoNumber] = useState(settings.bankInfoNumber || '8830123456');
  const [bankInfoName, setBankInfoName] = useState(settings.bankInfoName || 'CV UMKM Digital Indonesia');

  // Landing Page Copy & Branding customisation states
  const [landingTitle, setLandingTitle] = useState(settings.landingTitle || '');
  const [landingSubTitle, setLandingSubTitle] = useState(settings.landingSubTitle || '');
  const [landingHeroBadge, setLandingHeroBadge] = useState(settings.landingHeroBadge || '');
  const [landingHeroTitle, setLandingHeroTitle] = useState(settings.landingHeroTitle || '');
  const [landingHeroDesc, setLandingHeroDesc] = useState(settings.landingHeroDesc || '');
  const [landingAgendaTitle, setLandingAgendaTitle] = useState(settings.landingAgendaTitle || '');
  const [landingFilterLabel, setLandingFilterLabel] = useState(settings.landingFilterLabel || '');
  const [landingLogoUrl, setLandingLogoUrl] = useState(settings.landingLogoUrl || '');
  const [featuresList, setFeaturesList] = useState(settings.featuresList || []);
  const [topicsList, setTopicsList] = useState<TopicCategory[]>(settings.topicsList || []);

  const [category, setCategory] = useState('');
  const [newTopicName, setNewTopicName] = useState('');
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);

  // Certificate Settings states
  const [certSpeaker1Name, setCertSpeaker1Name] = useState(settings.certSpeaker1Name || 'Dr. H. Sandiaga Uno, B.B.A.');
  const [certSpeaker1Sign, setCertSpeaker1Sign] = useState(settings.certSpeaker1Sign || '');
  const [certSpeaker1Title, setCertSpeaker1Title] = useState(settings.certSpeaker1Title || 'NARASUMBER I');
  const [certSpeaker1Active, setCertSpeaker1Active] = useState(settings.certSpeaker1Active !== undefined ? settings.certSpeaker1Active : true);
  const [certSpeaker2Name, setCertSpeaker2Name] = useState(settings.certSpeaker2Name || 'Ibu Rina Astuti, M.E.');
  const [certSpeaker2Sign, setCertSpeaker2Sign] = useState(settings.certSpeaker2Sign || '');
  const [certSpeaker2Title, setCertSpeaker2Title] = useState(settings.certSpeaker2Title || 'NARASUMBER II');
  const [certSpeaker2Active, setCertSpeaker2Active] = useState(settings.certSpeaker2Active !== undefined ? settings.certSpeaker2Active : true);
  const [certSpeaker3Name, setCertSpeaker3Name] = useState(settings.certSpeaker3Name || 'Bapak Budi Santoso, S.E.');
  const [certSpeaker3Sign, setCertSpeaker3Sign] = useState(settings.certSpeaker3Sign || '');
  const [certSpeaker3Title, setCertSpeaker3Title] = useState(settings.certSpeaker3Title || 'NARASUMBER III');
  const [certSpeaker3Active, setCertSpeaker3Active] = useState(settings.certSpeaker3Active !== undefined ? settings.certSpeaker3Active : true);
  const [certSealImgUrl, setCertSealImgUrl] = useState(settings.certSealImgUrl || '');

  // Features list item CRUD helpers
  const [newFeatureTitle, setNewFeatureTitle] = useState('');
  const [newFeatureDesc, setNewFeatureDesc] = useState('');
  const [editingFeatureId, setEditingFeatureId] = useState<string | null>(null);

  const [successMsg, setSuccessMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'webinars' | 'users' | 'api'>('overview');

  // User list search & filter states
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userFilterWebinarId, setUserFilterWebinarId] = useState('');
  const [resetPasswordUser, setResetPasswordUser] = useState<User | null>(null);
  const [newPasswordValue, setNewPasswordValue] = useState('');

  // Real-time state subscription to DB
  React.useEffect(() => {
    const unsubscribe = DB.subscribe(() => {
      setWebinars(DB.getWebinars());
      setUsers(DB.getUsers());
      const latestSettings = DB.getSettings();
      setSettings(latestSettings);
      setRestrictZoomUnpaid(latestSettings.restrictZoomUnpaid || false);
      setBankInfoBank(latestSettings.bankInfoBank || 'Bank BCA');
      setBankInfoNumber(latestSettings.bankInfoNumber || '8830123456');
      setBankInfoName(latestSettings.bankInfoName || 'CV UMKM Digital Indonesia');
      
      setLandingTitle(latestSettings.landingTitle || '');
      setLandingSubTitle(latestSettings.landingSubTitle || '');
      setLandingHeroBadge(latestSettings.landingHeroBadge || '');
      setLandingHeroTitle(latestSettings.landingHeroTitle || '');
      setLandingHeroDesc(latestSettings.landingHeroDesc || '');
      setLandingAgendaTitle(latestSettings.landingAgendaTitle || '');
      setLandingFilterLabel(latestSettings.landingFilterLabel || '');
      setLandingLogoUrl(latestSettings.landingLogoUrl || '');
      setFeaturesList(latestSettings.featuresList || []);
      setTopicsList(latestSettings.topicsList || [
        { id: 'topic-1', name: 'Kuliner' },
        { id: 'topic-2', name: 'Retail' },
        { id: 'topic-3', name: 'Ekspor' },
        { id: 'topic-4', name: 'Digital Marketing' }
      ]);

      setCertSpeaker1Name(latestSettings.certSpeaker1Name || 'Dr. H. Sandiaga Uno, B.B.A.');
      setCertSpeaker1Sign(latestSettings.certSpeaker1Sign || '');
      setCertSpeaker1Title(latestSettings.certSpeaker1Title || 'NARASUMBER I');
      setCertSpeaker1Active(latestSettings.certSpeaker1Active !== undefined ? latestSettings.certSpeaker1Active : true);
      setCertSpeaker2Name(latestSettings.certSpeaker2Name || 'Ibu Rina Astuti, M.E.');
      setCertSpeaker2Sign(latestSettings.certSpeaker2Sign || '');
      setCertSpeaker2Title(latestSettings.certSpeaker2Title || 'NARASUMBER II');
      setCertSpeaker2Active(latestSettings.certSpeaker2Active !== undefined ? latestSettings.certSpeaker2Active : true);
      setCertSpeaker3Name(latestSettings.certSpeaker3Name || 'Bapak Budi Santoso, S.E.');
      setCertSpeaker3Sign(latestSettings.certSpeaker3Sign || '');
      setCertSpeaker3Title(latestSettings.certSpeaker3Title || 'NARASUMBER III');
      setCertSpeaker3Active(latestSettings.certSpeaker3Active !== undefined ? latestSettings.certSpeaker3Active : true);
      setCertSealImgUrl(latestSettings.certSealImgUrl || '');
    });
    return unsubscribe;
  }, []);

  const reloadData = () => {
    setWebinars(DB.getWebinars());
    setUsers(DB.getUsers());
    const latestSettings = DB.getSettings();
    setSettings(latestSettings);
    setRestrictZoomUnpaid(latestSettings.restrictZoomUnpaid || false);
    setBankInfoBank(latestSettings.bankInfoBank || 'Bank BCA');
    setBankInfoNumber(latestSettings.bankInfoNumber || '8830123456');
    setBankInfoName(latestSettings.bankInfoName || 'CV UMKM Digital Indonesia');
    
    setLandingTitle(latestSettings.landingTitle || '');
    setLandingSubTitle(latestSettings.landingSubTitle || '');
    setLandingHeroBadge(latestSettings.landingHeroBadge || '');
    setLandingHeroTitle(latestSettings.landingHeroTitle || '');
    setLandingHeroDesc(latestSettings.landingHeroDesc || '');
    setLandingAgendaTitle(latestSettings.landingAgendaTitle || '');
    setLandingFilterLabel(latestSettings.landingFilterLabel || '');
    setLandingLogoUrl(latestSettings.landingLogoUrl || '');
    setFeaturesList(latestSettings.featuresList || []);
    setTopicsList(latestSettings.topicsList || [
      { id: 'topic-1', name: 'Kuliner' },
      { id: 'topic-2', name: 'Retail' },
      { id: 'topic-3', name: 'Ekspor' },
      { id: 'topic-4', name: 'Digital Marketing' }
    ]);

    setCertSpeaker1Name(latestSettings.certSpeaker1Name || 'Dr. H. Sandiaga Uno, B.B.A.');
    setCertSpeaker1Sign(latestSettings.certSpeaker1Sign || '');
    setCertSpeaker1Title(latestSettings.certSpeaker1Title || 'NARASUMBER I');
    setCertSpeaker1Active(latestSettings.certSpeaker1Active !== undefined ? latestSettings.certSpeaker1Active : true);
    setCertSpeaker2Name(latestSettings.certSpeaker2Name || 'Ibu Rina Astuti, M.E.');
    setCertSpeaker2Sign(latestSettings.certSpeaker2Sign || '');
    setCertSpeaker2Title(latestSettings.certSpeaker2Title || 'NARASUMBER II');
    setCertSpeaker2Active(latestSettings.certSpeaker2Active !== undefined ? latestSettings.certSpeaker2Active : true);
    setCertSpeaker3Name(latestSettings.certSpeaker3Name || 'Bapak Budi Santoso, S.E.');
    setCertSpeaker3Sign(latestSettings.certSpeaker3Sign || '');
    setCertSpeaker3Title(latestSettings.certSpeaker3Title || 'NARASUMBER III');
    setCertSpeaker3Active(latestSettings.certSpeaker3Active !== undefined ? latestSettings.certSpeaker3Active : true);
    setCertSealImgUrl(latestSettings.certSealImgUrl || '');
    if (onRefreshAllData) onRefreshAllData();
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSettings: SystemSettings = {
      ...settings,
      zoomApiKey,
      zoomConnected,
      googleCalendarConnected,
      midtransConnected,
      midtransClientKey,
      restrictZoomUnpaid,
      bankInfoBank,
      bankInfoNumber,
      bankInfoName,
      ticketPrice: Number(ticketPrice),
      landingTitle,
      landingSubTitle,
      landingHeroBadge,
      landingHeroTitle,
      landingHeroDesc,
      landingAgendaTitle,
      landingFilterLabel,
      landingLogoUrl,
      featuresList,
      certSpeaker1Name,
      certSpeaker1Sign,
      certSpeaker1Title,
      certSpeaker1Active,
      certSpeaker2Name,
      certSpeaker2Sign,
      certSpeaker2Title,
      certSpeaker2Active,
      certSpeaker3Name,
      certSpeaker3Sign,
      certSpeaker3Title,
      certSpeaker3Active,
      certSealImgUrl,
      topicsList
    };
    DB.saveSettings(updatedSettings);
    setSettings(updatedSettings);
    setSuccessMsg('Konfigurasi Pengaturan & API berhasil diperbarui.');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleAddTopic = () => {
    if (!newTopicName.trim()) return;
    const newTopic = {
      id: editingTopicId || `topic-${Date.now()}`,
      name: newTopicName.trim()
    };
    let updatedList = [];
    if (editingTopicId) {
      updatedList = topicsList.map((t: any) => t.id === editingTopicId ? newTopic : t);
    } else {
      updatedList = [...topicsList, newTopic];
    }
    setTopicsList(updatedList);
    setNewTopicName('');
    setEditingTopicId(null);
  };

  const handleEditTopic = (t: TopicCategory) => {
    setNewTopicName(t.name);
    setEditingTopicId(t.id);
  };

  const handleDeleteTopic = (id: string) => {
    const updatedList = topicsList.filter((t: any) => t.id !== id);
    setTopicsList(updatedList);
  };

  const handleAddFeature = () => {
    if (!newFeatureTitle || !newFeatureDesc) return;
    const newFeat = {
      id: editingFeatureId || `feat-${Date.now()}`,
      title: newFeatureTitle,
      description: newFeatureDesc
    };
    let updatedList = [];
    if (editingFeatureId) {
      updatedList = featuresList.map((f: any) => f.id === editingFeatureId ? newFeat : f);
    } else {
      updatedList = [...featuresList, newFeat];
    }
    setFeaturesList(updatedList);
    setNewFeatureTitle('');
    setNewFeatureDesc('');
    setEditingFeatureId(null);
  };

  const handleEditFeature = (feat: any) => {
    setNewFeatureTitle(feat.title);
    setNewFeatureDesc(feat.description);
    setEditingFeatureId(feat.id);
  };

  const handleDeleteFeature = (id: string) => {
    const updatedList = featuresList.filter((f: any) => f.id !== id);
    setFeaturesList(updatedList);
  };

  const handleUserRoleChange = (email: string, newRole: 'peserta' | 'admin' | 'superadmin') => {
    const target = DB.getUserByEmail(email);
    if (target) {
      target.role = newRole;
      DB.updateUser(target);
      reloadData();
      setSuccessMsg(`Hak akses peran ${target.namaLengkap} diubah menjadi ${newRole.toUpperCase()}.`);
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const handleOpenNewWebinarForm = () => {
    setIsEditingWebinar('new');
    setTitle('');
    setSpeaker('');
    setSpeakerTitle('');
    setDate('');
    setTime('13:00 - 15:00 WIB');
    setStatus('upcoming');
    setDescription('');
    setMaterialUrl('');
    setMaterialAudioUrl('');
    setMaterialVideoUrl('');
    setRecordingUrl('');
    setWebinarPrice(50000);
    setCategory('');
    const randomZoomId = Math.floor(100000000 + Math.random() * 900000000);
    const randomPasscode = Math.random().toString(36).substring(2, 8).toUpperCase();
    setZoomJoinUrl(`https://zoom.us/j/${randomZoomId}?pwd=${randomPasscode}`);
    setZoomStartUrl(`https://zoom.us/s/${randomZoomId}?pwd=${randomPasscode}`);
    
    // Reset rundown states
    setRundownList([]);
    setRdTime('');
    setRdTitle('');
    setRdType('session');
    setEditingRdId(null);
  };

  const handleOpenEditWebinarForm = (w: Webinar) => {
    setIsEditingWebinar(w.id);
    setTitle(w.title);
    setSpeaker(w.speaker);
    setSpeakerTitle(w.speakerTitle);
    setDate(w.date);
    setTime(w.time);
    setStatus(w.status);
    setDescription(w.description);
    setMaterialUrl(w.materialUrl || '');
    setMaterialAudioUrl(w.materialAudioUrl || '');
    setMaterialVideoUrl(w.materialVideoUrl || '');
    setRecordingUrl(w.recordingUrl || '');
    setZoomJoinUrl(w.zoomJoinUrl || '');
    setZoomStartUrl(w.zoomStartUrl || '');
    setWebinarPrice(w.price !== undefined ? w.price : (settings.ticketPrice || 0));
    setCategory(w.category || '');
    
    // Load existing rundown or fallback to empty array
    setRundownList(w.rundown || []);
    setRdTime('');
    setRdTitle('');
    setRdType('session');
    setEditingRdId(null);
  };

  const handleAddOrUpdateRundownItem = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!rdTime || !rdTitle) {
      alert('Mohon lengkapi Waktu dan Agenda/Judul Rundown.');
      return;
    }

    if (editingRdId) {
      // update
      setRundownList(prev => prev.map(item => 
        item.id === editingRdId 
          ? { ...item, time: rdTime, title: rdTitle, type: rdType }
          : item
      ));
      setEditingRdId(null);
    } else {
      // create
      const newItem: RundownItem = {
        id: `rd-item-${Date.now()}`,
        time: rdTime,
        title: rdTitle,
        type: rdType
      };
      setRundownList(prev => [...prev, newItem]);
    }

    // Reset inputs
    setRdTime('');
    setRdTitle('');
    setRdType('session');
  };

  const handleEditRundownItem = (item: RundownItem) => {
    setEditingRdId(item.id);
    setRdTime(item.time);
    setRdTitle(item.title);
    setRdType(item.type);
  };

  const handleDeleteRundownItem = (id: string) => {
    setRundownList(prev => prev.filter(item => item.id !== id));
    if (editingRdId === id) {
      setEditingRdId(null);
      setRdTime('');
      setRdTitle('');
      setRdType('session');
    }
  };

  const handleCancelEditRundownItem = () => {
    setEditingRdId(null);
    setRdTime('');
    setRdTitle('');
    setRdType('session');
  };

  const handleSaveWebinar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !speaker || !date || !time) {
      alert('Mohon lengkapi judul, narasumber, tanggal dan jam webinar.');
      return;
    }

    // Coerce other live webinars to completed if setting status to live
    if (status === 'live') {
      const allWebinars = DB.getWebinars();
      allWebinars.forEach(w => {
        // Exclude the current editing item to avoid nested save conflicts
        if (w.id !== isEditingWebinar && w.status === 'live') {
          const updated = { ...w, status: 'completed' as const };
          DB.updateWebinar(updated);
        }
      });
    }

    if (isEditingWebinar === 'new') {
      const newWeb: Webinar = {
        id: `webinar-${Date.now()}`,
        title,
        speaker,
        speakerTitle,
        date,
        time,
        status,
        description,
        materialUrl: materialUrl || undefined,
        materialAudioUrl: materialAudioUrl || undefined,
        materialVideoUrl: materialVideoUrl || undefined,
        recordingUrl: recordingUrl || undefined,
        zoomJoinUrl: zoomJoinUrl || 'https://zoom.us/j/' + Math.floor(100000000 + Math.random() * 900000000),
        zoomStartUrl: zoomStartUrl || 'https://zoom.us/s/' + Math.floor(100000000 + Math.random() * 900000000) + '_start',
        registeredCount: 0,
        price: Number(webinarPrice),
        category: category || undefined,
        rundown: rundownList
      };
      DB.addWebinar(newWeb);
      setSuccessMsg('Jadwal Webinar baru berhasil ditambahkan.');
    } else if (isEditingWebinar) {
      const existing = DB.getWebinarById(isEditingWebinar);
      if (existing) {
        const updatedWeb: Webinar = {
          ...existing,
          title,
          speaker,
          speakerTitle,
          date,
          time,
          status,
          description,
          materialUrl: materialUrl || undefined,
          materialAudioUrl: materialAudioUrl || undefined,
          materialVideoUrl: materialVideoUrl || undefined,
          recordingUrl: recordingUrl || undefined,
          zoomJoinUrl: zoomJoinUrl || existing.zoomJoinUrl,
          zoomStartUrl: zoomStartUrl || existing.zoomStartUrl,
          price: Number(webinarPrice),
          category: category || undefined,
          rundown: rundownList
        };
        DB.updateWebinar(updatedWeb);
        setSuccessMsg('Data webinar berhasil diperbarui.');
      }
    }

    setIsEditingWebinar(null);
    reloadData();
    setTimeout(() => setSuccessMsg(''), 4050);
  };

  const handleDeleteWebinar = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus jadwal webinar ini? Tindakan ini bersifat permanen.')) {
      DB.deleteWebinar(id);
      reloadData();
      setSuccessMsg('Jadwal webinar berhasil dihapus dari sistem.');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  // Bidang usaha demographic statistics calculation
  const statsBidangUsaha: Record<string, number> = {
    'Kuliner': 0,
    'Fashion': 0,
    'Perdagangan': 0,
    'Agrobisnis & Pertanian': 0,
    'Produk Kreatif & Kerajinan': 0,
    'Jasa': 0,
    'Teknologi': 0,
    'Lainnya': 0
  };

  users.forEach((u) => {
    if (u.role === 'peserta') {
      const key = u.bidangUsaha || 'Lainnya';
      if (statsBidangUsaha[key] !== undefined) {
        statsBidangUsaha[key] += 1;
      } else {
        statsBidangUsaha['Lainnya'] += 1;
      }
    }
  });

  const totalPesertaCount = users.filter(u => u.role === 'peserta').length;
  const totalRegistrationsCount = webinars.reduce((sum, w) => sum + (w.registeredCount || 0), 0);
  const activeUsersCount = users.filter(u => u.role === 'peserta' && u.registeredWebinars && u.registeredWebinars.length > 0).length;
  const totalCheckInsCount = users.reduce((sum, u) => sum + (u.checkedIn?.length || 0), 0);
  const attendanceRate = totalRegistrationsCount > 0 ? (totalCheckInsCount / totalRegistrationsCount) * 100 : 0;
  const totalCalculatedSales = webinars.reduce((sum, w) => {
    const p = w.price !== undefined ? w.price : (settings.midtransConnected ? settings.ticketPrice : 0);
    return sum + ((w.registeredCount || 0) * p);
  }, 0);

  const filteredUsers = users.filter(u => {
    const query = userSearchQuery.trim().toLowerCase();
    const matchSearch = !query || 
      u.namaLengkap.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      u.whatsapp.toLowerCase().includes(query) ||
      (u.namaUsaha && u.namaUsaha.toLowerCase().includes(query)) ||
      (u.bidangUsaha && u.bidangUsaha.toLowerCase().includes(query));

    const matchWebinar = userFilterWebinarId === '' || u.registeredWebinars.includes(userFilterWebinarId);

    return matchSearch && matchWebinar;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Super Admin header */}
      <div className="glass border border-white/10 rounded-2xl p-6 mb-8 shadow-xl accent-glow-indigo">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between justify-start gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-indigo-650 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono">⚜️ Super Admin</span>
              <span className="text-slate-400 text-xs font-mono font-sans">• Kontrol Utama Aplikasi</span>
            </div>
            <h1 className="text-2xl font-sans font-extrabold text-slate-100 mt-1">
              Panel Kendali Webinar UMKM Online
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-sans">
              Monitor statistik pengunjung harian, sunting hak akses kustom multi-peran, atur integrasi Midtrans, Zoom, Google Calendar, serta kelola jadwal webinar.
            </p>
          </div>

          <button
            onClick={reloadData}
            id="btn-refresh-data"
            className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white rounded-xl text-xs flex items-center space-x-1.5 transition-all border border-white/10 font-mono cursor-pointer shrink-0 self-start"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Muat Ulang DB</span>
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-t border-white/5 mt-6 pt-4 space-x-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            id="tab-overview"
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
              activeTab === 'overview' ? 'bg-indigo-600 text-white font-extrabold shadow shadow-indigo-600/20' : 'text-slate-400 hover:text-slate-250 hover:bg-white/5'
            }`}
          >
            Ringkasan Analitik
          </button>
          <button
            onClick={() => setActiveTab('webinars')}
            id="tab-webinars"
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
              activeTab === 'webinars' ? 'bg-indigo-600 text-white font-extrabold shadow shadow-indigo-600/20' : 'text-slate-400 hover:text-slate-250 hover:bg-white/5'
            }`}
          >
            Kelola Webinar
          </button>
          <button
            onClick={() => setActiveTab('users')}
            id="tab-users"
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
              activeTab === 'users' ? 'bg-indigo-600 text-white font-extrabold shadow shadow-indigo-600/20' : 'text-slate-400 hover:text-slate-250 hover:bg-white/5'
            }`}
          >
            Manajemen Role & User
          </button>
          <button
            onClick={() => setActiveTab('api')}
            id="tab-api"
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
              activeTab === 'api' ? 'bg-indigo-600 text-white font-extrabold shadow shadow-indigo-600/20' : 'text-slate-400 hover:text-slate-250 hover:bg-white/5'
            }`}
          >
            Integrasi API & Gateway
          </button>
        </div>
      </div>

      {successMsg && (
        <div id="superadmin-success-toast" className="bg-indigo-500/15 border border-indigo-500/25 text-indigo-305 p-3 rounded-xl text-xs flex items-center space-x-2 mb-6 animate-in fade-in slide-in-from-top-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* TAB CONTENTS */}
      
      {/* 1. ringkasan analitik */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          
          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass border border-white/10 rounded-2xl p-4 flex items-center space-x-3.5 shadow-lg">
              <div className="p-3 bg-indigo-500/15 text-indigo-300 rounded-xl">
                <Users className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="block text-[10px] uppercase font-mono tracking-wider text-slate-400">User Aktif (UMKM)</span>
                <span className="text-lg font-extrabold text-slate-100">{activeUsersCount} / {totalPesertaCount} Orang</span>
              </div>
            </div>

            <div className="glass border border-white/10 rounded-2xl p-4 flex items-center space-x-3.5 shadow-lg">
              <div className="p-3 bg-indigo-505/15 text-indigo-300 rounded-xl">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[10px] uppercase font-mono tracking-wider text-slate-400">Total Registrasi</span>
                <span className="text-lg font-extrabold text-slate-100">{totalRegistrationsCount} Tiket</span>
              </div>
            </div>

            <div className="glass border border-white/10 rounded-2xl p-4 flex items-center space-x-3.5 shadow-lg">
              <div className="p-3 bg-emerald-500/15 text-emerald-300 rounded-xl">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[10px] uppercase font-mono tracking-wider text-slate-400">Penjualan Tiket</span>
                <span className="text-lg font-extrabold text-slate-100 font-mono text-emerald-400">Rp {totalCalculatedSales.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="glass border border-white/10 rounded-2xl p-4 flex items-center space-x-3.5 shadow-lg">
              <div className="p-3 bg-indigo-500/15 text-indigo-300 rounded-xl">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[10px] uppercase font-mono tracking-wider text-slate-400">Rasio Kehadiran</span>
                <span className="text-lg font-extrabold text-slate-100 font-mono">{attendanceRate.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Bidang Usaha Distribution Chart */}
            <div className="lg:col-span-7 glass border border-white/10 rounded-2xl p-5 space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-205">Demografi Bidang Usaha Peserta</h3>
                  <p className="text-[11px] text-slate-400">Sebaran pendaftar berdasarkan jenis komoditas usaha mikro.</p>
                </div>
                <BarChart2 className="w-4 h-4 text-slate-500" />
              </div>

              {/* Native responsive SVG layout bar graph */}
              <div className="space-y-3 pt-2 font-sans">
                {Object.entries(statsBidangUsaha).map(([label, count]) => {
                  const percentage = totalPesertaCount > 0 ? (count / totalPesertaCount) * 100 : 0;
                  
                  return (
                    <div key={label} className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-300 font-medium">{label}</span>
                        <span className="text-slate-400 font-mono">{count} UMKM ({percentage.toFixed(0)}%)</span>
                      </div>
                      
                      {/* Bar indicator */}
                      <div className="w-full bg-slate-950/40 rounded-full h-2 overflow-hidden border border-white/5">
                        <div 
                          className="bg-gradient-to-r from-indigo-500 to-indigo-650 h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(percentage, 2)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Audit Check List */}
            <div className="lg:col-span-5 glass border border-white/10 rounded-2xl p-5 space-y-4 shadow-lg">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h4 className="text-xs font-bold text-slate-200">User & Integrasi Overview</h4>
                <TrendingUp className="w-4 h-4 text-indigo-400" />
              </div>

              <div className="space-y-4 text-xs font-sans">
                <div className="p-3.5 bg-slate-955/40 rounded-xl border border-white/5 space-y-2.5">
                  <h5 className="font-bold text-slate-300 font-mono uppercase text-[10px] tracking-wider">Pembagian Peran Sistem</h5>
                  <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                    <div className="bg-indigo-950/30 border border-indigo-500/10 rounded-lg p-2">
                      <span className="block font-bold text-indigo-300 text-sm font-mono">{totalPesertaCount}</span>
                      <span className="text-slate-400">Peserta</span>
                    </div>
                    <div className="bg-indigo-950/30 border border-indigo-500/10 rounded-lg p-2">
                      <span className="block font-bold text-slate-300 text-sm font-mono">{users.filter(u => u.role === 'admin').length}</span>
                      <span className="text-slate-400">Moderator</span>
                    </div>
                    <div className="bg-indigo-950/30 border border-indigo-500/10 rounded-lg p-2">
                      <span className="block font-bold text-slate-300 text-sm font-mono">{users.filter(u => u.role === 'superadmin').length}</span>
                      <span className="text-slate-400">Super Admin</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className={`p-1 rounded-full ${zoomConnected ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20' : 'bg-white/5 text-slate-500 border border-white/5'}`}>
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-250">Webinar Room API Integrasi Zoom</h5>
                    <p className="text-[10px] text-slate-400">{zoomConnected ? 'Tersambung mendeteksi credentials JWT' : 'Zoom API tidak diaktifkan'}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className={`p-1 rounded-full ${googleCalendarConnected ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20' : 'bg-white/5 text-slate-500 border border-white/5'}`}>
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-250">Google Calendar Synchronization</h5>
                    <p className="text-[10px] text-slate-400">{googleCalendarConnected ? 'Otomatis sinkron saat jadwal webinar baru dibuat' : 'Belum tersambung OAuth'}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className={`p-1 rounded-full ${midtransConnected ? 'bg-indigo-500/15 text-indigo-305 border border-indigo-500/20' : 'bg-white/5 text-slate-500 border border-white/5'}`}>
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-250">Midtrans Payment Gateway (Sandbox)</h5>
                    <p className="text-[10px] text-slate-400">{midtransConnected ? `Kunci Klien aktif: ${midtransClientKey}` : 'Sistem berbayar Nonaktif (Default Seminar Gratis)'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Ticket Sales Report */}
          <div className="glass border border-white/10 rounded-2xl p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-1.5 font-sans">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  Laporan Real-time Penjualan Tiket Webinar UMKM (Cloud Firestore)
                </h3>
                <p className="text-[11px] text-slate-400">Rincian pendapatan registrasi kelas gratis/berbayar berdasar jumlah pendaftar real-time yang tersinkron.</p>
              </div>
              <span className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 font-mono text-[9px] px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">
                Firestore Live Sync
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-sans">
                <thead>
                  <tr className="border-b border-white/5 text-slate-400 font-mono text-[10px] uppercase tracking-wider">
                    <th className="pb-2.5 font-bold">Topik Kelas Webinar</th>
                    <th className="pb-2.5 font-bold text-center">Status Kelas</th>
                    <th className="pb-2.5 font-bold text-right">Harga Satuan</th>
                    <th className="pb-2.5 font-bold text-center">Registrasi (UMKM)</th>
                    <th className="pb-2.5 font-bold text-right">Total Penjualan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {webinars.map(w => {
                    const price = w.price !== undefined ? w.price : (settings.midtransConnected ? settings.ticketPrice : 0);
                    const sales = (w.registeredCount || 0) * price;
                    return (
                      <tr key={w.id} className="text-slate-300 hover:bg-white/5 transition-colors">
                        <td className="py-3 font-semibold text-slate-205">{w.title}</td>
                        <td className="py-3 text-center">
                          <span className={`px-2 py-0.5 text-[9px] font-mono rounded font-bold uppercase ${
                            w.status === 'live' ? 'bg-rose-500/10 border border-rose-500/20 text-rose-300 animate-pulse' :
                            w.status === 'upcoming' ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-300' :
                            'bg-slate-500/10 border border-slate-500/20 text-slate-400'
                          }`}>
                            {w.status}
                          </span>
                        </td>
                        <td className="py-3 text-right font-mono">
                          {price > 0 ? `Rp ${price.toLocaleString('id-ID')}` : 'Gratis'}
                        </td>
                        <td className="py-3 text-center font-mono font-bold text-indigo-305">{w.registeredCount || 0} pendaftar</td>
                        <td className="py-3 text-right font-mono text-emerald-400 font-extrabold text-sm">
                          Rp {sales.toLocaleString('id-ID')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            <div className="bg-slate-950/30 rounded-xl p-3.5 flex flex-col sm:flex-row justify-between items-center text-xs gap-3 font-mono border border-white/5">
              <div className="text-slate-400">
                Skema Integrasi Gateway: <strong className="text-indigo-400 font-bold">{settings.midtransConnected ? 'Midtrans Production / Sandbox (Aktif)' : 'Kelas Beasiswa (Subsidized Gratis)'}</strong>
              </div>
              <div className="text-slate-300">
                Hub Penjualan Kumulatif: <strong className="text-emerald-400 text-sm font-extrabold">Rp {totalCalculatedSales.toLocaleString('id-ID')}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. kelola webinar schedules CRUD */}
      {activeTab === 'webinars' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-205 font-sans">Jadwal Kelas Webinar Aktif</h2>
            <button
              onClick={handleOpenNewWebinarForm}
              id="btn-add-webinar-trigger"
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-505 text-white font-bold text-xs rounded-xl flex items-center space-x-1 transition-all cursor-pointer shadow-md shadow-indigo-600/10 accent-glow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Jadwal Baru</span>
            </button>
          </div>

          {/* Form Create / Edit */}
          {isEditingWebinar && (
            <form onSubmit={handleSaveWebinar} className="glass border border-white/10 rounded-2xl p-5 space-y-4 animate-in slide-in-from-top-3 shadow-xl" id="form-crud-webinar">
              <h3 className="text-xs font-bold font-mono tracking-wide text-indigo-451 uppercase">
                {isEditingWebinar === 'new' ? '✨ Tambah Schedule Webinar Baru' : '📝 Sunting Jadwal Webinar'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
                <div className="space-y-1.5">
                  <label className="block text-xs text-slate-300 font-medium">Judul Webinar</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Optimalisasi Iklan TikTok untuk UMKM"
                    id="crud-title"
                    className="w-full bg-slate-950/40 border border-white/10 text-slate-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-indigo-500 font-sans"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs text-slate-300 font-medium">Narasumber / Pembicara</label>
                  <input
                    type="text"
                    value={speaker}
                    onChange={(e) => setSpeaker(e.target.value)}
                    placeholder="Contoh: Budi Santoso, MBA"
                    id="crud-speaker"
                    className="w-full bg-slate-950/40 border border-white/10 text-slate-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-indigo-500 font-sans"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans">
                <div className="space-y-1.5">
                  <label className="block text-xs text-slate-300 font-medium">Gelar/Jabatan Pembicara</label>
                  <input
                    type="text"
                    value={speakerTitle}
                    onChange={(e) => setSpeakerTitle(e.target.value)}
                    placeholder="Contoh: CEO Digital Agency"
                    className="w-full bg-slate-950/40 border border-white/10 text-slate-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-indigo-500 font-sans"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs text-slate-300 font-medium">Tanggal Pelaksanaan</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    id="crud-date"
                    className="w-full bg-slate-950/40 border border-white/10 text-slate-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-indigo-500 whitespace-nowrap font-sans"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs text-slate-300 font-medium">Jam Pelaksanaan</label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="Contoh: 14:00 - 16:00 WIB"
                    id="crud-time"
                    className="w-full bg-slate-950/40 border border-white/10 text-slate-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-indigo-500 font-sans"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-sans">
                <div className="space-y-1.5">
                  <label className="block text-xs text-slate-300 font-medium">Status Webinar</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-slate-900 text-slate-200 border border-white/10 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500 cursor-pointer font-sans h-[38px]"
                  >
                    <option value="upcoming">upcoming</option>
                    <option value="live">live</option>
                    <option value="completed">completed</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs text-indigo-400 font-bold">Topik / Kategori</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-900 text-slate-200 border border-white/10 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500 cursor-pointer font-sans h-[38px]"
                  >
                    <option value="">-- Pilih Topik --</option>
                    {topicsList.map((t) => (
                      <option key={t.id} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs text-slate-300 font-medium">Link Slide PPT (PDF/Drive)</label>
                  <input
                    type="url"
                    value={materialUrl}
                    onChange={(e) => setMaterialUrl(e.target.value)}
                    placeholder="https://drive.google.com/..."
                    className="w-full bg-slate-950/40 border border-white/10 text-slate-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-indigo-500 font-sans"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs text-amber-400 font-bold">Harga Tiket Mandiri</label>
                  <input
                    type="number"
                    value={webinarPrice}
                    onChange={(e) => setWebinarPrice(Number(e.target.value))}
                    placeholder="Contoh: 50000"
                    className="w-full bg-slate-950/40 border border-white/10 text-slate-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-indigo-500 font-sans"
                  />
                  <p className="text-[10px] text-slate-400 font-sans leading-none mt-0.5">Misal: 50000, 0 jika gratis.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
                <div className="space-y-1.5">
                  <label className="block text-xs text-emerald-400 font-bold">Link Materi Audio / Podcast (Materi Lunas)</label>
                  <input
                    type="url"
                    value={materialAudioUrl}
                    onChange={(e) => setMaterialAudioUrl(e.target.value)}
                    placeholder="https://soundcloud.com/... / MP3 link"
                    className="w-full bg-slate-950/40 border border-white/10 text-slate-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-indigo-500 font-sans"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs text-indigo-400 font-bold">Link Materi Video / Youtube (Materi Lunas)</label>
                  <input
                    type="url"
                    value={materialVideoUrl}
                    onChange={(e) => setMaterialVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... atau link lain"
                    className="w-full bg-slate-950/40 border border-white/10 text-slate-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-indigo-500 font-sans"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-xs text-slate-300 font-medium">Link Youtube Video Rekaman Siaran (Status Completed - Registran Lunas)</label>
                  <input
                    type="url"
                    value={recordingUrl}
                    onChange={(e) => setRecordingUrl(e.target.value)}
                    placeholder="https://www.youtube.com/embed/..."
                    className="w-full bg-slate-950/40 border border-white/10 text-slate-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-indigo-500 font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans border-t border-white/5 pt-3">
                <div className="space-y-1.5">
                  <label className="block text-xs text-sky-400 font-bold">Link Zoom Pelaksanaan (Join Link - ID & Passcode tersemat)</label>
                  <input
                    type="url"
                    value={zoomJoinUrl}
                    onChange={(e) => setZoomJoinUrl(e.target.value)}
                    placeholder="https://zoom.us/j/123000789?pwd=..."
                    className="w-full bg-slate-950/40 border border-white/10 text-slate-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-sky-500 font-sans"
                    required
                  />
                  <span className="block text-[10px] text-slate-400">Tautan Zoom lengkap yang berisi Meeting ID dan parameter Passcode agar peserta langsung terhubung tanpa memasukkan password kembali.</span>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs text-slate-300 font-medium">Link Zoom Membuka Kelas (Start Link Host - Opsional)</label>
                  <input
                    type="url"
                    value={zoomStartUrl}
                    onChange={(e) => setZoomStartUrl(e.target.value)}
                    placeholder="https://zoom.us/s/123000789?pwd=..."
                    className="w-full bg-slate-950/40 border border-white/10 text-slate-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-indigo-500 font-sans"
                  />
                  <span className="block text-[10px] text-slate-400">Tautan pembuka host agar admin dapat langsung meluncurkan meeting Zoom sebagai host/pemateri dari dashboard.</span>
                </div>
              </div>

              <div className="space-y-1.5 font-sans">
                <label className="block text-xs text-slate-300 font-medium">Deskripsi Webinar</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ceritakan detail poin pembelajaran kelas webinar ini untuk calon pendaftar..."
                  rows={3}
                  className="w-full bg-slate-950/40 border border-white/10 text-slate-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-indigo-500 font-sans"
                ></textarea>
              </div>

              {/* WEBINAR RUNDOWN EDITOR */}
              <div className="bg-slate-950/35 border border-white/5 rounded-xl p-4 space-y-4 font-sans">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-slate-200">🕛 Atur Susunan Rundown Acara</span>
                </div>
                
                {/* List of current rundown items */}
                {rundownList.length === 0 ? (
                  <p className="text-[11px] text-slate-400 italic">Belum ada agenda rundown yang ditambahkan. Gunakan form di bawah untuk membuat agenda.</p>
                ) : (
                  <div className="space-y-2">
                    {rundownList.map((item, index) => {
                      return (
                        <div key={item.id || index} className="flex items-center justify-between bg-slate-900/60 border border-white/5 p-2.5 rounded-xl text-xs">
                          <div className="flex items-center space-x-3">
                            <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-300 border border-indigo-500/10 rounded font-mono text-[10px]">
                              {item.time}
                            </span>
                            <span className="text-slate-250 font-medium">{item.title}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-bold ${
                              item.type === 'start' ? 'bg-emerald-500/10 text-emerald-400' :
                              item.type === 'break' ? 'bg-amber-500/10 text-amber-400' :
                              item.type === 'end' ? 'bg-rose-500/10 text-rose-400' :
                              'bg-indigo-500/10 text-indigo-400'
                            }`}>
                              {item.type}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleEditRundownItem(item)}
                              className="p-1 hover:bg-white/5 text-slate-400 hover:text-slate-200 rounded transition cursor-pointer"
                              title="Sunting"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteRundownItem(item.id)}
                              className="p-1 hover:bg-white/5 text-rose-400 hover:text-rose-300 rounded transition cursor-pointer"
                              title="Hapus"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Form to add or edit item */}
                <div className="bg-slate-900/40 border border-white/5 p-3 rounded-xl space-y-3">
                  <span className="block text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                    {editingRdId ? '📝 Edit Item Rundown' : '➕ Tambah Item Rundown Baru'}
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-3 space-y-1">
                      <label className="block text-[10px] text-slate-400 font-medium">Rentang Waktu</label>
                      <input
                        type="text"
                        value={rdTime}
                        onChange={(e) => setRdTime(e.target.value)}
                        placeholder="Misal: 09.00 - 09.15"
                        className="w-full bg-slate-950/40 border border-white/10 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="sm:col-span-5 space-y-1">
                      <label className="block text-[10px] text-slate-400 font-medium">Judul Agenda / Kegiatan</label>
                      <input
                        type="text"
                        value={rdTitle}
                        onChange={(e) => setRdTitle(e.target.value)}
                        placeholder="Misal: Pembukaan & Sambutan"
                        className="w-full bg-slate-950/40 border border-white/10 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="sm:col-span-4 space-y-1">
                      <label className="block text-[10px] text-slate-400 font-medium">Jenis Agenda</label>
                      <div className="flex space-x-1.5">
                        <select
                          value={rdType}
                          onChange={(e) => setRdType(e.target.value as any)}
                          className="flex-1 bg-slate-900 text-slate-200 border border-white/10 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-indigo-500 cursor-pointer h-[30px]"
                        >
                          <option value="start">start (Pembukaan)</option>
                          <option value="session">session (Materi)</option>
                          <option value="break">break (Coffee Break)</option>
                          <option value="end">end (Penutup)</option>
                        </select>

                        <button
                          type="button"
                          onClick={handleAddOrUpdateRundownItem}
                          className="px-3 bg-indigo-650 hover:bg-indigo-550 text-white font-bold text-xs rounded-lg transition-all cursor-pointer shrink-0"
                        >
                          {editingRdId ? 'Simpan' : 'Tambah'}
                        </button>
                        
                        {editingRdId && (
                          <button
                            type="button"
                            onClick={handleCancelEditRundownItem}
                            className="px-2.5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs rounded-lg transition border border-white/5 cursor-pointer shrink-0"
                          >
                            Batal
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingWebinar(null)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 text-xs rounded-xl transition border border-white/5 cursor-pointer font-sans"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  id="btn-crud-save"
                  className="px-5 py-2 bg-indigo-650 hover:bg-indigo-550 text-white font-bold text-xs rounded-xl transition shadow-md shadow-indigo-600/10 cursor-pointer font-sans accent-glow"
                >
                  Simpan Jadwal
                </button>
              </div>
            </form>
          )}

          {/* List existing webinars with CRUD controls */}
          <div className="space-y-3">
            {webinars.map(w => (
              <div key={w.id} className="glass border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row md:items-center md:justify-between justify-start gap-4 shadow-md transition-all hover:border-indigo-500/20">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase border ${
                      w.status === 'live' 
                        ? 'bg-rose-500/10 text-rose-300 border-rose-550/20' 
                        : w.status === 'upcoming' 
                          ? 'bg-indigo-500/15 text-indigo-300 border-indigo-550/20'
                          : 'bg-white/5 text-slate-400 border-white/5'
                    }`}>
                      {w.status}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{w.date} • {w.time}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-200 font-sans">{w.title}</h3>
                  <p className="text-[11px] text-slate-400 font-sans">Narasumber: <strong className="text-slate-350">{w.speaker}</strong> • {w.registeredCount} UMKM Terdaftar</p>
                </div>

                <div className="flex space-x-2 shrink-0">
                  <button
                    onClick={() => handleOpenEditWebinarForm(w)}
                    id={`btn-edit-webinar-${w.id}`}
                    className="p-1.5 bg-white/5 hover:bg-indigo-600/20 hover:text-indigo-300 text-slate-400 rounded-lg border border-white/5 transition-colors cursor-pointer"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteWebinar(w.id)}
                    id={`btn-delete-webinar-${w.id}`}
                    className="p-1.5 bg-white/5 hover:bg-rose-600/20 hover:text-rose-400 text-slate-400 rounded-lg border border-white/5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Manajemen Role kustom (User Role Editor) */}
      {activeTab === 'users' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="border-b border-white/5 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-slate-205 font-sans flex items-center space-x-2">
                <span>User Role Editor & Manajemen Hak Akses</span>
                <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/15 px-2 py-0.5 rounded-full font-mono font-medium">
                  {filteredUsers.length} dari {users.length} Akun
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-1 font-sans">Ubah peran akun secara dinamis dan kelola sandi atau filter peserta per sesi pendaftaran secara instan.</p>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-slate-900/60 p-4 rounded-2xl border border-white/5">
            {/* Search Input */}
            <div className="relative md:col-span-7">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Search className="w-4 h-4 text-slate-450" />
              </span>
              <input
                type="text"
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                placeholder="Cari nama lengkap, email, nomor HP/WA, atau nama usaha..."
                className="w-full bg-slate-950/40 border border-white/10 text-slate-200 text-xs rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-indigo-500 font-sans transition-all placeholder-slate-500"
              />
              {userSearchQuery && (
                <button
                  onClick={() => setUserSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Webinar Dropdown Filter */}
            <div className="md:col-span-5 flex items-center space-x-2 w-full">
              <span className="text-[11px] text-slate-400 font-medium font-sans shrink-0">Filter Kelas/Sesi:</span>
              <select
                value={userFilterWebinarId}
                onChange={(e) => setUserFilterWebinarId(e.target.value)}
                className="w-full bg-slate-950/40 text-slate-250 border border-white/10 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs outline-none cursor-pointer h-[38px] font-sans transition"
              >
                <option value="">Semua Kelas Webinar</option>
                {webinars.map(web => (
                  <option key={web.id} value={web.id}>
                    {web.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="glass border border-white/10 rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-955/40 text-slate-300 uppercase tracking-wider font-sans text-[10px] border-b border-white/5">
                  <tr>
                    <th className="p-4">Nama Lengkap & Usaha</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">No. HP / WA</th>
                    <th className="p-4">Sesi & Hak Akses Pendaftaran (Lunas / Ikut)</th>
                    <th className="p-4">Hak Akses Peran (Role)</th>
                    <th className="p-4 text-center">Aksi / Keamanan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-200 font-sans">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400 italic font-sans text-xs">
                        Tidak ada pengguna yang cocok dengan kriteria pencarian atau filter sesi kelas Anda.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map(u => (
                      <tr key={u.email} className="hover:bg-white/5 transition">
                        <td className="p-4">
                          <div className="font-bold text-slate-205">{u.namaLengkap}</div>
                          <div className="text-[10px] text-slate-400">{u.namaUsaha || 'UMKM Nasional'} ({u.bidangUsaha || 'Multi'})</div>
                        </td>
                        <td className="p-4 font-mono text-[11px] text-slate-305">{u.email}</td>
                        <td className="p-4 font-mono text-[11px] text-slate-305">{u.whatsapp}</td>
                        <td className="p-4 min-w-[280px]">
                          {u.role !== 'peserta' ? (
                            <span className="text-[10px] text-slate-500 italic block">Bukan Peserta (Akses Terbuka)</span>
                          ) : webinars.length === 0 ? (
                            <span className="text-[10px] text-slate-500 italic block">Belum ada kelas terdaftar</span>
                          ) : (
                            <div className="space-y-1 max-h-[140px] overflow-y-auto pr-1">
                              {webinars.map(web => {
                                const isRegistered = u.registeredWebinars.includes(web.id);
                                const isPaid = u.paidWebinars?.includes(web.id) || false;
                                return (
                                  <div key={web.id} className="flex items-center justify-between bg-slate-950/40 p-1.5 rounded-lg border border-white/5 gap-2 text-[10px]">
                                    <span className="text-slate-300 truncate max-w-[120px]" title={web.title}>
                                      {web.title}
                                    </span>
                                    <div className="flex items-center space-x-2 shrink-0">
                                      <label className="flex items-center space-x-1 cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={isRegistered}
                                          onChange={() => {
                                            const updatedReg = isRegistered
                                              ? u.registeredWebinars.filter(id => id !== web.id)
                                              : [...u.registeredWebinars, web.id];
                                            let updatedPaid = u.paidWebinars ? [...u.paidWebinars] : [];
                                            if (isRegistered) {
                                              updatedPaid = updatedPaid.filter(id => id !== web.id);
                                            }
                                            const updatedUser = { ...u, registeredWebinars: updatedReg, paidWebinars: updatedPaid };
                                            DB.updateUser(updatedUser);
                                            reloadData();
                                          }}
                                          className="rounded border-white/10 text-indigo-600 focus:ring-0 w-3 h-3 bg-slate-900 cursor-pointer"
                                        />
                                        <span className="text-[9px] text-slate-400">Ikut</span>
                                      </label>

                                      <button
                                        disabled={!isRegistered}
                                        onClick={() => {
                                          const currentPaid = u.paidWebinars ? [...u.paidWebinars] : [];
                                          const updatedPaid = isPaid
                                            ? currentPaid.filter(id => id !== web.id)
                                            : [...currentPaid, web.id];
                                          const updatedUser = { ...u, paidWebinars: updatedPaid };
                                          DB.updateUser(updatedUser);
                                          reloadData();
                                        }}
                                        className={`px-1.5 py-0.5 text-[9px] font-bold rounded transition-all ${
                                          !isRegistered
                                            ? 'bg-slate-800 text-slate-500 border border-transparent cursor-not-allowed opacity-50'
                                            : isPaid
                                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 cursor-pointer text-[9px]'
                                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 cursor-pointer text-[9px]'
                                        }`}
                                      >
                                        {isPaid ? 'Lunas' : 'Belum'}
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <select
                            value={u.role}
                            onChange={(e) => handleUserRoleChange(u.email, e.target.value as any)}
                            id={`select-role-${u.email.replace(/[@.]/g, '-')}`}
                            className="bg-slate-900 text-slate-200 border border-white/10 focus:border-indigo-500 rounded-lg px-2 py-1 text-xs outline-none cursor-pointer h-[32px] font-sans w-full min-w-[120px]"
                          >
                            <option value="peserta">PESERTA</option>
                            <option value="admin">MODERATOR / ADMIN</option>
                            <option value="superadmin">SUPER ADMIN</option>
                          </select>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              setResetPasswordUser(u);
                              setNewPasswordValue(u.password || '123456');
                            }}
                            className="mx-auto px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 hover:text-indigo-300 text-slate-300 rounded-lg border border-white/5 transition flex items-center justify-center space-x-1 cursor-pointer"
                            title="Reset Password Pengguna"
                          >
                            <Lock className="w-3.5 h-3.5 text-indigo-400" />
                            <span className="text-[10px] font-bold">Reset Password</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Reset Password Overlay Modal */}
          {resetPasswordUser && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans animate-in fade-in duration-200">
              <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative animate-in zoom-in-95 duration-200">
                <button
                  onClick={() => {
                    setResetPasswordUser(null);
                    setNewPasswordValue('');
                  }}
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 cursor-pointer p-1 rounded-lg hover:bg-white/5 transition"
                >
                  <X className="w-4 h-4" />
                </button>
                
                <div className="flex items-center space-x-2.5 text-indigo-400">
                  <div className="w-9 h-9 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">Atur Ulang Sandi Pengguna</h3>
                    <p className="text-[10px] text-slate-450">Setel kata sandi baru untuk akun ini.</p>
                  </div>
                </div>

                <div className="bg-slate-950/45 p-3 rounded-xl border border-white/5 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Nama Lengkap:</span>
                    <strong className="text-slate-200 font-semibold">{resetPasswordUser.namaLengkap}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Email:</span>
                    <span className="text-slate-300 font-mono">{resetPasswordUser.email}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] text-slate-300 font-medium">Kata Sandi Baru</label>
                  <input
                    type="text"
                    value={newPasswordValue}
                    onChange={(e) => setNewPasswordValue(e.target.value)}
                    placeholder="Masukkan kata sandi baru..."
                    className="w-full bg-slate-950/50 border border-white/10 text-slate-200 text-xs rounded-xl px-3 py-2.5 outline-none focus:border-indigo-500 font-mono"
                  />
                  <p className="text-[9px] text-slate-400 italic">Peserta dapat menggunakan sandi ini untuk login di halaman depan.</p>
                </div>

                <div className="flex justify-end space-x-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setResetPasswordUser(null);
                      setNewPasswordValue('');
                    }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 border border-white/5 text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!newPasswordValue.trim()) {
                        alert('Kata sandi baru tidak boleh kosong.');
                        return;
                      }
                      const updated = { ...resetPasswordUser, password: newPasswordValue.trim() };
                      DB.updateUser(updated);
                      reloadData();
                      setSuccessMsg(`Sandi untuk ${resetPasswordUser.namaLengkap} berhasil diubah.`);
                      setResetPasswordUser(null);
                      setNewPasswordValue('');
                      setTimeout(() => setSuccessMsg(''), 3000);
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-550 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-lg shadow-indigo-600/15"
                  >
                    Simpan Sandi Baru
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. Integrasi API & payment gateway */}
      {activeTab === 'api' && (
        <form onSubmit={handleSaveSettings} className="glass border border-white/10 rounded-2xl p-6 space-y-6 shadow-xl" id="form-api-settings font-sans">
          <div className="border-b border-white/5 pb-3">
            <h2 className="text-lg font-bold text-slate-205 font-sans flex items-center space-x-2">
              <Key className="w-5 h-5 text-indigo-400 font-sans" />
              <span className="font-sans">Konfigurasi Integrasi API Eksternal</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-sans">
              Atur credentials Zoom Developer, sinkronisasi Google Calendar, atau sistem pendaftaran berbayar / tiket premium via payment gateway Midtrans.
            </p>
          </div>

          <div className="space-y-6 font-sans">
            
            {/* Zoom Connection */}
            <div className="bg-slate-950/40 border border-white/5 rounded-xl p-4.5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                <h3 className="text-xs font-bold text-slate-200">1. Integrasi Zoom Developer App Suite</h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={zoomConnected} 
                    onChange={(e) => setZoomConnected(e.target.checked)} 
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  <span className="ml-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    {zoomConnected ? 'AKTIF' : 'NONAKTIF'}
                  </span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                <div className="space-y-1.5">
                  <label className="block text-slate-350">Zoom CLIENT SECRET / JWT SDK Key</label>
                  <input
                    type="text"
                    value={zoomApiKey}
                    onChange={(e) => setZoomApiKey(e.target.value)}
                    placeholder="Contoh: eyJhbGciOiJIUzI1NiJ9..."
                    id="zoom-api-key"
                    className="w-full bg-slate-950/40 border border-white/10 text-slate-300 text-xs rounded-xl px-3 py-2 outline-none focus:border-indigo-500 font-mono"
                    disabled={!zoomConnected}
                  />
                </div>
                <div className="p-3 bg-white/5 rounded-xl text-[11px] text-slate-405 self-end">
                  Zoom API digunakan untuk otomatis menggenerate link meeting, mengontrol mute/unmute, serta melacak daftar kehadiran absensi peserta webinar secara digital.
                </div>
              </div>
            </div>

            {/* Google Calendar Connection */}
            <div className="bg-slate-950/40 border border-white/5 rounded-xl p-4.5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                <h3 className="text-xs font-bold text-slate-200">2. Sinkronisasi Google Calendar</h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={googleCalendarConnected} 
                    onChange={(e) => setGoogleCalendarConnected(e.target.checked)} 
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  <span className="ml-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    {googleCalendarConnected ? 'AKTIF' : 'NONAKTIF'}
                  </span>
                </label>
              </div>
              <p className="text-[11px] text-slate-405">
                Mengintegrasikan jadwal webinar UMKM harian langsung ke Google Calendar admin dan secara opsional memicu undangan notifikasi email ke kalender pribadi pendaftar.
              </p>
            </div>

            {/* Midtrans Connection */}
            <div className="bg-slate-950/40 border border-white/5 rounded-xl p-4.5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                <h3 className="text-xs font-bold text-slate-200">3. Gerbang Pembayaran Midtrans (Ticketing Sederhana)</h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={midtransConnected} 
                    onChange={(e) => setMidtransConnected(e.target.checked)} 
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  <span className="ml-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    {midtransConnected ? 'AKTIF' : 'NONAKTIF'}
                  </span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="block text-slate-350">Midtrans CLIENT KEY (Sandbox Mode)</label>
                    <input
                      type="text"
                      value={midtransClientKey}
                      onChange={(e) => setMidtransClientKey(e.target.value)}
                      placeholder="Contoh: SB-Mid-client-881h29b..."
                      id="midtrans-client-key"
                      className="w-full bg-slate-950/40 border border-white/10 text-slate-300 text-xs rounded-xl px-3 py-2 outline-none focus:border-indigo-500 font-mono"
                      disabled={!midtransConnected}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-slate-350 font-sans">Harga Standar Karcis Webinar (IDR)</label>
                    <input
                      type="number"
                      value={ticketPrice}
                      onChange={(e) => setTicketPrice(Number(e.target.value))}
                      placeholder="Contoh: 50000"
                      className="w-full bg-slate-950/40 border border-white/10 text-slate-300 text-xs rounded-xl px-3 py-1.5 outline-none focus:border-indigo-500 font-sans"
                      disabled={!midtransConnected}
                    />
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl text-[11px] text-slate-405 space-y-2">
                  <p>Membantu UMKM melakukan setup monetisasi webinar jika webinar bersifat kelas bertaraf internasional / berbayar.</p>
                  <p className="text-indigo-400 font-semibold">• Saat non-aktif, pendaftaran disetting otomatis GRATIS 100%.</p>
                </div>
              </div>
            </div>

            {/* Keamanan & Pembatasan Akses Zoom */}
            <div className="bg-slate-950/40 border border-white/5 rounded-xl p-4.5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                <h3 className="text-xs font-bold text-slate-205">4. Aturan Akses Kelas & Pembatasan Zoom (Syarat Pembayaran)</h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={restrictZoomUnpaid} 
                    onChange={(e) => setRestrictZoomUnpaid(e.target.checked)} 
                    id="restrict-zoom-unpaid"
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-600"></div>
                  <span className="ml-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    {restrictZoomUnpaid ? 'DIBATASI' : 'BEBAS AKSES'}
                  </span>
                </label>
              </div>

              <div className="text-[11px] leading-relaxed text-slate-400 space-y-2">
                <p>
                  Jika diaktifkan (<strong className="text-rose-400 font-bold">DIBATASI</strong>), semua peserta dengan peran (role) <strong className="text-slate-300">Peserta</strong> yang mendaftar webinar <strong className="text-rose-455 font-bold">TIDAK BISA mengakses link Zoom</strong> jika status tiketnya belum Lunas.
                </p>
                <p className="text-indigo-400 font-medium">
                  • Admin dan Moderator dapat menandai secara manual status lunas peserta di baris pendaftar, atau peserta dapat melakukan pembayaran simulasi di dasbor mereka.
                </p>
              </div>
            </div>

            {/* Rekening Pembayaran Bank Manual */}
            <div className="bg-slate-950/40 border border-white/5 rounded-xl p-4.5 space-y-4">
              <div className="border-b border-white/5 pb-2.5">
                <h3 className="text-xs font-bold text-slate-205">5. Rekening Penampungan Pembayaran Manual</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Informasi nomor rekening bank yang muncul di dasbor peserta untuk panduan transfer pembayaran manual.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
                <div className="space-y-1">
                  <label className="block text-slate-400">Nama Bank / Fintech</label>
                  <input
                    type="text"
                    value={bankInfoBank}
                    onChange={(e) => setBankInfoBank(e.target.value)}
                    placeholder="Contoh: Bank BCA, Bank Mandiri, GoPay"
                    id="bank-info-bank"
                    className="w-full bg-slate-950/40 border border-white/10 text-slate-300 text-xs rounded-xl px-3 py-2 outline-none focus:border-indigo-500 font-sans"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-400">Nomor Rekening / No. HP</label>
                  <input
                    type="text"
                    value={bankInfoNumber}
                    onChange={(e) => setBankInfoNumber(e.target.value)}
                    placeholder="Contoh: 8830123456"
                    id="bank-info-number"
                    className="w-full bg-slate-950/40 border border-white/10 text-slate-300 text-xs rounded-xl px-3 py-2 outline-none focus:border-indigo-500 font-mono"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-400">Atas Nama (A/N)</label>
                  <input
                    type="text"
                    value={bankInfoName}
                    onChange={(e) => setBankInfoName(e.target.value)}
                    placeholder="Contoh: CV UMKM Digital"
                    id="bank-info-name"
                    className="w-full bg-slate-950/40 border border-white/10 text-slate-300 text-xs rounded-xl px-3 py-2 outline-none focus:border-indigo-500 font-sans"
                    required
                  />
                </div>
              </div>
            </div>

            {/* 6. Desain Tampilan Beranda & Kustomisasi Branding */}
            <div className="bg-slate-950/40 border border-white/5 rounded-xl p-4.5 space-y-6">
              <div className="border-b border-white/5 pb-2.5">
                <h3 className="text-xs font-bold text-slate-205 flex items-center space-x-1.5">
                  <Globe className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>6. Kustomisasi Branding & Tampilan Beranda (Landing Page)</span>
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Edit semua tulisan promosi, badge, judul agenda, filter, ganti/upload logo, serta daftar keunggulan program secara langsung.</p>
              </div>

              {/* Row 1: Logo & Judul Utama Portal */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
                <div className="space-y-1">
                  <label className="block text-slate-405 font-semibold">Judul Logo Utama (Logo Prefix)</label>
                  <input
                    type="text"
                    value={landingTitle}
                    onChange={(e) => setLandingTitle(e.target.value)}
                    placeholder="Default: WEBINAR UMKM"
                    className="w-full bg-slate-950/40 border border-white/10 text-slate-300 text-xs rounded-xl px-3 py-2 outline-none focus:border-indigo-500 font-sans"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-405 font-semibold">Sub-Judul Logo (Logo Suffix)</label>
                  <input
                    type="text"
                    value={landingSubTitle}
                    onChange={(e) => setLandingSubTitle(e.target.value)}
                    placeholder="Default: Online Hub"
                    className="w-full bg-slate-950/40 border border-white/10 text-slate-300 text-xs rounded-xl px-3 py-2 outline-none focus:border-indigo-505 font-sans"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-405 font-semibold">Logo Webinar (Foto / Logo Beranda)</label>
                  <div className="flex items-center space-x-2">
                    {landingLogoUrl && (
                      <img src={landingLogoUrl} className="w-8 h-8 rounded object-cover border border-white/10 shrink-0" alt="Logo preview" referrerPolicy="no-referrer" />
                    )}
                    <label className="flex-grow flex items-center justify-center border border-dashed border-white/20 hover:border-indigo-550 rounded-xl p-1 text-slate-300 cursor-pointer bg-white/5 hover:bg-white/10 transition-colors text-[10px] text-center min-h-[34px]">
                      <span>📁 {landingLogoUrl ? 'Ganti Foto Logo' : 'Upload Foto Logo'}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setLandingLogoUrl(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }} 
                        className="hidden" 
                      />
                    </label>
                    {landingLogoUrl && (
                      <button 
                        type="button" 
                        onClick={() => setLandingLogoUrl('')} 
                        className="text-rose-405 hover:text-rose-400 font-bold px-1.5 text-sm cursor-pointer"
                        title="Hapus Logo"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Row 2: Headline & Badge Hero */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                <div className="space-y-1">
                  <label className="block text-slate-405 font-semibold">Badge Hero Atas</label>
                  <input
                    type="text"
                    value={landingHeroBadge}
                    onChange={(e) => setLandingHeroBadge(e.target.value)}
                    placeholder="Default: Akselerasi Pengusaha Mikro Indonesia"
                    className="w-full bg-slate-950/40 border border-white/10 text-slate-300 text-xs rounded-xl px-3 py-2 outline-none focus:border-indigo-500 font-sans"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-405 font-semibold">Judul Hero (Headline Gradasi)</label>
                  <input
                    type="text"
                    value={landingHeroTitle}
                    onChange={(e) => setLandingHeroTitle(e.target.value)}
                    placeholder="Default: Go Digital & Naik Kelas"
                    className="w-full bg-slate-950/40 border border-white/10 text-slate-300 text-xs rounded-xl px-3 py-2 outline-none focus:border-indigo-500 font-sans"
                  />
                </div>
              </div>

              {/* Row 3: Deskripsi Panjang Hero */}
              <div className="space-y-1 text-xs">
                <label className="block text-slate-405 font-semibold">Deskripsi Promosi Hero</label>
                <textarea
                  value={landingHeroDesc}
                  onChange={(e) => setLandingHeroDesc(e.target.value)}
                  placeholder="Ketik deskripsi lengkap tentang bootcamp webinar disini..."
                  className="w-full h-20 bg-slate-950/40 border border-white/10 text-slate-300 text-xs rounded-xl px-3 py-2 outline-none focus:border-indigo-500 font-sans resize-none"
                />
              </div>

              {/* Row 4: Label Filter & Agenda Katalog */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                <div className="space-y-1">
                  <label className="block text-slate-405 font-semibold">Judul Atas Tabel Agenda</label>
                  <input
                    type="text"
                    value={landingAgendaTitle}
                    onChange={(e) => setLandingAgendaTitle(e.target.value)}
                    placeholder="Default: AGENDA TERJADWAL"
                    className="w-full bg-slate-950/40 border border-white/10 text-slate-300 text-xs rounded-xl px-3 py-2 outline-none focus:border-indigo-500 font-sans"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-405 font-semibold">Label Filter Topik</label>
                  <input
                    type="text"
                    value={landingFilterLabel}
                    onChange={(e) => setLandingFilterLabel(e.target.value)}
                    placeholder="Default: Filter Topik:"
                    className="w-full bg-slate-950/40 border border-white/10 text-slate-300 text-xs rounded-xl px-3 py-2 outline-none focus:border-indigo-500 font-sans"
                  />
                </div>
              </div>

              {/* Row 5: Keunggulan Program / Program Benefits (Tambah, Edit, Delete) */}
              <div className="border-t border-white/10 pt-4 space-y-4 font-sans">
                <div className="flex justify-between items-center">
                  <h4 className="text-[11px] uppercase tracking-wider font-extrabold text-slate-205">Daftar Keunggulan / Fitur Benefit Beranda</h4>
                  <span className="text-[10px] text-slate-450">Sesuaikan poin keunggulan utama di halaman depan</span>
                </div>

                {/* Visual Grid of dynamic Features List */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {featuresList.map((feat: any, idx: number) => (
                    <div key={feat.id || idx} className="bg-slate-950/50 rounded-xl p-3 border border-indigo-500/10 hover:border-indigo-500/20 relative flex flex-col justify-between group">
                      <div>
                        <h5 className="font-extrabold text-xs text-indigo-300 flex items-center space-x-1">
                          <span>✓</span>
                          <span>{feat.title}</span>
                        </h5>
                        <p className="text-[10px] text-slate-400 mt-1 leading-normal font-sans line-clamp-3">{feat.description}</p>
                      </div>
                      <div className="flex justify-end space-x-2.5 mt-3 pt-2 border-t border-white/5 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => handleEditFeature(feat)}
                          className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
                        >
                          Ubah
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteFeature(feat.id)}
                          className="text-[10px] text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}

                  {featuresList.length === 0 && (
                    <div className="col-span-3 text-center py-4 bg-white/5 rounded-xl text-[10px] text-slate-400 font-mono">
                      Belum ada keunggulan kustom. Keunggulan default (Gratis Sertifikat, Zoom Interaktif, Alumni Sukses) akan ditampilkan di beranda.
                    </div>
                  )}
                </div>

                {/* Inline Add / Edit Feature form panel */}
                <div className="bg-slate-950/60 rounded-xl p-3.5 border border-white/5 space-y-3">
                  <div className="text-[10px] font-bold text-indigo-400 tracking-wider">
                    {editingFeatureId ? '📝 UBH KEUNGGULAN SEKARANG' : '＋ TAMBAH KEUNGGULAN BARU'}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1">
                      <label className="block text-slate-405 font-medium">Nama Fitur / Judul Keunggulan</label>
                      <input
                        type="text"
                        value={newFeatureTitle}
                        onChange={(e) => setNewFeatureTitle(e.target.value)}
                        placeholder="Contoh: 100% Gratis Bersertifikat"
                        className="w-full bg-slate-950/40 border border-white/10 text-slate-300 text-xs rounded-xl px-2.5 py-1.5 outline-none focus:border-indigo-505"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-slate-405 font-medium">Penjelasan Singkat Fitur</label>
                      <input
                        type="text"
                        value={newFeatureDesc}
                        onChange={(e) => setNewFeatureDesc(e.target.value)}
                        placeholder="Contoh: Seluruh sesi webinar didukung penuh..."
                        className="w-full bg-slate-950/40 border border-white/10 text-slate-300 text-xs rounded-xl px-2.5 py-1.5 outline-none focus:border-indigo-505"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    {editingFeatureId && (
                      <button
                        type="button"
                        onClick={() => {
                          setNewFeatureTitle('');
                          setNewFeatureDesc('');
                          setEditingFeatureId(null);
                        }}
                        className="px-3 py-1 bg-white/5 hover:bg-white/10 text-slate-300 text-[10px] uppercase font-bold rounded-lg transition shrink-0 cursor-pointer"
                      >
                        Batal
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      disabled={!newFeatureTitle || !newFeatureDesc}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] uppercase font-bold rounded-lg transition cursor-pointer disabled:opacity-50 shrink-0"
                    >
                      {editingFeatureId ? 'Terapkan Perubahan' : 'Masukkan ke List'}
                    </button>
                  </div>
                </div>

                {/* Row 6: Kelola Daftar Filter Topik Webinar (Tambah, Edit, Delete) */}
                <div className="border-t border-white/10 pt-4 space-y-4 font-sans">
                  <div className="flex justify-between items-center">
                    <h4 className="text-[11px] uppercase tracking-wider font-extrabold text-indigo-400">Kelola Filter Topik / Kategori Webinar</h4>
                    <span className="text-[10px] text-slate-400">Tambah, ubah, atau hapus topik webinar</span>
                  </div>

                  {/* Visual Grid of dynamic Topics List */}
                  <div className="flex flex-wrap gap-2.5">
                    {topicsList.map((t: any, idx: number) => (
                      <div key={t.id || idx} className="bg-slate-950/60 rounded-xl px-3 py-1.5 border border-indigo-500/10 hover:border-indigo-500/30 flex items-center space-x-2.5">
                        <span className="text-xs text-slate-200 font-medium">{t.name}</span>
                        <div className="flex items-center space-x-1.5 border-l border-white/10 pl-2">
                          <button
                            type="button"
                            onClick={() => handleEditTopic(t)}
                            className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
                          >
                            Ubah
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteTopic(t.id)}
                            className="text-[10px] text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    ))}

                    {topicsList.length === 0 && (
                      <div className="w-full text-center py-4 bg-white/5 rounded-xl text-[10px] text-slate-400 font-mono">
                        Belum ada topik kustom. Silakan tambahkan topik baru di bawah ini.
                      </div>
                    )}
                  </div>

                  {/* Inline Add / Edit Topic form panel */}
                  <div className="bg-slate-950/60 rounded-xl p-3.5 border border-white/5 space-y-3">
                    <div className="text-[10px] font-bold text-indigo-400 tracking-wider">
                      {editingTopicId ? '📝 UBAH TOPIK SEKARANG' : '＋ TAMBAH TOPIK BARU'}
                    </div>
                    <div className="grid grid-cols-1 gap-3 text-xs">
                      <div className="space-y-1">
                        <label className="block text-slate-400 font-medium">Nama Topik / Kategori</label>
                        <input
                          type="text"
                          value={newTopicName}
                          onChange={(e) => setNewTopicName(e.target.value)}
                          placeholder="Contoh: Kuliner, Retail, Ekspor, Digital Marketing, Keuangan"
                          className="w-full bg-slate-950/40 border border-white/10 text-slate-300 text-xs rounded-xl px-2.5 py-1.5 outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      {editingTopicId && (
                        <button
                          type="button"
                          onClick={() => {
                            setNewTopicName('');
                            setEditingTopicId(null);
                          }}
                          className="px-3 py-1 bg-white/5 hover:bg-white/10 text-slate-300 text-[10px] uppercase font-bold rounded-lg transition shrink-0 cursor-pointer"
                        >
                          Batal
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={handleAddTopic}
                        disabled={!newTopicName.trim()}
                        className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] uppercase font-bold rounded-lg transition cursor-pointer disabled:opacity-50 shrink-0"
                      >
                        {editingTopicId ? 'Terapkan Perubahan' : 'Masukkan ke List'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 7. Pengaturan Desain & Tanda Tangan E-Sertifikat */}
            <div className="bg-slate-950/40 border border-white/5 rounded-xl p-4.5 space-y-6">
              <div className="border-b border-white/5 pb-2.5">
                <h3 className="text-xs font-bold text-slate-205 flex items-center space-x-1.5 font-sans">
                  <Award className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-sans">7. Pengaturan Struktur & Tanda Tangan E-Sertifikat</span>
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5 font-sans">
                  Edit 3 nama narasumber beserta tanda tangannya (tulis teks tanda tangan atau upload file gambar tanda tangan), serta pasang stempel / seal verifikasi resmi di tengah sertifikat.
                </p>
              </div>

              {/* 3 Columns Speakers */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs font-sans">
                {/* Speaker 1 Column */}
                <div className={`bg-slate-950/50 p-3.5 rounded-xl border border-white/5 space-y-4 transition-all ${certSpeaker1Active ? '' : 'opacity-40'}`}>
                  <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                    <span className="font-extrabold text-[10px] text-indigo-400 font-mono">📢 NARASUMBER KOLOM 1</span>
                    <label className="flex items-center space-x-1 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={certSpeaker1Active} 
                        onChange={(e) => setCertSpeaker1Active(e.target.checked)} 
                        className="rounded bg-slate-900 border-white/10 text-indigo-600 focus:ring-0 w-3 h-3 cursor-pointer"
                      />
                      <span className="text-[10px] font-bold text-slate-300">Aktif</span>
                    </label>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="block text-slate-400 font-medium">Label Atas Narasumber 1</label>
                    <input
                      type="text"
                      value={certSpeaker1Title}
                      onChange={(e) => setCertSpeaker1Title(e.target.value)}
                      placeholder="Contoh: NARASUMBER I"
                      className="w-full bg-slate-950/40 border border-white/10 text-slate-300 text-xs rounded-xl px-2.5 py-2 outline-none focus:border-indigo-500"
                    />
                    <p className="text-[9px] text-slate-500 leading-none">Kosongkan jika tidak ingin ada tulisan label atas.</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-slate-400 font-medium">Nama Narasumber 1</label>
                    <input
                      type="text"
                      value={certSpeaker1Name}
                      onChange={(e) => setCertSpeaker1Name(e.target.value)}
                      placeholder="Contoh: Dr. H. Sandiaga Uno, B.B.A."
                      className="w-full bg-slate-950/40 border border-white/10 text-slate-300 text-xs rounded-xl px-2.5 py-2 outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-slate-400 font-medium">Tanda Tangan (Gambar / Teks Cursive)</label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        {certSpeaker1Sign ? (
                          <div className="bg-white/10 p-1 rounded border border-white/10 shrink-0">
                            {certSpeaker1Sign.startsWith('data:image') ? (
                              <img src={certSpeaker1Sign} alt="TTD 1" className="w-12 h-6 object-contain invert brightness-200" referrerPolicy="no-referrer" />
                            ) : (
                              <span className="font-serif italic font-bold text-xs text-amber-200 px-1">{certSpeaker1Sign}</span>
                            )}
                          </div>
                        ) : (
                          <div className="text-[8px] font-mono text-slate-400 bg-white/5 p-1 rounded">No Signature</div>
                        )}
                        
                        <label className="flex-grow flex items-center justify-center border border-dashed border-white/20 hover:border-indigo-500 rounded-xl px-2 py-1 bg-white/5 hover:bg-white/10 transition-colors text-[9px] text-center cursor-pointer min-h-[28px]">
                          <span>Upload Gambar</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setCertSpeaker1Sign(reader.result as string);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <span className="text-[9px] text-slate-400">Atau ketik alternatif teks:</span>
                        <input
                          type="text"
                           placeholder="Nama singkatan (misal: S. Uno)"
                          onChange={(e) => setCertSpeaker1Sign(e.target.value)}
                          className="flex-grow bg-slate-950/60 border border-white/10 text-slate-300 text-[9px] rounded px-2 py-1 outline-none focus:border-indigo-500 font-sans"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Speaker 2 Column */}
                <div className={`bg-slate-950/50 p-3.5 rounded-xl border border-white/5 space-y-4 transition-all ${certSpeaker2Active ? '' : 'opacity-40'}`}>
                  <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                    <span className="font-extrabold text-[10px] text-indigo-400 font-mono">📢 NARASUMBER KOLOM 2</span>
                    <label className="flex-grow flex justify-end items-center space-x-1 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={certSpeaker2Active} 
                        onChange={(e) => setCertSpeaker2Active(e.target.checked)} 
                        className="rounded bg-slate-900 border-white/10 text-indigo-600 focus:ring-0 w-3 h-3 cursor-pointer"
                      />
                      <span className="text-[10px] font-bold text-slate-300">Aktif</span>
                    </label>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="block text-slate-400 font-medium">Label Atas Narasumber 2</label>
                    <input
                      type="text"
                      value={certSpeaker2Title}
                      onChange={(e) => setCertSpeaker2Title(e.target.value)}
                      placeholder="Contoh: NARASUMBER II"
                      className="w-full bg-slate-950/40 border border-white/10 text-slate-300 text-xs rounded-xl px-2.5 py-2 outline-none focus:border-indigo-500"
                    />
                    <p className="text-[9px] text-slate-500 leading-none">Kosongkan jika tidak ingin ada tulisan label atas.</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-slate-400 font-medium">Nama Narasumber 2</label>
                    <input
                      type="text"
                      value={certSpeaker2Name}
                      onChange={(e) => setCertSpeaker2Name(e.target.value)}
                      placeholder="Contoh: Ibu Rina Astuti, M.E."
                      className="w-full bg-slate-950/40 border border-white/10 text-slate-300 text-xs rounded-xl px-2.5 py-2 outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-slate-400 font-medium">Tanda Tangan (Gambar / Teks Cursive)</label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        {certSpeaker2Sign ? (
                          <div className="bg-white/10 p-1 rounded border border-white/10 shrink-0">
                            {certSpeaker2Sign.startsWith('data:image') ? (
                              <img src={certSpeaker2Sign} alt="TTD 2" className="w-12 h-6 object-contain invert brightness-200" referrerPolicy="no-referrer" />
                            ) : (
                              <span className="font-serif italic font-bold text-xs text-amber-200 px-1">{certSpeaker2Sign}</span>
                            )}
                          </div>
                        ) : (
                          <div className="text-[8px] font-mono text-slate-405 bg-white/5 p-1 rounded">No Signature</div>
                        )}
                        
                        <label className="flex-grow flex items-center justify-center border border-dashed border-white/20 hover:border-indigo-500 rounded-xl px-2 py-1 bg-white/5 hover:bg-white/10 transition-colors text-[9px] text-center cursor-pointer min-h-[28px]">
                          <span>Upload Gambar</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setCertSpeaker2Sign(reader.result as string);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <span className="text-[9px] text-slate-400">Atau ketik alternatif teks:</span>
                        <input
                          type="text"
                          placeholder="Nama singkatan (misal: Rina A.)"
                          onChange={(e) => setCertSpeaker2Sign(e.target.value)}
                          className="flex-grow bg-slate-950/60 border border-white/10 text-slate-300 text-[9px] rounded px-2 py-1 outline-none focus:border-indigo-500 font-sans"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Speaker 3 Column */}
                <div className={`bg-slate-950/50 p-3.5 rounded-xl border border-white/5 space-y-4 transition-all ${certSpeaker3Active ? '' : 'opacity-40'}`}>
                  <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                    <span className="font-extrabold text-[10px] text-indigo-400 font-mono">📢 NARASUMBER KOLOM 3</span>
                    <label className="flex-grow flex justify-end items-center space-x-1 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={certSpeaker3Active} 
                        onChange={(e) => setCertSpeaker3Active(e.target.checked)} 
                        className="rounded bg-slate-900 border-white/10 text-indigo-600 focus:ring-0 w-3 h-3 cursor-pointer"
                      />
                      <span className="text-[10px] font-bold text-slate-300">Aktif</span>
                    </label>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="block text-slate-400 font-medium">Label Atas Narasumber 3</label>
                    <input
                      type="text"
                      value={certSpeaker3Title}
                      onChange={(e) => setCertSpeaker3Title(e.target.value)}
                      placeholder="Contoh: NARASUMBER III"
                      className="w-full bg-slate-950/40 border border-white/10 text-slate-300 text-xs rounded-xl px-2.5 py-2 outline-none focus:border-indigo-500"
                    />
                    <p className="text-[9px] text-slate-500 leading-none">Kosongkan jika tidak ingin ada tulisan label atas.</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-slate-400 font-medium">Nama Narasumber 3</label>
                    <input
                      type="text"
                      value={certSpeaker3Name}
                      onChange={(e) => setCertSpeaker3Name(e.target.value)}
                      placeholder="Contoh: Bapak Budi Santoso, S.E."
                      className="w-full bg-slate-950/40 border border-white/10 text-slate-300 text-xs rounded-xl px-2.5 py-2 outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-slate-400 font-medium">Tanda Tangan (Gambar / Teks Cursive)</label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        {certSpeaker3Sign ? (
                          <div className="bg-white/10 p-1 rounded border border-white/10 shrink-0">
                            {certSpeaker3Sign.startsWith('data:image') ? (
                              <img src={certSpeaker3Sign} alt="TTD 3" className="w-12 h-6 object-contain invert brightness-200" referrerPolicy="no-referrer" />
                            ) : (
                              <span className="font-serif italic font-bold text-xs text-amber-200 px-1">{certSpeaker3Sign}</span>
                            )}
                          </div>
                        ) : (
                          <div className="text-[8px] font-mono text-slate-405 bg-white/5 p-1 rounded">No Signature</div>
                        )}
                        
                        <label className="flex-grow flex items-center justify-center border border-dashed border-white/20 hover:border-indigo-500 rounded-xl px-2 py-1 bg-white/5 hover:bg-white/10 transition-colors text-[9px] text-center cursor-pointer min-h-[28px]">
                          <span>Upload Gambar</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setCertSpeaker3Sign(reader.result as string);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <span className="text-[9px] text-slate-400">Atau ketik alternatif teks:</span>
                        <input
                          type="text"
                          placeholder="Nama singkatan (misal: Budi S.)"
                          onChange={(e) => setCertSpeaker3Sign(e.target.value)}
                          className="flex-grow bg-slate-950/60 border border-white/10 text-slate-300 text-[9px] rounded px-2 py-1 outline-none focus:border-indigo-500 font-sans"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verified Online Seal / Stamp Customisation */}
              <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5 space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="font-extrabold text-[10px] text-indigo-400 font-mono">🌟 BADGE STAMP / SEAL VERIFIKASI (TENGAH)</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-slate-405 font-semibold font-sans">Upload Gambar Seal Kustom (Verified Online)</label>
                    <p className="text-[10px] text-slate-400 font-sans">Upload stempel dinas, qr code approval, atau logo keabsahan khusus untuk diletakkan di tengah-bawah sejajar ID & Tanggal Terbit.</p>
                    <div className="flex items-center space-x-3 pt-2">
                      {certSealImgUrl && (
                        <div className="p-1 px-2 bg-amber-50 rounded border border-amber-500/10">
                          <img src={certSealImgUrl} alt="Custom Seal" className="h-10 object-contain" referrerPolicy="no-referrer" />
                        </div>
                      )}
                      
                      <label className="flex-grow flex items-center justify-center border border-dashed border-white/20 hover:border-indigo-500 rounded-xl p-2 text-slate-300 cursor-pointer bg-white/5 hover:bg-white/10 transition-colors text-[11px] text-center min-h-[38px] font-sans">
                        <span>📁 {certSealImgUrl ? 'Ganti Gambar Seal' : 'Upload File Gambar Seal'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setCertSealImgUrl(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                      
                      {certSealImgUrl && (
                        <button
                          type="button"
                          onClick={() => setCertSealImgUrl('')}
                          className="px-3.5 py-1.5 bg-rose-600/35 hover:bg-rose-600 text-rose-300 font-bold rounded-lg transition text-[10px] uppercase tracking-wider cursor-pointer font-sans"
                        >
                          Reset Default
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-950/80 p-3 rounded-xl border border-white/5 flex flex-col justify-center items-center text-center space-y-1">
                    <span className="text-[9px] text-slate-450 uppercase font-bold tracking-wider font-mono">Preview Status Seal saat ini:</span>
                    {certSealImgUrl ? (
                      <div className="text-[10px] text-emerald-400 font-semibold flex items-center space-x-1 font-sans">
                        <span>● Menggunakan Gambar Kustom</span>
                      </div>
                    ) : (
                      <div className="text-[10px] text-indigo-400 font-semibold flex items-center space-x-1 font-sans">
                        <span>● Menggunakan Ribbon Gold Seal (Default)</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              id="btn-save-settings"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-550 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-indigo-600/10 cursor-pointer accent-glow"
            >
              Simpan Integrasi & Kunci API
            </button>
          </div>
        </form>
      )}

    </div>
  );
}
