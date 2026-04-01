import { createContext, useContext, useReducer, useEffect } from 'react';
import { mockTransactions } from '../data/mockData';

const TransactionContext = createContext();

const STORAGE_KEY = 'findash_transactions';

function loadFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return null;
}

function saveToStorage(transactions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch {}
}

function transactionReducer(state, action) {
  let newState;
  switch (action.type) {
    case 'ADD':
      newState = {
        ...state,
        transactions: [{ ...action.payload, id: Date.now() }, ...state.transactions],
      };
      break;
    case 'EDIT':
      newState = {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? { ...t, ...action.payload } : t
        ),
      };
      break;
    case 'DELETE':
      newState = {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };
      break;
    case 'SET_FILTER':
      newState = { ...state, filters: { ...state.filters, ...action.payload } };
      break;
    case 'RESET_FILTERS':
      newState = {
        ...state,
        filters: { category: 'all', type: 'all', search: '', dateFrom: '', dateTo: '' },
      };
      break;
    case 'SET_SORT':
      newState = { ...state, sort: action.payload };
      break;
    default:
      return state;
  }
  saveToStorage(newState.transactions);
  return newState;
}

const initialFilters = { category: 'all', type: 'all', search: '', dateFrom: '', dateTo: '' };

export function TransactionProvider({ children }) {
  const stored = loadFromStorage();
  const [state, dispatch] = useReducer(transactionReducer, {
    transactions: stored || mockTransactions,
    filters: initialFilters,
    sort: { field: 'date', direction: 'desc' },
  });

  // Compute filtered & sorted transactions
  const filteredTransactions = getFilteredTransactions(state);

  return (
    <TransactionContext.Provider value={{ ...state, filteredTransactions, dispatch }}>
      {children}
    </TransactionContext.Provider>
  );
}

function getFilteredTransactions({ transactions, filters, sort }) {
  let result = [...transactions];

  // Filter by type
  if (filters.type !== 'all') {
    result = result.filter((t) => t.type === filters.type);
  }
  // Filter by category
  if (filters.category !== 'all') {
    result = result.filter((t) => t.category === filters.category);
  }
  // Filter by search
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (t) =>
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
    );
  }
  // Filter by date range
  if (filters.dateFrom) {
    result = result.filter((t) => t.date >= filters.dateFrom);
  }
  if (filters.dateTo) {
    result = result.filter((t) => t.date <= filters.dateTo);
  }

  // Sort
  result.sort((a, b) => {
    const dir = sort.direction === 'asc' ? 1 : -1;
    if (sort.field === 'date') return dir * (new Date(a.date) - new Date(b.date));
    if (sort.field === 'amount') return dir * (a.amount - b.amount);
    return 0;
  });

  return result;
}

export function useTransactions() {
  const ctx = useContext(TransactionContext);
  if (!ctx) throw new Error('useTransactions must be used within TransactionProvider');
  return ctx;
}
