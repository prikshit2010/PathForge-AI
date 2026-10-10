package com.pathforge.entity;
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
