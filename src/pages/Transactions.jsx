import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Download, FileJson, FileSpreadsheet } from 'lucide-react';
import Header from '../components/layout/Header';
import TransactionFilters from '../components/transactions/TransactionFilters';
import TransactionList from '../components/transactions/TransactionList';
import TransactionForm from '../components/transactions/TransactionForm';
import Modal from '../components/common/Modal';
import { useTransactions } from '../context/TransactionContext';
import { useRole } from '../context/RoleContext';
import { useToast } from '../components/common/Toast';
import { exportToCSV, exportToJSON } from '../utils/helpers';
import './Transactions.css';

export default function Transactions() {
  const { transactions, filteredTransactions, dispatch } = useTransactions();
  const { isAdmin } = useRole();
  const { addToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showExport, setShowExport] = useState(false);

  const handleAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEdit = (txn) => {
    setEditing(txn);
    setModalOpen(true);
  };

  const handleSubmit = (data) => {
    if (editing) {
      dispatch({ type: 'EDIT', payload: { ...data, id: editing.id } });
      addToast('Transaction updated successfully', 'success');
    } else {
      dispatch({ type: 'ADD', payload: data });
      addToast('Transaction added successfully', 'success');
    }
    setModalOpen(false);
    setEditing(null);
  };

  const handleExportCSV = () => {
    exportToCSV(filteredTransactions);
    addToast('Exported as CSV', 'info');
    setShowExport(false);
  };

  const handleExportJSON = () => {
    exportToJSON(filteredTransactions);
    addToast('Exported as JSON', 'info');
    setShowExport(false);
  };

  return (
    <>
      <Header
        title="Transactions"
        subtitle={`${filteredTransactions.length} of ${transactions.length} transactions`}
      />
      <div className="page-container">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Action Bar */}
          <div className="txn-actions">
            {isAdmin && (
              <button className="btn btn-primary" onClick={handleAdd}>
                <Plus size={16} />
                Add Transaction
              </button>
            )}
            {!isAdmin && (
              <div className="badge badge-viewer" style={{ padding: '6px 14px', fontSize: '0.813rem' }}>
                Viewer Mode — Read Only
              </div>
            )}

            <div className="txn-actions__right">
              <div className="export-wrapper">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowExport(!showExport)}
                >
                  <Download size={15} />
                  Export
                </button>
                {showExport && (
                  <motion.div
                    className="export-dropdown"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <button className="export-dropdown__item" onClick={handleExportCSV}>
                      <FileSpreadsheet size={15} />
                      Export CSV
                    </button>
                    <button className="export-dropdown__item" onClick={handleExportJSON}>
                      <FileJson size={15} />
                      Export JSON
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          <TransactionFilters />
          <TransactionList onEdit={handleEdit} onAdd={handleAdd} />
        </motion.div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        title={editing ? 'Edit Transaction' : 'Add Transaction'}
      >
        <TransactionForm
          initial={editing}
          onSubmit={handleSubmit}
          onCancel={() => { setModalOpen(false); setEditing(null); }}
        />
      </Modal>
    </>
  );
}

