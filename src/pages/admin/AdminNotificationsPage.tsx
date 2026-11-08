import React, { useState } from 'react';
import { BellRing, Plus, Send, CheckCircle2, FileText, Timer, AlertCircle } from 'lucide-react';
import { Modal } from '../../components/common/Modal';

interface BroadcastNotification {
  id: string;
  title: string;
  message: string;
  targetAudience: string;
  type: 'Paper' | 'Mock' | 'Maintenance' | 'General';
  sentAt: string;
}

export const AdminNotificationsPage: React.FC = () => {
  const [broadcasts, setBroadcasts] = useState<BroadcastNotification[]>([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'Paper' | 'Mock' | 'Maintenance' | 'General'>('General');
  const [targetAudience, setTargetAudience] = useState('All Registered Aspirants');
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleCreateBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    const newNotif: BroadcastNotification = {
      id: `b-${Date.now()}`,
      title,
      message,
      targetAudience,
      type,
      sentAt: 'Just now',
    };

    setBroadcasts((prev) => [newNotif, ...prev]);
    showToast('Platform notification dispatched across web clients.');
    setModalOpen(false);
    setTitle('');
    setMessage('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
            Aspirant Communication
          </span>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
            Broadcast & Announcement Dispatcher
          </h1>
          <p className="text-xs text-slate-400">
            Publish site-wide announcements, maintenance schedules, and new question paper alerts.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-md transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Notification Broadcast</span>
        </button>
      </div>

      {toast && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Broadcasts List */}
      <div className="space-y-3">
        {broadcasts.length === 0 ? (
          <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
            <BellRing className="w-12 h-12 text-slate-500 mx-auto opacity-40" />
            <h4 className="text-sm font-bold text-white">No Broadcast Notifications Dispatched</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Send announcements, verified paper releases, or maintenance notices to all registered aspirants using the "+ New Broadcast" button.
            </p>
          </div>
        ) : (
          broadcasts.map((item) => (
            <div
              key={item.id}
              className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.type === 'Paper'
                        ? 'bg-blue-950 text-blue-300 border border-blue-800'
                        : item.type === 'Mock'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}
                  >
                    {item.type}
                  </span>
                  <span className="text-xs text-slate-400">Audience: <strong>{item.targetAudience}</strong></span>
                </div>
                <h3 className="text-sm font-bold text-white">{item.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">{item.message}</p>
              </div>

              <span className="text-xs text-slate-400 shrink-0 font-mono">{item.sentAt}</span>
            </div>
          ))
        )}
      </div>

      {/* Broadcast Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create Platform Notification"
        maxWidth="md"
      >
        <form onSubmit={handleCreateBroadcast} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Notification Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Official Answer Key Released for Paper 042/2024"
              className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Type Category</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white outline-none"
              >
                <option value="General">General Announcement</option>
                <option value="Paper">New PYQ Paper</option>
                <option value="Mock">Mock Test Announcement</option>
                <option value="Maintenance">System Maintenance</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Target Cohort</label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white outline-none"
              >
                <option value="All Registered Aspirants">All Registered Aspirants</option>
                <option value="Kerala PSC Aspirants">Kerala PSC Aspirants Only</option>
                <option value="Teaching & KTET Aspirants">Teaching & KTET</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Notification Body</label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Details and guidance for the candidates..."
              className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white outline-none resize-none"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Now</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
