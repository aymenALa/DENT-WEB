import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import AdminHome from './components/admin/AdminHome';
import ProfHome from './components/prof/ProfHome';
import StudentHome from './components/student/StudentHome';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Preline from "./components/Preline";
import NotFound404 from './components/auth/NotFound404'
import ResetPwd from "./components/auth/ResetPwd";
import VerifyCode from "./components/auth/VerifyCode";
import CodeActivation from "./components/auth/CodeActivation";

// Fix: Wrap routes in a component so localStorage is read dynamically on every single render/navigation pass
const AppRoutes = () => {
  const userlogin = JSON.parse(localStorage.getItem("userlogin"));
  const email = JSON.parse(localStorage.getItem("email"));
  const code = JSON.parse(localStorage.getItem("code"));
  const role = userlogin ? userlogin.role : null;

  return (
    <Routes>
      {userlogin ? (
        <>
          {/* Core Dashboards */}
          {role === 'admin' && <Route path='/admin' element={<AdminHome />} />}
          {role === 'professor' && <Route path='/professor/:componentName' element={<ProfHome />} />}
          {role === 'professor' && <Route path='/professor' element={<Navigate replace to={`/${role}/dashboard`} />} />}
          {role === 'student' && <Route path='/student' element={<StudentHome />} />}

          {/* Route Guards */}
          {!(role === 'admin') && <Route path='/admin' element={<Navigate replace to={`/${role}`} />} />}
          {!(role === 'professor') && <Route path='/professor' element={<Navigate replace to={`/${role}`} />} />}
          {!(role === 'student') && <Route path='/student' element={<Navigate replace to={`/${role}`} />} />}

          {/* Force Authenticated Users Away From Auth Screens */}
          <Route path='/login' element={<Navigate replace to={`/${role}`} />} />
          <Route path='/login/*' element={<Navigate replace to={`/${role}`} />} />
          <Route path='/register' element={<Navigate replace to={`/${role}`} />} />
          <Route path='/' element={<Navigate replace to={`/${role}`} />} />
        </>
      ) : (
        <>
          {/* Force Unauthenticated Users to Login */}
          <Route path='/admin' element={<Navigate replace to="/login" />} />
          <Route path='/professor/:componentName' element={<Navigate replace to="/login" />} />
          <Route path='/student' element={<Navigate replace to="/login" />} />
        </>
      )}

      {/* Guest Paths */}
      {!userlogin && <Route path="/login" element={<Login />} />}
      {!userlogin && <Route path="/login/activationcode" element={<CodeActivation />} />}
      {(!userlogin && email) && <Route path="/login/verifycode" element={<VerifyCode />} />}
      {!userlogin && code && <Route path="/login/resetpwd" element={<ResetPwd />} />}
      {!userlogin && <Route path="/register" element={<Register />} />}
      <Route path="/" element={<Login />} />
      <Route path="*" element={<NotFound404 />} />
    </Routes>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Preline />
      <AppRoutes />
    </BrowserRouter>
  </React.StrictMode>
);
