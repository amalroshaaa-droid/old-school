import { useState } from 'react';

interface LoginProps {
  onLogin: () => void;
  onBackToWebsite?: () => void;
}

export default function Login({ onLogin, onBackToWebsite }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const userClean = email.trim().toLowerCase();
    if (!userClean || !password) { setError('Please enter username and password.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    
    // Configured admin credentials:
    const isValidUser = userClean === 'oldschool' || userClean === 'admin@oldschoolteakovai.com' || userClean === 'admin';
    const isValidPassword = password === 'oldschool12' || password === 'admin123';

    if (isValidUser && isValidPassword) {
      onLogin();
    } else {
      setError('Invalid credentials! Username: oldschool | Password: oldschool12');
    }
    setLoading(false);
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setForgotSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #3D2B1F 0%, #5C3D2E 50%, #6B4C3B 100%)' }}>
      {/* Background tea pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="relative w-full max-w-md">
        {/* Logo area */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{ background: 'rgba(245,240,232,0.15)', border: '1px solid rgba(245,240,232,0.3)' }}>
            <span className="text-3xl">☕</span>
          </div>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
            Old School Tea
          </h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(245,240,232,0.6)' }}>Kovai · Admin Panel</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8 shadow-2xl" style={{ background: '#FDFAF4' }}>
          {!showForgot ? (
            <>
              <h2 className="text-xl font-semibold mb-6" style={{ color: '#2C2C2C', fontFamily: 'Playfair Display, serif' }}>
                Sign in to your account
              </h2>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-600 mb-1.5" style={{ color: '#5C3D2E' }}>
                    Email / Username
                  </label>
                  <input
                    type="text"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="oldschool"
                    className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all"
                    style={{
                      border: '1.5px solid #D5CABC',
                      background: '#F5F0E8',
                      color: '#2C2C2C',
                      fontFamily: 'Nunito, sans-serif',
                    }}
                    onFocus={e => (e.target.style.borderColor = '#5C3D2E')}
                    onBlur={e => (e.target.style.borderColor = '#D5CABC')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-600 mb-1.5" style={{ color: '#5C3D2E' }}>
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="oldschool12"
                      className="w-full px-4 py-3 pr-12 rounded-lg text-sm outline-none transition-all"
                      style={{
                        border: '1.5px solid #D5CABC',
                        background: '#F5F0E8',
                        color: '#2C2C2C',
                        fontFamily: 'Nunito, sans-serif',
                      }}
                      onFocus={e => (e.target.style.borderColor = '#5C3D2E')}
                      onBlur={e => (e.target.style.borderColor = '#D5CABC')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-lg"
                      style={{ color: '#7A6A58' }}
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="px-4 py-3 rounded-lg text-sm" style={{ background: '#FEF2F2', color: '#991B1B', border: '1px solid #FECACA' }}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg text-sm font-700 transition-all cursor-pointer"
                  style={{
                    background: loading ? '#8B6650' : '#5C3D2E',
                    color: '#F5F0E8',
                    fontFamily: 'Nunito, sans-serif',
                  }}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              {onBackToWebsite && (
                <button
                  type="button"
                  onClick={onBackToWebsite}
                  className="w-full mt-3 py-2 text-xs font-700 flex items-center justify-center gap-1.5 rounded-lg border border-[#D5CABC] text-[#5C3D2E] hover:bg-[#5C3D2E]/10 transition-colors"
                >
                  <span>☕</span>
                  <span>Return to Café Website</span>
                </button>
              )}

              <button
                onClick={() => setShowForgot(true)}
                className="w-full mt-3 text-xs text-center"
                style={{ color: '#7A6A58' }}
              >
                Forgot password?
              </button>

              <div className="mt-5 p-3 rounded-lg border border-dashed border-[#D5CABC] bg-[#F5F0E8]/70 text-center">
                <p className="text-xs font-bold text-[#5C3D2E] mb-1">Admin Credentials:</p>
                <div className="flex items-center justify-center gap-2 text-xs text-[#7A6A58]">
                  <span>User: <code className="font-mono bg-white px-1.5 py-0.5 rounded text-[#2C2C2C]">oldschool</code></span>
                  <span>•</span>
                  <span>Pass: <code className="font-mono bg-white px-1.5 py-0.5 rounded text-[#2C2C2C]">oldschool12</code></span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('oldschool');
                    setPassword('oldschool12');
                    setError('');
                  }}
                  className="mt-2.5 text-[11px] font-bold text-[#5C3D2E] bg-white/80 hover:bg-white border border-[#D5CABC] px-2.5 py-1 rounded transition-colors cursor-pointer"
                >
                  ⚡ Auto-fill credentials
                </button>
              </div>
            </>
          ) : (
            <>
              <button onClick={() => { setShowForgot(false); setForgotSent(false); }}
                className="flex items-center gap-1 text-sm mb-4" style={{ color: '#7A6A58' }}>
                ← Back to login
              </button>
              <h2 className="text-xl font-semibold mb-2" style={{ color: '#2C2C2C', fontFamily: 'Playfair Display, serif' }}>
                Reset password
              </h2>
              {!forgotSent ? (
                <form onSubmit={handleForgot} className="space-y-4 mt-4">
                  <p className="text-sm" style={{ color: '#7A6A58' }}>Enter your email and we'll send reset instructions.</p>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-lg text-sm outline-none"
                    style={{ border: '1.5px solid #D5CABC', background: '#F5F0E8', color: '#2C2C2C' }}
                  />
                  <button type="submit" disabled={loading}
                    className="w-full py-3 rounded-lg text-sm font-700"
                    style={{ background: '#5C3D2E', color: '#F5F0E8' }}>
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </form>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">✉️</div>
                  <p className="text-sm font-600" style={{ color: '#2C2C2C' }}>Reset link sent!</p>
                  <p className="text-sm mt-1" style={{ color: '#7A6A58' }}>Check your email inbox.</p>
                </div>
              )}
            </>
          )}
        </div>

        <p className="text-center text-xs mt-6" style={{ color: 'rgba(245,240,232,0.4)' }}>
          © 2026 Old School Tea Kovai · Private Admin Area
        </p>
      </div>
    </div>
  );
}
