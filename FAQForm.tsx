
import React, { useState, useEffect } from 'react';
import { FAQItem, FAQStatus, Category, Tag } from '../types';
import { Save, X, Brain, Tag as TagIcon, Sparkles, Layout, Plus, HelpCircle, Link as LinkIcon } from 'lucide-react';

interface Props {
  onSave: (faq: FAQItem) => void;
  onCancel: () => void;
  initialData: FAQItem | null;
  categories: Category[];
  subCategories: string[];
  subjects: string[];
  tags: Tag[];
  contentTypes: string[];
}

const FAQForm: React.FC<Props> = ({ 
  onSave, onCancel, initialData, categories, subCategories, subjects, tags, contentTypes 
}) => {
  const [formData, setFormData] = useState<Partial<FAQItem>>({
    type: contentTypes[0] || 'FAQ',
    category: categories[0]?.name || '',
    subCategory: subCategories[0] || 'Chung',
    title: '',
    question: '',
    answer: '',
    ctaDefault: '',
    ctaAlternative: '',
    fileUrl: '',
    keywords: [],
    keywordsExpanded: [],
    keywordsNegative: [],
    subjects: [],
    tags: [],
    priority: 50,
    status: FAQStatus.PENDING,
    usageCount: 0,
    ageGroup: 'Tất cả',
    level: 'Cơ bản',
    targetParent: 'Tất cả',
    consultationStage: 'Tìm hiểu ban đầu',
    ...initialData
  });

  const [keywordInput, setKeywordInput] = useState('');

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const faq: FAQItem = {
      ...formData as FAQItem,
      id: formData.id || `ID-${Date.now()}`,
      code: formData.code || `CODE-${Date.now()}`,
      createdAt: formData.createdAt || new Date().toISOString(),
      usageCount: formData.usageCount || 0,
    };
    onSave(faq);
  };

  const toggleTag = (tagName: string) => {
    const current = formData.tags || [];
    if (current.includes(tagName)) {
      setFormData({ ...formData, tags: current.filter(t => t !== tagName) });
    } else {
      setFormData({ ...formData, tags: [...current, tagName] });
    }
  };

  const addKeyword = () => {
    if (!keywordInput.trim()) return;
    const current = formData.keywords || [];
    if (!current.includes(keywordInput.trim())) {
      setFormData({ ...formData, keywords: [...current, keywordInput.trim()] });
    }
    setKeywordInput('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-[40px] border border-slate-200 shadow-2xl overflow-hidden max-w-6xl mx-auto mb-20 animate-in zoom-in-95 duration-500">
      <div className="p-10 border-b bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-indigo-600 rounded-[20px] flex items-center justify-center text-white shadow-xl shadow-indigo-600/20">
            <Plus size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">
              {initialData?.id.includes('DUP') ? 'Tạo bản sao tri thức' : initialData ? 'Cập nhật tri thức' : 'Nhập liệu tri thức Pro'}
            </h3>
            <p className="text-sm text-slate-500 font-medium mt-0.5">Vui lòng điền đầy đủ các thông tin tri thức chuẩn</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button type="button" onClick={onCancel} className="px-8 py-3.5 text-sm font-bold text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-2xl shadow-sm transition-all">
            Hủy bỏ
          </button>
          <button type="submit" className="flex items-center gap-2 px-10 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-xl transition-all scale-100 hover:scale-[1.02]">
            <Save size={18} /> Lưu Tri Thức
          </button>
        </div>
      </div>

      <div className="p-10 space-y-12 max-h-[calc(100vh-250px)] overflow-y-auto custom-scrollbar">
        <fieldset className="space-y-6">
          <legend className="flex items-center gap-3 text-sm font-black text-indigo-600 uppercase tracking-[0.2em] mb-6">
            <Layout size={18} /> <span>01. Phân loại nội dung</span>
          </legend>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <FormInput label="Loại nội dung">
              <select className="input-field" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                {contentTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </FormInput>
            <FormInput label="Nhóm chính">
              <select className="input-field" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </FormInput>
            <FormInput label="Phân nhóm con">
              <select className="input-field font-bold text-indigo-600" value={formData.subCategory} onChange={e => setFormData({...formData, subCategory: e.target.value})}>
                {subCategories.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormInput>
            <FormInput label="Trạng thái">
              <select className="input-field" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as FAQStatus})}>
                {Object.values(FAQStatus).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormInput>
          </div>
        </fieldset>

        <fieldset className="space-y-6">
          <legend className="flex items-center gap-3 text-sm font-black text-indigo-600 uppercase tracking-[0.2em] mb-6">
            <Sparkles size={18} /> <span>02. Nội dung tri thức cốt lõi</span>
          </legend>
          <div className="space-y-6">
            <FormInput label="Tiêu đề hiển thị (Hệ thống)">
              <input required type="text" className="input-field font-bold text-slate-800" placeholder="Tiêu đề gợi nhớ..." value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </FormInput>
            <FormInput label="Câu hỏi thường gặp của Ba Mẹ">
              <textarea className="input-field min-h-[80px]" rows={2} placeholder="Nhập những câu hỏi phụ huynh hay đặt ra..." value={formData.question} onChange={e => setFormData({...formData, question: e.target.value})} />
            </FormInput>
            <FormInput label="Nội dung phản hồi chuẩn (Answer)">
              <textarea required className="input-field min-h-[200px] py-6 bg-indigo-50/20" placeholder="Soạn thảo câu trả lời chuyên nghiệp..." value={formData.answer} onChange={e => setFormData({...formData, answer: e.target.value})} />
            </FormInput>
            <FormInput label="Đường link tệp/hình ảnh đính kèm (FileUrl)">
              <div className="flex gap-2">
                <div className="bg-slate-100 p-4 rounded-2xl flex items-center"><LinkIcon size={18} className="text-slate-400" /></div>
                <input type="url" className="input-field" placeholder="https://..." value={formData.fileUrl} onChange={e => setFormData({...formData, fileUrl: e.target.value})} />
              </div>
            </FormInput>
          </div>
        </fieldset>

        <fieldset className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-8">
            <legend className="flex items-center gap-3 text-sm font-black text-indigo-600 uppercase tracking-[0.2em] mb-6">
              <TagIcon size={18} /> <span>03. Tiếp thị & Tags</span>
            </legend>
            <FormInput label="Mẫu câu kêu gọi hành động (CTA)">
              <textarea className="input-field min-h-[100px]" placeholder="Câu chốt hạ chuyên nghiệp..." value={formData.ctaDefault} onChange={e => setFormData({...formData, ctaDefault: e.target.value})} />
            </FormInput>
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">Gán Tags tri thức</label>
              <div className="flex flex-wrap gap-2.5">
                {tags.map(t => (
                  <button key={t.id} type="button" onClick={() => toggleTag(t.name)} className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${formData.tags?.includes(t.name) ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white text-slate-500'}`}>
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <legend className="flex items-center gap-3 text-sm font-black text-indigo-600 uppercase tracking-[0.2em] mb-6">
              <HelpCircle size={18} /> <span>04. Từ khóa & SEO</span>
            </legend>
            <div className="space-y-4">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">Từ khóa tra cứu nhanh (Keywords)</label>
              <div className="flex gap-3">
                <input type="text" className="input-field" placeholder="Nhập từ khóa và Enter..." value={keywordInput} onChange={e => setKeywordInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addKeyword())} />
                <button type="button" onClick={addKeyword} className="bg-slate-900 text-white px-8 rounded-2xl font-bold">Thêm</button>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {formData.keywords?.map(k => (
                  <span key={k} className="bg-slate-100 text-slate-700 px-4 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-2 border">
                    {k} <X size={14} className="cursor-pointer" onClick={() => setFormData({...formData, keywords: formData.keywords?.filter(x => x !== k)})} />
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormInput label="Độ ưu tiên (1-100)">
                <input type="number" className="input-field" value={formData.priority} onChange={e => setFormData({...formData, priority: parseInt(e.target.value)})} />
              </FormInput>
              <FormInput label="Độ tuổi">
                <input type="text" className="input-field" placeholder="3-15" value={formData.ageGroup} onChange={e => setFormData({...formData, ageGroup: e.target.value})} />
              </FormInput>
            </div>
          </div>
        </fieldset>
      </div>
      
      <style>{`
        .input-field { width: 100%; background-color: #F8FAFC; border: 2px solid transparent; border-radius: 16px; padding: 12px 18px; font-size: 14px; font-weight: 500; outline: none; transition: all 0.3s; }
        .input-field:focus { background-color: #fff; border-color: #6366F1; box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.05); }
      `}</style>
    </form>
  );
};

const FormInput = ({ label, children }: any) => (
  <div className="space-y-2">
    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1 block">{label}</label>
    {children}
  </div>
);

export default FAQForm;
