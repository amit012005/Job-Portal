import React from 'react'
import { Outlet ,useNavigate,NavLink} from 'react-router-dom'
import { assets } from '../assets/assets'
const Dashboard = () => {
    const navigate=useNavigate();
  return (
    <div className='min-h-screen'>
        {/*Navbar for Recruiter Panel*/}
        <div className='shadow py-4'>
            <div className='px-5 flex justify-between items-center'>
                <img onClick={()=>navigate('/')} src={assets.logo} alt="Logo" className='max-sm:w-32 cursor-pointer' />
                <div className='flex items-center gap-3'>
                    <p className='max-sm:hidden'>Welcome, Amit</p>
                    <div className='relative group'>
                        <img className='w-8 border rounded-full' src={assets.company_icon} alt=""/>
                        <div className='hidden group-hover:block absolute right-0 top-0 z-10 text-black rounded pt-12'>
                            <ul className='list-none m-0 p-2 bg-white rounded-md border text-sm'>
                                <li className='py-1 px-2 cursor-pointer pr-10'>Logout</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/*Dashboard*/}
        <div className='flex items-start pt-2'>
            {/*Sidebar*/}
            <div className='inline-block min-h-screen border-r-2'>
                <ul className='flex flex-col items-start t-5 text-gray-800'>
                    <NavLink className={({isActive})=>`flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${isActive && 'bg-blue-100 border-r-4 border-blue-500'}`} to={'/dashboard/add-job'}>
                        <img className='min-w-4' src={assets.add_icon}/>
                        <p className='max-sm:hidden'>Add Job</p>
                    </NavLink>
                    <NavLink className={({isActive})=>`flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${isActive && 'bg-blue-100 border-r-4 border-blue-500'}`} to={'/dashboard/manage-jobs'}>
                        <img className='min-w-4' src={assets.home_icon}/>
                        <p className='max-sm:hidden'>Manage Jobs</p>
                    </NavLink>
                    <NavLink className={({isActive})=>`flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${isActive && 'bg-blue-100 border-r-4 border-blue-500'}`} to={'/dashboard/view-applications'}>
                        <img className='min-w-4' src={assets.person_tick_icon}/>
                        <p className='max-sm:hidden'>View Applications</p>
                    </NavLink>
                </ul>
            </div>
            {/*Outlet*/}
            <div className='w-full min-h-screen bg-slate-100 py-10 px-5'>
                <Outlet/>
            </div>
        </div>
    </div>
  )
}

export default Dashboard