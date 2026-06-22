package com.dentsbackend.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentPW {
    @EmbeddedId
    private StudentPWPK id;
    private String time;

    @Lob
    @Column(name = "imageFront", columnDefinition = "LONGBLOB")
    private byte[] imageFront;
    private float af1;
    private float af2;
    private float bf1;
    private float bf2;
    private float cf1;
    private float cf2;
    private float noteFront;
    @Lob
    @Column(name = "imageSide", columnDefinition = "LONGBLOB")
    private byte[] imageSide;
    private float as1;
    private float as2;
    private float bs1;
    private float bs2;
    private float cs1;
    private float cs2;
    private float noteSide;
    @Temporal(TemporalType.DATE)
    private Date date;

    @ManyToOne
    @JoinColumn(name="student_id",referencedColumnName="id",insertable = false,updatable = false)
    @JsonIgnoreProperties("studentPWS")
    private Student student;

    @ManyToOne
    @JoinColumn(name="pw_id",referencedColumnName="id",insertable = false,updatable = false)
    private PW pw;

    public StudentPW(StudentPWPK studentPWPK) {
        this.id = studentPWPK;
    }
}
