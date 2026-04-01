import { format, subDays, subMonths, startOfMonth, addDays } from 'date-fns';

const CATEGORIES = {
  salary: { name: 'Salary', color: '#22c55e', type: 'income' },
  freelance: { name: 'Freelance', color: '#3b82f6', type: 'income' },
  investment: { name: 'Investments', color: '#8b5cf6', type: 'income' },
  refund: { name: 'Refund', color: '#06b6d4', type: 'income' },
  food: { name: 'Food & Dining', color: '#f97316', type: 'expense' },
  transport: { name: 'Transport', color: '#eab308', type: 'expense' },
  shopping: { name: 'Shopping', color: '#ec4899', type: 'expense' },
  bills: { name: 'Bills & Utilities', color: '#ef4444', type: 'expense' },
  entertainment: { name: 'Entertainment', color: '#a855f7', type: 'expense' },
  health: { name: 'Healthcare', color: '#14b8a6', type: 'expense' },
  education: { name: 'Education', color: '#6366f1', type: 'expense' },
  rent: { name: 'Rent', color: '#f43f5e', type: 'expense' },
};

export const categoryList = Object.entries(CATEGORIES).map(([key, val]) => ({
  id: key,
  ...val,
}));

export const getCategoryInfo = (id) => CATEGORIES[id] || { name: id, color: '#6b7280', type: 'expense' };

// Generate realistic mock transactions
function generateTransactions() {
  const now = new Date();
  const txns = [];
  let id = 1;

  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const incomeDescs = {
    salary: ['Monthly Salary', 'Salary Credit', 'Payroll Deposit'],
    freelance: ['Client Payment - Web Design', 'Freelance Project', 'Contract Work', 'Design Consultation'],
    investment: ['Dividend Income', 'Stock Returns', 'Mutual Fund Payout'],
    refund: ['Amazon Refund', 'Purchase Return', 'Cashback Reward'],
  };

  const expenseDescs = {
    food: ['Grocery Store', 'Restaurant Dinner', 'Coffee Shop', 'Food Delivery', 'Lunch at Cafe'],
    transport: ['Uber Ride', 'Metro Card Recharge', 'Fuel Station', 'Cab to Airport', 'Bus Pass'],
    shopping: ['Amazon Purchase', 'Online Shopping', 'Clothing Store', 'Electronics', 'Home Decor'],
    bills: ['Electricity Bill', 'Internet Bill', 'Phone Recharge', 'Water Bill', 'Gas Bill'],
    entertainment: ['Netflix Subscription', 'Movie Tickets', 'Spotify Premium', 'Gaming Purchase', 'Concert Tickets'],
    health: ['Pharmacy', 'Doctor Visit', 'Lab Tests', 'Gym Membership', 'Health Insurance'],
    education: ['Online Course', 'Book Purchase', 'Udemy Subscription', 'Workshop Fee'],
    rent: ['Monthly Rent', 'Rent Payment'],
  };

  // Generate across last 6 months
  for (let m = 0; m < 6; m++) {
    const monthStart = startOfMonth(subMonths(now, m));

    // 1-2 salary entries per month
    if (m > 0 || now.getDate() >= 1) {
      txns.push({
        id: id++,
        date: format(addDays(monthStart, rand(0, 2)), 'yyyy-MM-dd'),
        amount: rand(45000, 55000),
        category: 'salary',
        type: 'income',
        description: pick(incomeDescs.salary),
      });
    }

    // Some freelance income
    if (rand(0, 10) > 4) {
      txns.push({
        id: id++,
        date: format(addDays(monthStart, rand(5, 25)), 'yyyy-MM-dd'),
        amount: rand(5000, 25000),
        category: 'freelance',
        type: 'income',
        description: pick(incomeDescs.freelance),
      });
    }

    // Investment returns (occasional)
    if (rand(0, 10) > 6) {
      txns.push({
        id: id++,
        date: format(addDays(monthStart, rand(10, 28)), 'yyyy-MM-dd'),
        amount: rand(2000, 10000),
        category: 'investment',
        type: 'income',
        description: pick(incomeDescs.investment),
      });
    }

    // Monthly rent
    txns.push({
      id: id++,
      date: format(addDays(monthStart, rand(1, 5)), 'yyyy-MM-dd'),
      amount: rand(12000, 18000),
      category: 'rent',
      type: 'expense',
      description: pick(expenseDescs.rent),
    });

    // 3-6 food expenses
    for (let i = 0; i < rand(3, 6); i++) {
      txns.push({
        id: id++,
        date: format(addDays(monthStart, rand(0, 27)), 'yyyy-MM-dd'),
        amount: rand(150, 3500),
        category: 'food',
        type: 'expense',
        description: pick(expenseDescs.food),
      });
    }

    // Other expenses
    const otherCategories = ['transport', 'shopping', 'bills', 'entertainment', 'health', 'education'];
    for (const cat of otherCategories) {
      const count = cat === 'bills' ? rand(1, 3) : rand(0, 2);
      for (let i = 0; i < count; i++) {
        txns.push({
          id: id++,
          date: format(addDays(monthStart, rand(0, 27)), 'yyyy-MM-dd'),
          amount: rand(200, 8000),
          category: cat,
          type: 'expense',
          description: pick(expenseDescs[cat]),
        });
      }
    }
  }

  // Sort by date descending
  return txns.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export const mockTransactions = generateTransactions();
