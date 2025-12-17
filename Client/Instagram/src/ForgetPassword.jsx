import React from 'react'
import './ForgetPassword.css'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'

const API_BASE_URL = "https://instagram-2-ql2f.onrender.com";

const ForgetPassword = () => {
    const [email, setEmail] = useState("");
    async function fun2(){
        try{
            let res = await axios.post(`${API_BASE_URL}/reset-password`,{email});
            alert(res.data)
        }
        catch(error){
            alert(error)
        }
    }
  return (
    <div className='w-screen h-screen flex justify-center items-center flex-col'>
        <nav className='w-screen h-[50px] border border-[#FFFFFF7A] flex justify-around items-center box-border'>
            <h2 className='font-[cursive]'>Instagram</h2>
            <div>
                <Link to={'/signup'}>
                    <button className='bg-[#1D00FF] h-[30px] text-[16px] p-[2px] rounded-[8px] cursor-pointer'>SignUp</button>
                </Link>
                <Link to={'/'}>
                    <button className='w-[60px] border-none text-[#1D00FF] cursor-pointer text-[16px]'>Login</button>
                </Link>
            </div>
        </nav>
        <div className='m-auto w-[400px] h-[70vh] border border-[#FFFFFF7A] box-border flex justify-evenly items-center flex-col rounded-[8px]'>
            <p className='text-[19px] text-center'>If you have forget your password then enter your email and we will send you a link to reset your password</p>
            <input type="email" name='email' value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='Enter your email' className='w-[90%] h-[45px] border border-[#FFFFFF7A] text-white pl-[2px] rounded-[6px] bg-[252525] text-[14px]'/>
            <button onClick={fun2} className='w-[90%] h-[30px] bg-[#1D00FF] text-[17px] rounded-6px]'>Send Reset Link</button>
            <p className='text-center'>- - - - - - - - - - - OR - - - - - - - - - - -</p>
            <Link to={'/signup'} className='w-[90%]'>
                <button className='w-[100%] h-[30px] bg-[#1D00FF] text-[17px] rounded-6px]'>Create a new account</button>
            </Link>
        </div>
    </div>
  )
}

export default ForgetPassword