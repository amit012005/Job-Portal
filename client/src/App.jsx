import React from 'react'
import { Route, Routes, Outlet } from 'react-router-dom'
import Home from './pages/Home'
import ApplyJob from './pages/ApplyJob'
import Applications from './pages/Applications'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

const Layout = () => {
  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />
      <div className='flex-1'>
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}


const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path='/' element={<Home />} />
        <Route path='/apply-job/:id' element={<ApplyJob />} />
        <Route path='/applications' element={<Applications />} />
      </Route>
    </Routes>
  )
}

export default App
