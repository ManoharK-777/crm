import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, MessageSquare, Briefcase, Filter, X, Inbox } from 'lucide-react';
import { leadService } from '../services/api';

export default function Leads({ searchStr, onToast }) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  // Modals state
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState(null); // null = add new, obj = edit
  const [showNotes, setShowNotes] = useState(false);
  const [noteLead, setNoteLead] = useState(null);
  const [delConfirm, setDelConfirm] = useState(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const { data } = await leadService.getLeads();
      setLeads(data);
    } catch (error) {
      onToast("Failed to load leads", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const leadObj = Object.fromEntries(formData.entries());

    try {
      if (editData?._id) {
        await leadService.updateLead(editData._id, leadObj);
        onToast("Lead updated successfully", "success");
      } else {
        await leadService.addLead(leadObj);
        onToast("New lead added", "success");
      }
      setShowEdit(false);
      fetchLeads();
    } catch (error) {
      onToast("Error saving lead", "error");
    }
  };

  const handleDelete = async () => {
    try {
      await leadService.deleteLead(delConfirm);
      onToast("Lead deleted permanently", "success");
      setDelConfirm(null);
      fetchLeads();
    } catch (error) {
      onToast("Failed to delete lead", "error");
    }
  };

  const addNote = async (e) => {
    e.preventDefault();
    const content = e.target.note.value;
    if (!content.trim()) return;

    try {
      const { data } = await leadService.addNote(noteLead._id, content);
      setNoteLead(data);
      e.target.reset();
      fetchLeads();
    } catch (error) {
      onToast("Error adding note", "error");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await leadService.updateStatus(id, status);
      onToast(`Status updated to ${status}`, "success");
      fetchLeads();
    } catch (err) {
      onToast("Status update failed", "error");
    }
  };

  const filteredLeads = leads.filter(l => {
    const matchesSearch = !searchStr || 
      l.name.toLowerCase().includes(searchStr.toLowerCase()) || 
      l.email.toLowerCase().includes(searchStr.toLowerCase());
    const matchesFilter = filter === "All" || l.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="page-anim" style={{ paddingBottom: 40 }}>
      {/* Table & Controls wrapper */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid rgba(0,229,255,0.1)' }}>
        <div className="table-header" style={{ 
          padding: '24px 28px', 
          background: 'linear-gradient(180deg, rgba(0,229,255,0.04), transparent)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <h2 style={{ 
              fontSize: 20, fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: 12, margin: 0 
            }}>
              <div style={{ 
                width: 32, height: 32, borderRadius: 8, background: 'rgba(255,193,7,0.1)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)'
              }}>
                <Briefcase size={18} /> 
              </div>
              Leads Database
              <span style={{ 
                fontSize: 12, color: 'var(--gold)', fontWeight: 600, background: 'rgba(255,193,7,0.1)', 
                padding: '2px 10px', borderRadius: 20, border: '1px solid rgba(255,193,7,0.2)', boxShadow: 'var(--shadow-gold)'
              }}>
                {filteredLeads.length} Total
              </span>
            </h2>
            {searchStr && (
              <div style={{ fontSize: 13, color: 'var(--t-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Search size={14} color="var(--gold)" /> Showing results for "<span style={{ color: 'var(--gold)', fontWeight: 600 }}>{searchStr}</span>"
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ 
              display: 'flex', alignItems: 'center', gap: 10, 
              background: 'rgba(0,0,0,0.3)', padding: '0 16px', height: 44,
              borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)',
              transition: 'border-color 0.2s'
            }}>
              <Filter size={14} color="var(--t-muted)" />
              <select 
                value={filter} 
                onChange={e => setFilter(e.target.value)} 
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 14, fontWeight: 500, color: 'white', cursor: 'pointer' }}
              >
                <option value="All">All Status</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Converted">Converted</option>
                <option value="Lost">Lost</option>
              </select>
            </div>
            
            <button className="btn-primary" style={{ height: 44, padding: '0 20px', background: 'var(--grad-luxury)', border: 'none', boxShadow: 'var(--shadow-gold)', color: '#000', fontWeight: 800 }} onClick={() => { setEditData(null); setShowEdit(true); }}>
              <Plus size={18} /> Add Lead
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: 100, textAlign: 'center' }}>
            <div style={{ 
              width: 32, height: 32, border: '3px solid rgba(0,229,255,0.1)', 
              borderTopColor: '#00e5ff', borderRadius: '50%', 
              animation: 'spin 0.8s linear infinite', margin: '0 auto 16px auto',
              boxShadow: '0 0 15px rgba(0,229,255,0.2)'
            }}></div>
            <div style={{ color: 'var(--t-muted)', fontSize: 14, fontWeight: 500, letterSpacing: '0.5px' }}>Syncing with database...</div>
          </div>
        ) : leads.length === 0 ? (
          <div style={{ padding: '100px 40px', textAlign: 'center' }}>
            <div style={{ 
              width: 80, height: 80, borderRadius: '24px', background: 'rgba(255,255,255,0.03)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--t-muted)',
              margin: '0 auto 24px auto', border: '1px solid rgba(255,255,255,0.05)'
            }}><Inbox size={40} strokeWidth={1.5} /></div>
            <h3 style={{ fontSize: 20, color: 'white', marginBottom: 8 }}>Your database is empty</h3>
            <p style={{ color: 'var(--t-muted)', maxWidth: 400, margin: '0 auto 24px auto', fontSize: 15, lineHeight: 1.6 }}>Start growing your pipeline by adding your first lead manually.</p>
            <button className="btn-primary" onClick={() => { setEditData(null); setShowEdit(true); }}>
              <Plus size={18} /> Create First Lead
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <th style={{ padding: '16px 28px', textAlign: 'left', fontSize: 13, color: 'var(--t-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Contact Info</th>
                  <th style={{ padding: '16px 28px', textAlign: 'left', fontSize: 13, color: 'var(--t-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Source</th>
                  <th style={{ padding: '16px 28px', textAlign: 'center', fontSize: 13, color: 'var(--t-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '16px 28px', textAlign: 'left', fontSize: 13, color: 'var(--t-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Added On</th>
                  <th style={{ padding: '16px 28px', textAlign: 'right', fontSize: 13, color: 'var(--t-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.length > 0 ? filteredLeads.map((lead, idx) => (
                  <tr key={lead._id} className="table-row-hover" style={{ 
                    borderBottom: '1px solid rgba(255,255,255,0.03)', 
                    transition: 'background 0.2s',
                    animation: `fade-up 0.4s ease-out ${idx * 0.03}s both`
                  }}>
                    <td style={{ padding: '18px 28px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ 
                            width: 38, height: 38, borderRadius: 12, 
                            background: lead.status === 'Converted' ? 'var(--grad-brand)' : 'rgba(255,255,255,0.05)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontWeight: 700, fontSize: 14,
                            boxShadow: lead.status === 'Converted' ? '0 0 12px rgba(0,229,255,0.2)' : 'none'
                        }}>
                          {lead.name.charAt(0)}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ color: 'white', fontWeight: 600, fontSize: 15 }}>{lead.name}</span>
                          <span style={{ color: 'var(--t-muted)', fontSize: 13 }}>{lead.email}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '18px 28px' }}>
                      <span style={{ fontSize: 14, color: 'white', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00e5ff' }}></div>
                        {lead.source}
                      </span>
                    </td>
                    <td style={{ padding: '18px 28px', textAlign: 'center' }}>
                      <select 
                        className={`badge ${lead.status}`} 
                        value={lead.status}
                        onChange={(e) => updateStatus(lead._id, e.target.value)}
                        style={{ padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, border: 'none', outline: 'none', cursor: 'pointer', margin: '0 auto' }}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Converted">Converted</option>
                        <option value="Lost">Lost</option>
                      </select>
                    </td>
                    <td style={{ padding: '18px 28px' }}>
                      <span style={{ fontSize: 14, color: 'var(--t-muted)' }}>{new Date(lead.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </td>
                    <td style={{ padding: '18px 28px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                        <button className="action-btn" title="View Notes" onClick={() => { setNoteLead(lead); setShowNotes(true); }} style={{ width: 34, height: 34, borderRadius: 8 }}>
                          <MessageSquare size={15} />
                        </button>
                        <button className="action-btn" title="Edit Lead" onClick={() => { setEditData(lead); setShowEdit(true); }} style={{ width: 34, height: 34, borderRadius: 8 }}>
                          <Edit2 size={15} />
                        </button>
                        <button className="action-btn delete" title="Delete Lead" onClick={() => setDelConfirm(lead._id)} style={{ width: 34, height: 34, borderRadius: 8 }}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" style={{ padding: 60, textAlign: 'center' }}>
                      <div style={{ color: 'var(--t-muted)', fontSize: 14 }}>No leads match your search criteria.</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals Container */}
      {showEdit && (
        <div className="modal-overlay" onClick={() => setShowEdit(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editData ? 'Edit Contact' : 'New Lead'}</h3>
              <button className="modal-close" onClick={() => setShowEdit(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body form-group-wrap">
                <div className="form-group full">
                  <label className="form-label">Full Name</label>
                  <input required name="name" className="form-input" defaultValue={editData?.name} placeholder="e.g. Jane Doe" />
                </div>
                <div className="form-group full">
                  <label className="form-label">Email Address</label>
                  <input required name="email" type="email" className="form-input" defaultValue={editData?.email} placeholder="jane@company.com" />
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select name="status" className="form-select" defaultValue={editData?.status || "New"}>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Converted">Converted</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Lead Source</label>
                  <select name="source" className="form-select" defaultValue={editData?.source || "Website"}>
                    <option value="Website">Website</option>
                    <option value="Referral">Referral</option>
                    <option value="Cold Call">Cold Call</option>
                    <option value="Event">Event</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowEdit(false)}>Cancel</button>
                <button type="submit" className="btn-primary">{editData ? 'Save Changes' : 'Create Lead'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showNotes && noteLead && (
        <div className="modal-overlay" onClick={() => setShowNotes(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title" style={{ fontSize: 18 }}>Activity & Notes</h3>
                <p style={{ fontSize: 13, color: 'var(--t-muted)' }}>{noteLead.name} ({noteLead.email})</p>
              </div>
              <button className="modal-close" onClick={() => setShowNotes(false)}><X size={20} /></button>
            </div>
            
            <div className="modal-body" style={{ maxHeight: '50vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {(!noteLead.notes || noteLead.notes.length === 0) ? (
                  <div style={{ textAlign: 'center', color: 'var(--t-muted)', padding: '32px 0', fontSize: 13 }}>
                    No notes recorded yet.
                  </div>
                ) : (
                  noteLead.notes.map((note, idx) => (
                    <div key={idx} style={{ 
                      padding: 16, background: 'rgba(255,255,255,0.05)', 
                      borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.05)',
                      animation: `fade-up 0.3s ease-out ${idx * 0.05}s both`
                    }}>
                      <div style={{ fontSize: 12, color: 'var(--t-muted)', marginBottom: 6, fontWeight: 500 }}>
                        {new Date(note.date).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                      </div>
                      <div style={{ fontSize: 14, color: 'var(--t-main)', lineHeight: 1.5 }}>{note.content}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="modal-footer" style={{ padding: 24, background: 'rgba(0,0,0,0.4)' }}>
              <form onSubmit={addNote} style={{ width: '100%', display: 'flex', gap: 12 }}>
                <input 
                  required 
                  name="note" 
                  className="form-input" 
                  style={{ flex: 1, boxShadow: 'none' }}
                  placeholder="Type a new note..."
                  autoComplete="off"
                />
                <button type="submit" className="btn-primary">Add Note</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {delConfirm && (
        <div className="modal-overlay" onClick={() => setDelConfirm(null)}>
          <div className="modal-content" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
            <div className="modal-body" style={{ textAlign: 'center', paddingTop: 40 }}>
              <div style={{ 
                width: 56, height: 56, background: 'rgba(255,7,58,0.1)', color: '#ff073a', 
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px auto', boxShadow: '0 0 0 4px rgba(255,7,58,0.05)'
              }}>
                <Trash2 size={24} />
              </div>
              <h3 className="modal-title" style={{ marginBottom: 8 }}>Delete Lead</h3>
              <p style={{ color: 'var(--t-muted)', fontSize: 14 }}>Are you absolutely sure you want to permanently delete this lead? This action cannot be undone.</p>
            </div>
            <div className="modal-footer" style={{ justifyContent: 'center', gap: 16, borderTop: 'none', background: 'transparent' }}>
              <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setDelConfirm(null)}>Cancel</button>
              <button className="btn-danger" style={{ flex: 1, justifyContent: 'center' }} onClick={handleDelete}>Delete Permanently</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
