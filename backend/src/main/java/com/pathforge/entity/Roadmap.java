package com.pathforge.entity;
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
