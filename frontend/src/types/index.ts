
export interface Roadmap {
  id: string;
  title: string;
  targetRole: string;
  targetIndustry: string;
  summary: string;
  estimatedTotalHours: number;
  weeklyAvailableHours: number;
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
  keyConceptsJson?: string;
  actionItemsJson?: string;
  resourcesJson?: string;
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
