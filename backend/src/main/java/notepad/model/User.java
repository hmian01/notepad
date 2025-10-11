package notepad.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

// creates table in the DB
@Entity
@Table(name = "users") // can't be named user, can be a reserved keyword in some DBMS
public class User {

    @Id // primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userType = "user";

    private String name;

    @Column(unique = true)
    private String email;
    private String password;

    // getters and setters
    public Long getId(){return id;}
    public String getUserType(){return userType;}

    public String getName(){return name;}
    public void setName(String name){this.name = name;}

    public String getEmail(){return email;}
    public void setEmail(String email){this.email = email;}

    public String getPassword(){return password;}
    public void setPassword(String password){this.password = password;}
}
