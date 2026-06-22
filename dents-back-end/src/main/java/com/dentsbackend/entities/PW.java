package com.dentsbackend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PW {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String title;
    private String objectif;
    @Lob
    @Column(name = "docs", columnDefinition = "LONGBLOB")
    private byte[] docs;
    @ManyToOne
    private Tooth tooth;

}
