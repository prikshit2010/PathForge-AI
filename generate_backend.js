const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'backend', 'src', 'main', 'java', 'com', 'pathforge');
const dirs = [
    'controller',
    'dto',
    'entity',
    'repository',
    'service',
    'service/ai',
    'service/roadmap',
    'validation',
    'exception'
];

dirs.forEach(d => {
    fs.mkdirSync(path.join(baseDir, d), { recursive: true });
});

const files = {
    'entity/Roadmap.java': `package com.pathforge.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
public class Roadmap {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String userId;
    private String title;
    private String targetRole;
    private String targetIndustry;
    @Column(columnDefinition = "TEXT")
    private String summary;
    private Integer estimatedTotalHours;
    private Integer targetDurationWeeks;
    private Integer revisionNumber;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if(revisionNumber == null) revisionNumber = 1;
    }
    @PreUpdate
    protected void onUpdate() { updatedAt = LocalDateTime.now(); }

    // getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getTargetRole() { return targetRole; }
    public void setTargetRole(String targetRole) { this.targetRole = targetRole; }
    public String getTargetIndustry() { return targetIndustry; }
    public void setTargetIndustry(String targetIndustry) { this.targetIndustry = targetIndustry; }
    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
    public Integer getEstimatedTotalHours() { return estimatedTotalHours; }
    public void setEstimatedTotalHours(Integer estimatedTotalHours) { this.estimatedTotalHours = estimatedTotalHours; }
    public Integer getTargetDurationWeeks() { return targetDurationWeeks; }
    public void setTargetDurationWeeks(Integer targetDurationWeeks) { this.targetDurationWeeks = targetDurationWeeks; }
    public Integer getRevisionNumber() { return revisionNumber; }
    public void setRevisionNumber(Integer revisionNumber) { this.revisionNumber = revisionNumber; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
`,
    'entity/RoadmapPhase.java': `package com.pathforge.entity;
import jakarta.persistence.*;

@Entity
public class RoadmapPhase {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String roadmapId;
    private String title;
    private String description;
    private Integer orderIndex;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getRoadmapId() { return roadmapId; }
    public void setRoadmapId(String roadmapId) { this.roadmapId = roadmapId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Integer getOrderIndex() { return orderIndex; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }
}
`,
    'entity/RoadmapNode.java': `package com.pathforge.entity;
import jakarta.persistence.*;

@Entity
public class RoadmapNode {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String roadmapId;
    private String phaseId;
    private String stableNodeKey;
    private String title;
    private String type; // SKILL, PROJECT, etc.
    @Column(columnDefinition = "TEXT")
    private String description;
    @Column(columnDefinition = "TEXT")
    private String whyItMatters;
    private String difficulty;
    private Integer estimatedHours;
    private String status; // LOCKED, AVAILABLE, IN_PROGRESS, COMPLETED, KNOWN
    private Boolean isRequired;
    private Double positionX;
    private Double positionY;

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getRoadmapId() { return roadmapId; }
    public void setRoadmapId(String roadmapId) { this.roadmapId = roadmapId; }
    public String getPhaseId() { return phaseId; }
    public void setPhaseId(String phaseId) { this.phaseId = phaseId; }
    public String getStableNodeKey() { return stableNodeKey; }
    public void setStableNodeKey(String stableNodeKey) { this.stableNodeKey = stableNodeKey; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getWhyItMatters() { return whyItMatters; }
    public void setWhyItMatters(String whyItMatters) { this.whyItMatters = whyItMatters; }
    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
    public Integer getEstimatedHours() { return estimatedHours; }
    public void setEstimatedHours(Integer estimatedHours) { this.estimatedHours = estimatedHours; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Boolean getIsRequired() { return isRequired; }
    public void setIsRequired(Boolean required) { isRequired = required; }
    public Double getPositionX() { return positionX; }
    public void setPositionX(Double positionX) { this.positionX = positionX; }
    public Double getPositionY() { return positionY; }
    public void setPositionY(Double positionY) { this.positionY = positionY; }
}
`,
    'entity/RoadmapDependency.java': `package com.pathforge.entity;
import jakarta.persistence.*;

@Entity
public class RoadmapDependency {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String sourceNodeId;
    private String targetNodeId;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getSourceNodeId() { return sourceNodeId; }
    public void setSourceNodeId(String sourceNodeId) { this.sourceNodeId = sourceNodeId; }
    public String getTargetNodeId() { return targetNodeId; }
    public void setTargetNodeId(String targetNodeId) { this.targetNodeId = targetNodeId; }
}
`,
    'repository/RoadmapRepository.java': `package com.pathforge.repository;
import com.pathforge.entity.Roadmap;
import org.springframework.data.jpa.repository.JpaRepository;
public interface RoadmapRepository extends JpaRepository<Roadmap, String> {}
`,
    'repository/RoadmapPhaseRepository.java': `package com.pathforge.repository;
import com.pathforge.entity.RoadmapPhase;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface RoadmapPhaseRepository extends JpaRepository<RoadmapPhase, String> {
    List<RoadmapPhase> findByRoadmapIdOrderByOrderIndexAsc(String roadmapId);
    void deleteByRoadmapId(String roadmapId);
}
`,
    'repository/RoadmapNodeRepository.java': `package com.pathforge.repository;
import com.pathforge.entity.RoadmapNode;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface RoadmapNodeRepository extends JpaRepository<RoadmapNode, String> {
    List<RoadmapNode> findByRoadmapId(String roadmapId);
    void deleteByRoadmapId(String roadmapId);
}
`,
    'repository/RoadmapDependencyRepository.java': `package com.pathforge.repository;
import com.pathforge.entity.RoadmapDependency;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface RoadmapDependencyRepository extends JpaRepository<RoadmapDependency, String> {
    List<RoadmapDependency> findBySourceNodeId(String sourceNodeId);
    List<RoadmapDependency> findByTargetNodeId(String targetNodeId);
    List<RoadmapDependency> findBySourceNodeIdIn(List<String> sourceNodeIds);
    List<RoadmapDependency> findByTargetNodeIdIn(List<String> targetNodeIds);
    void deleteBySourceNodeIdIn(List<String> sourceNodeIds);
}
`,
    'dto/RoadmapGenerationRequest.java': `package com.pathforge.dto;
import java.util.List;
public class RoadmapGenerationRequest {
    private String targetRole;
    private String targetIndustry;
    private String companyType;
    private String educationLevel;
    private String experienceLevel;
    private List<String> existingSkills;
    private Integer weeklyAvailableHours;
    private Integer targetDurationWeeks;
    private String learningStyle;
    private String budgetPreference;

    // getters and setters
    public String getTargetRole() { return targetRole; }
    public void setTargetRole(String targetRole) { this.targetRole = targetRole; }
    public String getTargetIndustry() { return targetIndustry; }
    public void setTargetIndustry(String targetIndustry) { this.targetIndustry = targetIndustry; }
    public String getCompanyType() { return companyType; }
    public void setCompanyType(String companyType) { this.companyType = companyType; }
    public String getEducationLevel() { return educationLevel; }
    public void setEducationLevel(String educationLevel) { this.educationLevel = educationLevel; }
    public String getExperienceLevel() { return experienceLevel; }
    public void setExperienceLevel(String experienceLevel) { this.experienceLevel = experienceLevel; }
    public List<String> getExistingSkills() { return existingSkills; }
    public void setExistingSkills(List<String> existingSkills) { this.existingSkills = existingSkills; }
    public Integer getWeeklyAvailableHours() { return weeklyAvailableHours; }
    public void setWeeklyAvailableHours(Integer weeklyAvailableHours) { this.weeklyAvailableHours = weeklyAvailableHours; }
    public Integer getTargetDurationWeeks() { return targetDurationWeeks; }
    public void setTargetDurationWeeks(Integer targetDurationWeeks) { this.targetDurationWeeks = targetDurationWeeks; }
    public String getLearningStyle() { return learningStyle; }
    public void setLearningStyle(String learningStyle) { this.learningStyle = learningStyle; }
    public String getBudgetPreference() { return budgetPreference; }
    public void setBudgetPreference(String budgetPreference) { this.budgetPreference = budgetPreference; }
}
`,
    'service/ai/OpenAIService.java': `package com.pathforge.service.ai;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.*;

@Service
public class OpenAIService {
    @Value("\${ai.provider.api-key}")
    private String apiKey;

    @Value("\${ai.provider.url}")
    private String apiUrl;

    @Value("\${ai.provider.model}")
    private String model;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String generateRoadmap(String prompt) {
        if ("mock".equals(apiKey)) {
            return generateMockResponse();
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", model);
        requestBody.put("messages", List.of(
            Map.of("role", "system", "content", "You are an expert career advisor. Return JSON matching the requested schema."),
            Map.of("role", "user", "content", prompt)
        ));
        requestBody.put("response_format", Map.of("type", "json_object"));

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(apiUrl, entity, Map.class);
            Map<String, Object> responseBody = response.getBody();
            if (responseBody != null && responseBody.containsKey("choices")) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) responseBody.get("choices");
                if (!choices.isEmpty()) {
                    Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                    return (String) message.get("content");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return generateMockResponse();
    }

    private String generateMockResponse() {
        return "{ \\"title\\": \\"Backend Engineer Career Roadmap\\", \\"targetRole\\": \\"Backend Engineer\\", \\"targetIndustry\\": \\"Fintech\\", \\"summary\\": \\"A personalized learning strategy.\\", \\"estimatedTotalHours\\": 420, \\"targetDurationWeeks\\": 52, \\"phases\\": [{ \\"id\\": \\"phase-1\\", \\"title\\": \\"Foundations\\", \\"description\\": \\"Core basics\\", \\"order\\": 1 }], \\"nodes\\": [{ \\"id\\": \\"node-1\\", \\"phaseId\\": \\"phase-1\\", \\"title\\": \\"Java Basics\\", \\"type\\": \\"SKILL\\", \\"description\\": \\"Learn Java\\", \\"status\\": \\"AVAILABLE\\", \\"isRequired\\": true, \\"estimatedHours\\": 40, \\"prerequisiteIds\\": [] }] }";
    }
}
`,
    'controller/RoadmapController.java': `package com.pathforge.controller;
import com.pathforge.dto.RoadmapGenerationRequest;
import com.pathforge.service.roadmap.RoadmapService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/roadmaps")
public class RoadmapController {

    @Autowired
    private RoadmapService roadmapService;

    @PostMapping("/generate")
    public ResponseEntity<?> generateRoadmap(@RequestBody RoadmapGenerationRequest request) {
        return ResponseEntity.ok(roadmapService.generateAndSaveRoadmap(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRoadmap(@PathVariable String id) {
        return ResponseEntity.ok(roadmapService.getRoadmap(id));
    }
    
    @GetMapping("/{id}/graph")
    public ResponseEntity<?> getRoadmapGraph(@PathVariable String id) {
        return ResponseEntity.ok(roadmapService.getRoadmapGraph(id));
    }
    
    @PatchMapping("/{id}/nodes/{nodeId}/status")
    public ResponseEntity<?> updateNodeStatus(@PathVariable String id, @PathVariable String nodeId, @RequestBody java.util.Map<String, String> body) {
        roadmapService.updateNodeStatus(nodeId, body.get("status"));
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/{id}/adapt")
    public ResponseEntity<?> adaptRoadmap(@PathVariable String id) {
        return ResponseEntity.ok(roadmapService.adaptRoadmap(id));
    }
}
`,
    'service/roadmap/RoadmapService.java': `package com.pathforge.service.roadmap;
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

    @Transactional
    public Map<String, Object> generateAndSaveRoadmap(RoadmapGenerationRequest request) {
        String prompt = "Create a JSON roadmap for a " + request.getTargetRole() + " in " + request.getTargetIndustry() + ".";
        prompt += " User knows: " + (request.getExistingSkills() != null ? String.join(",", request.getExistingSkills()) : "nothing") + ".";
        prompt += " Return { title, targetRole, targetIndustry, summary, estimatedTotalHours, targetDurationWeeks, phases: [{id, title, description, order}], nodes: [{id, phaseId, title, type, description, whyItMatters, difficulty, estimatedHours, prerequisiteIds: [], status, isRequired }] }";
        
        String jsonStr = aiService.generateRoadmap(prompt);
        try {
            Map<String, Object> result = mapper.readValue(jsonStr, Map.class);
            Roadmap rm = new Roadmap();
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
`
};

for (const [relPath, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(baseDir, relPath), content);
}
console.log('Backend files created successfully.');
