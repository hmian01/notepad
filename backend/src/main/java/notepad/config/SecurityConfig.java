package notepad.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import notepad.JwtAuthFilter;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;


@Configuration
public class SecurityConfig {


    private final JwtAuthFilter jwtAuthFilter;
    
    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // disable CSRF for REST APIs
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/users/signup", "/api/users/signin").permitAll() // allow signup/signin
                .requestMatchers("/error").permitAll()
                .anyRequest().authenticated() // any other request requires JWT authentication
            )
            .httpBasic(httpBasic -> httpBasic.disable()) // disable default Basic Auth popup
            .formLogin(form -> form.disable()) // disable Spring’s login form
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class); // activates out jwt filter, all requests that require authentication pass through it

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
