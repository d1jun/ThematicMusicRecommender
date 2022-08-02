import React from 'react'
import { Link } from 'react-router-dom'
import './HomeHeader.css'
import HomeIcon from '@material-ui/icons/Home';

function HomeHeader() {
  return (
    <div className='homeHeader'>
        <Link to='/'>
            <HomeIcon className='homeHeader__homeIcon'></HomeIcon>
        </Link>
    </div>
  )
}

export default HomeHeader