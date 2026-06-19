import React from 'react';
import { Product } from '../types';
import { CATEGORY_TABS, CATEGORY_STYLES } from '../data';
import { LucideIcon } from './LucideIcon';
import { motion, AnimatePresence } from 'motion/react';

interface ProductsViewProps {
  products: Product[];
  productCategory: string;
  productSearch: string;
  onSetProductCategory: (cat: string) => void;
  onSetProductSearch: (search: string) => void;
  onOpenAddProduct: () => void;
  onOpenEditProduct: (id: number) => void;
  onViewProductDetail: (id: number) => void;
  onDeleteProduct: (id: number) => void;
}

export const ProductsView: React.FC<ProductsViewProps> = ({
  products,
  productCategory,
  productSearch,
  onSetProductCategory,
  onSetProductSearch,
  onOpenAddProduct,
  onOpenEditProduct,
  onViewProductDetail,
  onDeleteProduct,
}) => {
  // Filter core logic
  const getFilteredList = () => {
    let list = products.slice();
    if (productSearch.trim()) {
      const q = productSearch.trim().toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }
    if (productCategory === 'Most Purchased') {
      list = list.sort((a, b) => b.sold - a.sold).slice(0, 8);
    } else if (productCategory !== 'All Products') {
      list = list.filter((p) => p.category === productCategory);
    }
    return list;
  };

  const filteredList = getFilteredList();

  const formatMoney = (n: number) => {
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.03 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 25 } }
  };

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Products</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Manage and organize items in your boutique.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <span className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <LucideIcon name="search" size={16} />
            </span>
            <input
              type="text"
              placeholder="Search product..."
              value={productSearch}
              onChange={(e) => onSetProductSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#15171c] text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white/40 shadow-sm"
            />
            {productSearch && (
              <button
                onClick={() => onSetProductSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                <LucideIcon name="x" size={14} />
              </button>
            )}
          </div>
          <button
            onClick={onOpenAddProduct}
            className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold px-4 py-2.5 rounded-full hover:opacity-90 transition whitespace-nowrap shadow-sm active:scale-95"
          >
            <LucideIcon name="plus" size={16} />
            <span className="hidden sm:inline">Add New Product</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* Categories Filter tab */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {CATEGORY_TABS.map((c) => {
          const isActive = productCategory === c;
          return (
            <button
              key={c}
              onClick={() => onSetProductCategory(c)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm'
                  : 'bg-white dark:bg-[#15171c] text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-800 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-700'
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>

      {/* Grid listing */}
      <AnimatePresence mode="popLayout">
        {filteredList.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center justify-center text-center py-20 bg-white dark:bg-[#15171c] rounded-2xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm"
          >
            <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center mb-4 text-gray-400">
              <LucideIcon name="packagesearch" size={28} />
            </div>
            <p className="font-bold text-gray-900 dark:text-white text-lg">No products found</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 max-w-sm">
              We couldn't find matches for "{productSearch}" in {productCategory}. Try another category or clear your search term.
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          >
            {filteredList.map((p) => {
              const style = CATEGORY_STYLES[p.category] || { bg: 'bg-gray-50', ic: 'text-gray-600' };
              return (
                <motion.div
                  layout
                  variants={itemVariants}
                  key={p.id}
                  className="group relative bg-white dark:bg-[#15171c] rounded-2xl p-4 border border-gray-100 dark:border-gray-800 hover:shadow-lg dark:hover:shadow-none transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Visual container */}
                    <div className={`relative h-36 rounded-xl ${style.bg} flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-[1.02]`}>
                      <LucideIcon name={p.icon} className={`w-12 h-12 ${style.ic}`} />
                      
                      {/* Floating actions */}
                      <div className="absolute top-2 right-2 flex items-center gap-1 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={() => onViewProductDetail(p.id)}
                          title="Quick view"
                          className="w-8 h-8 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur flex items-center justify-center hover:bg-white dark:hover:bg-black text-gray-700 dark:text-gray-200 shadow-sm transition-transform active:scale-90"
                        >
                          <LucideIcon name="arrowupright" size={14} />
                        </button>
                        <button
                          onClick={() => onOpenEditProduct(p.id)}
                          title="Edit"
                          className="w-8 h-8 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur flex items-center justify-center hover:bg-white dark:hover:bg-black text-gray-700 dark:text-gray-200 shadow-sm transition-transform active:scale-90"
                        >
                          <LucideIcon name="pencil" size={14} />
                        </button>
                        <button
                          onClick={() => onDeleteProduct(p.id)}
                          title="Delete"
                          className="w-8 h-8 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur flex items-center justify-center hover:bg-rose-500 hover:text-white text-gray-700 dark:text-gray-200 shadow-sm transition-all active:scale-90"
                        >
                          <LucideIcon name="trash" size={14} />
                        </button>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${style.bg} ${style.ic}`}>
                      {p.category}
                    </span>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white mt-1.5 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-sm font-extrabold text-gray-900 dark:text-white mt-0.5">{formatMoney(p.price)}</p>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-50 dark:border-gray-800/65 mt-3 pt-2.5 text-xs text-gray-500 dark:text-gray-400">
                    <span>Stock: <span className="font-bold text-gray-800 dark:text-gray-200">{p.stock.toLocaleString()}</span></span>
                    <span>Sold: <span className="font-bold text-gray-800 dark:text-gray-200">{p.sold.toLocaleString()}</span></span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
