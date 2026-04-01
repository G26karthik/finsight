import { Sun, Moon, Shield, Eye } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useRole } from '../../context/RoleContext';
import './Header.css';

export default function Header({ title, subtitle }) {
  const { theme, toggleTheme } = useTheme();
  const { role, switchRole, isAdmin } = useRole();

  return (
    <header className="header">
      <div className="header__left">
        <h1 className="header__title">{title}</h1>
        {subtitle && <p className="header__subtitle">{subtitle}</p>}
      </div>

      <div className="header__right">
        {/* Role Switcher */}
        <div className="role-switch" title="Switch between Admin and Viewer roles">
          <div className="role-switch__toggle">
            <button
              className={`role-switch__btn ${isAdmin ? 'role-switch__btn--active' : ''}`}
              onClick={() => switchRole('admin')}
              aria-label="Switch to Admin role"
            >
              <Shield size={14} />
              <span>Admin</span>
            </button>
            <button
              className={`role-switch__btn ${!isAdmin ? 'role-switch__btn--active' : ''}`}
              onClick={() => switchRole('viewer')}
              aria-label="Switch to Viewer role"
            >
              <Eye size={14} />
              <span>Viewer</span>
            </button>
          </div>
        </div>

        {/* Theme Toggle */}
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}
