import React, { useContext, useEffect, useState } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import Loading from '../components/Loading';
import { assets } from '../assets/assets';
import kconvert from 'k-convert';
import moment from 'moment';
import JobCard from '../components/JobCard'; 
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import {toast} from 'react-toastify';
import { useAuth } from '@clerk/clerk-react';
import ResumeAnalyzer from '../components/ResumeAnalyzer';

const ApplyJob = () => {
  const { id } = useParams();
  const {getToken}=useAuth();
  const [JobData, setJobData] = useState(null);
  const [isAlreadyApplied,setIsAlreadyApplied]=useState(false);
  const { jobs,backendUrl ,userData,userApplications,fetchUserApplications} = useContext(AppContext);
  const navigate=useNavigate();
  const [showAnalyzer, setShowAnalyzer] = useState(false);
  const fetchJob = async () => {
    try {
      const {data}=await axios.get(backendUrl+`/api/jobs/${id}`)
      if(data.success){
        setJobData(data.job);
      }
      else{
        toast.error(data.message);
      }
    }
    catch(error){
      toast.error(error.message);
    }
  };

  const applyHandler = async () => {
    try {
      if (!userData) {
        return toast.error("Please login to apply");
      }
  
      if (!userData.resume) {
        navigate("/applications");
        return toast.error("Please upload your resume");
      }
  
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/users/apply`,
        { jobId: JobData._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          validateStatus: () => true, // 👈 handle all responses in try
        }
      );
  
      if (data.success) {
        toast.success(data.message);
        fetchUserApplications();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  

  const checkAlreadyApplied = () => {
    const hasApplied= userApplications.some(application => application.jobId._id === JobData._id);
    setIsAlreadyApplied(hasApplied);
     
  };
  useEffect(() => {
    fetchJob();
  }, [id]);
  useEffect(() =>
    {
      if (JobData) {
        checkAlreadyApplied();
      }
    }, [JobData, userApplications,id]);

  return (
    <>
      <Navbar />
      {JobData ? (
        <div className='min-h-screen flex flex-col py-10 container px-4 2xl:px-20 mx-auto'>
          <div className='bg-white text-black rounded-lg w-full'>
            {/* Job Header */}
            <div className='flex justify-center md:justify-between flex-wrap gap-8 px-14 py-20 mb-6 bg-sky-50 border border-sky-400 rounded-xl'>
              <div className='flex flex-col md:flex-row items-center'>
                <img
                  className='h-24 bg-white rounded-lg p-4 mr-4 max-md:mb-4 border'
                  src={JobData.companyId.image}
                  alt='Company'
                />
                <div className='text-center md:text-left text-neutral-700'>
                  <h1 className='text-2xl sm:text-4xl font-medium'>{JobData.title}</h1>
                  <div className='flex flex-row flex-wrap max-md:justify-center gap-y-2 gap-6 items-center text-gray-600 mt-2'>
                    <span className='flex items-center gap-1'>
                      <img src={assets.suitcase_icon} alt='Suitcase' className='w-4 h-4' />
                      {JobData.companyId.name}
                    </span>
                    <span className='flex items-center gap-1'>
                      <img src={assets.location_icon} alt='Location' className='w-4 h-4' />
                      {JobData.location}
                    </span>
                    <span className='flex items-center gap-1'>
                      <img src={assets.person_icon} alt='Person' className='w-4 h-4' />
                      {JobData.level}
                    </span>
                    <span className='flex items-center gap-1'>
                      <img src={assets.money_icon} alt='Money' className='w-4 h-4' />
                      CTC: {kconvert.convertTo(JobData.salary)}
                    </span>
                  </div>
                </div>
              </div>
              <div className='flex flex-col justify-center text-end text-sm max-md:mx-auto max-md:text-center'>
                <button onClick={applyHandler} className='bg-blue-600 p-2.5 px-10 text-white rounded'>{isAlreadyApplied?'Already Applied':'Apply Now'}</button>
                <p className='mt-1 text-gray-600'>Posted {moment(JobData.date).fromNow()}</p>
              </div>
            </div>

            {/* Job Description */}
            <div className='flex flex-col lg:flex-row justify-between items-start'>
              <div className='w-full lg:w-2/3'>
                <h2 className='font-bold text-3xl mb-4'>Job Description</h2>
                <div
                  className='text-gray-700 text-base leading-relaxed space-y-3 
                    [&>h2]:font-semibold [&>h2]:text-lg 
                    [&>ul]:list-disc [&>ul]:pl-5 [&>ul>li]:mb-1 
                    [&>ol]:list-decimal [&>ol]:pl-5 [&>ol>li]:mb-1 
                    [&>p]:mb-2 [&>strong]:font-semibold'
                  dangerouslySetInnerHTML={{ __html: JobData.description }}
                ></div>
                <button onClick={applyHandler} className='bg-blue-600 p-2.5 px-10 text-white rounded mt-10'>{isAlreadyApplied?'Already Applied':'Apply Now'}</button>
                <button
                  className="bg-green-600 p-2.5 px-10 text-white rounded mt-4 ml-4"
                  onClick={() => setShowAnalyzer(true)}
                >
                  Analyze Resume
                </button>
                {showAnalyzer && (
                  <div className="mt-8">
                    <ResumeAnalyzer />
                    <button
                      className="mt-2 text-sm text-blue-600 underline"
                      onClick={() => setShowAnalyzer(false)}
                    >
                      Close Analyzer
                    </button>
                  </div>
                )}
              </div>

              {/* Right Section More Jobs */}
              <div className='w-full lg:w-1/3 mt-8 lg:ml-8 space-y-5'>
                <h2>More jobs from {JobData.companyId.name}</h2>
                {jobs
                  .filter(job => job._id !== JobData._id && job.companyId._id === JobData.companyId._id)
                  .filter(job=>{
                    //set of applied jobs
                    const appliedJobIds = new Set(userApplications.map(application => application.jobId && application.jobId._id));
                    //return true if job is not applied
                    return !appliedJobIds.has(job._id);
                  }).slice(0, 4)
                  .map((job, index) => (
                    <JobCard key={index} job={job} />
                  ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Loading />
      )}
      <Footer />
    </>
  );
};

export default ApplyJob;
