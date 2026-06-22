package com.dentsbackend.services;

import com.dentsbackend.dao.IDao;
import com.dentsbackend.entities.StudentPW;
import com.dentsbackend.entities.StudentPWPK;
import com.dentsbackend.repositories.StudentPWRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentPWService implements IDao<StudentPW> {
    @Autowired
    StudentPWRepository studentPWRepository;
    @Override
    public StudentPW create(StudentPW o) {
        return studentPWRepository.save(o);
    }

    @Override
    public StudentPW update(StudentPW o) {
        return studentPWRepository.save(o);
    }

    @Override
    public StudentPW findById(long id) {
        return null;
    }

    public StudentPW findById(StudentPWPK id) {
        return studentPWRepository.findById(id).orElse(null);
    }

    @Override
    public List<StudentPW> findAll() {
        return studentPWRepository.findAll();
    }

    @Override
    public boolean delete(StudentPW o) {
        try{
            studentPWRepository.delete(o);
            return true;
        }catch (Exception e){
            return false;
        }
    }
}
