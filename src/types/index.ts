export interface Banner {
  id: number;
  title: string;
  image_url: string;
  mobile_image_url: string;
  link_url: string;
  sort_order: number;
  is_active: number;
  created_at: string;
}

export interface Notice {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at?: string;
}

export interface Press {
  id: number;
  title: string;
  link_url: string;
  file_url?: string;
  notice_at: string;
  created_at: string;
}

export interface Partner {
  id: number;
  name: string;
  logo_url: string;
  sort_order: number;
  is_active: number;
}

export interface Investor {
  id: number;
  name: string;
  logo_url: string;
  sort_order: number;
  is_active: number;
}

export interface Stock {
  id: number;
  funble_cd: string;
  funble_nm: string;
  status: "ing" | "expect" | "end";
  sort_order: number;
  thumb_img_url?: string;
  scr_price?: number;
  total_issue_qty?: number;
  list_at?: string;
  extra_json?: string;
}

export interface Announcement {
  id: number;
  stock_id: number;
  title: string;
  category: string;
  content: string;
  file_url?: string;
  created_at: string;
}

export interface StockPrice {
  id: number;
  stock_id: number;
  price: number;
  begin_price?: number;
  end_price?: number;
  high_price?: number;
  low_price?: number;
  deal_qty?: number;
  date: string;
}

export interface FaqCategory {
  id: number;
  name: string;
  code: string;
  sort_order: number;
}

export interface Faq {
  id: number;
  category_id: number;
  question: string;
  answer: string;
  sort_order: number;
}

export interface AdminUser {
  id: number;
  username: string;
  password_hash: string;
  created_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  hasNext: boolean;
  page: number;
  totalCount?: number;
}
