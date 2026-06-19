import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { PRODUCT_CATEGORIES, ICON_OPTIONS, CATEGORY_ICON_DEFAULT } from '../../data';
import { LucideIcon } from '../LucideIcon';
import { motion } from 'motion/react';

interface ProductModalProps {
  mode: 'add' | 'edit';
  editingProduct?: Product;
  onClose: () => void;
  onSave: (data: Omit<Product, 'id'> & { id?: number }) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  mode,
  editingProduct,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState(PRODUCT_CATEGORIES[0]);
  const [icon, setIcon] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [stock, setStock] = useState<number | ''>('');
  const [sold, setSold] = useState<number | ''>('');

  // Hydrate form on edit mode
  useEffect(() => {
    if (mode === 'edit' && editingProduct) {
      setName(editingProduct.name);
      setCategory(editingProduct.category);
      setIcon(editingProduct.icon);
      setPrice(editingProduct.price);
      setStock(editingProduct.stock);
      setSold(editingProduct.sold);
    } else {
      setName('');
      setCategory(PRODUCT_CATEGORIES[0]);
      setIcon(CATEGORY_ICON_DEFAULT[PRODUCT_CATEGORIES[0]]);
      setPrice('');
      setStock('');
      setSold(0);
    }
  }, [mode, editingProduct]);

  // Sync default icon on category change
  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    const defIcon = CATEGORY_ICON_DEFAULT[cat];
    if (defIcon) {
      setIcon(defIcon);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      id: editingProduct?.id,
      name: name.trim(),
      category,
      icon,
      price: Number(price) || 0,
      stock: Number(stock) || 0,
      sold: Number(sold) || 0,
    });
  };

  return (
    <div
      onClick={onClose}
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
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white/95 dark:bg-[#15171c]/95 backdrop-blur-sm z-10">
          <h3 className="font-extrabold text-gray-900 dark:text-white">
            {mode === 'edit' ? 'Edit Product' : 'Add New Product'}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 flex items-center justify-center transition border border-transparent hover:border-gray-100 dark:hover:border-gray-800"
          >
            <LucideIcon name="x" size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Product name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Oakwood Dinner Table"
              className="mt-1.5 w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white/40"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Category</label>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#15171c] text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white/40 cursor-pointer"
              >
                {PRODUCT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Icon Avatar</label>
              <select
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#15171c] text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white/40 cursor-pointer"
              >
                {ICON_OPTIONS.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
                placeholder="0.00"
                className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white/40"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Stock</label>
              <input
                type="number"
                min="0"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value === '' ? '' : parseInt(e.target.value))}
                placeholder="25"
                className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white/40"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Sold</label>
              <input
                type="number"
                min="0"
                required
                value={sold}
                onChange={(e) => setSold(e.target.value === '' ? '' : parseInt(e.target.value))}
                placeholder="0"
                className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white/40"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-gray-50 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-full text-sm font-semibold border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 rounded-full text-sm font-semibold bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90 active:scale-95 transition cursor-pointer text-center shadow-md"
            >
              {mode === 'edit' ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
