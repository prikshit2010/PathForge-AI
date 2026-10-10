const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'frontend', 'src');
const dirs = [
    'components',
    'components/ui',
    'pages',
    'store',
    'lib',
    'types'
];

dirs.forEach(d => {
    fs.mkdirSync(path.join(baseDir, d), { recursive: true });
});

const files = {
    'types/index.ts': `
export interface Roadmap {
  id: string;
  title: string;
  targetRole: string;
  targetIndustry: string;
  summary: string;
  estimatedTotalHours: number;
  targetDurationWeeks: number;
  revisionNumber: number;
}
export interface RoadmapPhase {
  id: string;
  roadmapId: string;
  title: string;
  description: string;
  orderIndex: number;
}
export interface RoadmapNode {
  id: string;
  phaseId: string;
  title: string;
  type: string;
  description: string;
  whyItMatters: string;
  difficulty: string;
  estimatedHours: number;
  status: string;
  isRequired: boolean;
}
export interface RoadmapDependency {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
}
export interface RoadmapGraph {
  roadmap: Roadmap;
  phases: RoadmapPhase[];
  nodes: RoadmapNode[];
  edges: RoadmapDependency[];
}
`,
    'lib/api.ts': `
const API_URL = 'http://localhost:8080/api';

export const generateRoadmap = async (data: any) => {
  const res = await fetch(\`\${API_URL}/roadmaps/generate\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to generate roadmap');
  return res.json();
};

export const getRoadmapGraph = async (id: string) => {
  const res = await fetch(\`\${API_URL}/roadmaps/\${id}/graph\`);
  if (!res.ok) throw new Error('Failed to fetch roadmap graph');
  return res.json();
};

export const updateNodeStatus = async (roadmapId: string, nodeId: string, status: string) => {
  const res = await fetch(\`\${API_URL}/roadmaps/\${roadmapId}/nodes/\${nodeId}/status\`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Failed to update node status');
};
`,
    'lib/utils.ts': `
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`,
    'App.tsx': `
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LandingPage from './pages/LandingPage';
import CreateRoadmap from './pages/CreateRoadmap';
import RoadmapView from './pages/RoadmapView';
import Dashboard from './pages/Dashboard';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/create-roadmap" element={<CreateRoadmap />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/roadmap/:id" element={<RoadmapView />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
`,
    'index.css': `
@import "tailwindcss";

@theme {
  --color-primary: #121B30;
  --color-secondary: #18233A;
  --color-accent: #6D7CFF;
  --color-accent-hover: #5A69E5;
  --color-text-main: #F3F5FC;
  --color-text-secondary: #9AA7BF;
}

body {
  background-color: #0B1020;
  color: #F3F5FC;
  font-family: system-ui, -apple-system, sans-serif;
}
`,
    'pages/LandingPage.tsx': `
import { Link } from 'react-router-dom';
import { ArrowRight, Map } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-8">
        <Map size={64} className="text-[#6D7CFF] mx-auto mb-4" />
        <h1 className="text-5xl font-bold mb-4 tracking-tight">PathForge AI</h1>
        <p className="text-xl text-[#9AA7BF] max-w-2xl">
          Your Dream Career. Reverse-Engineered.
        </p>
      </div>
      <p className="text-lg mb-10 max-w-2xl text-left text-[#F3F5FC]">
        PathForge AI is an intelligent career-planning platform that transforms your career ambition into a personalized, interactive, and adaptive learning roadmap. 
      </p>
      <div className="flex gap-4">
        <Link 
          to="/create-roadmap" 
          className="bg-[#6D7CFF] hover:bg-[#5A69E5] text-white px-8 py-4 rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg"
        >
          Build My Career Roadmap <ArrowRight size={20} />
        </Link>
      </div>
    </div>
  );
}
`,
    'pages/CreateRoadmap.tsx': `
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateRoadmap } from '../lib/api';

export default function CreateRoadmap() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    targetRole: 'Backend Engineer',
    targetIndustry: 'Fintech',
    existingSkills: 'Java, SQL',
    weeklyAvailableHours: 10,
    targetDurationWeeks: 52
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = {
        ...formData,
        existingSkills: formData.existingSkills.split(',').map(s => s.trim())
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
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-[#121B30] p-8 rounded-2xl shadow-xl w-full max-w-md border border-[#18233A]">
        <h2 className="text-3xl font-bold mb-6 text-center">Define Your Goal</h2>
        {error && <div className="bg-[#FB7185] text-white p-3 rounded mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-[#9AA7BF]">Target Role</label>
            <input 
              className="w-full bg-[#18233A] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-[#6D7CFF]"
              value={formData.targetRole}
              onChange={e => setFormData({...formData, targetRole: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-[#9AA7BF]">Target Industry</label>
            <input 
              className="w-full bg-[#18233A] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-[#6D7CFF]"
              value={formData.targetIndustry}
              onChange={e => setFormData({...formData, targetIndustry: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-[#9AA7BF]">Existing Skills (comma separated)</label>
            <input 
              className="w-full bg-[#18233A] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-[#6D7CFF]"
              value={formData.existingSkills}
              onChange={e => setFormData({...formData, existingSkills: e.target.value})}
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1 text-[#9AA7BF]">Hours / Week</label>
              <input 
                type="number"
                className="w-full bg-[#18233A] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-[#6D7CFF]"
                value={formData.weeklyAvailableHours}
                onChange={e => setFormData({...formData, weeklyAvailableHours: parseInt(e.target.value)})}
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1 text-[#9AA7BF]">Target Weeks</label>
              <input 
                type="number"
                className="w-full bg-[#18233A] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-[#6D7CFF]"
                value={formData.targetDurationWeeks}
                onChange={e => setFormData({...formData, targetDurationWeeks: parseInt(e.target.value)})}
                required
              />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#6D7CFF] hover:bg-[#5A69E5] text-white p-4 rounded-xl font-medium mt-4 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Generating...' : 'Generate My Roadmap'}
          </button>
        </form>
      </div>
    </div>
  );
}
`,
    'pages/Dashboard.tsx': `
import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#121B30] p-6 rounded-2xl border border-[#18233A]">
          <h2 className="text-xl font-semibold mb-2">My Roadmaps</h2>
          <p className="text-[#9AA7BF] mb-4">View and manage your active career journeys.</p>
          <Link to="/create-roadmap" className="text-[#6D7CFF] hover:underline">Create new roadmap</Link>
        </div>
      </div>
    </div>
  );
}
`,
    'pages/RoadmapView.tsx': `
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRoadmapGraph, updateNodeStatus } from '../lib/api';
import { ReactFlow, Background, Controls, MarkerType, Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { RoadmapGraph, RoadmapNode } from '../types';

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

  if (loading) return <div className="p-8 text-center text-xl">Loading your career map...</div>;
  if (!data) return <div className="p-8 text-center text-xl text-[#FB7185]">Roadmap not found.</div>;

  // Layout logic
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const phaseMap = new Map();
  data.phases.forEach((p, idx) => phaseMap.set(p.id, idx));

  data.nodes.forEach((n, idx) => {
    const phaseIdx = phaseMap.get(n.phaseId) || 0;
    const itemsInPhase = data.nodes.filter(x => x.phaseId === n.phaseId);
    const itemIdx = itemsInPhase.findIndex(x => x.id === n.id);
    
    let color = '#18233A';
    if (n.status === 'COMPLETED') color = '#34D399';
    if (n.status === 'KNOWN') color = '#6D7CFF';
    
    nodes.push({
      id: n.id,
      position: { x: phaseIdx * 300, y: itemIdx * 100 },
      data: { label: n.title },
      style: {
        background: color,
        color: '#F3F5FC',
        border: \`1px solid \${color === '#18233A' ? '#9AA7BF' : color}\`,
        borderRadius: '8px',
        padding: '10px 20px',
        fontWeight: 'bold',
        cursor: 'pointer'
      }
    });
  });

  data.edges.forEach(e => {
    edges.push({
      id: \`\${e.sourceNodeId}-\${e.targetNodeId}\`,
      source: e.sourceNodeId,
      target: e.targetNodeId,
      markerEnd: { type: MarkerType.ArrowClosed, color: '#9AA7BF' },
      style: { stroke: '#9AA7BF' },
      animated: true
    });
  });

  const onNodeClick = (_: any, node: Node) => {
    const n = data.nodes.find(x => x.id === node.id);
    if (n) setSelectedNode(n);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0B1020]">
      <div className="flex-1 relative">
        <div className="absolute top-4 left-4 z-10 bg-[#121B30] p-4 rounded-xl border border-[#18233A] shadow-lg">
          <h2 className="text-xl font-bold">{data.roadmap.title}</h2>
          <p className="text-sm text-[#9AA7BF]">{data.roadmap.targetRole} • {data.roadmap.targetIndustry}</p>
          <Link to="/" className="text-xs text-[#6D7CFF] hover:underline mt-2 inline-block">← Back Home</Link>
        </div>
        <ReactFlow 
          nodes={nodes} 
          edges={edges} 
          onNodeClick={onNodeClick}
          fitView
        >
          <Background color="#18233A" gap={16} />
          <Controls className="bg-[#121B30] border-none text-white fill-white" />
        </ReactFlow>
      </div>

      {selectedNode && (
        <div className="w-96 bg-[#121B30] border-l border-[#18233A] p-6 overflow-y-auto shadow-2xl flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl font-bold text-white">{selectedNode.title}</h3>
            <button onClick={() => setSelectedNode(null)} className="text-[#9AA7BF] hover:text-white text-xl">&times;</button>
          </div>
          
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-[#18233A] text-xs rounded-full border border-gray-700 text-[#9AA7BF] mr-2">
              {selectedNode.type}
            </span>
            <span className="inline-block px-3 py-1 bg-[#18233A] text-xs rounded-full border border-gray-700 text-[#9AA7BF]">
              {selectedNode.status}
            </span>
          </div>

          <p className="text-sm text-[#9AA7BF] mb-6">{selectedNode.description}</p>

          <div className="space-y-6 flex-1">
            {selectedNode.whyItMatters && (
              <div>
                <h4 className="font-semibold text-[#F3F5FC] mb-1 text-sm">Why it matters</h4>
                <p className="text-sm text-[#9AA7BF]">{selectedNode.whyItMatters}</p>
              </div>
            )}
            <div>
              <h4 className="font-semibold text-[#F3F5FC] mb-1 text-sm">Estimated Effort</h4>
              <p className="text-sm text-[#9AA7BF]">{selectedNode.estimatedHours} hours</p>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <button 
              onClick={() => handleStatusUpdate('COMPLETED')}
              className="w-full bg-[#34D399] hover:bg-[#10B981] text-[#0B1020] font-bold py-3 rounded-lg transition-colors"
            >
              Mark as Completed
            </button>
            <button 
              onClick={() => handleStatusUpdate('KNOWN')}
              className="w-full bg-[#6D7CFF] hover:bg-[#5A69E5] text-white font-bold py-3 rounded-lg transition-colors"
            >
              I Already Know This
            </button>
            <button 
              onClick={() => handleStatusUpdate('AVAILABLE')}
              className="w-full border border-[#9AA7BF] text-[#9AA7BF] hover:bg-[#18233A] hover:text-white font-bold py-3 rounded-lg transition-colors"
            >
              Reset Status
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
`
};

for (const [relPath, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(baseDir, relPath), content);
}
console.log('Frontend files created successfully.');
