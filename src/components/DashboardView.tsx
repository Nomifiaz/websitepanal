import React from 'react';
import { Product, Order, Customer } from '../types';
import { LucideIcon } from './LucideIcon';
import { CATEGORY_STYLES, STATUS_STYLES } from '../data';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { motion } from 'motion/react';

interface DashboardViewProps {
  products: Product[];
  orders: Order[];
  customers: Customer[];
  onNavigate: (page: string) => void;
  onOpenAddProduct: () => void;
  rawName: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  products,
  orders,
  customers,
  onNavigate,
  onOpenAddProduct,
  rawName,
}) => {
  const totalRevenue = products.reduce((s, p) => s + p.price * p.sold, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const totalCustomers = customers.length;

  const stats = [
    { label: 'Total Revenue', value: totalRevenue, isMoney: true, icon: 'dollarsign', delta: '+12.4%', up: true },
    { label: 'Total Orders', value: totalOrders, isMoney: false, icon: 'shoppingcart', delta: '+4.1%', up: true },
    { label: 'Active Products', value: totalProducts, isMoney: false, icon: 'package', delta: '+2 new', up: true },
    { label: 'Customers', value: totalCustomers, isMoney: false, icon: 'users', delta: '-1.2%', up: false },
  ];

  const recentOrders = orders.slice(0, 5);

  // Revenue chart data (Last 6 months)
  const revenueTrendData = [
    { month: 'Jan', revenue: 18200 },
    { month: 'Feb', revenue: 21400 },
    { month: 'Mar', revenue: 19800 },
    { month: 'Apr', revenue: 24600 },
    { month: 'May', revenue: 27200 },
    { month: 'Jun', revenue: 31200 },
  ];

  // Sales by category data
  const categoryCount: Record<string, number> = {};
  products.forEach((p) => {
    categoryCount[p.category] = (categoryCount[p.category] || 0) + p.sold;
  });

  const categoryChartData = Object.entries(categoryCount).map(([name, value]) => ({
    name,
    value,
  }));

  const CATEGORY_COLORS: Record<string, string> = {
    Furniture: '#fb923c', // orange
    Electronic: '#3b82f6', // blue
    Shoes: '#10b981', // emerald
    Clothes: '#ec4899', // pink
    Sports: '#8b5cf6', // violet
    Grocery: '#f59e0b', // amber
  };

  const formatMoney = (n: number) => {
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatAbbreviation = (n: number) => {
    return n.toLocaleString('en-US');
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Welcome back, {rawName.split(' ')[0]}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Here's how your store is performing today.
          </p>
        </div>
        <button
          onClick={onOpenAddProduct}
          className="self-start sm:self-auto flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold px-5 py-3 rounded-full hover:opacity-90 transition shadow-sm active:scale-95"
        >
          <LucideIcon name="plus" size={16} />
          Add New Product
        </button>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <motion.div
            variants={itemVariants}
            key={s.label}
            className="bg-white dark:bg-[#15171c] rounded-2xl p-5 border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:border-gray-200 dark:hover:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{s.label}</span>
              <span className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-700 dark:text-gray-300">
                <LucideIcon name={s.icon} size={16} />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
                {s.isMoney ? formatMoney(s.value) : formatAbbreviation(s.value)}
              </span>
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${s.up ? 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10' : 'text-rose-500 bg-rose-50 dark:text-rose-400 dark:bg-rose-500/10'}`}>
                {s.delta}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Line Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-[#15171c] rounded-2xl p-5 border border-gray-100 dark:border-gray-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-gray-950 dark:text-white text-base">Revenue Overview</h2>
              <p className="text-xs text-gray-400 mt-0.5">Historical store sales progress</p>
            </div>
            <span className="text-xs font-medium text-gray-400 bg-gray-50 dark:bg-white/5 px-2.5 py-1 rounded-full">Last 6 Months</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueTrendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.1)" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} style={{ fontSize: '12px', fill: '#888888' }} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} style={{ fontSize: '12px', fill: '#888888' }} />
                <Tooltip
                  formatter={(value: any) => [`$${value.toLocaleString()}`, 'Revenue']}
                  contentStyle={{ background: '#111317', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-primary, #6366f1)"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 1, fill: '#6366f1' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Doughnut Chart */}
        <div className="bg-white dark:bg-[#15171c] rounded-2xl p-5 border border-gray-100 dark:border-gray-800 flex flex-col">
          <div className="mb-4">
            <h2 className="font-bold text-gray-950 dark:text-white text-base">Sales by Category</h2>
            <p className="text-xs text-gray-400 mt-0.5">Sold units per vertical</p>
          </div>
          <div className="h-44 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || '#636363'} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [`${value} units`, 'Sold']}
                  contentStyle={{ background: '#111317', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <span className="text-xs text-gray-400 font-semibold block uppercase">Total units</span>
              <span className="text-lg font-black text-gray-900 dark:text-white">
                {categoryChartData.reduce((acc, curr) => acc + curr.value, 0)}
              </span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 flex-1 overflow-y-auto no-scrollbar max-h-[110px]">
            {categoryChartData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: CATEGORY_COLORS[entry.name] }}></span>
                <span className="truncate flex-1">{entry.name}</span>
                <span className="font-bold text-gray-900 dark:text-white shrink-0">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white dark:bg-[#15171c] rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-gray-950 dark:text-white text-base">Recent Orders</h2>
            <p className="text-xs text-gray-400 mt-0.5">Latest customer purchase receipts</p>
          </div>
          <button
            onClick={() => onNavigate('purchases')}
            className="text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center gap-1 transition-all"
          >
            View all
            <LucideIcon name="arrowright" size={14} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr class="text-left text-gray-400 text-xs font-semibold uppercase tracking-wide border-b border-gray-100 dark:border-gray-800 pb-2">
                <th className="py-2.5 pr-4 font-semibold text-gray-400">Order ID</th>
                <th className="py-2.5 pr-4 font-semibold text-gray-400">Customer</th>
                <th className="py-2.5 pr-4 font-semibold text-gray-400">Product</th>
                <th className="py-2.5 pr-4 font-semibold text-gray-400">Amount</th>
                <th className="py-2.5 pr-4 font-semibold text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id} className="border-t border-gray-100 dark:border-gray-800 first:border-0 hover:bg-gray-50/45 dark:hover:bg-white/5 transition-colors">
                  <td className="py-3.5 pr-4 font-black text-gray-900 dark:text-white">{o.id}</td>
                  <td className="py-3.5 pr-4 text-gray-600 dark:text-gray-300 font-medium">{o.customer}</td>
                  <td className="py-3.5 pr-4 text-gray-600 dark:text-gray-300 font-medium">{o.product}</td>
                  <td className="py-3.5 pr-4 font-black text-gray-900 dark:text-white">{formatMoney(o.amount)}</td>
                  <td className="py-3.5 pr-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap ${STATUS_STYLES[o.status]}`}>
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
