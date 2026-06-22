import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from "react-chartjs-2";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
const Statistiques = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [groupTab, setGroupTab] = useState([])
    const [nbrStedentTab, setNbrStudentTab] = useState([])
    const [nbrPWTab, setNbrPwTab] = useState([])
    const userlogin = JSON.parse(localStorage.getItem("userlogin"))
    const port = import.meta.env.VITE_PORT_SPRING;
    const url = `http://localhost:${port}/api/groups`;
    const [change, setChange] = useState(false)

    const fetchGroups = async () => {
        setLoading(true);
        const rep = await axios.get(`${url}/professor/${userlogin.id}`);
        setGroups(rep.data);
        let tab1 = []
        let tab2 = []
        let tab3 = []
        for (let index = 0; index < rep.data.length; index++) {
            tab1.push(rep.data[index].code)
            tab2.push(rep.data[index].student.length)
            tab3.push(rep.data[index].pws.length)

        }
        console.log(tab1)
        setGroupTab(tab1)
        setNbrStudentTab(tab2)
        setNbrPwTab(tab3)
        setLoading(false);
    };
    useEffect(() => {
        fetchGroups()
    }, [])

    const handeleChange =() =>{
        setChange(!change)
    }
    const options1 = {
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
                    text: 'Groups list ',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Student\'s number',
                },
            },
        },
        plugins: {
            legend: {
                display: true,
            },
        },
    };
    const options2 = {
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
                    text: 'Group list ',
                },
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Practical work\'s number',
                },
            },
        },
        plugins: {
            legend: {
                display: true,
            },
        },
    };

    const data1 = {
        labels: groupTab,
        datasets: [
            {
                label: "Groups by Student's number",
                backgroundColor: "rgb(255, 144, 63)",
                borderColor: "rgb(255, 144, 63)",
                data: nbrStedentTab,
            },
        ],
    };
    const data2 = {
        labels: groupTab,
        datasets: [
            {
                label: "Groups by PW's number",
                backgroundColor: "rgb(40, 226, 255)",
                borderColor: "rgb(40, 226, 255)",
                data: nbrPWTab,
            },
        ],
    };

    return (
        <div className=' relative flex  justify-center items-center w-full min-h-screen'>
            <button className='absolute text-blue-400 top-10 left-8 w-10 h-10 rounded-full bg-white'  onClick={handeleChange}>
                <FontAwesomeIcon icon={faAngleRight}/>
            </button>
            {!loading ?
                (change ? <Bar data={data2} options={options2} className='bg-gray-50 rounded-lg p-4' />
                    :
                    <Bar data={data1} options={options1} className='bg-gray-50 rounded-lg p-4 ' />
                )

                :
                <p>loading</p>
                }

        </div>
    )
}

export default Statistiques
