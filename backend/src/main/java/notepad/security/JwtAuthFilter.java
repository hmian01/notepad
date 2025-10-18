package notepad.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;


@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    // runs on every incoming request
    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain) throws ServletException, IOException {

        // gets the request header and ensures it's validity (has bearer token)
        final String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String token = authHeader.substring(7);
            String email = jwtService.extractEmail(token);
            if (jwtService.validateToken(token, email)){

                // create Spring Security Authentication object
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken( new User(email, "", Collections.emptyList()), null, Collections.emptyList());

                // attach info about current request to the auth object
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                
                // pass authorization onto the request (allows controller to work)
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }

        } catch (Exception e) {

        }

        filterChain.doFilter(request, response); // passes request on to the controller

    }
}
