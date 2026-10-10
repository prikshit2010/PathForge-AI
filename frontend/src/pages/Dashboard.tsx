import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Map, Clock, ChevronRight, AlertCircle, PlusCircle, Settings } from 'lucide-react';
import { checkAuth } from '../lib/api';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export default function Dashboard() {
  const navigate = useNavigate();
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth()
      .then(() => fetchRoadmaps())
      .catch(() => navigate('/register'));
  }, [navigate]);

  const fetchRoadmaps = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/roadmaps`, { 
        credentials: 'include',
        cache: 'no-store'
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setRoadmaps(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-[#64748B]">Loading your roadmaps...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 font-sans relative">
      <Link to="/settings" className="fixed bottom-8 left-8 bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#2563EB] hover:shadow-md p-4 rounded-full transition-all shadow-sm z-50 flex items-center justify-center group">
        <Settings size={28} className="group-hover:rotate-45 transition-transform duration-300" />
      </Link>
      
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-end mb-10 border-b border-[#E2E8F0] pb-6">
          <div>
            <div className="flex items-center gap-2 mb-3 text-[#2563EB]">
              <Map size={24} />
              <span className="font-bold text-xl tracking-tight">pathforge-ai</span>
            </div>
            <h1 className="text-3xl font-bold text-[#1E293B]">My Career Roadmaps</h1>
            <p className="text-[#64748B] mt-1">Track your personalized preparation progress.</p>
          </div>
          <div className="flex gap-4">
            <Link 
              to="/create-roadmap" 
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2"
            >
              <PlusCircle size={20} />
              Create New Roadmap
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {roadmaps.map(rm => (
            <Link key={rm.id} to={`/roadmap/${rm.id}`} className="block">
              <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-50 text-[#2563EB] p-2 rounded-lg">
                    <Map size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1E293B] text-lg">{rm.targetRole}</h3>
                    <p className="text-sm text-[#64748B]">{rm.targetIndustry}</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-sm text-[#64748B] mb-4">
                  <div className="flex items-center gap-1"><Clock size={16} /> {rm.estimatedTotalHours} hrs</div>
                  <div className="flex items-center gap-1">{rm.targetDurationWeeks} weeks</div>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-[#F1F5F9]">
                  <span className="text-[#2563EB] font-medium text-sm">Continue Journey</span>
                  <ChevronRight size={18} className="text-[#94A3B8]" />
                </div>
              </div>
            </Link>
          ))}
          
          {roadmaps.length === 0 && (
            <div className="col-span-full text-center py-12 bg-white rounded-xl border border-[#E2E8F0] shadow-sm">
               <Map size={48} className="mx-auto text-[#CBD5E1] mb-4" />
               <h3 className="text-xl font-bold text-[#1E293B] mb-2">No Roadmaps Yet</h3>
               <p className="text-[#64748B] mb-6">You haven't generated any personalized roadmaps.</p>
               <Link to="/create-roadmap" className="text-[#2563EB] font-medium hover:underline">
                 Generate your first roadmap
               </Link>
            </div>
          )}
        </div>

        <section className="mb-8">
          <div className="bg-white rounded-xl border border-amber-200 p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>
            <div className="flex items-start gap-4">
              <div className="bg-amber-100 p-2 rounded-full mt-1">
                <AlertCircle className="text-amber-600" size={24} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-bold text-[#1E293B]">SAMPLE ROADMAP</h3>
                  <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-amber-200">
                    Demonstration content, not your personal career plan.
                  </span>
                </div>
                <p className="text-[#64748B] mb-4 text-sm">
                  Explore this fictional demonstration profile to see how the interactive graph works. This sample data is completely isolated and does not count towards your personal analytics.
                </p>
                <div className="flex gap-4">
                  <Link to="/roadmap/sample-123" className="inline-flex items-center gap-2 bg-white border border-[#E2E8F0] hover:bg-gray-50 text-[#1E293B] px-4 py-2 rounded-md font-medium text-sm transition-colors">
                    Backend Engineer <ChevronRight size={16} />
                  </Link>
                  <Link to="/roadmap/sample-456" className="inline-flex items-center gap-2 bg-white border border-[#E2E8F0] hover:bg-gray-50 text-[#1E293B] px-4 py-2 rounded-md font-medium text-sm transition-colors">
                    Data Scientist <ChevronRight size={16} />
                  </Link>
                  <Link to="/roadmap/sample-789" className="inline-flex items-center gap-2 bg-white border border-[#E2E8F0] hover:bg-gray-50 text-[#1E293B] px-4 py-2 rounded-md font-medium text-sm transition-colors">
                    UI/UX Designer <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
