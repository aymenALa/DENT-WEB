import React from 'react'
import { useState } from "react"
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CodeActivation = () => {
    const port = import.meta.env.VITE_PORT_SPRING || 5050;
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [user, setUser] = useState({
        email: "",
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
  
    const handleInput = (e) => {
      setUser({ ...user, [e.target.name]: e.target.value });
    };
  
    const toggleDarkMode = () => {
      setIsDarkMode(!isDarkMode);
    };
  
    const submit = async () => {
      if (!user.email.trim()) {
        toast.error('Please enter your email address.');
        return;
      }
      try {
        const res = await axios.post(`http://localhost:${port}/api/users/codeactivation`, user);
        console.log(res.data);
        localStorage.setItem("email",JSON.stringify(user.email))
        notify(res.data.message);
        setTimeout(() => {
            window.location = '/login/verifycode'
          }, 2000);
         
        
      } catch (error) {
        toast.error(error.response?.data?.message || 'Could not send the reset code.', {
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
    };

    

    return (
        <div className={`${isDarkMode ? 'dark' : ''}`}>
            <div className={`dark:bg-slate-900 bg-gray-100 flex h-full items-center py-16 min-h-screen font-[Poppins]`}>
                <main class="w-full max-w-md mx-auto p-6">
                    <div class="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
                        <div class="p-4 sm:p-7">
                            <div class="text-center">
                                <h1 class="block text-2xl font-bold text-gray-800 dark:text-white">Get Activation code </h1>
                                <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                    Did you forgot your password?
                                </p>
                            </div>

                            <div class="mt-5">
                                <div class="py-3 flex items-center text-xs text-gray-400 uppercase dark:text-gray-500 dark:before:border-gray-600 dark:after:border-gray-600"></div>
                                <div class="grid gap-y-4">
                                    <div>
                                        <label for="email" class="block text-sm mb-2 dark:text-white">Email address</label>
                                        <input type="email" id="email" name="email" value={user.email} onChange={handleInput} class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600" required aria-describedby="email-error" />
                                    </div>
                                    <button onClick={submit} class="w-full mt-2 py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">Submit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="absolute top-4 right-4">
                        <button
                            onClick={toggleDarkMode}
                            className="bg-gray-200 dark:bg-gray-700 rounded-full p-2 focus:outline-none focus:ring focus:border-blue-300"
                        >
                            {isDarkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
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


export default CodeActivation
