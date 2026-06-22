import React from 'react'
import NotFound from '../../assets/notfound.jpg'
const NotFound404 = () => {
  return (
    <div class="flex w-full min-h-screen  justify-center items-center">
      
  
    

      <div class="text-center py-32 px-4 sm:px-6 lg:px-8 w-2/3  rounded-l-lg justify-center flex flex-col items-center">
        {/* <h1 class="block text-9xl font-bold text-sky-700 my-8 sm:text-9xl dark:text-white">404</h1> */}
        <img src={NotFound} className='w-[400px] h-[400px] animate-bounce'/>
        <p class="mt-3 text-gray-600 text-3xl dark:text-gray-400 font-semibold my-5 ">Oops, something went wrong.</p>
        <p class="text-gray-600 text-xl dark:text-gray-400">Sorry, we couldn't find your page.</p>
        <a href='/' className='text-white text-xl px-4 py-2 bg-sky-700 hover:bg-sky-800 rounded-lg my-8'>Go to home </a>
      </div>
      

    
  

    </div>
  )
}

export default NotFound404
