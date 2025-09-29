package notepad.repository;

import notepad.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import notepad.model.User;

public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByUser(User user);  // custom search func
}
