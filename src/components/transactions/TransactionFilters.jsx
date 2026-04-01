import { Search, SlidersHorizontal, X, ArrowUpDown } from 'lucide-react';
import { useTransactions } from '../../context/TransactionContext';
import { categoryList } from '../../data/mockData';
import './TransactionFilters.css';

export default function TransactionFilters() {
  const { filters, sort, dispatch } = useTransactions();

  const setFilter = (payload) => dispatch({ type: 'SET_FILTER', payload });
  const resetFilters = () => dispatch({ type: 'RESET_FILTERS' });

  const hasActiveFilters =
    filters.type !== 'all' ||
    filters.category !== 'all' ||
    filters.search ||
    filters.dateFrom ||
    filters.dateTo;

  const toggleSort = (field) => {
    if (sort.field === field) {
      dispatch({
        type: 'SET_SORT',
        payload: { field, direction: sort.direction === 'asc' ? 'desc' : 'asc' },
      });
    } else {
      dispatch({ type: 'SET_SORT', payload: { field, direction: 'desc' } });
    }
  };

  return (
    <div className="txn-filters">
      {/* Search */}
      <div className="txn-filters__search">
        <Search size={16} className="txn-filters__search-icon" />
        <input
          className="input txn-filters__search-input"
          type="text"
          placeholder="Search transactions..."
          value={filters.search}
          onChange={(e) => setFilter({ search: e.target.value })}
        />
      </div>

      {/* Quick filters row */}
      <div className="txn-filters__row">
        <select
          className="select"
          value={filters.type}
          onChange={(e) => setFilter({ type: e.target.value })}
          aria-label="Filter by type"
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select
          className="select"
          value={filters.category}
          onChange={(e) => setFilter({ category: e.target.value })}
          aria-label="Filter by category"
        >
          <option value="all">All Categories</option>
          {categoryList.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <input
          className="input"
          type="date"
          value={filters.dateFrom}
          onChange={(e) => setFilter({ dateFrom: e.target.value })}
          aria-label="From date"
          placeholder="From"
        />

        <input
          className="input"
          type="date"
          value={filters.dateTo}
          onChange={(e) => setFilter({ dateTo: e.target.value })}
          aria-label="To date"
          placeholder="To"
        />

        {/* Sort buttons */}
        <button
          className={`btn btn-secondary ${sort.field === 'date' ? 'btn--active-sort' : ''}`}
          onClick={() => toggleSort('date')}
          title={`Sort by date (${sort.field === 'date' ? sort.direction : 'desc'})`}
        >
          <ArrowUpDown size={14} />
          Date
        </button>

        <button
          className={`btn btn-secondary ${sort.field === 'amount' ? 'btn--active-sort' : ''}`}
          onClick={() => toggleSort('amount')}
          title={`Sort by amount (${sort.field === 'amount' ? sort.direction : 'desc'})`}
        >
          <ArrowUpDown size={14} />
          Amount
        </button>

        {hasActiveFilters && (
          <button className="btn btn-ghost" onClick={resetFilters} title="Clear all filters">
            <X size={14} />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

