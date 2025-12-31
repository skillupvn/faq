
export enum FAQStatus {
  PENDING = 'Chờ duyệt',
  APPROVED = 'Đã duyệt',
  HIDDEN = 'Tạm ẩn',
  UPDATE_REQUIRED = 'Cần cập nhật'
}

export enum FAQType {
  FAQ = 'FAQ',
  AUTO_GREETING = 'Chào tự động',
  SPECIAL_SITUATION = 'Tình huống đặc biệt',
  COURSE_PATHWAY = 'Lộ trình môn học'
}

export interface Category {
  id: string;
  name: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface FAQItem {
  id: string;
  code: string;
  type: string;
  category: string;
  subCategory: string;
  title: string;
  question: string;
  keywords: string[];
  keywordsExpanded: string[];
  keywordsNegative: string[];
  activationCondition: string;
  answer: string;
  ctaDefault: string;
  ctaAlternative?: string;
  fileUrl?: string; // Trường mới chứa tệp/hình ảnh
  subjects: string[];
  ageGroup: string;
  level: string;
  targetParent: string;
  consultationStage: string;
  priority: number;
  displayOrder: number;
  status: FAQStatus;
  createdBy: string;
  createdAt: string;
  approvedBy: string;
  approvedAt: string;
  lastModifiedBy: string;
  lastModifiedAt: string;
  usageCount: number;
  effectivenessRating: number;
  internalNote?: string;
  tags: string[];
  isFavorite?: boolean;
}

export interface AppState {
  faqs: FAQItem[];
  categories: Category[];
  subjects: string[];
  tags: Tag[];
  contentTypes: string[];
  recentIds: string[];
}
