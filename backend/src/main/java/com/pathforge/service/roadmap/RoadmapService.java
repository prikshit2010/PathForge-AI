package com.pathforge.service.roadmap;
import com.pathforge.dto.RoadmapGenerationRequest;
import com.pathforge.entity.*;
import com.pathforge.repository.*;
import com.pathforge.service.ai.OpenAIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RoadmapService {
    @Autowired private RoadmapRepository roadmapRepo;
    @Autowired private RoadmapPhaseRepository phaseRepo;
    @Autowired private RoadmapNodeRepository nodeRepo;
    @Autowired private RoadmapDependencyRepository depRepo;
    @Autowired private OpenAIService aiService;
    private final ObjectMapper mapper = new ObjectMapper();

    public List<Roadmap> getUserRoadmaps(String userId) {
        return roadmapRepo.findByUserId(userId);
    }

    @Transactional
    public Map<String, Object> generateAndSaveRoadmap(RoadmapGenerationRequest request, String userId) {
        String prompt = "Create a JSON roadmap for a " + request.getTargetRole() + " in " + request.getTargetIndustry() + ".";
        prompt += " User Education: " + request.getEducationLevel() + ".";
        prompt += " User Experience: " + request.getExperienceLevel() + ".";
        prompt += " User knows: " + (request.getExistingSkills() != null && !request.getExistingSkills().isEmpty() ? String.join(",", request.getExistingSkills()) : "nothing") + ".";
        prompt += " Learning Preference: " + request.getLearningStyle() + ".";
        prompt += " Weekly available hours: " + request.getWeeklyAvailableHours() + ", Target duration (weeks): " + request.getTargetDurationWeeks() + ".";
        if (request.getSpecificGoals() != null && !request.getSpecificGoals().trim().isEmpty()) {
            prompt += " User's specific goals & dream company context: " + request.getSpecificGoals() + ". Tailor the roadmap heavily towards this specific goal.";
        }
        prompt += " Provide a highly specific, adaptive multi-phase roadmap. Return { title, targetRole, targetIndustry, summary, estimatedTotalHours, targetDurationWeeks, phases: [{id, title, description, order}], nodes: [{id, phaseId, title, type, description, whyItMatters, difficulty, estimatedHours, prerequisiteIds: [], status: 'AVAILABLE' or 'LOCKED', isRequired, keyConcepts: [\"concept 1\"], actionItems: [\"action 1\"], resources: [ {title: \"Course Name\", url: \"https://...\", provider: \"Provider Name\"} ] }] }";
        
        String jsonStr = aiService.generateRoadmap(prompt);
        try {
            if (jsonStr.startsWith("```json")) {
                jsonStr = jsonStr.substring(7);
            } else if (jsonStr.startsWith("```")) {
                jsonStr = jsonStr.substring(3);
            }
            if (jsonStr.endsWith("```")) {
                jsonStr = jsonStr.substring(0, jsonStr.length() - 3);
            }
            jsonStr = jsonStr.trim();
            Map<String, Object> result = mapper.readValue(jsonStr, Map.class);
            Roadmap rm = new Roadmap();
            rm.setUserId(userId);
            rm.setTitle((String) result.get("title"));
            rm.setTargetRole((String) result.get("targetRole"));
            rm.setTargetIndustry((String) result.get("targetIndustry"));
            rm.setSummary((String) result.get("summary"));
            rm.setEstimatedTotalHours((Integer) result.get("estimatedTotalHours"));
            rm.setTargetDurationWeeks((Integer) result.get("targetDurationWeeks"));
            rm = roadmapRepo.save(rm);
            
            List<Map<String, Object>> phases = (List<Map<String, Object>>) result.get("phases");
            Map<String, String> phaseIdMap = new HashMap<>();
            if (phases != null) {
                for(Map<String, Object> p : phases) {
                    RoadmapPhase rp = new RoadmapPhase();
                    rp.setRoadmapId(rm.getId());
                    rp.setTitle((String) p.get("title"));
                    rp.setDescription((String) p.get("description"));
                    rp.setOrderIndex((Integer) p.get("order"));
                    rp = phaseRepo.save(rp);
                    phaseIdMap.put((String) p.get("id"), rp.getId());
                }
            }
            
            List<Map<String, Object>> nodes = (List<Map<String, Object>>) result.get("nodes");
            Map<String, String> nodeIdMap = new HashMap<>();
            if (nodes != null) {
                for(Map<String, Object> n : nodes) {
                    RoadmapNode rn = new RoadmapNode();
                    rn.setRoadmapId(rm.getId());
                    rn.setPhaseId(phaseIdMap.get((String) n.get("phaseId")));
                    rn.setTitle((String) n.get("title"));
                    rn.setType((String) n.get("type"));
                    rn.setDescription((String) n.get("description"));
                    rn.setStatus("AVAILABLE");
                    rn.setIsRequired((Boolean) n.getOrDefault("isRequired", true));
                    rn.setEstimatedHours((Integer) n.getOrDefault("estimatedHours", 10));
                    
                    try {
                        if (n.get("keyConcepts") != null) {
                            rn.setKeyConceptsJson(mapper.writeValueAsString(n.get("keyConcepts")));
                        }
                        if (n.get("actionItems") != null) {
                            rn.setActionItemsJson(mapper.writeValueAsString(n.get("actionItems")));
                        }
                        if (n.get("resources") != null) {
                            rn.setResourcesJson(mapper.writeValueAsString(n.get("resources")));
                        }
                    } catch (Exception ex) {
                        ex.printStackTrace();
                    }

                    rn = nodeRepo.save(rn);
                    nodeIdMap.put((String) n.get("id"), rn.getId());
                }
                
                for(Map<String, Object> n : nodes) {
                    List<String> prereqs = (List<String>) n.get("prerequisiteIds");
                    if (prereqs != null) {
                        for (String pId : prereqs) {
                            RoadmapDependency rd = new RoadmapDependency();
                            rd.setSourceNodeId(nodeIdMap.get(pId));
                            rd.setTargetNodeId(nodeIdMap.get((String) n.get("id")));
                            if (rd.getSourceNodeId() != null && rd.getTargetNodeId() != null) {
                                depRepo.save(rd);
                            }
                        }
                    }
                }
            }
            return getRoadmapGraph(rm.getId());
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to generate roadmap");
        }
    }

    public Map<String, Object> getRoadmap(String id) {
        return Map.of("roadmap", roadmapRepo.findById(id).orElseThrow());
    }

    public Map<String, Object> getRoadmapGraph(String id) {
        Roadmap rm = roadmapRepo.findById(id).orElseThrow();
        List<RoadmapPhase> phases = phaseRepo.findByRoadmapIdOrderByOrderIndexAsc(id);
        List<RoadmapNode> nodes = nodeRepo.findByRoadmapId(id);
        
        List<String> nodeIds = nodes.stream().map(RoadmapNode::getId).collect(Collectors.toList());
        List<RoadmapDependency> edges = nodeIds.isEmpty() ? new ArrayList<>() : depRepo.findBySourceNodeIdIn(nodeIds);
        
        return Map.of(
            "roadmap", rm,
            "phases", phases,
            "nodes", nodes,
            "edges", edges
        );
    }
    
    public String explainNode(String nodeId, String question) {
        RoadmapNode node = nodeRepo.findById(nodeId).orElseThrow();
        String topic = node.getTitle();
        if (node.getDescription() != null) {
            topic += " (" + node.getDescription() + ")";
        }
        return aiService.explainConcept(topic, question);
    }

    @Transactional
    public void updateNodeStatus(String nodeId, String status) {
        RoadmapNode node = nodeRepo.findById(nodeId).orElseThrow();
        node.setStatus(status);
        nodeRepo.save(node);
        // Simple logic to unlock dependents if COMPLETED or KNOWN
        if ("COMPLETED".equals(status) || "KNOWN".equals(status)) {
            List<RoadmapDependency> deps = depRepo.findBySourceNodeId(nodeId);
            for (RoadmapDependency dep : deps) {
                // Here we would properly check if ALL prerequisites are met, but for simplicity:
                RoadmapNode target = nodeRepo.findById(dep.getTargetNodeId()).orElse(null);
                if (target != null && "LOCKED".equals(target.getStatus())) {
                    target.setStatus("AVAILABLE");
                    nodeRepo.save(target);
                }
            }
        }
    }
    
    @Transactional
    public Map<String, Object> adaptRoadmap(String id) {
        // Mock adaptation: just return current for now
        return getRoadmapGraph(id);
    }
}
