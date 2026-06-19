import React, { useState } from 'react';
import { Coupon, CouponType } from '../types';
import { LucideIcon } from './LucideIcon';
import { motion, AnimatePresence } from 'motion/react';

interface CouponsViewProps {
  coupons: Coupon[];
  onAddCoupon: (coupon: Omit<Coupon, 'id'>) => void;
  onUpdateCoupon: (coupon: Coupon) => void;
  onDeleteCoupon: (id: string) => void;
}

export const CouponsView: React.FC<CouponsViewProps> = ({
  coupons,
  onAddCoupon,
  onUpdateCoupon,
  onDeleteCoupon,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Local active modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  // Form states
  const [code, setCode] = useState('');
  const [type, setType] = useState<CouponType>('percentage');
  const [value, setValue] = useState<number | ''>('');
  const [minPurchase, setMinPurchase] = useState<number | ''>('');
  const [expiryDate, setExpiryDate] = useState('');
  const [maxUses, setMaxUses] = useState<number | ''>('');
  const [status, setStatus] = useState<'Active' | 'Expired' | 'Inactive'>('Active');

  // Stats calculate
  const totalCoupons = coupons.length;
  const activeCoupons = coupons.filter((c) => c.status === 'Active').length;
  const totalRedeemed = coupons.reduce((sum, c) => sum + c.usedCount, 0);
  
  // Calculate average discount value of percentage coupons
  const pctCoupons = coupons.filter((c) => c.type === 'percentage');
  const avgDiscount = pctCoupons.length > 0 
    ? Math.round(pctCoupons.reduce((sum, c) => sum + c.value, 0) / pctCoupons.length) 
    : 0;

  const stats = [
    { label: 'Total Coupons', value: totalCoupons, icon: 'ticket', color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 dark:text-indigo-400' },
    { label: 'Active Codes', value: activeCoupons, icon: 'checkcircle2', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400' },
    { label: 'Total Redeemed', value: totalRedeemed.toLocaleString(), icon: 'tag', color: 'text-pink-600 bg-pink-50 dark:bg-pink-500/10 dark:text-pink-400' },
    { label: 'Avg. Discount', value: `${avgDiscount}%`, icon: 'percent', color: 'text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400' },
  ];

  const handleOpenAdd = () => {
    setEditingCoupon(null);
    setCode('');
    setType('percentage');
    setValue('');
    setMinPurchase('');
    setExpiryDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]); // 30 days future default
    setMaxUses('');
    setStatus('Active');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Coupon) => {
    setEditingCoupon(c);
    setCode(c.code);
    setType(c.type);
    setValue(c.value);
    setMinPurchase(c.minPurchase);
    setExpiryDate(c.expiryDate);
    setMaxUses(c.maxUses === null ? '' : c.maxUses);
    setStatus(c.status);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCoupon(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || value === '') return;

    const couponData = {
      code: code.trim().toUpperCase(),
      type,
      value: Number(value),
      minPurchase: Number(minPurchase) || 0,
      expiryDate,
      maxUses: maxUses === '' ? null : Number(maxUses),
      status,
      usedCount: editingCoupon ? editingCoupon.usedCount : 0,
    };

    if (editingCoupon) {
      onUpdateCoupon({
        ...editingCoupon,
        ...couponData,
      });
    } else {
      onAddCoupon(couponData);
    }
    handleCloseModal();
  };

  const toggleStatus = (c: Coupon) => {
    const newStatus = c.status === 'Active' ? 'Inactive' : 'Active';
    onUpdateCoupon({
      ...c,
      status: newStatus,
    });
  };

  const getFilteredCoupons = () => {
    let list = coupons.slice();
    
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((c) => c.code.toLowerCase().includes(q));
    }
    
    // Status Filter
    if (statusFilter !== 'All') {
      list = list.filter((c) => c.status === statusFilter);
    }
    
    return list;
  };

  const filtered = getFilteredCoupons();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 240, damping: 20 } },
  };

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Coupons & Rewards</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Formulate promo codes, generate voucher incentives, and track customer discounts.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="self-start sm:self-auto flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-bold px-5 py-3 rounded-full hover:opacity-90 active:scale-95 transition whitespace-nowrap shadow-sm cursor-pointer"
        >
          <LucideIcon name="plus" size={16} />
          Create Coupon
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white dark:bg-[#15171c] rounded-2xl p-5 border border-gray-100 dark:border-gray-800 flex items-center gap-4 shadow-xs"
          >
            <span className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${s.color}`}>
              <LucideIcon name={s.icon} size={20} />
            </span>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">{s.label}</p>
              <p className="text-2xl font-black text-gray-950 dark:text-white mt-1.5 leading-none">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Quick filter tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <span className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <LucideIcon name="search" size={16} />
          </span>
          <input
            type="text"
            placeholder="Search promo code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#15171c] text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white/40 shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white"
            >
              <LucideIcon name="x" size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {['All', 'Active', 'Inactive', 'Expired'].map((filter) => {
            const isActive = statusFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm'
                    : 'bg-white dark:bg-[#15171c] text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-800 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-700'
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of tickets */}
      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center justify-center text-center py-20 bg-white dark:bg-[#15171c] rounded-2xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm"
          >
            <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center mb-4 text-gray-400">
              <LucideIcon name="ticket" size={28} />
            </div>
            <p className="font-bold text-gray-900 dark:text-white text-lg">No coupon codes found</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 max-w-sm">
              We couldn't locate any coupons matching your search or filters. Try adjusting your parameters.
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {filtered.map((c) => {
              const isActive = c.status === 'Active';
              const isExpired = c.status === 'Expired';
              
              // Colors based on status
              const statusBadge = isExpired
                ? 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'
                : !isActive
                ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400';

              // Ticket styles classes
              return (
                <motion.div
                  layout
                  variants={itemVariants}
                  key={c.id}
                  className="relative bg-white dark:bg-[#15171c] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Outer semicircles for coupon ticket ticket notch effect */}
                  <div className="absolute top-1/2 -translate-y-1/2 -left-3 w-6 h-6 bg-[#F1F2F5] dark:bg-[#0B0C0F] border-r border-gray-100 dark:border-gray-800 rounded-full z-10"></div>
                  <div className="absolute top-1/2 -translate-y-1/2 -right-3 w-6 h-6 bg-[#F1F2F5] dark:bg-[#0B0C0F] border-l border-gray-100 dark:border-gray-800 rounded-full z-10"></div>

                  {/* Top Portion */}
                  <div className="p-5 pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${statusBadge}`}>
                        {c.status}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="w-7 h-7 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition cursor-pointer"
                          title="Edit coupon"
                        >
                          <LucideIcon name="pencil" size={12} />
                        </button>
                        <button
                          onClick={() => onDeleteCoupon(c.id)}
                          className="w-7 h-7 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/15 flex items-center justify-center text-gray-500 hover:text-rose-600 transition cursor-pointer"
                          title="Delete coupon"
                        >
                          <LucideIcon name="trash" size={12} />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-indigo-50/70 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                        <LucideIcon name={c.type === 'percentage' ? 'percent' : 'dollarsign'} size={24} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">PROMO CODE</p>
                        <h2 className="text-xl font-extrabold text-gray-950 dark:text-white tracking-wider truncate flex items-center gap-1.5 mt-0.5 select-all hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                          {c.code}
                        </h2>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-semibold">
                      <div className="bg-gray-50/60 dark:bg-white/5 rounded-xl p-2.5">
                        <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wide">Discount</p>
                        <p className="text-gray-900 dark:text-white font-black text-sm mt-0.5">
                          {c.type === 'percentage' ? `${c.value}% OFF` : `$${c.value.toLocaleString()} OFF`}
                        </p>
                      </div>
                      <div className="bg-gray-50/60 dark:bg-white/5 rounded-xl p-2.5">
                        <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wide font-sans">Min Purchase</p>
                        <p className="text-gray-900 dark:text-white font-black text-sm mt-0.5">
                          ${c.minPurchase.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Coupon Dotted Divider line */}
                  <div className="border-t border-dashed border-gray-150 dark:border-gray-800 mx-5"></div>

                  {/* Bottom Portion */}
                  <div className="p-5 pt-4 space-y-4">
                    {/* Usage quota bar */}
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5">
                        <span>Used Count</span>
                        <span>
                          {c.usedCount.toLocaleString()} {c.maxUses === null ? 'Redemptions' : `/ ${c.maxUses.toLocaleString()}`}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-850 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-indigo-400 dark:to-indigo-500"
                          style={{
                            width: c.maxUses
                              ? `${Math.min(100, (c.usedCount / c.maxUses) * 100)}%`
                              : '35%', // flat default indicator for unlimited
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 text-xs pt-1.5 text-gray-400 font-medium">
                      <span className="flex items-center gap-1">
                        <LucideIcon name="bookmark" size={13} className="text-gray-300" />
                        Ends: <span className="font-bold text-gray-700 dark:text-gray-300">{c.expiryDate}</span>
                      </span>

                      {/* Quick activate Switcher */}
                      {!isExpired && (
                        <button
                          onClick={() => toggleStatus(c)}
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider cursor-pointer border transition ${
                            isActive
                              ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50 hover:bg-emerald-100'
                              : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {isActive ? 'Pause' : 'Activate'}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Internal Modal Dialog Sheet Overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <div
            onClick={handleCloseModal}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.35 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#15171c] rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl border border-gray-100 dark:border-gray-800"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white/95 dark:bg-[#15171c]/95 backdrop-blur-xs z-10">
                <h3 className="font-extrabold text-gray-900 dark:text-white">
                  {editingCoupon ? 'Edit Coupon Code' : 'Generate Discount Coupon'}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 flex items-center justify-center transition"
                >
                  <LucideIcon name="x" size={16} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Promo Code</label>
                  <input
                    type="text"
                    required
                    maxLength={16}
                    placeholder="e.g. SUMMER50"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\s+/g, ''))}
                    className="mt-1.5 w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm font-bold text-gray-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white/40 uppercase"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">Shorthand voucher code shoppers can apply during check out ledger.</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Type</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as CouponType)}
                      className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#15171c] text-sm font-semibold text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white/40 cursor-pointer"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount ($)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                      {type === 'percentage' ? 'Discount Percentage' : 'Discount Dollar ($)'}
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      max={type === 'percentage' ? 100 : 9999}
                      placeholder={type === 'percentage' ? '25' : '15'}
                      value={value}
                      onChange={(e) => setValue(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                      className="mt-1.5 w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Min. Purchase ($)</label>
                    <input
                      type="number"
                      min={0}
                      placeholder="0"
                      value={minPurchase}
                      onChange={(e) => setMinPurchase(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                      className="mt-1.5 w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-900 dark:text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Max Redemptions</label>
                    <input
                      type="number"
                      min={1}
                      placeholder="Unlimited (Leave blank)"
                      value={maxUses}
                      onChange={(e) => setMaxUses(e.target.value === '' ? '' : Math.max(1, parseInt(e.target.value)))}
                      className="mt-1.5 w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Expiry Date</label>
                    <input
                      type="date"
                      required
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="mt-1.5 w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#15171c] text-sm text-gray-900 dark:text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Intended Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#15171c] text-sm font-semibold text-gray-700 dark:text-gray-200 focus:outline-none cursor-pointer"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Expired">Expired</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-gray-50 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-3 rounded-full text-sm font-semibold border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 rounded-full text-sm font-semibold bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90 active:scale-95 transition cursor-pointer text-center shadow-md animate-pulse"
                  >
                    {editingCoupon ? 'Save Voucher' : 'Issue Voucher'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
