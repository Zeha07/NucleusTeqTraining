import React, { useState } from 'react';
import EmpSingleCred from './EmpSingleCred';
import './Employees.css'
export default function EmployeeCredentials({ showemps, setshowemps, empData, handleselectempId, showsingleemp, setshowsingleemp ,del  ,setdel }) {
    const [emp, setemp] = useState(false);
    const [showsingle, setshowsingle] = useState(false);
    const [k, setkey] = useState();

    return (
        <div className='Big-Screen-emp'>
        <div   className='BigContainer-Screen-emp'>
          <div  className='heading'>
        <p className='heading-text-emp'>Employee Credentials</p> 
        
         <div className='Close-button' >
     <button class="close-button" onClick={(event) => setshowemps(false)}>
                        <span  className='button-icon-text' >&times;</span>
                        {/* <i class="button__icon fas fa-chevron-right"></i> */}
                    </button>	
                 </div>
                 </div>
     <div className='Page-Elements'
     >
                
          
                <div className='table-container'>
                   
                        

                 <table className='table table-bordered table-hover'>
                    <thead className='thead'>
                    <tr className='table-success'>
                           <td>Sr.</td>
                            <td>Department</td>
                            <td>Email</td>
                            <td>Manager</td>
                            <td>Username</td>
                            <td>Change Credentials</td>
                        </tr>
                    </thead>
                    <tbody>
                    {empData.length > 0 ? (
            empData.map((emp, index) => (
              <tr key={emp.empId}>
                <td>{index + 1}</td> {/* Index column */}
                <td>{emp.department}</td>
                <td>{emp.email}</td>
                <td>{emp.manager}</td>
                <td>{emp.username}</td>
                <td value={emp.empId}>
                  <button onClick={() => handleselectempId(emp)}>Change credentials</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No employee data available</td> {/* Updated colspan to 6 */}
            </tr>
          )}
                    </tbody>
                </table> 
            </div>
            </div>

           
        </div>
        </div>
    );

}
