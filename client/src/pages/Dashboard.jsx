import React, { useState, useEffect } from 'react';
import { Users, UserPlus, PhoneForwarded, Trophy, ArrowUpRight, TrendingUp, Inbox } from 'lucide-react';
import { leadService } from '../services/api';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';

export default function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await leadService.getLeads();
      setLeads(data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 100 }}>
        <div className="card" style={{ padding: '20px 40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 16, height: 16, border: '2px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <span style={{ fontWeight: 500, color: 'var(--t-main)' }}>Loading analytics...</span>
          </div>
        </div>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="empty-state page-anim">
          <div className="empty-icon"><Inbox size={32} /></div>
          <h2 className="empty-title">Welcome to LeadCRM</h2>
          <p className="empty-desc">Your dashboard is looking a little empty. Add your first lead to unlock powerful lead analytics and start closing deals.</p>
          <button className="btn-primary" onClick={() => window.location.href='/leads'}>
            <UserPlus size={18} /> Add First Lead
          </button>
        </div>
      </div>
    );
  }

  const totals = {
    all: leads.length,
    new: leads.filter(l => l.status === "New").length,
    contacted: leads.filter(l => l.status === "Contacted").length,
    converted: leads.filter(l => l.status === "Converted").length,
    lost: leads.filter(l => l.status === "Lost").length,
  };

  // Mocking area data based on current totals for the demo
  const areaData = [
    { name: 'Jan', leads: Math.floor(totals.all * 0.2) },
    { name: 'Feb', leads: Math.floor(totals.all * 0.3) },
    { name: 'Mar', leads: Math.floor(totals.all * 0.45) },
    { name: 'Apr', leads: Math.floor(totals.all * 0.6) },
    { name: 'May', leads: Math.floor(totals.all * 0.8) },
    { name: 'Jun', leads: totals.all }
  ];

  const recentActivity = [...leads]
    .sort((a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now()))
    .slice(0, 4);

  // Status Distribution Progress Bar Data
  const statusData = [
    { label: 'New', count: totals.new, color: '#39ff14' },
    { label: 'Contacted', count: totals.contacted, color: '#ffa500' },
    { label: 'Converted', count: totals.converted, color: '#ff073a' },
    { label: 'Lost', count: totals.lost, color: '#a0a0a0' }
  ].filter(s => s.count > 0);

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* Stat Cards */}
      <div className="stats-grid page-anim">
        <div className="stat-card">
          <div className="stat-top">
            <span className="stat-label">Total Leads</span>
            <div className="stat-icon-wrap bg-g-blue">
              <Users size={20} />
            </div>
          </div>
          <span className="stat-val">{totals.all}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 12, fontSize: 13, color: '#10b981', fontWeight: 600 }}>
            <ArrowUpRight size={16} /> 12% from last month
          </div>
        </div>

        <div className="stat-card" style={{ animationDelay: '0.05s' }}>
          <div className="stat-top">
            <span className="stat-label">New Leads</span>
            <div className="stat-icon-wrap bg-g-purple">
              <UserPlus size={20} />
            </div>
          </div>
          <span className="stat-val">{totals.new}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 12, fontSize: 13, color: 'var(--t-muted)' }}>
            Awaiting outreach
          </div>
        </div>

        <div className="stat-card" style={{ animationDelay: '0.1s' }}>
          <div className="stat-top">
            <span className="stat-label">Contacted</span>
            <div className="stat-icon-wrap bg-g-orange">
              <PhoneForwarded size={20} />
            </div>
          </div>
          <span className="stat-val">{totals.contacted}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 12, fontSize: 13, color: 'var(--t-muted)' }}>
            In active communication
          </div>
        </div>

        <div className="stat-card" style={{ animationDelay: '0.15s' }}>
          <div className="stat-top">
            <span className="stat-label">Converted</span>
            <div className="stat-icon-wrap bg-g-green">
              <Trophy size={20} />
            </div>
          </div>
          <span className="stat-val">{totals.converted}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 12, fontSize: 13, color: '#10b981', fontWeight: 600 }}>
            <TrendingUp size={16} /> {(totals.converted / (totals.all || 1) * 100).toFixed(1)}% Win Rate
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="page-anim" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: 24, marginBottom: 24, animationDelay: '0.2s' }}>
        
        {/* Growth Chart */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--t-main)' }}>Lead Growth</h3>
              <p style={{ fontSize: 13, color: 'var(--t-muted)', margin: '4px 0 0 0' }}>Total leads acquired over time</p>
            </div>
            <select className="form-select" style={{ padding: '6px 12px', fontSize: 13, height: 'fit-content' }}>
              <option>Last 6 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <div style={{ height: 280, marginLeft: -20 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--t-muted)', fontWeight: 500 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--t-muted)', fontWeight: 500 }} />
                <RechartsTooltip 
                  contentStyle={{ background: 'rgba(10, 12, 16, 0.9)', backdropFilter: 'blur(8px)', borderRadius: 12, border: '1px solid rgba(57, 255, 20, 0.15)', boxShadow: 'var(--shadow-lg)' }}
                  itemStyle={{ color: 'var(--t-main)', fontWeight: 700 }}
                />
                <Area type="monotone" dataKey="leads" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution - Custom Progress Bars */}
        <div className="card">
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--t-main)' }}>Lead Status Breakout</h3>
            <p style={{ fontSize: 13, color: 'var(--t-muted)', margin: '4px 0 24px 0' }}>Current lead composition</p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {statusData.map((status, i) => {
              const percentage = ((status.count / totals.all) * 100).toFixed(1);
              return (
                <div key={status.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
                    <span style={{ fontWeight: 600, color: 'var(--t-main)' }}>{status.label}</span>
                    <span style={{ fontWeight: 600, color: 'var(--t-muted)' }}>{status.count} <span style={{ fontSize: 12, fontWeight: 500, opacity: 0.7 }}>({percentage}%)</span></span>
                  </div>
                  <div className="progress-container">
                    <div 
                      className={`progress-bar ${status.label === 'New' ? 'striped' : ''}`}
                      style={{ 
                        width: `${percentage}%`, 
                        background: status.color,
                        boxShadow: `0 0 10px ${status.color}40`
                      }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card page-anim" style={{ padding: 0, animationDelay: '0.3s' }}>
        <div style={{ padding: '24px 32px', borderBottom: 'var(--border)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--t-main)' }}>Recent Lead Activity</h3>
        </div>
        <div>
          {recentActivity.map((lead, i) => (
            <div key={lead._id || i} style={{ 
              padding: '16px 32px', 
              borderBottom: i < recentActivity.length - 1 ? '1px solid rgba(0,0,0,0.03)' : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              transition: 'var(--trans)', cursor: 'pointer'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ 
                  width: 44, height: 44, borderRadius: '50%', 
                  background: 'var(--accent-light)', color: 'var(--primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 16, boxShadow: 'inset 0 0 0 1px rgba(255,7,58,0.2)'
                }}>
                  {lead.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--t-main)' }}>{lead.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--t-muted)', marginTop: 2 }}>{lead.email} &bull; via {lead.source}</div>
                </div>
              </div>
              <span className={`badge ${lead.status}`}>{lead.status}</span>
            </div>
          ))}
          {recentActivity.length === 0 && (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--t-muted)' }}>No recent activity to show.</div>
          )}
        </div>
      </div>

    </div>
  );
}
