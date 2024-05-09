import './login_signup.css'
import logo from '../assets/nucleusteq_logo.jpg';

export default function Login_Signup(){
    return (
        
        <div className = "container">
            <div className ="logo">
                <img src = {logo} alt="logo" className="logo_icon" />
            </div>
        <div className = "screen">
            <div className = "background">
                <div className = "login_page">
                    <div className ="credentials">
                    <div className='userinput' >
                    <input type="username" id="login-username" name="pass" required class='login-form-user' placeholder ="Username"/>
                    </div>
                    <div className='passinput' >
                    <input type="password" id="login-password" name="pass" required class='login-form-password' placeholder ="password"/>
                    </div>
                    </div>

                </div>

            </div>

        </div>
        </div>
    )
}