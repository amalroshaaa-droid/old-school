import { useState } from 'react';
import type { Customer, Order } from '../types';

interface Props {
  customers: Customer[];
  orders: Order[];
}

export default function Customers({ customers, orders }: Props) {
  const [selected, setSelected] = useState<Customer | null>(null);

  const customerOrders = (name: string) => orders.filter(o => o.customer === name);

  if (selected) {
    const cOrders = customerOrders(selected.name);
    return (
      <div className="p-6 space-y-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelected(null)}
            className="flex items-center gap-1.5 text-sm font-medium transition-colors"
            style={{ color: '#8B5E3C' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Customers
          </button>
        </div>

        <div className="rounded-xl border shadow-sm" style={{ background: '#FFFFFF', borderColor: '#E8DDD0' }}>
          <div className="px-6 py-5 border-b flex items-center gap-4" style={{ borderColor: '#E8DDD0', background: '#1C1A17' }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold font-display" style={{ background: '#8B5E3C', color: '#FAF6F0' }}>
              {selected.name[0]}
            </div>
            <div>
              <h2 className="font-display text-2xl" style={{ color: '#FAF6F0' }}>{selected.name}</h2>
              <p className="text-sm font-mono mt-0.5" style={{ color: '#9A8F82' }}>{selected.phone}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 border-b" style={{ borderColor: '#E8DDD0', background: '#FAF6F0' }}>
            {[
              { label: 'TOTAL ORDERS', value: selected.orders },
              { label: 'TOTAL SPENT', value: `₹${selected.totalSpent.toLocaleString()}` },
              { label: 'LAST ORDER', value: selected.lastOrder },
              { label: 'LAST TIME', value: selected.lastOrderTime },
            ].map(s => (
              <div key={s.label}>
                <p className="text-xs font-semibold tracking-widest" style={{ color: '#9A8F82' }}>{s.label}</p>
                <p className="text-lg font-bold font-mono mt-1" style={{ color: '#2C2A26' }}>{s.value}</p>
              </div>
            ))}
          </div>

          <div className="p-5">
            <h3 className="text-xs font-semibold tracking-widest mb-3" style={{ color: '#9A8F82' }}>ORDER HISTORY</h3>
            {cOrders.length === 0 ? (
              <p className="text-sm" style={{ color: '#9A8F82' }}>No orders found for this customer.</p>
            ) : (
              <div className="space-y-2">
                {cOrders.map(o => (
                  <div key={o.id} className="flex items-center justify-between p-3 rounded-lg border" style={{ borderColor: '#E8DDD0', background: '#FAF6F0' }}>
                    <div>
                      <span className="text-sm font-semibold font-mono" style={{ color: '#8B5E3C' }}>{o.id}</span>
                      <span className="text-xs ml-3" style={{ color: '#9A8F82' }}>{o.time} · {o.items.map(i => `${i.qty}× ${i.name}`).join(', ')}</span>
                    </div>
                    <span className="font-mono font-semibold text-sm" style={{ color: '#2C2A26' }}>₹{o.total}</span>
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
      <div>
        <h1 className="font-display text-2xl" style={{ color: '#2C2A26' }}>Customers</h1>
        <p className="text-sm mt-1" style={{ color: '#9A8F82' }}>{customers.length} registered customers</p>
      </div>

      <div className="rounded-xl border shadow-sm overflow-hidden" style={{ background: '#FFFFFF', borderColor: '#E8DDD0' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: '#FAF6F0' }}>
                {['CUSTOMER', 'PHONE', 'ORDERS', 'TOTAL SPENT', 'LAST ORDER', 'LAST ORDER TIME', ''].map(h => (
                  <th key={h} className="text-left text-xs font-semibold tracking-widest px-4 py-3" style={{ color: '#9A8F82' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers.map(c => (
                <tr key={c.id} className="border-t hover:bg-amber-50 transition-colors cursor-pointer" style={{ borderColor: '#F0E8DC' }} onClick={() => setSelected(c)}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-display flex-shrink-0" style={{ background: '#F0E8DC', color: '#8B5E3C' }}>
                        {c.name[0]}
                      </div>
                      <span className="text-sm font-medium" style={{ color: '#2C2A26' }}>{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-mono" style={{ color: '#9A8F82' }}>{c.phone}</td>
                  <td className="px-4 py-3 text-sm font-mono font-semibold" style={{ color: '#2C2A26' }}>{c.orders}</td>
                  <td className="px-4 py-3 text-sm font-mono font-semibold" style={{ color: '#8B5E3C' }}>₹{c.totalSpent.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: '#9A8F82' }}>{c.lastOrder}</td>
                  <td className="px-4 py-3 text-sm font-mono" style={{ color: '#9A8F82' }}>{c.lastOrderTime}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={e => { e.stopPropagation(); setSelected(c); }}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all"
                      style={{ borderColor: '#8B5E3C', color: '#8B5E3C' }}
                    >
                      Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
