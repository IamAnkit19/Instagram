import React from 'react'
import Home from './Home'
import { Routes, Route } from 'react-router-dom'
import Login from './Login'
import Signup from './Signup'
import ForgetPassword from './ForgetPassword'
import Reset from './Reset'
import Profile from './Profile'
import HomePage from './HomePage'
import Post from './Post'
import SearchFile from './Search'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Login/>}></Route>
        <Route path='/home' element={<Home/>}>
          <Route index element={<HomePage/>}/>
          <Route path='profile' element={<Profile/>}/>
          <Route path='post' element={<Post/>}/>
          <Route path='search' element={<SearchFile/>}/>
        </Route>
        <Route path='/signup' element={<Signup/>}></Route>
        <Route path='/forget-password' element={<ForgetPassword/>}></Route>
        <Route path='/reset/:token' element={<Reset/>}></Route>
      </Routes> 
    </div>
  )
}

export default App