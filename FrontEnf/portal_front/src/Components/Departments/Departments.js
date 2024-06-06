import React , {useState , useEffect} from 'react';
import Select from 'react-select'
import './Departments.css'
function Departments({selecteddept , setselecteddept}){
const [dept , setdept] = useState([])
// const [selecteddept , setselecteddept] = useState("")
useEffect(() => {
  const fetchdata = async () => {

const response = await fetch('http://localhost:8000/getDepartments');
const data = await response.json();
const opt = [
  {
    label : "Select a department",
    value : " "
  }
]

data.forEach((value) => {
  opt.push({
    label: value.department,
    value: value.id
  })
})
setdept(opt);

  };
fetchdata();
},[])


// const handleChange = (event) => {
//   setselecteddept(event.target.value);
//   console.log(selecteddept)
// }

const customStyles = {
  control: (baseStyles, state) => ({
    ...baseStyles,
    backgroundColor: "#e2e2e2",
  }),
  option: (baseStyles, state) => ({
    ...baseStyles,
    backgroundColor: state.isFocused ? "#e2e2e2" : "",
    color: state.isFocused ? "#333333" : "#FFFFFF",
  }),
  menu: (baseStyles, state) => ({
    ...baseStyles,
    backgroundColor: "#333333",
  }),
}
// return (
//   <div>
//     <Select className='selectDept' options={dept} styles ={customStyles} isSearchable/>
//   </div>
// )











// const dept =[{value:'Hr' , label : "Hr"},
//   {value :'Pr' , label : "Pr"},
//   {value : 'management' , label : "Management"}
// ]
return (
  <div className='select-container'>
    <Select defaultValue={selecteddept} onChange ={option => setselecteddept(option.value)} className='selectDept' options={dept} styles ={customStyles} placeholder = "Select a department" isSearchable/>
  </div>
)



// return (
//   <div>
//     <select value={selecteddept} onChange = {handleChange}>
//     <option value="selected">Choose a dept</option>
//     {dept.map(d => (
//      <option value ={d.department} key= {d.id}>{d.department}</option>
//its working fine
//     ))}
//     </select>
//   </div>
// )





}
export default Departments;
