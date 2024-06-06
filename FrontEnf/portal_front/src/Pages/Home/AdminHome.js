import React, { useState, useEffect } from 'react';
import Header from '../../Components/Header/Header';
import EmpSingleCred from '../../Components/Employee_Credentials/EmpSingleCred';
import DeleteDepartment from '../../Components/Departments/DeleteDepartment';
import AddDepartment from '../../Components/Departments/AddDepartment';
import EmployeeCredentials from '../../Components/Employee_Credentials/EmployeeCredentials';
import ManagerCredentials from '../../Components/ManagerCredentials/ManagerCredentials';
import SinglemanCredentials from '../../Components/ManagerCredentials/SinglemanCredentials';
import './AdminHome.css';
import { useLocation } from 'react-router-dom';
// import Claimtable from '../../Components/Claimtable/Claimtable';
import SingleReview from '../../Components/Review/SingleReview';
import Review from '../../Components/Review/Review';


export default function AdminHome() {
    const location = useLocation();
    const { state: user } = location;

    const [selectedDept, setSelectedDept] = useState();
    const [showSingleEmp, setshowSingleEmp] = useState(false);
    const [showsingleman, setshowsingleman] = useState(false);
    const [showemps, setshowemps] = useState(false);
    const [showDel, setShowDel] = useState(false);
    const [showadd, setshowadd] = useState(false);
    const [empData, setEmpData] = useState([]);
    const [selectempId, setselectempId] = useState(null);
    const [manData, setManData] = useState([]);
    const [selectManId, setSelectManId] = useState(null);
    const [showManager, setShowManager] = useState(false);
const [showdata, setshowdata] = useState([]);
    const [showreview, setshowreview] = useState(false);
    const [singlereviewdata, setsinglereviewdata] = useState();
    const [showsinglereview, setshowsinglereview] = useState(false);
const [reviewdata, setreviewdata] = useState([]);
const [del ,setdel] = useState(false);
    
    const handleselectempId = (emp) => {
        setselectempId(emp);
        setshowSingleEmp(true);
    };

    const handleselectManId = (emp) => {
        setSelectManId(emp);
        setshowsingleman(true);
    };

    const fetchEmpDetails = async () => {
        try {
            const response = await fetch('http://localhost:8000/employeescredentials');
            const data = await response.json();
            setEmpData(data);
            setshowemps(true);
        } catch (error) {
            console.error("Failed to fetch employee credentials:", error);
            alert("Error fetching employee credentials");
        }
    };
    useEffect(() => {
        if (del === false && showemps===true) {
            fetchEmpDetails();
        }
    }, [del]);
    const fetchManDetails = async () => {
        try {
            const response = await fetch('http://localhost:8000/managerscredentials');
            const data = await response.json();
            setManData(data);
            setShowManager(true);
        } catch (error) {
            console.error("Failed to fetch manager credentials:", error);
            alert("Error fetching manager credentials");
        }
    };


    const fetchReviewData = async () => {
        try {
            const form = new FormData();
            form.append("empid", user.empid);
            const res = await fetch('http://localhost:8000/reviewadmin', {
                method: "POST",
                body: form,
            });
            const data = await res.json();
            console.log('Fetched review data:', data);
            setreviewdata(data);
            alert("Data received");
        } catch (error) {
            console.error("Error fetching review data:", error);
        }
    };

    useEffect(() => {
        fetchReviewData();
    }, [user.empid]);

    const handlesinglereviewchange = (review) => {
        setsinglereviewdata(review);
        console.log(review);
        setshowsinglereview(true);
    };


    return (
        <div>
            <Header name="Admin" />
            <div className="buttons-container">
                <div className="button-wrapper">
                    <button className="action-button" onClick={() => setShowDel(!showDel)}>
                        <span className="button__text">Delete Department</span>
                        <i className="button__icon fas fa-chevron-right"></i>
                    </button>
                </div>
                <div className="button-wrapper">
                     <button className="action-button" onClick={() => setshowadd(!showadd)}>
                        <span className="button__text">Add New Department</span>
                        <i className="button__icon fas fa-chevron-right"></i>
                    </button>
                    <button className="action-button" onClick={fetchEmpDetails}>
                        <span className="button__text">Employee Credentials</span>
                        <i className="button__icon fas fa-chevron-right"></i>
                    </button>
                    <button className="action-button" onClick={fetchManDetails}>
                        <span className="button__text">Manager Credentials</span>
                        <i className="button__icon fas fa-chevron-right"></i>
                    </button>
                </div>
                
            </div>
            <div className='Review-component'>
                        <Review reviewdata={reviewdata} user={user} handlesinglereviewchange={handlesinglereviewchange} />
                    </div>
            {showsinglereview && <SingleReview singlereviewdata={singlereviewdata} showsinglereview={showsinglereview} setshowsinglereview={setshowsinglereview} user={user} refreshReviewData={fetchReviewData} />}
            {/* {showreview && <Claimtable showdata={showdata} showreview={showreview} setshowreview={setshowreview} handlesinglereviewchange={handlesinglereviewchange} />} */}
            {showemps && <EmployeeCredentials showemps={showemps} setshowemps={setshowemps} empData={empData} handleselectempId={handleselectempId}  />}
            {showDel && <DeleteDepartment showdel={showDel} setshowdel={setShowDel} />}
            {showadd && <AddDepartment showadd={showadd} setshowadd={setshowadd} />}
            {showManager && <ManagerCredentials showmanager={showManager} setshowmanager={setShowManager} mandata={manData} handleselectManId={handleselectManId} />}
            {showSingleEmp && selectempId && <EmpSingleCred selectempId={selectempId} showsingleemp={showSingleEmp} setshowsingleemp={setshowSingleEmp} del={del} setdel={setdel}/>}
            {showsingleman && selectManId && <SinglemanCredentials selectManId={selectManId} showsingleman={showsingleman} setshowsingleman={setshowsingleman} />}
        </div>
    );
}


