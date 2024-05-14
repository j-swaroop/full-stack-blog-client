import React from 'react'
import { Link } from 'react-router-dom'
import './index.css'

const NotFound = () => {
  return (
    <div className='not-found'>
      <div>
        <h1> Page Not Found</h1>
        <p> Please go to the Home Page</p>
         <Link to='/'> Home </Link>
      </div>
    </div>
  )
}

export default NotFound

