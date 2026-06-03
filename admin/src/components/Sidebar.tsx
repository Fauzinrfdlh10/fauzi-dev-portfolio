import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Settings, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const { logout, admin } = useContext(AuthContext);

  const navStyles = ({ isActive }: { isActive: boolean }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 20px',
    borderRadius: '8px',
    color: isActive ? '#fff' : 'var(--text-muted)',
    background: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
    textDecoration: 'none',
    fontWeight: 500,
    transition: 'all 0.2s',
    borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
  });

  return (
    <div className="glass-panel" style={{ 
      width: 'var(--sidebar-width)', 
      height: '100vh', 
      position: 'fixed', 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      <div style={{ padding: '30px 20px', borderBottom: '1px solid var(--border-color)' }}>
        <h2 style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '30px', height: '30px', background: 'linear-gradient(135deg, var(--primary), var(--accent))', borderRadius: '8px' }}></div>
          Portfolio Admin
        </h2>
      </div>

      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <NavLink to="/" style={navStyles} end>
          <LayoutDashboard size={20} />
          Overview
        </NavLink>
        <NavLink to="/inquiries" style={navStyles}>
          <MessageSquare size={20} />
          Inquiries
        </NavLink>
        <NavLink to="/settings" style={navStyles}>
          <Settings size={20} />
          Settings
        </NavLink>
      </div>

      <div style={{ padding: '20px', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            {admin?.name.charAt(0) || 'A'}
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>{admin?.name}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Admin</div>
          </div>
        </div>
        <button 
          onClick={logout} 
          style={{ 
            width: '100%', 
            padding: '10px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '8px', 
            background: 'rgba(239, 68, 68, 0.1)', 
            color: 'var(--danger)', 
            border: 'none', 
            borderRadius: '8px', 
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
