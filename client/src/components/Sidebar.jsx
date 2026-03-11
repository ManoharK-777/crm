import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, LogOut, ChevronLeft, ChevronRight, Zap } from 'lucide-react';

export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const navItems = [
    { path: '/', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/leads', name: 'All Leads', icon: <Users size={20} /> },
    { path: '/settings', name: 'Settings', icon: <Settings size={20} /> }
  ];

  return (
    <div style={{
      width: isOpen ? 260 : 80,
      background: 'var(--bg-sidebar)',
      transition: 'width var(--trans)',
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid var(--border)',
      position: 'relative',
      zIndex: 20
    }}>
      {/* Sidebar Header */}
      <div style={{
        padding: isOpen ? '24px' : '24px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: isOpen ? 'flex-start' : 'center',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        gap: '12px'
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: 8,
          background: 'var(--accent-gradient)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', flexShrink: 0
        }}>
          <Zap size={18} />
        </div>
        {isOpen && (
          <span style={{ color: 'white', fontSize: 18, fontWeight: 700, whiteSpace: 'nowrap' }}>
            Lead<span style={{ color: 'var(--primary)' }}>CRM</span>
          </span>
        )}
      </div>

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'absolute',
          right: -14, top: 32,
          width: 28, height: 28,
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--t-muted)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}
      >
        {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      {/* Navigation Links */}
      <nav style={{ flex: 1, padding: isOpen ? '24px 16px' : '24px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {navItems.map(item => {
          const active = location.pathname === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px', borderRadius: '8px',
                color: active ? 'white' : 'var(--t-sidebar)',
                background: active ? 'rgba(255,255,255,0.1)' : 'transparent',
                justifyContent: isOpen ? 'flex-start' : 'center',
                transition: 'var(--trans)'
              }}
              className="sidebar-link"
              onMouseEnter={(e) => {
                if(!active) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.color = 'white';
                }
              }}
              onMouseLeave={(e) => {
                if(!active) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--t-sidebar)';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {item.icon}
              </div>
              {isOpen && <span style={{ fontWeight: 500, fontSize: 14 }}>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div style={{ padding: isOpen ? '24px 16px' : '24px 12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <button 
          onClick={handleLogout}
          style={{
            width: '100%',
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '12px', borderRadius: '8px',
            color: '#ef4444',
            justifyContent: isOpen ? 'flex-start' : 'center',
            transition: 'var(--trans)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <LogOut size={20} />
          {isOpen && <span style={{ fontWeight: 500, fontSize: 14 }}>Sign Out</span>}
        </button>
      </div>
    </div>
  );
}
