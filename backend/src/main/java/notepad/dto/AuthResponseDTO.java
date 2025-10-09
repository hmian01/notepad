package notepad.dto;

import java.util.Date;

import notepad.JwtService;
import notepad.model.User;

public class AuthResponseDTO {

    private String jwtToken;
    private Date expiration;
    private String email;
    private String name;
    private Long userId;

    public AuthResponseDTO(User user, JwtService jwtService ) {
        this.jwtToken = jwtService.createToken(user.getEmail());
        this.expiration = jwtService.extractExpiration(this.jwtToken);
        this.email = user.getEmail();
        this.name = user.getName();
        this.userId = user.getId();
    }

    public String getToken() {
        return jwtToken;
    }

    public Date getExpiresAt() {
        return expiration;
    }

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }

    public Long getUserId() {
        return userId;
    }
}
