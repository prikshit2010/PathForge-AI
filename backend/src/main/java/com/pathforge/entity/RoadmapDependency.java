package com.pathforge.entity;
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
