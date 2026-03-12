import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, LogOut, ChevronLeft, ChevronRight, Zap } from 'lucide-react';

export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  const navItems = [
    { path: '/',        name: 'Dashboard', icon: <LayoutDashboard size={19} /> },
    { path: '/leads',   name: 'All Leads', icon: <Users size={19} /> },
    { path: '/settings',name: 'Settings',  icon: <Settings size={19} /> },
  ];

  return (
    <div style={{
      width: isOpen ? 240 : 72,
      background: 'var(--bg-sidebar)',
      transition: 'width 0.3s cubic-bezier(0.16,1,0.3,1)',
      display: 'flex', flexDirection: 'column',
      borderRight: '1px solid rgba(0,229,255,0.07)',
      position: 'relative', zIndex: 20,
      overflow: 'hidden',
    }}>

      {/* Top glow line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(255,23,68,0.4), rgba(0,229,255,0.4), transparent)'
      }} />

      {/* Header */}
      <div style={{
        padding: isOpen ? '22px 20px' : '22px 0',
        display: 'flex', alignItems: 'center', justifyContent: isOpen ? 'flex-start' : 'center',
        borderBottom: '1px solid rgba(0,229,255,0.06)',
        gap: 12, flexShrink: 0,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          background: 'linear-gradient(135deg, #ff1744, #00e5ff)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', boxShadow: '0 0 16px rgba(0,229,255,0.25), 0 0 32px rgba(255,23,68,0.15)',
        }}>
          <Zap size={18} />
        </div>
        {isOpen && (
          <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
            <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.3px', color: 'white' }}>
              Lead<span style={{
                background: 'linear-gradient(90deg, #ff1744, #00e5ff)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
              }}>CRM</span>
            </div>
            <div style={{ fontSize: 10, color: 'rgba(92,122,153,0.8)', letterSpacing: '1.5px', textTransform: 'uppercase', marginTop: 1 }}>
              Intelligence
            </div>
          </div>
        )}
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'absolute', right: -13, top: 30,
          width: 26, height: 26,
          background: 'var(--bg-sidebar)',
          border: '1px solid rgba(0,229,255,0.2)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--t-muted)', cursor: 'pointer',
          boxShadow: '0 0 8px rgba(0,229,255,0.1)',
          transition: 'all 0.2s', zIndex: 30,
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,229,255,0.5)'; e.currentTarget.style.color = '#00e5ff'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,229,255,0.2)'; e.currentTarget.style.color = 'var(--t-muted)'; }}
      >
        {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>

      {/* Nav Section Label */}
      {isOpen && (
        <div style={{
          padding: '20px 20px 8px',
          fontSize: 10, fontWeight: 700, color: 'rgba(92,122,153,0.5)',
          letterSpacing: '1.5px', textTransform: 'uppercase'
        }}>
          Navigation
        </div>
      )}

      {/* Navigation */}
      <nav style={{
        flex: 1, padding: isOpen ? '4px 12px' : '20px 10px',
        display: 'flex', flexDirection: 'column', gap: 4,
      }}>
        {navItems.map(item => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              title={!isOpen ? item.name : undefined}
              style={{
                display: 'flex', alignItems: 'center',
                gap: 12, padding: '11px 12px',
                borderRadius: 12,
                color: active ? '#00e5ff' : 'var(--t-muted)',
                background: active
                  ? 'linear-gradient(135deg, rgba(0,229,255,0.1), rgba(255,23,68,0.04))'
                  : 'transparent',
                border: active ? '1px solid rgba(0,229,255,0.2)' : '1px solid transparent',
                boxShadow: active ? '0 0 16px rgba(0,229,255,0.12), inset 0 0 12px rgba(0,229,255,0.04)' : 'none',
                justifyContent: isOpen ? 'flex-start' : 'center',
                transition: 'all 0.22s cubic-bezier(0.16,1,0.3,1)',
                position: 'relative', overflow: 'hidden',
                textDecoration: 'none',
              }}
              onMouseEnter={e => {
                if (!active) {
                  e.currentTarget.style.background = 'rgba(0,229,255,0.06)';
                  e.currentTarget.style.color = '#00e5ff';
                  e.currentTarget.style.borderColor = 'rgba(0,229,255,0.15)';
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--t-muted)';
                  e.currentTarget.style.borderColor = 'transparent';
                }
              }}
            >
              {/* Active indicator */}
              {active && (
                <div style={{
                  position: 'absolute', left: 0, top: '20%', bottom: '20%',
                  width: 3, borderRadius: '0 2px 2px 0',
                  background: 'linear-gradient(180deg, #ff1744, #00e5ff)',
                  boxShadow: '0 0 8px rgba(0,229,255,0.6)',
                }} />
              )}
              <div style={{
                display: 'flex', alignItems: 'center', flexShrink: 0,
                filter: active ? 'drop-shadow(0 0 6px rgba(0,229,255,0.5))' : 'none',
                transition: 'filter 0.2s',
              }}>
                {item.icon}
              </div>
              {isOpen && (
                <span style={{ fontWeight: active ? 700 : 500, fontSize: 14, whiteSpace: 'nowrap' }}>
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: isOpen ? '12px' : '12px 10px', borderTop: '1px solid rgba(0,229,255,0.05)' }}>
        <button
          onClick={handleLogout}
          title={!isOpen ? 'Sign Out' : undefined}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 12,
            padding: '11px 12px', borderRadius: 12,
            color: 'rgba(255,23,68,0.6)', justifyContent: isOpen ? 'flex-start' : 'center',
            transition: 'all 0.22s cubic-bezier(0.16,1,0.3,1)',
            fontSize: 14, fontWeight: 500,
            border: '1px solid transparent',
            cursor: 'pointer', background: 'transparent',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,23,68,0.08)';
            e.currentTarget.style.color = '#ff1744';
            e.currentTarget.style.borderColor = 'rgba(255,23,68,0.2)';
            e.currentTarget.style.boxShadow = '0 0 16px rgba(255,23,68,0.1)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'rgba(255,23,68,0.6)';
            e.currentTarget.style.borderColor = 'transparent';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <LogOut size={19} />
          {isOpen && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );
}
