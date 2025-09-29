package notepad.controller;

import notepad.dto.UserDTO;
import notepad.model.User;
import notepad.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/users") // prefix
public class UserController {

    private final UserRepository repo;

    public UserController(UserRepository repo) {
        this.repo = repo;
    }

    // GET /api/users --> will add security to this function
    @GetMapping
    public List<User> allUsers() {
        return repo.findAll();
    }

    // GET /api/users/{id} --> will add security to this function
    @GetMapping("/{id}")
    public User oneUser(@PathVariable Long id) {
        return repo.findById(id).orElseThrow();
    }

    // DELETE /api/users/{id} --> will add security to this function
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        repo.deleteById(id);
    }

        // POST /api/users
    @PostMapping("/signup")
    public User newUser(@RequestBody User user) {
        return repo.save(user);
    }


    // POST /api/users/signin
    @PostMapping("/signin")
    public UserDTO signin(@RequestBody User loginRequest) {

        // spring boot automatically knows to find user using email, do not need to create this function
        User user = repo.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // plain text password check, will not go into production like this
        if (!user.getPassword().equals(loginRequest.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        return new UserDTO(user.getName(), user.getEmail());
    }
}
