import React from 'react';
import { Product, Order } from '../types';
import { ORDER_STATUSES } from '../data';
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
  BarChart,
  Bar,
} from 'recharts';
import { motion } from 'motion/react';

interface AnalyticsViewProps {
  products: Product[];
  orders: Order[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ products, orders }) => {
  // Chart 1: Revenue trend data
  const revenueTrendData = [
    { month: 'Jan', revenue: 18200 },
    { month: 'Feb', revenue: 21400 },
    { month: 'Mar', revenue: 19800 },
    { month: 'Apr', revenue: 24600 },
    { month: 'May', revenue: 27200 },
    { month: 'Jun', revenue: 31200 },
  ];

  // Chart 2: Order status distribution count
  const statusCounts: Record<string, number> = { Pending: 0, Processing: 0, Delivered: 0, Cancelled: 0 };
  orders.forEach((o) => {
    if (statusCounts[o.status] !== undefined) {
      statusCounts[o.status]++;
    }
  });

  const statusChartData = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const STATUS_COLORS = {
    Pending: '#fb923c',      // Orange
    Processing: '#3b82f6',   // Blue
    Delivered: '#10b981',    // Emerald
    Cancelled: '#f43f5e',    // Rose
  };

  // Chart 3: Units sold by category
  const unitsSoldByCat: Record<string, number> = {};
  products.forEach((p) => {
    unitsSoldByCat[p.category] = (unitsSoldByCat[p.category] || 0) + p.sold;
  });

  const unitsSoldData = Object.entries(unitsSoldByCat).map(([category, sold]) => ({
    category,
    sold,
  }));

  // Chart 4: Top 5 products by revenue
  const topProductsData = products
    .map((p) => ({
      name: p.name,
      revenue: parseFloat((p.price * p.sold).toFixed(2)),
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const formatMoney = (v: any) => `$${v.toLocaleString()}`;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Visualize your operations performance insights.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-white dark:bg-[#15171c] rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="font-bold text-gray-950 dark:text-white text-sm">Revenue Trend</h3>
            <p className="text-xs text-gray-400 mt-0.5">Operational sales development over time</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueTrendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.1)" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} style={{ fontSize: '11px', fill: '#888888' }} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} style={{ fontSize: '11px', fill: '#888888' }} />
                <Tooltip
                  formatter={(value: any) => [`$${value.toLocaleString()}`, 'Revenue']}
                  contentStyle={{ background: '#111317', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 1, fill: '#6366f1' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-white dark:bg-[#15171c] rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="font-bold text-gray-950 dark:text-white text-sm">Order Status Distribution</h3>
            <p className="text-xs text-gray-400 mt-0.5">Breakdown of order operations outcome</p>
          </div>
          <div className="h-64 flex flex-col items-center justify-center sm:flex-row sm:gap-6">
            <div className="h-44 w-44 relative flex items-center justify-center shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS] || '#ccc'} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [`${value} orders`, 'Count']}
                    contentStyle={{ background: '#111317', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Orders</span>
                <span className="text-base font-black text-gray-900 dark:text-white">
                  {orders.length}
                </span>
              </div>
            </div>
            <div className="mt-4 sm:mt-0 space-y-2 w-full flex-1 max-w-[170px]">
              {statusChartData.map((entry) => (
                <div key={entry.name} className="flex items-center justify-between text-xs font-semibold text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS] }}></span>
                    <span className="truncate">{entry.name}</span>
                  </div>
                  <span className="text-gray-900 dark:text-white pb-0.5">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Units Sold by Category */}
        <div className="bg-white dark:bg-[#15171c] rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="font-bold text-gray-950 dark:text-white text-sm">Units Sold by Category</h3>
            <p className="text-xs text-gray-400 mt-0.5">Physical product categories aggregate sales</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={unitsSoldData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.1)" />
                <XAxis dataKey="category" tickLine={false} axisLine={false} style={{ fontSize: '11px', fill: '#888888' }} />
                <YAxis tickLine={false} axisLine={false} style={{ fontSize: '11px', fill: '#888888' }} />
                <Tooltip
                  formatter={(value: any) => [`${value} units`, 'Sold']}
                  contentStyle={{ background: '#111317', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                />
                <Bar dataKey="sold" fill="#111317" radius={[6, 6, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 5 Products by Revenue */}
        <div className="bg-white dark:bg-[#15171c] rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="font-bold text-gray-950 dark:text-white text-sm">Top 5 Products by Revenue</h3>
            <p className="text-xs text-gray-400 mt-0.5">Top-grossing items on checkout ledger</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={topProductsData} margin={{ top: 5, right: 10, left: 15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(128,128,128,0.1)" />
                <XAxis type="number" tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} style={{ fontSize: '11px', fill: '#888888' }} />
                <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} width={80} style={{ fontSize: '9px', fill: '#888888', fontWeight: 'bold' }} />
                <Tooltip
                  formatter={(value: any) => [`$${value.toLocaleString()}`, 'Revenue']}
                  contentStyle={{ background: '#111317', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                />
                <Bar dataKey="revenue" fill="#6366f1" radius={[0, 4, 4, 0]} maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
