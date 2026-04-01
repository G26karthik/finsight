import { motion } from 'framer-motion';
import { Pencil, Trash2 } from 'lucide-react';
import { useTransactions } from '../../context/TransactionContext';
import { useRole } from '../../context/RoleContext';
import { getCategoryInfo } from '../../data/mockData';
import { formatCurrency, formatDate } from '../../utils/helpers';
import EmptyState from '../common/EmptyState';
import './TransactionList.css';

export default function TransactionList({ onEdit, onAdd }) {
  const { filteredTransactions, dispatch } = useTransactions();
  const { isAdmin } = useRole();

  if (filteredTransactions.length === 0) {
    return (
      <EmptyState
        title="No transactions found"
        message={isAdmin ? "Add your first transaction to get started." : "No transactions match your current filters."}
        action={isAdmin ? "Add Transaction" : undefined}
        onAction={onAdd}
      />
    );
  }

  return (
    <div className="txn-list">
      <div className="txn-list__header">
        <span>Description</span>
        <span>Category</span>
        <span>Date</span>
        <span>Amount</span>
        {isAdmin && <span>Actions</span>}
      </div>
      {filteredTransactions.map((txn, i) => {
        const cat = getCategoryInfo(txn.category);
        return (
          <motion.div
            key={txn.id}
            className="txn-row"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.03, 0.5) }}
          >
            <div className="txn-row__desc">
              <div
                className="txn-row__icon"
                style={{ background: `${cat.color}18`, color: cat.color }}
              >
                <div className="txn-row__dot" style={{ background: cat.color }} />
              </div>
              <div>
                <span className="txn-row__title">{txn.description}</span>
                <span className={`badge ${txn.type === 'income' ? 'badge-income' : 'badge-expense'}`}>
                  {txn.type}
                </span>
              </div>
            </div>
            <div className="txn-row__cat">
              <span className="txn-row__cat-dot" style={{ background: cat.color }} />
              {cat.name}
            </div>
            <div className="txn-row__date">{formatDate(txn.date)}</div>
            <div className={`txn-row__amount mono ${txn.type === 'income' ? 'text-green' : 'text-red'}`}>
              {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount)}
            </div>
            {isAdmin && (
              <div className="txn-row__actions">
                <button
                  className="btn btn-ghost btn-icon"
                  onClick={() => onEdit(txn)}
                  aria-label="Edit transaction"
                >
                  <Pencil size={15} />
                </button>
                <button
                  className="btn btn-ghost btn-icon"
                  onClick={() => {
                    if (window.confirm('Delete this transaction?')) {
                      dispatch({ type: 'DELETE', payload: txn.id });
                    }
                  }}
                  aria-label="Delete transaction"
                  style={{ color: 'var(--accent-red)' }}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
