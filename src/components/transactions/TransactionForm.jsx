import { useState, useEffect } from 'react';
import { categoryList } from '../../data/mockData';
import './TransactionForm.css';

const emptyForm = {
  date: new Date().toISOString().split('T')[0],
  description: '',
  category: 'food',
  type: 'expense',
  amount: '',
};

export default function TransactionForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial || emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initial) setForm(initial);
  }, [initial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.description.trim()) errs.description = 'Description is required';
    if (!form.amount || Number(form.amount) <= 0) errs.amount = 'Enter a valid amount';
    if (!form.date) errs.date = 'Date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...form,
      amount: Number(form.amount),
    });
  };

  const filteredCategories = categoryList.filter((c) => c.type === form.type);

  return (
    <form className="txn-form" onSubmit={handleSubmit}>
      {/* Type selector */}
      <div className="txn-form__type-toggle">
        <button
          type="button"
          className={`txn-form__type-btn ${form.type === 'expense' ? 'txn-form__type-btn--expense' : ''}`}
          onClick={() => setForm((f) => ({ ...f, type: 'expense', category: 'food' }))}
        >
          Expense
        </button>
        <button
          type="button"
          className={`txn-form__type-btn ${form.type === 'income' ? 'txn-form__type-btn--income' : ''}`}
          onClick={() => setForm((f) => ({ ...f, type: 'income', category: 'salary' }))}
        >
          Income
        </button>
      </div>

      <div className="input-group">
        <label htmlFor="txn-desc">Description</label>
        <input
          id="txn-desc"
          className={`input ${errors.description ? 'input--error' : ''}`}
          type="text"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="e.g., Grocery shopping"
        />
        {errors.description && <span className="field-error">{errors.description}</span>}
      </div>

      <div className="txn-form__row">
        <div className="input-group">
          <label htmlFor="txn-amount">Amount (₹)</label>
          <input
            id="txn-amount"
            className={`input mono ${errors.amount ? 'input--error' : ''}`}
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="0"
            min="1"
          />
          {errors.amount && <span className="field-error">{errors.amount}</span>}
        </div>

        <div className="input-group">
          <label htmlFor="txn-date">Date</label>
          <input
            id="txn-date"
            className={`input ${errors.date ? 'input--error' : ''}`}
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />
          {errors.date && <span className="field-error">{errors.date}</span>}
        </div>
      </div>

      <div className="input-group">
        <label htmlFor="txn-category">Category</label>
        <select
          id="txn-category"
          className="select"
          name="category"
          value={form.category}
          onChange={handleChange}
        >
          {filteredCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className="txn-form__actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {initial ? 'Save Changes' : 'Add Transaction'}
        </button>
      </div>
    </form>
  );
}
