import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <footer className='w-full bg-white'>
      <div className='container px-4 2xl:px-20 mx-auto flex flex-wrap items-center justify-between gap-4 py-4'>
        <img src={assets.logo} alt="Logo" />
        <p className='flex-1 text-sm text-gray-500 max-sm:hidden'>
          © 2025 amit2005tp — All rights reserved.
        </p>
        <div className='flex gap-2.5'>
          <img src={assets.facebook_icon} alt="Facebook" />
          <img src={assets.twitter_icon} alt="Twitter" />
          <img src={assets.instagram_icon} alt="Instagram" />
        </div>
      </div>
    </footer>
  )
}

export default Footer
