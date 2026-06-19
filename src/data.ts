import { Product, Order, Customer, UserSettings, Coupon } from './types';

export const PRODUCT_CATEGORIES = ['Furniture', 'Electronic', 'Shoes', 'Clothes', 'Sports', 'Grocery'];
export const CATEGORY_TABS = ['All Products', 'Most Purchased', 'Furniture', 'Shoes', 'Clothes', 'Electronic', 'Sports', 'Grocery'];
export const ORDER_STATUSES = ['Pending', 'Processing', 'Delivered', 'Cancelled'] as const;

export const ICON_OPTIONS = [
  'lamp',
  'armchair',
  'bookmark',
  'watch',
  'headphones',
  'radio',
  'speaker',
  'wind',
  'camera',
  'footprints',
  'flower-2',
  'shirt',
  'dumbbell',
  'circle-dot',
  'coffee',
  'shopping-basket',
  'gem',
  'book-open'
];

export const CATEGORY_ICON_DEFAULT: Record<string, string> = {
  Furniture: 'armchair',
  Electronic: 'headphones',
  Shoes: 'footprints',
  Clothes: 'shirt',
  Sports: 'dumbbell',
  Grocery: 'coffee',
};

export const CATEGORY_STYLES: Record<string, { bg: string; ic: string; text: string; dot: string }> = {
  Furniture: {
    bg: 'bg-orange-50 dark:bg-orange-500/10',
    ic: 'text-orange-600 dark:text-orange-400',
    text: 'text-orange-700 dark:text-orange-300',
    dot: 'bg-orange-500',
  },
  Electronic: {
    bg: 'bg-blue-50 dark:bg-blue-500/10',
    ic: 'text-blue-600 dark:text-blue-400',
    text: 'text-blue-700 dark:text-blue-300',
    dot: 'bg-blue-500',
  },
  Shoes: {
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    ic: 'text-emerald-600 dark:text-emerald-400',
    text: 'text-emerald-700 dark:text-emerald-300',
    dot: 'bg-emerald-500',
  },
  Clothes: {
    bg: 'bg-pink-50 dark:bg-pink-500/10',
    ic: 'text-pink-600 dark:text-pink-400',
    text: 'text-pink-700 dark:text-pink-300',
    dot: 'bg-pink-500',
  },
  Sports: {
    bg: 'bg-violet-50 dark:bg-violet-500/10',
    ic: 'text-violet-600 dark:text-violet-400',
    text: 'text-violet-700 dark:text-violet-300',
    dot: 'bg-violet-500',
  },
  Grocery: {
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    ic: 'text-amber-600 dark:text-amber-400',
    text: 'text-amber-700 dark:text-amber-300',
    dot: 'bg-amber-500',
  },
};

export const STATUS_STYLES: Record<string, string> = {
  Delivered: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  Pending: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  Processing: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
  Cancelled: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400',
};

export const INITIAL_PRODUCTS: Product[] = [
  { id: 1, name: 'Front Table CSS', category: 'Furniture', price: 150.50, stock: 312, sold: 256, icon: 'lamp' },
  { id: 2, name: 'Chester Chair', category: 'Furniture', price: 120.30, stock: 198, sold: 142, icon: 'armchair' },
  { id: 3, name: 'Oakwood Bookshelf', category: 'Furniture', price: 210.00, stock: 86, sold: 64, icon: 'bookmark' },
  { id: 4, name: 'Apple Watch Series 10', category: 'Electronic', price: 160.40, stock: 421, sold: 388, icon: 'watch' },
  { id: 5, name: 'Air Wireless Headphone', category: 'Electronic', price: 120.99, stock: 275, sold: 301, icon: 'headphones' },
  { id: 6, name: 'Apple AirPods', category: 'Electronic', price: 150.50, stock: 544, sold: 256, icon: 'radio' },
  { id: 7, name: 'Portable Speaker', category: 'Electronic', price: 150.50, stock: 233, sold: 198, icon: 'speaker' },
  { id: 8, name: 'Home Nebulizer', category: 'Electronic', price: 160.50, stock: 92, sold: 47, icon: 'wind' },
  { id: 9, name: '4K Action Camera', category: 'Electronic', price: 245.00, stock: 64, sold: 39, icon: 'camera' },
  { id: 10, name: 'Nike Downshifter 12', category: 'Shoes', price: 150.50, stock: 187, sold: 256, icon: 'footprints' },
  { id: 11, name: 'Nike Air Max 90', category: 'Shoes', price: 110.20, stock: 302, sold: 410, icon: 'footprints' },
  { id: 12, name: 'Trail Running Sandals', category: 'Shoes', price: 95.00, stock: 140, sold: 88, icon: 'footprints' },
  { id: 13, name: 'Elegant Black Perfume', category: 'Clothes', price: 190.40, stock: 78, sold: 132, icon: 'flower-2' },
  { id: 14, name: 'Classic Denim Jacket', category: 'Clothes', price: 89.90, stock: 165, sold: 121, icon: 'shirt' },
  { id: 15, name: 'Cotton Crew T-Shirt', category: 'Clothes', price: 24.50, stock: 410, sold: 367, icon: 'shirt' },
  { id: 16, name: 'Yoga Mat Pro', category: 'Sports', price: 39.99, stock: 220, sold: 175, icon: 'dumbbell' },
  { id: 17, name: 'Pro Match Football', category: 'Sports', price: 45.00, stock: 130, sold: 96, icon: 'circle-dot' },
  { id: 18, name: 'Organic Coffee Beans 1kg', category: 'Grocery', price: 18.75, stock: 350, sold: 290, icon: 'coffee' },
  { id: 19, name: 'Mixed Nuts Pack', category: 'Grocery', price: 14.20, stock: 280, sold: 211, icon: 'shopping-basket' },
];

