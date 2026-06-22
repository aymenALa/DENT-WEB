import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faPen } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Tooth = () => {
  const port = import.meta.env.VITE_PORT_SPRING;
  const [teeth, setTeeth] = useState([]);
  const [tooth, setTooth] = useState({
    id: '',
    name: '',
  });
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalDel, setModalDel] = useState(false);
  const [updateMode, setUpdateMode] = useState(false);
  const url = `http://localhost:${port}/api/teeth`;
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
  const fetchTeeth = async () => {
    setLoading(true);
    const rep = await axios.get(`${url}/all`);
    setTeeth(rep.data);
    setLoading(false); 
  };

  useEffect(() => {
    fetchTeeth();
  }, []); 

  const handleTooth = (e) => {
    setTooth({ ...tooth, [e.target.name]: e.target.value });
  };

  const handleUpdate = (id, name) =>{
    tooth.id = id
    tooth.name = name
    setUpdateMode(true)
    openModal()
  }
  const handleDelete = (id) =>{
    tooth.id = id
    openModaldel()
  } 

  const addTooth = async () =>{
    const rep = await axios.post(`${url}/add`,tooth)
    notify(rep.data.message)
    setTooth({
        id: '',
        name: '',
      })
    fetchTeeth();
    closeModal()
  }
  const updateTooth = async () =>{
    const rep = await axios.put(`${url}/update/${tooth.id}`,tooth)
    notify(rep.data.message)
    setTooth({
        id: '',
        name: '',
      })
    fetchTeeth()
    closeModal()
    setUpdateMode(false)
  }
  const deleteTooth = async () =>{
    const rep = await axios.delete(`${url}/delete/${tooth.id}`)
    notify(rep.data.message)
    setTooth({
        id: '',
        name: '',
      })
    fetchTeeth();
    closeModaldel()
  }

  const openModal = () => {
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
    setTooth({
        id: '',
        name: '',
      })
    setUpdateMode(false)
  };
  const openModaldel = () => {
    setModalDel(true);
  };

  const closeModaldel = () => {
    setModalDel(false);
    setTooth({
        id: '',
        name: '',
      })
  };

  return (
    <div className="w-full mt-20">
      {loading ? (
        <p>loading</p>
      ) : (
        <>
        <div class="flex flex-col w-full border p-10 border-gray-200 rounded-xl bg-white">
                    <button type="button" class="w-1/6 mb-1  py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-100 text-blue-600 hover:bg-blue-200 disabled:opacity-50 disabled:pointer-events-none dark:hover:bg-blue-900 dark:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                        onClick={openModal}>
                        <FontAwesomeIcon icon={faPlus} />
                        Add new tooth 
                    </button>
                    
                    <div class="-m-1.5 overflow-x-auto">
                        <div class="p-1.5 min-w-full inline-block align-middle">
                            <div class="overflow-hidden rounded-t-2xl">
                                <table class="min-w-full divide-y mt-1 divide-gray-200 dark:divide-gray-700">
                                    <thead className='bg-gray-200 '>
                                        <tr>
                                            <th scope="col" class="px-8 py-3 text-start text-xs font-medium text-gray-500 uppercase">Id</th>
                                            <th scope="col" class="pl-32 py-3 text-start text-xs font-medium text-gray-500 uppercase">name</th>
                                            <th scope="col" class="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">Delete</th>
                                            <th scope="col" class="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">Update</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                                        {teeth.map((tooth, index) => (
                                            <tr>
                                                <td class="px-8 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">{tooth.id}</td>
                                                <td class="pl-32 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{tooth.name}</td>
                                                <td class="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                                                    <button type="button" class="inline-flex items-center pr-3 gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-red-600 hover:text-red-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                                                        onClick={() =>handleDelete(tooth.id)}>
                                                        <FontAwesomeIcon icon={faTrash} />
                                                        </button>
                                                </td>
                                                <td class="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                                                    <button type="button" class="inline-flex items-center pr-3 gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                                                        onClick={() =>handleUpdate(tooth.id,tooth.name)}>
                                                        <FontAwesomeIcon icon={faPen} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
          

          {modal && (
            <div
              className="w-full h-full fixed top-0 left-0 z-[60] bg-black bg-opacity-50 flex justify-center items-center"
            //   onClick={closeModal}
            >
              <div className="bg-white w-full max-w-md p-4 rounded-xl p-5">
                <h3 className="font-bold text-gray-800 mb-3 text-center">
                {updateMode ? 'Update' : 'Add'} tooth
                </h3>
                <label for="input-label" class="block text-sm font-medium mb-2 dark:text-white">Name</label>
                <input type="email" id="input-label" 
                    name='name'
                    value={tooth.name}
                    onChange={handleTooth}
                    class="py-3  w-full px-4  border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600" placeholder="tooth-name"/>
                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    className="py-2 px-3 mr-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700"
                    onClick={updateMode? updateTooth: addTooth}
                  >
                     {updateMode ? 'update' : 'add'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
       {modalDel && (
            <div
              className="w-full h-full fixed top-0 left-0 z-[60] bg-black bg-opacity-50 flex justify-center items-center"
            //   onClick={closeModal}
            >
              <div className="flex flex-col items-center bg-white w-full max-w-md p-4 rounded-xl p-5">
                <h3 className="font-bold text-xl text-gray-800 mb-3 text-center">
                    Delete tooth
                </h3>
                <span class=" flex-shrink-0 inline-flex justify-center items-center mb-2 sm:w-[62px] sm:h-[62px] rounded-full border-4 border-red-50 bg-red-100 text-red-500 dark:bg-red-700 dark:border-red-600 dark:text-red-100">
            <svg class="flex-shrink-0 w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
            </svg>
          </span>
                <h3 className="text-center text-sm text-gray-600 mb-3 ">
                    Are you shure you wont to delete this tooth ?
                </h3>
               
                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    className="py-2 px-3 mr-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50"
                    onClick={closeModaldel}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-red-600 text-white hover:bg-red-700"
                    onClick={deleteTooth}
                  >
                     delete
                  </button>
                </div>
              </div>
            </div>
          )}
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

export default Tooth;

