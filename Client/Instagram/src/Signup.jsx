import React, { useState } from 'react'
import landingImage from './assets/landing-2x.png'
import './Login.css'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Signup = () => {
    const [input, setInput] = useState({
        name:"",
        userName:"",
        email:"",
        passWord:""
    })
    const navigate = useNavigate();
    function fun1(e){
        const {name, value} = e.target;
        setInput({...input,[name]:value})
    }
    async function fun2(){
        try{
            let res = await axios.post('http://localhost:4000/create',input);
            alert(res.data)
            if(res.status == 200){
                navigate('/');
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
            <input type="text" name='name' value={input.name} onChange={fun1} placeholder='Enter your full name'/>
            <input type="text" name='userName' value={input.userName} onChange={fun1} placeholder='Create your username'/>
            <input type="email" name='email' value={input.email} onChange={fun1} placeholder='Enter your email'/>
            <input type="password" name='passWord' value={input.passWord} onChange={fun1} placeholder='Create your password'/>
            <button onClick={fun2}>SignUp</button>
            <p>Already have an account? 
                <Link to={'/'}>
                    <button>Login</button>
                </Link>
            </p>
        </div>
    </div>
  )
}

export default Signup