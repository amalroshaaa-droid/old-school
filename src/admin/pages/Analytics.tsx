import { useState } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line,
} from 'recharts';
import { hourlySales, monthlySales, bestSellers } from '../data';

const ranges = ['TODAY', 'THIS WEEK', 'THIS MONTH', 'CUSTOM RANGE'];

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

export default function Analytics() {
  const [range, setRange] = useState('TODAY');

  const totalSales = monthlySales.reduce((s, m) => s + m.sales, 0);
  const totalOrders = monthlySales.reduce((s, m) => s + m.orders, 0);
  const avgOrder = Math.round(totalSales / totalOrders);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl" style={{ color: '#2C2A26' }}>Sales & Analytics</h1>
          <p className="text-sm mt-1" style={{ color: '#9A8F82' }}>Performance overview — Old School Tea Kovai</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {ranges.map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-full border transition-all"
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'TOTAL SALES', value: `₹${totalSales.toLocaleString()}`, sub: 'Jan – Sep 2026', color: '#8B5E3C' },
          { label: 'TOTAL ORDERS', value: totalOrders.toLocaleString(), sub: 'All completed', color: '#5A7A5A' },
          { label: 'AVG ORDER VALUE', value: `₹${avgOrder}`, sub: 'Per transaction', color: '#2C2A26' },
        ].map(c => (
          <div key={c.label} className="rounded-xl border p-5 shadow-sm" style={{ background: '#FFFFFF', borderColor: '#E8DDD0' }}>
            <p className="text-xs font-semibold tracking-widest" style={{ color: '#9A8F82' }}>{c.label}</p>
            <p className="text-3xl font-bold font-display mt-2" style={{ color: c.color }}>{c.value}</p>
            <p className="text-xs mt-1" style={{ color: '#9A8F82' }}>{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Daily Chart */}
      <div className="rounded-xl border shadow-sm p-5" style={{ background: '#FFFFFF', borderColor: '#E8DDD0' }}>
        <h2 className="font-semibold text-sm tracking-widest mb-4" style={{ color: '#2C2A26' }}>DAILY SALES — TODAY</h2>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={hourlySales} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8DDD0" />
            <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#9A8F82' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9A8F82' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}`} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="sales" fill="#8B5E3C" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Chart + Table */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 rounded-xl border shadow-sm p-5" style={{ background: '#FFFFFF', borderColor: '#E8DDD0' }}>
          <h2 className="font-semibold text-sm tracking-widest mb-4" style={{ color: '#2C2A26' }}>MONTHLY SALES TREND</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlySales} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8DDD0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9A8F82' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9A8F82' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="sales" stroke="#8B5E3C" strokeWidth={2.5} dot={{ fill: '#8B5E3C', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2 rounded-xl border shadow-sm overflow-hidden" style={{ background: '#FFFFFF', borderColor: '#E8DDD0' }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: '#E8DDD0', background: '#FAF6F0' }}>
            <h2 className="font-semibold text-sm tracking-widest" style={{ color: '#2C2A26' }}>MONTHLY BREAKDOWN</h2>
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
                {monthlySales.map(m => (
                  <tr key={m.month} className="border-t" style={{ borderColor: '#F0E8DC' }}>
                    <td className="px-4 py-2.5 font-semibold" style={{ color: '#2C2A26' }}>{m.month}</td>
                    <td className="px-4 py-2.5 font-mono" style={{ color: '#9A8F82' }}>{m.orders.toLocaleString()}</td>
                    <td className="px-4 py-2.5 font-mono font-semibold" style={{ color: '#8B5E3C' }}>₹{(m.sales/1000).toFixed(1)}k</td>
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
        <div className="px-5 py-4 border-b" style={{ borderColor: '#E8DDD0', background: '#FAF6F0' }}>
          <h2 className="font-semibold text-sm tracking-widest" style={{ color: '#2C2A26' }}>BEST SELLING ITEMS</h2>
        </div>
        <div className="p-4 space-y-3">
          {bestSellers.map((item, i) => {
            const pct = Math.round((item.orders / bestSellers[0].orders) * 100);
            return (
              <div key={item.name} className="flex items-center gap-4">
                <span className="w-6 text-xs font-bold text-right font-mono" style={{ color: '#9A8F82' }}>#{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium" style={{ color: '#2C2A26' }}>{item.name}</span>
                    <div className="flex gap-4 text-xs font-mono">
                      <span style={{ color: '#9A8F82' }}>{item.orders} orders</span>
                      <span style={{ color: '#8B5E3C', fontWeight: 600 }}>₹{item.sales.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#F0E8DC' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: i === 0 ? '#8B5E3C' : '#C4A882' }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
