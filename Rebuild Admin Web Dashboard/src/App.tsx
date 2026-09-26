import { useState, useEffect } from 'react';
import type { Page, Order, OrderStatus } from './types';
import { initialOrders, initialMenuItems, initialCustomers, initialReviews } from './data';
import type { MenuItem, Review } from './types';

import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Menu from './pages/Menu';
import Analytics from './pages/Analytics';
import Customers from './pages/Customers';
import Reviews from './pages/Reviews';
import Settings from './pages/Settings';
import OrderDetail from './pages/OrderDetail';

const NAV_ITEMS: { page: Page; label: string; icon: string }[] = [
  { page: 'dashboard', label: 'Dashboard', icon: '▣' },
  { page: 'orders', label: 'Orders', icon: '🛍' },
  { page: 'menu', label: 'Menu', icon: '🍵' },
  { page: 'analytics', label: 'Sales & Analytics', icon: '📊' },
  { page: 'customers', label: 'Customers', icon: '👥' },
  { page: 'reviews', label: 'Reviews', icon: '⭐' },
  { page: 'settings', label: 'Settings', icon: '⚙' },
];

const PAGE_TITLES: Record<Page, string> = {
  dashboard: 'Dashboard',
  orders: 'Orders',
  menu: 'Menu',
  analytics: 'Analytics',
  customers: 'Customers',
  reviews: 'Reviews',
  settings: 'Settings',
};

export default function App() {
  const [page, setPage] = useState<Page>('dashboard');
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showNewOrderAlert, setShowNewOrderAlert] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const newOrders = orders.filter(o => o.status === 'NEW');

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#FAF6F0', fontFamily: 'var(--font-body)' }}>
      {/* Sidebar */}
      <aside
        className="flex flex-col flex-shrink-0 transition-all duration-200"
        style={{
          width: sidebarOpen ? 220 : 0,
          background: '#1C1A17',
          overflow: 'hidden',
          borderRight: '1px solid #2E2A24',
        }}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b" style={{ borderColor: '#2E2A24' }}>
          <div className="flex items-center gap-2.5">
            <span className="text-xl">☕</span>
            <div>
              <p className="text-sm font-bold leading-tight" style={{ color: '#FAF6F0', fontFamily: 'var(--font-display)' }}>OLD SCHOOL TEA</p>
              <p className="text-xs" style={{ color: '#8B5E3C' }}>KOVAI · ADMIN</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 sidebar-scroll overflow-y-auto">
          <div className="space-y-0.5 px-2">
            {NAV_ITEMS.map(item => (
              <button
                key={item.page}
                onClick={() => setPage(item.page)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all text-sm"
                style={{
                  background: page === item.page ? '#3D342A' : 'transparent',
                  color: page === item.page ? '#FAF6F0' : '#9A8F82',
                  fontWeight: page === item.page ? 600 : 400,
                }}
              >
                <span className="text-base w-5 text-center flex-shrink-0">{item.icon}</span>
                <span className="truncate">{item.label}</span>
                {item.page === 'orders' && newOrders.length > 0 && (
                  <span className="ml-auto text-xs font-bold px-1.5 py-0.5 rounded-full" style={{ background: '#DC2626', color: '#FFFFFF' }}>
                    {newOrders.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Bottom */}
        <div className="px-4 py-4 border-t" style={{ borderColor: '#2E2A24' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: '#8B5E3C', color: '#FAF6F0' }}>A</div>
            <div>
              <p className="text-xs font-semibold" style={{ color: '#FAF6F0' }}>Admin</p>
              <p className="text-xs" style={{ color: '#9A8F82' }}>admin@oldschooltea.in</p>
            </div>
          </div>
          <button className="w-full text-left text-xs font-semibold px-3 py-2 rounded-lg transition-colors" style={{ color: '#DC2626' }}>
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="flex-shrink-0 flex items-center justify-between px-5 py-3 border-b" style={{ background: '#FFFFFF', borderColor: '#E8DDD0', minHeight: 56 }}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-amber-50"
              style={{ color: '#9A8F82' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-base font-semibold" style={{ color: '#2C2A26' }}>
                Good evening, Admin 👋
              </h1>
              <p className="text-xs" style={{ color: '#9A8F82' }}>25 September 2026 · {PAGE_TITLES[page]}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* New Order Alert */}
            {showNewOrderAlert && newOrders.length > 0 && (
              <button
                onClick={() => { setPage('orders'); setShowNewOrderAlert(false); }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold animate-pulse"
                style={{ background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A' }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                NEW ORDER {newOrders[0].id}
              </button>
            )}

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative w-9 h-9 flex items-center justify-center rounded-lg border transition-all hover:bg-amber-50"
                style={{ borderColor: '#E8DDD0' }}
              >
                <svg className="w-5 h-5" style={{ color: '#9A8F82' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {newOrders.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: '#DC2626', color: '#FFFFFF', fontSize: 9 }}>
                    {newOrders.length}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 top-11 w-72 rounded-xl shadow-xl border z-40" style={{ background: '#FFFFFF', borderColor: '#E8DDD0' }}>
                  <div className="px-4 py-3 border-b" style={{ borderColor: '#E8DDD0' }}>
                    <p className="text-xs font-bold tracking-widest" style={{ color: '#2C2A26' }}>NOTIFICATIONS</p>
                  </div>
                  {newOrders.length === 0 ? (
                    <p className="text-sm text-center py-6" style={{ color: '#9A8F82' }}>No new notifications</p>
                  ) : (
                    newOrders.map(o => (
                      <button
                        key={o.id}
                        onClick={() => { handleViewOrder(o); setShowNotifications(false); }}
                        className="w-full text-left px-4 py-3 hover:bg-amber-50 transition-colors border-b last:border-0"
                        style={{ borderColor: '#F0E8DC' }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
                          <p className="text-sm font-semibold" style={{ color: '#2C2A26' }}>New Order {o.id}</p>
                        </div>
                        <p className="text-xs mt-0.5 ml-4" style={{ color: '#9A8F82' }}>
                          {o.customer} · {o.time} · ₹{o.total}
                        </p>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Admin Avatar */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer hover:bg-amber-50 transition-colors" style={{ borderColor: '#E8DDD0' }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: '#8B5E3C', color: '#FAF6F0' }}>A</div>
              <span className="text-sm font-medium" style={{ color: '#2C2A26' }}>Admin</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto" onClick={() => showNotifications && setShowNotifications(false)}>
          {page === 'dashboard' && <Dashboard orders={orders} onViewOrder={handleViewOrder} />}
          {page === 'orders' && <Orders orders={orders} onViewOrder={handleViewOrder} />}
          {page === 'menu' && <Menu items={menuItems} onUpdate={setMenuItems} />}
          {page === 'analytics' && <Analytics />}
          {page === 'customers' && <Customers customers={initialCustomers} orders={orders} />}
          {page === 'reviews' && <Reviews reviews={reviews} onUpdate={setReviews} />}
          {page === 'settings' && <Settings />}
        </main>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetail
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={(id, status) => {
            updateOrderStatus(id, status);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
}
