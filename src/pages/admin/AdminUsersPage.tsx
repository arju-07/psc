import React, { useState } from 'react';
import { Users, Search, ShieldAlert, CheckCircle2, Ban, RotateCcw, Flag, Mail } from 'lucide-react';

interface MockStudent {
  id: string;
  name: string;
  email: string;
  targetExam: string;
  joinedDate: string;
  status: 'Active' | 'Suspended';
  questionsAttempted: number;
}

export const AdminUsersPage: React.FC = () => {
  const [students, setStudents] = useState<MockStudent[]>([
    { id: 'usr-1', name: 'arju', email: 'allu73056@gmail.com', targetExam: 'Kerala PSC', joinedDate: '2026-11-06', status: 'Active', questionsAttempted: 0 },
  ]);

  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const toggleStatus = (id: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const next = s.status === 'Active' ? 'Suspended' : 'Active';
          showToast(`Account for ${s.name} is now ${next}.`);
          return { ...s, status: next };
        }
        return s;
      })
    );
  };

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.targetExam.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
          User Directory & Moderation
        </span>
        <h1 className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
          Student Aspirant Management ({students.length})
        </h1>
        <p className="text-xs text-slate-400">
          Search candidate accounts, review activity history, manage account permissions, and audit user reports.
        </p>
      </div>

      {toast && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Security Privacy Notice */}
      <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-400 flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          <strong>Data Privacy Compliance:</strong> Candidate authentication secrets, hashed passwords, and private tokens are strictly isolated and never visible to administrative consoles.
        </span>
      </div>

      {/* Search */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or target exam..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-700 bg-slate-800 text-white outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/40">
                <th className="py-3 px-4 font-semibold">Student Name</th>
                <th className="py-3 px-4 font-semibold">Email</th>
                <th className="py-3 px-4 font-semibold">Target Exam</th>
                <th className="py-3 px-4 font-semibold">Joined Date</th>
                <th className="py-3 px-4 font-semibold">Questions Solved</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No registered student accounts found.
                  </td>
                </tr>
              )}
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-800 text-amber-400 font-bold flex items-center justify-center text-xs">
                      {item.name.charAt(0)}
                    </div>
                    <span>{item.name}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{item.email}</td>
                  <td className="py-3.5 px-4 text-slate-300 font-medium">{item.targetExam}</td>
                  <td className="py-3.5 px-4 text-slate-400">{item.joinedDate}</td>
                  <td className="py-3.5 px-4 text-emerald-400 font-bold">{item.questionsAttempted} Qs</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'Active'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-red-950 text-red-300 border border-red-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => toggleStatus(item.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                        item.status === 'Active'
                          ? 'text-red-400 hover:bg-red-950/60'
                          : 'text-emerald-400 hover:bg-emerald-950/60'
                      }`}
                    >
                      {item.status === 'Active' ? 'Suspend' : 'Reactivate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
