package com.pathforge.repository;
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
