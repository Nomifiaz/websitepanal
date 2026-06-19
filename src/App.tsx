import { useState, useEffect } from 'react';
import { Product, Order, Customer, UserSettings, UserProfile, OrderStatus, Coupon, User } from './types';
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_CUSTOMERS,
  INITIAL_SETTINGS,
  INITIAL_COUPONS,
} from './data';
import { LucideIcon } from './components/LucideIcon';
import { DashboardView } from './components/DashboardView';
import { ProductsView } from './components/ProductsView';
import { PurchasesView } from './components/PurchasesView';
import { CustomersView } from './components/CustomersView';
import { AnalyticsView } from './components/AnalyticsView';
import { SettingsView } from './components/SettingsView';
import { CouponsView } from './components/CouponsView';
import { CategoriesView } from './components/CategoriesView';
import { AuthScreen } from './components/AuthScreen';

// Modals
import { ProductModal } from './components/modals/ProductModal';
import { ProductDetailModal } from './components/modals/ProductDetailModal';
import { ConfirmModal } from './components/modals/ConfirmModal';

import { AnimatePresence, motion } from 'motion/react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function App() {
  // Navigation State
  const [page, setPage] = useState<string>(() => {
    return localStorage.getItem('ecomora_page') || 'dashboard';
  });

  // Main Datasets State (Hydrated from LocalStorage if available)
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('ecomora_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('ecomora_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('ecomora_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('ecomora_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('ecomora_coupons');
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('ecomora_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [authToken, setAuthToken] = useState<string | null>(() => {
    return localStorage.getItem('ecomora_token');
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ecomora_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('ecomora_user');
    }
  }, [currentUser]);

  useEffect(() => {
    if (authToken) {
      localStorage.setItem('ecomora_token', authToken);
    } else {
      localStorage.removeItem('ecomora_token');
    }
  }, [authToken]);

  // Filtering states (In memory)
  const [productCategory, setProductCategory] = useState('All Products');
  const [productSearch, setProductSearch] = useState('');
  const [orderStatus, setOrderStatus] = useState('All');
  const [orderSearch, setOrderSearch] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');

  // Modals Overlay states
  const [activeModal, setActiveModal] = useState<'add' | 'edit' | null>(null);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [viewProductDetailId, setViewProductDetailId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  // Toast notifications state
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Keep navigation in LocalStorage
  useEffect(() => {
    localStorage.setItem('ecomora_page', page);
  }, [page]);

  // Keep Datasets in sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('ecomora_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('ecomora_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('ecomora_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('ecomora_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('ecomora_settings', JSON.stringify(settings));
    // Set theme class on body
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  // Action: Add/Delete Toast
  const triggerToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // Action: Save Product (Create or Edit)
  const handleSaveProduct = (data: Omit<Product, 'id'> & { id?: number }) => {
    if (activeModal === 'edit' && data.id) {
      // Edit mode
      setProducts((prev) =>
        prev.map((p) => (p.id === data.id ? { ...p, ...data } : p))
      );
      triggerToast('Product details updated successfully');
    } else {
      // Create mode
      const newId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
      setProducts((prev) => [
        {
          id: newId,
          name: data.name,
          category: data.category,
          price: data.price,
          stock: data.stock,
          sold: data.sold,
          icon: data.icon,
        },
        ...prev,
      ]);
      triggerToast('New product added to store listing');
    }
    setActiveModal(null);
    setEditingProductId(null);
  };

  const handleConfirmDelete = () => {
    if (confirmDeleteId !== null) {
      const targetProduct = products.find((p) => p.id === confirmDeleteId);
      setProducts((prev) => prev.filter((p) => p.id !== confirmDeleteId));
      triggerToast(`"${targetProduct?.name || 'Product'}" was deleted from store`);
      setConfirmDeleteId(null);
      // Close detail popup if open on same item
      if (viewProductDetailId === confirmDeleteId) {
        setViewProductDetailId(null);
      }
    }
  };

  // Action: Update Order Status
  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    triggerToast(`Order ${orderId} marked as ${status}`);
  };

  // Action: Save Profile metadata
  const handleSaveProfile = (profile: UserProfile) => {
    setSettings((prev) => ({ ...prev, profile }));
    triggerToast('Store owner profile settings updated');
  };

  // Action: Coupon Actions
  const handleAddCoupon = (data: Omit<Coupon, 'id'>) => {
    const nextNum = coupons.length > 0
      ? Math.max(...coupons.map((c) => {
          const matched = c.id.match(/\d+/);
          return matched ? parseInt(matched[0], 10) : 100;
        })) + 1
      : 101;
    const newId = `CPN-${nextNum}`;
    const newC: Coupon = {
      id: newId,
      ...data,
    };
    setCoupons((prev) => [newC, ...prev]);
    triggerToast(`Promo "${data.code}" successfully generated!`);
  };

  const handleUpdateCoupon = (updated: Coupon) => {
    setCoupons((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    triggerToast(`Voucher "${updated.code}" updated successfully`);
  };

  const handleDeleteCoupon = (id: string) => {
    const target = coupons.find((c) => c.id === id);
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    if (target) {
      triggerToast(`Coupon code "${target.code}" was permanently deleted`);
    }
  };

  // Action: Save Preferences settings
  const handleSavePreferences = (partialSettings: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...partialSettings }));
    if (partialSettings.darkMode !== undefined) {
      triggerToast(`Dark mode ${partialSettings.darkMode ? 'activated' : 'deactivated'}`);
    } else {
      triggerToast('Dashboard visual preferences saved successfully');
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((p) => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const renderActiveView = () => {
    switch (page) {
      case 'dashboard':
        return (
          <DashboardView
            products={products}
            orders={orders}
            customers={customers}
            onNavigate={(p) => setPage(p)}
            onOpenAddProduct={() => setActiveModal('add')}
            rawName={settings.profile.name}
          />
        );
      case 'products':
        return (
          <ProductsView
            products={products}
            productCategory={productCategory}
            productSearch={productSearch}
            onSetProductCategory={setProductCategory}
            onSetProductSearch={productSearchVal => setProductSearch(productSearchVal)}
            onOpenAddProduct={() => setActiveModal('add')}
            onOpenEditProduct={(id) => {
              setEditingProductId(id);
              setActiveModal('edit');
            }}
            onViewProductDetail={(id) => setViewProductDetailId(id)}
            onDeleteProduct={(id) => setConfirmDeleteId(id)}
          />
        );
      case 'purchases':
        return (
          <PurchasesView
            orders={orders}
            orderStatus={orderStatus}
            orderSearch={orderSearch}
            onSetOrderStatus={setOrderStatus}
            onSetOrderSearch={orderSearchVal => setOrderSearch(orderSearchVal)}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        );
      case 'customers':
        return (
          <CustomersView
            customers={customers}
            customerSearch={customerSearch}
            onSetCustomerSearch={customerSearchVal => setCustomerSearch(customerSearchVal)}
          />
        );
      case 'analytics':
        return <AnalyticsView products={products} orders={orders} />;
      case 'coupons':
        return (
          <CouponsView
            coupons={coupons}
            onAddCoupon={handleAddCoupon}
            onUpdateCoupon={handleUpdateCoupon}
            onDeleteCoupon={handleDeleteCoupon}
          />
        );
      case 'categories':
        return (
          <CategoriesView onNotify={(msg) => triggerToast(msg)} />
        );
      case 'settings':
        return (
          <SettingsView
            settings={settings}
            onSaveProfile={handleSaveProfile}
            onSavePreferences={handleSavePreferences}
            productsCount={products.length}
            ordersCount={orders.length}
            customersCount={customers.length}
            couponsCount={coupons.length}
          />
        );
      default:
        return null;
    }
  };

  const navItems = [
    { key: 'dashboard', label: 'Dashboard', icon: 'layoutdashboard' },
    { key: 'products', label: 'Products', icon: 'package' },
    { key: 'purchases', label: 'Purchases', icon: 'shoppingcart' },
    { key: 'customers', label: 'Customers', icon: 'users' },
    { key: 'categories', label: 'Categories', icon: 'tag' },
    { key: 'coupons', label: 'Coupons', icon: 'ticket' },
    { key: 'analytics', label: 'Analytics', icon: 'piechart' },
    { key: 'settings', label: 'Settings', icon: 'settings' },
  ];

  if (!currentUser || !authToken) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] dark:bg-[#0B0C0F] relative">
        <AuthScreen
          onAuthSuccess={(user, token) => {
            setCurrentUser(user);
            setAuthToken(token);
            triggerToast(`Access approved. Welcome back, ${user.name}!`);
          }}
        />
        {/* Floating toast alerts for authentication actions */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
          <AnimatePresence>
            {toasts.map((t) => (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                className="bg-gray-950 dark:bg-white text-white dark:text-gray-955 border border-gray-100/10 dark:border-gray-800/10 px-5 py-3.5 rounded-full text-xs font-black tracking-wide shadow-xl flex items-center gap-2.5"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                {t.message}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F1F2F5] dark:bg-[#0B0C0F] text-[#15171c] dark:text-gray-100 min-h-screen font-sans flex flex-col transition-colors duration-300">
      
      {/* Header element */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#101116]/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 shrink-0 select-none">
            <svg width="30" height="30" viewBox="0 0 32 32" fill="none" className="cursor-pointer" onClick={() => setPage('dashboard')}>
              <circle cx="16" cy="16" r="16" fill="#111317" className="dark:fill-white" />
              <path d="M9 16a7 7 0 1 1 7 7" stroke={settings.darkMode ? "#111317" : "white"} strokeWidth="2.2" strokeLinecap="round" />
              <circle cx="16" cy="9" r="2" fill={settings.darkMode ? "#111317" : "white"} />
            </svg>
            <span className="font-extrabold text-xl tracking-tight text-gray-900 dark:text-white cursor-pointer" onClick={() => setPage('dashboard')}>
              Ecomora
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 overflow-x-auto no-scrollbar">
            {navItems.map((n) => {
              const active = page === n.key;
              return (
                <button
                  key={n.key}
                  onClick={() => setPage(n.key)}
                  className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    active
                      ? 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white shadow-xs'
                      : 'text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5'
                  }`}
                >
                  <LucideIcon name={n.icon} size={15} />
                  {n.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            {/* Quick Profile display Link */}
            <button
              onClick={() => setPage('settings')}
              className="flex items-center gap-2 pl-1 pr-3 py-1.5 rounded-full hover:bg-gray-50 dark:hover:bg-white/5 transition border border-transparent hover:border-gray-100 dark:hover:border-gray-800/80 cursor-pointer"
            >
              <span className="w-8 h-8 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center text-xs font-black shadow-xs">
                {getInitials(currentUser ? currentUser.name : settings.profile.name)}
              </span>
              <span className="text-sm font-bold hidden sm:inline text-gray-950 dark:text-white">
                {currentUser ? currentUser.name : settings.profile.name}
              </span>
              <LucideIcon name="chevrondown" size={13} className="text-gray-400 hidden sm:inline" />
            </button>

            {/* Quick Sign Out icon action */}
            <button
              onClick={() => {
                setCurrentUser(null);
                setAuthToken(null);
                triggerToast("Successfully signed out of terminal.");
              }}
              className="w-9 h-9 rounded-xl border border-gray-100 dark:border-gray-800/80 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center justify-center text-gray-500 hover:text-gray-950 dark:hover:text-white transition cursor-pointer"
              title="Sign Out"
            >
              <LucideIcon name="logout" size={14} />
            </button>
          </div>
        </div>

        {/* Mobile secondary navigation */}
        <nav className="md:hidden flex items-center gap-1 overflow-x-auto no-scrollbar px-4 pb-2.5">
          {navItems.map((n) => {
            const active = page === n.key;
            return (
              <button
                key={n.key}
                onClick={() => setPage(n.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  active
                    ? 'bg-gray-100 dark:bg-white/10 text-gray-950 dark:text-white'
                    : 'text-gray-400 dark:text-gray-500 hover:text-gray-950 dark:hover:text-white'
                }`}
              >
                <LucideIcon name={n.icon} size={13} />
                {n.label}
              </button>
            );
          })}
        </nav>
      </header>

      {/* Main app space */}
      <main className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="footer max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 text-center text-[11px] text-gray-400 dark:text-gray-600 border-t border-gray-150/40 dark:border-gray-900 mt-6 select-none leading-relaxed">
        Ecomora © 2026 Admin Dashboard. All rights reserved. Built with pride for elegant business management.
      </footer>

      {/* Modals & Portal Overlays */}
      <AnimatePresence>
        {activeModal && (
          <ProductModal
            mode={activeModal}
            editingProduct={activeModal === 'edit' && editingProductId ? products.find((p) => p.id === editingProductId) : undefined}
            onClose={() => {
              setActiveModal(null);
              setEditingProductId(null);
            }}
            onSave={handleSaveProduct}
          />
        )}

        {viewProductDetailId !== null && (
          <ProductDetailModal
            product={products.find((p) => p.id === viewProductDetailId)!}
            onClose={() => setViewProductDetailId(null)}
            onEdit={(id) => {
              setViewProductDetailId(null);
              setEditingProductId(id);
              setActiveModal('edit');
            }}
            onDelete={(id) => {
              setViewProductDetailId(null);
              setConfirmDeleteId(id);
            }}
          />
        )}

        {confirmDeleteId !== null && (
          <ConfirmModal
            message={`This action will permanently delete "${products.find((p) => p.id === confirmDeleteId)?.name}" from your listing and database indexes. This process is irreversible.`}
            onConfirm={handleConfirmDelete}
            onClose={() => setConfirmDeleteId(null)}
          />
        )}
      </AnimatePresence>

      {/* Interactive Floating Toast Container */}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 items-end pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 24, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 24, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border text-sm font-semibold pointer-events-auto bg-gray-950 text-white dark:bg-white dark:text-gray-900 border-gray-900 dark:border-white ${
                t.type === 'error' ? 'bg-rose-500! border-rose-500! text-white!' : ''
              }`}
            >
              <LucideIcon name={t.type === 'success' ? 'checkcircle2' : t.type === 'error' ? 'alertcircle' : 'info'} size={15} />
              <span>{t.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
