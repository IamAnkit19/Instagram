import React from 'react'
import './MainContents.css'
import user from './assets/user.png'

const Profile = () => {
  return (
    <div className='navShow'>
      <div id='user'>
        <div id='userDetails'>
          <div id="image">
            <img src={user} style={{background:"white",width:"150px",borderRadius:"50%"}} alt="" />
          </div>
          <div id="details">
            <h1>ankit19._</h1>
            <h2>Ankit Pal❤️</h2>
            <h4>0 Posts 846 Followers 170 Following</h4>
            <h5>BIO</h5>
          </div>
        </div>
        <button id='editProfileBtn'>Edit Profile</button>
        <div id='myHighlights'>
          Highlights
        </div>
        <div id='myPosts'>
          Posts
        </div>
      </div>
    </div>
  )
}

export default Profile