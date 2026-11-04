import React, { useState } from 'react';
import { AlertTriangle, Plus, CheckCircle, Clock, X } from 'lucide-react';

export const ComplaintPage = () => {
  const [complaints, setComplaints] = useState([
    { id: 1, number: 'CMP-2026-0811', name: 'Manjunath R.', category: 'WAGE_DELAY', description: 'Wage for fortnight ending July 15 has not been credited to bank account yet.', status: 'PENDING', date: '2026-08-01' },
    { id: 2, number: 'CMP-2026-0804', name: 'Gowramma S.', category: 'JOB_CARD_ISSUE', description: 'Request for adding new family member to job card.', status: 'RESOLVED', date: '2026-07-28', resolution: 'Added member to job card database.' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newComplaint, setNewComplaint] = useState({ name: '', phone: '', category: 'WAGE_DELAY', description: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setComplaints([
      {
        id: Date.now(),
        number: `CMP-2026-08${complaints.length + 12}`,
        name: newComplaint.name || 'Anonymous Beneficiary',
        category: newComplaint.category,
        description: newComplaint.description,
        status: 'PENDING',
        date: new Date().toISOString().split('T')[0]
      },
      ...complaints
    ]);
    setIsModalOpen(false);
  };

  const handleResolve = (id) => {
    setComplaints(complaints.map(c => c.id === id ? { ...c, status: 'RESOLVED', resolution: 'Investigated by Panchayat Officer and resolved.' } : c));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100">Grievance Redressal & Complaint Portal</h2>
          <p className="text-xs text-slate-400">Public Ombudsman Mechanism for Wage Delays, Job Card Issues & Worksite Corruption Complaints</p>
        </div>
        <button
          onClick={() => setIsModalOpen(false)}
          className="px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-500/20"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="w-4 h-4" /> Register Grievance Complaint
        </button>
      </div>

      {/* Complaints List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {complaints.map((c) => (
          <div key={c.id} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-rose-400">{c.number}</span>
              <span className={`badge ${c.status === 'RESOLVED' ? 'badge-success' : 'badge-warning'}`}>
                {c.status}
              </span>
            </div>
            <div className="font-bold text-slate-100 text-sm">{c.category.replace('_', ' ')}</div>
            <div className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800">{c.description}</div>
            <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
              <span>By: {c.name} • {c.date}</span>
              {c.status !== 'RESOLVED' && (
                <button
                  onClick={() => handleResolve(c.id)}
                  className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 font-bold text-xs"
                >
                  Mark Resolved
                </button>
              )}
            </div>
            {c.resolution && (
              <div className="text-[11px] text-emerald-400 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                Resolution: {c.resolution}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md glass-card p-6 rounded-2xl border border-slate-700">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-100">Register Public Grievance</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Complainant Name</label>
                <input
                  type="text"
                  required
                  placeholder="Your Full Name"
                  value={newComplaint.name}
                  onChange={(e) => setNewComplaint({...newComplaint, name: e.target.value})}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Category</label>
                <select
                  value={newComplaint.category}
                  onChange={(e) => setNewComplaint({...newComplaint, category: e.target.value})}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200"
                >
                  <option value="WAGE_DELAY">Wage Delay</option>
                  <option value="ATTENDANCE_DISPUTE">Attendance Dispute</option>
                  <option value="JOB_CARD_ISSUE">Job Card Issue</option>
                  <option value="CORRUPTION">Work Site Corruption</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe your grievance details..."
                  value={newComplaint.description}
                  onChange={(e) => setNewComplaint({...newComplaint, description: e.target.value})}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold"
                >
                  Submit Complaint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
