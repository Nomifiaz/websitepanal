import React from 'react';
import { Customer } from '../types';
import { LucideIcon } from './LucideIcon';
import { motion, AnimatePresence } from 'motion/react';

interface CustomersViewProps {
  customers: Customer[];
  customerSearch: string;
  onSetCustomerSearch: (search: string) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  customerSearch,
  onSetCustomerSearch,
}) => {
  const getFilteredList = () => {
    let list = customers.slice();
    if (customerSearch.trim()) {
      const q = customerSearch.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q)
      );
    }
    return list;
  };

  const filteredList = getFilteredList();

  const AVATAR_TONES = [
    'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400',
    'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
    'bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-400',
    'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400',
    'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((p) => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const formatMoney = (n: number) => {
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } },
  };

  return (
    <div className="space-y-6 animate-fadein">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Customers</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Understand your shoppers profile directory.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <span className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <LucideIcon name="search" size={16} />
          </span>
          <input
            type="text"
            placeholder="Search customer..."
            value={customerSearch}
            onChange={(e) => onSetCustomerSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#15171c] text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white/40 shadow-sm"
          />
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {filteredList.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center justify-center text-center py-20 bg-white dark:bg-[#15171c] rounded-2xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm"
          >
            <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center mb-4 text-gray-400">
              <LucideIcon name="usersearch" size={28} />
            </div>
            <p className="font-bold text-gray-900 dark:text-white text-lg">No customers found</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 max-w-sm">
              We couldn't locate any accounts matching "{customerSearch}".
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {filteredList.map((c, i) => (
              <motion.div
                variants={itemVariants}
                key={c.email}
                className="bg-white dark:bg-[#15171c] rounded-2xl p-5 border border-gray-100 dark:border-gray-800 flex flex-col justify-between hover:shadow-md hover:border-gray-200 dark:hover:border-gray-700 transition duration-300"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <span className={`w-11 h-11 rounded-full ${AVATAR_TONES[i % AVATAR_TONES.length]} flex items-center justify-center text-sm font-bold shrink-0 shadow-xs`}>
                      {getInitials(c.name)}
                    </span>
                    <div className="min-w-0">
                      <p className="font-extrabold text-sm text-gray-900 dark:text-white truncate">{c.name}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">{c.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                    <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-3 border border-gray-100/50 dark:border-gray-800/10">
                      <p className="text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Orders</p>
                      <p className="font-black text-gray-900 dark:text-white text-base mt-1">{c.orders}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-3 border border-gray-100/50 dark:border-gray-800/10">
                      <p className="text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Spent</p>
                      <p className="font-black text-gray-900 dark:text-white text-base mt-1">{formatMoney(c.spent)}</p>
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-gray-400 font-medium mt-4 pt-3 border-t border-gray-50 dark:border-gray-800/50">
                  Shopper since <span className="font-semibold text-gray-600 dark:text-gray-300">{c.joined}</span>
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
