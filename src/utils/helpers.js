import { format, parseISO } from 'date-fns';

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr) {
  return format(parseISO(dateStr), 'dd MMM yyyy');
}

export function formatDateShort(dateStr) {
  return format(parseISO(dateStr), 'dd MMM');
}

export function formatMonth(dateStr) {
  return format(parseISO(dateStr), 'MMM yyyy');
}

export function formatPercent(value) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
}

export function downloadFile(data, filename, type = 'application/json') {
  const blob = new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportToJSON(transactions) {
  const data = JSON.stringify(transactions, null, 2);
  downloadFile(data, 'transactions.json');
}

export function exportToCSV(transactions) {
  const headers = 'Date,Description,Category,Type,Amount\n';
  const rows = transactions
    .map((t) => `${t.date},"${t.description}",${t.category},${t.type},${t.amount}`)
    .join('\n');
  downloadFile(headers + rows, 'transactions.csv', 'text/csv');
}
