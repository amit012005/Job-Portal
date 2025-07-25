import React,{useContext, useEffect, useState} from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const RecruiterLogin = () => {
    const navigate=useNavigate();
    const [state, setState] =useState('Login');
    const [name, setName] =useState('');
    const [password, setPassword] =useState('');
    const [email, setEmail] =useState('');
    const [image, setImage] =useState(false);
    const [isTextDataSubmitted, setIsTextDataSubmitted] = useState(false);
    const {setShowRecruiterLogin,backendUrl,setCompanyToken,setCompanyData}=useContext(AppContext);
    const onSubmitHandler=async(e)=>{
        e.preventDefault();
        if(state==="Register" && !isTextDataSubmitted){
            return setIsTextDataSubmitted(true);
        }
        try{
            if(state==="Login"){
                const {data}=await axios.post(`${backendUrl}/api/company/login`,{
                    email,
                    password
                });
                if(data.success){
                    setCompanyToken(data.token);
                    setCompanyData(data.company);
                    localStorage.setItem('companyToken',data.token);
                    setShowRecruiterLogin(false);
                    navigate('/dashboard');
                    
                }else{
                    alert(data.message);
                    toast.error(data.message);
                }
            }
            else if(state==="Register"){
                const formData=new FormData;
                formData.append('name',name);
                formData.append('email',email);
                formData.append('password',password);
                formData.append('image',image);
                const {data}=await axios.post(`${backendUrl}/api/company/register`,formData,{
                    headers:{
                        'Content-Type':'multipart/form-data'
                    }
                });
                if(data.success){
                    setCompanyToken(data.token);
                    setCompanyData(data.company);
                    localStorage.setItem('companyToken',data.token);
                    setShowRecruiterLogin(false);
                    navigate('/dashboard');
                    
                }else{
                    alert(data.message);
                    toast.error(data.message);
                }
            }
            
        }
        catch(error){
            console.log(error);
            toast.error("Something went wrong. Please try again later.");
        }

    }
    useEffect(()=>{
        document.body.style.overflow="hidden";
        return ()=>{
            document.body.style.overflow="unset";
        }

    },[])

  return (
    <div className='absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'>
        <form onSubmit={onSubmitHandler} className='relative bg-white p-10 rounded-xl text-slate-500' action="">
            <h1 className='text-center text-2xl text-neutral-700 font-medium'>Recruiter {state}</h1>
            <p className='text-sm'>Welcome back! Please sign in to continue</p>
            {state==="Register" && isTextDataSubmitted 
            ?<>
                <div className='flex items-center gap-4 my-10'>
                    <label htmlFor='image'>
                        <img className='w-16 rounded-full' src={image?URL.createObjectURL(image):assets.upload_area} alt=""/>
                        <input onChange={e=>setImage(e.target.files[0])} id="image" type="file" hidden/>
                    </label>
                    <p>
                        Upload Company<br/>logo
                    </p>
                </div>
            </>:(
                <>
                {state!=='Login' && (<div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
                    <img src={assets.person_icon} alt="Person" />
                    <input className='outline-none text-sm' type="text" placeholder='Company Name' required onChange={(e)=>setName(e.target.value)} value={name}></input>
                </div>)}
                
                <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
                    <img src={assets.email_icon} alt="Person" />
                    <input className='outline-none text-sm' type="email" placeholder='Email Id' required onChange={(e)=>setEmail(e.target.value)} value={email}></input>
                </div>
                <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
                    <img src={assets.lock_icon} alt="Person" />
                    <input className='outline-none text-sm' type="password" placeholder='Password' required onChange={(e)=>setPassword(e.target.value)} value={password}></input>
                </div>
                
                </>
            )}
            {state==='Login' && (<p className='text-sm text-blue-600 mt-4 cursor-pointer'>Forgot Password</p>)}
            <button type='submit' className='bg-blue-600 w-full text-white py-2 rounded-full mt-4'>
                {state==='Login'?'Login':isTextDataSubmitted?'Register':'Next'}
            </button>
            {state==='Login' ? (<p className='mt-5 text-center'>Don't have an account?<span className='text-blue-600 cursor-pointer' onClick={()=>setState("Register")}>Register</span></p>)
            :(<p className='mt-5 text-center'>Already have an account? <span className='text-blue-600 cursor-pointer' onClick={()=>setState("Login")}>Login</span></p>)}
            
            <img src={assets.cross_icon} onClick={()=>setShowRecruiterLogin(false)} className='absolute top-4 right-4 cursor-pointer' alt="Cross" />
            
        </form>
    </div>
  )
}

export default RecruiterLogin