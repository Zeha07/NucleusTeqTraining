import './login_signup.css'
import logo from '../assets/nucleusteq_logo.jpg';
import React , {useState} from 'react';
import axios from 'axios';

const baseUrl = "http://127.0.0.1:8000/trial"

export default function Login_Signup(){
    const [username , setusername] = useState('');
    const [password,setpassword] = useState('');
    const [result , setresult] = useState('');
    const handleUsername = (event) =>{
        setusername(event.target.value);
    };
const handlePassword = (event) => {
    setpassword(event.target.value);
};
const handleLogin = (event) =>{
    const key = username;
    event.preventDefault();
    console.log('Username' , username);
    console.log('Password' , password);

    axios.post(baseUrl ,key ).then((response)=> {
        console.log(response.status , response.data.data);
    });
};



    return (
        
        <div className = "container">
            <div className ="logo">
                <img src = {logo} alt="logo" className="logo_icon" />
            </div>
        <div className = "screen">
            <div className="Sign-In">
             <button type="submit" id="Signup-button">Sign-In</button>
            </div>
            <div className = "background">
                <div className = "login_page">
                    <div className ="credentials">
                    <div className='userinput' >
                    <input type="username" value={username} onChange = {handleUsername} id="login-username" name="pass" required class='login-form-user' placeholder ="Username"/>
                    </div>
                    <div className='passinput' >
                    <input type="password" value={password} onChange ={handlePassword} id="login-password" name="pass" required class='login-form-password' placeholder ="password"/>
                    </div>
                    </div>
                    <div className = "Buttons">
                    <button type='submit' onClick ={handleLogin} className='login-submit'>Login</button>
                    </div>

                </div>

            </div>

        </div>
        </div>
    )

}