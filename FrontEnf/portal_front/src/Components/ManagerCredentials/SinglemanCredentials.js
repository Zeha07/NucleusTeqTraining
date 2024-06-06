import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import './ManagerCredentials.css'; // Ensure you have a CSS file for your styles

const SinglemanCredentials = ({selectManId, showsingleman ,setshowsingleman}) => {
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [managers, setManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);
   const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch('http://localhost:8000/getDepartments');
        const data = await response.json();
        const departmentOptions = data.map((dept) => ({
          label: dept.department,
          value: dept.id,
        }));
        setDepartments(departmentOptions);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    fetchDepartments();
  }, []);

  const handleDepartmentChange = async (selectedOption) => {
    setSelectedDept(selectedOption);
    setSelectedManager(null); // Reset the selected manager
    setIsSaveDisabled(true); // Disable the save button until a manager is selected
    
    try {
      const d = departments.find(e => e.label ===selectManId.department);
      const formData = new FormData();
      formData.append('department', d.value);
      formData.append("empId" ,selectManId.empId )
      const response = await fetch('http://localhost:8000/getdeptmanagers', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      const managerOptions = data.map((manager) => ({
        label: manager.username,
        value: manager.id,
      }));
      setManagers(managerOptions);
    } catch (error) {
      console.error('Error fetching managers:', error);
    }
  };

  const handleManagerChange = (selectedOption) => {
    setSelectedManager(selectedOption);
    setIsSaveDisabled(false); // Enable the save button
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('dept', selectedDept.value);
      formData.append('newmanager', selectedManager.value);
      formData.append('empId' , selectManId.empId)
      const response = await fetch('http://localhost:8000/updateManager', {
        method: 'PUT',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      console.log('Save successful:', result);
      alert('Save successful');
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Error saving data');
    }
  };

  return (
    <div className='Main-Screen'>
    <div   className='Container-Screen'>
      <div  className='Emp-heading'>
    <p className='heading-text'> Credentials</p> 
    
     <div className='Close-button' >
 <button class="close-button" onClick={(event) => setshowsingleman(false)}>
                    <span  className='button-icon-text' >&times;</span>
                    {/* <i class="button__icon fas fa-chevron-right"></i> */}
                </button>	
             </div>
             </div>

  <div className='Screen-container'>

      <div className="select-container">
        <h4>Current Department : {selectManId.department}</h4>
        <Select
          placeholder="Select Department"
          options={departments}
          onChange={handleDepartmentChange}
          value={selectedDept}
        />
      </div>
      
      <h4>Select another manager for employees  </h4>
      {selectedDept && (
        <div className="select-container">
          <Select
            placeholder="Select Manager"
            options={managers}
            onChange={handleManagerChange}
            value={selectedManager}
          />
        </div>
      )}
      <button
        className="save-button"
        onClick={handleSave}
        disabled={isSaveDisabled}
      >
        Save
      </button>
      <button
        className="save-button"
        onClick={e =>setshowsingleman(false)}
        
      >
        Back
      </button>
    </div>
    </div>
    </div>
  );
};

export default SinglemanCredentials;
