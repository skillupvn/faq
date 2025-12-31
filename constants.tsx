
import { FAQStatus, FAQItem, Category, Tag } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: 'Giới thiệu' },
  { id: '2', name: 'Cờ Vua' },
  { id: '3', name: 'Vẽ' },
  { id: '4', name: 'Toán Tư Duy' },
  { id: '5', name: 'Học Phí' }
];

export const INITIAL_SUBJECTS = ['Cờ Vua', 'Vẽ Mỹ Thuật', 'Toán Soroban', 'Tiền Tiểu Học', 'Rèn Chữ'];

export const INITIAL_TAGS: Tag[] = [
  { id: 't1', name: 'Quan trọng', color: '#ef4444' },
  { id: 't2', name: 'Khuyến mãi', color: '#f59e0b' },
  { id: 't3', name: 'Học thử', color: '#10b981' },
  { id: 't4', name: 'Mới', color: '#6366f1' }
];

export const INITIAL_CONTENT_TYPES = ['FAQ', 'Chào tự động', 'Tình huống đặc biệt', 'Lộ trình môn học'];

export const SAMPLE_DATA: FAQItem[] = [
  {
    id: '1001',
    code: 'FAQ-GT-001',
    type: 'FAQ',
    category: 'Giới thiệu',
    subCategory: 'Chung',
    title: 'SkillUp Center là gì?',
    question: 'SkillUp là trung tâm gì?',
    keywords: ['skillup', 'giới thiệu', 'trung tâm'],
    keywordsExpanded: ['về chúng tôi', 'thông tin'],
    keywordsNegative: [],
    activationCondition: '',
    answer: 'SkillUp là Trung tâm Đào tạo & Phát triển Kỹ năng toàn diện cho trẻ từ 3 đến 15 tuổi.',
    ctaDefault: 'Ba mẹ cho em biết bé mấy tuổi để em tư vấn ạ?',
    ctaAlternative: 'Ba mẹ xem thêm video giới thiệu nhé.',
    // Fixed: attachmentUrl to fileUrl to match FAQItem type
    fileUrl: '',
    subjects: ['Tất Cả'],
    ageGroup: '3-15',
    level: 'Cơ bản',
    targetParent: 'Tất cả',
    consultationStage: 'Tìm hiểu ban đầu',
    priority: 10,
    displayOrder: 1,
    status: FAQStatus.APPROVED,
    createdBy: 'admin@skillup.edu.vn',
    createdAt: new Date().toISOString(),
    approvedBy: 'manager@skillup.edu.vn',
    approvedAt: new Date().toISOString(),
    lastModifiedBy: '',
    lastModifiedAt: '',
    usageCount: 120,
    effectivenessRating: 5,
    internalNote: 'Dữ liệu chuẩn hóa 2025',
    tags: ['Quan trọng']
  }
];