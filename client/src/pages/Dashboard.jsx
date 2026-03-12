import React, { useState, useEffect } from 'react';
import { Users, UserPlus, PhoneForwarded, Trophy, ArrowUpRight, TrendingUp, Inbox, Zap, Target, Activity } from 'lucide-react';
import { leadService } from '../services/api';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(6,10,22,0.95)', backdropFilter: 'blur(16px)',
        border: '1px solid rgba(0,229,255,0.2)', borderRadius: 12,
        padding: '10px 16px', boxShadow: '0 8px 32px rgba(0,0,0,0.8), 0 0 20px rgba(0,229,255,0.15)'
      }}>
        <div style={{ color: 'var(--t-muted)', fontSize: 11, fontWeight: 600, letterSpacing: '0.8px', marginBottom: 4 }}>{label}</div>
        <div style={{ color: '#00e5ff', fontSize: 20, fontWeight: 800 }}>{payload[0].value} <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--t-muted)' }}>leads</span></div>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const { data } = await leadService.getLeads();
      setLeads(data);
    } catch (e) {
      console.error('Dashboard error:', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 48, height: 48, border: '3px solid rgba(0,229,255,0.1)',
            borderTopColor: '#00e5ff', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            boxShadow: '0 0 20px rgba(0,229,255,0.3)'
          }} />
          <span style={{ color: 'var(--t-muted)', fontWeight: 600, fontSize: 13, letterSpacing: '0.5px' }}>Loading analytics…</span>
        </div>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="empty-state page-anim" style={{ maxWidth: 440 }}>
          <div className="empty-icon"><Inbox size={32} /></div>
          <h2 className="empty-title">Welcome to LeadCRM</h2>
          <p className="empty-desc">Your dashboard is empty. Add your first lead to unlock powerful analytics and start closing deals.</p>
          <button className="btn-primary" onClick={() => window.location.href = '/leads'}>
            <UserPlus size={18} /> Add First Lead
          </button>
        </div>
      </div>
    );
  }

  const totals = {
    all: leads.length,
    new: leads.filter(l => l.status === 'New').length,
    contacted: leads.filter(l => l.status === 'Contacted').length,
    converted: leads.filter(l => l.status === 'Converted').length,
    lost: leads.filter(l => l.status === 'Lost').length,
  };
  const winRate = ((totals.converted / (totals.all || 1)) * 100).toFixed(1);

  const areaData = [
    { name: 'Jan', leads: Math.floor(totals.all * 0.2) },
    { name: 'Feb', leads: Math.floor(totals.all * 0.32) },
    { name: 'Mar', leads: Math.floor(totals.all * 0.47) },
    { name: 'Apr', leads: Math.floor(totals.all * 0.61) },
    { name: 'May', leads: Math.floor(totals.all * 0.82) },
    { name: 'Jun', leads: totals.all },
  ];

  const recentActivity = [...leads]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5);

  const statusData = [
    { label: 'New',       count: totals.new,       color: '#00e5ff', grad: 'linear-gradient(90deg, #00e5ff, #0288d1)' },
    { label: 'Contacted', count: totals.contacted, color: '#ffb700', grad: 'linear-gradient(90deg, #ffb700, #e65100)' },
    { label: 'Converted', count: totals.converted, color: '#00e676', grad: 'linear-gradient(90deg, #00e676, #00c853)' },
    { label: 'Lost',      count: totals.lost,      color: '#5c7a99', grad: 'linear-gradient(90deg, #5c7a99, #2a3a55)' },
  ].filter(s => s.count > 0);

  const statCards = [
    { label: 'Total Leads',  val: totals.all,       icon: <Users size={20} />,         cls: 'bg-g-blue',   trend: '+12%', trendUp: true,  sub: 'vs last month' },
    { label: 'New Leads',    val: totals.new,        icon: <UserPlus size={20} />,       cls: 'bg-g-purple', trend: null,   trendUp: false, sub: 'Awaiting outreach' },
    { label: 'Contacted',    val: totals.contacted,  icon: <PhoneForwarded size={20} />, cls: 'bg-g-orange', trend: null,   trendUp: false, sub: 'Active communication' },
    { label: 'Win Rate',     val: `${winRate}%`,     icon: <Trophy size={20} />,         cls: 'bg-g-green',  trend: `${totals.converted} deals`, trendUp: true, sub: 'Converted leads' },
  ];

  const avatarColors = ['#ff1744', '#00e5ff', '#d500f9', '#ffb700', '#00e676'];

  return (
    <div style={{ paddingBottom: 48 }}>

      {/* ── Stat Cards ─────────────────────────────── */}
      <div className="stats-grid page-anim">
        {statCards.map((s, i) => (
          <div key={s.label} className="stat-card" style={{ animationDelay: `${i * 0.07}s` }}>
            {/* Top glow line */}
            <div style={{
              position: 'absolute', top: 0, left: '20%',
              width: '60%', height: 1,
              background: i % 2 === 0
                ? 'linear-gradient(90deg, transparent, rgba(255,23,68,0.5), transparent)'
                : 'linear-gradient(90deg, transparent, rgba(0,229,255,0.5), transparent)'
            }} />
            <div className="stat-top">
              <div>
                <div className="stat-label">{s.label}</div>
              </div>
              <div className={`stat-icon-wrap ${s.cls}`}>{s.icon}</div>
            </div>
            <div className="stat-val">{s.val}</div>
            <div className="stat-trend" style={{ color: s.trendUp ? '#00e676' : 'var(--t-muted)' }}>
              {s.trendUp && <ArrowUpRight size={14} />}
              {s.trend ? s.trend : s.sub}
              {!s.trend && <span style={{ color: 'var(--t-dim)', marginLeft: 4, fontWeight: 400 }}>{s.sub !== s.trend && ''}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* ── Charts Row ─────────────────────────────── */}
      <div className="page-anim" style={{
        display: 'grid', gridTemplateColumns: 'minmax(0,2fr) minmax(0,1fr)',
        gap: 20, marginBottom: 20, animationDelay: '0.3s'
      }}>

        {/* Growth Chart */}
        <div className="card" style={{ padding: '24px 20px 16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, padding: '0 8px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 10,
                  background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#00e5ff'
                }}>
                  <Activity size={16} />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--t-main)', letterSpacing: '-0.3px' }}>Lead Growth</h3>
              </div>
              <p style={{ fontSize: 12, color: 'var(--t-muted)', marginLeft: 42 }}>Cumulative acquisition over 6 months</p>
            </div>
            <select className="form-select" style={{ padding: '6px 12px', fontSize: 12, height: 'fit-content', borderRadius: 10 }}>
              <option>Last 6 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData} margin={{ top: 5, right: 16, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradRed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#ff1744" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#ff1744" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradBlue" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%"   stopColor="#ff1744" />
                    <stop offset="100%" stopColor="#00e5ff" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,229,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--t-muted)', fontWeight: 600, letterSpacing: '0.5px' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--t-muted)', fontWeight: 600 }} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="leads" stroke="url(#gradBlue)" strokeWidth={2.5} fillOpacity={1} fill="url(#gradRed)" dot={false} activeDot={{ r: 5, fill: '#00e5ff', stroke: 'rgba(0,229,255,0.3)', strokeWidth: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: 'rgba(255,23,68,0.1)', border: '1px solid rgba(255,23,68,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#ff1744'
            }}>
              <Target size={16} />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--t-main)', letterSpacing: '-0.3px' }}>Pipeline</h3>
          </div>
          <p style={{ fontSize: 12, color: 'var(--t-muted)', marginBottom: 28, marginLeft: 42 }}>Lead status distribution</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            {statusData.map((s) => {
              const pct = ((s.count / totals.all) * 100).toFixed(1);
              return (
                <div key={s.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, boxShadow: `0 0 6px ${s.color}` }} />
                      <span style={{ fontWeight: 700, color: 'var(--t-main)', fontSize: 13 }}>{s.label}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 800, color: s.color, fontSize: 15 }}>{s.count}</span>
                      <span style={{ fontSize: 11, color: 'var(--t-muted)', fontWeight: 500 }}>{pct}%</span>
                    </div>
                  </div>
                  <div className="progress-container">
                    <div style={{
                      height: '100%', borderRadius: 'var(--r-full)',
                      width: `${pct}%`,
                      background: s.grad,
                      boxShadow: `0 0 8px ${s.color}60`,
                      transition: 'width 1.4s cubic-bezier(0.16,1,0.3,1)'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Win rate summary */}
          <div style={{
            marginTop: 28, padding: 16,
            background: 'rgba(0,230,118,0.06)',
            border: '1px solid rgba(0,230,118,0.15)',
            borderRadius: 12, textAlign: 'center'
          }}>
            <div style={{ fontSize: 11, color: 'var(--t-muted)', fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 4 }}>Overall Win Rate</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#00e676', letterSpacing: '-1px' }}>{winRate}%</div>
          </div>
        </div>
      </div>

      {/* ── Recent Activity ─────────────────────────────── */}
      <div className="card page-anim" style={{ padding: 0, animationDelay: '0.45s', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{
          padding: '20px 28px',
          background: 'linear-gradient(135deg, rgba(255,23,68,0.06) 0%, rgba(0,229,255,0.04) 100%)',
          borderBottom: '1px solid rgba(0,229,255,0.08)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: '#00e676', boxShadow: '0 0 8px #00e676',
              animation: 'pulse 2s infinite'
            }} />
            <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--t-main)', letterSpacing: '-0.3px' }}>Recent Activity</h3>
          </div>
          <button onClick={() => window.location.href = '/leads'} className="btn-secondary" style={{ padding: '7px 16px', fontSize: 12 }}>
            View All →
          </button>
        </div>

        {/* Rows */}
        {recentActivity.map((lead, i) => (
          <div
            key={lead._id || i}
            style={{
              padding: '14px 28px',
              borderBottom: i < recentActivity.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              transition: 'var(--trans)', cursor: 'pointer',
              animationDelay: `${0.5 + i * 0.05}s`
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,229,255,0.03)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {/* Avatar */}
              <div style={{
                width: 42, height: 42, borderRadius: 14, flexShrink: 0,
                background: `radial-gradient(circle at 30% 30%, ${avatarColors[i % avatarColors.length]}33, ${avatarColors[i % avatarColors.length]}11)`,
                border: `1px solid ${avatarColors[i % avatarColors.length]}33`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: 16,
                color: avatarColors[i % avatarColors.length],
                boxShadow: `0 0 12px ${avatarColors[i % avatarColors.length]}20`
              }}>
                {lead.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--t-main)' }}>{lead.name}</div>
                <div style={{ fontSize: 12, color: 'var(--t-muted)', marginTop: 2 }}>
                  {lead.email} &nbsp;·&nbsp;
                  <span style={{ color: 'rgba(0,229,255,0.6)', fontWeight: 600 }}>{lead.source}</span>
                </div>
              </div>
            </div>
            <span className={`badge ${lead.status}`}>{lead.status}</span>
          </div>
        ))}

        {recentActivity.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--t-muted)' }}>No recent activity.</div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
      `}</style>
    </div>
  );
}
