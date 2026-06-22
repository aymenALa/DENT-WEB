package com.dentsbackend.controllers;

import com.dentsbackend.entities.PW;
import com.dentsbackend.services.PWService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pws")
@CrossOrigin(origins = "*")
public class PWController {

    @Autowired
    PWService pwService;

    @PostMapping("/add")
    public ResponseEntity<Object> create(@RequestBody PW pw){
        pwService.create(pw);
        return ResponseEntity.ok(Map.of("message","pw created successfully"));
    }

    @GetMapping("/all")
    public List<PW> getAll(){
        return pwService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getById(@PathVariable long id){
        PW pw = pwService.findById(id);
        if(pw == null)
            return new ResponseEntity<>(Map.of("message","pw does not exist"), HttpStatus.NOT_FOUND);
        else
            return ResponseEntity.ok(pw);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Object> update(@PathVariable long id, @RequestBody PW pw){
        PW pw1 = pwService.findById(id);
        if (pw1 == null)
            return new ResponseEntity<>(Map.of("message","pw does not exist"), HttpStatus.NOT_FOUND);
        else{
            pw.setId(id);
            if(pw.getDocs() == null)
                pw.setDocs(pw1.getDocs());
            pwService.update(pw);
            return ResponseEntity.ok(Map.of("message","pw updated successfully"));
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Object> delete(@PathVariable long id){
        PW pw = pwService.findById(id);
        if (pw == null)
            return new ResponseEntity<>(Map.of("message","pw does not exist"), HttpStatus.NOT_FOUND);
        else{
            pwService.delete(pw);
            return ResponseEntity.ok(Map.of("message","pw deleted successfully"));
        }
    }
}
