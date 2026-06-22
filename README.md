# E-Dent Web Platform

E-Dent is a full-stack educational platform for managing dental practical work. It connects administrators, professors, and students through role-based dashboards. Administrators can manage and activate professor accounts, professors can organize groups, students, teeth, and practical assignments, and students can review their assigned work and submit tooth analyses.

The application uses a Spring Boot and MySQL backend with a React, Vite, and Tailwind CSS frontend. It includes authentication, account activation, password recovery, progress tracking, practical-work management, image storage, and PDF reporting.

## Project authorship

This project was originally created by **Yahya Mourid** and was later enhanced and modernized by **Aymen Alioua**.

## Enhancements

The enhanced version introduces:

- A dynamic student dashboard connected to the existing Spring Boot API.
- Front and side tooth-image uploads with interactive landmark selection.
- Prototype calculation of cervical, axial, and incisal/occlusal angles.
- Storage and professor-side display of calculated angles, images, and scores.
- Editable student profile information with persistent backend updates.
- Functional and secured deletion workflows for professors, students, and groups.
- Automatic cleanup of student submissions and practical-work relationships during deletion.
- A repaired password-recovery flow with secure one-time codes and expiration handling.
- Gmail SMTP configuration through environment variables so credentials are not committed.
- Improved endpoint validation, authorization checks, error messages, and dashboard feedback.
- Updated project ownership, seeded professor credentials, documentation, and GitHub configuration.

> The tooth-angle feature uses prototype geometric definitions and is intended for demonstration and educational purposes, not clinical diagnosis or real-world treatment decisions.

## Installation
```
git clone https://github.com/aymenALa/DENT-WEB

```
### Using Docker 

Copy `.env.example` to `.env`, then run:

```
docker-compose build
docker-compose up
```
- Connect to the PhpMyAdmin server in Docker on port 8081 with the credentials 'root' for both username and password
- Restart the back-end project from docker desktop

### Email configuration

Email is sent through Gmail SMTP. Enable two-step verification on the sending Google account, create a Google App Password, and provide it through environment variables before starting the back end:

```powershell
$env:MAIL_USERNAME="fiverr.affiliate.aa@gmail.com"
$env:MAIL_PASSWORD="your-16-character-app-password"
```

Never commit the App Password or your regular Gmail password to this repository.





### Using mvn and npm
- cd dents-back-end
```
mvn clean install
mvn spring-boot:run 
```

- cd dents-front-end
```
npm install
npm run dev
```
- visualiser le site-web en local
```
 http://localhost:5173/
```
### Data base
- Import the 'dents.sql' database file into your local MySQL server 

## Demo





https://github.com/aymenALa/DENT-WEB/assets/128039351/97954a15-7522-4b88-901f-5b5e8ee269fd

![image](https://github.com/user-attachments/assets/ab871f5d-4606-4b86-8870-1745600c276e)

![image](https://github.com/user-attachments/assets/e0193e7e-8e28-474d-8c8e-278d7ae7d0a3)

### Accounts:
- Admin : admin@gmail.com / admin
- Prof : aymenalioua@gmail.com / qwerty

<div align="center">
 <b style = {font-weight: 600}>Visitors Count</b>

<p align="center"><img align="center" src="https://profile-counter.glitch.me/{aymenALa}/count.svg" /></p>
<br>
</div>


