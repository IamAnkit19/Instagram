import React from 'react'
import { createClient } from "@supabase/supabase-js";
import axios from 'axios';
import { useState } from 'react';

const supabaseUrl = 'https://xnenqbetuufqkuxzwvvy.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhuZW5xYmV0dXVmcWt1eHp3dnZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2OTgwNjYsImV4cCI6MjA3OTI3NDA2Nn0.aDiz6CDIMxvLn76hnxAifd0t7saqpuk9RM5OdkOmS5M'
const supabase = createClient(supabaseUrl, supabaseKey)

const API_BASE_URL = "https://instagram-2-ql2f.onrender.com";

const Post = () => {
  let [img, setImg] = useState(null);
  function handleChange(e){
    console.log(e.target.files[0]);
    
    setImg(e.target.files[0]);
  }
  async function send(){
    if(!img){
      alert("Please select an image!")
      return;
    }
    try{
      const {data, error} = await supabase.storage.from("insta").upload("insta_images/" + img.name, img, {upsert: true});
      if(error) throw error;
      const imgUrl = `${supabaseUrl}/storage/v1/object/public/insta/insta_images/${img.name}`;
      console.log("Image URL:", imgUrl);
      let token = localStorage.getItem("Token");
      let res = await axios.post(`${API_BASE_URL}/upload`,{imgUrl},{headers:{"Authorization":`${token}`}});
      console.log(res.data);
    }
    catch(error){
      alert(error)
    }
  }
  return (
    <div className='flex w-[100%] h-[100vh] justify-center items-center'>
      <div className='w-[500px] h-[500px] border rounded-[8px] flex justify-between items-center flex-col'>
        <h2 className='text-[30px] bg-[linear-gradient(164deg,rgba(232,12,240,1)_1%,rgba(16,19,235,1)_100%)]
  bg-clip-text
  text-transparent'>Create New Post</h2>
        <div className='h-[90%] w-[80%] flex justify-evenly items-center flex-col'>
          <label htmlFor="uploadFile">
            {
              img ? 
              <div>
                <p><b className='text-[#005DFF] cursor-pointer'>Select Another Image</b></p>
              </div>
              :
              <div>
                <p><b className='text-[#005DFF] cursor-pointer'>Select An Image</b></p>
              </div>
            }
            <input id='uploadFile' type="file" onChange={handleChange} className='hidden'/>
          </label>
          {
            img ? 
            <div className='w-[95%] max-h-[80%]'>
              <img src={URL.createObjectURL(img)} className='object-contain w-full max-h-full' alt="" />
            </div> 
            : null
          }
          {
            img ?
            <button onClick={send} className='w-[100px] bg-[#005DFF] rounded-[8px] h-[25px] cursor-pointer'>Upload</button>
            : null
          }
        </div>
      </div>
    </div>
  )
}

export default Post