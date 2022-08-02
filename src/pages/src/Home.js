import React from 'react'
import './Home.css'
import { Link } from 'react-router-dom'
import HomeHeader from './components/HomeHeader'

function Home() {
  return (
    <div className='home'>
        <HomeHeader></HomeHeader>
        <div className='home__container'>
            <h1>Thematic Music Recommender</h1>
            <div className='home__info'>
                Use a collection of songs to find new songs that are similar in theme.
            </div>
            <Link to='/login'>
                <button className='home__login'>
                    <span className='home__option'>Start</span>
                </button>
            </Link>
        </div>
    </div>
  )
}

export default Home