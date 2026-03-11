import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Search, Bell, Plus } from 'lucide-react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Sidebar from './components/Sidebar';
import Toast from './components/Toast';

function AppContent() {
  const [authed, setAuthed] = useState(() => !!localStorage.getItem("token"));
  const [sbOpen, setSbOpen] = useState(true);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");
  
  const navigate = useNavigate();
  const location = useLocation();

  const auth = () => { setAuthed(true); navigate("/"); };
  const toast2 = (msg, type) => setToast({ msg, type, id: Date.now() });

  if (!authed) {
    return <Login onAuth={auth} />;
  }

  const pageName = location.pathname === '/leads' ? "leads" : "dashboard";

  return (
    <div className="layout">
      <Sidebar isOpen={sbOpen} setIsOpen={setSbOpen} />

      <div className="main">
        {/* Top Navigation */}
        <header className="topnav">
          <div className="topnav-left">
            <h1 className="topnav-title">
              {pageName === "dashboard" ? "Dashboard" : "Lead Contacts"}
            </h1>
            <span className="topnav-sub">
              {pageName === "dashboard" ? "Overview & Analytics" : "Manage all your contacts"}
            </span>
          </div>

          <div className="topnav-right">
            <div className="search-bar" style={{ position: 'relative' }}>
              <Search className="search-icon" size={16} />
              <input 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                placeholder="Search leads, contacts, status..." 
                style={{ paddingRight: search ? 32 : 10 }}
              />
              {search && (
                <button 
                  onClick={() => setSearch("")}
                  style={{ position: 'absolute', right: 12, color: 'var(--t-muted)', background: 'transparent', border: 'none', cursor: 'pointer', padding: 4 }}
                >
                  <X size={14} />
                </button>
              )}
            </div>
            
            <button className="icon-btn">
              <Bell size={20} />
              <span className="badge-dot"></span>
            </button>

            <div className="user-profile">
              <div className="avatar">AD</div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--t-main)', lineHeight: 1.2 }}>Admin User</span>
                <span style={{ fontSize: 11, color: 'var(--t-muted)' }}>Workspace Owner</span>
              </div>
            </div>
            
            {pageName !== "dashboard" && (
                <button className="btn-primary" style={{ marginLeft: 8 }} onClick={() => navigate("/leads")}>
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
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
      {toast && <Toast key={toast.id} msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
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
