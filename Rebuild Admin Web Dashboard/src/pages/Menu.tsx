import { useState } from 'react';
import type { MenuItem } from '../types';

interface Props {
  items: MenuItem[];
  onUpdate: (items: MenuItem[]) => void;
}

const CATEGORIES = ['All', 'Tea', 'Coffee', 'Snacks'];

interface EditModal {
  item: MenuItem;
}

export default function Menu({ items, onUpdate }: Props) {
  const [catFilter, setCatFilter] = useState('All');
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({ available: true, category: 'Tea' });

  const filtered = catFilter === 'All' ? items : items.filter(i => i.category === catFilter);

  const toggleAvailability = (id: string) => {
    onUpdate(items.map(i => i.id === id ? { ...i, available: !i.available } : i));
  };

  const saveEdit = () => {
    if (!editItem) return;
    onUpdate(items.map(i => i.id === editItem.id ? editItem : i));
    setEditItem(null);
  };

  const deleteItem = (id: string) => {
    onUpdate(items.filter(i => i.id !== id));
  };

  const addItem = () => {
    const item: MenuItem = {
      id: 'm' + Date.now(),
      name: newItem.name || 'New Item',
      category: newItem.category || 'Tea',
      price: newItem.price || 0,
      image: newItem.image || 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&h=200&fit=crop&auto=format',
      available: true,
      description: newItem.description || '',
    };
    onUpdate([...items, item]);
    setShowAdd(false);
    setNewItem({ available: true, category: 'Tea' });
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl" style={{ color: '#2C2A26' }}>Menu Management</h1>
          <p className="text-sm mt-1" style={{ color: '#9A8F82' }}>{items.length} items across all categories</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:shadow-md"
          style={{ background: '#8B5E3C', color: '#FAF6F0' }}
        >
          <span>+ ADD NEW ITEM</span>
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => setCatFilter(c)}
            className="px-4 py-1.5 text-xs font-semibold rounded-full border transition-all"
            style={catFilter === c
              ? { background: '#8B5E3C', color: '#FAF6F0', borderColor: '#8B5E3C' }
              : { background: '#FFFFFF', color: '#9A8F82', borderColor: '#E8DDD0' }
            }
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(item => (
          <div key={item.id} className="rounded-xl border overflow-hidden shadow-sm hover:shadow-md transition-shadow" style={{ background: '#FFFFFF', borderColor: '#E8DDD0' }}>
            <div className="relative h-36 bg-amber-50">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              <span
                className={`absolute top-2 right-2 text-xs font-semibold px-2 py-0.5 rounded-full`}
                style={item.available
                  ? { background: '#D1FAE5', color: '#065F46' }
                  : { background: '#FEE2E2', color: '#991B1B' }
                }
              >
                {item.available ? '● Available' : '○ Out of Stock'}
              </span>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-sm" style={{ color: '#2C2A26' }}>{item.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#9A8F82' }}>{item.category}</p>
                </div>
                <span className="font-bold font-mono text-base" style={{ color: '#8B5E3C' }}>₹{item.price}</span>
              </div>
              <p className="text-xs mt-2 line-clamp-2" style={{ color: '#9A8F82' }}>{item.description}</p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setEditItem({ ...item })}
                  className="flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all"
                  style={{ borderColor: '#8B5E3C', color: '#8B5E3C' }}
                >
                  EDIT
                </button>
                <button
                  onClick={() => toggleAvailability(item.id)}
                  className="flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all"
                  style={item.available
                    ? { borderColor: '#F59E0B', color: '#D97706' }
                    : { borderColor: '#5A7A5A', color: '#5A7A5A' }
                  }
                >
                  {item.available ? 'OUT OF STOCK' : 'MAKE AVAILABLE'}
                </button>
              </div>
              <button
                onClick={() => deleteItem(item.id)}
                className="w-full mt-1.5 py-1.5 text-xs font-semibold rounded-lg border transition-all"
                style={{ borderColor: '#FCA5A5', color: '#DC2626' }}
              >
                DELETE
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="w-full max-w-md mx-4 rounded-2xl shadow-2xl" style={{ background: '#FFFFFF' }}>
            <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: '#E8DDD0', background: '#1C1A17' }}>
              <h2 className="font-display text-xl" style={{ color: '#FAF6F0' }}>Edit Item</h2>
              <button onClick={() => setEditItem(null)} style={{ color: '#9A8F82' }}>✕</button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: 'Item Name', key: 'name' as keyof MenuItem, type: 'text' },
                { label: 'Price (₹)', key: 'price' as keyof MenuItem, type: 'number' },
                { label: 'Category', key: 'category' as keyof MenuItem, type: 'text' },
                { label: 'Description', key: 'description' as keyof MenuItem, type: 'text' },
                { label: 'Image URL', key: 'image' as keyof MenuItem, type: 'text' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs font-semibold tracking-widest block mb-1" style={{ color: '#9A8F82' }}>{f.label}</label>
                  <input
                    type={f.type}
                    value={String(editItem[f.key])}
                    onChange={e => setEditItem({ ...editItem, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border outline-none"
                    style={{ borderColor: '#E8DDD0', color: '#2C2A26' }}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button onClick={() => setEditItem(null)} className="flex-1 py-2.5 text-sm font-semibold rounded-lg border" style={{ borderColor: '#E8DDD0', color: '#9A8F82' }}>Cancel</button>
              <button onClick={saveEdit} className="flex-1 py-2.5 text-sm font-semibold rounded-lg" style={{ background: '#8B5E3C', color: '#FAF6F0' }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="w-full max-w-md mx-4 rounded-2xl shadow-2xl" style={{ background: '#FFFFFF' }}>
            <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: '#E8DDD0', background: '#1C1A17' }}>
              <h2 className="font-display text-xl" style={{ color: '#FAF6F0' }}>Add New Item</h2>
              <button onClick={() => setShowAdd(false)} style={{ color: '#9A8F82' }}>✕</button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: 'Item Name', key: 'name', type: 'text', placeholder: 'e.g. Ginger Tea' },
                { label: 'Price (₹)', key: 'price', type: 'number', placeholder: '25' },
                { label: 'Category', key: 'category', type: 'text', placeholder: 'Tea / Coffee / Snacks' },
                { label: 'Description', key: 'description', type: 'text', placeholder: 'Brief description' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs font-semibold tracking-widest block mb-1" style={{ color: '#9A8F82' }}>{f.label}</label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    onChange={e => setNewItem(prev => ({ ...prev, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value }))}
                    className="w-full px-3 py-2 text-sm rounded-lg border outline-none"
                    style={{ borderColor: '#E8DDD0', color: '#2C2A26' }}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 text-sm font-semibold rounded-lg border" style={{ borderColor: '#E8DDD0', color: '#9A8F82' }}>Cancel</button>
              <button onClick={addItem} className="flex-1 py-2.5 text-sm font-semibold rounded-lg" style={{ background: '#8B5E3C', color: '#FAF6F0' }}>Add Item</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
