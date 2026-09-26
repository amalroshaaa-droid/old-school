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
  { id: 'm1', name: 'Old School Tea', category: 'Tea', price: 20, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=280&fit=crop&auto=format', available: true, description: 'Classic South Indian tea brewed with fresh ginger and cardamom. Our signature brew since day one.' },
  { id: 'm2', name: 'Masala Chai', category: 'Tea', price: 25, image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=280&fit=crop&auto=format', available: true, description: 'Rich masala tea with aromatic whole spices — cinnamon, cloves, and star anise.' },
  { id: 'm3', name: 'Filter Coffee', category: 'Coffee', price: 30, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=280&fit=crop&auto=format', available: true, description: 'Traditional South Indian filter coffee with perfectly frothed milk poured from a height.' },
  { id: 'm4', name: 'Vada', category: 'Snacks', price: 40, image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=280&fit=crop&auto=format', available: true, description: 'Crispy medu vada served hot with fresh sambar and coconut chutney.' },
  { id: 'm5', name: 'Samosa', category: 'Snacks', price: 30, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=280&fit=crop&auto=format', available: true, description: 'Flaky golden pastry filled with spiced potatoes, peas, and fresh herbs.' },
  { id: 'm6', name: 'Bun Butter', category: 'Snacks', price: 20, image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc7c?w=400&h=280&fit=crop&auto=format', available: true, description: 'Soft pillowy bun with generous salted butter. A Kovai morning classic.' },
  { id: 'm7', name: 'Elaichi Tea', category: 'Tea', price: 25, image: 'https://images.unsplash.com/photo-1564890369478-c89ca3d37502?w=400&h=280&fit=crop&auto=format', available: false, description: 'Delicate cardamom-infused tea — light, fragrant, and soothing.' },
  { id: 'm8', name: 'Pongal', category: 'Snacks', price: 50, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=280&fit=crop&auto=format', available: true, description: 'Traditional ven pongal with generous ghee, black pepper, and cumin tempering.' },
];

export const initialCustomers: Customer[] = [
  { id: 'c1', name: 'Rahul', phone: '9876543210', orders: 0, totalSpent: 0, lastOrder: '—', lastOrderTime: '—' },
  { id: 'c2', name: 'Arjun', phone: '9845671234', orders: 0, totalSpent: 0, lastOrder: '—', lastOrderTime: '—' },
  { id: 'c3', name: 'Priya', phone: '9988776655', orders: 0, totalSpent: 0, lastOrder: '—', lastOrderTime: '—' },
  { id: 'c4', name: 'Meena', phone: '9654321098', orders: 0, totalSpent: 0, lastOrder: '—', lastOrderTime: '—' },
  { id: 'c5', name: 'Kumar', phone: '9765432109', orders: 0, totalSpent: 0, lastOrder: '—', lastOrderTime: '—' },
  { id: 'c6', name: 'Divya', phone: '9543210987', orders: 0, totalSpent: 0, lastOrder: '—', lastOrderTime: '—' },
  { id: 'c7', name: 'Venkat', phone: '9432109876', orders: 0, totalSpent: 0, lastOrder: '—', lastOrderTime: '—' },
  { id: 'c8', name: 'Lakshmi', phone: '9321098765', orders: 0, totalSpent: 0, lastOrder: '—', lastOrderTime: '—' },
  { id: 'c9', name: 'Suresh', phone: '9210987654', orders: 0, totalSpent: 0, lastOrder: '—', lastOrderTime: '—' },
  { id: 'c10', name: 'Kavitha', phone: '9109876543', orders: 0, totalSpent: 0, lastOrder: '—', lastOrderTime: '—' },
];

export const initialReviews: Review[] = [
  { id: 'r1', customer: 'Priya', rating: 5, text: 'Best tea in Kovai! The Old School Tea is exactly how my grandmother used to make it. I visit every single morning now.', date: '24 Sep 2026', status: 'APPROVED' },
  { id: 'r2', customer: 'Rahul', rating: 5, text: 'Filter coffee is absolutely authentic. The vada is crispy and fresh every single time. This place takes me back to my roots.', date: '23 Sep 2026', status: 'APPROVED' },
  { id: 'r3', customer: 'Meena', rating: 4, text: 'Lovely warm atmosphere and great tea. The masala chai could be a bit stronger but overall a wonderful experience.', date: '22 Sep 2026', status: 'APPROVED' },
  { id: 'r4', customer: 'Arjun', rating: 5, text: 'Discovered this place last week and already a regular! The pongal with filter coffee in the morning is simply divine.', date: '21 Sep 2026', status: 'PENDING' },
  { id: 'r5', customer: 'Kumar', rating: 3, text: 'Good tea but the waiting time was quite long on weekends. Staff were friendly though.', date: '20 Sep 2026', status: 'PENDING' },
  { id: 'r6', customer: 'Venkat', rating: 2, text: 'Not as good as it used to be. The samosa was cold when it arrived.', date: '18 Sep 2026', status: 'HIDDEN' },
];

export const hourlySales = [
  { time: '10 AM', sales: 430, orders: 5 },
  { time: '11 AM', sales: 580, orders: 7 },
  { time: '12 PM', sales: 890, orders: 10 },
  { time: '1 PM', sales: 750, orders: 8 },
  { time: '2 PM', sales: 620, orders: 7 },
  { time: '3 PM', sales: 840, orders: 9 },
  { time: '4 PM', sales: 1120, orders: 11 },
  { time: '5 PM', sales: 1380, orders: 14 },
  { time: '6 PM', sales: 680, orders: 7 },
  { time: '7 PM', sales: 420, orders: 5 },
  { time: '8 PM', sales: 280, orders: 3 },
];

export const monthlySales = [
  { month: 'Jan', orders: 1240, sales: 96800, avg: 78 },
  { month: 'Feb', orders: 1180, sales: 91800, avg: 78 },
  { month: 'Mar', orders: 1420, sales: 112000, avg: 79 },
  { month: 'Apr', orders: 1560, sales: 122400, avg: 78 },
  { month: 'May', orders: 1380, sales: 108600, avg: 79 },
  { month: 'Jun', orders: 1620, sales: 128400, avg: 79 },
  { month: 'Jul', orders: 1740, sales: 138200, avg: 79 },
  { month: 'Aug', orders: 1820, sales: 144600, avg: 79 },
  { month: 'Sep', orders: 1260, sales: 98400, avg: 78 },
];

export const bestSellers = [
  { name: 'Old School Tea', orders: 842, sales: 16840 },
  { name: 'Filter Coffee', orders: 624, sales: 18720 },
  { name: 'Masala Chai', orders: 518, sales: 12950 },
  { name: 'Vada', orders: 412, sales: 16480 },
  { name: 'Samosa', orders: 368, sales: 11040 },
];
