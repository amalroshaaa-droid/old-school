export type OrderStatus = 'NEW' | 'ACCEPTED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
export type ReviewStatus = 'PENDING' | 'APPROVED' | 'HIDDEN';
export type Page = 'dashboard' | 'orders' | 'menu' | 'analytics' | 'customers' | 'reviews' | 'settings';

export interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  customer: string;
  phone: string;
  time: string;
  timestamp: number;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  date: string;
  paymentMethod?: string;
  paymentStatus?: 'PAID' | 'PENDING' | 'CASH';
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  available: boolean;
  description: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  orders: number;
  totalSpent: number;
  lastOrder: string;
  lastOrderTime: string;
}

export interface Review {
  id: string;
  customer: string;
  rating: number;
  text: string;
  date: string;
  status: ReviewStatus;
}

export interface AppState {
  orders: Order[];
  menuItems: MenuItem[];
  customers: Customer[];
  reviews: Review[];
}
