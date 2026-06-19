export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  sold: number;
  icon: string;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: OrderStatus;
  date: string;
}

export interface Customer {
  name: string;
  email: string;
  joined: string;
  orders: number;
  spent: number;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  bio: string;
}

export interface UserSettings {
  darkMode: boolean;
  emailNotif: boolean;
  pushNotif: boolean;
  profile: UserProfile;
}

export type CouponType = 'percentage' | 'fixed';

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  minPurchase: number;
  status: 'Active' | 'Expired' | 'Inactive';
  expiryDate: string;
  usedCount: number;
  maxUses: number | null;
}

export interface Category {
  id: number;
  name: string;
  imageUrl?: string;
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt?: string;
  updatedAt?: string;
}

