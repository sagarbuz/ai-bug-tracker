
package com.bugtracker;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Service
public class OllamaService {

    private final RestClient restClient;

    public OllamaService() {
        this.restClient = RestClient.builder()
                .baseUrl("http://localhost:11434")
                .build();
    }

    public String testAi() {
        Map response = restClient.post()
                .uri("/api/generate")
                .body(Map.of(
                        "model", "qwen2.5:1.5b",
                        "prompt", "Reply with exactly: AI connected to Spring Boot",
                        "stream", false
                ))
                .retrieve()
                .body(Map.class);

        return (String) response.get("response");
    }

    public String analyzeBug(String description) {
        String prompt = """
                Analyze this software bug report.

                Return:
                1. Category
                2. Suggested severity (Low, Medium, High, or Critical)
                3. A one-sentence summary
                4. Three debugging steps

                Bug description:
                """ + description;

        Map response = restClient.post()
                .uri("/api/generate")
                .body(Map.of(
                        "model", "qwen2.5:1.5b",
                        "prompt", prompt,
                        "stream", false
                ))
                .retrieve()
                .body(Map.class);

        return (String) response.get("response");
    }
}
