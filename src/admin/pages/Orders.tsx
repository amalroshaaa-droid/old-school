import { useState } from 'react';
import type { Order, OrderStatus } from '../types';
import { OrderBadge } from '../components/StatusBadge';

interface Props {
  orders: Order[];
  onViewOrder: (order: Order) => void;
  onClearHistory?: () => void;
  onSetHistoryNow?: () => void;
}

const FILTERS: { label: string; value: OrderStatus | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'New', value: 'NEW' },
  { label: 'Accepted', value: 'ACCEPTED' },
  { label: 'Preparing', value: 'PREPARING' },
  { label: 'Ready', value: 'READY' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

export default function Orders({ orders, onViewOrder, onClearHistory, onSetHistoryNow }: Props) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const todayStr = new Date().toISOString().split('T')[0];

  const filtered = orders.filter(o => {
    const matchFilter = filter === 'ALL' || o.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !q || o.customer.toLowerCase().includes(q) || o.id.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl" style={{ color: '#2C2A26' }}>Orders</h1>
          <p className="text-sm mt-1" style={{ color: '#9A8F82' }}>Manage customer orders in real-time</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {orders.length === 0 && onSetHistoryNow && (
            <button
              onClick={onSetHistoryNow}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg border transition-all hover:bg-amber-50 cursor-pointer flex items-center gap-1.5"
              style={{ borderColor: '#8B5E3C', color: '#8B5E3C', background: '#FFFFFF' }}
            >
              <span>⚡</span> Set Sample Orders (Now)
            </button>
          )}
          {orders.length > 0 && onClearHistory && (
            <button
              onClick={onClearHistory}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg border transition-all hover:bg-red-50 cursor-pointer flex items-center gap-1.5"
              style={{ borderColor: '#FCA5A5', color: '#DC2626', background: '#FFFFFF' }}
              title="Clear all previous order history and start fresh from now"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Clear All History</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#9A8F82' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search customer or order number…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border outline-none focus:ring-2 transition-all"
            style={{ borderColor: '#E8DDD0', background: '#FFFFFF', color: '#2C2A26', '--tw-ring-color': '#8B5E3C33' } as any}
          />
        </div>
        <input
          type="date"
          defaultValue={todayStr}
          className="px-3 py-2.5 text-sm rounded-lg border outline-none"
          style={{ borderColor: '#E8DDD0', background: '#FFFFFF', color: '#2C2A26' }}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-full border transition-all"
            style={filter === f.value
              ? { background: '#8B5E3C', color: '#FAF6F0', borderColor: '#8B5E3C' }
              : { background: '#FFFFFF', color: '#9A8F82', borderColor: '#E8DDD0' }
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="rounded-xl shadow-sm border overflow-hidden" style={{ background: '#FFFFFF', borderColor: '#E8DDD0' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: '#FAF6F0' }}>
                {['ORDER ID', 'CUSTOMER', 'PHONE', 'ORDER TIME', 'ITEMS', 'TOTAL', 'STATUS', 'ACTION'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold tracking-widest px-4 py-3" style={{ color: '#9A8F82' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-14 text-sm" style={{ color: '#9A8F82' }}>
                    <div className="max-w-md mx-auto space-y-2">
                      <p className="font-semibold text-base" style={{ color: '#2C2A26' }}>
                        {orders.length === 0 ? 'History Cleared — Set to Now' : 'No matching orders found'}
                      </p>
                      <p className="text-xs">
                        {orders.length === 0
                          ? 'All past history has been cleared and set to start fresh right now. New customer orders placed through the website will appear here in real-time.'
                          : 'Try changing your search term or status filter.'}
                      </p>
                      {orders.length === 0 && onSetHistoryNow && (
                        <button
                          onClick={onSetHistoryNow}
                          className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer hover:bg-amber-50"
                          style={{ borderColor: '#8B5E3C', color: '#8B5E3C' }}
                        >
                          <span>⚡</span> Load Current Orders Set to Now
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
              {filtered.map(order => (
                <tr key={order.id} className="border-t hover:bg-amber-50 transition-colors" style={{ borderColor: '#F0E8DC' }}>
                  <td className="px-4 py-3 font-mono text-sm font-semibold" style={{ color: '#8B5E3C' }}>{order.id}</td>
                  <td className="px-4 py-3 text-sm font-medium" style={{ color: '#2C2A26' }}>{order.customer}</td>
                  <td className="px-4 py-3 text-sm font-mono" style={{ color: '#9A8F82' }}>{order.phone}</td>
                  <td className="px-4 py-3 text-sm font-mono" style={{ color: '#9A8F82' }}>{order.time}</td>
                  <td className="px-4 py-3 text-sm max-w-48" style={{ color: '#2C2A26' }}>
                    {order.items.map(it => `${it.qty}× ${it.name}`).join(', ')}
                  </td>
                  <td className="px-4 py-3 font-semibold text-sm font-mono" style={{ color: '#2C2A26' }}>₹{order.total}</td>
                  <td className="px-4 py-3"><OrderBadge status={order.status} /></td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onViewOrder(order)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all hover:shadow-sm"
                      style={{ borderColor: '#8B5E3C', color: '#8B5E3C' }}
                    >
                      View Order
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t text-xs" style={{ borderColor: '#E8DDD0', color: '#9A8F82', background: '#FAF6F0' }}>
          Showing {filtered.length} of {orders.length} orders
        </div>
      </div>
    </div>
  );
}
