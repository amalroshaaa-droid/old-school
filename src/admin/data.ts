import type { Order, MenuItem, Customer, Review } from './types';

// History has been cleared: initial orders start fresh from now
export const initialOrders: Order[] = [];

// Helper to seed fresh live orders timestamped for RIGHT NOW
export const createOrdersForNow = (): Order[] => {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const formatTime = (minusMinutes: number) => {
    const d = new Date(now.getTime() - minusMinutes * 60 * 1000);
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
  };
  const getTs = (minusMinutes: number) => now.getTime() - minusMinutes * 60 * 1000;

  return [
    {
      id: '#1003',
      customer: 'Rahul (Dine-in: Table 4)',
      phone: '9876543210',
      time: formatTime(2),
      timestamp: getTs(2),
      items: [{ name: 'Old School Tea', qty: 2, price: 20 }, { name: 'Vada', qty: 1, price: 40 }],
      total: 80,
      status: 'NEW',
      date: dateStr,
      paymentMethod: 'UPI / QR',
      paymentStatus: 'PAID',
    },
    {
      id: '#1002',
      customer: 'Priya (Takeaway)',
      phone: '9988776655',
      time: formatTime(9),
      timestamp: getTs(9),
      items: [{ name: 'Masala Chai', qty: 2, price: 25 }, { name: 'Bun Butter', qty: 1, price: 20 }],
      total: 70,
      status: 'PREPARING',
      date: dateStr,
      paymentMethod: 'Google Pay',
      paymentStatus: 'PAID',
    },
    {
      id: '#1001',
      customer: 'Arjun (Dine-in: Table 2)',
      phone: '9845671234',
      time: formatTime(22),
      timestamp: getTs(22),
      items: [{ name: 'Filter Coffee', qty: 1, price: 30 }, { name: 'Samosa', qty: 2, price: 30 }],
      total: 90,
      status: 'COMPLETED',
      date: dateStr,
      paymentMethod: 'Cash at Counter',
      paymentStatus: 'CASH',
    },
  ];
};

