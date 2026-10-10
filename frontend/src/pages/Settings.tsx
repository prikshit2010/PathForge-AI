import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { checkAuth, logout } from '../lib/api';
import { User, LogOut, ChevronLeft } from 'lucide-react';

export default function Settings() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth()
      .then(data => {
        setEmail(data.email);
        setLoading(false);
      })
      .catch(() => navigate('/login'));
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-center text-[#64748B]">Loading settings...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <header className="flex items-center gap-4 mb-10">
          <Link to="/dashboard" className="text-[#64748B] hover:text-[#1E293B] transition-colors">
            <ChevronLeft size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-[#1E293B]">Account Settings</h1>
            <p className="text-[#64748B] mt-1">Manage your PathForge AI profile.</p>
          </div>
        </header>

        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden mb-6">
          <div className="p-6 border-b border-[#E2E8F0]">
            <h2 className="text-lg font-bold text-[#1E293B] flex items-center gap-2">
              <User size={20} className="text-[#2563EB]" />
              Profile Information
            </h2>
          </div>
          <div className="p-6">
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-1 text-[#64748B]">Email Address</label>
              <div className="text-[#1E293B] font-medium">{email}</div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-1 text-[#64748B]">Display Name</label>
              <input type="text" className="w-full max-w-md bg-white border border-[#E2E8F0] rounded-md p-2 text-[#1E293B]" placeholder="PathForge User" defaultValue="" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden mb-6">
          <div className="p-6 border-b border-[#E2E8F0]">
            <h2 className="text-lg font-bold text-[#1E293B]">Preferences</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between max-w-md">
              <div className="text-sm font-medium text-[#1E293B]">Email Notifications</div>
              <input type="checkbox" className="w-4 h-4 text-[#2563EB]" defaultChecked />
            </div>
            <div className="flex items-center justify-between max-w-md">
              <div className="text-sm font-medium text-[#1E293B]">Weekly Progress Report</div>
              <input type="checkbox" className="w-4 h-4 text-[#2563EB]" defaultChecked />
            </div>
            <div className="flex items-center justify-between max-w-md">
              <div className="text-sm font-medium text-[#1E293B]">Dark Mode</div>
              <input type="checkbox" className="w-4 h-4 text-[#2563EB]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden mb-6">
          <div className="p-6">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-md font-medium transition-colors border border-red-200"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
