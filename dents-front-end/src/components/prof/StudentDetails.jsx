import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Prof from '../../assets/b.png'
import { faCircleCheck, faCircleExclamation, faPlus, faTrash, faNoteSticky, faEnvelope, faRefresh, faPhone, faPen, faClose, faAdd, faHouse, faUser, faPeopleGroup, faTooth, faGear, faPaperclip } from '@fortawesome/free-solid-svg-icons';
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";

const StudentDetails = (props) => {
    const port = import.meta.env.VITE_PORT_SPRING;
    const studentId = props.id
    const [student, setStudent] = useState({})
    const [loading, setLoading] = useState(false)
    const [doTp, setDoTp] = useState([])
    const url = `http://localhost:${port}/api/users`;
    const [modal, setModal] = useState(false)
    const [studentPw, setStudentPw] = useState({})
    const [pw, setPw] = useState({})
    const [labels, setLabels] = useState([])
    const [notes, setNotes] = useState([])

    const studentData = {
        labels: ['TP1', 'TP2', 'TP3', 'TP4', 'TP5'],
        data: [80, 85, 75, 90, 88],
    };
    const fetshUser = async () => {
        try {
            const rep = await axios.get(`${url}/${studentId}`)
            setStudent(rep.data)
            console.log(rep.data)
            let tab = []
            let tabnote =[]
            for(let i=0; i<rep.data.group.pws.length; i++){
                let c = 0
                tab.push(rep.data.group.pws[i].title)
                for (let j=0; j<rep.data.studentPWS.length;j++){
                    if(rep.data.studentPWS[j].id.pw_id == rep.data.group.pws[i].id){
                        c = rep.data.studentPWS[j].noteSide + rep.data.studentPWS[j].noteFront
                    }
                }
                tabnote.push(c)
            }
            setLabels(tab)
            setNotes(tabnote)
            

        } catch (error) {
            console.log(error)
        }
    }
    const fetsDoTp = async () => {
        try {
            const rep = await axios.get(`${url}/testpw/${studentId}`)
            setDoTp(rep.data)
            console.log(rep.data[0])
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        setLoading(true);
        fetshUser();
        fetsDoTp();
        setLoading(false);
    }, []);

    const openModal = (studentId, pwcurrent) => {
        setPw(pwcurrent)
        let stpws = student.studentPWS
        for (let i = 0; i < stpws.length; i++) {
            if (studentId === stpws[i].id.student_id || pwcurrent.id === stpws[i].id.pw_id) {
                setStudentPw(stpws[i])
                break
            }
        }
        setModal(true);
    };

    const closeModal = () => {
        setModal(false);
        setStudentPw({})
        setPw({})
    };
    const downloadPdfDocument = () => {
        const input = document.getElementById('modal');
        const downloadButton = input.querySelector('.bg-blue-500');
        if (downloadButton) {
            downloadButton.remove();
        }
        html2canvas(input)
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF();
                const pdfWidth = 210;
                const pdfHeight = 297;
                const imgWidth = pdfWidth - 20;
                const imgHeight = (imgWidth / canvas.width) * canvas.height;
                pdf.addImage(imgData, 'JPEG', 10, 10, imgWidth, imgHeight);
                pdf.save(`${student.lastName + pw.title}.pdf`);
            });
    }
    // const labels = ["January", "February", "March", "April", "May", "June"];

    const options = {
        animations: {
            tension: {
              duration: 3000,
              easing: 'easeOutQuad',
              from: 1,
              to: 0,
              loop: true
            }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Practical work\' list ', 
            },
          },
          y: {
            title: {
              display: true,
              text: 'Scores', 
            },
            suggestedMin: 0, 
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      };
      
      const data = {
        labels: labels,
        datasets: [
          {
            label: "",
            backgroundColor: "rgb(255, 99, 132)",
            borderColor: "rgb(255, 99, 132)",
            data: notes,
          },
        ],
      };
    return (

        <div className='flex flex-col items-center w-4/5 mt-10'>
            {!loading && student.group && student.group.pws ?
                <>
                    <div className='flex flex-col items-center w-full'>

                        <div className='flex py-5  bg-white rounded-xl shadow-md w-4/5  justify-center items-center'>
                            <span className='flex w-2/5 justify-center'>
                                <img src={student.photo === null ? Prof : `data:image/png;base64, ${student.photo}`} className='w-36 h-36 rounded-full mx-2 border-4 border-gray-300' />
                            </span>
                            <div className='flex flex-col gap-1 mx-1 w-3/5'>
                                <p className='text-2xl font-semibold text-gray-700'>{student.firstName} {student.lastName}</p>
                                <p className='text-lg py-1 text-gray-600'><FontAwesomeIcon icon={faEnvelope} className='mr-2' /> {student.email}</p>
                                <p className='text-lg py-1 text-gray-600'><FontAwesomeIcon icon={faPhone} className='mr-2' />{student.number}</p>
                                <p className='text-lg py-1 text-gray-600'><FontAwesomeIcon icon={faPeopleGroup} className='mr-2' />{student.group.code}</p>
                            </div>
                        </div>
                        <div className='flex justify-center mt-8 w-full'>
                            {student.group.pws.length !== 0 ? (
                                <div className={`w-4/5 grid grid-cols-${Math.min(student.group.pws.length, 4)} gap-4`}>
                                    {student.group.pws.map((pw, index) => (
                                        <span key={index}
                                            className={`relative flex flex-col border-2 px-2 py-4 justify-center hover:scale-105 ${doTp[index] ? 'hover:cursor-pointer  border-green-600' : ' border-red-600'} items-center bg-white rounded-lg shadow-md`}
                                            onClick={() => doTp[index] && openModal(student.id, pw)}
                                        >
                                            <p className='text-2xl font-semibold text-blue-400 mb-2'>{pw.title}</p>
                                            <p className='text-md text-gray-400'>{pw.objectif}</p>
                                            {doTp[index] ?
                                                <FontAwesomeIcon icon={faCircleCheck} className='absolute text-green-600 top-1 right-1' />
                                                :
                                                <FontAwesomeIcon icon={faCircleExclamation} className='absolute text-red-600 top-1 right-1' />}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p>no pw to display</p>
                            )}
                        </div>
                        <div className='w-full h-[430px] flex flex-col items-center justify-center p-4'>
                            <p className='text-2xl font-medium mt-20 mb-3'>Student's Progression</p>
                            <Line data={data} options={options} className='bg-gray-50 rounded-lg p-4' />
                        </div>
                    </div>

                </>




                : (
                    <p>Loading</p>
                )}
            {modal &&
                <div className="w-full h-full fixed top-0 left-0 z-[60] bg-black bg-opacity-60 flex justify-center items-center" id='modal'>
                    <div className="bg-white w-3/5 relative  rounded-xl p-5 flex flex-col items-center">
                        <p className='font-bold text-4xl text-gray-800 mb-5'>{student.lastName}-{pw.title}</p>
                        <div className='flex justify-center  gap-5 items-center w-full '>
                            <div className='flex flex-col justify-center items-center w-1/2 bg-green-200 rounded-lg p-1 '>
                                <p className='font-bold text-2xl text-green-600 mb-3'>Front Image</p>
                                <img
                                    src={`data:image/png;base64, ${studentPw.imageFront}`} className=' '
                                />
                                <div className='flex gap-3 justify-center items-center w-full my-2'>
                                    <span className='flex flex-col w-1/3 justify-center items-center gap-1 text-lg mb-2'>
                                        <p className='text-gray-600 text-xl font-semibold'>Angles1</p>
                                        <p>{studentPw.af1}</p>
                                        <p>{studentPw.af2}</p>
                                    </span>
                                    <span className='flex flex-col w-1/3 justify-center items-center gap-1 text-lg mb-2'>
                                        <p className='text-gray-600 text-xl font-semibold'>Angles2</p>
                                        <p>{studentPw.bf1}</p>
                                        <p>{studentPw.bf2}</p>
                                    </span>
                                    <span className='flex flex-col w-1/3 justify-center items-center gap-1 text-lg mb-2'>
                                        <p className='text-gray-600 text-xl font-semibold'>Angles3</p>
                                        <p>{studentPw.cf1}</p>
                                        <p>{studentPw.cf2}</p>
                                    </span>
                                </div>
                                <p className='font-medium text-xl text-gray-500 mb-3'>Note : {studentPw.noteFront}/10</p>
                            </div>
                            <div className='flex flex-col justify-center items-center w-1/2 bg-blue-200 rounded-lg p-1'>
                                <p className='font-bold text-2xl text-blue-600 mb-3'>Side Image</p>
                                <img
                                    src={`data:image/png;base64, ${studentPw.imageSide}`}
                                />
                                <div className='flex gap-3 justify-center items-center w-full my-2'>
                                    <span className='flex flex-col w-1/3 justify-center items-center gap-1 text-lg mb-2'>
                                        <p className='text-gray-600 text-xl font-semibold'>Angles1</p>
                                        <p>{studentPw.as1}</p>
                                        <p>{studentPw.as2}</p>
                                    </span>
                                    <span className='flex flex-col w-1/3 justify-center items-center gap-1 text-lg mb-2'>
                                        <p className='text-gray-600 text-xl font-semibold'>Angles2</p>
                                        <p>{studentPw.bs1}</p>
                                        <p>{studentPw.bs2}</p>
                                    </span>
                                    <span className='flex flex-col w-1/3 justify-center items-center gap-1 text-lg mb-2'>
                                        <p className='text-gray-600 text-xl font-semibold'>Angles3</p>
                                        <p>{studentPw.cs1}</p>
                                        <p>{studentPw.cs2}</p>
                                    </span>
                                </div>
                                <p className='font-medium text-xl text-gray-500 mb-3'>Note : {studentPw.noteSide}/10</p>
                            </div>
                            
                        </div>

                        {/* <p className='py-32'>{studentPw.as2}</p> */}
                        <button

                            type="button"
                            className=" absolute top-7 right-7 font-medium rounded-full   text-red-600 text-xl hover:text-red-800"
                            onClick={closeModal}
                        >
                            <FontAwesomeIcon icon={faClose} />
                        </button>
                        <p className='absolute top-5 left-7 flex justify-center items-center text-xl font-medium text-red-500 bg-red-200 border border-red-500 p-3 rounded-full w-24 h-24'>{studentPw.noteFront+studentPw.noteSide}/20</p>
                        <button
                            type="button"
                            className="bg-blue-500  text-white px-4 py-2 rounded-md mt-4"
                            onClick={downloadPdfDocument}
                        >
                            Télécharger en PDF
                        </button>
                    </div>
                </div>

            }
        </div>
    )
}

export default StudentDetails
