package notepad.dto;

import notepad.model.User;

public class UserDTO {
    private String name;
    private String email;
    private Long id;
    private String userType;

    public UserDTO(User user) {
        this.name = user.getName();
        this.email = user.getEmail();
        this.id = user.getId();
        this.userType = user.getUserType();
    }

    public String getName() { return name; }
    public String getEmail() { return email; }
    public Long getId() { return id; }
    public String getUserType() { return userType; }
}