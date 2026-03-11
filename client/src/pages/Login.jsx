import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Particles from '../components/Particles';

export default function Login({ onAuth }) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const go = () => {
    setLoading(true);
    setTimeout(() => {
      if (u === "admin" && p === "admin123") {
        localStorage.setItem("token", "demo_token_123");
        onAuth();
      } else {
        setErr("Invalid credentials. Try admin / admin123");
        setLoading(false);
      }
    }, 700);
  };

  return (
    <div className="login-page">
      <Particles />
      <div className="login-box">
        <div className="login-logo">
          <div className="login-logo-mark">⚡</div>
          <span className="login-title" style={{ marginBottom: 0 }}>Lead<b style={{color: 'var(--primary)'}}>CRM</b></span>
        </div>
        
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-sub">Sign in to your CRM dashboard</p>
        
        <div className="form-group">
          <label className="form-label">Username</label>
          <input 
            value={u} 
            onChange={e => setU(e.target.value)} 
            placeholder="admin" 
            className="form-input"
            onKeyDown={e => e.key === "Enter" && go()} 
          />
        </div>

        <div className="form-group" style={{ marginBottom: err ? 8 : 24 }}>
          <label className="form-label">Password</label>
          <div style={{ position: 'relative' }}>
            <input 
              type={showPassword ? "text" : "password"} 
              value={p} 
              onChange={e => setP(e.target.value)} 
              placeholder="••••••••" 
              className="form-input"
              onKeyDown={e => e.key === "Enter" && go()} 
              style={{ width: '100%', paddingRight: '40px' }} 
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                background: 'transparent', border: 'none', color: 'var(--t-muted)', cursor: 'pointer',
                fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: 0
              }}
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        
        {err && <div className="form-error" style={{ marginBottom: 16 }}>⚠ {err}</div>}
        
        <button 
          className="btn-primary" 
          style={{ width: "100%", padding: "14px", fontSize: 16, justifyContent: "center", marginBottom: 24 }} 
          onClick={go} 
          disabled={loading}
        >
          {loading ? "Signing in…" : "Sign In →"}
        </button>
        
        <div style={{ textAlign: "center", color: "var(--t-muted)", fontSize: 13, background: "rgba(255,255,255,0.03)", padding: "10px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
          🔑 Demo: <strong style={{color: 'var(--t-main)'}}>admin</strong> / <strong style={{color: 'var(--t-main)'}}>admin123</strong>
        </div>
      </div>
    </div>
  );
}
