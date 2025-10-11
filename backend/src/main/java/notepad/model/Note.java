package notepad.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;

@Entity
public class Note {

    @Id // primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // link to User
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false) // foreign key
    private User user;

    @Column(columnDefinition = "TEXT")
    private String title;
    private String content;

    private Boolean isPrivate = true; // defaults to private

    @Column(unique = true)
    private String publicId;    

    // getters and setters
    public Long getId(){return id;}

    public String getTitle(){return title;}
    public void setTitle(String title){this.title = title;}

    public String getContent(){return content;}
    public void setContent(String content){this.content = content;}

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Boolean getIsPrivate() { return isPrivate; }
    public void setIsPrivate(Boolean isPrivate) {this.isPrivate = isPrivate;}

    public String getPublicId(){return publicId;}
    public void setPublicId(String publicId) {this.publicId = publicId;}

}
