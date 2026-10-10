package com.pathforge.entity;
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

    @Column(columnDefinition = "TEXT")
    private String keyConceptsJson;

    @Column(columnDefinition = "TEXT")
    private String actionItemsJson;

    @Column(columnDefinition = "TEXT")
    private String resourcesJson;

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
    public String getKeyConceptsJson() { return keyConceptsJson; }
    public void setKeyConceptsJson(String keyConceptsJson) { this.keyConceptsJson = keyConceptsJson; }
    public String getActionItemsJson() { return actionItemsJson; }
    public void setActionItemsJson(String actionItemsJson) { this.actionItemsJson = actionItemsJson; }
    public String getResourcesJson() { return resourcesJson; }
    public void setResourcesJson(String resourcesJson) { this.resourcesJson = resourcesJson; }
}
