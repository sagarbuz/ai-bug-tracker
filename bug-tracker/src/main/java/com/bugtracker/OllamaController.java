
package com.bugtracker;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/ai")
public class OllamaController {

    private final OllamaService ollamaService;

    public OllamaController(OllamaService ollamaService) {
        this.ollamaService = ollamaService;
    }

    @GetMapping("/test")
    public String testAi() {
        return ollamaService.testAi();
    }

    @PostMapping("/analyze")
    public Map<String, String> analyzeBug(
            @RequestBody Map<String, String> request) {

        String description = request.get("description");

        if (description == null || description.isBlank()) {
            throw new IllegalArgumentException(
                    "Bug description cannot be empty");
        }

        String analysis = ollamaService.analyzeBug(description);

        return Map.of("analysis", analysis);
    }
}

