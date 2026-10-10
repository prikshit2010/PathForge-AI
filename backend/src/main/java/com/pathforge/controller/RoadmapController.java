package com.pathforge.controller;
import com.pathforge.dto.RoadmapGenerationRequest;
import com.pathforge.service.roadmap.RoadmapService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession;
import java.util.Map;

@RestController
@RequestMapping("/api/roadmaps")
public class RoadmapController {

    @Autowired
    private RoadmapService roadmapService;

    @GetMapping
    public ResponseEntity<?> getUserRoadmaps(HttpSession session) {
        String userId = (String) session.getAttribute("USER_ID");
        if (userId == null) return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        return ResponseEntity.ok(roadmapService.getUserRoadmaps(userId));
    }

    @PostMapping("/generate")
    public ResponseEntity<?> generateRoadmap(@RequestBody RoadmapGenerationRequest request, HttpSession session) {
        String userId = (String) session.getAttribute("USER_ID");
        if (userId == null) return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        
        return ResponseEntity.ok(roadmapService.generateAndSaveRoadmap(request, userId));
    }

    @GetMapping("/samples")
    public ResponseEntity<?> getSampleRoadmaps() {
        return ResponseEntity.ok(Map.of(
            "samples", java.util.List.of(
                roadmapService.getRoadmapGraph("sample-123"),
                roadmapService.getRoadmapGraph("sample-456"),
                roadmapService.getRoadmapGraph("sample-789")
            )
        ));
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
    public ResponseEntity<?> updateNodeStatus(@PathVariable String id, @PathVariable String nodeId, @RequestBody Map<String, String> body, HttpSession session) {
        roadmapService.updateNodeStatus(nodeId, body.get("status"));
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/{id}/nodes/{nodeId}/tutor")
    public ResponseEntity<?> tutorNode(@PathVariable String id, @PathVariable String nodeId, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(Map.of("answer", roadmapService.explainNode(nodeId, body.get("question"))));
    }

    @PostMapping("/{id}/adapt")
    public ResponseEntity<?> adaptRoadmap(@PathVariable String id) {
        return ResponseEntity.ok(roadmapService.adaptRoadmap(id));
    }
}
