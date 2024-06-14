import React  ,{useEffect, useState} from 'react'
import SinglemanCredentials from './SinglemanCredentials';


export default function ManagerCredentials({showmanager, setshowmanager, mandata ,handleselectManId}) {
const [emp , setemp] = useState(false);

// const [empdata , setempdata]  = useState([])
const [showsingle , setshowsingle]  = useState(false);
    // useEffect(()=>{
    //    const fetd = async () =>{
    //     try{
    //          const i = await fetch('http://localhost:8000/employeescredentials')
    //          const data= await i.json()
    //          setempdata(data);
    //          console.log(data);

    //     }catch(error){
    //         alert(error)
    //     }
    // };
    // fetd();
    // },[]);
    
    const [k,setkey] = useState();  
// const showsingleemp = (empId)=> {
//     setshowsingle(!showsingle);
//     setkey(empId)
//     alert(empId)
// }

    return (
        <div className='Big-Screen-emp'>
        <div   className='BigContainer-Screen-emp'>
          <div  className='heading'>
        <p className='heading-text'>Manager Credentials</p> 
        
         <div className='Close-button' >
     <button class="close-button" onClick={(event) => setshowmanager(false)}>
                        <span  className='button-icon-text' >&times;</span>
                        {/* <i class="button__icon fas fa-chevron-right"></i> */}
                    </button>	
                 </div>
                 </div>
     <div className='Page-Elements'
     >
            
     <div className='mantable-container'>               
   
   <table className='mantable  table-fixed table-bordered table-hover '>
    <thead>
        <tr>
            <td>Sr.</td>
            <td>
                department
            </td>
            <td>email</td>
            <td>manager</td>
            <td>username</td>
            <td>Credentials</td>
        </tr>
    </thead>
    <tbody>
        {mandata.map((emp ,index) =>(
            <tr key={emp.empId} >
                <td>{index +1}</td>
                 <td>{emp.department}</td>
                <td>{emp.email}</td>
                <td>{emp.manager}</td>
                <td>{emp.username}</td>

                {/* {Object.keys(emp).map((key) =>(
                    <td key ={key} >{emp.department}</td>
                ))} */}
               <td   value ={emp.empId}><button onClick={() =>handleselectManId(emp)}>Change credentials</button></td> 
            </tr>
    ))
        };
    </tbody>
   </table>
   
   </div>
   </div>
   <div  >
   
 {/* <EmpSingleCred showsingle={showsingle} setshowsingle={setshowsingle} />  */}
   </div>
   
   
   
   
        </div>

  </div> 
);

// return(
//     <div><h4>ManagerCredentials</h4></div>
// )
}