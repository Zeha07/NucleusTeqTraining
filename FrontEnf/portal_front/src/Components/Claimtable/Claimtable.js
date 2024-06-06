import React ,{useState , Component} from 'react';
import Table from 'react-bootstrap/Table'
import './Claimtable.css'
import 'bootstrap/dist/css/bootstrap.css';
import { Alert } from 'react-bootstrap';



export default function Claimtable({showdata ,showreview ,setshowreview , handleshowdetails ,backbuttondisabled}){
    


const back =() =>{
    setshowreview(false)
}
     return (

        <div className='Claimtable-container'>
        <div   className='Claimtable-Screen'>
          <div  className='claimtable-heading'>
        <p className='heading-text'>Claims Unreviewed</p> 
        
         <div className='Close-button' >
     <button class="close-button" onClick={(event) => setshowreview(false) } disabled ={backbuttondisabled}>
                        <span  className='button-icon-text' >&times;</span>
                        {/* <i class="button__icon fas fa-chevron-right"></i> */}
                    </button>	
                 </div>
                 </div>
     <div className='Page-Elements'
     >
        <div className='claimtable-container'  >
        <table className='table  table-fixed table-bordered table-hover '>
        <thead>
                            <tr className='table-success'>
                                <th>Type</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Details</th>
                               
                            </tr>
                        </thead>
                        <tbody className='tbody'>
                            {showdata.length > 0 ? (
                                showdata.map((student, index) => (
                                    <tr key={index}>
                                        <td>{student.type}</td>
                                        <td>{student.amt}</td>
                                        <td>{student.date}</td>
                                        <td><button onClick = {()=>handleshowdetails(student)}>Expand</button></td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5">No data available</td>
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