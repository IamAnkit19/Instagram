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
        <div id='forgetPass' style={{height:"400px"}}>
            <h2>Reset Password</h2>
            <input style={{width:"380px"}} type="password" name='newPassword' value={newPassword} onChange={fun1} placeholder='Enter new Password'/>
            <button onClick={fun2} id='btn'>Set Password</button>
        </div>
    </div>
  )
}

export default Reset