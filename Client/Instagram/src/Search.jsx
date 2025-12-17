import React, { useEffect, useState } from 'react'
import './MainContents.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Search = ({closeSearch}) => {
    // let [input, setInput] = useState("");
    const [searchData, setSearchData] = useState([]);
    const [currentUser, setCurrentUser] = useState([]);
    let navigate = useNavigate();
    useEffect(()=>{
        try{
            const fetchData = async ()=>{
                let token = localStorage.getItem("Token");
                if(!token){
                    alert("Please Login First");
                    navigate('/')
                }
                const profile = await axios.get('http://localhost:4000/myProfile', {headers: {Authorization: token}})
                setCurrentUser(profile.data);
                console.log(profile.data);
            }
            fetchData();
        }
        catch(error){
            console.log(error);
        }
    },[])
    async function fun1(e){
        try{
            let data = await axios.post(`http://localhost:4000/search?q=${e.target.value}`);
            console.log(data.data.msg);
            if(!data.data.msg){
                setSearchData([])
            }
            else{
                setSearchData(data.data.msg);
            }
        }
        catch(error){
            console.log(error);
        }
    }
    const follow = async(id)=>{
        try{
            let token = localStorage.getItem("Token");
            let res = await axios.post(`http://localhost:4000/follow/${id}`, {}, {headers:{Authorization:token}});
            console.log(res.data.msg);
            if(res.status == 200){
                if(res.data.msg == "Followed"){
                    setCurrentUser({...currentUser,following: [...currentUser.following, id]})
                }
                else if(res.data.msg == "Unfollowed"){
                    setCurrentUser({
                        ...currentUser, following: currentUser.following.filter((a)=>{
                            return a != id;
                        })
                    })
                }
            }
            else{
                console.log(res.data.msg);
            }
        }
        catch(error){
            console.log(error);
        }
    }
    const isFollowing = (id)=>{
        return currentUser.following.some((x)=>{return x == id});
    }
  return (
    <div className='w-[25vw] fixed top-[0px] z-20 left-[0px] h-screen border border-[#FFFFFF7A] flex box-border flex-col items-center rounded-[8px] gap-[20px]'>
        <button className='w-[40px] h-[40px] text-[20px] rounded-[50%] border border-[#FFFFFF7A] self-end' onClick={closeSearch}>X</button>
        <div className='w-[80%] h-[50px]'>
            <input type="text" placeholder='Enter username to search' onChange={fun1} className='w-[100%] h-[100%] rounded-[8px] text-white text-[18px] border-[2px] pl-[5px] pr-[5px] box-border'/>
            {/* <button onClick={fun1} className='w-[100px] h-[50px] rounded-[8px] text-[18px] border-[2px] border-[#FFFFFF7A] box-border bg-[#800080]'>Search</button> */}
        </div>
        <div className={`w-[80%] h-max ${searchData.length > 0 ? 'border-[2px] border-[#FFFFFF7A] rounded-[8px]' : ''} flex justify-center gap-[20px] flex-col p-[5px]`}>
            {
                searchData.map((a)=>{
                    return(<div className='w-[100%] flex justify-between'>
                        <h3>{a.userName}</h3>
                        {
                            a._id != currentUser._id ? <button onClick={()=>follow(a._id)} className={`cursor-pointer w-[70px] h-[25px] rounded-[8px] ${isFollowing(a._id) ? 'bg-[#FFFFFF7A]' : 'bg-[#071AF2]'} `}>{isFollowing(a._id) ? "Unfollow" : "Follow"}</button> : null
                        }
                    </div>)
                })
            }
        </div>
    </div>
  )
}

export default Search