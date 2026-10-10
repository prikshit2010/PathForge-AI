
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { generateRoadmap, checkAuth } from '../lib/api';

export default function CreateRoadmap() {
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth().catch(() => navigate('/register'));
  }, [navigate]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    targetRole: '',
    targetIndustry: '',
    educationLevel: 'Bachelors',
    experienceLevel: 'Beginner',
    learningStyle: 'Mixed (Free & Paid)',
    existingSkills: '',
    specificGoals: '',
    weeklyAvailableHours: 10,
    targetDurationWeeks: 26
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = {
        ...formData,
        existingSkills: formData.existingSkills.split(',').map(s => s.trim()).filter(Boolean)
      };
      const response = await generateRoadmap(data);
      if (response && response.roadmap && response.roadmap.id) {
        navigate(`/roadmap/${response.roadmap.id}`);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate roadmap');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#F8FAFC]">
      <div className="mb-6 w-full max-w-lg flex items-center justify-between">
        <Link to="/" className="text-sm text-[#2563EB] hover:underline">← Back Home</Link>
        <div className="flex items-center gap-2 text-[#2563EB]">
          <span className="font-bold text-lg tracking-tight">pathforge-ai</span>
        </div>
      </div>
      <div className="bg-white p-8 rounded-xl shadow-sm w-full max-w-lg border border-[#E2E8F0]">
        <h2 className="text-2xl font-bold mb-2 text-[#1E293B]">Define Your Career Goal</h2>
        <p className="text-[#64748B] mb-6 text-sm">Tell us where you want to go, and we'll map out the exact steps to get there.</p>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm border border-red-100">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-[#1E293B]">Target Role</label>
            <input 
              className="w-full bg-white border border-[#E2E8F0] rounded-md p-2.5 text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent placeholder-gray-400"
              placeholder="e.g. Backend Engineer, Data Scientist"
              value={formData.targetRole}
              onChange={e => setFormData({...formData, targetRole: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-[#1E293B]">Target Industry</label>
            <input 
              className="w-full bg-white border border-[#E2E8F0] rounded-md p-2.5 text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent placeholder-gray-400"
              placeholder="e.g. Fintech, E-commerce, HealthTech"
              value={formData.targetIndustry}
              onChange={e => setFormData({...formData, targetIndustry: e.target.value})}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1 text-[#1E293B]">Education</label>
              <select 
                className="w-full bg-white border border-[#E2E8F0] rounded-md p-2.5 text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                value={formData.educationLevel}
                onChange={e => setFormData({...formData, educationLevel: e.target.value})}
              >
                <option>High School</option>
                <option>Bachelors</option>
                <option>Masters</option>
                <option>Self-Taught</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-[#1E293B]">Experience</label>
              <select 
                className="w-full bg-white border border-[#E2E8F0] rounded-md p-2.5 text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                value={formData.experienceLevel}
                onChange={e => setFormData({...formData, experienceLevel: e.target.value})}
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
                <option>Career Changer</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-1 text-[#1E293B]">Learning Preference</label>
            <select 
              className="w-full bg-white border border-[#E2E8F0] rounded-md p-2.5 text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              value={formData.learningStyle}
              onChange={e => setFormData({...formData, learningStyle: e.target.value})}
            >
              <option>Free Resources Only</option>
              <option>Mixed (Free & Paid)</option>
              <option>Premium Courses</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-[#1E293B]">Specific Goals / Dream Company (Optional)</label>
            <textarea 
              className="w-full bg-white border border-[#E2E8F0] rounded-md p-2.5 text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent placeholder-gray-400 min-h-[80px]"
              placeholder="e.g. I want to be a Data Scientist at Visa"
              value={formData.specificGoals}
              onChange={e => setFormData({...formData, specificGoals: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-[#1E293B]">Existing Skills (Optional)</label>
            <input 
              className="w-full bg-white border border-[#E2E8F0] rounded-md p-2.5 text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent placeholder-gray-400"
              placeholder="e.g. Java, basic SQL, Python"
              value={formData.existingSkills}
              onChange={e => setFormData({...formData, existingSkills: e.target.value})}
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1 text-[#1E293B]">Hours / Week</label>
              <input 
                type="number"
                min="1"
                max="100"
                className="w-full bg-white border border-[#E2E8F0] rounded-md p-2.5 text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                value={formData.weeklyAvailableHours}
                onChange={e => setFormData({...formData, weeklyAvailableHours: parseInt(e.target.value)})}
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1 text-[#1E293B]">Target Weeks</label>
              <input 
                type="number"
                min="1"
                max="260"
                className="w-full bg-white border border-[#E2E8F0] rounded-md p-2.5 text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                value={formData.targetDurationWeeks}
                onChange={e => setFormData({...formData, targetDurationWeeks: parseInt(e.target.value)})}
                required
              />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white p-3.5 rounded-md font-medium mt-2 disabled:opacity-70 transition-colors shadow-sm"
          >
            {loading ? 'Analyzing career paths...' : 'Generate My Roadmap'}
          </button>
        </form>
      </div>
    </div>
  );
}
