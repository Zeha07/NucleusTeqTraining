import React, { useEffect, useState } from 'react';
import Header from '../../Components/Header/Header.js';
import Claimnew from '../../Components/Claimnew/Claimnew.js';
import './EmployeeHome.css';
import SeeAll from '../../Components/SeeAll/SeeAll.js';
import Claimtable from '../../Components/Claimtable/Claimtable.js';
import { useLocation ,useNavigate } from "react-router-dom";
import SeeDetails from '../../Components/Claimtable/SeeDetails.js'
const EmployeeHome = () => {
    const location = useLocation();
    const { state : user} = location;
   const navigate = useNavigate();
    const [re ,setre] = useState();
    const [show, setshow] = useState(false);
    const [showall, setshowall] = useState(false);
    const [showalldata , setshowalldata]= useState([]);
   const [showdata , setshowdata] = useState([])
   const [showdetails , setshowdetails] = useState(false);
   const [showdetailsdata , setshowdetailsdata] = useState([]);
 const getshowalldata = async() =>{
    setshowall(true)
    try{
    const form = new FormData();
    form.append("empId" , user.empid)
    const res = await fetch('http://localhost:8000/getselfimbursementsall',{
        method :"POST" ,
        body : form,
    });
    const data = await res.json();
    setshowalldata(data);

   }catch(error){

   }
 }
 const handleshowdetails = (review) => {
    setshowdetailsdata(review);
    console.log(review);
    setshowdetails(true);
};

 useEffect(()=>{
     const getUnapproved = async()=>{
         
        try{
            
            const form = new FormData()
            form.append("empId" , user.empid)
            const res = await fetch('http://localhost:8000/getselfimbursementsunapproved',{
                method:'POST',
                body:form,
            })
            
            const data = await res.json();
            
            // alert(data[0].type)
            setshowdata(data);
        } catch(error){
      new Error(error)
        }
     };
     getUnapproved();
 },[]);
    return (
        <div>
            <Header name={user.username} />
            <div className='Body-component'> 
                <div className='buttons-container'>
                    <button className="action-button" onClick={() => setshow(!show)}>
                        <span className="button__text">Claim New</span>
                        <i className="button__icon fas fa-chevron-right"></i>
                    </button>
                    <button className="action-button" onClick={() => getshowalldata()}>
                        <span className="button__text">See All</span>
                        <i className="button__icon fas fa-chevron-right"></i>
                    </button>
                 </div>
                <div className='Claimtable-comp-emp'>
                    <Claimtable showdata ={showdata}  handleshowdetails={handleshowdetails} showreview={re} setshowreview={setre} backbuttondisabled={true}/>
                </div>
                {show && <Claimnew setshow={setshow} show={show} user={user}  />}
                {showall && <SeeAll setshowall={setshowall} showall={showall} showalldata ={showalldata}/>}
                {showdetails && <SeeDetails showdetailsdata = {showdetailsdata} showdetails = {showdetails} setshowdetails ={setshowdetails} />}
            </div>
        </div>
    );
};

export default EmployeeHome;
