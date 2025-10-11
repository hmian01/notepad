package notepad.controller;

import notepad.JwtService;
import notepad.dto.AuthResponseDTO;
import notepad.dto.NoteDTO;
import notepad.dto.UserDTO;
import notepad.model.User;
import notepad.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.authentication.configurers.userdetails.DaoAuthenticationConfigurer;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Date;

@RestController
@RequestMapping("/api/users") // prefix
public class UserController {

    private final UserRepository repo;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final JwtService jwtService;

    public UserController(UserRepository repo, JwtService jwtService) {
        this.repo = repo;
        this.jwtService = jwtService;
    }

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName(); // returns the email from jwt
        return repo.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
    }

    private void ensureAdmin() {
        User user = getAuthenticatedUser();
        if (!user.getUserType().equals("admin"))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admin may perform this action"); 
    }

    // ADMIN: get user list
    @GetMapping("/all")
    public List<UserDTO> allUsers() {
        ensureAdmin();
        return repo.findAll().stream().map(UserDTO::new).toList();
    }

    // ADMIN: get specific user
    @GetMapping("/{id}")
    public UserDTO oneUser(@PathVariable Long id) {
        ensureAdmin();
        User user = repo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return new UserDTO(user);
    }

    // ADMIN: delete specific user
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        ensureAdmin();
        User user = repo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        repo.delete(user);
    }

    // USER: create new account
    @PostMapping("/signup")
    public UserDTO newUser(@RequestBody User user) {

        if (repo.findByEmail(user.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        User newUser = repo.save(user);

        return new UserDTO(newUser);
    }

    // USER: signin to account
    @PostMapping("/signin")
    public AuthResponseDTO signin(@RequestBody User loginRequest) {

        // spring boot automatically knows to find user using email, do not need to create this function
        User user = repo.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // hashed password check, more secure than plain text check
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }
        
        return new AuthResponseDTO(user, jwtService); // returns jwt token, expiry, email, name, userType
    }
}
