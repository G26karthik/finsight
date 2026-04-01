import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, ArrowUpRight, PieChart, Hash, Zap } from 'lucide-react';
import { useTransactions } from '../../context/TransactionContext';
import { getCategoryInfo } from '../../data/mockData';
import { formatCurrency, formatMonth } from '../../utils/helpers';
import EmptyState from '../common/EmptyState';
import { subMonths, format } from 'date-fns';
import './InsightsPanel.css';

export default function InsightsPanel() {
  const { transactions } = useTransactions();

  const insights = useMemo(() => {
    if (!transactions.length) return null;

    const expenses = transactions.filter((t) => t.type === 'expense');
    const incomes = transactions.filter((t) => t.type === 'income');

    // Highest spending category
    const catTotals = {};
    expenses.forEach((t) => {
      catTotals[t.category] = (catTotals[t.category] || 0) + t.amount;
    });
    const topCatEntry = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0];
    const topCategory = topCatEntry ? { id: topCatEntry[0], ...getCategoryInfo(topCatEntry[0]), total: topCatEntry[1] } : null;

    // Total expense
    const totalExpense = expenses.reduce((s, t) => s + t.amount, 0);
    const totalIncome = incomes.reduce((s, t) => s + t.amount, 0);

    // Average transaction
    const avgExpense = expenses.length ? totalExpense / expenses.length : 0;
    const avgIncome = incomes.length ? totalIncome / incomes.length : 0;

    // Monthly comparison data
    const now = new Date();
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const d = subMonths(now, i);
      const key = format(d, 'yyyy-MM');
      const label = format(d, 'MMM');
      const mIncome = transactions
        .filter((t) => t.type === 'income' && t.date.startsWith(key))
        .reduce((s, t) => s + t.amount, 0);
      const mExpense = transactions
        .filter((t) => t.type === 'expense' && t.date.startsWith(key))
        .reduce((s, t) => s + t.amount, 0);
      monthlyData.push({ month: label, Income: mIncome, Expense: mExpense });
    }

    // Month-over-month spending change
    const thisMonthKey = format(now, 'yyyy-MM');
    const lastMonthKey = format(subMonths(now, 1), 'yyyy-MM');
    const thisMonthSpend = expenses.filter((t) => t.date.startsWith(thisMonthKey)).reduce((s, t) => s + t.amount, 0);
    const lastMonthSpend = expenses.filter((t) => t.date.startsWith(lastMonthKey)).reduce((s, t) => s + t.amount, 0);
    const spendChange = lastMonthSpend ? ((thisMonthSpend - lastMonthSpend) / lastMonthSpend) * 100 : 0;

    // Top 5 categories for bar chart
    const topCategories = Object.entries(catTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([key, val]) => ({
        name: getCategoryInfo(key).name,
        amount: val,
        color: getCategoryInfo(key).color,
        percent: ((val / totalExpense) * 100).toFixed(1),
      }));

    return {
      totalTransactions: transactions.length,
      totalIncome,
      totalExpense,
      topCategory,
      avgExpense,
      avgIncome,
      monthlyData,
      spendChange,
      thisMonthSpend,
      topCategories,
      savingsRate: totalIncome ? (((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1) : 0,
    };
  }, [transactions]);

  if (!insights) {
    return <EmptyState title="No data available" message="Add some transactions to see insights." />;
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-primary)',
        borderRadius: 'var(--radius-lg)',
        padding: '10px 14px',
        boxShadow: 'var(--shadow-lg)',
        fontSize: '0.813rem',
      }}>
        <p style={{ fontWeight: 600, marginBottom: 4 }}>{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.fill || p.color, margin: '2px 0' }}>
            {p.name}: {formatCurrency(p.value)}
          </p>
        ))}
      </div>
    );
  };

  const statCards = [
    {
      label: 'Total Transactions',
      value: insights.totalTransactions,
      icon: Hash,
      accent: 'blue',
      format: false,
    },
    {
      label: 'Highest Category',
      value: insights.topCategory?.name || '-',
      sub: insights.topCategory ? formatCurrency(insights.topCategory.total) : '',
      icon: Zap,
      accent: 'amber',
      format: false,
    },
    {
      label: 'Avg. Expense',
      value: formatCurrency(insights.avgExpense),
      icon: DollarSign,
      accent: 'red',
      format: false,
    },
    {
      label: 'Savings Rate',
      value: `${insights.savingsRate}%`,
      icon: PieChart,
      accent: 'green',
      format: false,
    },
  ];

  return (
    <div className="insights">
      {/* Stat cards */}
      <div className="insights__stats">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            className={`insight-stat insight-stat--${card.accent}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <div className={`insight-stat__icon insight-stat__icon--${card.accent}`}>
              <card.icon size={18} />
            </div>
            <span className="insight-stat__label">{card.label}</span>
            <span className="insight-stat__value">{card.value}</span>
            {card.sub && <span className="insight-stat__sub">{card.sub}</span>}
          </motion.div>
        ))}
      </div>

      {/* Spending trend callout */}
      <motion.div
        className={`insight-callout ${insights.spendChange > 0 ? 'insight-callout--up' : 'insight-callout--down'}`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        {insights.spendChange > 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
        <div>
          <strong>
            You spent {Math.abs(insights.spendChange).toFixed(1)}% {insights.spendChange > 0 ? 'more' : 'less'} this month
          </strong>
          <p>This month: {formatCurrency(insights.thisMonthSpend)}</p>
        </div>
      </motion.div>

      {/* Charts row */}
      <div className="insights__charts">
        {/* Monthly comparison */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Monthly Comparison</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={insights.monthlyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--text-secondary)' }} />
              <Bar dataKey="Income" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Expense" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top categories */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Top Spending Categories</span>
          </div>
          <div className="top-categories">
            {insights.topCategories.map((cat, i) => (
              <motion.div
                key={cat.name}
                className="top-cat"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.06 }}
              >
                <div className="top-cat__info">
                  <span className="top-cat__rank">#{i + 1}</span>
                  <div className="top-cat__dot" style={{ background: cat.color }} />
                  <span className="top-cat__name">{cat.name}</span>
                  <span className="top-cat__percent">{cat.percent}%</span>
                  <span className="top-cat__amount mono">{formatCurrency(cat.amount)}</span>
                </div>
                <div className="top-cat__bar-bg">
                  <motion.div
                    className="top-cat__bar"
                    style={{ background: cat.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.percent}%` }}
                    transition={{ delay: 0.5 + i * 0.08, duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
