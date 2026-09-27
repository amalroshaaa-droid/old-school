import { useState } from 'react';
import type { Customer, Order } from '../types';

interface Props {
  customers: Customer[];
  orders: Order[];
  onClearCustomers?: () => void;
}

export default function Customers({ customers, orders, onClearCustomers }: Props) {
  const [selected, setSelected] = useState<Customer | null>(null);
  const [search, setSearch] = useState('');

  // Find all orders corresponding to customer name or phone
  const customerOrders = (customer: Customer) => {
    const cleanPhone = customer.phone.replace(/\D/g, '');
    const qName = customer.name.toLowerCase().trim();
    return orders.filter(o => {
      const matchPhone = cleanPhone && o.phone && o.phone.replace(/\D/g, '') === cleanPhone;
      const matchName = o.customer.toLowerCase().includes(qName);
      return matchPhone || matchName;
    });
  };

  const getCustomerMetrics = (c: Customer) => {
    const cOrders = customerOrders(c);
    const count = cOrders.length;
    const spentFromOrders = cOrders.reduce((sum, o) => sum + o.total, 0);

    const effectiveOrders = count > 0 ? count : c.orders;
    const effectiveSpent = count > 0 ? spentFromOrders : c.totalSpent;
    const lastDate = count > 0 ? (cOrders[0].date || 'Today') : (c.lastOrder || '—');
    const lastTime = count > 0 ? (cOrders[0].time || '—') : (c.lastOrderTime || '—');

    return {
      ordersCount: effectiveOrders,
      totalSpent: effectiveSpent,
      lastOrder: lastDate,
      lastOrderTime: lastTime,
      orders: cOrders,
    };
  };

  const filteredCustomers = customers.filter(c => {
    const q = search.toLowerCase().trim();
    return !q || c.name.toLowerCase().includes(q) || c.phone.includes(q);
  });

  if (selected) {
    const metrics = getCustomerMetrics(selected);
    const cOrders = metrics.orders;

    return (
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelected(null)}
            className="flex items-center gap-1.5 text-sm font-semibold transition-colors cursor-pointer hover:underline"
            style={{ color: '#8B5E3C' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Customers Directory
          </button>
        </div>

        <div className="rounded-xl border shadow-sm overflow-hidden" style={{ background: '#FFFFFF', borderColor: '#E8DDD0' }}>
          <div className="px-6 py-5 border-b flex items-center justify-between gap-4" style={{ borderColor: '#E8DDD0', background: '#1C1A17' }}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold font-display" style={{ background: '#8B5E3C', color: '#FAF6F0' }}>
                {selected.name ? selected.name[0].toUpperCase() : 'C'}
              </div>
              <div>
                <h2 className="font-display text-2xl" style={{ color: '#FAF6F0' }}>{selected.name}</h2>
                <p className="text-sm font-mono mt-0.5" style={{ color: '#9A8F82' }}>📱 {selected.phone}</p>
              </div>
            </div>
            <span className="text-xs px-3 py-1 rounded-full font-semibold" style={{ background: '#3D342A', color: '#FAF6F0' }}>
              Registered Customer
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 border-b" style={{ borderColor: '#E8DDD0', background: '#FAF6F0' }}>
            {[
              { label: 'TOTAL ORDERS', value: metrics.ordersCount },
              { label: 'TOTAL SPENT', value: `₹${metrics.totalSpent.toLocaleString()}` },
              { label: 'LAST ORDER DATE', value: metrics.lastOrder },
              { label: 'LAST ORDER TIME', value: metrics.lastOrderTime },
            ].map(s => (
              <div key={s.label}>
                <p className="text-xs font-semibold tracking-widest" style={{ color: '#9A8F82' }}>{s.label}</p>
                <p className="text-lg font-bold font-mono mt-1" style={{ color: '#2C2A26' }}>{s.value}</p>
              </div>
            ))}
          </div>

          <div className="p-5">
            <h3 className="text-xs font-semibold tracking-widest mb-3" style={{ color: '#9A8F82' }}>ORDER TRANSACTIONS</h3>
            {cOrders.length === 0 ? (
              <p className="text-sm" style={{ color: '#9A8F82' }}>
                No active orders recorded in the current session.
              </p>
            ) : (
              <div className="space-y-2">
                {cOrders.map(o => (
                  <div key={o.id} className="flex items-center justify-between p-3.5 rounded-lg border hover:bg-amber-50 transition-colors" style={{ borderColor: '#E8DDD0', background: '#FAF6F0' }}>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold font-mono" style={{ color: '#8B5E3C' }}>{o.id}</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white text-[#2C2A26] border border-[#E8DDD0]">
                          {o.date || 'Today'} · {o.time}
                        </span>
                      </div>
                      <p className="text-xs mt-1" style={{ color: '#9A8F82' }}>
                        {o.items.map(i => `${i.qty}× ${i.name}`).join(', ')}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-base block" style={{ color: '#2C2A26' }}>₹{o.total}</span>
                      <span className="text-[11px] font-semibold text-emerald-700">{o.paymentStatus || 'PAID'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl" style={{ color: '#2C2A26' }}>Customers</h1>
          <p className="text-sm mt-1" style={{ color: '#9A8F82' }}>
            {customers.length} customer(s) registered · Customer name, phone & total spent track in real-time
          </p>
        </div>

        {customers.length > 0 && onClearCustomers && (
          <button
            onClick={onClearCustomers}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all hover:bg-red-50 cursor-pointer flex items-center gap-1.5"
            style={{ borderColor: '#FCA5A5', color: '#DC2626', background: '#FFFFFF' }}
            title="Clear all customer registrations and start fresh"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Clear Customer History</span>
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#9A8F82' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search by customer name or phone number…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border outline-none"
          style={{ borderColor: '#E8DDD0', background: '#FFFFFF', color: '#2C2A26' }}
        />
      </div>

      <div className="rounded-xl border shadow-sm overflow-hidden" style={{ background: '#FFFFFF', borderColor: '#E8DDD0' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: '#FAF6F0' }}>
                {['CUSTOMER', 'PHONE NUMBER', 'ORDERS', 'TOTAL SPENT', 'LAST ORDER DATE', 'LAST ORDER TIME', 'ACTION'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold tracking-widest px-4 py-3" style={{ color: '#9A8F82' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-14 text-sm" style={{ color: '#9A8F82' }}>
                    <div className="max-w-md mx-auto space-y-2">
                      <p className="font-semibold text-base" style={{ color: '#2C2A26' }}>
                        {customers.length === 0 ? 'Customer History Cleared' : 'No matching customers found'}
                      </p>
                      <p className="text-xs">
                        {customers.length === 0
                          ? 'Customer records start fresh from now. Whenever someone orders on the café website, their Name, Phone number, and Total Spent will automatically register here in real-time.'
                          : 'Try searching with a different name or phone number.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(c => {
                  const m = getCustomerMetrics(c);
                  return (
                    <tr
                      key={c.id}
                      className="border-t hover:bg-amber-50 transition-colors cursor-pointer"
                      style={{ borderColor: '#F0E8DC' }}
                      onClick={() => setSelected(c)}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-display flex-shrink-0" style={{ background: '#F0E8DC', color: '#8B5E3C' }}>
                            {c.name ? c.name[0].toUpperCase() : 'C'}
                          </div>
                          <span className="text-sm font-medium" style={{ color: '#2C2A26' }}>{c.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-mono font-medium" style={{ color: '#8B5E3C' }}>{c.phone}</td>
                      <td className="px-4 py-3 text-sm font-mono font-semibold" style={{ color: '#2C2A26' }}>{m.ordersCount}</td>
                      <td className="px-4 py-3 text-sm font-mono font-bold" style={{ color: '#8B5E3C' }}>₹{m.totalSpent.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm" style={{ color: '#2C2A26' }}>{m.lastOrder}</td>
                      <td className="px-4 py-3 text-sm font-mono" style={{ color: '#9A8F82' }}>{m.lastOrderTime}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={e => { e.stopPropagation(); setSelected(c); }}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer hover:bg-amber-100"
                          style={{ borderColor: '#8B5E3C', color: '#8B5E3C' }}
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t text-xs flex items-center justify-between" style={{ borderColor: '#E8DDD0', color: '#9A8F82', background: '#FAF6F0' }}>
          <span>Registered: {customers.length} customer(s)</span>
          <span>Automatic sync with customer checkout</span>
        </div>
      </div>
    </div>
  );
}
