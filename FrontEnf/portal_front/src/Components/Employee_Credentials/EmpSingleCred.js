import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import DelEmp from './DelEmp'
export default function EmpSingleCred({ selectempId, showsingleemp, setshowsingleemp ,del ,setdel}) {
  const [details, setdetails] = useState();
  const [managers, setmanagers] = useState([]);
  const [manager, setmanager] = useState();
  const [depts, setdepts] = useState([]);
  const [dept, setdept] = useState();
  const [dispdept, setdispdept] = useState("");
  const [dispm, setdism] = useState("");
  const [deptch, setdeptch] = useState(false);
  const [mch, setmch] = useState(false);
  const [t, sett] = useState({
    ischanged: false,
    value: 0,
    label: ""
  });
  const [chdetails, setchdetails] = useState([]);
   
  useEffect(() => {
    alert(selectempId.empId);

    const getdetails = async () => {
      const form = new FormData();
      form.append("empId", selectempId.empId);
      const response = await fetch('http://localhost:8000/singleempcred', {
        method: "POST",
        body: form,
      });
      const data = await response.json();
      // alert(data.cur_dept);
      setdetails(data);
      setmanager(data.curmanager.id);
      setdism(data.curmanager.username);
      setdept(data.cur_dept.id);
      setdispdept(data.cur_dept.department);
      const m = [];
      data.managers.forEach((value) => {
        m.push({
          label: value.username,
          value: value.id
        });
      });
      setmanagers(m);
      const d = [];
      data.departments.forEach((value) => {
        d.push({
          label: value.department,
          value: value.id
        });
      });
      setdepts(d);
    };
    getdetails();
  }, [selectempId.empId]);

  const handleValueChange = (option) => {
    setdept(option.value);
    setdispdept(option.label);
    setmanager(0);
    setdism("set new manager");
    //  alert(dept)
    //  alert(dispdept)
    const getManagers = async () => {
      const form = new FormData();
      form.append("department", option.value);
      const response = await fetch('http://localhost:8000/getdeptmanagers', {
        method: "POST",
        body: form,
      });
      const data = await response.json();
      const m = [];
      console.log('Response data:', data);

      if (Array.isArray(data)) {
        const m = data.map((value) => ({
          label: value.username,
          value: value.id,
        }));
        setmanagers(m);
      } else {
        console.error('Expected an array but got:', data);
      }

    getManagers();
  };
}

 
  const saveChanges = async () => {
    const form = new FormData();
    form.append("manager", manager);
    form.append("dept", dept);
    form.append("empId", selectempId.empId);

    const response = await fetch('http://localhost:8000/updateEmp', {
      method: "PUT",
      body: form,
    });
    const data = await response.json();
    setchdetails(data);
    console.log(data);
  };

  return (
    <div className='Main-Screen'>
        <div   className='Container-Screen'>
          <div  className='Emp-heading'>
        <p className='heading-text'> Credentials</p> 
        
         <div className='Close-button' >
     <button class="close-button" onClick={(event) => setshowsingleemp(false)}>
                        <span  className='button-icon-text' >&times;</span>
                        {/* <i class="button__icon fas fa-chevron-right"></i> */}
                    </button>	
                 </div>
                 </div>

      <div className='Screen-container'>
         <div className='selectman'>
          <span>Current manager:{dispm}</span>
          <Select
            value={managers.find(m => m.value === manager)}
            onChange={option => setmanager(option.value)}
            className='selectDept'
            options={managers}
            placeholder="Select a manager"
            isSearchable
          />
        </div>  
        <div  className='selectdept'>
          <span>Current Department:    {dispdept}</span>
          <Select
            value={depts.find(d => d.value === dept)}
            onChange={handleValueChange}
            className='selectDept'
            options={depts}
            placeholder="Select a department"
            isSearchable
          />
        </div>

        <div className='buttons-container-emp'>
          <button className="Back-button" onClick={() => setshowsingleemp(false)}>
            <span className="button__text">Back</span>
            <i className="button__icon fas fa-chevron-right"></i>
          </button>
          <button className="Back-button" onClick={saveChanges}>
            <span className="button__text">Save</span>
            <i className="button__icon fas fa-chevron-right"></i>
          </button>
          <button className="Back-button" onClick={e=>setdel(true)}>
            <span className="button__text">Delete Employee</span>
            <i className="button__icon fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
    {del && <DelEmp selectempId ={selectempId}  setdel={setdel} setshowsingleemp={setshowsingleemp}/>}
    </div>
  );

  }
