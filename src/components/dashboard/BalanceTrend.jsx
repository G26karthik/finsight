import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTransactions } from '../../context/TransactionContext';
import { formatCurrency } from '../../utils/helpers';
import { format, parseISO, startOfMonth, subMonths } from 'date-fns';

export default function BalanceTrend() {
  const { transactions } = useTransactions();

  const chartData = useMemo(() => {
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = subMonths(now, i);
      const key = format(d, 'yyyy-MM');
      months.push({ key, label: format(d, 'MMM'), income: 0, expense: 0 });
    }

    transactions.forEach((t) => {
      const mKey = t.date.substring(0, 7);
      const month = months.find((m) => m.key === mKey);
      if (month) {
        if (t.type === 'income') month.income += t.amount;
        else month.expense += t.amount;
      }
    });

    let balance = 0;
    return months.map((m) => {
      balance += m.income - m.expense;
      return { ...m, balance };
    });
  }, [transactions]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-primary)',
        borderRadius: 'var(--radius-lg)',
        padding: '12px 16px',
        boxShadow: 'var(--shadow-lg)',
        fontSize: '0.813rem',
      }}>
        <p style={{ fontWeight: 600, marginBottom: 4 }}>{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color, margin: '2px 0' }}>
            {p.name}: {formatCurrency(p.value)}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="card" style={{ padding: 'var(--space-6)' }}>
      <div className="card-header">
        <span className="card-title">Balance Trend</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Last 6 months</span>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="balance"
            name="Balance"
            stroke="hsl(142, 71%, 45%)"
            strokeWidth={2.5}
            fill="url(#balanceGradient)"
            dot={{ r: 4, fill: 'var(--bg-elevated)', stroke: 'hsl(142, 71%, 45%)', strokeWidth: 2 }}
            activeDot={{ r: 6, strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
