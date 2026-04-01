import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Header from '../components/layout/Header';
import SummaryCards from '../components/dashboard/SummaryCards';
import BalanceTrend from '../components/dashboard/BalanceTrend';
import SpendingBreakdown from '../components/dashboard/SpendingBreakdown';
import { useTransactions } from '../context/TransactionContext';
import { getCategoryInfo } from '../data/mockData';
import { formatCurrency, formatDate } from '../utils/helpers';
import './Dashboard.css';

export default function Dashboard() {
  const { transactions } = useTransactions();

  const recentTransactions = useMemo(
    () => [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5),
    [transactions]
  );

  return (
    <>
      <Header title="Dashboard" subtitle="Your financial overview" />
      <div className="page-container">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <SummaryCards />

          <div className="dashboard__charts">
            <BalanceTrend />
            <SpendingBreakdown />
          </div>

          {/* Recent Transactions */}
          <div className="card dashboard__recent">
            <div className="card-header">
              <span className="card-title">Recent Transactions</span>
              <a href="/transactions" className="btn btn-ghost" style={{ fontSize: '0.813rem' }}>
                View All <ArrowUpRight size={14} />
              </a>
            </div>
            <div className="recent-list">
              {recentTransactions.map((txn) => {
                const cat = getCategoryInfo(txn.category);
                return (
                  <div key={txn.id} className="recent-item">
                    <div className="recent-item__dot" style={{ background: cat.color }} />
                    <div className="recent-item__info">
                      <span className="recent-item__desc">{txn.description}</span>
                      <span className="recent-item__meta">{cat.name} · {formatDate(txn.date)}</span>
                    </div>
                    <span className={`recent-item__amount mono ${txn.type === 'income' ? 'text-green' : 'text-red'}`}>
                      {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
