import { useState } from 'react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import type { Order } from '../types';
import { OrderBadge } from '../components/StatusBadge';
import { hourlySales } from '../data';

interface Props {
  orders: Order[];
  onViewOrder: (order: Order) => void;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#1C1A17', border: '1px solid #3D342A', borderRadius: 8, padding: '10px 14px' }}>
        <p style={{ color: '#9A8F82', fontSize: 12, marginBottom: 4 }}>{label}</p>
        <p style={{ color: '#FAF6F0', fontSize: 14, fontWeight: 600 }}>₹{payload[0].value.toLocaleString()}</p>
        <p style={{ color: '#8B5E3C', fontSize: 12 }}>{payload[1]?.value} orders</p>
      </div>
    );
  }
  return null;
};

export default function Dashboard({ orders, onViewOrder }: Props) {
  const liveOrders = orders.filter(o => o.status !== 'COMPLETED' && o.status !== 'CANCELLED');
  const todayOrders = orders.length;
  const todaySales = orders.reduce((s, o) => s + o.total, 0);
  const pending = orders.filter(o => ['NEW', 'ACCEPTED', 'PREPARING'].includes(o.status)).length;
  const completed = orders.filter(o => o.status === 'COMPLETED').length;

  const stats = [
    { label: "TODAY'S ORDERS", value: todayOrders, icon: '🛍', color: '#8B5E3C', bg: '#FFF8F3' },
    { label: "TODAY'S SALES", value: `₹${todaySales.toLocaleString()}`, icon: '💰', color: '#5A7A5A', bg: '#F3F8F3' },
    { label: 'PENDING ORDERS', value: pending, icon: '⏳', color: '#D97706', bg: '#FFFBF0' },
    { label: 'COMPLETED', value: completed, icon: '✓', color: '#374151', bg: '#F9FAFB' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl p-5 shadow-sm border" style={{ background: s.bg, borderColor: '#E8DDD0' }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold tracking-widest" style={{ color: '#9A8F82' }}>{s.label}</p>
                <p className="text-3xl font-bold mt-2 font-display" style={{ color: s.color }}>{s.value}</p>
              </div>
              <span className="text-2xl">{s.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl shadow-sm border p-5" style={{ background: '#FFFFFF', borderColor: '#E8DDD0' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-base" style={{ color: '#2C2A26' }}>TODAY'S SALES</h2>
              <p className="text-xs mt-0.5" style={{ color: '#9A8F82' }}>Revenue over time — 25 September 2026</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: '#F0E8DC', color: '#8B5E3C' }}>Live</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={hourlySales} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5E3C" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#8B5E3C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8DDD0" />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#9A8F82' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9A8F82' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="sales" stroke="#8B5E3C" strokeWidth={2.5} fill="url(#salesGrad)" />
              <Area type="monotone" dataKey="orders" stroke="#5A7A5A" strokeWidth={1.5} fill="none" strokeDasharray="4 2" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl shadow-sm border p-5 flex flex-col justify-between" style={{ background: '#1C1A17', borderColor: '#3D342A' }}>
          <h2 className="font-semibold text-sm tracking-widest" style={{ color: '#9A8F82' }}>TODAY'S SUMMARY</h2>
          <div className="space-y-5 mt-4">
            {[
              { label: 'TOTAL ORDERS', value: todayOrders, mono: true },
              { label: 'TOTAL SALES', value: `₹${todaySales.toLocaleString()}`, mono: true },
              { label: 'AVG ORDER VALUE', value: `₹${Math.round(todaySales / todayOrders)}`, mono: true },
              { label: 'LIVE / ACTIVE', value: liveOrders.length, mono: false },
            ].map((item) => (
              <div key={item.label} className="flex items-end justify-between border-b pb-3" style={{ borderColor: '#2E2A24' }}>
                <span className="text-xs tracking-widest" style={{ color: '#9A8F82' }}>{item.label}</span>
                <span className="text-xl font-bold font-mono" style={{ color: '#FAF6F0' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Orders */}
      <div className="rounded-xl shadow-sm border overflow-hidden" style={{ background: '#FFFFFF', borderColor: '#E8DDD0' }}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#E8DDD0' }}>
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <h2 className="font-semibold text-base" style={{ color: '#2C2A26' }}>LIVE ORDERS</h2>
            {liveOrders.length > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: '#FEF3C7', color: '#92400E' }}>
                {liveOrders.length} active
              </span>
            )}
          </div>
          <p className="text-xs" style={{ color: '#9A8F82' }}>Sorted by time · newest first</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: '#FAF6F0' }}>
                {['ORDER', 'CUSTOMER', 'TIME', 'ITEMS', 'TOTAL', 'STATUS', 'ACTION'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold tracking-widest px-4 py-3" style={{ color: '#9A8F82' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 8).map((order, i) => (
                <tr key={order.id} className="border-t hover:bg-amber-50 transition-colors" style={{ borderColor: '#F0E8DC' }}>
                  <td className="px-4 py-3 font-mono text-sm font-semibold" style={{ color: '#8B5E3C' }}>{order.id}</td>
                  <td className="px-4 py-3 text-sm font-medium" style={{ color: '#2C2A26' }}>{order.customer}</td>
                  <td className="px-4 py-3 text-sm font-mono" style={{ color: '#9A8F82' }}>{order.time}</td>
                  <td className="px-4 py-3 text-sm max-w-36">
                    <span style={{ color: '#2C2A26' }}>
                      {order.items.map(it => `${it.qty}× ${it.name}`).join(', ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-sm font-mono" style={{ color: '#2C2A26' }}>₹{order.total}</td>
                  <td className="px-4 py-3"><OrderBadge status={order.status} /></td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onViewOrder(order)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all hover:shadow-sm"
                      style={{ borderColor: '#8B5E3C', color: '#8B5E3C' }}
                    >
                      VIEW
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
