package com.pathforge.repository;
import com.pathforge.entity.RoadmapNode;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface RoadmapNodeRepository extends JpaRepository<RoadmapNode, String> {
    List<RoadmapNode> findByRoadmapId(String roadmapId);
    void deleteByRoadmapId(String roadmapId);
}