export const initialMenuItems: MenuItem[] = [
  { id: 't1', name: 'Old School Tea', category: 'Tea', price: 15, stock: 50, image: 'https://images.unsplash.com/photo-1661499102718-aebb4886a0bc?w=500&h=500&fit=crop&auto=format', available: true, description: 'Rich, flavorful — brewed the old-school way with fresh ginger and crushed cardamom.' },
  { id: 't2', name: 'Masala Chai', category: 'Tea', price: 20, stock: 45, image: 'https://images.unsplash.com/photo-1720875733075-fd8494df7908?w=500&h=500&fit=crop&auto=format', available: true, description: 'Cardamom, ginger & cinnamon in every sip. Kovai evening favorite.' },
  { id: 't3', name: 'Ginger Tea', category: 'Tea', price: 20, stock: 40, image: 'https://images.unsplash.com/photo-1583836632332-53825ce55a03?w=500&h=500&fit=crop&auto=format', available: true, description: 'Fresh ginger, brewed strong and honest.' },
  { id: 't4', name: 'Lemon Tea', category: 'Tea', price: 18, stock: 35, image: 'https://images.unsplash.com/photo-1646294567230-b56cb0cd1f5b?w=500&h=500&fit=crop&auto=format', available: true, description: 'Light, citrusy, refreshingly simple.' },
  { id: 'c1', name: 'Filter Coffee', category: 'Coffee', price: 25, stock: 50, image: 'https://images.unsplash.com/photo-1729277133095-bff46b56c29a?w=500&h=500&fit=crop&auto=format', available: true, description: 'South Indian decoction with frothed hot milk, the real way.' },
  { id: 'c2', name: 'Black Coffee', category: 'Coffee', price: 20, stock: 30, image: 'https://images.unsplash.com/photo-1729277133101-54990c9c2ae7?w=500&h=500&fit=crop&auto=format', available: true, description: 'No nonsense. Just strong, pure roasted coffee.' },
  { id: 'c3', name: 'Milk Coffee', category: 'Coffee', price: 30, stock: 35, image: 'https://images.unsplash.com/photo-1605513892508-cfd73a5945f8?w=500&h=500&fit=crop&auto=format', available: true, description: 'Smooth brew with creamy steamed milk.' },
  { id: 'cd1', name: 'Lemon Soda', category: 'Cool Drinks', price: 25, stock: 40, image: 'https://images.unsplash.com/photo-1646294567230-b56cb0cd1f5b?w=500&h=500&fit=crop&auto=format', available: true, description: 'Chilled, fizzy and honestly fresh.' },
  { id: 'cd2', name: 'Nannari Sarbath', category: 'Cool Drinks', price: 30, stock: 30, image: 'https://images.unsplash.com/photo-1583836632332-53825ce55a03?w=500&h=500&fit=crop&auto=format', available: true, description: 'Traditional herbal root extract drink, served chilled over crushed ice.' },
  { id: 'cd3', name: 'Salted Lassi', category: 'Cool Drinks', price: 35, stock: 25, image: 'https://images.unsplash.com/photo-1661499102718-aebb4886a0bc?w=500&h=500&fit=crop&auto=format', available: true, description: 'Thick, cold curd churned with cumin and mint.' },
  { id: 'ks1', name: 'Pazham Pori', category: 'Kerala Snacks', price: 15, stock: 30, image: 'https://images.unsplash.com/photo-1613764816537-a43baeb559c1?w=500&h=500&fit=crop&auto=format', available: true, description: 'Golden ripe banana fritters — sweet, crispy Kerala classic.' },
  { id: 'ks2', name: 'Parippu Vada', category: 'Kerala Snacks', price: 20, stock: 35, image: 'https://images.unsplash.com/photo-1596450512748-2dae774fc38a?w=500&h=500&fit=crop&auto=format', available: true, description: 'Crispy lentil fritters made for hot tea time.' },
  { id: 'ks3', name: 'Samosa', category: 'Kerala Snacks', price: 15, stock: 40, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&h=500&fit=crop&auto=format', available: true, description: 'Crispy pastry with seasoned spiced potato filling.' },
  { id: 'ks4', name: 'Uzhunnu Vada', category: 'Kerala Snacks', price: 20, stock: 30, image: 'https://images.unsplash.com/photo-1605333409672-4f7db57ba3a2?w=500&h=500&fit=crop&auto=format', available: true, description: 'Fluffy inside, crispy outside medu vada.' },
  { id: 'f1', name: 'Egg Puff', category: 'Food', price: 20, stock: 25, image: 'https://images.unsplash.com/photo-1621334721541-370a13974de8?w=500&h=500&fit=crop&auto=format', available: true, description: 'Flaky baked pastry with seasoned spiced egg filling.' },
  { id: 'f2', name: 'Veg Puff', category: 'Food', price: 15, stock: 30, image: 'https://images.unsplash.com/photo-1613764816537-a43baeb559c1?w=500&h=500&fit=crop&auto=format', available: true, description: 'Buttery pastry stuffed with mildly spiced vegetable masala.' },
  { id: 'f3', name: 'Bread Omelette', category: 'Food', price: 35, stock: 20, image: 'https://images.unsplash.com/photo-1683533698971-dcc5e19cb0f1?w=500&h=500&fit=crop&auto=format', available: true, description: 'Toasted bread with fluffy spiced double-egg omelette.' },
];

// All customer history starts completely fresh from now
export const initialCustomers: Customer[] = [];

// Fresh reviews start clean or with customer submitted reviews
export const initialReviews: Review[] = [
  { id: 'r1', customer: 'Karthik R.', rating: 5, text: 'The masala chai here hits different — thick, milky, spiced just right. Nothing comes close in Kovai.', date: '27 Sep 2026', time: '10:30 AM', status: 'APPROVED' },
  { id: 'r2', customer: 'Priya M.', rating: 5, text: 'Came for one cup, stayed two hours. The Pazham Pori with ginger tea is genuinely life-changing.', date: '27 Sep 2026', time: '11:15 AM', status: 'APPROVED' },
  { id: 'r3', customer: 'Divya K.', rating: 5, text: 'Their filter coffee is exactly what South Indian filter coffee should taste like. Strong, milky, perfect.', date: '27 Sep 2026', time: '11:45 AM', status: 'APPROVED' },
];

// Compute hourly sales dynamically from orders placed today
export const computeHourlySales = (orders: Order[]) => {
  const hoursMap: Record<string, { sales: number; orders: number }> = {
    '8 AM': { sales: 0, orders: 0 },
    '9 AM': { sales: 0, orders: 0 },
    '10 AM': { sales: 0, orders: 0 },
    '11 AM': { sales: 0, orders: 0 },
    '12 PM': { sales: 0, orders: 0 },
    '1 PM': { sales: 0, orders: 0 },
    '2 PM': { sales: 0, orders: 0 },
    '3 PM': { sales: 0, orders: 0 },
    '4 PM': { sales: 0, orders: 0 },
    '5 PM': { sales: 0, orders: 0 },
    '6 PM': { sales: 0, orders: 0 },
    '7 PM': { sales: 0, orders: 0 },
    '8 PM': { sales: 0, orders: 0 },
    '9 PM': { sales: 0, orders: 0 },
    '10 PM': { sales: 0, orders: 0 },
  };

  const todayStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  orders.forEach(o => {
    // Check if order is from today
    const isToday = !o.date || o.date === todayStr || new Date(o.timestamp || 0).toDateString() === new Date().toDateString();
    if (!isToday) return;

    let hourKey = '';
    if (o.timestamp) {
      const d = new Date(o.timestamp);
      let h = d.getHours();
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12 || 12;
      hourKey = `${h} ${ampm}`;
    } else if (o.time) {
      const parts = o.time.split(':');
      if (parts.length >= 2) {
        let h = parseInt(parts[0], 10);
        const isPM = o.time.toUpperCase().includes('PM');
        if (isPM && h < 12) h += 12;
        const displayH = h % 12 || 12;
        const ampm = h >= 12 ? 'PM' : 'AM';
        hourKey = `${displayH} ${ampm}`;
      }
    }

    if (hourKey && hoursMap[hourKey]) {
      hoursMap[hourKey].sales += o.total;
      hoursMap[hourKey].orders += 1;
    }
  });

  return Object.entries(hoursMap).map(([time, data]) => ({
    time,
    sales: data.sales,
    orders: data.orders,
  }));
};

// Compute monthly sales dynamically from active orders
export const computeMonthlySales = (orders: Order[]) => {
  const currentMonthName = new Date().toLocaleDateString('en-US', { month: 'short' });
  const totalSales = orders.reduce((s, o) => s + o.total, 0);
  const totalOrders = orders.length;
  const avg = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;

  return [
    { month: currentMonthName, orders: totalOrders, sales: totalSales, avg },
  ];
};

// Compute best sellers dynamically from actual items ordered
export const computeBestSellers = (orders: Order[]) => {
  const itemMap: Record<string, { orders: number; sales: number }> = {};

  orders.forEach(o => {
    o.items?.forEach(item => {
      if (!itemMap[item.name]) {
        itemMap[item.name] = { orders: 0, sales: 0 };
      }
      itemMap[item.name].orders += item.qty;
      itemMap[item.name].sales += item.qty * item.price;
    });
  });

  const list = Object.entries(itemMap).map(([name, data]) => ({
    name,
    orders: data.orders,
    sales: data.sales,
  }));

  list.sort((a, b) => b.sales - a.sales);
  return list;
};
