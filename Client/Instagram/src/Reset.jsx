import React from 'react'
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const Reset = () => {
    const [newPassword, setNewPassword] = useState("")
    let  parameter = useParams()
    let token = parameter.token
    console.log(token);
  
    function fun1(e){
        setNewPassword(e.target.value)
    }
    async function fun2(){
        try{
            let res = await axios.post(`http://localhost:4000/reset-password/${token}`,{newPassword});
            alert(res.data)
        }
        catch(error){
            alert(error)
            console.log(error);
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
            <h2>Reset Password</h2>
            <input className='w-[380px] h-[45px] border border-[#FFFFFF7A] text-white pl-[2px] rounded-[6px] bg-[252525] text-[14px]' type="password" name='newPassword' value={newPassword} onChange={fun1} placeholder='Enter new Password'/>
            <button onClick={fun2} className='w-[90%] h-[30px] bg-[#1D00FF] text-[17px] rounded-6px]'>Set Password</button>
        </div>
    </div>
  )
}

export default Reset