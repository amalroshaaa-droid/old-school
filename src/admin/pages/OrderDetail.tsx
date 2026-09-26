import type { Order, OrderStatus } from '../types';
import { OrderBadge } from '../components/StatusBadge';

interface Props {
  order: Order;
  onClose: () => void;
  onUpdateStatus: (id: string, status: OrderStatus) => void;
}

const ACTIONS: { label: string; status: OrderStatus; color: string; bg: string }[] = [
  { label: 'ACCEPT', status: 'ACCEPTED', color: '#1D4ED8', bg: '#EFF6FF' },
  { label: 'PREPARING', status: 'PREPARING', color: '#D97706', bg: '#FFFBEB' },
  { label: 'READY', status: 'READY', color: '#059669', bg: '#ECFDF5' },
  { label: 'COMPLETED', status: 'COMPLETED', color: '#374151', bg: '#F9FAFB' },
  { label: 'CANCEL', status: 'CANCELLED', color: '#DC2626', bg: '#FEF2F2' },
];

export default function OrderDetail({ order, onClose, onUpdateStatus }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="relative w-full max-w-lg mx-4 rounded-2xl shadow-2xl overflow-hidden" style={{ background: '#FFFFFF' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: '#E8DDD0', background: '#1C1A17' }}>
          <div>
            <p className="text-xs tracking-widest font-semibold" style={{ color: '#9A8F82' }}>ORDER DETAILS</p>
            <h2 className="font-display text-2xl mt-0.5" style={{ color: '#FAF6F0' }}>{order.id}</h2>
          </div>
          <div className="flex items-center gap-3">
            <OrderBadge status={order.status} />
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-white/10" style={{ color: '#9A8F82' }}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Customer Info */}
        <div className="px-6 py-4 grid grid-cols-2 gap-4 border-b" style={{ borderColor: '#E8DDD0', background: '#FAF6F0' }}>
          <div>
            <p className="text-xs font-semibold tracking-widest" style={{ color: '#9A8F82' }}>CUSTOMER</p>
            <p className="text-base font-semibold mt-1" style={{ color: '#2C2A26' }}>{order.customer}</p>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-widest" style={{ color: '#9A8F82' }}>PHONE</p>
            <p className="text-base font-mono mt-1" style={{ color: '#2C2A26' }}>{order.phone}</p>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-widest" style={{ color: '#9A8F82' }}>DATE</p>
            <p className="text-sm mt-1" style={{ color: '#2C2A26' }}>{order.date}</p>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-widest" style={{ color: '#9A8F82' }}>TIME</p>
            <p className="text-base font-mono mt-1" style={{ color: '#2C2A26' }}>{order.time}</p>
          </div>
          {order.paymentMethod && (
            <div className="col-span-2 pt-2 border-t border-[#E8DDD0]">
              <p className="text-xs font-semibold tracking-widest" style={{ color: '#9A8F82' }}>PAYMENT DETAILS</p>
              <p className="text-sm font-semibold mt-1 flex items-center gap-2" style={{ color: '#059669' }}>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>{order.paymentMethod}</span>
                <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-mono">{order.paymentStatus || 'PAID'}</span>
              </p>
            </div>
          )}
        </div>

        {/* Items */}
        <div className="px-6 py-4 border-b space-y-3" style={{ borderColor: '#E8DDD0' }}>
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono" style={{ background: '#F0E8DC', color: '#8B5E3C' }}>
                  {item.qty}
                </span>
                <span className="text-sm font-medium" style={{ color: '#2C2A26' }}>{item.name}</span>
              </div>
              <span className="text-sm font-semibold font-mono" style={{ color: '#2C2A26' }}>₹{item.qty * item.price}</span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="px-6 py-4 flex items-center justify-between border-b" style={{ borderColor: '#E8DDD0' }}>
          <span className="font-semibold text-base" style={{ color: '#2C2A26' }}>TOTAL</span>
          <span className="font-display text-2xl font-bold" style={{ color: '#8B5E3C' }}>₹{order.total}</span>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4">
          <p className="text-xs font-semibold tracking-widest mb-3" style={{ color: '#9A8F82' }}>UPDATE STATUS</p>
          <div className="flex flex-wrap gap-2">
            {ACTIONS.map(a => (
              <button
                key={a.status}
                onClick={() => { onUpdateStatus(order.id, a.status); onClose(); }}
                disabled={order.status === a.status}
                className="flex-1 min-w-0 px-3 py-2 text-xs font-bold rounded-lg border transition-all hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: a.bg, color: a.color, borderColor: a.color + '40' }}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
