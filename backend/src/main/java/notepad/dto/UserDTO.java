package notepad.dto;

public class UserDTO {
    private String name;
    private String email;

    // constructor
    public UserDTO(String name, String email) {
        this.name = name;
        this.email = email;
    }

    // getters (no setters needed if it's read-only response)
    public String getName() { return name; }
    public String getEmail() { return email; }
}