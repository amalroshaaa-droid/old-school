import { useState } from 'react';

export default function Settings() {
  const [cafeInfo, setCafeInfo] = useState({
    name: 'Old School Tea Kovai',
    phone: '+91 98765 43210',
    address: '42, Avinashi Road, Peelamedu, Coimbatore – 641 004, Tamil Nadu',
    openingHours: 'Mon–Sun: 7:00 AM – 10:30 PM',
    instagram: '@oldschooltea_kovai',
    facebook: 'OldSchoolTeaKovai',
  });
  const [adminInfo, setAdminInfo] = useState({ email: 'admin@oldschooltea.in' });
  const [passwords, setPasswords] = useState({ current: '', newPw: '', confirm: '' });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl" style={{ color: '#2C2A26' }}>Settings</h1>
        <p className="text-sm mt-1" style={{ color: '#9A8F82' }}>Manage your café and admin account</p>
      </div>

      {saved && (
        <div className="rounded-xl px-4 py-3 text-sm font-medium" style={{ background: '#D1FAE5', color: '#065F46', border: '1px solid #6EE7B7' }}>
          ✓ Settings saved successfully
        </div>
      )}

      {/* Café Information */}
      <div className="rounded-xl border shadow-sm overflow-hidden" style={{ background: '#FFFFFF', borderColor: '#E8DDD0' }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: '#E8DDD0', background: '#1C1A17' }}>
          <h2 className="font-semibold text-sm tracking-widest" style={{ color: '#FAF6F0' }}>☕ CAFÉ INFORMATION</h2>
        </div>
        <div className="p-5 space-y-4">
          {[
            { label: 'Café Name', key: 'name' as keyof typeof cafeInfo },
            { label: 'Phone', key: 'phone' as keyof typeof cafeInfo },
            { label: 'Address', key: 'address' as keyof typeof cafeInfo },
            { label: 'Opening Hours', key: 'openingHours' as keyof typeof cafeInfo },
            { label: 'Instagram', key: 'instagram' as keyof typeof cafeInfo },
            { label: 'Facebook', key: 'facebook' as keyof typeof cafeInfo },
          ].map(f => (
            <div key={f.key}>
              <label className="text-xs font-semibold tracking-widest block mb-1.5" style={{ color: '#9A8F82' }}>{f.label.toUpperCase()}</label>
              <input
                type="text"
                value={cafeInfo[f.key]}
                onChange={e => setCafeInfo(prev => ({ ...prev, [f.key]: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm rounded-lg border outline-none focus:ring-2 transition-all"
                style={{ borderColor: '#E8DDD0', color: '#2C2A26', background: '#FAF6F0' }}
              />
            </div>
          ))}

          <div>
            <label className="text-xs font-semibold tracking-widest block mb-1.5" style={{ color: '#9A8F82' }}>LOGO</label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl" style={{ background: '#F0E8DC', border: '2px dashed #C4A882' }}>
                ☕
              </div>
              <button className="px-4 py-2 text-sm font-semibold rounded-lg border transition-all" style={{ borderColor: '#8B5E3C', color: '#8B5E3C' }}>
                Upload Logo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Account */}
      <div className="rounded-xl border shadow-sm overflow-hidden" style={{ background: '#FFFFFF', borderColor: '#E8DDD0' }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: '#E8DDD0', background: '#1C1A17' }}>
          <h2 className="font-semibold text-sm tracking-widest" style={{ color: '#FAF6F0' }}>👤 ADMIN ACCOUNT</h2>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs font-semibold tracking-widest block mb-1.5" style={{ color: '#9A8F82' }}>EMAIL</label>
            <input
              type="email"
              value={adminInfo.email}
              onChange={e => setAdminInfo(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2.5 text-sm rounded-lg border outline-none"
              style={{ borderColor: '#E8DDD0', color: '#2C2A26', background: '#FAF6F0' }}
            />
          </div>
          <div className="pt-2 border-t" style={{ borderColor: '#E8DDD0' }}>
            <p className="text-xs font-semibold tracking-widest mb-3" style={{ color: '#9A8F82' }}>CHANGE PASSWORD</p>
            {[
              { label: 'Current Password', key: 'current' as keyof typeof passwords },
              { label: 'New Password', key: 'newPw' as keyof typeof passwords },
              { label: 'Confirm New Password', key: 'confirm' as keyof typeof passwords },
            ].map(f => (
              <div key={f.key} className="mb-3">
                <label className="text-xs font-medium block mb-1" style={{ color: '#9A8F82' }}>{f.label}</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passwords[f.key]}
                  onChange={e => setPasswords(prev => ({ ...prev, [f.key]: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm rounded-lg border outline-none"
                  style={{ borderColor: '#E8DDD0', color: '#2C2A26', background: '#FAF6F0' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleSave}
          className="px-6 py-2.5 text-sm font-semibold rounded-xl transition-all hover:shadow-md"
          style={{ background: '#8B5E3C', color: '#FAF6F0' }}
        >
          Save Changes
        </button>
        <button
          className="px-6 py-2.5 text-sm font-semibold rounded-xl border transition-all"
          style={{ borderColor: '#FCA5A5', color: '#DC2626' }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
