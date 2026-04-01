import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, ArrowLeftRight, Lightbulb, ChevronLeft, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';
import './Sidebar.css';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  { path: '/insights', icon: Lightbulb, label: 'Insights' },
];

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();

  return (
    <>
      <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
        <div className="sidebar__brand">
          <div className="sidebar__logo">
            <Wallet size={22} />
          </div>
          {!collapsed && (
            <motion.span
              className="sidebar__name"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              FinSight
            </motion.span>
          )}
        </div>

        <nav className="sidebar__nav">
          {navItems.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
              }
              title={collapsed ? label : undefined}
            >
              <Icon size={20} />
              {!collapsed && <span>{label}</span>}
              {location.pathname === path && (
                <motion.div
                  className="sidebar__indicator"
                  layoutId="sidebar-indicator"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
            </NavLink>
          ))}
        </nav>

        <button className="sidebar__toggle" onClick={onToggle} aria-label="Toggle sidebar">
          <ChevronLeft size={18} />
        </button>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="mobile-nav">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `mobile-nav__link ${isActive ? 'mobile-nav__link--active' : ''}`
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
