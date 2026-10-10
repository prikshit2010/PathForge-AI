
import { Link } from 'react-router-dom';
import { ArrowRight, Map } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#F8FAFC]">
      <div className="mb-8">
        <Map size={64} className="text-[#2563EB] mx-auto mb-6" />
        <h1 className="text-5xl font-bold mb-4 tracking-tight text-[#1E293B]">PathForge AI</h1>
        <p className="text-xl text-[#64748B] max-w-2xl">
          Your Dream Career. Reverse-Engineered.
        </p>
      </div>
      <p className="text-lg mb-10 max-w-2xl text-center text-[#1E293B]">
        PathForge AI transforms your specific career ambition into a personalized, interactive, adaptive learning roadmap. Explore exactly what you need to know, without the generic advice.
      </p>
      <div className="flex gap-4">
        <Link 
          to="/create-roadmap" 
          className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-8 py-4 rounded-lg font-medium flex items-center gap-2 transition-all shadow-sm"
        >
          Build My Career Roadmap <ArrowRight size={20} />
        </Link>
        <Link 
          to="/dashboard" 
          className="bg-white border border-[#E2E8F0] hover:bg-gray-50 text-[#1E293B] px-8 py-4 rounded-lg font-medium flex items-center gap-2 transition-all shadow-sm"
        >
          Explore Sample Roadmap
        </Link>
      </div>
      <div className="mt-6 text-sm text-[#64748B]">
        Already have an account? <Link to="/login" className="text-[#2563EB] font-medium hover:underline">Sign In</Link>
      </div>
    </div>
  );
}
