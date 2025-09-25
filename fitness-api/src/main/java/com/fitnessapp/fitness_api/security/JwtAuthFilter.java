package com.fitnessapp.fitness_api.security;

import com.fitnessapp.fitness_api.repository.UserRepository;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import com.fitnessapp.fitness_api.entity.User;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest req,
                                    HttpServletResponse res,
                                    FilterChain chain) throws ServletException, IOException {
        String path = req.getRequestURI();

        // Skip JWT validation for permitted endpoints
        if (path.startsWith("/api/auth/") ||
                path.startsWith("/v3/api-docs/") ||
                path.startsWith("/swagger-ui/"))
                {
            chain.doFilter(req, res);
            return;
        }

        String header = req.getHeader(HttpHeaders.AUTHORIZATION);
        if (header == null || !header.startsWith("Bearer ")) {
            res.sendError(HttpServletResponse.SC_FORBIDDEN, "No token provided");
            return;
        }

        String token = header.substring(7);
        try {
            if (jwtService.validateToken(token)) {
                String email = jwtService.extractUsername(token);
                if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    User user = userRepository.findByEmail(email).orElse(null);
                    if (user != null) {
                        var auth = new UsernamePasswordAuthenticationToken(
                                user.getEmail(),
                                null,
                                List.of(new SimpleGrantedAuthority("ROLE_USER"))
                        );
                        SecurityContextHolder.getContext().setAuthentication(auth);
                    } else {
                        res.sendError(HttpServletResponse.SC_FORBIDDEN, "User not found");
                        return;
                    }
                }
            } else {
                res.sendError(HttpServletResponse.SC_FORBIDDEN, "Invalid token");
                return;
            }
        } catch (Exception e) {
            res.sendError(HttpServletResponse.SC_FORBIDDEN, "Token processing error: " + e.getMessage());
            return;
        }

        chain.doFilter(req, res);
    }
}