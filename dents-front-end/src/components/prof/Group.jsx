import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faPen, faClose, faAdd } from '@fortawesome/free-solid-svg-icons';
const Group = () => {
    const port = import.meta.env.VITE_PORT_SPRING;
    const [groups, setGroups] = useState([]);
    const [group, setGroup] = useState({
        id: '',
        code: '',
        year: ''
    });
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState(false);
    const [modalDel, setModalDel] = useState(false);
    const [updateMode, setUpdateMode] = useState(false);
    const [addpwMode, setAddPwMode] = useState(false)
    const [pwId, setPwId] = useState("")
    const [pws, setPws] = useState([])
    const url = `http://localhost:${port}/api/groups`;
    const userlogin = JSON.parse(localStorage.getItem("userlogin"))
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

    const fetchGroups = async () => {
        setLoading(true);
        const rep = await axios.get(`${url}/professor/${userlogin.id}`);
        setGroups(rep.data);
        setLoading(false);
    };

    const fetshPws = async () => {
        setLoading(true)
        const rep = await axios.get(`http://localhost:${port}/api/pws/all`)
        setPws(rep.data)
        setLoading(false)
    }

    useEffect(() => {
        fetchGroups();
        fetshPws()
    }, []);

    const handleGroup = (e) => {
        setGroup({ ...group, [e.target.name]: e.target.value });
    };

    const handlePw = (e) => {
        setPwId(e.target.value)
    }

    const handleUpdate = (gr) => {
        setGroup(gr)
        setUpdateMode(true)
        openModal()
    }
    const handlePwMode = (gr) => {
        setGroup(gr)
        setAddPwMode(true)
        openModal()
    }
    const handleDelete = (id) => {
        setGroup((current) => ({ ...current, id }))
        openModaldel()
    }

    const addGroup = async () => {
        const rep = await axios.post(`${url}/add/${userlogin.id}`, group)
        notify(rep.data.message)
        setGroup({
            id: '',
            code: '',
            year: ''
        })
        fetchGroups();
        closeModal()
    }
    const updateGroup = async () => {
        const rep = await axios.put(`${url}/update/${group.id}`, group)
        notify(rep.data.message)
        setGroup({
            id: '',
            code: '',
            year: ''
        })
        fetchGroups()
        closeModal()
        setUpdateMode(false)
    }
    const deleteGroup = async () => {
        try {
            const rep = await axios.delete(`${url}/delete/${group.id}`, {
                headers: { Authorization: `Bearer ${userlogin.token}` }
            })
            notify(rep.data.message)
            closeModaldel()
            fetchGroups();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Could not delete this group.')
        }
    }

    const addPw = async () => {
        try {
            const rep = await axios.post(`${url}/pw/${group.id}/${pwId}`)
            setGroup(rep.data)
            console.log(rep.data)
            fetchGroups
        } catch (error) {
            console.log(error)
        }
    }
    const deletePw = async (idG, idP) => {
        try {
            const rep = await axios.delete(`${url}/pw/${idG}/${idP}`)
            setGroup(rep.data)
            fetchGroups()
            setPwId("")
            console.log(rep.data)
        } catch (error) {
            console.log(error)
        }
    }

    const openModal = () => {
        setModal(true);
    };

    const closeModal = () => {
        fetchGroups()
        setModal(false);
        setGroup({
            id: '',
            code: '',
            year: ''
        })
        setUpdateMode(false)
        setAddPwMode(false)
        
    };
    const openModaldel = () => {
        setModalDel(true);
    };

    const closeModaldel = () => {
        setModalDel(false);
        setGroup({
            id: '',
            code: '',
            year: ''
        })
    };

    return (
        <div className="w-full mt-20">
            {loading ? (
                <p></p>
            ) : (
                <>
                    <div class="flex flex-col w-full border p-10 border-gray-200 rounded-xl bg-white">
                        <button type="button" class="w-1/6 mb-1  py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-100 text-blue-600 hover:bg-blue-200 disabled:opacity-50 disabled:pointer-events-none dark:hover:bg-blue-900 dark:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                            onClick={openModal}>
                            <FontAwesomeIcon icon={faPlus} />
                            Add new group
                        </button>

                        <div class="-m-1.5 overflow-x-auto">
                            <div class="p-1.5 min-w-full inline-block align-middle">
                                <div class="overflow-hidden rounded-t-2xl">
                                    <table class="min-w-full divide-y mt-1 divide-gray-200 dark:divide-gray-700">
                                        <thead className='bg-gray-200 '>
                                            <tr>
                                                <th scope="col" class="px-8 py-3 text-start text-xs font-medium text-gray-500 uppercase">Id</th>
                                                <th scope="col" class="pl-32 py-3 text-start text-xs font-medium text-gray-500 uppercase">code</th>
                                                <th scope="col" class="pl-32 py-3 text-start text-xs font-medium text-gray-500 uppercase">Year</th>
                                                <th scope="col" class="pl-32 py-3 text-start text-xs font-medium text-gray-500 uppercase">Pws's list</th>
                                                <th scope="col" class="pl-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">Add-Pw</th>
                                                <th scope="col" class="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">Delete</th>
                                                <th scope="col" class="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">Update</th>
                                            </tr>
                                        </thead>
                                        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                                            {groups.map((group, index) => (
                                                <tr>
                                                    <td class="px-8 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">{group.id}</td>
                                                    <td class="pl-32 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{group.code}</td>
                                                    <td class="pl-32 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{group.year}</td>
                                                    <td class="flex items-center gap-2  pl-32 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                                        {group.pws.length !== 0 ? group.pws.map((pw, index) => (
                                                            <span className='flex justify-center items-center text-sm  px-1 py-0.5 rounded-lg border border-gray-500 text-gray-500 bg-gray-200'>
                                                                {pw.title}
                                                                <FontAwesomeIcon onClick={() => deletePw(group.id, pw.id)} icon={faClose} className='ml-3 hover:bg-gray-500 hover:text-gray-100 p-0.5 rounded-full h-5 w-5' />
                                                            </span>
                                                        )) : 
                                                        <p>{console.log(group)}no pws</p>}
                                                    </td>
                                                    <td class="px-2 py-4 whitespace-nowrap text-end text-sm font-medium">
                                                        <button type="button" class="inline-flex items-center pr-3 gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                                                            onClick={() => handlePwMode(group)}>
                                                            <FontAwesomeIcon icon={faAdd} />
                                                        </button>
                                                    </td>
                                                    <td class="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                                                        <button type="button" class="inline-flex items-center pr-3 gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-red-600 hover:text-red-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                                                            onClick={() => handleDelete(group.id)}>
                                                            <FontAwesomeIcon icon={faTrash} />
                                                        </button>
                                                    </td>
                                                    <td class="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                                                        <button type="button" class="inline-flex items-center pr-3 gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                                                            onClick={() => handleUpdate(group)}>
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
                        <div className="w-full h-full fixed top-0 left-0 z-[60] bg-black bg-opacity-60 flex justify-center items-center">
                            <div className="bg-white w-full max-w-md p-4 rounded-xl p-5">
                                {!addpwMode &&
                                    <div>
                                        <h3 className="font-bold text-gray-800 mb-3 text-center">
                                            {updateMode ? 'Update' : 'Add'} group
                                        </h3>
                                        <label for="input-label" class="block text-sm font-medium mb-2 dark:text-white">Code</label>
                                        <input type="email" id="input-label"
                                            name='code'
                                            value={group.code}
                                            onChange={handleGroup}
                                            class="py-3  w-full px-4  border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600" placeholder="code" />
                                        <label for="input-label" class="block text-sm font-medium mb-2 dark:text-white">Year</label>
                                        <input type="email" id="input-label"
                                            name='year'
                                            value={group.year}
                                            onChange={handleGroup}
                                            class="py-3  w-full px-4  border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600" placeholder="year" />
                                    </div>}
                                {addpwMode &&
                                    <div className='flex flex-col items-center justify-center p-3 mt-3 '>
                                        <div className='flex justify-center w-full items-center gap-3 mt-3'>
                                            <select value={pwId} onChange={handlePw} class="py-3 w-1/3 px-4 pe-9 block border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600">
                                                <option selected>Select pw</option>
                                                {pws.map((pw, index) => (
                                                    <option value={pw.id}>{pw.title}</option>
                                                ))}
                                            </select>
                                            <button onClick={addPw} className='flex items-center text-white px-5 py-1 rounded-md bg-green-500 hover:bg-green-700'>
                                                <FontAwesomeIcon icon={faPlus} />
                                                <p className='ml-2 '>add pw</p>
                                            </button>

                                        </div>
                                        {group.pws.lenght !== 0 &&
                                            <div className='grid grid-cols-3 gap-4 pt-4'>
                                                {group.pws.map((pw, index) => (
                                                    <span className='flex justify-center items-center px-2 py-0.5 rounded-lg border border-gray-500 text-gray-500 bg-gray-200'>
                                                        {pw.title}
                                                        <FontAwesomeIcon onClick={deletePw} icon={faClose} className='ml-3 hover:bg-gray-500 hover:text-gray-100 p-0.5 rounded-full h-5 w-5' />
                                                    </span>
                                                ))}
                                            </div>
                                        }
                                    </div>
                                }
                                <div className="flex justify-end mt-4">
                                    <button
                                        type="button"
                                        className="py-2 px-3 mr-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50"
                                        onClick={closeModal}
                                    >
                                        Close
                                    </button>
                                    {!addpwMode &&
                                        <button
                                            type="button"
                                            className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700"
                                            onClick={updateMode ? updateGroup : addGroup}
                                        >
                                            {updateMode ? 'update' : 'add'}
                                        </button>}
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
            {modalDel && (
                <div
                    className="w-full h-full fixed top-0 left-0 z-[60] bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="flex flex-col items-center bg-white w-full max-w-md rounded-xl p-5">
                        <h3 className="font-bold text-xl text-gray-800 mb-3 text-center">
                            Delete group
                        </h3>
                        <span class=" flex-shrink-0 inline-flex justify-center items-center mb-2 sm:w-[62px] sm:h-[62px] rounded-full border-4 border-red-50 bg-red-100 text-red-500 dark:bg-red-700 dark:border-red-600 dark:text-red-100">
                            <svg class="flex-shrink-0 w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                            </svg>
                        </span>
                        <h3 className="text-center text-sm text-gray-600 mb-3 ">
                            Are you sure you want to delete this group?
                        </h3>

                        <div className="flex justify-end mt-4">
                            <button
                                type="button"
                                className="py-2 px-3 mr-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50"
                                onClick={closeModaldel}
                            >
                                close
                            </button>
                            <button
                                type="button"
                                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-red-600 text-white hover:bg-red-700"
                                onClick={deleteGroup}
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

}

export default Group
