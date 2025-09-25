package notepad.controller;

import notepad.model.User;
import notepad.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users") // prefix
public class UserController {

    private final UserRepository repo;

    public UserController(UserRepository repo) {
        this.repo = repo;
    }

    // GET /api/users
    @GetMapping
    public List<User> allUsers() {
        return repo.findAll();
    }

    // GET /api/users/{id}
    @GetMapping("/{id}")
    public User oneUser(@PathVariable Long id) {
        return repo.findById(id).orElseThrow();
    }

    // POST /api/users
    @PostMapping("/signup")
    public User newUser(@RequestBody User user) {
        return repo.save(user);
    }

    // DELETE /api/users/{id}
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        repo.deleteById(id);
    }
}
