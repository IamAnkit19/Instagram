import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import landingImage from './assets/landing-2x.png'
import { Heart, MessageCircle, Send } from 'lucide-react';
import user from './assets/user.png'
import { useNavigate } from 'react-router-dom';
import plus from './assets/plus.png'
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://xnenqbetuufqkuxzwvvy.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhuZW5xYmV0dXVmcWt1eHp3dnZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2OTgwNjYsImV4cCI6MjA3OTI3NDA2Nn0.aDiz6CDIMxvLn76hnxAifd0t7saqpuk9RM5OdkOmS5M'
const supabase = createClient(supabaseUrl, supabaseKey)

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
  let [uploadStory, setUploadStory] = useState(false);
  let [viewStory, setViewStory] = useState(false);
  let [commentInp, setCommentInp] = useState([]);
  let [comments, setComments] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);
  const [stories, setStories] = useState([]);
  const [story, setStory] = useState(null);
  const [currentStory, setCurrentStory] = useState(null);
  const currentUserId = getCurrentUserId();
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

    getStories(currentUserId);
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
                likedBy: [...x.likedBy, currentUserId]
              }
            }
            else if(data.data.message == "Disliked"){
              const likedBy = x.likedBy.filter((a)=>{
                return a != currentUserId;
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
    return a.likedBy.indexOf(currentUserId) != -1;
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

  const follow = async(id)=>{
    try{
      let token = localStorage.getItem("Token");
      if(!token){
        alert("Please Login First");
        navigate('/')
      }
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

  const getStories = async(id)=>{
    try{
      let token = localStorage.getItem("Token");
      if(!token){
        alert("Please Login First");
        navigate('/')
      }
      let res = await axios.get('http://localhost:4000/stories', {headers: {Authorization: token}});
      console.log(res.data);
      if(res.status == 200){
        setStories(res.data);
      }
      else{
        console.log("Error fetching stories");
      }
    }
    catch(error){
      console.log(error);
    }

    setCurrentStory(stories[0]);
  }
  function handleChange(e){
    console.log(e.target.files[0]);
    setStory(e.target.files[0]);
  }

  async function send(){
    if(!story){
      alert("Please select an image!")
      return;
    }
    try{
      const {data, error} = await supabase.storage.from("insta").upload("insta_images/" + story.name, story, {upsert: true});
      if(error) throw error;
      const mediaUrl = `${supabaseUrl}/storage/v1/object/public/insta/insta_images/${story.name}`;
      console.log("Image URL:", mediaUrl);
      let token = localStorage.getItem("Token");
      let res = await axios.post('http://localhost:4000/story',{mediaUrl},{headers:{Authorization:token}});
      console.log(res.data);
      setStory(null);
      getStories(currentUserId)
    }
    catch(error){
      alert(error)
    }
  }

  const viewCurrentStory = (id)=>{
    setCurrentStory(stories.find((a)=>{
      return a._id == id;
    }))
    setViewStory(true);
    setTimeout(()=>{
      setViewStory(false);
      setCurrentStory(null);
    },5000)
  }
  return (
    <div className='w-[100%] flex justify-center items-center flex-col'>
      {/* Stories */}
      <div className="w-[100%] h-[150px] flex justify-center items-center">
        <div className='h-[100%] flex items-center gap-[20px]'>
          <div className='flex justify-center items-center flex-col' onClick={()=>setUploadStory(true)}>
            <div className='w-[80px] h-[80px] rounded-[50%] overflow-hidden flex justify-center items-center'>
              <img src={plus} style={{background:"white",width:"160px",borderRadius:"50%"}} alt="" />
            </div>
            {/* <button className='w-[70px] h-[25px] bg-[#071AF2] rounded-[8px]'>Upload</button> */}
            <p><b>Upload Story</b></p>
          </div>
          <div className='flex justify-center items-center gap-[20px]'>
            {
              stories.map((a)=>{
                return (
                  <div className='w-[80px]' onClick={()=>viewCurrentStory(a._id)}>
                    <img src={a.user.dp} alt="" className='w-[100%] rounded-[50%]'/>
                    <p><b>{a.user.name}</b></p>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
      {/* Posts */}
      <div className='w-[100%] min-h-screen border border-[#FFFFFF7A] flex flex-col items-center gap-[20px] box-border'>
        {
          apiData.map((a,b)=>{
            return(
              <div className="w-[400px] flex flex-col justify-between">
                <div className='flex justify-between items-center'>
                  <div className='h-[40px] flex items-center gap-[10px] p-[5px]'>
                    <img src={a.user.dp} alt="img" className='w-[40px] h-[40px] rounded-[50%]'/>
                    <h3>{a.user.userName}</h3>
                  </div>
                  {
                    isFollowing(a.user._id) || currentUserId == a.user._id ? null
                    : 
                    <div className='h-[40px] flex justify-center items-center'>
                      <button className='w-[70px] h-[25px] rounded-[8px] bg-[#0F20D9] cursor-pointer' onClick={()=>follow(a.user._id)}>Follow</button>
                    </div>
                  }
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
                        currentUserId == a.userId._id ? <button className='w-[50px] p-[2px] h-max bg-[#0F20D9] rounded-[8px] cursor-pointer' onClick={()=>{deleteComment(a._id, a.postId)}}>Delete</button>
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
        {
          uploadStory ? 
          <div className='w-[400px] fixed h-[400px] border top-1/2 left-[58%] -translate-x-1/2 -translate-y-1/2 rounded-[8px] flex flex-col items-center overflow-y-auto'>
            <p className='border-[2px] border-[#FFFFFF7A] rounded-[50%] w-[20px] h-[20px] self-end flex justify-center items-center cursor-pointer' onClick={()=>{setStory(null), setUploadStory(false)}}>X</p>
            <h3 className='justify-self-center'>Upload Story</h3>
            <div className='h-[90%] w-[80%] flex justify-evenly items-center flex-col'>
              <label htmlFor="uploadStory">
                {
                  story ? 
                  <div>
                    <p><b className='text-[#005DFF] cursor-pointer'>Select Another Image</b></p>
                  </div>
                  :
                  <div>
                    <p><b className='text-[#005DFF] cursor-pointer'>Select An Image</b></p>
                  </div>
                }
                <input id='uploadStory' type="file" onChange={handleChange} className='hidden'/>
              </label>
              {
                story ? 
                <div className='w-[95%] max-h-[80%]'>
                  <img src={URL.createObjectURL(story)} className='object-contain w-full max-h-full' alt="" />
                </div> 
                : null
              }
              {
                story ?
                <button onClick={send} className='w-[100px] bg-[#005DFF] rounded-[8px] h-[25px] cursor-pointer'>Upload</button>
                : null
              }
            </div>
          </div>
          : null
        }
        {
          viewStory ? 
          <div className='w-[500px] fixed h-[600px] border top-1/2 left-[58%] -translate-x-1/2 -translate-y-1/2 rounded-[8px] flex flex-col items-center overflow-y-auto'>
            <p className='border-[2px] border-[#FFFFFF7A] rounded-[50%] w-[20px] h-[20px] self-end flex justify-center items-center cursor-pointer' onClick={()=>{setViewStory(false), setCurrentStory(null)}}>X</p>
            <div className='h-[calc(95%-20px)] w-[80%] flex justify-between items-center flex-col'>
              <div className='w-[100%] flex justify-center items-center gap-[10px]'>
                <img src={currentStory.user.dp} alt="" className='w-[40px] rounded-[50%]'/>
                <p><b>{currentStory.user.name}</b></p>
              </div>
              <div className='w-[100%] h-[90%] flex justify-center items-center'>
                <img src={currentStory.mediaUrl} className='object-contain w-full max-h-full' alt="" />
              </div>
            </div>
          </div>
          : null
        }
      </div>
    </div>
  )
}

export default HomePage