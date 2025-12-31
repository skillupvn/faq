
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell
} from 'recharts';
import { FAQItem, FAQType } from '../types';
// Added AlertCircle to the imports
import { TrendingUp, Users, MessageCircle, FileText, AlertCircle } from 'lucide-react';

interface Props {
  faqs: FAQItem[];
}

const Dashboard: React.FC<Props> = ({ faqs }) => {
  // Fix: Explicitly type typeData to avoid "unknown" type errors when mapping over Object.values
  const typeData: { name: string; value: number }[] = Object.values(FAQType).map(type => ({
    name: type as string,
    value: faqs.filter(f => f.type === type).length
  }));

  const categoryStats = faqs.reduce((acc: any, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {});

  const barData = Object.keys(categoryStats).map(key => ({
    name: key,
    count: categoryStats[key]
  }));

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Tổng số FAQ" value={faqs.length} icon={<FileText className="text-indigo-600" />} color="bg-indigo-50" />
        <StatCard title="Lượt sử dụng" value={faqs.reduce((s, f) => s + f.usageCount, 0)} icon={<TrendingUp className="text-emerald-600" />} color="bg-emerald-50" />
        <StatCard title="Tình huống đặc biệt" value={faqs.filter(f => f.type === FAQType.SPECIAL_SITUATION).length} icon={<AlertCircle className="text-amber-600" />} color="bg-amber-50" />
        <StatCard title="Mẫu chào hỏi" value={faqs.filter(f => f.type === FAQType.AUTO_GREETING).length} icon={<MessageCircle className="text-blue-600" />} color="bg-blue-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Phân bổ theo Nhóm FAQ</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Phân loại Loại nội dung</h3>
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-4 justify-center mt-4">
            {typeData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}} />
                <span className="text-xs text-slate-500">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border flex items-center gap-4 hover:shadow-md transition-shadow">
    <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <h4 className="text-2xl font-bold text-slate-800">{value.toLocaleString()}</h4>
    </div>
  </div>
);

export default Dashboard;
