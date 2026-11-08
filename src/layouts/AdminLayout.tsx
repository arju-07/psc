import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AdminSidebar } from '../components/sidebar/AdminSidebar';
import { Menu, X, ExternalLink, CheckCircle2 } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { currentUser } = useAuth();
  const [mobileAdminSidebar, setMobileAdminSidebar] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 transition-colors">
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Admin Sidebar */}
        <div className="hidden lg:block shrink-0">
          <AdminSidebar />
        </div>

        {/* Mobile Admin Sidebar Drawer */}
        {mobileAdminSidebar && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
              onClick={() => setMobileAdminSidebar(false)}
            />
            <div className="relative z-10 w-64 bg-slate-900 h-full shadow-2xl flex flex-col">
              <div className="absolute top-3 right-3">
                <button
                  onClick={() => setMobileAdminSidebar(false)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                  aria-label="Close sidebar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <AdminSidebar onItemClick={() => setMobileAdminSidebar(false)} />
            </div>
          </div>
        )}

        {/* Admin Content View */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Admin Header */}
          <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileAdminSidebar(true)}
                className="lg:hidden p-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white"
                aria-label="Open sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <span className="text-[11px] font-semibold text-amber-400 tracking-wider uppercase">
                  Management Console
                </span>
                <h1 className="text-sm font-bold text-white hidden sm:block">
                  Kerala PYQ Hub Administration &bull; {currentUser?.email || 'Super Admin'}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Single Super Admin Authorized</span>
              </div>

              <Link
                to="/"
                target="_blank"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900 text-xs text-slate-300 hover:text-white transition-colors"
              >
                <span>Live Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-slate-950 text-slate-100">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
