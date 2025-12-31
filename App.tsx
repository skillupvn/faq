
import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, LayoutDashboard, Database, 
  Settings, Zap, Bell, User, Star
} from 'lucide-react';
import { FAQItem, Category, Tag } from './types';
import { SAMPLE_DATA, INITIAL_CATEGORIES, INITIAL_SUBJECTS, INITIAL_TAGS, INITIAL_CONTENT_TYPES } from './constants';
import Dashboard from './components/Dashboard';
import FAQList from './components/FAQList';
import FAQForm from './components/FAQForm';
import DataManagement from './components/DataManagement';
import CategoryManagement from './components/CategoryManagement';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'browse' | 'create' | 'manage' | 'settings'>('dashboard');
  const [faqs, setFaqs] = useState<FAQItem[]>(() => {
    const saved = localStorage.getItem('skillup_faqs');
    return saved ? JSON.parse(saved) : SAMPLE_DATA;
  });
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('skillup_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });
  const [subCategories, setSubCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('skillup_sub_categories');
    return saved ? JSON.parse(saved) : ['Chung', 'Khuyến mãi', 'Học thử', 'Chính sách'];
  });
  const [subjects, setSubjects] = useState<string[]>(() => {
    const saved = localStorage.getItem('skillup_subjects');
    return saved ? JSON.parse(saved) : INITIAL_SUBJECTS;
  });
  const [tags, setTags] = useState<Tag[]>(() => {
    const saved = localStorage.getItem('skillup_tags');
    return saved ? JSON.parse(saved) : INITIAL_TAGS;
  });
  const [contentTypes, setContentTypes] = useState<string[]>(() => {
    const saved = localStorage.getItem('skillup_content_types');
    return saved ? JSON.parse(saved) : INITIAL_CONTENT_TYPES;
  });
  const [recentIds, setRecentIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('skillup_recent');
    return saved ? JSON.parse(saved) : [];
  });
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);

  useEffect(() => {
    localStorage.setItem('skillup_faqs', JSON.stringify(faqs));
    localStorage.setItem('skillup_categories', JSON.stringify(categories));
    localStorage.setItem('skillup_sub_categories', JSON.stringify(subCategories));
    localStorage.setItem('skillup_subjects', JSON.stringify(subjects));
    localStorage.setItem('skillup_tags', JSON.stringify(tags));
    localStorage.setItem('skillup_content_types', JSON.stringify(contentTypes));
    localStorage.setItem('skillup_recent', JSON.stringify(recentIds));
  }, [faqs, categories, subCategories, subjects, tags, contentTypes, recentIds]);

  const handleCreateOrUpdate = (faq: FAQItem) => {
    if (editingFaq && faqs.some(f => f.id === faq.id)) {
      setFaqs(prev => prev.map(f => f.id === faq.id ? faq : f));
    } else {
      setFaqs(prev => [faq, ...prev]);
    }
    setEditingFaq(null);
    setActiveTab('browse');
  };

  const handleCancel = () => {
    setEditingFaq(null);
    setActiveTab('browse');
  };

  const toggleFavorite = (id: string) => {
    setFaqs(prev => prev.map(f => f.id === id ? { ...f, isFavorite: !f.isFavorite } : f));
  };

  const trackRecent = (id: string) => {
    setRecentIds(prev => {
      const filtered = prev.filter(rid => rid !== id);
      return [id, ...filtered].slice(0, 10);
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tri thức này?')) {
      setFaqs(prev => prev.filter(f => f.id !== id));
      setRecentIds(prev => prev.filter(rid => rid !== id));
    }
  };

  const handleEdit = (faq: FAQItem) => {
    setEditingFaq(faq);
    setActiveTab('create');
  };

  const handleDuplicate = (faq: FAQItem) => {
    const newFaq = { 
      ...faq, 
      id: `DUP-${Date.now()}`, 
      code: `${faq.code}-COPY`,
      title: `${faq.title} (Bản sao)`,
      createdAt: new Date().toISOString()
    };
    setEditingFaq(newFaq);
    setActiveTab('create');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC] font-sans antialiased text-slate-900">
      <nav className="w-80 bg-[#0F172A] text-white flex flex-col shadow-2xl z-20 relative">
        <div className="p-10">
          <div className="flex items-center gap-4 group cursor-default">
            <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/20 transition-transform duration-500">
              <Zap className="text-white fill-current" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight">SkillUp <span className="text-indigo-400">Master</span></h1>
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] mt-0.5">Knowledge Hub</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 px-6 space-y-2 overflow-y-auto custom-scrollbar pb-10">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Tổng quan hệ thống" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <NavItem 
            icon={<Search size={20} />} 
            label="Kho tri thức & Tags" 
            active={activeTab === 'browse'} 
            onClick={() => setActiveTab('browse')} 
          />
          <div className="pt-8 pb-4 px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Quản lý & Nhập liệu</div>
          <NavItem 
            icon={<Plus size={20} />} 
            label="Thêm tri thức mới" 
            active={activeTab === 'create'} 
            onClick={() => {
              setEditingFaq(null);
              setActiveTab('create');
            }} 
          />
          <NavItem 
            icon={<Database size={20} />} 
            label="Bảng dữ liệu Master" 
            active={activeTab === 'manage'} 
            onClick={() => setActiveTab('manage')} 
          />
          <NavItem 
            icon={<Settings size={20} />} 
            label="Cấu hình danh mục" 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')} 
          />
        </div>

        <div className="p-8 bg-slate-900/50 border-t border-slate-800">
          <div className="flex items-center gap-4 p-4 bg-slate-800/40 rounded-3xl border border-slate-700/30">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-black border border-indigo-500/20">AD</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-white truncate uppercase tracking-wider">Nguyễn Văn A</p>
              <p className="text-[10px] text-slate-500 font-bold">Admin Manager</p>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto relative flex flex-col custom-scrollbar">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 h-24 flex items-center justify-between px-10 sticky top-0 z-20">
          <div>
            <h2 className="font-extrabold text-2xl text-slate-800 tracking-tight">
              {activeTab === 'dashboard' && 'Analytics Hub'}
              {activeTab === 'browse' && 'Kho tri thức & Tra cứu'}
              {activeTab === 'create' && (editingFaq?.id.includes('DUP') ? 'Nhân bản tri thức' : editingFaq ? 'Cập nhật tri thức' : 'Nhập liệu tri thức Pro')}
              {activeTab === 'manage' && 'Hệ thống Master Data'}
              {activeTab === 'settings' && 'Cấu hình linh hoạt'}
            </h2>
          </div>
          
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
              <Star className="text-amber-400" size={16} fill="currentColor" />
              <span className="text-xs font-bold text-slate-600">{faqs.filter(f => f.isFavorite).length} Yêu thích</span>
            </div>
            <button className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all"><Bell size={20} /></button>
          </div>
        </header>

        <div className="p-10 flex-1">
          {activeTab === 'dashboard' && <Dashboard faqs={faqs} />}
          {activeTab === 'browse' && (
            <FAQList 
              faqs={faqs} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
              onDuplicate={handleDuplicate}
              onToggleFavorite={toggleFavorite}
              onTrackRecent={trackRecent}
              recentIds={recentIds}
              categories={categories}
              availableTags={tags}
            />
          )}
          {activeTab === 'create' && (
            <FAQForm 
              onSave={handleCreateOrUpdate} 
              onCancel={handleCancel}
              initialData={editingFaq} 
              categories={categories}
              subCategories={subCategories}
              subjects={subjects}
              tags={tags}
              contentTypes={contentTypes}
            />
          )}
          {activeTab === 'manage' && (
            <DataManagement 
              faqs={faqs} 
              onSaveAll={setFaqs}
              onClear={() => setFaqs([])}
              onEdit={handleEdit}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
            />
          )}
          {activeTab === 'settings' && (
            <CategoryManagement 
              categories={categories}
              subCategories={subCategories}
              subjects={subjects}
              tags={tags}
              contentTypes={contentTypes}
              onUpdateCategories={setCategories}
              onUpdateSubCategories={setSubCategories}
              onUpdateSubjects={setSubjects}
              onUpdateTags={setTags}
              onUpdateContentTypes={setContentTypes}
            />
          )}
        </div>
      </main>
    </div>
  );
};

const NavItem: React.FC<{icon: any, label: string, active: boolean, onClick: () => void}> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-6 py-4 rounded-[1.25rem] text-sm font-bold transition-all duration-300 ${
      active 
        ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30' 
        : 'text-slate-400 hover:text-white hover:bg-white/5'
    }`}
  >
    <span className={active ? 'text-white' : 'text-slate-500'}>{icon}</span>
    <span>{label}</span>
  </button>
);

export default App;
