const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'frontend', 'src');

const files = {
    'index.css': `
@import "tailwindcss";

@theme {
  --color-primary: #FFFFFF;
  --color-secondary: #F8FAFC;
  --color-accent: #2563EB;
  --color-accent-hover: #1D4ED8;
  --color-text-main: #1E293B;
  --color-text-secondary: #64748B;
  --color-border: #E2E8F0;
  --color-success: #10B981;
}

body {
  background-color: #F8FAFC;
  color: #1E293B;
  font-family: system-ui, -apple-system, sans-serif;
}
`,
    'pages/LandingPage.tsx': `
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
    </div>
  );
}
`,
    'pages/CreateRoadmap.tsx': `
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { generateRoadmap } from '../lib/api';

export default function CreateRoadmap() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    targetRole: '',
    targetIndustry: '',
    existingSkills: '',
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
        navigate(\`/roadmap/\${response.roadmap.id}\`);
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
      <div className="mb-6 w-full max-w-lg">
        <Link to="/" className="text-sm text-[#2563EB] hover:underline">← Back Home</Link>
      </div>
      <div className="bg-white p-8 rounded-xl shadow-sm w-full max-w-lg border border-[#E2E8F0]">
        <h2 className="text-2xl font-bold mb-2 text-[#1E293B]">Define Your Career Goal</h2>
        <p className="text-[#64748B] mb-6 text-sm">Tell us where you want to go, and we'll map out the exact steps to get there.</p>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm border border-red-100">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-5">
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
                className="w-full bg-white border border-[#E2E8F0] rounded-md p-2.5 text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
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
                className="w-full bg-white border border-[#E2E8F0] rounded-md p-2.5 text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
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
`,
    'pages/RoadmapView.tsx': `
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRoadmapGraph, updateNodeStatus } from '../lib/api';
import { ReactFlow, Background, Controls, MarkerType, type Node, type Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { RoadmapGraph, RoadmapNode } from '../types';
import { CheckCircle2, Circle, Clock, Lock, BookOpen } from 'lucide-react';

export default function RoadmapView() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<RoadmapGraph | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null);

  useEffect(() => {
    if (id) {
      loadGraph();
    }
  }, [id]);

  const loadGraph = async () => {
    try {
      const graph = await getRoadmapGraph(id!);
      setData(graph);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!selectedNode || !data) return;
    try {
      await updateNodeStatus(data.roadmap.id, selectedNode.id, newStatus);
      await loadGraph();
      setSelectedNode({ ...selectedNode, status: newStatus });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-center text-xl text-[#64748B]">Loading your career map...</div>;
  if (!data) return <div className="p-8 text-center text-xl text-red-500">Roadmap not found.</div>;

  // Layout logic
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const phaseMap = new Map();
  data.phases.forEach((p, idx) => phaseMap.set(p.id, idx));

  data.nodes.forEach((n) => {
    const phaseIdx = phaseMap.get(n.phaseId) || 0;
    const itemsInPhase = data.nodes.filter(x => x.phaseId === n.phaseId);
    const itemIdx = itemsInPhase.findIndex(x => x.id === n.id);
    
    let bg = '#FFFFFF';
    let borderColor = '#E2E8F0';
    let textColor = '#1E293B';
    
    if (n.status === 'COMPLETED') {
      bg = '#F0FDF4'; // light green
      borderColor = '#10B981';
      textColor = '#047857';
    } else if (n.status === 'KNOWN') {
      bg = '#EFF6FF'; // light blue
      borderColor = '#3B82F6';
      textColor = '#1D4ED8';
    } else if (n.status === 'LOCKED') {
      bg = '#F8FAFC';
      borderColor = '#CBD5E1';
      textColor = '#94A3B8';
    }
    
    nodes.push({
      id: n.id,
      position: { x: phaseIdx * 350, y: itemIdx * 120 },
      data: { label: n.title },
      style: {
        background: bg,
        color: textColor,
        border: \`1px solid \${borderColor}\`,
        borderRadius: '8px',
        padding: '12px 24px',
        fontWeight: '600',
        fontSize: '14px',
        cursor: 'pointer',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        width: 250,
      }
    });
  });

  data.edges.forEach(e => {
    edges.push({
      id: \`\${e.sourceNodeId}-\${e.targetNodeId}\`,
      source: e.sourceNodeId,
      target: e.targetNodeId,
      markerEnd: { type: MarkerType.ArrowClosed, color: '#94A3B8' },
      style: { stroke: '#94A3B8', strokeWidth: 1.5 },
      animated: data.nodes.find(n => n.id === e.targetNodeId)?.status === 'AVAILABLE'
    });
  });

  const onNodeClick = (_: any, node: Node) => {
    const n = data.nodes.find(x => x.id === node.id);
    if (n) setSelectedNode(n);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle2 className="text-emerald-500 w-5 h-5" />;
      case 'KNOWN': return <CheckCircle2 className="text-blue-500 w-5 h-5" />;
      case 'LOCKED': return <Lock className="text-slate-400 w-5 h-5" />;
      case 'IN_PROGRESS': return <Clock className="text-amber-500 w-5 h-5" />;
      default: return <Circle className="text-slate-300 w-5 h-5" />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      <div className="flex-1 relative">
        <div className="absolute top-6 left-6 z-10 bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm max-w-md">
          <h2 className="text-xl font-bold text-[#1E293B] mb-1">{data.roadmap.title}</h2>
          <p className="text-sm text-[#64748B] mb-3">{data.roadmap.targetRole} • {data.roadmap.targetIndustry}</p>
          <div className="flex items-center gap-4 text-xs text-[#64748B] bg-slate-50 p-2 rounded-md">
            <span>Estimated: {data.roadmap.estimatedTotalHours} hrs</span>
            <span>Target: {data.roadmap.targetDurationWeeks} weeks</span>
          </div>
          <Link to="/dashboard" className="text-sm text-[#2563EB] hover:underline mt-4 inline-block font-medium">← Back to Dashboard</Link>
        </div>
        <ReactFlow 
          nodes={nodes} 
          edges={edges} 
          onNodeClick={onNodeClick}
          fitView
          fitViewOptions={{ padding: 0.2 }}
        >
          <Background color="#CBD5E1" gap={20} size={1.5} />
          <Controls className="bg-white border-[#E2E8F0] shadow-sm text-[#1E293B] fill-[#1E293B]" />
        </ReactFlow>
      </div>

      {selectedNode && (
        <div className="w-[400px] bg-white border-l border-[#E2E8F0] p-8 overflow-y-auto shadow-xl flex flex-col z-20">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              {getStatusIcon(selectedNode.status)}
              <h3 className="text-xl font-bold text-[#1E293B] leading-tight">{selectedNode.title}</h3>
            </div>
            <button onClick={() => setSelectedNode(null)} className="text-[#64748B] hover:text-[#1E293B] p-1">&times;</button>
          </div>
          
          <div className="flex gap-2 mb-6">
            <span className="inline-block px-2.5 py-1 bg-slate-100 text-xs font-medium rounded border border-slate-200 text-slate-600">
              {selectedNode.type}
            </span>
            <span className="inline-block px-2.5 py-1 bg-slate-100 text-xs font-medium rounded border border-slate-200 text-slate-600">
              {selectedNode.status.replace('_', ' ')}
            </span>
          </div>

          <div className="prose prose-sm text-slate-600 mb-8">
            <p>{selectedNode.description}</p>
          </div>

          <div className="space-y-6 flex-1">
            {selectedNode.whyItMatters && (
              <div>
                <h4 className="flex items-center gap-2 font-semibold text-[#1E293B] mb-2 text-sm uppercase tracking-wider">
                  <BookOpen className="w-4 h-4 text-slate-400" /> Why it matters
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">{selectedNode.whyItMatters}</p>
              </div>
            )}
            <div>
              <h4 className="font-semibold text-[#1E293B] mb-1 text-sm uppercase tracking-wider">Estimated Effort</h4>
              <p className="text-sm text-slate-600 font-medium">{selectedNode.estimatedHours} hours</p>
            </div>
          </div>

          <div className="mt-10 space-y-3 pt-6 border-t border-slate-100">
            <button 
              onClick={() => handleStatusUpdate('COMPLETED')}
              className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-medium py-2.5 rounded-lg transition-colors shadow-sm"
            >
              Mark as Completed
            </button>
            <button 
              onClick={() => handleStatusUpdate('KNOWN')}
              className="w-full bg-white border border-[#2563EB] text-[#2563EB] hover:bg-blue-50 font-medium py-2.5 rounded-lg transition-colors shadow-sm"
            >
              I Already Know This
            </button>
            {selectedNode.status !== 'AVAILABLE' && selectedNode.status !== 'LOCKED' && (
              <button 
                onClick={() => handleStatusUpdate('AVAILABLE')}
                className="w-full bg-white border border-[#E2E8F0] text-slate-500 hover:bg-slate-50 hover:text-slate-700 font-medium py-2.5 rounded-lg transition-colors"
              >
                Reset Status
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
`,
    'pages/Dashboard.tsx': `
import { Link } from 'react-router-dom';
import { Map, Clock, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-[#1E293B]">Overview</h1>
            <p className="text-[#64748B] mt-1">Track your career preparation progress.</p>
          </div>
          <Link 
            to="/create-roadmap" 
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
          >
            Create New Roadmap
          </Link>
        </header>

        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-bold text-[#1E293B]">Demonstration Mode</h2>
            <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> SAMPLE
            </span>
          </div>
          <p className="text-sm text-[#64748B] mb-6 max-w-2xl">
            Explore this sample roadmap to understand how PathForge AI structures learning paths. 
            This is demonstration content, not your personal career plan.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/roadmap/sample-123" className="block group">
              <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-50 rounded-lg text-[#2563EB]">
                    <Map className="w-6 h-6" />
                  </div>
                  <span className="bg-slate-100 text-slate-600 text-xs font-medium px-2.5 py-1 rounded">
                    Sample
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#1E293B] mb-1 group-hover:text-[#2563EB] transition-colors">Backend Engineer</h3>
                <p className="text-sm text-[#64748B] mb-6">Fintech Industry</p>
                
                <div className="mt-auto space-y-3">
                  <div className="w-full bg-slate-100 rounded-full h-2 mb-1">
                    <div className="bg-[#10B981] h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-[#64748B]">
                    <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> 12 Completed</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> ~420 hrs</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-[#1E293B] mb-6">Your Personal Roadmaps</h2>
          
          <div className="bg-white border border-dashed border-slate-300 rounded-xl p-10 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Map className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold text-[#1E293B] mb-2">No personal roadmaps yet</h3>
            <p className="text-slate-500 mb-6 max-w-md">
              Create your first personalized career roadmap to get actionable milestones, required skills, and project ideas.
            </p>
            <Link 
              to="/create-roadmap" 
              className="bg-white border border-[#E2E8F0] hover:bg-slate-50 text-[#1E293B] px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              Start Building <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
`
};

for (const [relPath, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(baseDir, relPath), content);
}
console.log('Frontend design files updated.');
