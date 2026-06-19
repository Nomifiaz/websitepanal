import React from 'react';
import { LucideIcon } from '../LucideIcon';
import { motion } from 'motion/react';

interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  message,
  onConfirm,
  onClose,
}) => {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-[#15171c] rounded-2xl w-full max-w-sm p-6 shadow-xl border border-gray-100 dark:border-gray-800"
      >
        <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-500 mb-4 shadow-xs">
          <LucideIcon name="alerttriangle" size={24} />
        </div>
        <h3 className="font-extrabold text-[#15171c] dark:text-white text-lg">Are you sure?</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
          {message}
        </p>
        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-full text-sm font-semibold border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer text-center"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 rounded-full text-sm font-semibold bg-rose-600 hover:bg-rose-700 text-white active:scale-95 transition cursor-pointer text-center shadow-md shadow-rose-600/15"
          >
            Yes, Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
};
