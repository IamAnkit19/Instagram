import React from 'react'
import landingImage from './assets/landing-2x.png'
import './Login.css'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'

const API_BASE_URL = "https://instagram-2-ql2f.onrender.com";

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
            let res = await axios.post(`${API_BASE_URL}/login`,input);
            // alert(res.data)
            console.log(res.status);
            if(res.status == 200){
                localStorage.setItem("Token",res.data);
                navigate('/home')
            }
        }
        catch(error){
            alert(error)
        }
    }
  return (
    <div className='w-screen h-screen flex justify-center items-center'>
        <div id="image">
            <img src={landingImage} alt="" />
        </div>
        <div className='h-[70vh] w-[300px] flex justify-evenly items-center flex-col'>
            <h1 className='font-[cursive]'>Instagram</h1>
            <input type="email" name='email' value={input.email} onChange={fun1} placeholder='Enter your email' className='w-[90%] h-[45px] border border-[#FFFFFF7A] rounded-[6px] pl-[2px] text-white bg-[#252525] text-[14px]'/>
            <input type="password" name='passWord' value={input.passWord} onChange={fun1} placeholder='Enter your password' className='w-[90%] h-[45px] border border-[#FFFFFF7A] rounded-[6px] pl-[2px] text-white bg-[#252525] text-[14px]'/>
            <button onClick={fun2} className='w-[90%] h-[30px] bg-[#1D00FF] text-[17px] rounded-[6px]'>Login</button>
            <Link to={'/forget-password'}>
                <p className='flex justify-center items-center text-[15px]'>Forget Password</p>
            </Link>
            <p className='flex justify-center items-center text-[15px]'>Don't have an account? 
                <Link to={'/signup'}>
                    <button className='w-[60px] text-[#1D00FF] text-[16px] border-none cursor-pointer hover:underline'>SignUp</button>
                </Link>
            </p>
        </div>
    </div>
  )
}

export default Login