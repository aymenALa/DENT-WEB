package com.dentsbackend.controllers;


import com.dentsbackend.entities.StudentPW;
import com.dentsbackend.entities.StudentPWPK;
import com.dentsbackend.services.StudentPWService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/studentpws")
@CrossOrigin(origins = "*")
public class StudentPWContoller {
    @Autowired
    StudentPWService studentPWService;

    @PostMapping("/add/{studentId}/{pwId}")
    public ResponseEntity<Object> create(@PathVariable long studentId, @PathVariable long pwId,
                                         @RequestBody StudentPW studentPW){
        StudentPWPK studentPWPK = new StudentPWPK(studentId,pwId);
        if (studentPWService.findById(studentPWPK) != null) {
            return new ResponseEntity<>(Map.of("message", "This practical work was already submitted"),
                    HttpStatus.CONFLICT);
        }
        studentPW.setId(studentPWPK);
        return ResponseEntity.ok(studentPWService.create(studentPW));
    }


    @GetMapping("/all")
    public List<StudentPW> getAll(){
        return studentPWService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getById(@PathVariable long id){
        StudentPW studentPW = studentPWService.findById(id);
        if(studentPW == null)
            return new ResponseEntity<>(Map.of("message","studentPW does not exist"), HttpStatus.NOT_FOUND);
        else
            return ResponseEntity.ok(studentPW);
    }

//    @PutMapping("/update/{id}")
//    public ResponseEntity<Object> update(@PathVariable long id, @RequestBody StudentPW studentPW){
//        StudentPW studentPW1 = studentPWService.findById(id);
//        if (studentPW1 == null)
//            return new ResponseEntity<>(Map.of("message","studentPW does not exist"), HttpStatus.NOT_FOUND);
//        else{
//            studentPW.setId(id);
//            studentPWService.update(studentPW);
//            return ResponseEntity.ok(Map.of("message","studentPW updated successfully"));
//        }
//    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Object> delete(@PathVariable long id){
        StudentPW studentPW = studentPWService.findById(id);
        if (studentPW == null)
            return new ResponseEntity<>(Map.of("message","studentPW does not exist"), HttpStatus.NOT_FOUND);
        else{
            studentPWService.delete(studentPW);
            return ResponseEntity.ok(Map.of("message","studentPW deleted successfully"));
        }
    }
}
