package com.pathforge.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class SampleDataSeeder implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        jdbcTemplate.update("DELETE FROM roadmap_dependency WHERE source_node_id LIKE 'n%'");
        jdbcTemplate.update("DELETE FROM roadmap_node WHERE id LIKE 'n%'");
        jdbcTemplate.update("DELETE FROM roadmap_phase WHERE id LIKE 'p%'");
        jdbcTemplate.update("DELETE FROM roadmap WHERE id LIKE 'sample-%'");

        seedSampleRoadmap1();
        seedSampleRoadmap2();
        seedSampleRoadmap3();
    }

    private void seedSampleRoadmap1() {
        String id = "sample-123";
        jdbcTemplate.update("INSERT INTO roadmap (id, title, target_role, target_industry, summary, estimated_total_hours, target_duration_weeks, revision_number, created_at, updated_at) " +
                "VALUES (?, 'Sample: Backend Engineer', 'Backend Engineer', 'Fintech', 'A comprehensive guide to becoming a backend engineer in fintech. Covers networking, databases, security, and scaling.', 600, 26, 1, NOW(), NOW())", id);

        jdbcTemplate.update("INSERT INTO roadmap_phase (id, roadmap_id, title, description, order_index) VALUES ('p1', ?, 'Internet & Networking', 'How the web works', 1)", id);
        jdbcTemplate.update("INSERT INTO roadmap_phase (id, roadmap_id, title, description, order_index) VALUES ('p2', ?, 'Programming Language', 'Mastering Java & OOP', 2)", id);
        jdbcTemplate.update("INSERT INTO roadmap_phase (id, roadmap_id, title, description, order_index) VALUES ('p3', ?, 'Version Control', 'Git and GitHub', 3)", id);
        jdbcTemplate.update("INSERT INTO roadmap_phase (id, roadmap_id, title, description, order_index) VALUES ('p4', ?, 'Databases', 'Relational & NoSQL', 4)", id);
        jdbcTemplate.update("INSERT INTO roadmap_phase (id, roadmap_id, title, description, order_index) VALUES ('p5', ?, 'APIs & Frameworks', 'Spring Boot & REST', 5)", id);
        jdbcTemplate.update("INSERT INTO roadmap_phase (id, roadmap_id, title, description, order_index) VALUES ('p6', ?, 'Advanced Concepts', 'Caching & Message Brokers', 6)", id);

        // Nodes
        addNode("n1", id, "p1", "How the Internet Works", "SKILL", "DNS, HTTP/HTTPS, TCP/IP", "AVAILABLE", 10, true);
        addNode("n2", id, "p2", "Java Basics", "SKILL", "Syntax, Variables, Data Types", "LOCKED", 20, true);
        addNode("n3", id, "p2", "Object Oriented Programming", "SKILL", "Inheritance, Polymorphism, Encapsulation", "LOCKED", 30, true);
        addNode("n4", id, "p2", "Data Structures", "SKILL", "Lists, Maps, Trees, Graphs", "LOCKED", 40, true);
        addNode("n5", id, "p3", "Git Version Control", "TOOL", "Commits, Branches, Merging, Rebasing", "LOCKED", 15, true);
        addNode("n6", id, "p4", "Relational Databases", "SKILL", "SQL, Normalization, ACID, Indexes", "LOCKED", 35, true);
        addNode("n7", id, "p4", "PostgreSQL", "TOOL", "Practical RDBMS administration", "LOCKED", 25, false);
        addNode("n8", id, "p4", "Redis", "TOOL", "Key-Value store, Caching", "LOCKED", 15, false);
        addNode("n9", id, "p5", "RESTful APIs", "SKILL", "Verbs, Status Codes, Best Practices", "LOCKED", 20, true);
        addNode("n10", id, "p5", "Spring Boot", "FRAMEWORK", "IoC, Dependency Injection, Auto-configuration", "LOCKED", 50, true);
        addNode("n11", id, "p5", "Spring Security", "FRAMEWORK", "Authentication, JWT, OAuth2", "LOCKED", 35, true);
        addNode("n12", id, "p6", "Message Brokers (Kafka)", "TOOL", "Pub/Sub, Event-driven architecture", "LOCKED", 30, false);
        addNode("n13", id, "p6", "Docker & Containers", "TOOL", "Containerization basics", "LOCKED", 25, true);

        // Edges
        addDep("n1", "n2");
        addDep("n2", "n3");
        addDep("n3", "n4");
        addDep("n4", "n5");
        addDep("n5", "n6");
        addDep("n6", "n7");
        addDep("n6", "n9");
        addDep("n9", "n10");
        addDep("n4", "n10");
        addDep("n10", "n11");
        addDep("n10", "n8");
        addDep("n11", "n12");
        addDep("n10", "n13");
    }

    private void seedSampleRoadmap2() {
        String id = "sample-456";
        jdbcTemplate.update("INSERT INTO roadmap (id, title, target_role, target_industry, summary, estimated_total_hours, target_duration_weeks, revision_number, created_at, updated_at) " +
                "VALUES (?, 'Sample: Data Scientist', 'Data Scientist', 'Healthcare', 'Step-by-step path to health tech data science.', 500, 32, 1, NOW(), NOW())", id);
        // Minimal fallback for 2nd
        jdbcTemplate.update("INSERT INTO roadmap_phase (id, roadmap_id, title, description, order_index) VALUES ('p21', ?, 'Math & Stats', 'Probability and Linear Algebra', 1)", id);
        addNode("n20", id, "p21", "Statistics Basics", "SKILL", "Distributions and Testing", "AVAILABLE", 45, true);
    }

    private void seedSampleRoadmap3() {
        String id = "sample-789";
        jdbcTemplate.update("INSERT INTO roadmap (id, title, target_role, target_industry, summary, estimated_total_hours, target_duration_weeks, revision_number, created_at, updated_at) " +
                "VALUES (?, 'Sample: UI/UX Designer', 'UI/UX Designer', 'Agency', 'Design systems and user research for agency work.', 300, 20, 1, NOW(), NOW())", id);
        // Minimal fallback for 3rd
        jdbcTemplate.update("INSERT INTO roadmap_phase (id, roadmap_id, title, description, order_index) VALUES ('p31', ?, 'UX Research', 'User Interviews', 1)", id);
        addNode("n30", id, "p31", "User Testing", "SKILL", "Validate ideas", "AVAILABLE", 30, true);
    }

    private void addNode(String nId, String rId, String pId, String title, String type, String desc, String status, int hours, boolean required) {
        String concepts = "[\"Core Principles\", \"Best Practices\", \"Common Pitfalls\"]";
        String actions = "[\"Read official documentation\", \"Complete 2 small projects\", \"Build a sandbox environment\"]";
        String resources = "[{\"title\": \"FreeCodeCamp Crash Course\", \"url\": \"https://freecodecamp.org\", \"provider\": \"FreeCodeCamp\"}, {\"title\": \"Official Docs\", \"url\": \"https://devdocs.io\", \"provider\": \"Documentation\"}]";
        jdbcTemplate.update("INSERT INTO roadmap_node (id, roadmap_id, phase_id, title, type, description, why_it_matters, status, estimated_hours, is_required, key_concepts_json, action_items_json, resources_json) VALUES (?, ?, ?, ?, ?, ?, 'Industry Standard', ?, ?, ?, ?, ?, ?)",
            nId, rId, pId, title, type, desc, status, hours, required, concepts, actions, resources);
    }

    private void addDep(String src, String tgt) {
        jdbcTemplate.update("INSERT INTO roadmap_dependency (id, source_node_id, target_node_id) VALUES (UUID(), ?, ?)", src, tgt);
    }
}
