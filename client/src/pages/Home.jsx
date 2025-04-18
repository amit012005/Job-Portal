import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import JobListing from '../components/JobListing'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div>
        <Hero/>
        <JobListing/>
    </div>
  )
}

export default Home