export const INITIAL_ORDERS: Order[] = [
  { id: 'ORD-1042', customer: 'Sophia Carter', product: 'Apple Watch Series 10', amount: 160.40, status: 'Delivered', date: '2026-06-10' },
  { id: 'ORD-1041', customer: 'Liam Johnson', product: 'Nike Air Max 90', amount: 110.20, status: 'Pending', date: '2026-06-11' },
  { id: 'ORD-1040', customer: 'Olivia Brown', product: 'Air Wireless Headphone', amount: 120.99, status: 'Processing', date: '2026-06-11' },
  { id: 'ORD-1039', customer: 'Noah Wilson', product: 'Cotton Crew T-Shirt', amount: 24.50, status: 'Delivered', date: '2026-06-09' },
  { id: 'ORD-1038', customer: 'Emma Davis', product: 'Chester Chair', amount: 120.30, status: 'Cancelled', date: '2026-06-08' },
  { id: 'ORD-1037', customer: 'James Miller', product: 'Organic Coffee Beans 1kg', amount: 18.75, status: 'Delivered', date: '2026-06-08' },
  { id: 'ORD-1036', customer: 'Ava Garcia', product: 'Apple AirPods', amount: 150.50, status: 'Pending', date: '2026-06-07' },
  { id: 'ORD-1035', customer: 'Lucas Martinez', product: 'Yoga Mat Pro', amount: 39.99, status: 'Delivered', date: '2026-06-06' },
  { id: 'ORD-1034', customer: 'Mia Rodriguez', product: 'Elegant Black Perfume', amount: 190.40, status: 'Processing', date: '2026-06-06' },
  { id: 'ORD-1033', customer: 'Ethan Lee', product: 'Front Table CSS', amount: 150.50, status: 'Delivered', date: '2026-06-05' },
  { id: 'ORD-1032', customer: 'Isabella Clark', product: 'Home Nebulizer', amount: 160.50, status: 'Pending', date: '2026-06-04' },
  { id: 'ORD-1031', customer: 'Mason Walker', product: 'Pro Match Football', amount: 45.00, status: 'Delivered', date: '2026-06-03' },
];

export const INITIAL_CUSTOMERS: Customer[] = [
  { name: 'Sophia Carter', email: 'sophia.carter@gmail.com', joined: 'Jan 2025', orders: 14, spent: 2140.30 },
  { name: 'Liam Johnson', email: 'liam.johnson@gmail.com', joined: 'Mar 2025', orders: 6, spent: 890.10 },
  { name: 'Olivia Brown', email: 'olivia.brown@gmail.com', joined: 'Feb 2024', orders: 22, spent: 3560.75 },
  { name: 'Noah Wilson', email: 'noah.wilson@gmail.com', joined: 'Jun 2025', orders: 3, spent: 145.20 },
  { name: 'Emma Davis', email: 'emma.davis@gmail.com', joined: 'Nov 2023', orders: 31, spent: 5820.00 },
  { name: 'James Miller', email: 'james.miller@gmail.com', joined: 'Apr 2025', orders: 9, spent: 410.60 },
  { name: 'Ava Garcia', email: 'ava.garcia@gmail.com', joined: 'Aug 2024', orders: 17, spent: 2995.40 },
  { name: 'Lucas Martinez', email: 'lucas.martinez@gmail.com', joined: 'May 2025', orders: 5, spent: 275.80 },
  { name: 'Mia Rodriguez', email: 'mia.rodriguez@gmail.com', joined: 'Dec 2024', orders: 12, spent: 1980.00 },
  { name: 'Ethan Lee', email: 'ethan.lee@gmail.com', joined: 'Jul 2025', orders: 2, spent: 150.50 },
];

export const INITIAL_SETTINGS: UserSettings = {
  darkMode: false,
  emailNotif: true,
  pushNotif: false,
  profile: {
    name: 'Andriano Darwin',
    email: 'andriano.darwin@ecomora.com',
    phone: '+1 (555) 012-3344',
    bio: 'Store owner & operations lead.',
  }
};

export const INITIAL_COUPONS: Coupon[] = [
  { id: 'CPN-101', code: 'ECOMORA20', type: 'percentage', value: 20, minPurchase: 50, status: 'Active', expiryDate: '2026-08-31', usedCount: 142, maxUses: 500 },
  { id: 'CPN-102', code: 'SUMMER25', type: 'fixed', value: 25, minPurchase: 100, status: 'Active', expiryDate: '2026-07-15', usedCount: 88, maxUses: 200 },
  { id: 'CPN-103', code: 'HELLO50', type: 'percentage', value: 50, minPurchase: 150, status: 'Active', expiryDate: '2026-12-31', usedCount: 311, maxUses: null },
  { id: 'CPN-104', code: 'EXPIRED10', type: 'percentage', value: 10, minPurchase: 20, status: 'Expired', expiryDate: '2026-05-01', usedCount: 50, maxUses: 50 },
  { id: 'CPN-105', code: 'LAUNCHFALL', type: 'fixed', value: 15, minPurchase: 40, status: 'Inactive', expiryDate: '2026-10-31', usedCount: 0, maxUses: 1000 },
];

