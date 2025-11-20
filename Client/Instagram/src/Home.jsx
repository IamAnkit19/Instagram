import React from 'react'
import './App.css'
import './Home.css'
// import home from './assets/interface.png'
// import search from './assets/search-interface-symbol.png'
import { Routes, Route } from 'react-router-dom'
import Profile from './Profile'
import HomePage from './HomePage'

const Home = () => {
  return (
    <div className='homeDiv'>
      <section className='navigation'>
        <h1>Instagram</h1>
        <ul>
          <li>Home</li>
          <li>Search</li>
          <li>Explore</li>
          <li>Reels</li>
          <li>Messages</li>
          <li>Notifications</li>
          <li>Create</li>
          <li>Profile</li>
        </ul>
      </section>
      <section className='show'>
        <Routes>
          <Route path='' element={<HomePage/>}></Route>
          <Route path='profile' element={<Profile/>}></Route>
        </Routes>
      </section>
    </div>
  )
}

export default Home