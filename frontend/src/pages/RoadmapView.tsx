import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRoadmapGraph, updateNodeStatus, tutorNode } from '../lib/api';
import { ReactFlow, Background, Controls, MarkerType, type Node, type Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { RoadmapGraph, RoadmapNode } from '../types';
import { CheckCircle2, Circle, Clock, Lock, BookOpen, Lightbulb, ListChecks, ExternalLink, MessageSquare, Send, CalendarDays, Map as MapIcon } from 'lucide-react';

export default function RoadmapView() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<RoadmapGraph | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'graph' | 'calendar'>('graph');
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null);
  const [tutorOpen, setTutorOpen] = useState(false);
  const [tutorQuestion, setTutorQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<Record<string, {q: string, a: string}[]>>({});
  const [tutorLoading, setTutorLoading] = useState(false);

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

  const handleTutorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tutorQuestion.trim() || !selectedNode || !data) return;
    
    const q = tutorQuestion;
    const nodeId = selectedNode.id;
    setTutorQuestion('');
    
    setChatHistory(prev => ({
      ...prev,
      [nodeId]: [...(prev[nodeId] || []), { q, a: '' }]
    }));
    setTutorLoading(true);

    try {
      const answer = await tutorNode(data.roadmap.id, nodeId, q);
      setChatHistory(prev => {
        const nodeChat = [...(prev[nodeId] || [])];
        if (nodeChat.length > 0) {
          nodeChat[nodeChat.length - 1].a = answer;
        }
        return { ...prev, [nodeId]: nodeChat };
      });
    } catch (err) {
      setChatHistory(prev => {
        const nodeChat = [...(prev[nodeId] || [])];
        if (nodeChat.length > 0) {
          nodeChat[nodeChat.length - 1].a = "Failed to connect to the tutor. Please try again.";
        }
        return { ...prev, [nodeId]: nodeChat };
      });
    } finally {
      setTutorLoading(false);
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
      bg = '#F0FDF4';
      borderColor = '#10B981';
      textColor = '#047857';
    } else if (n.status === 'KNOWN') {
      bg = '#EFF6FF';
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
        border: `1px solid ${borderColor}`,
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
      id: `${e.sourceNodeId}-${e.targetNodeId}`,
      source: e.sourceNodeId,
      target: e.targetNodeId,
      markerEnd: { type: MarkerType.ArrowClosed, color: '#94A3B8' },
      style: { stroke: '#94A3B8', strokeWidth: 1.5 },
      animated: data.nodes.find(n => n.id === e.targetNodeId)?.status === 'AVAILABLE'
    });
  });

  const onNodeClick = (_: any, node: Node) => {
    const n = data.nodes.find(x => x.id === node.id);
    if (n) {
      setSelectedNode(n);
      setTutorOpen(false);
    }
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

  const renderCalendarView = () => {
    if (!data) return null;
    
    const sortedPhases = [...data.phases].sort((a, b) => a.orderIndex - b.orderIndex);
    const orderedNodes: RoadmapNode[] = [];
    sortedPhases.forEach(p => {
      orderedNodes.push(...data.nodes.filter(n => n.phaseId === p.id));
    });

    const weeklyHours = data.roadmap.weeklyAvailableHours || Math.round(data.roadmap.estimatedTotalHours / data.roadmap.targetDurationWeeks) || 10;
    
    const weeks: { weekNum: number, nodes: (RoadmapNode & { hoursInThisWeek: number })[] }[] = [];
    let currentWeek = 1;
    let hoursLeftInWeek = weeklyHours;
    let currentWeekNodes: any[] = [];
    
    orderedNodes.forEach(node => {
      let hoursRemainingForNode = node.estimatedHours || 5;
      
      while (hoursRemainingForNode > 0) {
        if (hoursLeftInWeek === 0) {
          weeks.push({ weekNum: currentWeek, nodes: currentWeekNodes });
          currentWeek++;
          hoursLeftInWeek = weeklyHours;
          currentWeekNodes = [];
        }
        
        const hoursToTake = Math.min(hoursRemainingForNode, hoursLeftInWeek);
        currentWeekNodes.push({ ...node, hoursInThisWeek: hoursToTake });
        
        hoursRemainingForNode -= hoursToTake;
        hoursLeftInWeek -= hoursToTake;
      }
    });
    
    if (currentWeekNodes.length > 0) {
      weeks.push({ weekNum: currentWeek, nodes: currentWeekNodes });
    }

    return (
      <div className="w-full h-full overflow-y-auto p-8 bg-slate-50 custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#1E293B]">Your Personalized Schedule</h2>
            <p className="text-slate-500 mt-2">Based on your {weeklyHours} hours/week commitment.</p>
          </div>
          
          {weeks.map(w => (
            <div key={w.weekNum} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-[#1E293B] text-white px-6 py-3 font-semibold flex justify-between items-center">
                <span>Week {w.weekNum}</span>
                <span className="text-sm text-slate-300 font-normal">
                  {w.nodes.reduce((acc, n) => acc + n.hoursInThisWeek, 0)} / {weeklyHours} hours
                </span>
              </div>
              <div className="p-6 space-y-4">
                {w.nodes.map((n, i) => (
                  <div key={i} className="flex gap-4 items-start p-4 rounded-lg border border-slate-100 bg-slate-50 hover:border-blue-200 transition-colors cursor-pointer" onClick={() => { setViewMode('graph'); setSelectedNode(n); }}>
                    <div className="shrink-0 mt-1">
                      {n.status === 'COMPLETED' || n.status === 'KNOWN' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Circle className="w-5 h-5 text-slate-300" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#1E293B]">{n.title}</h4>
                      <p className="text-sm text-slate-500 line-clamp-2 mt-1">{n.description}</p>
                    </div>
                    <div className="shrink-0 text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      {n.hoursInThisWeek} hrs
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      <div className="flex-1 relative flex flex-col">
        <div className={`${viewMode === 'graph' ? 'absolute top-6 left-6 z-10' : 'relative mt-6 ml-6 mb-2'} bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm max-w-xs shrink-0`}>
          <h2 className="text-base font-bold text-[#1E293B] mb-0.5 leading-tight truncate" title={data.roadmap.title}>{data.roadmap.title}</h2>
          <p className="text-xs text-[#64748B] mb-2 truncate" title={`${data.roadmap.targetRole} • ${data.roadmap.targetIndustry}`}>{data.roadmap.targetRole} • {data.roadmap.targetIndustry}</p>
          <div className="flex items-center gap-3 text-xs text-[#64748B] bg-slate-50 p-1.5 rounded-md w-fit">
            <span>{data.roadmap.estimatedTotalHours} hrs</span>
            <span>•</span>
            <span>{data.roadmap.targetDurationWeeks} weeks</span>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-lg mt-3 w-fit">
            <button 
              onClick={() => { setViewMode('graph'); setSelectedNode(null); }} 
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors ${viewMode === 'graph' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <MapIcon className="w-3.5 h-3.5" /> Map
            </button>
            <button 
              onClick={() => { setViewMode('calendar'); setSelectedNode(null); }} 
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors ${viewMode === 'calendar' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <CalendarDays className="w-3.5 h-3.5" /> Schedule
            </button>
          </div>

          <Link to="/dashboard" className="text-xs text-[#2563EB] hover:underline mt-2 inline-block font-medium">← Back to Dashboard</Link>
        </div>
        
        <div className="flex-1 min-h-0 relative">
          {viewMode === 'graph' ? (
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
          ) : (
            renderCalendarView()
          )}
        </div>
      </div>

      {selectedNode && (
        <div className="w-[400px] bg-white border-l border-[#E2E8F0] p-8 flex flex-col z-20 shadow-xl overflow-hidden">
          <div className="flex justify-between items-start mb-6 shrink-0">
            <div className="flex items-center gap-3">
              {getStatusIcon(selectedNode.status)}
              <h3 className="text-xl font-bold text-[#1E293B] leading-tight">{selectedNode.title}</h3>
            </div>
            <button onClick={() => setSelectedNode(null)} className="text-[#64748B] hover:text-[#1E293B] p-1">&times;</button>
          </div>
          
          {!tutorOpen ? (
            <div className="flex flex-col flex-1 overflow-y-auto pr-2" style={{maxHeight: '100%'}}>
              <div className="flex gap-2 mb-6 shrink-0">
                <span className="inline-block px-2.5 py-1 bg-slate-100 text-xs font-medium rounded border border-slate-200 text-slate-600">
                  {selectedNode.type}
                </span>
                <span className="inline-block px-2.5 py-1 bg-slate-100 text-xs font-medium rounded border border-slate-200 text-slate-600">
                  {selectedNode.status.replace('_', ' ')}
                </span>
              </div>

              <div className="prose prose-sm text-slate-600 mb-8 shrink-0">
                <p>{selectedNode.description}</p>
              </div>

              <div className="space-y-6 flex-1 shrink-0">
                {selectedNode.whyItMatters && (
                  <div>
                    <h4 className="flex items-center gap-2 font-semibold text-[#1E293B] mb-2 text-sm uppercase tracking-wider">
                      <BookOpen className="w-4 h-4 text-slate-400" /> Why it matters
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">{selectedNode.whyItMatters}</p>
                  </div>
                )}

                {(() => {
                  try {
                    const concepts = selectedNode.keyConceptsJson ? JSON.parse(selectedNode.keyConceptsJson) : [];
                    if (concepts && concepts.length > 0) {
                      return (
                        <div>
                          <h4 className="flex items-center gap-2 font-semibold text-[#1E293B] mb-2 text-sm uppercase tracking-wider">
                            <Lightbulb className="w-4 h-4 text-slate-400" /> Key Concepts
                          </h4>
                          <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                            {concepts.map((c: string, i: number) => <li key={i}>{c}</li>)}
                          </ul>
                        </div>
                      );
                    }
                  } catch (e) { return null; }
                  return null;
                })()}

                {(() => {
                  try {
                    const actions = selectedNode.actionItemsJson ? JSON.parse(selectedNode.actionItemsJson) : [];
                    if (actions && actions.length > 0) {
                      return (
                        <div>
                          <h4 className="flex items-center gap-2 font-semibold text-[#1E293B] mb-2 text-sm uppercase tracking-wider">
                            <ListChecks className="w-4 h-4 text-slate-400" /> Action Items
                          </h4>
                          <ul className="space-y-2">
                            {actions.map((a: string, i: number) => (
                              <li key={i} className="flex gap-2 text-sm text-slate-600 items-start">
                                <span className="text-emerald-500 mt-0.5">•</span> <span>{a}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    }
                  } catch (e) { return null; }
                  return null;
                })()}

                {(() => {
                  try {
                    const resources = selectedNode.resourcesJson ? JSON.parse(selectedNode.resourcesJson) : [];
                    if (resources && resources.length > 0) {
                      return (
                        <div>
                          <h4 className="flex items-center gap-2 font-semibold text-[#1E293B] mb-2 text-sm uppercase tracking-wider">
                            <ExternalLink className="w-4 h-4 text-slate-400" /> Resources
                          </h4>
                          <div className="space-y-2">
                            {resources.map((r: any, i: number) => (
                              <a key={i} href={r.url || '#'} target="_blank" rel="noreferrer" className="block p-3 bg-white border border-slate-200 rounded-lg hover:border-[#2563EB] hover:shadow-sm transition-all group">
                                <div className="font-medium text-[#1E293B] group-hover:text-[#2563EB] text-sm mb-1">{r.title}</div>
                                <div className="text-xs text-slate-500 flex items-center justify-between">
                                  <span>{r.provider || 'External'}</span>
                                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#2563EB]" />
                                </div>
                              </a>
                            ))}
                          </div>
                        </div>
                      );
                    }
                  } catch (e) { return null; }
                  return null;
                })()}

                <div>
                  <h4 className="font-semibold text-[#1E293B] mb-1 text-sm uppercase tracking-wider">Estimated Effort</h4>
                  <p className="text-sm text-slate-600 font-medium">{selectedNode.estimatedHours} hours</p>
                </div>
              </div>

              <div className="mt-8 space-y-3 pt-6 border-t border-slate-100 shrink-0">
                <button 
                  onClick={() => setTutorOpen(true)}
                  className="w-full bg-[#1E293B] hover:bg-[#0F172A] text-white font-medium py-2.5 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2 mb-2"
                >
                  <MessageSquare className="w-4 h-4" /> Ask AI Tutor
                </button>
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
          ) : (
            <div className="flex flex-col flex-1 overflow-hidden">
              <button 
                onClick={() => setTutorOpen(false)}
                className="text-[#2563EB] text-sm font-medium mb-4 hover:underline self-start"
              >
                ← Back to Details
              </button>
              
              <div className="flex-1 bg-slate-50 rounded-xl border border-slate-200 p-4 overflow-y-auto mb-4 flex flex-col gap-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div className="bg-white p-3 rounded-xl rounded-tl-none border border-slate-200 text-sm text-slate-700">
                    Hi! I'm your AI tutor. Ask me anything about <strong>{selectedNode.title}</strong>!
                  </div>
                </div>
                
                {(chatHistory[selectedNode.id] || []).map((msg, i) => (
                  <div key={i} className="flex flex-col gap-4">
                    <div className="flex gap-3 justify-end">
                      <div className="bg-[#2563EB] text-white p-3 rounded-xl rounded-tr-none text-sm">
                        {msg.q}
                      </div>
                    </div>
                    {msg.a && (
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                          <MessageSquare className="w-4 h-4" />
                        </div>
                        <div className="bg-white p-3 rounded-xl rounded-tl-none border border-slate-200 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                          {msg.a}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {tutorLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div className="bg-white p-3 rounded-xl rounded-tl-none border border-slate-200 text-sm text-slate-500 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" style={{animationDelay: '0.4s'}}></div>
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleTutorSubmit} className="relative shrink-0">
                <input 
                  type="text"
                  value={tutorQuestion}
                  onChange={e => setTutorQuestion(e.target.value)}
                  placeholder="Ask a question..."
                  className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={tutorLoading}
                />
                <button 
                  type="submit"
                  disabled={tutorLoading || !tutorQuestion.trim()}
                  className="absolute right-2 top-2 bottom-2 px-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
