package com.dentsbackend.services;


import com.dentsbackend.dao.IDao;
import com.dentsbackend.entities.Professor;
import com.dentsbackend.entities.Student;
import com.dentsbackend.entities.User;
import com.dentsbackend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService implements IDao<User> {

    @Autowired
    UserRepository userR;

    @Override
    public List<User> findAll() {
        return userR.findAll();
    }

    @Override
    public User findById(long id) {
        return userR.findById(id).orElse(null);
    }

    @Override
    public User create(User o) {
        return userR.save(o);
    }

    @Override
    public User update(User o) {
        return userR.save(o);
    }

    @Override
    public boolean delete(User o) {
        try {
            userR.delete(o);
            userR.flush();
            return true;
        }catch (Exception e) {
            return false;
        }
    }

    public User findByEmail(String email){
        return userR.findUserByEmail(email);
    }

    public List<Professor> findAllProfessors(){
        return userR.findAllProfessors();
    }
    public List<Student> findAllStudents(){
        return userR.findAllStudents();
    }
}
