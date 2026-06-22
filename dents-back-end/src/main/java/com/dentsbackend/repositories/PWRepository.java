package com.dentsbackend.repositories;

import com.dentsbackend.entities.PW;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PWRepository extends JpaRepository<PW,Long> {
}
