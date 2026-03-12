import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Search, Bell, Plus, X, Briefcase } from 'lucide-react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Settings from './pages/Settings';
import Sidebar from './components/Sidebar';
import Toast from './components/Toast';

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

function AppContent() {
  const [authed, setAuthed] = useState(() => !!localStorage.getItem("token"));
  const [sbOpen, setSbOpen] = useState(true);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");
  const [showNotif, setShowNotif] = useState(false);
  const [leads, setLeads] = useState([]);
  const [showSearchDrop, setShowSearchDrop] = useState(false);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("crm_user");
    return saved ? JSON.parse(saved) : { firstName: "Admin", lastName: "User", email: "admin@leadcrm.luxury" };
  });

  useEffect(() => {
    localStorage.setItem("crm_user", JSON.stringify(user));
  }, [user]);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (authed) {
      fetchLeads();
    }
  }, [authed]);

  const fetchLeads = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/leads`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await res.json();
      setLeads(data);
    } catch (err) { console.error(err); }
  };

  const handleSearchChange = (val) => {
    setSearch(val);
    setShowSearchDrop(true);
    if (val && val.trim() && location.pathname !== '/leads') {
      navigate('/leads');
    }
  };

  const handleSuggestionClick = (name) => {
    setSearch(name);
    setShowSearchDrop(false);
    if (location.pathname !== '/leads') navigate('/leads');
  };

  const auth = () => { setAuthed(true); navigate("/"); };
  const toast2 = (msg, type) => {
    setToast({ msg, type, id: Date.now() });
  };

  if (!authed) {
    return <Login onAuth={auth} />;
  }

  let pageName = "dashboard";
  if (location.pathname === '/leads') pageName = "leads";
  if (location.pathname === '/settings') pageName = "settings";

  const filteredSuggestions = leads.filter(l => 
    l.name.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 5);

  return (
    <div className="layout" onClick={() => { setShowNotif(false); setShowSearchDrop(false); }}>
      <Sidebar isOpen={sbOpen} setIsOpen={setSbOpen} />

      <div className="main">
        {/* Top Navigation */}
        <header className="topnav" style={{ padding: '0 32px', height: 80, borderBottom: '1px solid rgba(255,193,7,0.08)' }}>
          <div className="topnav-left">
            <h1 className="topnav-title" style={{ fontSize: 22, fontWeight: 800 }}>
              {pageName === "dashboard" ? "Intelligent Dashboard" : pageName === "leads" ? "Lead Repository" : "System Configuration"}
            </h1>
            <span className="topnav-sub" style={{ opacity: 0.7, fontSize: 13 }}>
              {pageName === "dashboard" ? "Enterprise Analytics & Pipeline" : pageName === "leads" ? "Curated high-value contacts" : "Bespoke workspace preferences"}
            </span>
          </div>

          <div className="topnav-right">
            <div className="search-bar" style={{ position: 'relative', width: 320 }} onClick={e => e.stopPropagation()}>
              <Search className="search-icon" size={16} color="var(--t-muted)" />
              <input 
                value={search} 
                onChange={e => handleSearchChange(e.target.value)}
                onFocus={() => setShowSearchDrop(true)}
                placeholder="Search premium network..." 
                style={{ 
                  paddingRight: search ? 60 : 16,
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 14, height: 44
                }}
              />
              {search && (
                <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: 8 }}>
                    <button 
                        onClick={() => { handleSearchChange(""); setShowSearchDrop(false); }}
                        style={{ color: 'var(--t-muted)', background: 'transparent', border: 'none', cursor: 'pointer', padding: 4 }}
                    >
                        <X size={14} />
                    </button>
                </div>
              )}

              {showSearchDrop && filteredSuggestions.length > 0 && (
                  <div className="card" style={{ position: 'absolute', top: 52, left: 0, right: 0, zIndex: 1000, padding: '8px 0', border: '1px solid rgba(255,193,7,0.2)', boxShadow: 'var(--shadow-gold)', background: 'rgba(6,10,18,0.98)', backdropFilter: 'blur(20px)' }}>
                      <div style={{ padding: '4px 16px 8px 16px', fontSize: 11, color: 'var(--gold)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Lead Suggestions</div>
                      {filteredSuggestions.map((l, i) => (
                          <div 
                            key={i} 
                            onClick={() => handleSuggestionClick(l.name)}
                            style={{ padding: '10px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, transition: 'var(--trans)' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,193,7,0.08)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >
                              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--grad-luxury)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#000', fontWeight: 800 }}>
                                  {l.name.charAt(0)}
                              </div>
                              <div style={{ flex: 1 }}>
                                  <div style={{ fontSize: 13, color: 'white', fontWeight: 600 }}>{l.name}</div>
                                  <div style={{ fontSize: 11, color: 'var(--t-muted)' }}>{l.email}</div>
                              </div>
                          </div>
                      ))}
                  </div>
              )}
            </div>
            
            <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
                <button className="icon-btn" onClick={() => setShowNotif(!showNotif)} style={{ background: showNotif ? 'rgba(0,229,255,0.1)' : 'transparent' }}>
                <Bell size={20} color={showNotif ? '#00e5ff' : 'var(--t-muted)'} />
                {!showNotif && <span className="badge-dot" style={{ background: 'var(--gold)', boxShadow: '0 0 8px var(--gold)' }}></span>}
                </button>

                {showNotif && (
                    <div className="card" style={{ position: 'absolute', top: 52, right: 0, width: 320, padding: '16px 0', zIndex: 1100, border: '1px solid rgba(255,193,7,0.2)', boxShadow: 'var(--shadow-gold)', background: 'rgba(6,10,18,0.98)', backdropFilter: 'blur(20px)' }}>
                        <div style={{ padding: '0 20px 12px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 700, fontSize: 13, color: 'white' }}>Notifications</span>
                            <span style={{ fontSize: 11, color: 'var(--gold)', cursor: 'pointer' }} onClick={() => navigate("/settings", { state: { activeTab: 'notifications' } })}>Configure Alerts</span>
                        </div>
                        <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                            {[
                                { title: "New high-value lead added", time: "2m ago", icon: <Plus size={14} />, color: "#00e5ff" },
                                { title: "Pipeline report ready", time: "1h ago", icon: <Briefcase size={14} />, color: "var(--gold)" },
                                { title: "Status sync successful", time: "3h ago", icon: <Briefcase size={14} />, color: "#00e676" },
                            ].map((n, i) => (
                                <div key={i} style={{ padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.03)', display: 'flex', gap: 12, cursor: 'pointer' }} 
                                    onClick={() => { navigate("/settings", { state: { activeTab: 'notifications' } }); setShowNotif(false); }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'} 
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    <div style={{ width: 32, height: 32, borderRadius: 8, background: n.color + '18', color: n.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        {n.icon}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 13, color: 'white', fontWeight: 500 }}>{n.title}</div>
                                        <div style={{ fontSize: 11, color: 'var(--t-muted)' }}>{n.time}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="user-profile" onClick={() => navigate("/settings", { state: { activeTab: 'profile' } })} style={{ cursor: 'pointer', padding: '4px 12px', borderRadius: 14, transition: 'var(--trans)' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <div className="avatar" style={{ background: 'var(--grad-luxury)', boxShadow: 'var(--shadow-gold)', fontWeight: 800 }}>
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'white', lineHeight: 1.2 }}>{user.firstName} {user.lastName}</span>
                <span style={{ fontSize: 11, color: 'var(--gold)', fontWeight: 600 }}>Elite Access</span>
              </div>
            </div>
            
            {pageName !== "dashboard" && (
                <button className="btn-primary" style={{ marginLeft: 8, background: 'var(--grad-brand)', border: 'none', boxShadow: 'var(--shadow-md)' }} onClick={() => navigate("/leads")}>
                    <Plus size={16} /> New Lead
                </button>
            )}
          </div>
        </header>

        {/* Page Content */}
        <div className="content-scroll page-anim" key={location.pathname}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/leads" element={<Leads searchStr={search} onToast={toast2} />} />
            <Route path="/settings" element={<Settings onToast={toast2} user={user} setUser={setUser} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
      {toast && (
        <div className="toast-container">
            <Toast key={toast.id} msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
