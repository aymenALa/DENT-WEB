import axios from "axios";
import { useState } from "react"
import React from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Login = () => {
  const port = import.meta.env.VITE_PORT_SPRING;
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState({
    email:"",
    password:""
  })
  const notify = (mssg) => {
    toast.success(`${mssg}`, {
        position: 'bottom-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
    });
};
  const [err,setErr] = useState("")

  const handleInput = (e)=>{
    setUser({...user,[e.target.name]:e.target.value})

  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };
  const submit = async()=>{
    console.log(user)
   
    try {
      const res = await axios.post(`http://localhost:${port}/api/users/login`,user)
      console.log(res.data)
      setUser({
        email:"",
        password:""
      })
      localStorage.setItem("userlogin",JSON.stringify(res.data))
      setTimeout(() => {
        notify(res.data.message)
      }, 1000);
     
    // console.log(JSON.parse(localStorage.getItem("userlogin")).user.role)
    const role = res.data.role
    if(role == 'professor'){
      window.location = role+'/profil'
    }
    else{
      window.location = role
    }
    
    } catch (error) {
      console.log(error.response.data.message)
      toast.error(`${error.response.data.message}`, {
        position: 'bottom-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
    });
      
    }
    
  }

  return (
<div className={`${isDarkMode ? 'dark' : ''}`}>
    <div className={`dark:bg-slate-900 bg-gray-100 flex h-full items-center py-16 min-h-screen font-[Poppins]`}>
    <main class="w-full max-w-md mx-auto p-6">
      <div class="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div class="p-4 sm:p-7">
          <div class="text-center">
            <h1 class="block text-2xl font-bold text-gray-800 dark:text-white">Sign in</h1>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Don't have an account yet?
              <a class="text-blue-600 ml-2 decoration-2 hover:underline font-medium dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" href="/register">
                Sign up here
              </a>
            </p>
          </div>

          <div class="mt-5">
            

            <div class="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-[1_1_0%] before:border-t before:border-gray-200 before:me-6 after:flex-[1_1_0%] after:border-t after:border-gray-200 after:ms-6 dark:text-gray-500 dark:before:border-gray-600 dark:after:border-gray-600"></div>

            
            
              <div class="grid gap-y-4">
                
                <div>
                  <label for="email" class="block text-sm mb-2 dark:text-white">Email address</label>
                  <div class="relative">
                    <input type="email" id="email" name="email" value={user.email} onChange={handleInput} class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600" required aria-describedby="email-error"/>
                    <div class="hidden absolute inset-y-0 end-0 flex items-center pointer-events-none pe-3">
                      <svg class="h-5 w-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                      </svg>
                    </div>
                  </div>
                  <p class="hidden text-xs text-red-600 mt-2" id="email-error">Please include a valid email address so we can get back to you</p>
                </div>
           
                <div>
                  <div class="flex justify-between items-center">
                    <label for="password" class="block text-sm mb-2 dark:text-white">Password</label>
                    <a class="text-sm text-blue-600 decoration-2 hover:underline font-medium dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" href="/login/activationcode">Forgot password?</a>
                  </div>
                  <div class="relative">
                    <input type="password" id="password" name="password" value={user.password} onChange={handleInput} class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600" required aria-describedby="password-error"/>
                    <div class="hidden absolute inset-y-0 end-0 flex items-center pointer-events-none pe-3">
                      <svg class="h-5 w-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                      </svg>
                    </div>
                  </div>
                  <p class="hidden text-xs text-red-600 mt-2" id="password-error">8+ characters required</p>
                </div>
                

                
                {err && <p class="text-sm text-red-600 mt-2" >{err}</p>}
                

                <button  onClick={submit} class="w-full mt-2 py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">Sign in</button>
              </div>
            
            
          </div>
        </div>
      </div>
      <div className="absolute top-4 right-4">
          <button
            onClick={toggleDarkMode}
            className="bg-gray-200 dark:bg-gray-700 rounded-full p-2 focus:outline-none focus:ring focus:border-blue-300"
          >
            {isDarkMode ? '🌞' : '🌙'}
          </button>
        </div>
    </main>
  </div>
  <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
  </div>


  )
}

export default Login
