package com.dentsbackend.dao;

import java.util.List;

public interface IDao <T>{
    T create(T o);
    T update(T o);
    T findById(long id);
    List<T> findAll();
    boolean delete(T p);
}
