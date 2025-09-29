package notepad.repository;

import notepad.model.User;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;


public interface UserRepository extends JpaRepository<User, Long> {

    // Exposes JpaRepository to be used by controller - ex) save, findById, findAll, deleteById, etc.

    Optional<User> findByEmail(String email);
}
