import { useState } from 'react';
import type { MenuItem } from '../types';

interface Props {
  items: MenuItem[];
  onUpdate: (items: MenuItem[]) => void;
}

const CATEGORIES = ['All', 'Tea', 'Coffee', 'Cool Drinks', 'Kerala Snacks', 'Food'];

const SAMPLE_IMAGES: { label: string; url: string }[] = [
  { label: 'Tea', url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&h=500&fit=crop&auto=format' },
  { label: 'Chai Glass', url: 'https://images.unsplash.com/photo-1720875733075-fd8494df7908?w=500&h=500&fit=crop&auto=format' },
  { label: 'Filter Coffee', url: 'https://images.unsplash.com/photo-1729277133095-bff46b56c29a?w=500&h=500&fit=crop&auto=format' },
  { label: 'Samosa', url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&h=500&fit=crop&auto=format' },
  { label: 'Vada', url: 'https://images.unsplash.com/photo-1596450512748-2dae774fc38a?w=500&h=500&fit=crop&auto=format' },
  { label: 'Snacks / Puffs', url: 'https://images.unsplash.com/photo-1621334721541-370a13974de8?w=500&h=500&fit=crop&auto=format' },
];

export default function Menu({ items, onUpdate }: Props) {
  const [catFilter, setCatFilter] = useState('All');
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: '',
    category: 'Tea',
    price: 20,
    stock: 50,
    image: '',
    available: true,
    description: '',
  });

  const filtered = catFilter === 'All' ? items : items.filter(i => i.category === catFilter);

  const toggleAvailability = (id: string) => {
    onUpdate(items.map(i => i.id === id ? { ...i, available: !i.available } : i));
  };

  const adjustStock = (id: string, delta: number) => {
    onUpdate(items.map(i => {
      if (i.id !== id) return i;
      const newStock = Math.max(0, (i.stock ?? 0) + delta);
      return {
        ...i,
        stock: newStock,
        available: newStock > 0 ? i.available : false,
      };
    }));
  };

  const saveEdit = () => {
    if (!editItem) return;
    const finalStock = Number(editItem.stock ?? 0);
    const updatedItem: MenuItem = {
      ...editItem,
      price: Number(editItem.price) || 0,
      stock: finalStock,
      available: finalStock > 0 ? editItem.available : false,
    };
    onUpdate(items.map(i => i.id === editItem.id ? updatedItem : i));
    setEditItem(null);
  };

  const deleteItem = (id: string) => {
    if (window.confirm('Are you sure you want to remove this item from the café menu?')) {
      onUpdate(items.filter(i => i.id !== id));
    }
  };

  const addItem = () => {
    const stockQty = Number(newItem.stock ?? 50);
    const fallbackImg = SAMPLE_IMAGES[0].url;
    const item: MenuItem = {
      id: 'm_' + Date.now(),
      name: newItem.name?.trim() || 'New Café Item',
      category: newItem.category || 'Tea',
      price: Number(newItem.price) || 20,
      stock: stockQty,
      image: newItem.image?.trim() || fallbackImg,
      available: stockQty > 0,
      description: newItem.description?.trim() || 'Prepared fresh daily with authentic ingredients.',
    };
    onUpdate([...items, item]);
    setShowAdd(false);
    setNewItem({
      name: '',
      category: 'Tea',
      price: 20,
      stock: 50,
      image: '',
      available: true,
      description: '',
    });
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl" style={{ color: '#2C2A26' }}>Menu Management</h1>
          <p className="text-sm mt-1" style={{ color: '#9A8F82' }}>
            {items.length} items · Real-time inventory & stock tracking
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:shadow-md cursor-pointer"
          style={{ background: '#8B5E3C', color: '#FAF6F0' }}
        >
          <span>＋ ADD NEW ITEM</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => setCatFilter(c)}
            className="px-4 py-1.5 text-xs font-semibold rounded-full border transition-all cursor-pointer"
            style={catFilter === c
              ? { background: '#8B5E3C', color: '#FAF6F0', borderColor: '#8B5E3C' }
              : { background: '#FFFFFF', color: '#9A8F82', borderColor: '#E8DDD0' }
            }
          >
            {c}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(item => {
          const itemStock = item.stock ?? 0;
          const isOutOfStock = itemStock <= 0 || !item.available;

          return (
            <div
              key={item.id}
              className="rounded-xl border overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              style={{ background: '#FFFFFF', borderColor: '#E8DDD0' }}
            >
              <div>
                <div className="relative h-40 bg-amber-50 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&h=500&fit=crop&auto=format';
                    }}
                  />
                  <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm"
                      style={!isOutOfStock
                        ? { background: '#D1FAE5', color: '#065F46' }
                        : { background: '#FEE2E2', color: '#991B1B' }
                      }
                    >
                      {!isOutOfStock ? '● Available' : '○ Out of Stock'}
                    </span>
                    <span
                      className="text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm font-mono"
                      style={itemStock > 10
                        ? { background: '#FAF6F0', color: '#8B5E3C', border: '1px solid #E8DDD0' }
                        : itemStock > 0
                        ? { background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A' }
                        : { background: '#FEE2E2', color: '#991B1B', border: '1px solid #FCA5A5' }
                      }
                    >
                      {itemStock > 0 ? `Stock: ${itemStock} items` : 'Stock: 0 items'}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-sm" style={{ color: '#2C2A26' }}>{item.name}</p>
                      <p className="text-xs mt-0.5 font-medium" style={{ color: '#9A8F82' }}>{item.category}</p>
                    </div>
                    <span className="font-bold font-mono text-base flex-shrink-0" style={{ color: '#8B5E3C' }}>
                      ₹{item.price}
                    </span>
                  </div>

                  <p className="text-xs mt-2 line-clamp-2" style={{ color: '#9A8F82', minHeight: '2rem' }}>
                    {item.description || 'Freshly brewed and served hot.'}
                  </p>

                  {/* Stock Quick Adjustment */}
                  <div className="mt-3 p-2 rounded-lg border flex items-center justify-between" style={{ borderColor: '#E8DDD0', background: '#FAF6F0' }}>
                    <span className="text-[11px] font-semibold" style={{ color: '#9A8F82' }}>Stock Count</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => adjustStock(item.id, -1)}
                        className="w-6 h-6 rounded flex items-center justify-center font-bold text-sm bg-white border border-[#E8DDD0] hover:bg-red-50 text-red-600 transition-colors cursor-pointer"
                        title="Decrease stock by 1"
                      >
                        −
                      </button>
                      <span className="font-mono text-xs font-bold w-7 text-center" style={{ color: '#2C2A26' }}>
                        {itemStock}
                      </span>
                      <button
                        onClick={() => adjustStock(item.id, 5)}
                        className="w-6 h-6 rounded flex items-center justify-center font-bold text-sm bg-white border border-[#E8DDD0] hover:bg-emerald-50 text-emerald-600 transition-colors cursor-pointer"
                        title="Add 5 to stock"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0 space-y-1.5">
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditItem({ ...item })}
                    className="flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer hover:bg-amber-50"
                    style={{ borderColor: '#8B5E3C', color: '#8B5E3C' }}
                  >
                    EDIT
                  </button>
                  <button
                    onClick={() => toggleAvailability(item.id)}
                    className="flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer"
                    style={item.available && itemStock > 0
                      ? { borderColor: '#F59E0B', color: '#D97706', background: '#FFFBEB' }
                      : { borderColor: '#5A7A5A', color: '#5A7A5A', background: '#F3F8F3' }
                    }
                  >
                    {item.available && itemStock > 0 ? 'MARK OUT' : 'MAKE AVAIL'}
                  </button>
                </div>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="w-full py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer hover:bg-red-50"
                  style={{ borderColor: '#FCA5A5', color: '#DC2626' }}
                >
                  DELETE
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      {editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }}>
          <div className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col" style={{ background: '#FFFFFF' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0" style={{ borderColor: '#E8DDD0', background: '#1C1A17' }}>
              <h2 className="font-display text-xl" style={{ color: '#FAF6F0' }}>Edit Menu Item</h2>
              <button onClick={() => setEditItem(null)} className="text-xl font-bold cursor-pointer hover:opacity-75" style={{ color: '#9A8F82' }}>✕</button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold tracking-widest block mb-1" style={{ color: '#9A8F82' }}>ITEM NAME</label>
                  <input
                    type="text"
                    value={editItem.name}
                    onChange={e => setEditItem({ ...editItem, name: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border outline-none"
                    style={{ borderColor: '#E8DDD0', color: '#2C2A26' }}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold tracking-widest block mb-1" style={{ color: '#9A8F82' }}>CATEGORY</label>
                  <select
                    value={editItem.category}
                    onChange={e => setEditItem({ ...editItem, category: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border outline-none"
                    style={{ borderColor: '#E8DDD0', color: '#2C2A26' }}
                  >
                    {CATEGORIES.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold tracking-widest block mb-1" style={{ color: '#9A8F82' }}>PRICE (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={editItem.price}
                    onChange={e => setEditItem({ ...editItem, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm rounded-lg border outline-none"
                    style={{ borderColor: '#E8DDD0', color: '#2C2A26' }}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold tracking-widest block mb-1" style={{ color: '#9A8F82' }}>STOCK QUANTITY</label>
                  <input
                    type="number"
                    min="0"
                    value={editItem.stock ?? 0}
                    onChange={e => setEditItem({ ...editItem, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm rounded-lg border outline-none"
                    style={{ borderColor: '#E8DDD0', color: '#2C2A26' }}
                  />
                </div>
              </div>

              {/* Image URL & Live Preview */}
              <div>
                <label className="text-xs font-semibold tracking-widest block mb-1" style={{ color: '#9A8F82' }}>IMAGE URL</label>
                <input
                  type="text"
                  value={editItem.image}
                  onChange={e => setEditItem({ ...editItem, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 text-sm rounded-lg border outline-none"
                  style={{ borderColor: '#E8DDD0', color: '#2C2A26' }}
                />

                {editItem.image && (
                  <div className="mt-2 p-2 rounded-lg border flex items-center gap-3" style={{ borderColor: '#E8DDD0', background: '#FAF6F0' }}>
                    <img
                      src={editItem.image}
                      alt="Preview"
                      className="w-16 h-14 object-cover rounded border"
                      style={{ borderColor: '#E8DDD0' }}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&h=500&fit=crop&auto=format';
                      }}
                    />
                    <div>
                      <p className="text-xs font-semibold" style={{ color: '#2C2A26' }}>Image Preview</p>
                      <p className="text-[11px]" style={{ color: '#9A8F82' }}>This image will appear on the public café website</p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold tracking-widest block mb-1" style={{ color: '#9A8F82' }}>DESCRIPTION</label>
                <textarea
                  rows={2}
                  value={editItem.description}
                  onChange={e => setEditItem({ ...editItem, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border outline-none"
                  style={{ borderColor: '#E8DDD0', color: '#2C2A26' }}
                />
              </div>
            </div>

            <div className="flex gap-3 px-6 py-4 border-t flex-shrink-0" style={{ borderColor: '#E8DDD0', background: '#FAF6F0' }}>
              <button
                onClick={() => setEditItem(null)}
                className="flex-1 py-2 text-sm font-semibold rounded-lg border cursor-pointer hover:bg-white"
                style={{ borderColor: '#E8DDD0', color: '#9A8F82' }}
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="flex-1 py-2 text-sm font-semibold rounded-lg cursor-pointer hover:opacity-95"
                style={{ background: '#8B5E3C', color: '#FAF6F0' }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }}>
          <div className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col" style={{ background: '#FFFFFF' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0" style={{ borderColor: '#E8DDD0', background: '#1C1A17' }}>
              <div>
                <h2 className="font-display text-xl" style={{ color: '#FAF6F0' }}>Add New Menu Item</h2>
                <p className="text-xs mt-0.5" style={{ color: '#9A8F82' }}>Item will immediately be added to the customer website</p>
              </div>
              <button onClick={() => setShowAdd(false)} className="text-xl font-bold cursor-pointer hover:opacity-75" style={{ color: '#9A8F82' }}>✕</button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold tracking-widest block mb-1" style={{ color: '#9A8F82' }}>ITEM NAME *</label>
                  <input
                    type="text"
                    placeholder="e.g. Cardamom Tea"
                    value={newItem.name}
                    onChange={e => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 text-sm rounded-lg border outline-none"
                    style={{ borderColor: '#E8DDD0', color: '#2C2A26' }}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold tracking-widest block mb-1" style={{ color: '#9A8F82' }}>CATEGORY</label>
                  <select
                    value={newItem.category}
                    onChange={e => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 text-sm rounded-lg border outline-none"
                    style={{ borderColor: '#E8DDD0', color: '#2C2A26' }}
                  >
                    {CATEGORIES.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold tracking-widest block mb-1" style={{ color: '#9A8F82' }}>PRICE (₹) *</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="25"
                    value={newItem.price || ''}
                    onChange={e => setNewItem(prev => ({ ...prev, price: Number(e.target.value) }))}
                    className="w-full px-3 py-2 text-sm rounded-lg border outline-none"
                    style={{ borderColor: '#E8DDD0', color: '#2C2A26' }}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold tracking-widest block mb-1" style={{ color: '#9A8F82' }}>NUMBER OF ITEMS (STOCK) *</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="50"
                    value={newItem.stock || ''}
                    onChange={e => setNewItem(prev => ({ ...prev, stock: Number(e.target.value) }))}
                    className="w-full px-3 py-2 text-sm rounded-lg border outline-none"
                    style={{ borderColor: '#E8DDD0', color: '#2C2A26' }}
                  />
                </div>
              </div>

              {/* Paste Image URL with Live Preview */}
              <div>
                <label className="text-xs font-semibold tracking-widest block mb-1" style={{ color: '#9A8F82' }}>
                  IMAGE URL (PASTE URL) *
                </label>
                <input
                  type="text"
                  placeholder="Paste direct image URL (https://...)"
                  value={newItem.image || ''}
                  onChange={e => setNewItem(prev => ({ ...prev, image: e.target.value }))}
                  className="w-full px-3 py-2 text-sm rounded-lg border outline-none"
                  style={{ borderColor: '#E8DDD0', color: '#2C2A26' }}
                />

                {/* Quick Presets */}
                <div className="flex items-center gap-1.5 flex-wrap mt-2">
                  <span className="text-[11px] font-semibold" style={{ color: '#9A8F82' }}>Quick presets:</span>
                  {SAMPLE_IMAGES.map((img) => (
                    <button
                      key={img.label}
                      type="button"
                      onClick={() => setNewItem(prev => ({ ...prev, image: img.url }))}
                      className="px-2 py-0.5 text-[10px] rounded border bg-white hover:bg-amber-50 cursor-pointer font-medium"
                      style={{ borderColor: '#E8DDD0', color: '#8B5E3C' }}
                    >
                      {img.label}
                    </button>
                  ))}
                </div>

                {/* Instant Live Image Preview */}
                {newItem.image?.trim() && (
                  <div className="mt-3 p-3 rounded-xl border flex items-center gap-3" style={{ borderColor: '#E8DDD0', background: '#FAF6F0' }}>
                    <img
                      src={newItem.image.trim()}
                      alt="Live Preview"
                      className="w-20 h-16 object-cover rounded-lg border shadow-sm"
                      style={{ borderColor: '#E8DDD0' }}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&h=500&fit=crop&auto=format';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <span>✓</span> Image Link Active & Verified
                      </p>
                      <p className="text-[11px] truncate mt-0.5" style={{ color: '#9A8F82' }}>
                        {newItem.image.trim()}
                      </p>
                      <p className="text-[10px] text-[#8B5E3C] mt-0.5">
                        This image will immediately show on the website card!
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold tracking-widest block mb-1" style={{ color: '#9A8F82' }}>DESCRIPTION</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Aromatic South Indian tea spiced with freshly crushed cardamom."
                  value={newItem.description || ''}
                  onChange={e => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 text-sm rounded-lg border outline-none"
                  style={{ borderColor: '#E8DDD0', color: '#2C2A26' }}
                />
              </div>
            </div>

            <div className="flex gap-3 px-6 py-4 border-t flex-shrink-0" style={{ borderColor: '#E8DDD0', background: '#FAF6F0' }}>
              <button
                onClick={() => setShowAdd(false)}
                className="flex-1 py-2.5 text-sm font-semibold rounded-lg border cursor-pointer hover:bg-white"
                style={{ borderColor: '#E8DDD0', color: '#9A8F82' }}
              >
                Cancel
              </button>
              <button
                onClick={addItem}
                className="flex-1 py-2.5 text-sm font-semibold rounded-lg cursor-pointer hover:opacity-95 shadow-sm"
                style={{ background: '#8B5E3C', color: '#FAF6F0' }}
              >
                Add Item to Website
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
