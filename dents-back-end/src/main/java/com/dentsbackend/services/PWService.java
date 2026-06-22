package com.dentsbackend.services;

import com.dentsbackend.dao.IDao;
import com.dentsbackend.entities.PW;
import com.dentsbackend.entities.PW;
import com.dentsbackend.repositories.PWRepository;
import org.hibernate.annotations.SecondaryRow;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PWService implements IDao<PW> {
    @Autowired
    PWRepository pwRepository;
    @Override
    public PW create(PW o) {
        return pwRepository.save(o);
    }

    @Override
    public PW update(PW o) {
        return pwRepository.save(o);
    }

    @Override
    public PW findById(long id) {
        return pwRepository.findById(id).orElse(null);
    }

    @Override
    public List<PW> findAll() {
        return pwRepository.findAll();
    }

    @Override
    public boolean delete(PW o) {
        try{
            pwRepository.delete(o);
            return true;
        }catch (Exception e){
            return false;
        }
    }
}
