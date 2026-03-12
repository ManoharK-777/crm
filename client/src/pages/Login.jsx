import React, { useState } from 'react';
import { Eye, EyeOff, Zap, Lock, User } from 'lucide-react';
import Particles from '../components/Particles';

export default function Login({ onAuth }) {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');

  const go = () => {
    if (!u || !p) { setErr('Please enter your credentials'); return; }
    setErr('');
    setLoading(true);
    setTimeout(() => {
      if (u === 'admin' && p === 'admin123') {
        localStorage.setItem('token', 'demo_token_123');
        onAuth();
      } else {
        setErr('Invalid credentials — try admin / admin123');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="login-page">
      <Particles />

      {/* Animated orbs */}
      <div style={{
        position: 'fixed', top: '15%', left: '8%',
        width: 280, height: 280,
        background: 'radial-gradient(circle, rgba(255,23,68,0.12) 0%, transparent 70%)',
        borderRadius: '50%', filter: 'blur(40px)',
        animation: 'float 6s ease-in-out infinite', pointerEvents: 'none'
      }} />
      <div style={{
        position: 'fixed', bottom: '15%', right: '8%',
        width: 320, height: 320,
        background: 'radial-gradient(circle, rgba(0,229,255,0.1) 0%, transparent 70%)',
        borderRadius: '50%', filter: 'blur(50px)',
        animation: 'float 8s ease-in-out infinite reverse', pointerEvents: 'none'
      }} />

      <div className="login-box">
        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-mark">
            <Zap size={24} />
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1 }}>
              Lead<span style={{
                background: 'linear-gradient(135deg, #ff1744, #00e5ff)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
              }}>CRM</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--t-muted)', letterSpacing: '2px', textTransform: 'uppercase', marginTop: 2 }}>
              Intelligence Platform
            </div>
          </div>
        </div>

        <h2 className="login-title">Welcome Back</h2>
        <p className="login-sub">Sign in to your command centre</p>

        {/* Username — input on top, label under */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <div style={{
              position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
              color: focused === 'u' ? 'var(--blue)' : 'var(--t-muted)',
              transition: 'color 0.2s', pointerEvents: 'none'
            }}>
              <User size={16} />
            </div>
            <input
              value={u}
              onChange={e => setU(e.target.value)}
              placeholder="admin"
              className="form-input"
              style={{ paddingLeft: 42, width: '100%' }}
              onFocus={() => setFocused('u')}
              onBlur={() => setFocused('')}
              onKeyDown={e => e.key === 'Enter' && go()}
            />
          </div>
          <label className="form-label" style={{ marginLeft: 12, fontSize: 11, opacity: 0.8 }}>Username</label>
        </div>

        {/* Password — input on top, label under */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: err ? 8 : 28 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <div style={{
              position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
              color: focused === 'p' ? 'var(--blue)' : 'var(--t-muted)',
              transition: 'color 0.2s', pointerEvents: 'none'
            }}>
              <Lock size={16} />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={p}
              onChange={e => setP(e.target.value)}
              placeholder="••••••••"
              className="form-input"
              style={{ paddingLeft: 42, paddingRight: 44, width: '100%' }}
              onFocus={() => setFocused('p')}
              onBlur={() => setFocused('')}
              onKeyDown={e => e.key === 'Enter' && go()}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                background: 'transparent', border: 'none', color: 'var(--t-muted)',
                cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center',
                borderRadius: 6, transition: 'color 0.2s'
              }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <label className="form-label" style={{ marginLeft: 12, fontSize: 11, opacity: 0.8 }}>Password</label>
        </div>

        {err && (
          <div style={{
            marginBottom: 20, padding: '10px 14px',
            background: 'rgba(255,23,68,0.08)',
            border: '1px solid rgba(255,23,68,0.2)',
            borderRadius: 10, color: 'var(--red)',
            fontSize: 13, fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 8
          }}>
            <span style={{ fontSize: 16 }}>⚠</span> {err}
          </div>
        )}

        {/* Sign In Button */}
        <button
          className="btn-primary"
          style={{ width: '100%', padding: '14px', fontSize: 15, justifyContent: 'center', marginBottom: 20, borderRadius: 14 }}
          onClick={go}
          disabled={loading}
        >
          {loading ? (
            <>
              <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              Authenticating…
            </>
          ) : (
            <>
              <Zap size={16} />
              Sign In
            </>
          )}
        </button>

        {/* Demo hint */}
        <div style={{
          textAlign: 'center', color: 'var(--t-muted)', fontSize: 12,
          background: 'rgba(0,229,255,0.04)',
          padding: '10px 16px', borderRadius: 10,
          border: '1px solid rgba(0,229,255,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
        }}>
          <span style={{ color: 'var(--blue)', fontSize: 14 }}>🔑</span>
          Demo:&nbsp;<strong style={{ color: 'var(--t-main)' }}>admin</strong>
          &nbsp;/&nbsp;<strong style={{ color: 'var(--t-main)' }}>admin123</strong>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}
