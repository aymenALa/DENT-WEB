package com.dentsbackend.services;

import com.dentsbackend.dao.IDao;
import com.dentsbackend.entities.*;
import com.dentsbackend.entities.Groupe;
import com.dentsbackend.repositories.GroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GroupService implements IDao<Groupe> {
    @Autowired
    GroupRepository groupeRepository;

    @Override
    public Groupe create(Groupe o) {
        return groupeRepository.save(o);
    }

    @Override
    public Groupe update(Groupe o) {
        return groupeRepository.save(o);
    }

    @Override
    public Groupe findById(long id) {
        return groupeRepository.findById(id).orElse(null);
    }

    @Override
    public List<Groupe> findAll() {
        return groupeRepository.findAll();
    }

    @Override
    public boolean delete(Groupe o) {
        try{
            groupeRepository.delete(o);
            groupeRepository.flush();
            return true;
        }catch (Exception e){
            return false;
        }
    }

    public List<Groupe> findByProfessor(Professor professor){
        return groupeRepository.findGroupesByProfessor(professor);
    }
    public List<Groupe> findByStudent(Student student){
        return groupeRepository.findGroupesByStudent(student);
    }
    public List<Groupe> findByPW(PW pw){
        return groupeRepository.findGroupesByPws(pw);
    }
}
