import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { RoleProvider } from './context/RoleContext';
import { TransactionProvider } from './context/TransactionContext';
import { ToastProvider } from './components/common/Toast';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Insights from './pages/Insights';

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <BrowserRouter>
      <ThemeProvider>
        <RoleProvider>
          <TransactionProvider>
            <ToastProvider>
              <div
                className="app-layout"
                style={{
                  '--sidebar-width': sidebarCollapsed ? 'var(--sidebar-collapsed)' : '260px',
                }}
              >
                <Sidebar
                  collapsed={sidebarCollapsed}
                  onToggle={() => setSidebarCollapsed((c) => !c)}
                />
                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/transactions" element={<Transactions />} />
                    <Route path="/insights" element={<Insights />} />
                  </Routes>
                </main>
              </div>
            </ToastProvider>
          </TransactionProvider>
        </RoleProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
