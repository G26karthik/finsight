import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useTransactions } from '../../context/TransactionContext';
import { formatCurrency } from '../../utils/helpers';
import './SummaryCards.css';

export default function SummaryCards() {
  const { transactions } = useTransactions();

  const stats = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expenses;

    // Calculate month-over-month changes
    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const lastDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonth = `${lastDate.getFullYear()}-${String(lastDate.getMonth() + 1).padStart(2, '0')}`;

    const thisMonthIncome = transactions
      .filter((t) => t.type === 'income' && t.date.startsWith(thisMonth))
      .reduce((s, t) => s + t.amount, 0);
    const lastMonthIncome = transactions
      .filter((t) => t.type === 'income' && t.date.startsWith(lastMonth))
      .reduce((s, t) => s + t.amount, 0);

    const thisMonthExpense = transactions
      .filter((t) => t.type === 'expense' && t.date.startsWith(thisMonth))
      .reduce((s, t) => s + t.amount, 0);
    const lastMonthExpense = transactions
      .filter((t) => t.type === 'expense' && t.date.startsWith(lastMonth))
      .reduce((s, t) => s + t.amount, 0);

    const incomeChange = lastMonthIncome ? ((thisMonthIncome - lastMonthIncome) / lastMonthIncome) * 100 : 0;
    const expenseChange = lastMonthExpense ? ((thisMonthExpense - lastMonthExpense) / lastMonthExpense) * 100 : 0;

    return { balance, income, expenses, incomeChange, expenseChange };
  }, [transactions]);

  const cards = [
    {
      title: 'Total Balance',
      value: stats.balance,
      icon: Wallet,
      accent: 'blue',
      change: null,
    },
    {
      title: 'Total Income',
      value: stats.income,
      icon: TrendingUp,
      accent: 'green',
      change: stats.incomeChange,
    },
    {
      title: 'Total Expenses',
      value: stats.expenses,
      icon: TrendingDown,
      accent: 'red',
      change: stats.expenseChange,
    },
  ];

  return (
    <div className="summary-cards">
      {cards.map((card, i) => (
        <motion.div
          key={card.title}
          className={`summary-card summary-card--${card.accent}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, type: 'spring', stiffness: 300, damping: 25 }}
        >
          <div className="summary-card__header">
            <span className="summary-card__label">{card.title}</span>
            <div className={`summary-card__icon summary-card__icon--${card.accent}`}>
              <card.icon size={18} />
            </div>
          </div>
          <div className="summary-card__value mono">{formatCurrency(card.value)}</div>
          {card.change !== null && (
            <div className={`summary-card__change ${card.change >= 0 ? 'text-green' : 'text-red'}`}>
              {card.change >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              <span>{Math.abs(card.change).toFixed(1)}% vs last month</span>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}

