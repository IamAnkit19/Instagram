import React, { useState } from 'react'
import landingImage from './assets/landing-2x.png'
import './Login.css'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_BASE_URL = "https://instagram-2-ql2f.onrender.com";

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
            let res = await axios.post(`${API_BASE_URL}/create`,input);
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
    <div className='w-screen h-screen flex justify-center items-center'>
        <div id="image">
            <img src={landingImage} alt="" />
        </div>
        <div className='h-[70vh] w-[300px] flex justify-evenly items-center flex-col'>
            <h1 className='font-[cursive]'>Instagram</h1>
            <input type="text" name='name' value={input.name} onChange={fun1} placeholder='Enter your full name' className='w-[90%] h-[45px] border border-gray-600 rounded-[6px] pl-[2px] text-white bg-[#252525] text-[14px]'/>
            <input type="text" name='userName' value={input.userName} onChange={fun1} placeholder='Create your username' className='w-[90%] h-[45px] border border-gray-600 rounded-[6px] pl-[2px] text-white bg-[#252525] text-[14px]'/>
            <input type="email" name='email' value={input.email} onChange={fun1} placeholder='Enter your email' className='w-[90%] h-[45px] border border-gray-600 rounded-[6px] pl-[2px] text-white bg-[#252525] text-[14px]'/>
            <input type="password" name='passWord' value={input.passWord} onChange={fun1} placeholder='Create your password' className='w-[90%] h-[45px] border border-gray-600 rounded-[6px] pl-[2px] text-white bg-[#252525] text-[14px]'/>
            <button onClick={fun2} className='w-[90%] h-[30px] bg-[#3827F5] text-[17px] rounded-[6px]'>SignUp</button>
            <p className='flex justify-center items-center text-[15px]'>Already have an account? 
                <Link to={'/'}>
                    <button className='w-[60px] text-[#3827F5] text-[16px] border-none cursor-pointer hover:underline'>Login</button>
                </Link>
            </p>
        </div>
    </div>
  )
}

export default Signup