
import React, { useState } from 'react';
import { Category, Tag } from '../types';
import { Plus, X, BookOpen, Layers, Tags, ListTree, Grid2X2 } from 'lucide-react';

interface Props {
  categories: Category[];
  subCategories: string[];
  subjects: string[];
  tags: Tag[];
  contentTypes: string[];
  onUpdateCategories: (cats: Category[]) => void;
  onUpdateSubCategories: (subs: string[]) => void;
  onUpdateSubjects: (subs: string[]) => void;
  onUpdateTags: (tags: Tag[]) => void;
  onUpdateContentTypes: (types: string[]) => void;
}

const CategoryManagement: React.FC<Props> = ({ 
  categories, subCategories, subjects, tags, contentTypes, 
  onUpdateCategories, onUpdateSubCategories, onUpdateSubjects, onUpdateTags, onUpdateContentTypes 
}) => {
  const [newCat, setNewCat] = useState('');
  const [newSubCat, setNewSubCat] = useState('');
  const [newSub, setNewSub] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newType, setNewType] = useState('');

  const addItem = (value: string, setter: (v: string) => void, list: any[], updateFn: (l: any[]) => void, isTag = false) => {
    if (!value.trim()) return;
    if (isTag) {
      updateFn([...list, { id: `t-${Date.now()}`, name: value.trim(), color: '#6366f1' }]);
    } else if (typeof list[0] === 'string' || list.length === 0) {
      if (!list.includes(value.trim())) updateFn([...list, value.trim()]);
    } else {
      updateFn([...list, { id: `${Date.now()}`, name: value.trim() }]);
    }
    setter('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500 pb-20">
      {/* Categories */}
      <section className="bg-white p-6 rounded-[2rem] shadow-sm border space-y-4">
        <div className="flex items-center gap-3 border-b pb-4">
          <Layers className="text-indigo-600" size={20} />
          <h3 className="font-bold text-slate-800">Nhóm FAQ Chính (Categories)</h3>
        </div>
        <div className="flex gap-2">
          <input type="text" placeholder="Nhóm mới..." className="flex-1 bg-slate-50 border rounded-xl px-4 py-3 text-sm" value={newCat} onChange={e => setNewCat(e.target.value)} onKeyDown={e => e.key === 'Enter' && addItem(newCat, setNewCat, categories, onUpdateCategories)} />
          <button onClick={() => addItem(newCat, setNewCat, categories, onUpdateCategories)} className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700"><Plus size={18} /></button>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(c => (
            <div key={c.id} className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3 py-2 rounded-xl text-xs font-bold text-indigo-700">
              {c.name}
              <X size={14} className="text-indigo-300 hover:text-red-500 cursor-pointer" onClick={() => onUpdateCategories(categories.filter(x => x.id !== c.id))} />
            </div>
          ))}
        </div>
      </section>

      {/* Sub Categories */}
      <section className="bg-white p-6 rounded-[2rem] shadow-sm border space-y-4">
        <div className="flex items-center gap-3 border-b pb-4">
          <Grid2X2 className="text-blue-600" size={20} />
          <h3 className="font-bold text-slate-800">Phân nhóm con (Sub-categories)</h3>
        </div>
        <div className="flex gap-2">
          <input type="text" placeholder="Nhóm con mới..." className="flex-1 bg-slate-50 border rounded-xl px-4 py-3 text-sm" value={newSubCat} onChange={e => setNewSubCat(e.target.value)} onKeyDown={e => e.key === 'Enter' && addItem(newSubCat, setNewSubCat, subCategories, onUpdateSubCategories)} />
          <button onClick={() => addItem(newSubCat, setNewSubCat, subCategories, onUpdateSubCategories)} className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700"><Plus size={18} /></button>
        </div>
        <div className="flex flex-wrap gap-2">
          {subCategories.map(s => (
            <div key={s} className="flex items-center gap-2 bg-blue-50 border border-blue-100 px-3 py-2 rounded-xl text-xs font-bold text-blue-700">
              {s}
              <X size={14} className="text-blue-300 hover:text-red-500 cursor-pointer" onClick={() => onUpdateSubCategories(subCategories.filter(x => x !== s))} />
            </div>
          ))}
        </div>
      </section>

      {/* Subjects */}
      <section className="bg-white p-6 rounded-[2rem] shadow-sm border space-y-4">
        <div className="flex items-center gap-3 border-b pb-4">
          <BookOpen className="text-emerald-600" size={20} />
          <h3 className="font-bold text-slate-800">Môn học (Subjects)</h3>
        </div>
        <div className="flex gap-2">
          <input type="text" placeholder="Môn học mới..." className="flex-1 bg-slate-50 border rounded-xl px-4 py-3 text-sm" value={newSub} onChange={e => setNewSub(e.target.value)} onKeyDown={e => e.key === 'Enter' && addItem(newSub, setNewSub, subjects, onUpdateSubjects)} />
          <button onClick={() => addItem(newSub, setNewSub, subjects, onUpdateSubjects)} className="bg-emerald-600 text-white p-3 rounded-xl hover:bg-emerald-700"><Plus size={18} /></button>
        </div>
        <div className="flex flex-wrap gap-2">
          {subjects.map(s => (
            <div key={s} className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-xl text-xs font-bold text-emerald-700">
              {s}
              <X size={14} className="text-emerald-300 hover:text-red-500 cursor-pointer" onClick={() => onUpdateSubjects(subjects.filter(x => x !== s))} />
            </div>
          ))}
        </div>
      </section>

      {/* Tags */}
      <section className="bg-white p-6 rounded-[2rem] shadow-sm border space-y-4">
        <div className="flex items-center gap-3 border-b pb-4">
          <Tags className="text-amber-600" size={20} />
          <h3 className="font-bold text-slate-800">Quản lý Tags hệ thống</h3>
        </div>
        <div className="flex gap-2">
          <input type="text" placeholder="Tag mới..." className="flex-1 bg-slate-50 border rounded-xl px-4 py-3 text-sm" value={newTag} onChange={e => setNewTag(e.target.value)} onKeyDown={e => e.key === 'Enter' && addItem(newTag, setNewTag, tags, onUpdateTags, true)} />
          <button onClick={() => addItem(newTag, setNewTag, tags, onUpdateTags, true)} className="bg-amber-600 text-white p-3 rounded-xl hover:bg-amber-700"><Plus size={18} /></button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map(t => (
            <div key={t.id} className="flex items-center gap-2 bg-amber-50 border border-amber-100 px-3 py-2 rounded-xl text-xs font-bold text-amber-700">
              <Tags size={14} /> {t.name}
              <X size={14} className="text-amber-300 hover:text-red-500 cursor-pointer" onClick={() => onUpdateTags(tags.filter(x => x.id !== t.id))} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CategoryManagement;
