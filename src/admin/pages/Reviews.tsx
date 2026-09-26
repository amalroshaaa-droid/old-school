import { useState } from 'react';
import type { Review, ReviewStatus } from '../types';
import { ReviewBadge } from '../components/StatusBadge';

interface Props {
  reviews: Review[];
  onUpdate: (reviews: Review[]) => void;
}

const TABS: { label: string; value: ReviewStatus | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Hidden', value: 'HIDDEN' },
];

function Stars({ n }: { n: number }) {
  return (
    <span>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= n ? '#D97706' : '#E8DDD0', fontSize: 14 }}>★</span>
      ))}
    </span>
  );
}

export default function Reviews({ reviews, onUpdate }: Props) {
  const [tab, setTab] = useState<ReviewStatus | 'ALL'>('ALL');

  const filtered = tab === 'ALL' ? reviews : reviews.filter(r => r.status === tab);

  const setStatus = (id: string, status: ReviewStatus) => {
    onUpdate(reviews.map(r => r.id === id ? { ...r, status } : r));
  };
  const deleteReview = (id: string) => onUpdate(reviews.filter(r => r.id !== id));

  const counts = {
    ALL: reviews.length,
    PENDING: reviews.filter(r => r.status === 'PENDING').length,
    APPROVED: reviews.filter(r => r.status === 'APPROVED').length,
    HIDDEN: reviews.filter(r => r.status === 'HIDDEN').length,
  };

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="font-display text-2xl" style={{ color: '#2C2A26' }}>Reviews</h1>
        <p className="text-sm mt-1" style={{ color: '#9A8F82' }}>Only approved reviews appear on the public website</p>
      </div>

      <div className="flex gap-2 border-b" style={{ borderColor: '#E8DDD0' }}>
        {TABS.map(t => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className="px-4 py-2.5 text-sm font-semibold border-b-2 transition-all -mb-px"
            style={tab === t.value
              ? { borderColor: '#8B5E3C', color: '#8B5E3C' }
              : { borderColor: 'transparent', color: '#9A8F82' }
            }
          >
            {t.label}
            <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full font-mono" style={{ background: '#F0E8DC', color: '#8B5E3C' }}>
              {counts[t.value]}
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="rounded-xl border p-12 text-center" style={{ borderColor: '#E8DDD0', background: '#FFFFFF' }}>
            <p className="text-sm" style={{ color: '#9A8F82' }}>No reviews in this category</p>
          </div>
        )}
        {filtered.map(r => (
          <div key={r.id} className="rounded-xl border shadow-sm p-5" style={{ background: '#FFFFFF', borderColor: '#E8DDD0' }}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold font-display flex-shrink-0" style={{ background: '#F0E8DC', color: '#8B5E3C' }}>
                  {r.customer[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-semibold text-sm" style={{ color: '#2C2A26' }}>{r.customer}</span>
                    <Stars n={r.rating} />
                    <ReviewBadge status={r.status} />
                  </div>
                  <p className="text-sm mt-2 leading-relaxed" style={{ color: '#5C5652' }}>{r.text}</p>
                  <p className="text-xs mt-2 font-mono" style={{ color: '#9A8F82' }}>{r.date}</p>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 flex-shrink-0">
                {r.status !== 'APPROVED' && (
                  <button
                    onClick={() => setStatus(r.id, 'APPROVED')}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all"
                    style={{ borderColor: '#6EE7B7', color: '#059669', background: '#ECFDF5' }}
                  >
                    APPROVE
                  </button>
                )}
                {r.status !== 'HIDDEN' && (
                  <button
                    onClick={() => setStatus(r.id, 'HIDDEN')}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all"
                    style={{ borderColor: '#E5E7EB', color: '#6B7280', background: '#F9FAFB' }}
                  >
                    HIDE
                  </button>
                )}
                <button
                  onClick={() => deleteReview(r.id)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all"
                  style={{ borderColor: '#FCA5A5', color: '#DC2626', background: '#FEF2F2' }}
                >
                  DELETE
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
