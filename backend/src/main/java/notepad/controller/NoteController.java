package notepad.controller;

import notepad.dto.NoteDTO;
import notepad.model.Note;
import notepad.model.User;
import notepad.repository.NoteRepository;
import notepad.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/notes") // prefix
public class NoteController {

    private final NoteRepository noteRepo;
    private final UserRepository userRepo;

    public NoteController(NoteRepository noteRepo, UserRepository userRepo) {
        this.noteRepo = noteRepo;
        this.userRepo = userRepo;
    }

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName(); // returns the email from jwt
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
    }

    private void ensureAdmin() {
        User user = getAuthenticatedUser();
        if (!user.getUserType().equals("admin"))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admin may perform this action"); 
    }

    // ADMIN: get all notes across every user (for testing only)
    @GetMapping("/all")
    public List<NoteDTO> allNotes() {
        ensureAdmin();
        return noteRepo.findAll().stream().map(NoteDTO::new).toList();
    }

    // USER: get specific note
    @GetMapping("/{id}")
    public NoteDTO oneNote(@PathVariable Long id) {
        
        User user = getAuthenticatedUser();
        Note note = noteRepo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Note not found"));

        if (!note.getUser().getEmail().equals(user.getEmail())) 
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not have access to this note"); 

        return new NoteDTO(note);
    }

    // USER: delete specific note
    @DeleteMapping("/{id}")
    public void deleteNote(@PathVariable Long id) {

        User user = getAuthenticatedUser();
        Note note = noteRepo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Note not found"));

        if (!note.getUser().getEmail().equals(user.getEmail())) 
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not have access to this note"); 

        noteRepo.delete(note);
    }

    // USER: get all user notes (dashboard)
    @GetMapping
    public List<NoteDTO> getNotesForUser() {
        User user = getAuthenticatedUser();

        return noteRepo.findByUserOrderByIdAsc(user).stream().map(NoteDTO::new).toList(); // TODO: change this to sort based on most recently updated first
    }

    // USER: create new note
    @PostMapping
    public NoteDTO addNote(@RequestBody Note note) {
        User user = getAuthenticatedUser();
        note.setUser(user);

        String publicId;
        do {
            publicId = UUID.randomUUID().toString().substring(0, 8);
        } while (noteRepo.existsByPublicId(publicId));
        note.setPublicId(publicId);

        Note saved = noteRepo.save(note);
        return new NoteDTO(saved);
    }

    // USER: edit note
    @PatchMapping("{id}")
    public NoteDTO editNote(@PathVariable Long id, @RequestBody Map<String, Object> updates) {

        User user = getAuthenticatedUser();
        Note note = noteRepo.findById(id).orElseThrow();

        if (!note.getUser().getEmail().equals(user.getEmail())) 
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not have access to this note"); 

        if (updates.containsKey("title"))
            note.setTitle((String) updates.get("title"));
        if (updates.containsKey("content"))
            note.setContent((String) updates.get("content"));
        if (updates.containsKey("isPrivate")) {
            note.setIsPrivate((Boolean) updates.get("isPrivate")); // TODO: consider adding logic to cycle publicId if isPrivate settings changes
        }
            
        noteRepo.save(note);

        return new NoteDTO(note);
    }

    // USER: access public note
    @GetMapping("/public/{publicId}")
    public NoteDTO getPublicNote(@PathVariable String publicId) {

        Note note = noteRepo.findByPublicId(publicId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Note not found"));
        if (note.getIsPrivate())
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Note is not public");

        return new NoteDTO(note);
    }
}
