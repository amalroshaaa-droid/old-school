import { useState } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line,
} from 'recharts';
import type { Order } from '../types';
import { computeHourlySales, computeMonthlySales, computeBestSellers } from '../data';

interface Props {
  orders?: Order[];
  onClearHistory?: () => void;
}

const ranges = ['TODAY', 'THIS WEEK', 'THIS MONTH'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#1C1A17', border: '1px solid #3D342A', borderRadius: 8, padding: '10px 14px' }}>
        <p style={{ color: '#9A8F82', fontSize: 12, marginBottom: 4 }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.dataKey} style={{ color: '#FAF6F0', fontSize: 14, fontWeight: 600 }}>
            {p.dataKey === 'sales' ? `₹${p.value.toLocaleString()}` : `${p.value} orders`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Analytics({ orders = [], onClearHistory }: Props) {
  const [range, setRange] = useState('TODAY');

  const totalSales = orders.reduce((s, o) => s + o.total, 0);
  const totalOrders = orders.length;
  const avgOrder = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;

  const dynamicHourlySales = computeHourlySales(orders);
  const dynamicMonthlySales = computeMonthlySales(orders);
  const dynamicBestSellers = computeBestSellers(orders);

  const currentDateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl" style={{ color: '#2C2A26' }}>Sales & Analytics</h1>
          <p className="text-sm mt-1" style={{ color: '#9A8F82' }}>
            Live performance starting fresh from now · {currentDateStr}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onClearHistory && (
            <button
              onClick={onClearHistory}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all hover:bg-red-50 cursor-pointer flex items-center gap-1.5"
              style={{ borderColor: '#FCA5A5', color: '#DC2626', background: '#FFFFFF' }}
              title="Clear all sales history and restart tracking from now"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Clear History & Start Fresh</span>
            </button>
          )}

          <div className="flex gap-1.5">
            {ranges.map(r => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className="px-3 py-1.5 text-xs font-semibold rounded-full border transition-all cursor-pointer"
                style={range === r
                  ? { background: '#8B5E3C', color: '#FAF6F0', borderColor: '#8B5E3C' }
                  : { background: '#FFFFFF', color: '#9A8F82', borderColor: '#E8DDD0' }
                }
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* History Status Banner */}
      <div className="p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs" style={{ background: '#FAF6F0', borderColor: '#E8DDD0' }}>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-[#8B5E3C]">STARTING FROM NOW:</span>
          <span style={{ color: '#9A8F82' }}>
            {orders.length === 0
              ? 'All past sales history has been cleared. Tracking newly placed customer orders.'
              : `Tracking ${orders.length} order(s) placed since reset.`}
          </span>
        </div>
        <span className="font-mono font-semibold" style={{ color: '#8B5E3C' }}>
          Live Stream Active
        </span>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "TODAY'S TOTAL SALES", value: `₹${totalSales.toLocaleString()}`, sub: `Starting from now · ${currentDateStr}`, color: '#8B5E3C' },
          { label: 'TOTAL ORDERS PLACED', value: totalOrders.toLocaleString(), sub: 'Orders registered in system', color: '#5A7A5A' },
          { label: 'AVG ORDER VALUE', value: `₹${avgOrder}`, sub: 'Per transaction', color: '#2C2A26' },
        ].map(c => (
          <div key={c.label} className="rounded-xl border p-5 shadow-sm" style={{ background: '#FFFFFF', borderColor: '#E8DDD0' }}>
            <p className="text-xs font-semibold tracking-widest" style={{ color: '#9A8F82' }}>{c.label}</p>
            <p className="text-3xl font-bold font-display mt-2" style={{ color: c.color }}>{c.value}</p>
            <p className="text-xs mt-1" style={{ color: '#9A8F82' }}>{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Daily Sales Bar Chart */}
      <div className="rounded-xl border shadow-sm p-5" style={{ background: '#FFFFFF', borderColor: '#E8DDD0' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-sm tracking-widest" style={{ color: '#2C2A26' }}>DAILY SALES — TODAY (LIVE)</h2>
            <p className="text-xs mt-0.5" style={{ color: '#9A8F82' }}>Computed directly from orders placed today</p>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold" style={{ background: '#F0E8DC', color: '#8B5E3C' }}>
            Live
          </span>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={dynamicHourlySales} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8DDD0" />
            <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#9A8F82' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9A8F82' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}`} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="sales" fill="#8B5E3C" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Chart + Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 rounded-xl border shadow-sm p-5" style={{ background: '#FFFFFF', borderColor: '#E8DDD0' }}>
          <h2 className="font-semibold text-sm tracking-widest mb-4" style={{ color: '#2C2A26' }}>MONTHLY SALES TREND</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={dynamicMonthlySales} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8DDD0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9A8F82' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9A8F82' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}`} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="sales" stroke="#8B5E3C" strokeWidth={2.5} dot={{ fill: '#8B5E3C', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2 rounded-xl border shadow-sm overflow-hidden" style={{ background: '#FFFFFF', borderColor: '#E8DDD0' }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: '#E8DDD0', background: '#FAF6F0' }}>
            <h2 className="font-semibold text-sm tracking-widest" style={{ color: '#2C2A26' }}>CURRENT MONTH BREAKDOWN</h2>
          </div>
          <div className="overflow-auto" style={{ maxHeight: 260 }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: '#FAF6F0' }}>
                  {['MONTH', 'ORDERS', 'SALES', 'AVG'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold tracking-widest px-4 py-2" style={{ color: '#9A8F82' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dynamicMonthlySales.map(m => (
                  <tr key={m.month} className="border-t" style={{ borderColor: '#F0E8DC' }}>
                    <td className="px-4 py-2.5 font-semibold" style={{ color: '#2C2A26' }}>{m.month}</td>
                    <td className="px-4 py-2.5 font-mono" style={{ color: '#9A8F82' }}>{m.orders.toLocaleString()}</td>
                    <td className="px-4 py-2.5 font-mono font-semibold" style={{ color: '#8B5E3C' }}>₹{m.sales.toLocaleString()}</td>
                    <td className="px-4 py-2.5 font-mono" style={{ color: '#9A8F82' }}>₹{m.avg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Best Sellers */}
      <div className="rounded-xl border shadow-sm overflow-hidden" style={{ background: '#FFFFFF', borderColor: '#E8DDD0' }}>
        <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: '#E8DDD0', background: '#FAF6F0' }}>
          <h2 className="font-semibold text-sm tracking-widest" style={{ color: '#2C2A26' }}>BEST SELLING ITEMS (STARTING FROM NOW)</h2>
          <span className="text-xs" style={{ color: '#9A8F82' }}>{dynamicBestSellers.length} item types sold</span>
        </div>
        <div className="p-4 space-y-3">
          {dynamicBestSellers.length === 0 ? (
            <div className="py-8 text-center" style={{ color: '#9A8F82' }}>
              <p className="text-sm font-medium" style={{ color: '#2C2A26' }}>No sales recorded yet</p>
              <p className="text-xs mt-1">History has been cleared. Items will rank here as customers order them from now.</p>
            </div>
          ) : (
            dynamicBestSellers.map((item, i) => {
              const maxSales = dynamicBestSellers[0].sales || 1;
              const pct = Math.max(8, Math.round((item.sales / maxSales) * 100));
              return (
                <div key={item.name} className="flex items-center gap-4">
                  <span className="w-6 text-xs font-bold text-right font-mono" style={{ color: '#9A8F82' }}>#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium" style={{ color: '#2C2A26' }}>{item.name}</span>
                      <div className="flex gap-4 text-xs font-mono">
                        <span style={{ color: '#9A8F82' }}>{item.orders} ordered</span>
                        <span style={{ color: '#8B5E3C', fontWeight: 600 }}>₹{item.sales.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: '#F0E8DC' }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: i === 0 ? '#8B5E3C' : '#C4A882' }} />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
