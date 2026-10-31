
package com.bugtracker;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
public class OllamaService {

    private final RestClient restClient;

    public OllamaService(
            @Value("${groq.api.key}") String apiKey) {

        this.restClient = RestClient.builder()
                .baseUrl("https://api.groq.com/openai/v1")
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .defaultHeader("Content-Type", "application/json")
                .build();
    }

    public String testAi() {
        return callGroq(
                "Reply with exactly: AI connected to Spring Boot"
        );
    }

    public String analyzeBug(String description) {

        String prompt = """
        Analyze the following software bug report.

        Return the result using EXACTLY this format:

        Category: <short category name>

        Suggested severity: <ONLY one of these values: Low, Medium, High, Critical>

        Summary: <ONE short sentence describing the bug. Maximum 25 words.>

        Suggested debugging steps:
        1. <First practical debugging step>
        2. <Second practical debugging step>
        3. <Third practical debugging step>

        IMPORTANT RULES:
        - Do not repeat category or severity in the summary.
        - Summary must contain exactly one sentence.
        - Severity must contain only Low, Medium, High, or Critical.
        - Provide exactly three debugging steps.
        - Keep each debugging step concise and actionable.
        - Do not add introductions, conclusions, or extra sections.
        - Follow the output format exactly.

        Bug description:
        """ + description;

        return callGroq(prompt);
    }

    private String callGroq(String prompt) {

        Map<String, Object> request = Map.of(
                "model", "openai/gpt-oss-20b",
                "messages", List.of(
                        Map.of(
                                "role", "user",
                                "content", prompt
                        )
                ),
                "temperature", 0.3
        );

        Map response = restClient.post()
                .uri("/chat/completions")
                .body(request)
                .retrieve()
                .body(Map.class);

        List choices = (List) response.get("choices");
        Map firstChoice = (Map) choices.get(0);
        Map message = (Map) firstChoice.get("message");

        return (String) message.get("content");
    }
}
