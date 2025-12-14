import React, { useState } from 'react'
import './App.css'
// import './Home.css'
// import home from './assets/interface.png'
// import search from './assets/search-interface-symbol.png'
import { Routes, Route, Link, Outlet } from 'react-router-dom'
// import Profile from './Profile'
// import HomePage from './HomePage'
// import Post from './Post'
import SearchFile from './Search'
import { House, Search, Compass, SquarePlay, Send, Heart, Plus, CircleUserRound } from 'lucide-react';

const Home = () => {
  const [searchClicked, setSearchClicked] = useState(false);
  console.log(searchClicked);
  
  function toggleSearch(){
    setSearchClicked(prev => !prev);
  }
  return (
    <div className='w-screen h-screen flex relative overflow-x-hidden'>
      <section className='w-[16vw] h-screen border-r-1 border-[#FFFFFF7A] box-border flex justify-center items-center flex-col fixed'>
        <h1>Instagram</h1>
        <ul className='h-[80vh] flex justify-evenly  flex-col'>
          <Link to={'/home'} className='no-underline'>
            <li className='flex items-center'><House/>Home</li>
          </Link>
          {/* <Link to={'/home/search'}> */}
            <li className='flex items-center cursor-pointer' onClick={toggleSearch}><Search/>Search</li>
          {/* </Link> */}
          <li className='flex items-center'><Compass/>Explore</li>
          <li className='flex items-center'><SquarePlay/>Reels</li>
          <li className='flex items-center'><Send/>Messages</li>
          <li className='flex items-center'><Heart/>Notifications</li>
          <Link to={'/home/post'} className='no-underline'>
            <li className='flex items-center'><Plus/>Create</li>
          </Link>
          <Link to={'/home/profile'} className='no-underline'>
            <li className='flex items-center'><CircleUserRound/>Profile</li>
          </Link>
        </ul>
      </section>
      {
        searchClicked ? 
        <SearchFile closeSearch={toggleSearch}/>
        : null
      }
      <section className='w-[84vw] min-h-[100vh] absolute z-10 box-border left-[16vw]'>
        <Outlet/>
      </section>
    </div>
  )
}

export default Home