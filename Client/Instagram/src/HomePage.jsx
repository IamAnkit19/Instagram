import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import landingImage from './assets/landing-2x.png'
import { Heart, MessageCircle, Send } from 'lucide-react';
import user from './assets/user.png'
import { useNavigate } from 'react-router-dom';

const getCurrentUserId = ()=>{
  try{
    const token = localStorage.getItem("Token");
    if(!token) 
      return null;
    const currentUser = JSON.parse(atob(token.split('.')[1]));
    return currentUser._id;
  }
  catch(error){
    console.log(error);
  }
}

const HomePage = () => {
  let [apiData, setApiData] = useState([]);
  let [showComments, setShowComments] = useState(false);
  let [commentInp, setCommentInp] = useState([]);
  let [comments, setComments] = useState([]);
  const currentUser = getCurrentUserId();
  let navigate = useNavigate();
  // console.log(currentUser);
  useEffect(()=>{
    const fun1= async()=>{
      try{
        let token = localStorage.getItem("Token");
        if(!token){
          alert("Please Login First");
          navigate('/')
        }
        const data = await axios.get('http://localhost:4000/posts',{headers:{"Authorization":`${token}`}})
        console.log(data.data);
        
        // setApiData([...apiData,data.data[0]]);
        setApiData(data.data);
      }
      catch(error){
        console.log(error);
        alert("Error fetching post data...")
      }
    }
    fun1();
    // console.log(apiData);
  },[])

  async function like(a){
    try{
      // let id = a._id;
      // console.log(a._id);
      let token = localStorage.getItem("Token");
      if(!token){
        alert("Please Login First");
        navigate('/')
      }
      // console.log(token);
      // axios.post(url, data, config)  So in the below code the empty body as second argument is required.
      let data = await axios.post(`http://localhost:4000/like/${a._id}`,{},{headers:{"Authorization":`${token}`}});
      console.log(data.data);
      console.log(data.data.message);
      setApiData((prev)=>{
        return prev.map((x)=>{
          if(x._id == a._id){
            if(data.data.message == "Liked"){
              return {
                ...x,
                likesCount: data.data.likesCount,
                likedBy: [...x.likedBy, currentUser]
              }
            }
            else if(data.data.message == "Disliked"){
              const likedBy = x.likedBy.filter((a)=>{
                return a != currentUser;
              })
              return {
                ...x,
                likesCount: data.data.likesCount,
                likedBy: likedBy
              }
            }
          }
          return x;
          // return x._id == a._id ? {...x, likesCount: data.data.likesCount, likedBy: a._id} : x
          // console.log(x);
        })
      })
    }
    catch(error){
      console.log(error);
    }
  }

  const isLiked = (a)=>{
    return a.likedBy.indexOf(currentUser) != -1;
  }

  const getComments = async(id)=>{
    try{
      let token = localStorage.getItem("Token");
      if(!token){
        alert("Please Login First");
        navigate('/')
      }
      let data = await axios.get(`http://localhost:4000/getComments/${id}`, {headers:{Authorization: token}});
      console.log(data.data);
      setComments(data.data);
    }
    catch(error){
      console.log(error);
    }
  }

  const deleteComment = async(id, postId)=>{
    try{
      let token = localStorage.getItem("Token");
      if(!token){
        alert("Please Login First");
        navigate('/')
      }
      let res = await axios.post(`http://localhost:4000/deleteComment/${id}`, {}, {headers:{Authorization:token}});
      console.log(res.data);
      getComments(postId);
      if(res.status == 200){
        setApiData((prev)=>{
          return prev.map((a)=>{
            if(a._id == postId){
              return {
                ...a,
                comments: a.comments.filter((x)=>{
                  return x.toString() !== id.toString();
                })
              }
            }
            return a;
          })
        })
      }
    }
    catch(error){
      console.log(error);
    }
  }

  const postComment = async(id)=>{
    try{
      let token = localStorage.getItem("Token");
      if(!token){
        alert("Please Login First");
        navigate('/')
      }
      let res = await axios.post(`http://localhost:4000/comment/${id}`,{text: commentInp[id]}, {headers:{Authorization:token}});
      console.log(res.data);
      setCommentInp("");
      if(res.status == 201){
        setApiData((prev)=>{
          return prev.map((a)=>{
            if(a._id == id){
              return {
                ...a,
                comments: [...a.comments, id]
              }
            }
            return a;
          })
        })
      }
    }
    catch(error){
      console.log(error);
    }
  }
  return (
    <div className='w-[100%] flex justify-center items-center flex-col'>
      {/* Stories */}
      <div className="w-[100%] h-[100px] flex justify-center items-center">
        <div className='h-[100%] flex items-center gap-[20px]'>
          <div>
            <img src={user} style={{background:"white",width:"80px",borderRadius:"50%"}} alt="" />
          </div>
          <div>
            <img src={user} style={{background:"white",width:"80px",borderRadius:"50%"}} alt="" />
          </div>
          <div>
            <img src={user} style={{background:"white",width:"80px",borderRadius:"50%"}} alt="" />
          </div>
          <div>
            <img src={user} style={{background:"white",width:"80px",borderRadius:"50%"}} alt="" />
          </div>
          <div>
            <img src={user} style={{background:"white",width:"80px",borderRadius:"50%"}} alt="" />
          </div>
        </div>
      </div>
      {/* Posts */}
      <div className='w-[100%] min-h-screen border border-[#FFFFFF7A] flex flex-col items-center gap-[20px] box-border'>
        {
          apiData.map((a,b)=>{
            return(
              <div className="w-[400px] flex flex-col justify-between">
                <div className='h-[40px] flex items-center gap-[10px] p-[5px]'>
                  <img src={a.user.dp} alt="img" className='w-[40px] h-[40px] rounded-[50%]'/>
                  <h3>{a.user.userName}</h3>
                </div>
                <img src={a.imgUrl} className='w-[100%] h-[80%] border border-[#FFFFFF7A]' alt="img" />
                <div className="flex justify-around items-center">
                  <div className='flex items-center gap-[2px]'>
                    <p className='cursor-pointer' onClick={()=>{like(a)}}><Heart fill={isLiked(a) ? 'red' : 'none'} color={isLiked(a) ? 'red' : 'white'}/></p>
                    <p>{a.likesCount}</p>
                  </div>
                  <div className='flex items-center gap-[2px]'>
                    <p className='cursor-pointer' onClick={()=>{getComments(a._id), setShowComments(true)}}><MessageCircle/></p>
                    <p>{a.comments.length}</p>
                  </div>
                  <div className='flex items-center gap-[2px]'>
                    <p className='cursor-pointer' onClick={()=>share(a)}><Send/></p>
                    <p>0</p>
                  </div>
                </div>
                <div>
                  <p><b>{a.user.userName}</b> Caption</p>
                </div>
                <div className='w-[100%] h-[30px] flex justify-between items-center'>
                  <input type="text" placeholder='Add A Comment' className='w-[80%] h-[100%] border-none text-[16px] outline-none' name={`commentInp-${a._id}`} value={commentInp[a._id] || ""} onChange={(e)=>setCommentInp((prev)=>({...prev, [a._id]: e.target.value}))}/>
                  <button className='border-none cursor-pointer text-[16px] text-[#071AF2]' onClick={()=>postComment(a._id)}>Post</button>
                </div>
              </div>)
          })
        }
        {
          showComments ? 
          <div className='w-[400px] fixed h-[400px] border top-1/2 left-[58%] -translate-x-1/2 -translate-y-1/2 rounded-[8px] flex flex-col items-center overflow-y-auto'>
            <p className='border-[2px] border-[#FFFFFF7A] rounded-[50%] w-[20px] h-[20px] self-end flex justify-center items-center cursor-pointer' onClick={()=>{setComments([]), setShowComments(false)}}>X</p>
            <h3 className='justify-self-center'>Comments</h3>
            <div className='w-[90%] flex flex-col gap-[20px] flex-wrap'>
              {
                comments.map((a)=>{
                  return (
                    <div className='flex justify-between w-[100%]'>
                      <div className='flex items-center gap-[5px]'>
                        <img src={a.userId.dp} alt="" className='w-[25px] rounded-[50%]' />
                        <p><b>{a.userId.userName}:</b> {a.text}</p>
                      </div>
                      {
                        currentUser == a.userId._id ? <button className='w-[50px] p-[2px] h-max bg-[#0F20D9] rounded-[8px] cursor-pointer' onClick={()=>{deleteComment(a._id, a.postId)}}>Delete</button>
                        : null
                      }
                      
                    </div>
                  )
                })
              }
            </div>
          </div>
          : null
        }
      </div>
    </div>
  )
}

export default HomePage