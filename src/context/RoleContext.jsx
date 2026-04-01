import { createContext, useContext, useState } from 'react';

const RoleContext = createContext();

export function RoleProvider({ children }) {
  const [role, setRole] = useState(() => {
    return localStorage.getItem('findash_role') || 'admin';
  });

  const switchRole = (newRole) => {
    setRole(newRole);
    localStorage.setItem('findash_role', newRole);
  };

  const isAdmin = role === 'admin';

  return (
    <RoleContext.Provider value={{ role, switchRole, isAdmin }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error('useRole must be used within RoleProvider');
  return ctx;
}

