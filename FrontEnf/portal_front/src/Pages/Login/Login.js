import React, {useState} from 'react';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import './Login.css'
 function Login  () {
    let navigate = useNavigate();
    
    const [username , setusername] = useState('');
    const [pass , setpass] = useState('');
    
    const Login =async (e) =>{

      if(username ===''){
        alert("provide valid username !");
        setpass('');
      }
      else if(pass === ''){
        alert("No password provided !! ");
        setusername('');
      }

      else {
      e.preventDefault();
      const data  = new FormData();
      
      data.append("username" , username);
      data.append("password" , pass.toString());
      try{
        const response = await fetch("http://localhost:8000/login",{
          method:"POST",
          body :data,
        });
        if(!response.ok){
          alert(response.status);
        }
        
        const result = await response.json();
        // alert(result.position);
        
        if(result.pID === 1)
        navigate('/EmployeeHome' ,{state :result});
      else if(result.pID === 2)
        navigate('/ManagerHome',{state :result})
      else if(result.pID ===3)
        navigate('/AdminHome',{state :result})
      
      else{
        alert(result.detail );
        setusername('');
        setpass('');
      }
      }catch (error){
        alert(error);
      }
    }
    }
    
    
    return (
        <div className='Screen'>
          <div className='Input-fields'>
          <div className='login'>
                <p>Login</p>
                {/* <span className='Register'>Register</span> */}
            </div>
          <form     >
           <div  className='Username-login'>
            <input type='text' placeholder='Enter Username'   onInput={(e)=>setusername(e.target.value)} value={username} id='user-name-login' defaultValue={username}/>
            <style> 
                {` 
                    ::placeholder { 
                        color: #c2bebe; 
                    }` 
                } 
            </style> 
           </div>
         <div  className='Pass'>
            <input type='password'placeholder='Enter Password'   id='pass' onChange={(e) =>setpass(e.target.value)}  value={pass}/>
    
         </div>
                  <div className='Register' >
         <button class="login-button" onClick={Login}>
                        <span class="button__text">Login</span>
                        <i class="button__icon fas fa-chevron-right"></i>
                    </button>	
                 </div>
         <div className='Loginredirect'>
            
         </div>
         </form>
         <div className='Login-redirect'>
          <span>Not Registered , go to</span>
          <Link to={"/Register"}>Registration</Link>
         </div>
         </div>
        </div>
      );
    
    
    
    


};
export default Login;
