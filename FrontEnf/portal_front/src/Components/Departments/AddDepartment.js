import React, { useState, useEffect } from 'react';
import './Departments.css';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';

export default function AddDepartment({ showadd, setshowadd }) {
  const [dept, setdept] = useState("");
  const [opts, setOpts] = useState([]); // Use state for options

  const back = (event) => {
    setshowadd(!showadd);
  };

  useEffect(() => {
    const fdata = async () => {
      const response = await fetch('http://localhost:8000/getDepartments');
      const data = await response.json();
      const options = data.map((value) => ({
        department: value.department,
        value: value.id
      }));
      setOpts(options); // Update state with options
    };
    fdata();
  }, []);

  const change = (e) => {
    setdept(e.target.value);
    console.log(dept);
  };

  const addDept = async (event) => {
    event.preventDefault();
    try {
      const data = new FormData();
      data.append("department", dept);
      const response = await fetch('http://localhost:8000/adddepartment', {
        method: "POST",
        body: data,
      });
      if (!response.ok) {
        throw new Error("network error");
      }
      const result = await response.json();
      console.log('Success', result);
      alert("success!!!");
    } catch (error) {
      console.log(error);
    }
    console.log(dept);
  };

  const customStyles = {
    control: (baseStyles, state) => ({
      ...baseStyles,
      backgroundColor: "#FFFFFF",
      color: "white",
    }),
    option: (baseStyles, state) => ({
      ...baseStyles,
      backgroundColor: state.isFocused ? "#e2e2e2" : "",
      color: state.isFocused ? "#333333" : "#FFFFFF",
    }),
    menu: (baseStyles, state) => ({
      ...baseStyles,
      backgroundColor: "#333333",
      color: "#000000",
    }),
  };

  return (
    <div className='Main-Screen'>
        <div   className='Container-Screen'>
          <div  className='del-heading'>
        <p className='heading-text'>Add New Department</p> 
        
         <div className='Close-button' >
     <button class="close-button" onClick={back}>
                        <span class="button__text" className='button-icon-text' >&times;</span>
                        <i class="button__icon fas fa-chevron-right"></i>
                    </button>	
                 </div>
                 </div>
      <div className='Page-Elements'>
        <div className='Deptname'>
          <p>Add new Department Name</p>
          <input
            className='deptname'
            placeholder='Enter Department name'
            value={dept} // Changed to value from defaultValue
            onChange={change}
          />
        </div>

        <div className='presentdept'>
          <span><h4>Departments Present</h4></span>
          {opts.map(opt =>
            <p key={opt.value}>{opt.department}</p>
          )}
        </div>

        

        <div className='Register'>
          <button className="Add-button" onClick={addDept}>
            <span className="button__text">Add Department</span>
            {/* <i className="button__icon fas fa-chevron-right"></i> */}
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}
