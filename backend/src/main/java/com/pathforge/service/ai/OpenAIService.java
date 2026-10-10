package com.pathforge.service.ai;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.*;

@Service
public class OpenAIService {
    @Value("${ai.provider.api-key}")
    private String apiKey;

    @Value("${ai.provider.url}")
    private String apiUrl;

    @Value("${ai.provider.model}")
    private String model;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String explainConcept(String topic, String userQuestion) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String fullPrompt = "You are an expert AI tutor. The student is learning about '" + topic + "'. The student asks: '" + userQuestion + "'. Provide a helpful, clear, and encouraging explanation. Do not use markdown wrappers for JSON, just return plain text.";

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", List.of(
            Map.of("parts", List.of(
                Map.of("text", fullPrompt)
            ))
        ));

        String requestUrl = apiUrl + "?key=" + apiKey;
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(requestUrl, entity, Map.class);
            Map<String, Object> responseBody = response.getBody();
            if (responseBody != null && responseBody.containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseBody.get("candidates");
                if (!candidates.isEmpty()) {
                    Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                    List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                    if (!parts.isEmpty()) {
                        return (String) parts.get(0).get("text");
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "Sorry, I am currently experiencing high demand. Please try asking again in a moment!";
        }
        return "I couldn't generate an answer right now.";
    }

    public String generateRoadmap(String prompt) {
        if ("mock".equals(apiKey)) {
            return generateMockResponse();
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // System instructions to enforce JSON output
        String fullPrompt = "You are an expert career advisor. Return ONLY a valid JSON object matching the requested schema. Do not include markdown formatting or backticks. " + prompt;

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", List.of(
            Map.of("parts", List.of(
                Map.of("text", fullPrompt)
            ))
        ));
        
        Map<String, Object> generationConfig = new HashMap<>();
        generationConfig.put("response_mime_type", "application/json");
        requestBody.put("generationConfig", generationConfig);

        String requestUrl = apiUrl + "?key=" + apiKey;
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(requestUrl, entity, Map.class);
            Map<String, Object> responseBody = response.getBody();
            if (responseBody != null && responseBody.containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseBody.get("candidates");
                if (!candidates.isEmpty()) {
                    Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                    List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                    if (!parts.isEmpty()) {
                        String text = (String) parts.get(0).get("text");
                        // Clean up markdown if any
                        text = text.replaceAll("^```json", "").replaceAll("```$", "").trim();
                        return text;
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to generate roadmap from AI provider", e);
        }
        throw new RuntimeException("AI provider returned an empty or invalid response");
    }

    private String generateMockResponse() {
        return "{ \"title\": \"Backend Engineer Career Roadmap\", \"targetRole\": \"Backend Engineer\", \"targetIndustry\": \"Fintech\", \"summary\": \"A personalized learning strategy.\", \"estimatedTotalHours\": 420, \"targetDurationWeeks\": 52, \"phases\": [{ \"id\": \"phase-1\", \"title\": \"Foundations\", \"description\": \"Core basics\", \"order\": 1 }], \"nodes\": [{ \"id\": \"node-1\", \"phaseId\": \"phase-1\", \"title\": \"Java Basics\", \"type\": \"SKILL\", \"description\": \"Learn Java\", \"status\": \"AVAILABLE\", \"isRequired\": true, \"estimatedHours\": 40, \"prerequisiteIds\": [] }] }";
    }
}
