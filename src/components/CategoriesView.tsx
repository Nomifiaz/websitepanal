import React, { useState, useEffect } from "react";
import { Category } from "../types";
import { LucideIcon } from "./LucideIcon";
import { motion, AnimatePresence } from "motion/react";

interface CategoriesViewProps {
  onNotify: (message: string) => void;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({ onNotify }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");

  // Modal actions
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form inputs
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrlPreview, setImageUrlPreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load categories from actual API
  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/categories");
      const json = await res.json();
      if (json.success) {
        setCategories(json.data);
      } else {
        setError(json.message || "Failed to fetch categories.");
      }
    } catch (err: any) {
      setError(err.message || "Network error fetching categories.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setName("");
    setImageFile(null);
    setImageUrlPreview("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setImageFile(null);
    setImageUrlPreview(cat.imageUrl || "");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImageUrlPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("name", name.trim());
    if (imageFile) {
      formData.append("imageUrl", imageFile);
    }

    try {
      let url = "/api/categories";
      let method = "POST";

      if (editingCategory) {
        url = `/api/categories/${editingCategory.id}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        body: formData,
      });

      const json = await res.json();

      if (json.success) {
        onNotify(
          editingCategory
            ? `Category "${name}" updated successfully!`
            : `Category "${name}" created successfully!`
        );
        fetchCategories();
        handleCloseModal();
      } else {
        onNotify(json.message || "Error submitting category form.");
      }
    } catch (err: any) {
      onNotify(err.message || "Network error submitting form.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number, catName: string) => {
    if (!window.confirm(`Are you sure you want to delete the category "${catName}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();

      if (json.success) {
        onNotify(`Category "${catName}" deleted successfully!`);
        fetchCategories();
      } else {
        onNotify(json.message || "Error executing delete action.");
      }
    } catch (err: any) {
      onNotify(err.message || "Network error deleting category.");
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <div className="space-y-6">
      {/* Header element */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Categories & Departments
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
            Organize inventory products, set illustrative thumbnails, and structure navigation groups.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="self-start sm:self-auto flex items-center gap-2 bg-gray-950 dark:bg-white text-white dark:text-gray-950 text-sm font-bold px-6 py-3 rounded-full hover:opacity-90 active:scale-95 transition shadow-sm cursor-pointer whitespace-nowrap"
          id="btn-add-category"
        >
          <LucideIcon name="plus" size={16} />
          Add Category
        </button>
      </div>

      {/* Advanced filters */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-[#15171c] p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xs">
        <div className="relative w-full sm:flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
            <LucideIcon name="search" size={16} />
          </span>
          <input
            type="text"
            placeholder="Search departments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-white/5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-950 dark:focus:ring-white/40"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white"
            >
              <LucideIcon name="x" size={14} />
            </button>
          )}
        </div>
        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2 whitespace-nowrap">
          {filteredCategories.length} Departments Active
        </div>
      </div>

      {/* Main categories listing view */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-[#15171c] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xs">
          <div className="w-10 h-10 border-4 border-gray-900/10 border-t-gray-950 dark:border-white/10 dark:border-t-white rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-gray-500 mt-4">Retrieving active categories...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-rose-50 dark:bg-rose-500/5 rounded-2xl border border-rose-100 dark:border-rose-950 text-rose-600 dark:text-rose-400">
          <LucideIcon name="alerttriangle" size={32} className="mx-auto mb-2 text-rose-500" />
          <p className="font-bold text-lg">Failed to sync with API</p>
          <p className="text-xs mt-1">{error}</p>
          <button
            onClick={fetchCategories}
            className="mt-4 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-full cursor-pointer"
          >
            Retry Connection
          </button>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#15171c] rounded-2xl border border-gray-100 dark:border-gray-800 p-8 text-center shadow-xs">
          <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center mb-4 text-gray-400">
            <LucideIcon name="package" size={28} />
          </div>
          <p className="font-bold text-gray-900 dark:text-white text-lg">No departments found</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
            Try adjusting your spelling or create a brand new category to begin organizing items.
          </p>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredCategories.map((cat) => (
            <motion.div
              layout
              key={cat.id}
              className="bg-white dark:bg-[#15171c] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-xs hover:shadow-md hover:border-gray-200 dark:hover:border-gray-750 transition-all duration-300 group flex flex-col justify-between"
              id={`category-card-${cat.id}`}
            >
              {/* Header thumbnail */}
              <div className="relative h-44 bg-gray-100 dark:bg-gray-900 overflow-hidden shrink-0">
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent flex items-end p-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#cfd3dc] leading-tight">
                      DEPARTMENT ID: #{cat.id}
                    </span>
                    <h3 className="text-lg font-black text-white leading-tight mt-0.5 select-all">
                      {cat.name}
                    </h3>
                  </div>
                </div>

                {/* Top action floats */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="w-8 h-8 rounded-full bg-white/90 dark:bg-gray-900/90 text-gray-700 dark:text-gray-350 hover:text-gray-950 dark:hover:text-white shadow-xs flex items-center justify-center transition cursor-pointer"
                    title="Edit name or thumbnail"
                    id={`btn-edit-cat-${cat.id}`}
                  >
                    <LucideIcon name="pencil" size={12} />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="w-8 h-8 rounded-full bg-white/90 dark:bg-gray-900/90 text-gray-500 hover:text-rose-600 shadow-xs flex items-center justify-center transition cursor-pointer"
                    title="Soft Delete department"
                    id={`btn-delete-cat-${cat.id}`}
                  >
                    <LucideIcon name="trash" size={12} />
                  </button>
                </div>
              </div>

              {/* Card Footer details */}
              <div className="p-4 bg-gray-50/50 dark:bg-white/[0.01] border-t border-gray-100 dark:border-gray-800/60 flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <LucideIcon name="calendar" size={12} className="text-gray-300" />
                  Synced: {cat.createdAt ? new Date(cat.createdAt).toLocaleDateString() : "Just Now"}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/5 text-[10px] font-bold text-gray-500">
                  API Source
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Edit/Add category modal dialog */}
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
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#15171c] rounded-2xl w-full max-w-md overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800"
              id="modal-category"
            >
              {/* Header modal */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-[#15171c]/95 backdrop-blur-xs sticky top-0 z-10">
                <h3 className="font-extrabold text-gray-950 dark:text-white">
                  {editingCategory ? "Edit Department Group" : "Create New Department"}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 flex items-center justify-center transition cursor-pointer"
                >
                  <LucideIcon name="x" size={16} />
                </button>
              </div>

              {/* Form panel */}
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                    Department Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Smart Electronics"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1.5 w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-950 dark:focus:ring-white/40"
                    id="input-cat-name"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                    Header Thumbnail
                  </label>
                  <div className="mt-1.5 p-4 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-white/[0.01] flex flex-col items-center justify-center text-center">
                    {imageUrlPreview ? (
                      <div className="relative w-full h-32 rounded-xl overflow-hidden mb-3">
                        <img
                          src={imageUrlPreview}
                          alt="Thumbnail preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null);
                            setImageUrlPreview("");
                          }}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition cursor-pointer"
                        >
                          <LucideIcon name="x" size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="py-2 flex flex-col items-center">
                        <LucideIcon name="upload" size={24} className="text-gray-400 mb-2" />
                        <p className="text-xs text-gray-500 font-medium">
                          PNG, JPG or JPEG image format supported
                        </p>
                      </div>
                    )}
                    <label className="px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#15171c] hover:bg-gray-50 dark:hover:bg-white/5 text-xs text-gray-700 dark:text-gray-200 font-bold transition cursor-pointer">
                      Browse File
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Actions bottom */}
                <div className="flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-3 rounded-full text-sm font-semibold border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 rounded-full text-sm font-semibold bg-gray-950 dark:bg-white text-white dark:text-gray-950 hover:opacity-90 active:scale-95 transition cursor-pointer text-center shadow-md disabled:opacity-50"
                  >
                    {isSubmitting
                      ? "Uploading..."
                      : editingCategory
                      ? "Save Department"
                      : "Create Department"}
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
