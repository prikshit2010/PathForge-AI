package com.pathforge.repository;
import com.pathforge.entity.Roadmap;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface RoadmapRepository extends JpaRepository<Roadmap, String> {
    List<Roadmap> findByUserId(String userId);
}
