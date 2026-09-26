import type { OrderStatus, ReviewStatus } from '../types';

const orderColors: Record<OrderStatus, string> = {
  NEW: 'bg-amber-100 text-amber-800 border border-amber-200',
  ACCEPTED: 'bg-blue-100 text-blue-800 border border-blue-200',
  PREPARING: 'bg-orange-100 text-orange-800 border border-orange-200',
  READY: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
  COMPLETED: 'bg-gray-100 text-gray-600 border border-gray-200',
  CANCELLED: 'bg-red-100 text-red-700 border border-red-200',
};

const reviewColors: Record<ReviewStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-800 border border-amber-200',
  APPROVED: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
  HIDDEN: 'bg-gray-100 text-gray-600 border border-gray-200',
};

export function OrderBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold font-mono tracking-wide ${orderColors[status]}`}>
      {status === 'NEW' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse" />}
      {status}
    </span>
  );
}

export function ReviewBadge({ status }: { status: ReviewStatus }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${reviewColors[status]}`}>
      {status}
    </span>
  );
}
