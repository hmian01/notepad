package notepad.repository;

import notepad.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import notepad.model.User;
import java.util.Optional;


public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByUser(User user);  // custom search func

    List<Note> findByUserOrderByIdAsc(User user); // does SQL that finds user's notes and then order's by Id in ascending order 

    Optional<Note> findByPublicId(String publicId);
    boolean existsByPublicId(String publicId);
}
