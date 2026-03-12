import React, { useState, useEffect } from 'react';
import { User, Shield, Bell, Zap, Palette, Monitor, LogOut, Save } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function Settings({ onToast, user, setUser }) {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Toggles state
  const [toggles, setToggles] = useState({
    mfa: true,
    emailNotif: true,
    desktopAlerts: true,
    systemUpdates: false
  });

  const [localUser, setLocalUser] = useState({ ...user });

  const toggleSwitch = (key) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
    onToast(`${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} ${toggles[key] ? 'disabled' : 'enabled'}`, "success");
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setLocalUser(prev => ({ ...prev, [name]: value }));
  };

  const saveProfile = () => {
    setUser(localUser);
    onToast("Bespoke profile secured", "success");
  };

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const tabs = [
    { id: 'profile', name: 'Profile', icon: <User size={18} /> },
    { id: 'security', name: 'Security', icon: <Shield size={18} /> },
    { id: 'notifications', name: 'Alerts', icon: <Bell size={18} /> },
    { id: 'appearance', name: 'Theme', icon: <Palette size={18} /> },
  ];

  return (
    <div className="page-anim" style={{ maxWidth: 1000, margin: '0 auto', paddingBottom: 60 }}>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: 'white', marginBottom: 8 }}>Settings</h2>
        <p style={{ color: 'var(--t-muted)' }}>Configure your bespoke luxury workspace and account preferences</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 32 }}>
        {/* Sidebar Tabs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 16px', borderRadius: 12,
                background: activeTab === tab.id ? 'rgba(255,193,7,0.1)' : 'transparent',
                border: activeTab === tab.id ? '1px solid rgba(255,193,7,0.2)' : '1px solid transparent',
                color: activeTab === tab.id ? 'var(--gold)' : 'var(--t-muted)',
                cursor: 'pointer', transition: 'all 0.2s',
                textAlign: 'left', fontWeight: 600,
              }}
              onMouseEnter={e => {
                if (activeTab !== tab.id) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.color = 'white';
                }
              }}
              onMouseLeave={e => {
                if (activeTab !== tab.id) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--t-muted)';
                }
              }}
            >
              <div style={{ filter: activeTab === tab.id ? 'drop-shadow(0 0 4px var(--gold))' : 'none' }}>
                {tab.icon}
              </div>
              {tab.name}
            </button>
          ))}

          <div style={{ marginTop: 'auto', paddingTop: 20 }}>
             <button 
                onClick={() => { localStorage.removeItem('token'); window.location.reload(); }}
                style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 16px', borderRadius: 12,
                    background: 'rgba(255,23,68,0.05)', border: '1px solid rgba(255,23,68,0.1)',
                    color: 'rgba(255,23,68,0.7)', width: '100%', cursor: 'pointer',
                    transition: 'all 0.2s', fontWeight: 600
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,23,68,0.1)'; e.currentTarget.style.color = '#ff1744'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,23,68,0.05)'; e.currentTarget.style.color = 'rgba(255,23,68,0.7)'; }}
             >
                <LogOut size={18} />
                Sign Out
             </button>
          </div>
        </div>

        {/* Content Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="card" style={{ padding: 28, border: '1px solid rgba(255,193,7,0.1)', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'white', letterSpacing: '-0.3px' }}>
                {tabs.find(t => t.id === activeTab)?.name} Details
              </h3>
              <button className="btn-primary" style={{ padding: '8px 20px', fontSize: 13, background: 'var(--grad-luxury)', color: '#000', fontWeight: 800, border: 'none' }} onClick={saveProfile}>
                <Save size={16} /> Save Changes
              </button>
            </div>

            {activeTab === 'profile' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div style={{ display: 'flex', gap: 20, alignItems: 'center', padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.05)', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)' }}>
                    <div style={{ position: 'relative' }}>
                        <div style={{ width: 80, height: 80, borderRadius: 24, background: 'var(--grad-luxury)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 28, fontWeight: 800, boxShadow: 'var(--shadow-gold)' }}>
                            {localUser.firstName.charAt(0)}{localUser.lastName.charAt(0)}
                        </div>
                        <div style={{ position: 'absolute', bottom: -5, right: -5, width: 24, height: 24, borderRadius: '50%', background: '#00e5ff', border: '3px solid #04050a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }}></div>
                        </div>
                    </div>
                    <div>
                        <div style={{ color: 'white', fontWeight: 700, fontSize: 18, marginBottom: 2 }}>{localUser.firstName} {localUser.lastName}</div>
                        <div style={{ color: 'var(--t-muted)', fontSize: 13, marginBottom: 8 }}>Super Administrator • Workspace Owner</div>
                        <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,193,7,0.2)', color: 'var(--gold)', fontSize: 12, padding: '4px 12px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, transition: 'var(--trans)' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,193,7,0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>Update Avatar</button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    <div className="form-group">
                        <label className="form-label" style={{ color: 'var(--t-muted)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '1px' }}>First Name</label>
                        <input className="form-input" name="firstName" value={localUser.firstName} onChange={handleProfileChange} style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)' }} />
                    </div>
                    <div className="form-group">
                        <label className="form-label" style={{ color: 'var(--t-muted)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '1px' }}>Last Name</label>
                        <input className="form-input" name="lastName" value={localUser.lastName} onChange={handleProfileChange} style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)' }} />
                    </div>
                </div>
                <div className="form-group">
                    <label className="form-label" style={{ color: 'var(--t-muted)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '1px' }}>Email Address</label>
                    <input className="form-input" name="email" value={localUser.email} onChange={handleProfileChange} style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)' }} />
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                <div>
                    <h4 style={{ color: 'white', fontSize: 16, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Shield size={18} color="var(--gold)" /> Authentication Security
                    </h4>
                    <div style={{ display: 'grid', gap: 20 }}>
                        <div className="form-group">
                            <label className="form-label">Current Password</label>
                            <input type="password" placeholder="••••••••" className="form-input" />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                            <div className="form-group">
                                <label className="form-label">New Password</label>
                                <input type="password" placeholder="Min. 8 chars" className="form-input" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Confirm New Password</label>
                                <input type="password" placeholder="Re-type password" className="form-input" />
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ padding: 20, borderRadius: 16, border: '1px solid rgba(255,193,7,0.1)', background: 'linear-gradient(90deg, rgba(255,193,7,0.03), transparent)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ color: 'white', fontWeight: 600, fontSize: 15 }}>Two-Factor Authentication</div>
                            <div style={{ color: 'var(--t-muted)', fontSize: 13 }}>Protect your account with an extra security layer.</div>
                        </div>
                        <button 
                            onClick={() => toggleSwitch('mfa')}
                            style={{ 
                                width: 44, height: 24, borderRadius: 12, 
                                background: toggles.mfa ? 'rgba(255,193,7,0.1)' : 'rgba(255,255,255,0.05)', 
                                border: `1px solid ${toggles.mfa ? 'rgba(255,193,7,0.3)' : 'rgba(255,255,255,0.1)'}`, 
                                position: 'relative', cursor: 'pointer', transition: 'var(--trans)'
                            }}
                        >
                            <div style={{ 
                                position: 'absolute', 
                                left: toggles.mfa ? 'auto' : 3, 
                                right: toggles.mfa ? 3 : 'auto', 
                                top: 3, bottom: 3, width: 16, borderRadius: '50%', 
                                background: toggles.mfa ? 'var(--gold)' : 'rgba(255,255,255,0.2)',
                                transition: 'var(--trans)',
                                boxShadow: toggles.mfa ? '0 0 8px var(--gold)' : 'none'
                             }}></div>
                        </button>
                    </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <h4 style={{ color: 'white', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Communication Preferences</h4>
                {[
                    { id: 'emailNotif', title: "Email Notifications", desc: "Receive weekly lead performance reports" },
                    { id: 'desktopAlerts', title: "Desktop Alerts", desc: "Real-time popups when a lead is converted" },
                    { id: 'systemUpdates', title: "System Updates", desc: "Important news about new luxury features" },
                ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                        <div>
                            <div style={{ color: 'white', fontWeight: 600, fontSize: 14 }}>{item.title}</div>
                            <div style={{ color: 'var(--t-muted)', fontSize: 12 }}>{item.desc}</div>
                        </div>
                        <button 
                            onClick={() => toggleSwitch(item.id)}
                            style={{ 
                                width: 40, height: 20, borderRadius: 10, 
                                background: toggles[item.id] ? 'rgba(0,229,255,0.1)' : 'rgba(255,255,255,0.05)', 
                                border: `1px solid ${toggles[item.id] ? 'rgba(0,229,255,0.3)' : 'rgba(255,255,255,0.08)'}`,
                                position: 'relative', cursor: 'pointer', transition: 'var(--trans)' 
                            }}
                        >
                            <div style={{ 
                                position: 'absolute', 
                                left: toggles[item.id] ? 'auto' : 3, 
                                right: toggles[item.id] ? 3 : 'auto', 
                                top: 3, bottom: 3, width: 14, borderRadius: '50%', 
                                background: toggles[item.id] ? '#00e5ff' : 'rgba(255,255,255,0.2)',
                                transition: 'var(--trans)',
                                boxShadow: toggles[item.id] ? '0 0 6px #00e5ff' : 'none'
                            }}></div>
                        </button>
                    </div>
                ))}
              </div>
            )}

            {activeTab === 'appearance' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div style={{ padding: 16, border: '1px solid rgba(0,229,255,0.2)', borderRadius: 12, background: 'rgba(0,229,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                        <Zap size={18} color="#00e5ff" />
                        <span style={{ color: 'white', fontWeight: 700 }}>Exclusive Pro Theme Active</span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--t-muted)', margin: 0 }}>You are currently utilizing the bespoke Luxury Neo interface with advanced glassmorphism filters.</p>
                </div>

                <div>
                    <label className="form-label" style={{ marginBottom: 16, color: 'white', fontWeight: 600 }}>Accent Signature</label>
                    <div style={{ display: 'flex', gap: 16 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 14, background: 'var(--gold)', border: '3px solid white', cursor: 'pointer', boxShadow: 'var(--shadow-gold)' }}></div>
                        <div style={{ width: 40, height: 40, borderRadius: 14, background: '#ff1744', opacity: 0.5, cursor: 'pointer' }}></div>
                        <div style={{ width: 40, height: 40, borderRadius: 14, background: '#00e5ff', opacity: 0.5, cursor: 'pointer' }}></div>
                    </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
