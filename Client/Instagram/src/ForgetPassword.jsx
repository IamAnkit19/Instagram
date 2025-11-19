import React from 'react'
import './ForgetPassword.css'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'

const ForgetPassword = () => {
    const [email, setEmail] = useState("");
    async function fun2(){
        try{
            let res = await axios.post('http://localhost:4000/reset-password',{email});
            alert(res.data)
        }
        catch(error){
            alert(error)
        }
    }
  return (
    <div id='forgetDiv'>
        <nav id='forgetNav'>
            <h2>Instagram</h2>
            <div>
                <Link to={'/signup'}>
                    <button id='forgetSignup'>SignUp</button>
                </Link>
                <Link to={'/'}>
                    <button id='forgetLogin'>Login</button>
                </Link>
            </div>
        </nav>
        <div id='forgetPass'>
            <p style={{fontSize:"19px"}}>If you have forget your password then enter your email and we will send you a link to reset your password</p>
            <input type="email" name='email' value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='Enter your email'/>
            <button onClick={fun2}>Send Reset Link</button>
            <p>- - - - - - - - - - - OR - - - - - - - - - - -</p>
            <Link to={'/signup'} style={{width:"90%"}}>
                <button style={{width:"100%"}}>Create a new account</button>
            </Link>
        </div>
    </div>
  )
}

export default ForgetPassword