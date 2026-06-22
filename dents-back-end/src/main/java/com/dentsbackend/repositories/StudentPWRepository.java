package com.dentsbackend.repositories;

import com.dentsbackend.entities.StudentPW;
import com.dentsbackend.entities.StudentPWPK;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentPWRepository extends JpaRepository<StudentPW, StudentPWPK> {
}
