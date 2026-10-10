package com.pathforge.dto;
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
    private String specificGoals;

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
    public String getSpecificGoals() { return specificGoals; }
    public void setSpecificGoals(String specificGoals) { this.specificGoals = specificGoals; }
}
