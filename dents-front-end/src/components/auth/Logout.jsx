import React from 'react'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

const Logout = () => {
    const handleLogout = () =>{
        localStorage.removeItem("userlogin")
        window.location = "/"
    }
  return (
    <div className=' bottom-4 left-8 z-[70] fixed'>
      <button type="button" onClick={handleLogout} class="py-3 px-14 inline-flex items-center gap-x-3 text-sm font-semibold rounded-full border border-transparent bg-blue-400 text-white hover:bg-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
      <FontAwesomeIcon icon={faRightFromBracket} /> Log out
</button>
    </div>
  )
}

export default Logout
