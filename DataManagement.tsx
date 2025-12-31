
import React, { useState, useRef } from 'react';
import { FAQItem, FAQStatus } from '../types';
import { 
  Download, Upload, Trash2, Edit, Save, 
  Search, CheckCircle, AlertCircle, ChevronLeft, ChevronRight,
  Database, FileText, Check, CopyPlus, FileSpreadsheet, ExternalLink
} from 'lucide-react';

declare const XLSX: any; // Using global xlsx from script tag

interface Props {
  faqs: FAQItem[];
  onSaveAll: (faqs: FAQItem[]) => void;
  onClear: () => void;
  onEdit: (faq: FAQItem) => void;
  onDuplicate: (faq: FAQItem) => void;
  onDelete: (id: string) => void;
}

const DataManagement: React.FC<Props> = ({ faqs, onSaveAll, onClear, onEdit, onDuplicate, onDelete }) => {
  const [localFaqs, setLocalFaqs] = useState<FAQItem[]>(faqs);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [importLogs, setImportLogs] = useState<{message: string, type: 'success' | 'error' | 'info'}[]>([]);
  const itemsPerPage = 15;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = localFaqs.filter(f => 
    f.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const pagedData = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleExcelImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event: any) => {
      try {
        const bstr = event.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        
        if (Array.isArray(data)) {
          const newLogs: typeof importLogs = [];
          const validatedData: FAQItem[] = [];
          
          data.forEach((item: any) => {
            const newItem: FAQItem = {
              id: item.id || `ID-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              code: item.code || 'CODE-NEW',
              type: item.type || 'FAQ',
              category: item.category || 'Chưa phân loại',
              subCategory: item.subCategory || '',
              title: item.title || 'Tiêu đề trống',
              question: item.question || '',
              keywords: item.keywords ? item.keywords.split(',').map((k: string) => k.trim()) : [],
              keywordsExpanded: [],
              keywordsNegative: [],
              activationCondition: '',
              answer: item.answer || '',
              ctaDefault: item.ctaDefault || '',
              fileUrl: item.fileUrl || '',
              subjects: [item.subject || 'Tất cả'],
              ageGroup: item.ageGroup || '3-15',
              level: item.level || 'Cơ bản',
              targetParent: item.targetParent || 'Tất cả',
              consultationStage: item.consultationStage || '',
              priority: Number(item.priority) || 50,
              displayOrder: Number(item.displayOrder) || 1,
              status: item.status as FAQStatus || FAQStatus.PENDING,
              createdBy: 'Excel-Import',
              createdAt: new Date().toISOString(),
              approvedBy: '',
              approvedAt: '',
              lastModifiedBy: '',
              lastModifiedAt: '',
              usageCount: 0,
              effectivenessRating: 0,
              tags: item.tags ? item.tags.split(',').map((t: string) => t.trim()) : []
            };
            validatedData.push(newItem);
            newLogs.push({ message: `Đã nhập tri thức: ${newItem.title}`, type: 'success' });
          });

          setLocalFaqs(prev => [...validatedData, ...prev]);
          setImportLogs(newLogs);
        }
      } catch (err) {
        setImportLogs([{ message: 'Lỗi đọc file Excel. Vui lòng kiểm tra lại định dạng.', type: 'error' }]);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleExportExcel = () => {
    const exportData = localFaqs.map(f => ({
      id: f.id,
      code: f.code,
      type: f.type,
      category: f.category,
      title: f.title,
      question: f.question,
      answer: f.answer,
      ctaDefault: f.ctaDefault,
      fileUrl: f.fileUrl,
      keywords: f.keywords.join(', '),
      tags: f.tags.join(', '),
      priority: f.priority,
      status: f.status,
      createdAt: f.createdAt
    }));
    
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SkillUp_FAQ_Master");
    XLSX.writeFile(wb, "SkillUp_Master_Data.xlsx");
  };

  const handleDownloadTemplateExcel = () => {
    const template = [{
      code: "FAQ-CODE-001",
      type: "FAQ",
      category: "Giới thiệu",
      title: "Học phí môn Cờ Vua bao nhiêu?",
      question: "Học phí cờ vua",
      answer: "Học phí tại SkillUp là 1.500.000 VNĐ/Khóa...",
      ctaDefault: "Ba mẹ nhắn em số điện thoại nhé!",
      fileUrl: "https://skillup.vn/tailieu.pdf",
      keywords: "học phí, cờ vua, tiền học",
      tags: "Học phí, Cờ vua",
      priority: 50,
      status: "Chờ duyệt",
      ageGroup: "3-15",
      subject: "Cờ Vua"
    }];
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "SkillUp_FAQ_Template.xlsx");
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 rounded-2xl">
            <Database className="text-indigo-600" size={24} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-lg">Master Data Engine</h3>
            <p className="text-xs text-slate-500">Hỗ trợ Excel thông minh giúp nhập liệu nhanh chóng</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button onClick={handleDownloadTemplateExcel} className="flex items-center gap-2 px-5 py-3 bg-emerald-50 text-emerald-700 rounded-2xl font-bold text-sm border border-emerald-100 hover:bg-emerald-100 transition-all">
            <FileSpreadsheet size={18} /> Excel Template
          </button>
          <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-5 py-3 bg-indigo-50 text-indigo-700 rounded-2xl font-bold text-sm border border-indigo-100 hover:bg-indigo-100 transition-all">
            <Upload size={18} /> Import Excel
          </button>
          <button onClick={handleExportExcel} className="flex items-center gap-2 px-5 py-3 bg-white text-slate-700 rounded-2xl font-bold text-sm border border-slate-200 hover:bg-slate-50 transition-all">
            <Download size={18} /> Export Excel
          </button>
          <input ref={fileInputRef} type="file" className="hidden" accept=".xlsx, .xls" onChange={handleExcelImport} />
          
          <div className="w-px h-8 bg-slate-200 mx-2"></div>
          
          <button onClick={() => onSaveAll(localFaqs)} className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg hover:bg-indigo-700 transition-all">
            <Save size={18} /> Lưu Master Grid
          </button>
        </div>
      </div>

      {importLogs.length > 0 && (
        <div className="bg-white p-5 rounded-[1.5rem] border border-slate-100 max-h-48 overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-center mb-3">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lịch sử xử lý dữ liệu</p>
            <button onClick={() => setImportLogs([])} className="text-[10px] text-indigo-600 font-bold">Xóa lịch sử</button>
          </div>
          <div className="space-y-2">
            {importLogs.map((log, i) => (
              <div key={i} className={`text-xs p-2 rounded-lg flex items-center gap-3 ${log.type === 'error' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                {log.type === 'error' ? <AlertCircle size={14} /> : <Check size={14} />}
                {log.message}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col min-h-[600px]">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/30">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Tìm theo tiêu đề, mã hoặc nội dung..." 
              className="w-full pl-11 pr-4 py-3 text-sm bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 outline-none" 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
            />
          </div>
          <div className="flex items-center gap-4 text-sm font-semibold text-slate-500">
            <span>Trang {currentPage} / {totalPages || 1}</span>
            <div className="flex gap-2">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 border rounded-xl disabled:opacity-30"><ChevronLeft size={18} /></button>
              <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)} className="p-2 border rounded-xl disabled:opacity-30"><ChevronRight size={18} /></button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full text-left text-[11px] border-collapse min-w-[2200px]">
            <thead className="bg-slate-50 sticky top-0 z-10 backdrop-blur-sm">
              <tr>
                <th className="p-4 border-b border-slate-100 font-bold text-slate-500 uppercase w-[120px]">Mã Code</th>
                <th className="p-4 border-b border-slate-100 font-bold text-slate-500 uppercase w-[120px]">Nhóm</th>
                <th className="p-4 border-b border-slate-100 font-bold text-slate-500 uppercase min-w-[200px]">Tiêu đề Tri thức</th>
                <th className="p-4 border-b border-slate-100 font-bold text-slate-500 uppercase min-w-[250px]">Câu hỏi chính</th>
                <th className="p-4 border-b border-slate-100 font-bold text-slate-500 uppercase min-w-[400px]">Nội dung trả lời</th>
                <th className="p-4 border-b border-slate-100 font-bold text-slate-500 uppercase min-w-[150px]">Link Tệp</th>
                <th className="p-4 border-b border-slate-100 font-bold text-slate-500 uppercase w-[120px]">Trạng thái</th>
                <th className="p-4 border-b border-slate-100 font-bold text-slate-500 uppercase w-[100px]">Độ ưu tiên</th>
                <th className="p-4 border-b border-slate-100 font-bold text-slate-500 uppercase w-[150px]">Ngày tạo</th>
                <th className="p-4 border-b border-slate-100 font-bold text-slate-500 uppercase w-[180px] sticky right-0 bg-slate-50 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pagedData.map((faq, idx) => (
                <tr key={faq.id} className={`hover:bg-indigo-50/30 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/20'}`}>
                  <td className="p-4 font-bold text-slate-700">{faq.code}</td>
                  <td className="p-4 text-indigo-600 font-bold">{faq.category}</td>
                  <td className="p-4 font-semibold text-slate-800">{faq.title}</td>
                  <td className="p-4 italic text-slate-500">{faq.question}</td>
                  <td className="p-4 truncate max-w-[400px] text-slate-600">{faq.answer}</td>
                  <td className="p-4 truncate max-w-[150px] text-indigo-500 font-medium">
                    {faq.fileUrl ? <a href={faq.fileUrl} target="_blank" className="hover:underline flex items-center gap-1"><ExternalLink size={10} /> Xem file</a> : '-'}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase ${
                      faq.status === FAQStatus.APPROVED ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {faq.status}
                    </span>
                  </td>
                  <td className="p-4 text-center font-bold text-indigo-500">{faq.priority}</td>
                  <td className="p-4 text-slate-400">{new Date(faq.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td className="p-4 sticky right-0 bg-white/95 flex gap-2 justify-center items-center h-full min-h-[60px] border-l border-slate-100">
                    <button onClick={() => onDuplicate(faq)} title="Nhân bản" className="p-2.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-xl transition-all"><CopyPlus size={14} /></button>
                    <button onClick={() => onEdit(faq)} title="Sửa" className="p-2.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-xl transition-all"><Edit size={14} /></button>
                    <button onClick={() => onDelete(faq.id)} title="Xóa" className="p-2.5 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl transition-all"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataManagement;