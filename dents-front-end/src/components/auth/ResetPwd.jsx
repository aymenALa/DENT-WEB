import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const ResetPwd = () => {
    const port = import.meta.env.VITE_PORT_SPRING || 5050;
    const email = JSON.parse(localStorage.getItem("email"));
    const code = JSON.parse(localStorage.getItem("code"));
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [pwd, setpwd] = useState("");
    const [pwd1, setpwd1] = useState("");
    const [err, setErr] = useState("")

    const handleInputPw = (e) => {
        setpwd(e.target.value)
    };
    const handleInputPw1 = (e) => {
        setpwd1(e.target.value)
    };

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

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

    const submit = async () => {
        if (!email || !code) {
            toast.error('Your reset session is missing. Start the password reset again.');
            return;
        }
        if (!pwd) {
            setErr('Enter a new password');
            return;
        }
        try {
            console.log({
                email: email,
                code: code,
                password: pwd

            });
            if(pwd === pwd1){
                const res = await axios.post(`http://localhost:${port}/api/users/resetpwd`, {
                    email: email,
                    code: code,
                    password: pwd
    
                });
                notify(res.data.message);
                localStorage.removeItem("email")
                localStorage.removeItem("code")
                setTimeout(() => {
                    window.location = '/login';
                }, 3000);
    
            }else{
                setErr('The two passwords must be identical')
                setTimeout(() => {
                    setErr('');
                  }, 2000);
            }
            
        } catch (error) {
            toast.error(error.response?.data?.message || 'Could not reset the password.', {
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
                <main className="w-full max-w-md mx-auto p-6">
                    <div className="py-2 px-3 bg-white border border-gray-200 rounded-lg dark:bg-slate-900 dark:border-gray-700">
                        <div className="text-center my-8">
                            <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">Confirm activation code </h1>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                Enter the activation code that you received in your email
                            </p>
                        </div>
                        <div className="py-2 px-3 mb-8  bg-white border border-gray-300 rounded-lg dark:bg-slate-900 dark:border-gray-700" >
                            <label for="password" class="block text-sm text-gray-600 mb-2 dark:text-white">New password</label>
                            <input
                                value={pwd}
                                onChange={handleInputPw}
                                className="block w-full text-center text-xl border-gray-300  rounded-md placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                                type="password"
                                placeholder='------'
                            />
                            <label for="password" class="block text-sm text-gray-600 mb-2 dark:text-white">Confirm password</label>
                            <input
                                value={pwd1}
                                onChange={handleInputPw1}
                                className="block w-full text-center text-xl border-gray-300  rounded-md placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                                type="password"
                                placeholder='------'
                            />
                            <a class="text-sm text-blue-600  decoration-2 hover:underline font-medium dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" href="/login/">  login</a>
                            {err && <p class="text-sm text-red-600 mt-2 text-center py-1 px-2 bg-red-200 rounded-md border border-red-600 " >{err}</p>}
                        </div>
                        <button
                            onClick={submit}
                            className="w-full mt-2 py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                        >
                            Submit
                        </button>
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
    );
};

export default ResetPwd
