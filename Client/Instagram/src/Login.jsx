import React from 'react'
import landingImage from './assets/landing-2x.png'
import './Login.css'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'

const Login = () => {
    const [input, setInput] = useState({
        email:"",
        passWord:""
    })
    const navigate = useNavigate()
    function fun1(e){
        const {name, value} = e.target;
        setInput({...input,[name]:value})
    }
    async function fun2(){
        try{
            let res = await axios.post('http://localhost:4000/login',input);
            alert(res.data)
            console.log(res.status);
            if(res.status == 200){
                navigate('/home')
            }
        }
        catch(error){
            alert(error)
        }
    }
  return (
    <div className='main'>
        <div id="image">
            <img src={landingImage} alt="" />
        </div>
        <div className='fields'>
            <h1>Instagram</h1>
            <input type="email" name='email' value={input.email} onChange={fun1} placeholder='Enter your email'/>
            <input type="password" name='passWord' value={input.passWord} onChange={fun1} placeholder='Enter your password'/>
            <button onClick={fun2}>Login</button>
            <Link to={'/forget-password'}>
                <p>Forget Password</p>
            </Link>
            <p>Don't have an account? 
                <Link to={'/signup'}>
                    <button>SignUp</button>
                </Link>
            </p>
        </div>
    </div>
  )
}

export default Login