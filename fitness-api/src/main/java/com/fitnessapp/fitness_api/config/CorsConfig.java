package com.fitnessapp.fitness_api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;
import java.util.Collections;

@Configuration
public class CorsConfig {

    /**
     * Global CORS Configuration Bean
     * This is used by Spring Security
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Allow specific origins (modify based on your frontend URLs)
        configuration.setAllowedOriginPatterns(Arrays.asList(
                "http://localhost:3000",      // React default port
                "http://localhost:3001",      // React alternative port
                "http://localhost:4200",      // Angular default port
                "http://localhost:8080",      // Spring Boot default port
                "http://localhost:8081",      // Alternative backend port
                "http://127.0.0.1:*",        // Local IP with any port
                "https://localhost:*",        // HTTPS localhost
                "file://*",                   // File protocol for mobile apps
                "*"                           // Allow all (use only in development)
        ));

        // Allow specific HTTP methods
        configuration.setAllowedMethods(Arrays.asList(
                "GET",
                "POST",
                "PUT",
                "PATCH",
                "DELETE",
                "OPTIONS",
                "HEAD"
        ));

        // Allow all headers
        configuration.setAllowedHeaders(Arrays.asList(
                "*"
        ));

        // Specify which headers can be exposed to the client
        configuration.setExposedHeaders(Arrays.asList(
                "Authorization",
                "Content-Type",
                "X-Requested-With",
                "Accept",
                "Origin",
                "Access-Control-Request-Method",
                "Access-Control-Request-Headers",
                "Access-Control-Allow-Origin",
                "Access-Control-Allow-Credentials",
                "X-Total-Count",
                "X-Page-Count"
        ));

        // Allow credentials (cookies, authorization headers, TLS client certificates)
        configuration.setAllowCredentials(true);

        // How long the browser should cache preflight requests (in seconds)
        configuration.setMaxAge(3600L); // 1 hour

        // Apply this configuration to all paths
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    /**
     * Alternative CORS Filter Bean (if the above doesn't work)
     * Uncomment this if you need more control over CORS filtering
     */
    /*
    @Bean
    public CorsFilter corsFilter() {
        return new CorsFilter(corsConfigurationSource());
    }
    */

    /**
     * WebMvcConfigurer approach for CORS
     * This handles CORS at the MVC level (before Spring Security)
     */
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOriginPatterns(
                                "http://localhost:*",
                                "https://localhost:*",
                                "http://127.0.0.1:*",
                                "https://127.0.0.1:*",
                                "*" // Remove in production
                        )
                        .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD")
                        .allowedHeaders("*")
                        .exposedHeaders(
                                "Authorization",
                                "Content-Type",
                                "X-Total-Count",
                                "X-Page-Count"
                        )
                        .allowCredentials(true)
                        .maxAge(3600);
            }
        };
    }

    /**
     * Production-ready CORS Configuration
     * Use this method for production deployment
     */
    public CorsConfigurationSource productionCorsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Only allow specific production domains
        configuration.setAllowedOrigins(Arrays.asList(
                "https://yourfrontend.com",
                "https://www.yourfrontend.com",
                "https://api.yourapp.com"
        ));

        configuration.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE", "OPTIONS"
        ));

        configuration.setAllowedHeaders(Arrays.asList(
                "Authorization",
                "Content-Type",
                "X-Requested-With",
                "Accept"
        ));

        configuration.setExposedHeaders(Arrays.asList(
                "Authorization",
                "Content-Type"
        ));

        configuration.setAllowCredentials(true);
        configuration.setMaxAge(1800L); // 30 minutes

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}