package com.dentsbackend.repositories;

import com.dentsbackend.entities.Groupe;
import com.dentsbackend.entities.PW;
import com.dentsbackend.entities.Professor;
import com.dentsbackend.entities.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupRepository extends JpaRepository<Groupe,Long> {
    List<Groupe> findGroupesByProfessor(Professor professor);
    List<Groupe> findGroupesByStudent(Student student);
    List<Groupe> findGroupesByPws(PW pw);
}
