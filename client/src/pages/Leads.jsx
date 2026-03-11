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
    <div style={{ paddingBottom: 40 }}>
      {/* Table & Controls wrapper */}
      <div className="table-container page-anim">
        <div className="table-header">
          <h2 className="table-title" style={{ flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Briefcase size={20} color="var(--primary)" /> 
              All Leads <span style={{ fontSize: 13, color: 'var(--t-muted)', fontWeight: 500, background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: 99 }}>{filteredLeads.length} {filteredLeads.length !== leads.length && `of ${leads.length}`}</span>
            </div>
            {searchStr && (
              <span style={{ fontSize: 13, color: 'var(--t-muted)', fontWeight: 400, background: 'rgba(255,7,58,0.1)', color: 'var(--primary)', padding: '4px 12px', borderRadius: 99, border: '1px solid rgba(255,7,58,0.2)' }}>
                Searching for: "{searchStr}"
              </span>
            )}
          </h2>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,0,0,0.4)', padding: '4px 12px', borderRadius: 99, border: '1px solid rgba(255,255,255,0.08)' }}>
              <Filter size={14} color="var(--t-muted)" />
              <select value={filter} onChange={e => setFilter(e.target.value)} style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, fontWeight: 500, color: 'var(--t-main)', cursor: 'pointer' }}>
                <option value="All">All Status</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Converted">Converted</option>
                <option value="Lost">Lost</option>
              </select>
            </div>
            
            <button className="btn-primary" onClick={() => { setEditData(null); setShowEdit(true); }}>
              <Plus size={16} /> Add Lead
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <div style={{ width: 20, height: 20, border: '2px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px auto' }}></div>
            <div style={{ color: 'var(--t-muted)', fontSize: 13, fontWeight: 500 }}>Loading connections...</div>
          </div>
        ) : leads.length === 0 ? (
          <div className="empty-state" style={{ minHeight: 400, background: 'transparent', border: 'none' }}>
            <div className="empty-icon"><Inbox size={40} strokeWidth={1.5} /></div>
            <h3 className="empty-title">Your lead roster is empty</h3>
            <p className="empty-desc">There are no leads in your CRM yet. Add a lead manually to begin tracking their journey.</p>
            <button className="btn-primary" onClick={() => { setEditData(null); setShowEdit(true); }}>
              <Plus size={16} /> Create First Lead
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Contact Info</th>
                  <th>Source</th>
                  <th>Status</th>
                  <th>Added On</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.length > 0 ? filteredLeads.map(lead => (
                  <tr key={lead._id}>
                    <td>
                      <div className="lead-info">
                        <span className="lead-name">{lead.name}</span>
                        <span className="lead-email">{lead.email}</span>
                      </div>
                    </td>
                    <td><span style={{ fontSize: 13, color: 'var(--t-main)', fontWeight: 500 }}>{lead.source}</span></td>
                    <td>
                      <select 
                        className={`badge ${lead.status}`} 
                        value={lead.status}
                        onChange={(e) => updateStatus(lead._id, e.target.value)}
                        style={{ border: 'none', outline: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Converted">Converted</option>
                        <option value="Lost">Lost</option>
                      </select>
                    </td>
                    <td><span style={{ fontSize: 13, color: 'var(--t-muted)' }}>{new Date(lead.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span></td>
                    <td>
                      <div className="actions-cell">
                        <button className="action-btn" title="View Notes" onClick={() => { setNoteLead(lead); setShowNotes(true); }}>
                          <MessageSquare size={16} />
                        </button>
                        <button className="action-btn" title="Edit Lead" onClick={() => { setEditData(lead); setShowEdit(true); }}>
                          <Edit2 size={16} />
                        </button>
                        <button className="action-btn delete" title="Delete Lead" onClick={() => setDelConfirm(lead._id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5">
                      <div className="empty-state" style={{ background: 'transparent', border: 'none', padding: '40px 20px' }}>
                        <p style={{ color: 'var(--t-muted)' }}>No leads match your current search and filters.</p>
                      </div>
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
