package notepad.controller;

import notepad.dto.NoteDTO;
import notepad.model.Note;
import notepad.model.User;
import notepad.repository.NoteRepository;
import notepad.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notes") // prefix
public class NoteController {

    private final NoteRepository noteRepo;
    private final UserRepository userRepo;

    public NoteController(NoteRepository noteRepo, UserRepository userRepo) {
        this.noteRepo = noteRepo;
        this.userRepo = userRepo;
    }

    // GET /api/notes --> will add security to this function
    @GetMapping
    public List<NoteDTO> allNotes() {
        return noteRepo.findAll().stream().map(NoteDTO::new).toList();
    }

    // GET /api/notes/{id} --> will add security to this function
    @GetMapping("/{id}")
    public NoteDTO oneNote(@PathVariable Long id) {
        return noteRepo.findById(id).map(NoteDTO::new).orElseThrow();
    }

    // DELETE /api/notes/{id} --> will add security to this function
    @DeleteMapping("/{id}")
    public void deleteNote(@PathVariable Long id) {
        noteRepo.deleteById(id);
    }

    // GET /api/notes/user/{userId} --> all private/public notes of the specified user --> will add security to this function
    @GetMapping("/user/{userId}")
    public List<NoteDTO> getNotesForUser(@PathVariable Long userId) {
        User user = userRepo.findById(userId).orElseThrow();
        return noteRepo.findByUserOrderByIdAsc(user).stream().map(NoteDTO::new).toList(); // TODO: change this to sort based on most recently updated first
    }

    // POST /api/notes/user/{userId} --> add a note for a user --> will add security to this function
    @PostMapping
    public NoteDTO addNote(@RequestParam Long userId, @RequestBody Note note) {
        User user = userRepo.findById(userId).orElseThrow();
        note.setUser(user);
        Note saved = noteRepo.save(note);
        return new NoteDTO(saved);
    }

    @PatchMapping("{id}")
    public NoteDTO editNote(@PathVariable Long id, @RequestBody Map<String, Object> updates) {

        Note previous = noteRepo.findById(id).orElseThrow();

        if (updates.containsKey("title"))
            previous.setTitle((String) updates.get("title"));
        if (updates.containsKey("content"))
            previous.setContent((String) updates.get("content"));
        if (updates.containsKey("isPrivate"))
            previous.setIsPrivate((Boolean) updates.get("isPrivate"));

        Note saved = noteRepo.save(previous);

        return new NoteDTO(saved);
    }

}
