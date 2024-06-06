import React , {useState,useRef } from 'react'
import { CgOptions } from 'react-icons/cg';
import Select from 'react-select'
import './Departments.css'
import Departments from './Departments';
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
export default function DeleteDepartment({showdel,setshowdel}){

   

 
 const [selecteddept , setselecteddept] = useState();  

const back = (event) =>{

setshowdel(!showdel);

}

const Deldept= async (event) =>{
    // console.log(type);
    // console.log(amount);
    // console.log(date);
    event.preventDefault();
    const data = new FormData();
    data.append("deptId" , selecteddept);
    
    try{
        const response = await fetch( 'http://localhost:8000/deldepartment',{
          method:"DELETE",
          body :data,
        });
        if(!response.ok){
          throw new Error("network error");
        }
        else{

        const result = await response.json();
        setselecteddept("");
        console.log('Success' , result);
        alert("request success")
        }
      }catch (error){
        console.log(error);
      }

  
};


const customStyles = {
    control: (baseStyles, state) => ({
      ...baseStyles,
      backgroundColor: "#FFFFFF",
      color:"white",
    }),
    option: (baseStyles, state) => ({
      ...baseStyles,
      backgroundColor: state.isFocused ? "#e2e2e2" : "",
      color: state.isFocused ? "#333333" : "#FFFFFF",
    }),
    menu: (baseStyles, state) => ({
      ...baseStyles,
      backgroundColor: "#333333",
      color:"#000000",
    }),
  
  
  
  }





    return (
     <div className='Main-Screen'>
        <div   className='Container-Screen'>
          <div  className='del-heading'>
        <p className='heading-text'>Delete Department</p> 
        
         <div className='Close-button' >
     <button class="close-button" onClick={back}>
                        <span  className='button-icon-text' >&times;</span>
                        {/* <i class="button__icon fas fa-chevron-right"></i> */}
                    </button>	
                 </div>
                 </div>
     <div className='Page-Elements'
     >
      
     <div className='del-selectdept'>
        <Departments selecteddept ={selecteddept}  setselecteddept = {setselecteddept} />
     </div>
          
 
                 
         
                  <div className='Register' >
         <button class="Save-button" onClick={Deldept}>
                        <span class="button__text" className='save-button-text'>Delete Department</span>
                        <i class="button__icon fas fa-chevron-right"></i>
                    </button>	
                 </div>   



</div>




     </div>


</div>

    );
}