package notepad.controller;

import notepad.JwtService;
import notepad.dto.JwtResponseDTO;
import notepad.dto.UserDTO;
import notepad.model.User;
import notepad.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.authentication.configurers.userdetails.DaoAuthenticationConfigurer;
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

    // GET /api/users --> will add security to this function
    @GetMapping
    public List<User> allUsers() {

        // TODO: return the UserDTO instead of unsecure User object
        return repo.findAll();
    }

    // GET /api/users/{id} --> will add security to this function
    @GetMapping("/{id}")
    public User oneUser(@PathVariable Long id) {

        User user = repo.findById(id).orElseThrow();

        // TODO: return the UserDTO instead of unsecure User object
        return user;
    }

    // DELETE /api/users/{id} --> will add security to this function
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        repo.deleteById(id);
        // TODO: return error if user does not exist
    }

    // POST /api/users
    @PostMapping("/signup")
    public UserDTO newUser(@RequestBody User user) {

        if (repo.findByEmail(user.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        User newUser = repo.save(user);

        return new UserDTO(newUser.getName(), newUser.getEmail(), newUser.getId());
    }

    // POST /api/users/signin
    @PostMapping("/signin")
    public JwtResponseDTO signin(@RequestBody User loginRequest) {

        // spring boot automatically knows to find user using email, do not need to create this function
        User user = repo.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // hashed password check, more secure than plain text check
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        String jwtToken = jwtService.createToken(user.getEmail());
        Date expiration = jwtService.extractExpiration(jwtToken);

        return new JwtResponseDTO(jwtToken, expiration);
    }
}
