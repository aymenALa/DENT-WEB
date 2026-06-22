package com.dentsbackend.controllers;



import com.dentsbackend.entities.*;
import com.dentsbackend.repositories.UserRepository;
import com.dentsbackend.services.StudentPWService;
import com.dentsbackend.services.UserService;
import com.dentsbackend.utils.EmailSender;
import com.dentsbackend.utils.JwtTokenUtil;
import com.dentsbackend.utils.ResetPassword;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {
    @Autowired
    UserService utilS;
    @Autowired
    EmailSender emailSender;

    @Autowired
    UserRepository userRepository;
    @Autowired
    UserService userService;
    @Autowired
    StudentPWService studentPWService;

    @GetMapping("/all")
    public List<User> getAll(){
        return utilS.findAll();
    }

    @PostMapping("/register/admin")
    public ResponseEntity<Object> registerAdmin(@RequestBody Admin user) {
        return registerUser(user, true);
    }

    @PostMapping("/register/professor")
    public ResponseEntity<?> registerProf(@RequestBody Professor user) {

        if (utilS.findByEmail(user.getEmail()) != null) {
            return new ResponseEntity<>(Map.of("message", "User already exist"), HttpStatus.BAD_REQUEST);
        } else {
            String hashPWD = BCrypt.hashpw(user.getPassword(), BCrypt.gensalt());
            user.setPassword(hashPWD);
            user.setActivate(false);
            utilS.create(user);
            return new ResponseEntity<>(Map.of("message", "Your account has been created successfully. You will receive an email when the admin activates your account"), HttpStatus.OK);
        }
    }

    @PostMapping("/register/student")
    public ResponseEntity<Object> registerStudent(@RequestBody Student user) {
        return registerUser(user, true);
    }

    private ResponseEntity<Object> registerUser(User user, boolean activate) {
        if (utilS.findByEmail(user.getEmail()) != null) {
            return new ResponseEntity<>(Map.of("message", "User already exist"), HttpStatus.BAD_REQUEST);
        } else {
            String hashPWD = BCrypt.hashpw(user.getPassword(), BCrypt.gensalt());
            user.setPassword(hashPWD);
            user.setActivate(activate);
            return ResponseEntity.ok(utilS.create(user));
        }
    }


    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody User loginuser){
        User user = utilS.findByEmail(loginuser.getEmail());
        if (user == null)
            return new ResponseEntity<>(Map.of("message","invalid email or password"),HttpStatus.NOT_FOUND);

        else {
            boolean isRegister = BCrypt.checkpw(loginuser.getPassword(), user.getPassword());
            if(! isRegister)
                return new ResponseEntity<>(Map.of("message","invalid email or password"),HttpStatus.NOT_FOUND);
            else if(!user.isActivate())
                return new ResponseEntity<>(Map.of("message","Your account is not activated"),HttpStatus.NOT_FOUND);
            else{
                String role ;
                if(user instanceof Professor)
                    role = "professor";
                else if (user instanceof Student)
                    role = "student";
                else
                    role = "admin";
                String token = JwtTokenUtil.generateToken(user.getId()+user.getUserName());
                Map<String, Object> response = Map.of(
                        "message", "Authentication successful",
                        "role",role,
                        "token", token,
                        "email", user.getEmail(),
                        "id",user.getId()
                );
                return ResponseEntity.ok(response);
            }
        }
    }

    @DeleteMapping("/delete/student/{profId}/{studentId}")
    public ResponseEntity<Object> delete(
            @RequestHeader(value = "Authorization", required = false) String token,
            @PathVariable long profId,
            @PathVariable long studentId) {
        User requester = utilS.findById(profId);
        User target = utilS.findById(studentId);
        if (!(requester instanceof Professor professor))
            return new ResponseEntity<>(Map.of("message","Professor does not exist"), HttpStatus.NOT_FOUND);
        if (!(target instanceof Student student))
            return new ResponseEntity<>(Map.of("message","Student does not exist"), HttpStatus.NOT_FOUND);
        if(token == null || !token.startsWith("Bearer ") ||
                !JwtTokenUtil.validateToken(token.substring(7), requester.getId() + requester.getUserName()))
            return new ResponseEntity<>(Map.of("message","Invalid or missing authentication token"),HttpStatus.UNAUTHORIZED);
        if (student.getGroup() == null || student.getGroup().getProfessor() == null ||
                student.getGroup().getProfessor().getId() != professor.getId()) {
            return new ResponseEntity<>(Map.of("message", "This student is not assigned to your groups"),
                    HttpStatus.FORBIDDEN);
        }
        if (!utilS.delete(student)) {
            return new ResponseEntity<>(Map.of("message", "The student could not be deleted"),
                    HttpStatus.CONFLICT);
        }
        return ResponseEntity.ok(Map.of("message", "Student deleted successfully"));
    }

    @DeleteMapping("/delete/professor/{adminId}/{professorId}")
    public ResponseEntity<Object> deleteProfessor(
            @RequestHeader(value = "Authorization", required = false) String token,
            @PathVariable long adminId,
            @PathVariable long professorId) {
        User requester = utilS.findById(adminId);
        User target = utilS.findById(professorId);

        if (!(requester instanceof Admin)) {
            return new ResponseEntity<>(Map.of("message", "Only an administrator can delete professors"),
                    HttpStatus.FORBIDDEN);
        }
        if (token == null || !token.startsWith("Bearer ") ||
                !JwtTokenUtil.validateToken(token.substring(7), requester.getId() + requester.getUserName())) {
            return new ResponseEntity<>(Map.of("message", "Invalid or missing authentication token"),
                    HttpStatus.UNAUTHORIZED);
        }
        if (!(target instanceof Professor)) {
            return new ResponseEntity<>(Map.of("message", "Professor does not exist"), HttpStatus.NOT_FOUND);
        }
        if (!utilS.delete(target)) {
            return new ResponseEntity<>(Map.of("message",
                    "Professor cannot be deleted while linked to one or more groups"), HttpStatus.CONFLICT);
        }
        return ResponseEntity.ok(Map.of("message", "Professor deleted successfully"));
    }

    @PostMapping("/activate/{id}")
    public ResponseEntity<Object> activateCompte(@PathVariable long id){
        User user = utilS.findById(id);
        if(user == null)
            return new ResponseEntity<>(Map.of("message","user does not exist"), HttpStatus.NOT_FOUND);
        else {
            if(user.isActivate()) {
                user.setActivate(false);
                utilS.update(user);
                return new ResponseEntity<>(Map.of("message", "User disactivated successfully "), HttpStatus.OK);
            }
            else{
                user.setActivate(true);
                utilS.update(user);
                emailSender.sendEmail(user.getEmail(),"Account activation","Your account is activated");
                return new ResponseEntity<>(Map.of("message", "user activated successfully "), HttpStatus.OK);
            }
        }
    }

    @PostMapping("/codeactivation")
    public ResponseEntity<Object> sendCodeActivation(@RequestBody  Map<String, String> requestBody){
        String email = requestBody.get("email");
        if (email == null || email.isBlank()) {
            return new ResponseEntity<>(Map.of("message","Email should not be empty"), HttpStatus.BAD_REQUEST);
        }
        User user = utilS.findByEmail(email);
        if(user == null)
            return new ResponseEntity<>(Map.of("message","User does not exist"), HttpStatus.NOT_FOUND);
        else{
            String codeActivation = ResetPassword.generateRandomCode();
            String codeActivationhash = BCrypt.hashpw(codeActivation,BCrypt.gensalt());
            user.setCodeActivation(codeActivationhash);
            user.setCodeActivationDate(LocalDateTime.now());
            utilS.update(user);
            emailSender.sendEmail(user.getEmail(),"Password Reset","you can activate your account by this code : \n"+codeActivation);
            return new ResponseEntity<>(Map.of("message", "Activation code has been sent "), HttpStatus.OK);
        }
    }
    @PostMapping("/verifiercode")
    public ResponseEntity<Object> VerificationCode(@RequestBody Map<String,String> requestBody){
        String email = requestBody.get("email");
        String code = requestBody.get("code");
        User user = utilS.findByEmail(email);
        if(user == null)
            return new ResponseEntity<>(Map.of("message","User does not exist"), HttpStatus.NOT_FOUND);
        else {
            if (code == null || code.isBlank())
                return new ResponseEntity<>(Map.of("message", "Activation code is empty"), HttpStatus.BAD_REQUEST);
            else if (user.getCodeActivation() == null || user.getCodeActivationDate() == null)
                return new ResponseEntity<>(Map.of("message", "No password reset was requested"), HttpStatus.BAD_REQUEST);
            else {
                if (!BCrypt.checkpw(code, user.getCodeActivation()))
                    return new ResponseEntity<>(Map.of("message", "Invalid activation code"), HttpStatus.NOT_FOUND);
                else if (!ResetPassword.isResetCodeValid(user))
                    return new ResponseEntity<>(Map.of("message", "Activation code has expired"), HttpStatus.NOT_FOUND);

                else {

                    return new ResponseEntity<>(Map.of("message", "Activation code is valid "), HttpStatus.OK);
                }
            }
        }
    }
    @PostMapping("/resetpwd")
    public ResponseEntity<Object> resetPassword(@RequestBody Map<String, String> requestBody) {
        String email = requestBody.get("email");
        String code = requestBody.get("code");
        String newPassword = requestBody.get("password");
        User user = utilS.findByEmail(email);
        if (user == null)
            return new ResponseEntity<>(Map.of("message", "User does not exist"), HttpStatus.NOT_FOUND);
        else {
            if (code == null || code.isBlank())
                return new ResponseEntity<>(Map.of("message", "Activation code is empty"), HttpStatus.BAD_REQUEST);
            else if (newPassword == null || newPassword.isBlank())
                return new ResponseEntity<>(Map.of("message", "Password is empty"), HttpStatus.BAD_REQUEST);
            else if (user.getCodeActivation() == null || user.getCodeActivationDate() == null)
                return new ResponseEntity<>(Map.of("message", "No password reset was requested"), HttpStatus.BAD_REQUEST);
            else {
                if (!BCrypt.checkpw(code, user.getCodeActivation()))
                    return new ResponseEntity<>(Map.of("message", "Invalid activation code"), HttpStatus.NOT_FOUND);
                else if (!ResetPassword.isResetCodeValid(user))
                    return new ResponseEntity<>(Map.of("message", "Activation code has expired"), HttpStatus.NOT_FOUND);
                else {
                    user.setPassword(BCrypt.hashpw(newPassword, BCrypt.gensalt()));
                    user.setCodeActivation(null);
                    user.setCodeActivationDate(null);
                    utilS.update(user);
                    return new ResponseEntity<>(Map.of("message", "Password has been successfully updated"), HttpStatus.OK);
                }
            }
        }
    }

    @GetMapping("/allProfessor")
    public List<Professor> getAllProf(){
        return utilS.findAllProfessors();
    }

    @GetMapping("/allStudent")
    public List<Student> getAllStudent(){
        return utilS.findAllStudents();
    }

    @GetMapping("/students/{id}")
    public List<Student> getStudentByProfessor(@PathVariable long id){
        return userRepository.findStudentsByProfessor(id);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getbyid(@PathVariable long id){
        User user =  userService.findById(id);
        if(user == null)
            return new ResponseEntity<>(Map.of("message","User does not exist"), HttpStatus.NOT_FOUND);
        else
            return ResponseEntity.ok(user);
    }
    @GetMapping("/pw/{id}")
    public ResponseEntity<?> getStudentPw(@PathVariable long id){
        User user =  userService.findById(id);
        if(user == null)
            return new ResponseEntity<>(Map.of("message","User does not exist"), HttpStatus.NOT_FOUND);
        else
            return ResponseEntity.ok(userRepository.findPwByStudent(id));
    }

    @PutMapping("/update/professor/{id}")
    public ResponseEntity<Object> updateid(@PathVariable long id, @RequestBody Professor user0){
        Professor user = (Professor) userService.findById(id);
        if(user == null)
            return new ResponseEntity<>(Map.of("message","User does not exist"), HttpStatus.NOT_FOUND);
        else{
            user.setFirstName(user0.getFirstName());
            user.setLastName(user0.getLastName());
            user.setUserName(user0.getUserName());
            user.setGrade(user0.getGrade());
            user.setPhoto(user0.getPhoto());
            userService.update(user);
            return ResponseEntity.ok(user);
        }

    }

    @PutMapping("/update/student/{id}")
    public ResponseEntity<Object> updateStudent(@PathVariable long id, @RequestBody Student changes){
        User existingUser = userService.findById(id);
        if (!(existingUser instanceof Student student)) {
            return new ResponseEntity<>(Map.of("message", "Student does not exist"), HttpStatus.NOT_FOUND);
        }

        User emailOwner = userService.findByEmail(changes.getEmail());
        if (emailOwner != null && emailOwner.getId() != id) {
            return new ResponseEntity<>(Map.of("message", "Email is already used by another account"),
                    HttpStatus.CONFLICT);
        }

        student.setFirstName(changes.getFirstName());
        student.setLastName(changes.getLastName());
        student.setUserName(changes.getUserName());
        student.setEmail(changes.getEmail());
        student.setNumber(changes.getNumber());
        if (changes.getPhoto() != null) {
            student.setPhoto(changes.getPhoto());
        }
        return ResponseEntity.ok(userService.update(student));
    }

    @GetMapping("/students/group/{id}")
    public List<Student> getStudentsByGroup(@PathVariable long id){
        return userRepository.findStudentsByGroup(id);
    }

    @GetMapping("/testpw/{id}")
    public ResponseEntity<?> testpw(@PathVariable long id){
        Student student = (Student) userService.findById(id);
        if(student == null)
            return new ResponseEntity<>(Map.of("message","User does not exist"), HttpStatus.NOT_FOUND);
        else{
            List<Boolean> list = new ArrayList<>();
            List<PW> pws = student.getGroup().getPws();
            List<StudentPW> studentPWS = studentPWService.findAll();
            for(PW pw: pws){
                int t = 0;
                for(StudentPW studentPW: studentPWS){
                    if (studentPW.getId().getStudent_id() == id && studentPW.getId().getPw_id() == pw.getId()) {
                        t = 1;
                        break;
                    }
                }
                if(t == 0)
                    list.add(false);
                else
                    list.add(true);
            }
            return ResponseEntity.ok(list);

        }

    }


}
