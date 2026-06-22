package com.dentsbackend.controllers;

import com.dentsbackend.entities.Tooth;
import com.dentsbackend.services.ToothService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/teeth")
@CrossOrigin(origins = "*")
public class ToothController {
    @Autowired
    ToothService toothService;

    @PostMapping("/add")
    public ResponseEntity<Object> create(@RequestBody Tooth tooth){
        toothService.create(tooth);
        return ResponseEntity.ok(Map.of("message","tooth created successfully"));
    }

    @GetMapping("/all")
    public List<Tooth> getAll(){
        return toothService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getById(@PathVariable long id){
        Tooth tooth = toothService.findById(id);
        if(tooth == null)
            return new ResponseEntity<>(Map.of("message","tooth does not exist"), HttpStatus.NOT_FOUND);
        else
            return ResponseEntity.ok(tooth);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Object> update(@PathVariable long id, @RequestBody Tooth tooth){
        Tooth tooth1 = toothService.findById(id);
        if (tooth1 == null)
            return new ResponseEntity<>(Map.of("message","tooth does not exist"), HttpStatus.NOT_FOUND);
        else{
            tooth.setId(id);
            toothService.update(tooth);
            return ResponseEntity.ok(Map.of("message","tooth updated successfully"));
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Object> delete(@PathVariable long id){
        Tooth tooth = toothService.findById(id);
        if (tooth == null)
            return new ResponseEntity<>(Map.of("message","tooth does not exist"), HttpStatus.NOT_FOUND);
        else{
            toothService.delete(tooth);
            return ResponseEntity.ok(Map.of("message","tooth deleted successfully"));
        }
    }
}
