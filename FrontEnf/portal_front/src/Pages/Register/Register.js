import React from 'react'
import  {useState} from 'react'
import Select from 'react-select'
import './Register.css'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Login from '../Login/Login.js';
import { useNavigate } from 'react-router-dom'
import Department from '../../Components/Departments/Departments.js'


export default function Register(){

    const positions = [
          { value: 1, label: 'employee' },
          { value: 2, label: 'manager' },
          { value: 3, label: 'admin' },
        ];

    
   
    const [formdata , setformdata] = useState({
      "position" :0 ,
      "department" : 0,
      "usermail" : "",
      "password" : "",
      "username" : ""
    })
   
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


 

    
const [selecteddept , setselecteddept] = useState();
const [p , setp] = useState()
const [email , setemail] = useState('')
const [error , seterror] = useState('')



  const handleInputChange = (event) =>{
    setformdata({
      ...formdata ,
      [event.target.name] : event.target.value,
    })
  }  
const validateEmail = (event) => {

seterror('')

const domain = email.split('@')[1]
if(domain !== 'nucleusteq.com'){
  seterror('Only organisational emails are accepted')
alert("Invalid email !!!");
setemail('');
seterror('')
}
else {
  setformdata({
    ...formdata ,
    "usermail" : email,
  });
}

}
let navigate = useNavigate();
  const handleformsubmit = async (event) =>{
    event.preventDefault();
    const data = new FormData();
    data.append("position" , p);
    data.append("department" , selecteddept)
    data.append("usermail" , formdata.usermail);
    data.append("password" , formdata.password);
    data.append("username" , formdata.username);
    console.log(data);
    try{
      const response = await fetch("http://localhost:8000/register",{
        method:"POST",
        body :data,
      });
      if(!response.ok){
        throw new Error("network error");
      }
      const result = await response.json();
      alert("Registered successfully");
      navigate('/')
    }catch (error){
      alert(error.response.data.detail || "Error while Registering")
      console.log(error);
    }
  };
    
  return (


    <div className='Screen'>
      <style> 
                {` 
                    ::placeholder { 
                        color: #c2bebe; 
                    }` 
                } 
            </style> 


      <div className='Input-fields'>


         <div className='register'>
         
              <p>Register</p>

        </div>
        
        <form   onSubmit={handleformsubmit}   >
       
              <div className='Selectpost'>
              <Select id='Select-post'   defaultValue={formdata.position}
        onChange={option => setp(option.value)}  styles={customStyles}
        options={positions}
        placeholder = "Select a position"
        className="react-select-container"
        classNamePrefix="react-select"          />

         </div>


      <div className='Selectdept' >
          
          <Department  selecteddept = {selecteddept} setselecteddept = {setselecteddept}  />
     
     </div>
     
     <div  className='Usermail'>
      
       <input type='email' id='user-mail' placeholder='Enter organisation email'  onChange ={e =>setemail(e.target.value)}  onBlur={validateEmail}  defaultValue = {email}  name='usermail' value={email}  />
       
       {error && <p style = {{color : 'red'}}>{error}</p>}
      </div>
     
     <div  className='Pass'>

        <input type='password' id='pass' placeholder='Set a password'  name='password' onChange={handleInputChange} defaultValue={formdata.password}/>

     </div>

     <div className='Username'>

       <input type='text'id='user-name' name='username' placeholder='enter a username' onChange={handleInputChange} defaultValue={formdata.username}/>

     </div>

     <div className='Register' >

     <button type= "submit" class="Registerbutton" >

					<span class="button__text">Register</span>

					<i class="button__icon fas fa-chevron-right"></i>

				</button>	

             </div>


     <div className='Loginredirect'>
        
     </div>

     </form>


     <div className='Login-redirect'>

      <span>Already Registered , go to</span>

      <Link to={"/"}>Login Page</Link>

     </div>



     </div>

    </div>


);




}


{/* <Select className='Select-dept'
          defaultValue={department}
          onChange={setdepartment}
          options={departments}
          placeholder = "Select a department"
        />
        */}





         // Email verification and handelling
    // const[usermail , setusermail] = useState("");
    // const isEmail = (usermail) => /^[A-Z0-9._%+-]+@[nucleusTeq]+\.[com]$/i.test(usermail);
    // const [errors , setErrors] = useState({})
    // const validateEmail =(event) => {
    //   event.preventDefault();
    //   setusermail(event.target.value);
    //   const errors ={};
    //   if(!isEmail(usermail.email)) {
    //     errors.email = "Wrong email"
    //   }
    //   setErrors(errors);
    //   if(!Object.keys(errors).length){
    //     alert(JSON.stringify(usermail ,null , 2 ));

    //   }

    // };
  //  const [emailErr ,setemailErr] = useState(false);

  //   const validEmail = new RegExp('(^[a-zA-Z0-9._:$!%-]+)(@[nu])(.)([com])$');
  //   const validate =(event) =>{
  //     setusermail(event.target.value)
  //     if(!validEmail.test(usermail)){
  //       setemailErr(true);
  //     }
  //   }
    



// email handeling
    
    

  //   let navigate = useNavigate();
  // const logout= () =>{
  //   let path = '/'
  //   navigate(path )
  // }

  // axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';

  
  // const handleSubmit = async(e) =>{
  //   e.preventDefault();
  //    formdata.position = position;
  //   formdata.department = selecteddept;
  //   formdata.usermail = usermail;
  //   formdata.password = password;
  //   formdata.username = username;
    
  //   axios.post("http://localhost:8000/register", formdata, {
  //     headers: {
  //     "Content-type": "multipart/form-date",
  // },
  // }).then(res =>{
  //   console.log(res)
  // })
  // .catch(err =>{
  //   console.log(err)
  // })





    //  try{
    //   let res = await fetch ("http://localhost:8000/register",{
    //     method : "POST",
    //     headers: {
    //           "Content-type": "multipart/form-date",
    //       },
    //    body:{
    //     "position" : position,
    //     "department" :selecteddept,
    //     "usermail" : usermail,
    //     "password" :password,
    //     "username" : username

    //    },
    //   });
    //   let resJson = await res.json();
    //   {
    //     console.log(resJson);
    //   }
      
    //  }
    //  catch(err){
    //   console.log(err);
    //  }
   
    // console.log("data received");
    // console.log(formdata.position);
    // console.log(formdata.department);
    // console.log(formdata.usermail);
    // console.log(formdata.password);
    // console.log(formdata.username);

  // }


  // const [emailErr, setEmailErr] = useState(false);

    // const validate = (event) => {
    //   const email = event.target.value;
    //   const regexemail = '^[A-Za-z0-9._%+-]@[nucleusteq][.][com]';
    //   setusermail(email);
    // if(setEmailErr(regexemail.test(email))){
    //   <span>Please enter a valid email address</span>
    // }
    // }