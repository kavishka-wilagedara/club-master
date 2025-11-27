package com.uokclubmanagement.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class FrontendConfig {

    @Value("${frontend.port}")
    private int frontendPort;

    // Getter
    public int getFrontendPort() {
        return frontendPort;
    }
}