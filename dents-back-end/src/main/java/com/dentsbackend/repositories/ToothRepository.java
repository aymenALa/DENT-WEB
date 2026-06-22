package com.dentsbackend.repositories;

import com.dentsbackend.entities.Tooth;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ToothRepository extends JpaRepository<Tooth,Long> {
}
