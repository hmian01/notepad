package notepad.dto;

import java.util.Date;

public class JwtResponseDTO {

    private String jwtToken;
    private Date expiration;

    public JwtResponseDTO(String jwtToken, Date expiration) {
        this.jwtToken = jwtToken;
        this.expiration = expiration;
    }

    public String getToken() {
        return jwtToken;
    }

    public Date getExpiresAt() {
        return expiration;
    }
}
