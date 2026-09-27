import { useState, useEffect } from 'react'
import AdminApp from './admin/App'
import type { Order, MenuItem, Customer, Review } from './admin/types'
import { initialOrders, initialMenuItems, initialReviews } from './admin/data'

interface CartItem {
  item: MenuItem
  qty: number
}

const getStoredMenuItems = (): MenuItem[] => {
  if (typeof window === 'undefined') return initialMenuItems
  try {
    const raw = localStorage.getItem('oldschool_menu_items')
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch (_) {}
  return initialMenuItems
}

const getStoredReviews = (): Review[] => {
  if (typeof window === 'undefined') return initialReviews
  try {
    const raw = localStorage.getItem('oldschool_reviews')
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch (_) {}
  return initialReviews
}

const CATEGORIES = ['All', 'Tea', 'Coffee', 'Cool Drinks', 'Kerala Snacks', 'Food']

const SNACK_CAROUSEL = [
  { name: 'Pazham Pori', label: 'Banana Fritter', img: 'https://images.unsplash.com/photo-1613764816537-a43baeb559c1?w=420&h=540&fit=crop&auto=format' },
  { name: 'Samosa', label: 'Spiced Pastry', img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=420&h=540&fit=crop&auto=format' },
  { name: 'Parippu Vada', label: 'Lentil Fritter', img: 'https://images.unsplash.com/photo-1596450512748-2dae774fc38a?w=420&h=540&fit=crop&auto=format' },
  { name: 'Street Bites', label: 'Evening Snacks', img: 'https://images.unsplash.com/photo-1621334721541-370a13974de8?w=420&h=540&fit=crop&auto=format' },
  { name: 'Crispy Bites', label: 'Daily Special', img: 'https://images.unsplash.com/photo-1605333409672-4f7db57ba3a2?w=420&h=540&fit=crop&auto=format' },
]

// ── Micro-components ──────────────────────────────────────────────────────────

function SteamSvg({ color = 'rgba(255,255,255,0.7)' }: { color?: string }) {
  return (
    <svg width="70" height="88" viewBox="0 0 70 88" fill="none" className="pointer-events-none">
      <path d="M18 85 Q28 68 16 55 Q4 42 18 28 Q32 14 22 2" stroke={color} strokeWidth="2.5" strokeLinecap="round"
        style={{ animation: 'steamRise 3s ease-in-out infinite' }} />
      <path d="M35 85 Q48 65 35 52 Q22 39 36 24 Q50 9 38 -2" stroke={color} strokeWidth="2" strokeLinecap="round"
        style={{ animation: 'steamRise 3.5s ease-in-out infinite 0.7s' }} />
      <path d="M54 83 Q60 65 50 53 Q40 41 52 27 Q64 13 55 0" stroke={color} strokeWidth="1.5" strokeLinecap="round"
        style={{ animation: 'steamRise 4s ease-in-out infinite 1.4s' }} />
    </svg>
  )
}

function MenuCardDark({ item, added, onAdd }: { item: MenuItem; added: boolean; onAdd: () => void }) {
  const stock = item.stock ?? 50
  const isOutOfStock = stock <= 0 || item.available === false
  const imgSrc = item.image || (item as any).img || 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&h=500&fit=crop&auto=format'
  const desc = item.description || (item as any).desc || 'Freshly prepared authentic café special.'

  return (
    <div className="group overflow-hidden border border-white/[0.08] hover:border-white/[0.16] transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="overflow-hidden bg-charcoal relative" style={{ height: 185 }}>
          <img
            src={imgSrc}
            alt={item.name}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-95 group-hover:scale-105 transition-all duration-500"
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&h=500&fit=crop&auto=format'
            }}
          />
          {/* Stock Tag on Card */}
          <div className="absolute top-2 right-2">
            {isOutOfStock ? (
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-red-600/90 text-white shadow">
                OUT OF STOCK
              </span>
            ) : stock <= 5 ? (
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/90 text-white shadow">
                Only {stock} left!
              </span>
            ) : (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-cream/80 border border-white/10">
                {stock} in stock
              </span>
            )}
          </div>
        </div>
        <div className="p-4 bg-white/[0.04]">
          <h3 className="font-display font-bold text-cream text-base leading-snug mb-1">{item.name}</h3>
          <p className="text-cream/45 text-xs leading-relaxed mb-4 line-clamp-2" style={{ minHeight: '2.2rem' }}>
            {desc}
          </p>
        </div>
      </div>
      <div className="p-4 pt-0 bg-white/[0.04] flex items-center justify-between">
        <span className="font-hand text-red font-bold" style={{ fontSize: '1.25rem' }}>₹{item.price}</span>
        <button
          onClick={onAdd}
          disabled={isOutOfStock}
          className={`text-xs font-black tracking-widest uppercase px-4 py-2 transition-all active:scale-95 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 disabled:bg-gray-700 ${
            isOutOfStock
              ? 'bg-gray-700 text-gray-400'
              : added
              ? 'bg-khaki text-white'
              : 'bg-red text-white hover:bg-red-light'
          }`}
        >
          {isOutOfStock ? 'SOLD OUT' : added ? '✓ ADDED' : 'ADD +'}
        </button>
      </div>
    </div>
  )
}

// ── Main App ──────────────────────────────────────────────────────────────────

function CafeWebsite({ onGoToAdmin }: { onGoToAdmin: () => void }) {
  const [menuList, setMenuList] = useState<MenuItem[]>(getStoredMenuItems)
  const [reviews, setReviews] = useState<Review[]>(getStoredReviews)
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('All')
  const [scrolled, setScrolled] = useState(false)
  const [testimonialIdx, setTestimonialIdx] = useState(0)
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set())

  // Review modal state
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [revName, setRevName] = useState('')
  const [revRating, setRevRating] = useState(5)
  const [revText, setRevText] = useState('')
  const [reviewSubmitted, setReviewSubmitted] = useState(false)
  const [reviewError, setReviewError] = useState('')

  const cartTotal = cart.reduce((s, c) => s + c.item.price * c.qty, 0)
  const cartCount = cart.reduce((s, c) => s + c.qty, 0)

  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'success'>('cart')
  const [custName, setCustName] = useState('')
  const [custPhone, setCustPhone] = useState('')
  const [orderType, setOrderType] = useState<'Dine-in' | 'Takeaway' | 'Delivery'>('Dine-in')
  const [tableOrAddress, setTableOrAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'UPI (GPay/PhonePe)' | 'Cash at Counter' | 'Debit/Credit Card'>('UPI (GPay/PhonePe)')
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null)
  const [formError, setFormError] = useState('')

  // Sync menu and reviews with localStorage across tabs & Admin updates
  useEffect(() => {
    const handleSync = () => {
      setMenuList(getStoredMenuItems())
      setReviews(getStoredReviews())
    }
    window.addEventListener('storage', handleSync)
    window.addEventListener('oldschool_menu_updated', handleSync)
    window.addEventListener('oldschool_review_submitted', handleSync)
    return () => {
      window.removeEventListener('storage', handleSync)
      window.removeEventListener('oldschool_menu_updated', handleSync)
      window.removeEventListener('oldschool_review_submitted', handleSync)
    }
  }, [])

  const addToCart = (item: MenuItem) => {
    const currentStock = item.stock ?? 50
    if (currentStock <= 0 || item.available === false) return

    setCart(prev => {
      const ex = prev.find(c => c.item.id === item.id)
      if (ex) {
        if (ex.qty >= currentStock) return prev // cannot exceed inventory stock
        return prev.map(c => c.item.id === item.id ? { ...c, qty: c.qty + 1 } : c)
      }
      return [...prev, { item, qty: 1 }]
    })
    setAddedIds(prev => new Set(prev).add(item.id))
    setTimeout(() => setAddedIds(prev => { const n = new Set(prev); n.delete(item.id); return n }), 1300)
  }

  const updateQty = (id: string, delta: number) => {
    setCart(prev =>
      prev.map(c => {
        if (c.item.id !== id) return c
        const currentStock = c.item.stock ?? 50
        const nextQty = c.qty + delta
        if (nextQty > currentStock) return c
        return { ...c, qty: Math.max(0, nextQty) }
      }).filter(c => c.qty > 0)
    )
  }

  const handlePlaceOrderAndPay = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    if (!custName.trim()) {
      setFormError('Please enter your full name.')
      return
    }
    const cleanPhone = custPhone.replace(/\D/g, '')
    if (cleanPhone.length < 10) {
      setFormError('Please enter a valid 10-digit mobile number.')
      return
    }

    setIsProcessingPayment(true)

    // Simulate payment transaction & order routing
    await new Promise(r => setTimeout(r, 1000))

    // Read existing orders from shared localStorage
    let currentOrders: Order[] = []
    try {
      const raw = localStorage.getItem('oldschool_orders')
      if (raw !== null) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
          currentOrders = parsed
        }
      }
    } catch (_) {}

    // Generate consecutive Order ID starting from #1001 if empty
    const maxNum = currentOrders.reduce((max, o) => {
      const parsedNum = parseInt(o.id.replace('#', ''))
      return !isNaN(parsedNum) && parsedNum > max ? parsedNum : max
    }, 1000)
    const newOrderId = `#${maxNum + 1}`

    const dateFormatted = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    const timeFormatted = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })

    const newOrder: Order = {
      id: newOrderId,
      customer: custName.trim() + (tableOrAddress.trim() ? ` (${orderType}: ${tableOrAddress.trim()})` : ` (${orderType})`),
      phone: cleanPhone,
      time: timeFormatted,
      timestamp: Date.now(),
      items: cart.map(c => ({ name: c.item.name, qty: c.qty, price: c.item.price })),
      total: cartTotal,
      status: 'NEW',
      date: dateFormatted,
      paymentMethod: paymentMethod,
      paymentStatus: paymentMethod === 'Cash at Counter' ? 'CASH' : 'PAID',
    }

    // 1. Save new order
    try {
      const updated = [newOrder, ...currentOrders]
      localStorage.setItem('oldschool_orders', JSON.stringify(updated))
      window.dispatchEvent(new Event('oldschool_order_placed'))
    } catch (err) {
      console.error('Error saving new order to localStorage', err)
    }

    // 2. Decrease stock quantity for each ordered item
    try {
      const currentMenu = getStoredMenuItems()
      const updatedMenu = currentMenu.map(m => {
        const match = cart.find(c => c.item.id === m.id || c.item.name === m.name)
        if (match) {
          const newStock = Math.max(0, (m.stock ?? 50) - match.qty)
          return {
            ...m,
            stock: newStock,
            available: newStock > 0,
          }
        }
        return m
      })
      localStorage.setItem('oldschool_menu_items', JSON.stringify(updatedMenu))
      setMenuList(updatedMenu)
      window.dispatchEvent(new Event('oldschool_menu_updated'))
    } catch (err) {
      console.error('Error updating menu stock', err)
    }

    // 3. Register customer details (name, phone, total spent, order count, date & time)
    try {
      let custRecords: Customer[] = []
      const rawCust = localStorage.getItem('oldschool_customers')
      if (rawCust) {
        custRecords = JSON.parse(rawCust)
        if (!Array.isArray(custRecords)) custRecords = []
      }
      const existingIdx = custRecords.findIndex(c => c.phone.replace(/\D/g, '') === cleanPhone)
      if (existingIdx >= 0) {
        const ex = custRecords[existingIdx]
        custRecords[existingIdx] = {
          ...ex,
          name: custName.trim() || ex.name,
          orders: ex.orders + 1,
          totalSpent: ex.totalSpent + cartTotal,
          lastOrder: dateFormatted,
          lastOrderTime: timeFormatted,
        }
      } else {
        custRecords.unshift({
          id: 'c_' + Date.now(),
          name: custName.trim(),
          phone: cleanPhone,
          orders: 1,
          totalSpent: cartTotal,
          lastOrder: dateFormatted,
          lastOrderTime: timeFormatted,
        })
      }
      localStorage.setItem('oldschool_customers', JSON.stringify(custRecords))
      window.dispatchEvent(new Event('oldschool_customer_updated'))
    } catch (err) {
      console.error('Error registering customer', err)
    }

    // Play chime tone
    try {
      const ctx = new AudioContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(587.33, ctx.currentTime) // D5
      osc.frequency.setValueAtTime(880.00, ctx.currentTime + 0.15) // A5
      gain.gain.setValueAtTime(0.2, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.5)
    } catch (_) {}

    setPlacedOrder(newOrder)
    setCart([])
    setIsProcessingPayment(false)
    setCheckoutStep('success')
  }

  // Handle customer review submission
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()
    setReviewError('')
    if (!revName.trim()) {
      setReviewError('Please enter your name.')
      return
    }
    if (!revText.trim()) {
      setReviewError('Please write your review feedback.')
      return
    }

    const newRev: Review = {
      id: 'rev_' + Date.now(),
      customer: revName.trim(),
      rating: revRating,
      text: revText.trim(),
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }),
      status: 'APPROVED',
    }

    try {
      const currentRevs = getStoredReviews()
      const updatedRevs = [newRev, ...currentRevs]
      localStorage.setItem('oldschool_reviews', JSON.stringify(updatedRevs))
      setReviews(updatedRevs)
      window.dispatchEvent(new Event('oldschool_review_submitted'))
      setReviewSubmitted(true)
      setTimeout(() => {
        setShowReviewModal(false)
        setReviewSubmitted(false)
        setRevName('')
        setRevText('')
        setRevRating(5)
      }, 2000)
    } catch (err) {
      console.error('Error saving review', err)
    }
  }

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    if (reviews.length === 0) return
    const t = setInterval(() => setTestimonialIdx(i => (i + 1) % reviews.length), 4800)
    return () => clearInterval(t)
  }, [reviews.length])

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  const availableCategories = ['All', ...Array.from(new Set(menuList.map(m => m.category))).filter(Boolean)]
  const filteredMenu = activeCategory === 'All' ? menuList : menuList.filter(m => m.category === activeCategory)

  return (
    <div className="relative pb-16 md:pb-0">

      {/* ─────────────────────────────────── NAV */}
      <nav className={`fixed top-0 left-0 right-0 z-50 nav-transition ${scrolled ? 'bg-charcoal shadow-xl shadow-black/30' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-5 md:px-10 h-16 flex items-center justify-between">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-left">
            <span className="block text-cream/50 text-[10px] tracking-[0.3em] uppercase leading-none mb-0.5">Old School</span>
            <span className="block font-display text-cream font-black text-xl tracking-tight leading-none">Tea Kovai</span>
          </button>

          <div className="hidden md:flex items-center gap-8">
            {(['Menu', 'Story', 'Gallery', 'Location'] as const).map(l => (
              <button key={l} onClick={() => scrollTo(l.toLowerCase())}
                className="text-cream/55 hover:text-cream text-[10px] tracking-[0.22em] uppercase transition-colors">
                {l}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onGoToAdmin}
              className="flex items-center gap-1.5 text-cream/75 hover:text-cream text-[10px] font-bold tracking-[0.2em] uppercase border border-cream/25 hover:border-cream/70 px-3 py-2 transition-all hover:bg-cream/10 cursor-pointer"
              title="Open Café Admin Dashboard"
            >
              <span className="text-xs">🔒</span>
              <span className="hidden sm:inline">Admin</span>
            </button>
            <button onClick={() => setCartOpen(true)} className="relative p-2 text-cream hover:text-cream/80 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black leading-none">
                  {cartCount}
                </span>
              )}
            </button>
            <button onClick={() => scrollTo('order-cta')}
              className="hidden sm:block bg-red text-white text-[10px] font-black tracking-[0.2em] uppercase px-5 py-2.5 hover:bg-red-light transition-colors">
              ORDER NOW
            </button>
          </div>
        </div>
      </nav>

      {/* ─────────────────────────────────── HERO */}
      <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center bg-charcoal overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1683533698971-dcc5e19cb0f1?w=1800&h=1200&fit=crop&auto=format"
            alt="Tea and snacks at Old School Tea Kovai"
            className="w-full h-full object-cover opacity-[0.22]"
          />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(180deg, #1C1209 0%, rgba(28,18,9,0.45) 45%, #1C1209 100%)' }} />
        </div>

        {/* Decorative vintage elements */}
        <div className="absolute top-24 left-7 hidden lg:block" style={{ transform: 'rotate(-13deg)', opacity: 0.4 }}>
          <span className="font-hand text-cream text-2xl">since forever ago</span>
        </div>
        <div className="absolute bottom-24 right-8 hidden lg:flex items-center justify-center stamp-circle opacity-25"
          style={{ width: 90, height: 90 }}>
          <span className="font-hand text-cream text-xs text-center leading-snug font-bold">Kovai's<br />Best Cup</span>
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-7">
            <span className="h-px w-10 bg-cream/25"></span>
            <span className="text-cream/45 text-[10px] tracking-[0.38em] uppercase">Coimbatore, Tamil Nadu</span>
            <span className="h-px w-10 bg-cream/25"></span>
          </div>

          <h1 className="font-display font-black text-cream leading-none tracking-tight"
            style={{ fontSize: 'clamp(3.2rem, 13vw, 108px)', lineHeight: 0.95 }}>
            OLD SCHOOL
          </h1>
          <h1 className="font-display font-black text-red leading-none tracking-tight mb-5"
            style={{ fontSize: 'clamp(3.2rem, 13vw, 108px)', lineHeight: 1 }}>
            TEA.
          </h1>

          <div className="flex justify-center mb-3">
            <SteamSvg />
          </div>

          <p className="text-cream/65 text-lg sm:text-xl font-light tracking-wide max-w-xs sm:max-w-sm mx-auto mb-10 leading-relaxed">
            Kovai's little corner for tea, coffee & Kerala comfort.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <button onClick={() => scrollTo('order-cta')}
              className="bg-red text-white font-black text-xs tracking-[0.25em] uppercase px-12 py-4 hover:bg-red-light transition-all hover:scale-[1.03] active:scale-[0.97] shadow-2xl shadow-red/30 w-full sm:w-auto">
              ORDER NOW
            </button>
            <button onClick={() => scrollTo('menu')}
              className="border border-cream/30 text-cream text-xs font-semibold tracking-[0.22em] uppercase px-12 py-4 hover:bg-cream/10 transition-colors w-full sm:w-auto">
              EXPLORE MENU
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-cream/38 text-xs tracking-wide">
            <span>📍</span>
            <span>Ukkadam · Coimbatore</span>
            <span className="opacity-50 mx-1">·</span>
            <span>Open until 10:30 PM</span>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-35">
          <div className="w-5 h-9 border border-cream/50 rounded-full flex items-start justify-center pt-1.5">
            <div className="w-px h-3 bg-cream/60 rounded-full"
              style={{ animation: 'scrollBob 2s ease-in-out infinite' }} />
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────── STORY */}
      <section id="story" className="py-24 lg:py-32 bg-cream paper-texture">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Image */}
            <div className="relative order-2 lg:order-1">
              <div className="relative overflow-hidden bg-cream-dark" style={{ paddingBottom: '116%' }}>
                <img
                  src="https://images.unsplash.com/photo-1720875733075-fd8494df7908?w=700&h=900&fit=crop&auto=format"
                  alt="Tea at Old School Tea Kovai"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(to bottom, transparent 60%, rgba(28,18,9,0.25) 100%)' }} />
              </div>
              {/* Price tag */}
              <div className="absolute -bottom-5 -right-4 bg-cream-light p-4 shadow-xl double-border">
                <span className="font-hand text-brown font-bold block" style={{ fontSize: '1.3rem' }}>₹1–₹200</span>
                <span className="font-hand text-brown/55 text-sm">easy on the pocket</span>
              </div>
              {/* Vintage stamp */}
              <div className="absolute -top-4 -left-4 stamp-circle" style={{ width: 80, height: 80, transform: 'rotate(-12deg)' }}>
                <span className="font-hand text-red text-xs text-center font-bold leading-tight">Open<br />Daily!</span>
              </div>
            </div>

            {/* Text */}
            <div className="order-1 lg:order-2">
              <span className="text-brown/50 text-[10px] tracking-[0.35em] uppercase block mb-4">Our Story</span>
              <h2 className="font-display font-black text-charcoal leading-tight mb-6"
                style={{ fontSize: 'clamp(2.4rem, 5vw, 54px)' }}>
                NOT JUST TEA.<br />
                <span className="text-brown">IT'S A MOOD.</span>
              </h2>
              <p className="text-charcoal/70 text-lg leading-relaxed mb-4 font-light">
                Good tea. Hot snacks. Slow conversations.
              </p>
              <p className="text-charcoal/55 leading-relaxed mb-5" style={{ fontSize: '0.95rem' }}>
                The kind of place where you come for a cup and somehow stay much longer.
                Where the tea is always brewed right, the snacks are always crispy,
                and the bill never stings.
              </p>
              <p className="text-charcoal/55 leading-relaxed mb-10" style={{ fontSize: '0.95rem' }}>
                We bring Kerala's tea culture to Coimbatore — one honest, flavorful cup at a time.
                No pretense. No shortcuts. Just the real thing.
              </p>
              <div className="flex items-center gap-5 flex-wrap">
                <button onClick={() => scrollTo('menu')}
                  className="bg-charcoal text-cream text-[10px] font-black tracking-[0.25em] uppercase px-8 py-3.5 hover:bg-brown-dark transition-colors">
                  SEE THE MENU
                </button>
                <span className="font-hand text-brown text-xl">← the tea awaits</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────── MENU */}
      <section id="menu" className="py-24 bg-charcoal">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="text-center mb-14">
            <span className="text-cream/30 text-[10px] tracking-[0.35em] uppercase block mb-3">What We Serve</span>
            <h2 className="font-display font-black text-cream"
              style={{ fontSize: 'clamp(2.4rem, 6vw, 58px)' }}>
              WHAT'S YOUR PICK?
            </h2>
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-12 pb-1">
            {availableCategories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-5 py-2 text-[10px] font-black tracking-[0.22em] uppercase transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-red text-white'
                    : 'border border-white/15 text-cream/50 hover:text-cream hover:border-white/35'
                }`}>
                {cat}
              </button>
            ))}
          </div>

          {/* Items grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredMenu.map(item => (
              <MenuCardDark
                key={item.id}
                item={item}
                added={addedIds.has(item.id)}
                onAdd={() => addToCart(item)}
              />
            ))}
          </div>

          {cartCount > 0 && (
            <div className="mt-10 text-center">
              <button onClick={() => setCartOpen(true)}
                className="bg-red text-white font-black text-xs tracking-[0.22em] uppercase px-10 py-4 hover:bg-red-light transition-colors inline-flex items-center gap-3 cursor-pointer">
                VIEW ORDER
                <span className="bg-white text-red text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black">
                  {cartCount}
                </span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ─────────────────────────────────── SIGNATURE TEA */}
      <section className="py-28 bg-cream relative overflow-hidden">
        <div className="absolute inset-0 paper-texture" />
        <div className="max-w-6xl mx-auto px-6 md:px-10 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-brown/50 text-[10px] tracking-[0.35em] uppercase block mb-4">Signature</span>
              <h2 className="font-display font-black text-charcoal leading-tight mb-8"
                style={{ fontSize: 'clamp(2.2rem, 5vw, 52px)' }}>
                One cup.<br />
                One conversation.<br />
                <span className="text-red">One more?</span>
              </h2>
              <p className="text-charcoal/60 text-lg leading-relaxed mb-10">
                There's something about our tea that keeps people coming back.
                Maybe it's the brew. Maybe it's the vibe. Probably both.
              </p>
              <button onClick={() => addToCart(menuList[0] || initialMenuItems[0])}
                className="bg-red text-white font-black text-xs tracking-[0.22em] uppercase px-10 py-4 hover:bg-red-light transition-all hover:scale-[1.03] active:scale-[0.97] shadow-lg shadow-red/20 cursor-pointer">
                ORDER THIS
              </button>
            </div>

            <div className="flex justify-center">
              <div className="relative">
                <div className="overflow-hidden bg-cream-dark" style={{ width: 280, height: 360 }}>
                  <img
                    src="https://images.unsplash.com/photo-1661499102718-aebb4886a0bc?w=560&h=720&fit=crop&auto=format"
                    alt="Signature Old School Tea"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-16 left-1/2 -translate-x-1/2">
                  <SteamSvg color="rgba(107,61,30,0.5)" />
                </div>
                <div className="absolute -right-7 bottom-14 bg-charcoal text-cream px-5 py-3 shadow-xl"
                  style={{ transform: 'rotate(2.5deg)' }}>
                  <span className="font-hand text-red font-bold block" style={{ fontSize: '1.5rem' }}>₹15</span>
                  <span className="text-cream/45 text-xs tracking-widest">per cup</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────── KERALA SNACKS */}
      <section className="py-24 bg-brown-dark overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-10 mb-10">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <span className="text-cream/30 text-[10px] tracking-[0.35em] uppercase block mb-3">Kerala Kitchen</span>
              <h2 className="font-display font-black text-cream" style={{ fontSize: 'clamp(2rem, 4vw, 44px)' }}>
                Made for tea time.
              </h2>
            </div>
            <button
              onClick={() => { setActiveCategory('Kerala Snacks'); scrollTo('menu') }}
              className="border border-cream/20 text-cream/55 hover:text-cream hover:border-cream/50 text-[10px] tracking-[0.25em] uppercase px-6 py-3 transition-colors">
              SHOW ME MORE
            </button>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto no-scrollbar px-6 md:px-10 pb-3">
          {SNACK_CAROUSEL.map((s, i) => (
            <button key={i}
              onClick={() => { setActiveCategory('Kerala Snacks'); scrollTo('menu') }}
              className="flex-none group text-left"
              style={{ width: 220 }}>
              <div className="relative overflow-hidden bg-charcoal" style={{ height: 300 }}>
                <img
                  src={s.img}
                  alt={s.name}
                  className="w-full h-full object-cover opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(28,18,9,0.85) 30%, transparent 100%)' }} />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="font-hand text-cream/50 text-sm block">{s.label}</span>
                  <span className="font-display text-cream font-bold text-lg">{s.name}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────── WHY OLD SCHOOL */}
      <section className="py-24 bg-cream paper-texture">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="text-center mb-16">
            <span className="text-brown/50 text-[10px] tracking-[0.35em] uppercase block mb-3">Why We're Different</span>
            <h2 className="font-display font-black text-charcoal" style={{ fontSize: 'clamp(2rem, 5vw, 46px)' }}>
              WHY OLD SCHOOL?
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: '☕', title: 'Rich Tea', desc: 'Made for proper tea lovers. Every single time.' },
              { icon: '🥥', title: 'Kerala Snacks', desc: 'Comfort food with a genuine Kerala soul.' },
              { icon: '❤️', title: 'Nostalgic Vibes', desc: 'Old-school feeling. Modern comfort.' },
              { icon: '₹', title: 'Easy on Pocket', desc: 'Good food without the heavy bill. ₹1–₹200.' },
            ].map((f, i) => (
              <div key={i}
                className="group p-8 border border-charcoal/12 hover:bg-charcoal hover:border-charcoal transition-all duration-300 cursor-default">
                <span className="text-3xl block mb-5 group-hover:scale-110 transition-transform duration-300">{f.icon}</span>
                <h3 className="font-display font-bold text-charcoal group-hover:text-cream text-lg mb-3 transition-colors">{f.title}</h3>
                <p className="text-charcoal/55 group-hover:text-cream/65 text-sm leading-relaxed transition-colors">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────── TESTIMONIALS & REVIEWS */}
      <section id="reviews" className="py-24 bg-brown-dark relative">
        <div className="max-w-4xl mx-auto px-6 md:px-10 text-center">
          <span className="text-cream/30 text-[10px] tracking-[0.35em] uppercase block mb-3">Customer Reviews</span>
          <h2 className="font-display font-black text-cream mb-5"
            style={{ fontSize: 'clamp(2rem, 5vw, 46px)' }}>
            PEOPLE WHO GET THE VIBE.
          </h2>

          {/* Aggregate Rating */}
          <div className="flex items-center justify-center gap-1.5 mb-10">
            <span className="text-amber-400 tracking-wide">★★★★★</span>
            <span className="text-cream font-bold ml-1.5">
              {reviews.length > 0
                ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
                : '5.0'}
            </span>
            <span className="text-cream/40 text-sm ml-1">
              / 5 · {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
            </span>
          </div>

          {/* Testimonial / Review Carousel */}
          {reviews.length > 0 ? (
            <div className="relative mb-8" style={{ minHeight: 180 }}>
              {reviews.map((r, i) => (
                <div key={r.id || i}
                  className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-700 ${
                    i === (testimonialIdx % reviews.length) ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                  }`}>
                  <div className="flex items-center justify-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className={star <= r.rating ? 'text-amber-400 text-sm' : 'text-cream/20 text-sm'}>
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="font-display italic text-cream/80 max-w-2xl leading-relaxed mb-5"
                    style={{ fontSize: 'clamp(1.05rem, 2.5vw, 1.35rem)' }}>
                    "{r.text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="block w-8 h-px bg-cream/22"></span>
                    <span className="text-cream/70 font-semibold text-xs tracking-[0.25em] uppercase">{r.customer}</span>
                    {r.date && <span className="text-cream/40 text-[11px] font-mono">· {r.date}</span>}
                    <span className="block w-8 h-px bg-cream/22"></span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 mb-6">
              <p className="font-display italic text-cream/70 text-lg mb-2">Be the first to leave a review!</p>
              <p className="text-cream/40 text-xs">Share your experience with our tea, coffee, and Kerala snacks.</p>
            </div>
          )}

          {/* Indicator dots */}
          {reviews.length > 1 && (
            <div className="flex items-center justify-center gap-2 mb-10">
              {reviews.slice(0, 8).map((_, i) => (
                <button key={i} onClick={() => setTestimonialIdx(i)}
                  className={`rounded-full transition-all duration-300 cursor-pointer ${
                    i === (testimonialIdx % reviews.length) ? 'bg-red w-5 h-2' : 'bg-cream/22 hover:bg-cream/40 w-2 h-2'
                  }`} />
              ))}
            </div>
          )}

          {/* Write a Review Button */}
          <div className="mt-4">
            <button
              onClick={() => {
                setShowReviewModal(true)
                setReviewError('')
                setReviewSubmitted(false)
              }}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full border border-cream/30 text-cream hover:bg-cream/10 hover:border-cream/60 transition-all font-bold text-xs tracking-[0.2em] uppercase cursor-pointer hover:scale-105 active:scale-95 shadow-lg"
            >
              <span>✍️</span>
              <span>Write a Review</span>
            </button>
            <p className="text-[11px] text-cream/40 mt-2.5">
              Your feedback transmits directly to our café admin desk.
            </p>
          </div>
        </div>

        {/* ── Customer Review Submission Modal ── */}
        {showReviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}>
            <div className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-white/10" style={{ background: '#1C1A17' }}>
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
                <div>
                  <h3 className="font-display font-bold text-lg text-cream">Share Your Review</h3>
                  <p className="text-xs text-cream/50 mt-0.5">Tell the admin and fellow tea lovers about your visit</p>
                </div>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="text-cream/50 hover:text-cream text-lg font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {reviewSubmitted ? (
                <div className="p-8 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-2xl flex items-center justify-center mx-auto animate-bounce">
                    ✓
                  </div>
                  <h4 className="font-display font-bold text-xl text-cream">Review Submitted!</h4>
                  <p className="text-xs text-cream/60 leading-relaxed max-w-xs mx-auto">
                    Thank you, <span className="text-cream font-semibold">{revName}</span>! Your review has been submitted directly to the Café Admin Desk.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="p-6 space-y-4 text-left">
                  {reviewError && (
                    <div className="p-3 rounded-lg bg-red-900/30 border border-red-500/50 text-red-300 text-xs">
                      {reviewError}
                    </div>
                  )}

                  {/* Customer Name */}
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-cream/60 block mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul S."
                      value={revName}
                      onChange={e => setRevName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/15 text-cream text-sm outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>

                  {/* Star Rating Picker */}
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-cream/60 block mb-1.5">
                      Star Rating *
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRevRating(star)}
                          className="text-2xl transition-transform hover:scale-125 cursor-pointer"
                          style={{ color: star <= revRating ? '#F59E0B' : 'rgba(255,255,255,0.2)' }}
                          title={`${star} star${star > 1 ? 's' : ''}`}
                        >
                          ★
                        </button>
                      ))}
                      <span className="text-xs font-mono font-bold text-amber-400 ml-2">
                        {revRating} / 5 Stars
                      </span>
                    </div>
                  </div>

                  {/* Review Text */}
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-cream/60 block mb-1.5">
                      Your Review *
                    </label>
                    <textarea
                      rows={3}
                      placeholder="How was the tea, snacks, or ambiance? Tell us your favorites..."
                      value={revText}
                      onChange={e => setRevText(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/15 text-cream text-sm outline-none focus:border-amber-500 transition-colors resize-none"
                    />
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowReviewModal(false)}
                      className="flex-1 py-3 rounded-lg border border-white/15 text-cream/60 hover:text-cream text-xs font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 rounded-lg bg-red text-white hover:bg-red-light font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-red/30"
                    >
                      Submit Review
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </section>

      {/* ─────────────────────────────────── GALLERY */}
      <section id="gallery" className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="text-center mb-12">
            <span className="text-brown/50 text-[10px] tracking-[0.35em] uppercase block mb-3">The Vibe</span>
            <h2 className="font-display font-black text-charcoal" style={{ fontSize: 'clamp(1.8rem, 4vw, 42px)' }}>
              THE PLACE, THE FOOD,<br />THE FEELING.
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3" style={{ gridAutoRows: '200px' }}>
            <div className="row-span-2 overflow-hidden group cursor-pointer bg-cream-dark">
              <img src="https://images.unsplash.com/photo-1683533698971-dcc5e19cb0f1?w=600&h=850&fit=crop&auto=format"
                alt="Tea and snacks" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
            </div>
            <div className="overflow-hidden group cursor-pointer bg-cream-dark">
              <img src="https://images.unsplash.com/photo-1720875733075-fd8494df7908?w=600&h=400&fit=crop&auto=format"
                alt="Tea glasses" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
            </div>
            <div className="overflow-hidden group cursor-pointer bg-cream-dark">
              <img src="https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=400&fit=crop&auto=format"
                alt="Samosas" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
            </div>
            <div className="overflow-hidden group cursor-pointer bg-cream-dark">
              <img src="https://images.unsplash.com/photo-1775049873579-1630831cfa19?w=600&h=400&fit=crop&auto=format"
                alt="Café at night" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
            </div>
            <div className="overflow-hidden group cursor-pointer bg-cream-dark hidden md:block">
              <img src="https://images.unsplash.com/photo-1729277133095-bff46b56c29a?w=600&h=400&fit=crop&auto=format"
                alt="Filter coffee" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
            </div>
            <div className="overflow-hidden group cursor-pointer bg-cream-dark hidden md:block">
              <img src="https://images.unsplash.com/photo-1776078406204-284ee76ffb11?w=600&h=400&fit=crop&auto=format"
                alt="Vintage café details" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────── ORDER CTA */}
      <section id="order-cta" className="py-32 bg-charcoal text-center">
        <div className="max-w-xl mx-auto px-6">
          <span className="text-cream/30 text-[10px] tracking-[0.38em] uppercase block mb-4">Don't Wait</span>
          <h2 className="font-display font-black text-cream leading-none mb-6"
            style={{ fontSize: 'clamp(3.5rem, 11vw, 92px)' }}>
            HUNGRY<br />YET?
          </h2>
          <p className="text-cream/50 text-lg mb-12">Your tea is only a few clicks away.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <button onClick={() => setCartOpen(true)}
              className="bg-red text-white font-black text-xs tracking-[0.25em] uppercase px-12 py-5 hover:bg-red-light transition-all hover:scale-[1.03] active:scale-[0.97] shadow-2xl shadow-red/20 w-full sm:w-auto">
              ORDER NOW
            </button>
            <button onClick={() => scrollTo('menu')}
              className="border border-cream/28 text-cream text-xs font-semibold tracking-[0.22em] uppercase px-12 py-5 hover:bg-cream/10 transition-colors w-full sm:w-auto text-center cursor-pointer">
              EXPLORE MENU
            </button>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────── LOCATION */}
      <section id="location" className="py-24 bg-cream paper-texture">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <span className="text-brown/50 text-[10px] tracking-[0.35em] uppercase block mb-4">Find Us</span>
              <h2 className="font-display font-black text-charcoal mb-10"
                style={{ fontSize: 'clamp(2.5rem, 5vw, 52px)' }}>
                COME SAY HI.
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <span className="text-red text-xl mt-0.5 flex-none">📍</span>
                  <div>
                    <p className="font-semibold text-charcoal mb-1">Old School Tea Kovai</p>
                    <p className="text-charcoal/58 text-sm leading-relaxed">
                      Under, Ukkadam Sungam Bypass Road<br />
                      Shanmuga Nagar<br />
                      Coimbatore, Tamil Nadu 641018
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-red text-xl flex-none">🕙</span>
                  <p className="text-charcoal/58 text-sm">
                    <span className="font-semibold text-charcoal">Open until</span> 10:30 PM
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-red text-xl flex-none">📞</span>
                  <a href="tel:06383233483" className="text-charcoal/58 text-sm hover:text-red transition-colors">
                    063832 33483
                  </a>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-10">
                <a href="https://maps.google.com/?q=Ukkadam+Sungam+Bypass+Shanmuga+Nagar+Coimbatore"
                  target="_blank" rel="noopener noreferrer"
                  className="bg-charcoal text-cream text-[10px] font-black tracking-[0.22em] uppercase px-7 py-3.5 hover:bg-brown-dark transition-colors">
                  GET DIRECTIONS
                </a>
                <a href="tel:06383233483"
                  className="border border-charcoal/20 text-charcoal text-[10px] font-black tracking-[0.22em] uppercase px-7 py-3.5 hover:bg-charcoal hover:text-cream hover:border-charcoal transition-all">
                  CALL NOW
                </a>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="relative overflow-hidden bg-cream-dark" style={{ height: 420 }}>
              <div className="absolute inset-0"
                style={{
                  backgroundImage: 'linear-gradient(rgba(107,61,30,0.13) 1px, transparent 1px), linear-gradient(90deg, rgba(107,61,30,0.13) 1px, transparent 1px)',
                  backgroundSize: '40px 40px'
                }} />
              <div className="absolute inset-0"
                style={{
                  backgroundImage: 'linear-gradient(rgba(107,61,30,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(107,61,30,0.05) 1px, transparent 1px)',
                  backgroundSize: '8px 8px'
                }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl mb-3">📍</div>
                  <div className="bg-charcoal text-cream px-6 py-3 mb-3 shadow-xl">
                    <p className="font-display font-bold text-base">Old School Tea Kovai</p>
                  </div>
                  <p className="font-hand text-brown/70 text-lg mb-4">Ukkadam, Coimbatore</p>
                  <a href="https://maps.google.com/?q=Ukkadam+Sungam+Bypass+Shanmuga+Nagar+Coimbatore"
                    target="_blank" rel="noopener noreferrer"
                    className="text-red text-xs font-black tracking-widest uppercase hover:underline">
                    Open in Google Maps ↗
                  </a>
                </div>
              </div>
              <div className="absolute inset-0 pointer-events-none border-4 border-cream/55" />
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────── FINAL */}
      <section className="relative min-h-screen flex items-center justify-center bg-charcoal overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1661499102718-aebb4886a0bc?w=1800&h=1200&fit=crop&auto=format"
            alt="Tea glass"
            className="w-full h-full object-cover opacity-[0.18]"
          />
          <div className="absolute inset-0 bg-charcoal/65" />
        </div>

        <div className="relative text-center px-6">
          <div className="flex justify-center mb-3">
            <SteamSvg />
          </div>
          <h2 className="font-display font-black text-cream leading-none mb-6"
            style={{ fontSize: 'clamp(2.8rem, 11vw, 95px)' }}>
            KEEP IT<br /><span className="text-red">OLD SCHOOL.</span>
          </h2>
          <p className="text-cream/50 text-lg font-light mb-12 max-w-sm mx-auto leading-relaxed">
            Tea tastes better when the conversation is good.
          </p>
          <button onClick={() => scrollTo('menu')}
            className="bg-red text-white font-black text-xs tracking-[0.25em] uppercase px-12 py-5 hover:bg-red-light transition-all hover:scale-[1.03] active:scale-[0.97] shadow-2xl shadow-red/20">
            ORDER NOW
          </button>
        </div>
      </section>

      {/* ─────────────────────────────────── FOOTER */}
      <footer className="bg-brown-dark py-16">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div className="sm:col-span-2">
              <span className="text-cream/35 text-[10px] tracking-[0.35em] uppercase block mb-1">Old School</span>
              <h3 className="font-display text-3xl font-black text-cream mb-3">Tea Kovai</h3>
              <p className="text-cream/45 text-sm mb-4">Tea · Coffee · Kerala Snacks · Good Vibes</p>
              <p className="text-cream/28 text-xs leading-relaxed">
                Under, Ukkadam Sungam Bypass Road<br />
                Shanmuga Nagar, Coimbatore 641018
              </p>
            </div>
            <div>
              <h4 className="text-cream/30 text-[10px] tracking-[0.32em] uppercase mb-5">Navigate</h4>
              <ul className="space-y-3">
                {[['Menu', 'menu'], ['Story', 'story'], ['Gallery', 'gallery'], ['Order', 'order-cta'], ['Location', 'location']].map(([l, id]) => (
                  <li key={id}>
                    <button onClick={() => scrollTo(id)}
                      className="text-cream/50 hover:text-cream text-sm transition-colors">{l}
                    </button>
                  </li>
                ))}
                <li>
                  <button onClick={onGoToAdmin} className="text-red-light hover:text-cream text-sm transition-colors flex items-center gap-1.5 font-bold cursor-pointer">
                    <span>🔒</span> Admin Portal
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-cream/30 text-[10px] tracking-[0.32em] uppercase mb-5">Contact</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="tel:06383233483" className="text-cream/50 hover:text-cream transition-colors">
                    063832 33483
                  </a>
                </li>
                <li><span className="text-cream/30">Open until 10:30 PM</span></li>
                <li>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                    className="text-cream/50 hover:text-red transition-colors">
                    Instagram ↗
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-cream/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-cream/22 text-xs">© 2024 Old School Tea Kovai. All rights reserved.</p>
            <span className="font-hand text-cream/32 text-xl">Keep it old school ☕</span>
          </div>
        </div>
      </footer>

      {/* ─────────────────────────────────── CART & CHECKOUT DRAWER */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="flex-1 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => {
              if (checkoutStep === 'success') {
                setCheckoutStep('cart')
                setPlacedOrder(null)
              }
              setCartOpen(false)
            }}
          />
          <div className="w-full max-w-md bg-[#FAF6F0] flex flex-col h-full shadow-2xl overflow-hidden relative z-10 animate-slide-in">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-brown/15 bg-white">
              <div className="flex items-center gap-2.5">
                {checkoutStep === 'checkout' && (
                  <button
                    onClick={() => setCheckoutStep('cart')}
                    className="w-8 h-8 rounded-full border border-brown/20 flex items-center justify-center text-charcoal hover:bg-brown/10 transition-colors text-sm font-bold cursor-pointer"
                    title="Back to cart"
                  >
                    ←
                  </button>
                )}
                <div>
                  <h3 className="font-display text-xl font-black text-charcoal">
                    {checkoutStep === 'success' ? 'Order Confirmed!' : checkoutStep === 'checkout' ? 'Checkout & Pay' : 'Your Order'}
                  </h3>
                  {checkoutStep === 'cart' && cartCount > 0 && (
                    <p className="text-charcoal/45 text-xs">{cartCount} item{cartCount !== 1 ? 's' : ''}</p>
                  )}
                  {checkoutStep === 'checkout' && (
                    <p className="text-charcoal/45 text-xs">Enter details & complete payment</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => {
                  if (checkoutStep === 'success') {
                    setCheckoutStep('cart')
                    setPlacedOrder(null)
                  }
                  setCartOpen(false)
                }}
                className="w-8 h-8 rounded-full border border-brown/20 flex items-center justify-center text-charcoal/60 hover:text-charcoal text-lg font-light leading-none transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Content based on step */}
            {checkoutStep === 'success' && placedOrder ? (
              <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-3xl mb-3 animate-bounce">
                  ✓
                </div>
                <span className="text-xs font-bold font-mono tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full mb-2">
                  SENT TO ADMIN & KITCHEN
                </span>
                <h4 className="font-display text-2xl font-black text-charcoal mb-1">
                  Order Placed Successfully!
                </h4>
                <p className="text-xs text-charcoal/60 max-w-xs mb-5">
                  Thank you, <span className="font-semibold text-charcoal">{placedOrder.customer.split(' ')[0]}</span>. Your bill of <span className="font-bold text-charcoal">₹{placedOrder.total}</span> is confirmed via {placedOrder.paymentMethod}.
                </p>

                {/* Order Summary Card */}
                <div className="w-full bg-white border border-[#E8DDD0] rounded-xl p-4 text-left shadow-sm mb-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-[#F0E8DC] pb-2.5">
                    <div>
                      <p className="text-[10px] tracking-widest font-semibold text-charcoal/45 uppercase">Order Token</p>
                      <p className="font-display font-bold text-xl text-[#8B5E3C]">{placedOrder.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] tracking-widest font-semibold text-charcoal/45 uppercase">Live Status</p>
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        {placedOrder.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs border-b border-[#F0E8DC] pb-2.5">
                    <div>
                      <span className="text-charcoal/45 text-[10px] block">CUSTOMER</span>
                      <span className="font-semibold text-charcoal">{placedOrder.customer}</span>
                    </div>
                    <div>
                      <span className="text-charcoal/45 text-[10px] block">MOBILE</span>
                      <span className="font-mono font-semibold text-charcoal">{placedOrder.phone}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <span className="text-charcoal/45 text-[10px] block uppercase tracking-wider">Ordered Items</span>
                    {placedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-charcoal">
                        <span>{item.qty} × {item.name}</span>
                        <span className="font-mono font-bold">₹{item.qty * item.price}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-[#F0E8DC] flex justify-between items-center">
                    <span className="font-bold text-sm text-charcoal">Bill Total Paid</span>
                    <span className="font-display font-black text-lg text-charcoal">₹{placedOrder.total}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="w-full space-y-2.5">
                  <button
                    onClick={() => {
                      setCartOpen(false)
                      onGoToAdmin()
                    }}
                    className="w-full bg-[#1C1A17] text-[#FAF6F0] py-3.5 rounded-lg text-xs font-bold tracking-wider uppercase hover:bg-black transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    <span>👀</span>
                    <span>View Live in Admin Portal</span>
                  </button>

                  <button
                    onClick={() => {
                      setCheckoutStep('cart')
                      setPlacedOrder(null)
                      setCartOpen(false)
                    }}
                    className="w-full bg-transparent border border-brown/25 text-charcoal py-3 rounded-lg text-xs font-bold uppercase hover:bg-brown/5 transition-colors cursor-pointer"
                  >
                    Done / Order Again
                  </button>
                </div>
              </div>
            ) : cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
                <span className="text-5xl mb-4">☕</span>
                <p className="font-display text-xl font-bold text-charcoal mb-2">Cart is empty</p>
                <p className="text-charcoal/42 text-sm mb-8">Add something from the menu to place an order</p>
                <button
                  onClick={() => { setCartOpen(false); scrollTo('menu') }}
                  className="bg-red text-white text-[10px] font-black tracking-[0.22em] uppercase px-8 py-3.5 hover:bg-red-light transition-colors cursor-pointer"
                >
                  BROWSE MENU
                </button>
              </div>
            ) : checkoutStep === 'cart' ? (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
                  {cart.map(({ item, qty }) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#E8DDD0] shadow-xs">
                      <img src={item.img} alt={item.name}
                        className="w-14 h-14 object-cover flex-none rounded-lg bg-cream-dark" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-charcoal text-sm leading-snug truncate">{item.name}</p>
                        <p className="text-charcoal/42 text-xs">₹{item.price} each</p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-none">
                        <button onClick={() => updateQty(item.id, -1)}
                          className="w-7 h-7 border border-brown/28 flex items-center justify-center text-brown hover:bg-charcoal hover:text-cream hover:border-charcoal transition-all text-sm font-bold rounded">
                          −
                        </button>
                        <span className="w-6 text-center font-black text-sm text-charcoal">{qty}</span>
                        <button onClick={() => updateQty(item.id, 1)}
                          className="w-7 h-7 bg-charcoal text-cream flex items-center justify-center hover:bg-red transition-colors text-sm font-bold rounded">
                          +
                        </button>
                      </div>
                      <span className="font-black text-charcoal text-sm w-12 text-right flex-none">
                        ₹{item.price * qty}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Subtotal & Proceed */}
                <div className="px-6 py-5 border-t border-brown/15 bg-white space-y-4 shadow-lg">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs text-charcoal/60">
                      <span>Items ({cartCount})</span>
                      <span className="font-mono">₹{cartTotal}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-charcoal/60">
                      <span>Packaging & Service</span>
                      <span className="font-mono text-emerald-600 font-semibold">FREE</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-brown/10">
                      <span className="font-bold text-charcoal text-base">Total Bill Amount</span>
                      <span className="font-display font-black text-charcoal text-2xl">₹{cartTotal}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setFormError('')
                      setCheckoutStep('checkout')
                    }}
                    className="w-full bg-red text-white text-center font-black text-xs tracking-[0.2em] uppercase py-4 hover:bg-red-light transition-all flex items-center justify-center gap-2 rounded-lg cursor-pointer shadow-lg shadow-red/20 active:scale-[0.99]"
                  >
                    <span>ENTER DETAILS & PAY (₹{cartTotal})</span>
                    <span>→</span>
                  </button>
                </div>
              </>
            ) : (
              /* checkoutStep === 'checkout' */
              <form onSubmit={handlePlaceOrderAndPay} className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                  {/* Order Bill Banner */}
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-amber-800 uppercase tracking-widest">BILL AMOUNT TO PAY</p>
                      <p className="text-xl font-display font-bold text-charcoal mt-0.5">₹{cartTotal}</p>
                    </div>
                    <span className="text-xs bg-amber-200 text-amber-900 px-2 py-1 rounded font-semibold">
                      {cartCount} items
                    </span>
                  </div>

                  {formError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-semibold flex items-center gap-2">
                      <span>⚠️</span>
                      <span>{formError}</span>
                    </div>
                  )}

                  {/* 1. Customer Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1.5">
                      Your Full Name <span className="text-red">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Kumar"
                      value={custName}
                      onChange={e => setCustName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#D5CABC] bg-white text-charcoal text-sm outline-none focus:border-red focus:ring-1 focus:ring-red transition-all"
                    />
                  </div>

                  {/* 2. Customer Phone Number */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1.5">
                      Phone Number <span className="text-red">*</span>
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 border border-r-0 border-[#D5CABC] bg-[#F2E8D5] text-xs font-bold text-charcoal rounded-l-lg">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="9876543210"
                        value={custPhone}
                        onChange={e => setCustPhone(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-3.5 py-2.5 rounded-r-lg border border-[#D5CABC] bg-white text-charcoal text-sm outline-none focus:border-red focus:ring-1 focus:ring-red font-mono transition-all"
                      />
                    </div>
                    <p className="text-[11px] text-charcoal/45 mt-1">Order status updates will be sent to this number.</p>
                  </div>

                  {/* 3. Dining Type */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1.5">
                      Order Preference
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Dine-in', 'Takeaway', 'Delivery'] as const).map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setOrderType(type)}
                          className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer text-center ${
                            orderType === type
                              ? 'bg-[#1C1A17] text-white border-[#1C1A17] shadow-sm'
                              : 'bg-white text-charcoal border-[#D5CABC] hover:bg-[#F2E8D5]'
                          }`}
                        >
                          {type === 'Dine-in' ? '🪑 Dine-in' : type === 'Takeaway' ? '🛍 Takeaway' : '🛵 Delivery'}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder={orderType === 'Dine-in' ? 'Table number (e.g. Table 4)' : orderType === 'Takeaway' ? 'Packaging note (optional)' : 'Delivery address (nearby)'}
                      value={tableOrAddress}
                      onChange={e => setTableOrAddress(e.target.value)}
                      className="w-full mt-2 px-3 py-2 rounded-lg border border-[#D5CABC] bg-white text-charcoal text-xs outline-none focus:border-red"
                    />
                  </div>

                  {/* 4. Payment Method */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1.5">
                      Pay Bill Amount (₹{cartTotal})
                    </label>
                    <div className="space-y-2">
                      {[
                        { id: 'UPI (GPay/PhonePe)', label: '⚡ Instant UPI (GPay / PhonePe / Paytm)', desc: 'Pay instantly via QR or UPI ID: oldschooltea@okaxis' },
                        { id: 'Cash at Counter', label: '💵 Cash at Counter / Pay on Delivery', desc: 'Pay with physical cash upon order pickup/serving' },
                        { id: 'Debit/Credit Card', label: '💳 Debit / Credit Card', desc: 'Visa, MasterCard, RuPay accepted' },
                      ].map(method => (
                        <div
                          key={method.id}
                          onClick={() => setPaymentMethod(method.id as any)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer ${
                            paymentMethod === method.id
                              ? 'border-[#8B5E3C] bg-white shadow-sm ring-1 ring-[#8B5E3C]'
                              : 'border-[#D5CABC] bg-white/70 hover:bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-charcoal">{method.label}</span>
                            <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              paymentMethod === method.id ? 'border-[#8B5E3C] bg-[#8B5E3C]' : 'border-gray-300'
                            }`}>
                              {paymentMethod === method.id && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </span>
                          </div>
                          <p className="text-[11px] text-charcoal/50 mt-1">{method.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* UPI QR Display if UPI is selected */}
                  {paymentMethod === 'UPI (GPay/PhonePe)' && (
                    <div className="bg-white border border-[#D5CABC] rounded-xl p-3.5 text-center space-y-2">
                      <p className="text-xs font-bold text-charcoal">Scan with any UPI App to Pay ₹{cartTotal}</p>
                      <div className="inline-block p-2 bg-white border border-gray-200 rounded-lg shadow-xs">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=upi://pay?pa=oldschooltea@okaxis&pn=Old%20School%20Tea&am=${cartTotal}&cu=INR`}
                          alt="UPI QR Code"
                          className="w-28 h-28 mx-auto"
                        />
                      </div>
                      <p className="text-[11px] font-mono text-charcoal/60">UPI ID: <strong className="text-charcoal">oldschooltea@okaxis</strong></p>
                      <span className="inline-block text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
                        ✓ Verified Merchant: Old School Tea Kovai
                      </span>
                    </div>
                  )}
                </div>

                {/* Bottom Submit Button */}
                <div className="px-6 py-4 border-t border-brown/15 bg-white shadow-lg space-y-2">
                  <button
                    type="submit"
                    disabled={isProcessingPayment}
                    className="w-full bg-red text-white py-4 rounded-lg text-xs font-black tracking-[0.2em] uppercase hover:bg-red-light transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-red/20 active:scale-[0.99] disabled:opacity-75 disabled:cursor-wait"
                  >
                    {isProcessingPayment ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>PROCESSING & SENDING TO ADMIN...</span>
                      </>
                    ) : (
                      <>
                        <span>PAY ₹{cartTotal} & PLACE ORDER</span>
                        <span>➔</span>
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-charcoal/40 text-center">
                    🔒 Order details will instantly transmit to Old School Tea Admin Desk.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────── FLOATING ADMIN ACCESS */}
      <button
        onClick={onGoToAdmin}
        className="fixed bottom-20 md:bottom-6 left-5 z-40 bg-charcoal/90 hover:bg-charcoal text-cream/90 hover:text-cream border border-cream/25 hover:border-cream/70 rounded-full px-3.5 py-2 text-xs font-semibold shadow-2xl flex items-center gap-2 backdrop-blur-md transition-all hover:scale-105 active:scale-95 group cursor-pointer"
        title="Open Café Admin Dashboard"
      >
        <span className="w-2 h-2 rounded-full bg-amber-400 group-hover:bg-amber-300 animate-pulse"></span>
        <span className="tracking-wider text-[11px] uppercase font-bold text-cream">Admin Portal</span>
        <span className="text-[11px] text-cream/40 group-hover:text-cream/80">🔒</span>
      </button>

      {/* ─────────────────────────────────── MOBILE BOTTOM NAV */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-charcoal border-t border-white/8">
        <div className="grid grid-cols-4 h-16">
          {[
            { label: 'Home', icon: '⌂', fn: () => window.scrollTo({ top: 0, behavior: 'smooth' }), badge: 0 },
            { label: 'Menu', icon: '☕', fn: () => scrollTo('menu'), badge: 0 },
            { label: 'Cart', icon: '🛒', fn: () => setCartOpen(true), badge: cartCount },
            { label: 'Location', icon: '📍', fn: () => scrollTo('location'), badge: 0 },
          ].map(({ label, icon, fn, badge }) => (
            <button key={label} onClick={fn}
              className="flex flex-col items-center justify-center gap-0.5 relative hover:bg-white/5 active:bg-white/10 transition-colors">
              <span className="text-lg leading-none">{icon}</span>
              <span className="text-cream/50 text-[10px] tracking-wide">{label}</span>
              {badge > 0 && (
                <span className="absolute top-2 right-1/4 bg-red text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black leading-none">
                  {badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

    </div>
  )
}

// ── Root App Component ────────────────────────────────────────────────────────

const getInitialView = (): 'website' | 'admin' => {
  if (typeof window === 'undefined') return 'website'
  const hash = window.location.hash.toLowerCase()
  const search = window.location.search.toLowerCase()
  return (hash.includes('admin') || search.includes('admin')) ? 'admin' : 'website'
}

export default function App() {
  const [view, setView] = useState<'website' | 'admin'>(getInitialView)

  useEffect(() => {
    const handleRoute = () => {
      const hash = window.location.hash.toLowerCase()
      const search = window.location.search.toLowerCase()
      if (hash.includes('admin') || search.includes('admin')) {
        setView('admin')
      } else {
        setView('website')
      }
    }
    handleRoute()
    window.addEventListener('hashchange', handleRoute)
    window.addEventListener('popstate', handleRoute)
    return () => {
      window.removeEventListener('hashchange', handleRoute)
      window.removeEventListener('popstate', handleRoute)
    }
  }, [])

  const goToAdmin = () => {
    window.location.hash = 'admin'
    setView('admin')
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }

  const goToWebsite = () => {
    if (window.location.hash.includes('admin')) {
      window.history.pushState(null, '', window.location.pathname)
    }
    setView('website')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (view === 'admin') {
    return <AdminApp onBackToWebsite={goToWebsite} />
  }

  return <CafeWebsite onGoToAdmin={goToAdmin} />
}
