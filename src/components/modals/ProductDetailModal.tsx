import React from 'react';
import { Product } from '../../types';
import { CATEGORY_STYLES } from '../../data';
import { LucideIcon } from '../LucideIcon';
import { motion } from 'motion/react';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onEdit,
  onDelete,
}) => {
  const style = CATEGORY_STYLES[product.category] || { bg: 'bg-gray-50', ic: 'text-gray-600', text: 'text-gray-700' };

  const formatMoney = (n: number) => {
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-[#15171c] rounded-2xl w-full max-w-sm overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800"
      >
        {/* Banner with Icon */}
        <div className={`h-40 ${style.bg} flex items-center justify-center relative`}>
          <LucideIcon name={product.icon} className={`w-16 h-16 ${style.ic}`} />
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/95 dark:bg-black/75 backdrop-blur-xs flex items-center justify-center absolute top-3 right-3 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition shadow-sm border border-transparent hover:border-gray-100 dark:hover:border-gray-800"
          >
            <LucideIcon name="x" size={14} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <div className="flex items-center justify-between gap-2.5">
              <h3 className="font-extrabold text-lg text-gray-950 dark:text-white truncate">{product.name}</h3>
            </div>
            <span className={`inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${style.bg} ${style.ic}`}>
              {product.category}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-sm">
            <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-3 border border-gray-100/50 dark:border-gray-800/10">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Unit Price</p>
              <p className="font-black text-gray-900 dark:text-white text-base mt-0.5">{formatMoney(product.price)}</p>
            </div>
            <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-3 border border-gray-100/50 dark:border-gray-800/10">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Alt Revenue</p>
              <p className="font-black text-gray-900 dark:text-white text-base mt-0.5">{formatMoney(product.price * product.sold)}</p>
            </div>
            <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-3 border border-gray-100/50 dark:border-gray-800/10">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">In Stock</p>
              <p className="font-black text-gray-900 dark:text-white text-base mt-0.5">{product.stock.toLocaleString()}</p>
            </div>
            <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-3 border border-gray-100/50 dark:border-gray-800/10">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Sold Count</p>
              <p className="font-black text-gray-900 dark:text-white text-base mt-0.5">{product.sold.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-3 border-t border-gray-50 dark:border-gray-800/60">
            <button
              onClick={() => onEdit(product.id)}
              className="flex-1 px-4 py-2.5 rounded-full text-xs font-semibold border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 active:scale-95 transition cursor-pointer text-center"
            >
              Edit Details
            </button>
            <button
              onClick={() => onDelete(product.id)}
              className="flex-1 px-4 py-2.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 hover:bg-rose-100/80 active:scale-95 transition cursor-pointer text-center"
            >
              Delete Item
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
