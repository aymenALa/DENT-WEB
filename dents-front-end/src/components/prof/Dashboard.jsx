import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Prof from '../../assets/b.png'
import StudentDetails from './StudentDetails';
import { DotLoader } from 'react-spinners';
import {faDownload, faPlus, faTrash, faNoteSticky, faEnvelope, faRefresh, faPhone, faPen, faClose, faAdd, faHouse, faUser, faPeopleGroup, faTooth, faGear, faPaperclip, faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
const Dashboard = () => {
    const port = import.meta.env.VITE_PORT_SPRING;
    const [groups, setGroups] = useState([]);
    const [pws, setPws] = useState([])
    const [students, setStudents] = useState([]);
    const [nbrStudent, setNbrStudent] = useState(0)
    const [loading, setLoading] = useState(false);
    const [loadings, setLoadings] = useState(false);
    const [groupId, setGroupId] = useState("")
    const [studentId, setStudentId] = useState("")
    const [studentMode, setStudentMode] = useState(false)
    const url = `http://localhost:${port}/api`;
    const userlogin = JSON.parse(localStorage.getItem("userlogin"))

    const fetchGroups = async () => {
        setLoading(true);
        const rep = await axios.get(`${url}/groups/professor/${userlogin.id}`);
        setGroups(rep.data);
        setLoading(false);
    };
    const fetshPws = async () => {
        setLoading(true)
        const rep = await axios.get(`${url}/pws/all`)
        setPws(rep.data)
        setLoading(false)
    }
    const fetchStudents = async () => {
        setLoadings(true);
        const rep = await axios.get(`${url}/users/students/${userlogin.id}`);
        setStudents(rep.data);
        setNbrStudent(rep.data.length)
        setLoadings(false);
    };
    useEffect(() => {
        fetchStudents()
        fetchGroups()
        fetshPws()
    }, []);
    const reset = () => {
        fetchStudents()
        setGroupId("")
    }
    const handleGroup = (e) => {
        if (e.target.value === -1) {
            fetchStudents()
            return
        }
        setGroupId(e.target.value)
        getStudentsByGroup(groupId)
    }
    const getStudentsByGroup = async (e) => {
        const selectedGroupId = e.target.value;

        try {
            if (selectedGroupId !== '-1') {
                setGroupId(selectedGroupId)
                const rep = await axios.get(`${url}/users/students/group/${selectedGroupId}`)
                setStudents(rep.data)
            }

        } catch (error) {
            console.log(error)
        }
    }

    const handleStudentClick = (id) => {
        setStudentId(id)
        setStudentMode(true)
    }
    const downloadPdf = () => {
        const doc = new jsPDF();
    
        doc.text('Liste des étudiants', 20, 10);
    
        students.forEach((student, index) => {
          const yOffset = 20 + index * 30;
          doc.text(`Nom: ${student.firstName} ${student.lastName}`, 20, yOffset);
          doc.text(`Email: ${student.email}`, 20, yOffset + 10);
          doc.text(`Numéro de téléphone: ${student.number}`, 20, yOffset + 20);
          // Add other information you want to include in the PDF
        });
    
        doc.save('liste_etudiants.pdf');
      };
    return (
        <div className='flex flex-col justify-center items-center w-full p-5 '>
            {!studentMode ?
                <><div className='flex gap-20 justify-center items-center    w-4/5  mt-5'>
                    <span className='flex flex-col items-center justify-center px-2 py-5 w-1/3 rounded-lg shadow-l bg-white'>
                        <span className='flex items-center justify-center text-3xl font-bold text-blue-400'>
                            <FontAwesomeIcon icon={faPeopleGroup} className='w-30 h-30 mx-2 p-4 rounded-tl-xl rounded-br-xl bg-blue-400 text-white' />
                            <p className=''>Groups</p>
                        </span>
                        <p className='font-bold text-3xl text-gray-600'>{groups.length}</p>
                    </span>
                    <span className=' flex flex-col items-center justify-center px-2 py-5 w-1/3 rounded-lg shadow-l bg-white'>
                        <span className='flex items-center justify-center text-3xl font-bold text-blue-400'>
                            <FontAwesomeIcon icon={faUser} className='w-30 h-30 mx-2 p-4 rounded-tl-xl rounded-br-xl bg-blue-400 text-white' />
                            <p className=''>Students</p>
                        </span>
                        <p className='font-bold text-3xl text-gray-600'>{nbrStudent}</p>
                    </span>
                    <span className='flex flex-col items-center justify-center px-2 py-5 w-1/3 rounded-lg shadow-l bg-white'>
                        <span className='flex items-center justify-center text-3xl font-bold text-blue-400'>
                            <FontAwesomeIcon icon={faNoteSticky} className='w-30 h-30 mx-2 p-4 rounded-tl-xl rounded-br-xl bg-blue-400 text-white' />
                            <p className=''>PWS</p>
                        </span>
                        <p className='font-bold text-3xl text-gray-600'>{pws.length}</p>
                    </span>
                </div>
                    <div className='flex justify-between items-center my-10 px-20 py-3 w-4/5 bg-white rounded-lg'>
                        <p className='text-xl font-bold text-gray-700  w-2/3'>Student't List</p>
                        <div className='flex items-center w-3/5'>
                            <p className='text-gray-500 font-semibold w-2/6 mr-3'>Filter by : </p>
                            <select value={groupId} onChange={getStudentsByGroup} class="py-3 w-3/6 px-4 pe-9 text-gray-500 block border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600">
                                {!groupId && <option value='-1'  >Select group</option>}
                                {groups.map((group, index) => (
                                    <option value={group.id}>{group.code}</option>
                                ))}
                            </select>
                            <FontAwesomeIcon onClick={() => reset()} className='mx-3 w-1/12 text-blue-400 hover:text-blue-500' icon={faRefresh} />
                            <FontAwesomeIcon onClick={downloadPdf} className='mx-3 w-1/12 text-blue-400 hover:text-blue-500 cursor-pointer' icon={faDownload} />
                        </div>
                    </div>
                    <div className={`grid  grid-cols-${Math.min(students.length, 3)} gap-10`}>
                        {!loadings ?
                        students.length !== 0 &&
                            students.map((student, index) => (
                                <div onClick={() =>handleStudentClick(student.id)} className='flex flex-col  items-center rounded-t-xl shadow-xl bg-white hover:scale-105'>
                                    <div className='bg-blue-400 bg-opacity-80  rounded-t-xl w-full flex justify-center '>
                                        <img src={student.photo ===null ? Prof : `data:image/png;base64, ${student.photo}`} className='w-48 h-48 rounded-full p-3' />
                                    </div>
                                    <div className='bg-white flex flex-col items-center py-1 px-1 b'>
                                        <p className='text-xl font-semibold text-gray-700 my-1'>{student.firstName} {student.lastName}</p>
                                        <p className='text-gray-500'> <FontAwesomeIcon icon={faEnvelope} className='mr-2' /> {student.email}</p>
                                        <p className='text-gray-500'> <FontAwesomeIcon icon={faPhone} className='mr-2' />{student.number}</p>
                                    </div>
                                </div>
                            ))
                            :<DotLoader color='#36d7b7' className='mt-20' />
                        }
                    </div>
                </>
                :
                <div className='w-full flex justify-center'>
                <FontAwesomeIcon onClick={() => setStudentMode(false)} icon={faArrowCircleLeft} className='absolute top-12 left-64 ml-12 text-3xl text-blue-400 hover:text-blue-700'/>
                <StudentDetails id={studentId}/>
                </div>
                
            }
        </div>
    )
}

export default Dashboard
