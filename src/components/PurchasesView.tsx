import React from 'react';
import { Order, OrderStatus } from '../types';
import { ORDER_STATUSES, STATUS_STYLES } from '../data';
import { LucideIcon } from './LucideIcon';
import { motion, AnimatePresence } from 'motion/react';

interface PurchasesViewProps {
  orders: Order[];
  orderStatus: string;
  orderSearch: string;
  onSetOrderStatus: (status: string) => void;
  onSetOrderSearch: (search: string) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

export const PurchasesView: React.FC<PurchasesViewProps> = ({
  orders,
  orderStatus,
  orderSearch,
  onSetOrderStatus,
  onSetOrderSearch,
  onUpdateOrderStatus,
}) => {
  const getFilteredList = () => {
    let list = orders.slice();
    if (orderSearch.trim()) {
      const q = orderSearch.trim().toLowerCase();
      list = list.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customer.toLowerCase().includes(q) ||
          o.product.toLowerCase().includes(q)
      );
    }
    if (orderStatus !== 'All') {
      list = list.filter((o) => o.status === orderStatus);
    }
    return list;
  };

  const filteredList = getFilteredList();

  const statuses = ['All', ...ORDER_STATUSES];

  const formatMoney = (n: number) => {
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="space-y-6 animate-fadein">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Purchases</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Track user order transactions and operation statuses.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <span className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <LucideIcon name="search" size={16} />
          </span>
          <input
            type="text"
            placeholder="Search order, customer..."
            value={orderSearch}
            onChange={(e) => onSetOrderSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#15171c] text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white/40 shadow-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {statuses.map((s) => {
          const isActive = orderStatus === s;
          return (
            <button
              key={s}
              onClick={() => onSetOrderStatus(s)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm'
                  : 'bg-white dark:bg-[#15171c] text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-800 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-700'
              }`}
            >
              {s}
            </button>
          );
        })}
      </div>

      <div className="bg-white dark:bg-[#15171c] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
        <AnimatePresence mode="popLayout">
          {filteredList.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center justify-center text-center py-20 p-8"
            >
              <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center mb-4 text-gray-400">
                <LucideIcon name="receipt" size={28} />
              </div>
              <p className="font-bold text-gray-900 dark:text-white text-lg">No orders found</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 max-w-sm">
                We couldn't locate any records for "{orderSearch}" with status "{orderStatus}".
              </p>
            </motion.div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 text-xs font-semibold uppercase tracking-wide bg-gray-50/75 dark:bg-white/5 border-b border-gray-100 dark:border-gray-800">
                    <th className="py-3 px-5 font-bold">Order ID</th>
                    <th className="py-3 px-5 font-bold">Customer</th>
                    <th className="py-3 px-5 font-bold">Product</th>
                    <th className="py-3 px-5 font-bold">Amount</th>
                    <th className="py-3 px-5 font-bold">Date</th>
                    <th className="py-3 px-5 font-bold">Status</th>
                    <th className="py-3 px-5 font-bold text-right pr-8">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
                  {filteredList.map((o) => (
                    <tr
                      key={o.id}
                      className="hover:bg-gray-50/45 dark:hover:bg-white/5 transition-colors"
                    >
                      <td className="py-4 px-5 font-black text-gray-900 dark:text-white">{o.id}</td>
                      <td className="py-4 px-5 font-medium text-gray-700 dark:text-gray-300">{o.customer}</td>
                      <td className="py-4 px-5 font-medium text-gray-600 dark:text-gray-400">{o.product}</td>
                      <td className="py-4 px-5 font-black text-gray-900 dark:text-white">{formatMoney(o.amount)}</td>
                      <td className="py-4 px-5 text-gray-500 dark:text-gray-400">{o.date}</td>
                      <td className="py-4 px-5">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap ${STATUS_STYLES[o.status]}`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right pr-5">
                        <select
                          value={o.status}
                          onChange={(e) => onUpdateOrderStatus(o.id, e.target.value as OrderStatus)}
                          className="text-xs border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1.5 bg-white dark:bg-[#101116] text-gray-700 dark:text-gray-200 font-semibold focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white/40 cursor-pointer shadow-xs transition"
                        >
                          {ORDER_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
