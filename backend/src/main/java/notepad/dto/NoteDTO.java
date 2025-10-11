package notepad.dto;

import notepad.model.Note;

public class NoteDTO {

    private Long id;
    private String title;
    private String content;
    private Boolean isPrivate;
    private String userName;
    private String publicId;    


    public NoteDTO(Note note) {
        this.id = note.getId();
        this.title = note.getTitle();
        this.content = note.getContent();
        this.isPrivate = note.getIsPrivate();
        this.userName = note.getUser().getName();
        this.publicId = note.getPublicId();
    }

    public Long getId(){return id;}
    public void setId(Long id){this.id = id;}

    public String getTitle(){return title;}
    public void setTitle(String title){this.title = title;}

    public String getContent(){return content;}
    public void setContent(String content){this.content = content;}

    public Boolean getIsPrivate() { return isPrivate; }
    public void getIsPrivate(Boolean isPrivate) {this.isPrivate = isPrivate;}

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getPublicId() { return publicId; }
    public void setPublicId(String publicId) { this.publicId = publicId; }
}