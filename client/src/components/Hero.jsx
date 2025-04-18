import React, { useRef, useContext} from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'

const Hero = () => {

    const {setSearchFilter, setIsSearched} = useContext(AppContext);

    const titleRef=useRef(null);
    const locationRef=useRef(null);

    const onSearch=()=>{
        setSearchFilter({title:titleRef.current.value, location:locationRef.current.value});
        setIsSearched(true);
    }

    return (
            <div className='container 2xl:px-20 mx-auto my-10'>
                <div className='bg-gradient-to-r from-purple-800 to-purple-950 text-white rounded-xl py-16 text-center mx-2'>
                    <h2 className='text-2xl md:text-3xl lg:text-4xl font-medium mb-4'>Over 10,000+ jobs to apply</h2>
                    <p className='mb-8 max-w-xl mx-auto text-sm font-light px-5'>Your Next Big Career Move Starts Right Here - Explore the Best Job Opportunities and Take the First Step Toward Your Future!</p>
                    <div className='flex flex-col sm:flex-row items-center justify-between bg-white rounded text-gray-600 max-w-xl pl-4 mx-4 sm:mx-auto gap-2 sm:gap-0'>
                        <div className='flex items-center gap-2 w-full sm:w-auto'>
                            <img className='h-4 sm:h-5' src={assets.search_icon} alt="search" />
                            <input type="text"
                                ref={titleRef}
                                placeholder='Search for Jobs'
                                className='max-sm:text-xs p-2 rounded outline-none w-full' />
                        </div>
                        <div className='flex items-center gap-2 w-full sm:w-auto'>
                            <img className='h-4 sm:h-5' src={assets.location_icon} alt="location" />
                            <input type="text"
                                ref={locationRef}
                                placeholder='Location'
                                className='max-sm:text-xs p-2 rounded outline-none w-full' />
                        </div>
                        <button onClick={onSearch} className='bg-blue-600 text-white px-6 sm:px-9 py-2 rounded m-1'>Search</button>
                    </div>
                </div>
            
            <div className='border border-gray-300 shadow-md mx-2 mt-5 p-6 rounded-md'>
                <div className='flex justify-center items-center flex-wrap gap-6 lg:gap-12'>
                    <p className='font-medium w-full text-center lg:w-auto'>Trusted by</p>
                    <img className='h-6' src={assets.microsoft_logo} alt="" />
                    <img className='h-6' src={assets.walmart_logo} alt="" />
                    <img className='h-6' src={assets.adobe_logo} alt="" />
                    <img className='h-6' src={assets.amazon_logo} alt="" />
                    <img className='h-6' src={assets.samsung_logo} alt="" />
                    <img className='h-6' src={assets.accenture_logo} alt="" />
                </div>
            </div>
            </div>

        
    )
}

export default Hero
