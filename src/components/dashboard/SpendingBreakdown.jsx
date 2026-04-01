import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useTransactions } from '../../context/TransactionContext';
import { getCategoryInfo } from '../../data/mockData';
import { formatCurrency } from '../../utils/helpers';
import './SpendingBreakdown.css';

export default function SpendingBreakdown() {
  const { transactions } = useTransactions();

  const data = useMemo(() => {
    const catMap = {};
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        catMap[t.category] = (catMap[t.category] || 0) + t.amount;
      });

    return Object.entries(catMap)
      .map(([key, val]) => ({
        name: getCategoryInfo(key).name,
        value: val,
        color: getCategoryInfo(key).color,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [transactions]);

  const total = data.reduce((s, d) => s + d.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0];
    return (
      <div style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-primary)',
        borderRadius: 'var(--radius-lg)',
        padding: '10px 14px',
        boxShadow: 'var(--shadow-lg)',
        fontSize: '0.813rem',
      }}>
        <p style={{ fontWeight: 600 }}>{d.name}</p>
        <p style={{ color: d.payload.color }}>{formatCurrency(d.value)} ({((d.value / total) * 100).toFixed(1)}%)</p>
      </div>
    );
  };

  return (
    <div className="card spending-breakdown">
      <div className="card-header">
        <span className="card-title">Spending Breakdown</span>
      </div>
      <div className="spending-breakdown__content">
        <div className="spending-breakdown__chart">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="spending-breakdown__center">
            <span className="mono" style={{ fontSize: '0.875rem', fontWeight: 700 }}>
              {formatCurrency(total)}
            </span>
            <span style={{ fontSize: '0.688rem', color: 'var(--text-muted)' }}>Total Spent</span>
          </div>
        </div>
        <div className="spending-breakdown__legend">
          {data.map((item) => (
            <div key={item.name} className="spending-breakdown__item">
              <div className="spending-breakdown__dot" style={{ background: item.color }} />
              <span className="spending-breakdown__name">{item.name}</span>
              <span className="spending-breakdown__val mono">{formatCurrency(item.value)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
