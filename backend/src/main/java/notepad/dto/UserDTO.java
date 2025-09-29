package notepad.dto;

public class UserDTO {
    private String name;
    private String email;
    private Long id;

    public UserDTO(String name, String email, Long id) {
        this.name = name;
        this.email = email;
        this.id = id;
    }

    public String getName() { return name; }
    public String getEmail() { return email; }
    public Long getId() { return id; }
}