
import Sidebar from './../Sidebar'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Logout from '../auth/Logout';
import Professors from './Professors';
import SideBarAdmin from './SideBarAdmin'

const AdminHome = () => {
  const [user, setuser] = useState([]);
  const port = import.meta.env.VITE_PORT_SPRING;

  const fetchapi = () => {
    axios.get(`http://localhost:${port}/api/users/allProfessor`)
    .then(response => {
      setuser(response.data); 
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  };
  

  useEffect(() => {
    fetchapi();
  }, []); 
  const handleActivateToggle = (userId) => {
    // Mettez à jour l'état localement
    setuser((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, activate: !user.activate } : user
      )
    );

    axios
      .post(`http://localhost:${port}/api/users/activate/${userId}`)
      .then((response) => {
        // Mise à jour réussie
      })
      .catch((error) => {
        console.error('Error updating activate status:', error);
      
        setuser((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, activate: !user.activate } : user
          )
        );
      });
  };







  return (
   
   <>
   <Logout/>
   <SideBarAdmin />
   <div class="lg:ml-64">
    <Professors/>
  </div>
   </>
  )
}

export default AdminHome
