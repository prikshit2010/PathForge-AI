package com.pathforge.repository;
import com.pathforge.entity.RoadmapPhase;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface RoadmapPhaseRepository extends JpaRepository<RoadmapPhase, String> {
    List<RoadmapPhase> findByRoadmapIdOrderByOrderIndexAsc(String roadmapId);
    void deleteByRoadmapId(String roadmapId);
}
