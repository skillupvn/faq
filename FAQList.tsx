
import React, { useState, useMemo } from 'react';
import { FAQItem, Category, FAQStatus, Tag } from '../types';
import { 
  Search, Copy, Edit, Trash2, Check, 
  Tag as TagIcon, Star, Clock, ListTree,
  MessageCircle, Sparkles, Heart, ExternalLink, CopyPlus, ChevronLeft, ChevronRight
} from 'lucide-react';

interface Props {
  faqs: FAQItem[];
  categories: Category[];
  availableTags: Tag[];
  recentIds: string[];
  onEdit: (faq: FAQItem) => void;
  onDuplicate: (faq: FAQItem) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onTrackRecent: (id: string) => void;
}

const FAQList: React.FC<Props> = ({ 
  faqs, categories, availableTags, recentIds,
  onEdit, onDuplicate, onDelete, onToggleFavorite, onTrackRecent 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'favorites' | 'recent'>('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterTag, setFilterTag] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const filteredFaqs = useMemo(() => {
    let baseList = [...faqs];
    if (activeTab === 'favorites') baseList = baseList.filter(f => f.isFavorite);
    if (activeTab === 'recent') {
      baseList = recentIds.map(rid => faqs.find(f => f.id === rid)).filter(Boolean) as FAQItem[];
    }

    const filtered = baseList.filter(faq => {
      const matchesSearch = 
        faq.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = filterCategory === 'all' || faq.category === filterCategory;
      const matchesTag = filterTag === 'all' || (faq.tags && faq.tags.includes(filterTag));
      
      return matchesSearch && matchesCategory && matchesTag;
    });

    // Reset pagination when filter changes
    return filtered;
  }, [faqs, activeTab, searchTerm, filterCategory, filterTag, recentIds]);

  const totalPages = Math.ceil(filteredFaqs.length / itemsPerPage);
  const pagedFaqs = filteredFaqs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleCopy = (id: string, text: string, type: 'ans' | 'cta') => {
    navigator.clipboard.writeText(text);
    setCopiedId(`${id}-${type}`);
    onTrackRecent(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="relative flex-1 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm tri thức, từ khóa hoặc câu hỏi của ba mẹ..."
              className="w-full pl-14 pr-6 py-4.5 bg-slate-50 border-2 border-transparent rounded-3xl focus:bg-white focus:border-indigo-500/20 outline-none transition-all text-slate-700 font-medium"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              className="bg-slate-50 px-6 py-4 text-sm font-semibold text-slate-600 rounded-3xl outline-none"
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">Mọi nhóm</option>
              {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-8">
          <TabButton active={activeTab === 'all'} onClick={() => { setActiveTab('all'); setCurrentPage(1); }} icon={<ListTree size={18} />} label="Tất cả" count={faqs.length} />
          <TabButton active={activeTab === 'favorites'} onClick={() => { setActiveTab('favorites'); setCurrentPage(1); }} icon={<Heart size={18} />} label="Yêu thích" count={faqs.filter(f => f.isFavorite).length} activeColor="text-rose-600" activeBg="bg-rose-50" />
          <TabButton active={activeTab === 'recent'} onClick={() => { setActiveTab('recent'); setCurrentPage(1); }} icon={<Clock size={18} />} label="Gần đây" count={recentIds.length} activeColor="text-amber-600" activeBg="bg-amber-50" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {pagedFaqs.map(faq => (
          <div key={faq.id} className="bg-white rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-500 group flex flex-col h-full overflow-hidden">
            <div className="p-7 flex flex-col h-full">
              <div className="flex items-start justify-between mb-5">
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold uppercase border border-indigo-100">
                    {faq.category}
                  </span>
                </div>
                <button 
                  onClick={() => onToggleFavorite(faq.id)}
                  className={`p-2.5 rounded-2xl transition-all ${faq.isFavorite ? 'bg-rose-50 text-rose-500 shadow-lg' : 'bg-slate-50 text-slate-300'}`}
                >
                  <Heart size={18} fill={faq.isFavorite ? "currentColor" : "none"} />
                </button>
              </div>

              <h3 className="font-bold text-slate-800 text-lg mb-3 leading-tight">{faq.title}</h3>
              <p className="text-xs italic text-slate-500 line-clamp-2 font-medium mb-4">"{faq.question}"</p>

              <div className="flex-1 space-y-4">
                <div className="bg-slate-50/80 p-5 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-sm text-slate-700 leading-relaxed line-clamp-4 font-medium whitespace-pre-line">{faq.answer}</p>
                </div>
                {faq.fileUrl && (
                  <a href={faq.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-4 py-3 rounded-2xl border border-indigo-100 hover:bg-indigo-100 transition-all">
                    <ExternalLink size={14} /> Liên kết tài liệu đính kèm
                  </a>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-3">
                <button 
                  onClick={() => handleCopy(faq.id, faq.answer, 'ans')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                    copiedId === `${faq.id}-ans` ? 'bg-emerald-500 text-white shadow-lg' : 'bg-indigo-600 text-white shadow-lg hover:bg-indigo-700'
                  }`}
                >
                  {copiedId === `${faq.id}-ans` ? <Check size={14} /> : <Copy size={14} />}
                  Copy Phản hồi
                </button>
                <button 
                  onClick={() => handleCopy(faq.id, faq.ctaDefault, 'cta')}
                  className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold transition-all border ${
                    copiedId === `${faq.id}-cta` ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {copiedId === `${faq.id}-cta` ? <Check size={14} /> : <Sparkles size={14} />}
                  CTA
                </button>
                
                <div className="w-full flex justify-end gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => onDuplicate(faq)} title="Tạo bản sao" className="p-2 text-slate-400 hover:text-emerald-600"><CopyPlus size={16} /></button>
                  <button onClick={() => onEdit(faq)} title="Chỉnh sửa" className="p-2 text-slate-400 hover:text-indigo-600"><Edit size={16} /></button>
                  <button onClick={() => onDelete(faq.id)} title="Xóa" className="p-2 text-slate-400 hover:text-rose-500"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-12 pb-10">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-sm text-slate-600 disabled:opacity-30 transition-all hover:bg-slate-50"
          >
            <ChevronLeft size={18} /> Trước
          </button>
          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button 
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-12 h-12 rounded-2xl font-bold transition-all ${currentPage === i + 1 ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-sm text-slate-600 disabled:opacity-30 transition-all hover:bg-slate-50"
          >
            Sau <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label, count, activeColor = "text-indigo-600", activeBg = "bg-indigo-50" }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl text-sm font-bold transition-all ${
      active ? `${activeColor} ${activeBg} shadow-sm` : 'text-slate-500 hover:bg-slate-50'
    }`}
  >
    {icon} <span>{label}</span> <span className={`px-2 py-0.5 rounded-full text-[10px] ${active ? 'bg-white/60' : 'bg-slate-100'}`}>{count}</span>
  </button>
);

export default FAQList;
