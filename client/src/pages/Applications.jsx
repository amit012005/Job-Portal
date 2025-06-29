import React, { useContext, useState ,useEffect} from 'react';
import { assets} from '../assets/assets';
import moment from 'moment';
import { AppContext } from '../context/AppContext';
import { useAuth, useUser } from '@clerk/clerk-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Applications = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [isEdit, setIsEdit] = useState(false);
  const [resume, setResume] = useState(null);

  const { backendUrl, userData, fetchUserData ,userApplications,fetchUserApplications} = useContext(AppContext);

  const updateResume = async () => {
    try {
      if (!resume) {
        toast.error("Please select a resume file");
        return;
      }

      const formData = new FormData();
      formData.append('resume', resume);
      console.log("Uploading resume:", resume);

      const token = await getToken();
      console.log(token);
      const { data } = await axios.post(
         backendUrl+`/api/users/update-resume`,
         formData,
         {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization:`Bearer ${token}`
            },
            }
         
        
      );

      if (data.success) {
        console.log(data);
        toast.success(data.message);
        await fetchUserData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Resume upload failed");
    }

    setIsEdit(false);
    setResume(null);
  };

  useEffect(() => {
    if (user) {
      fetchUserApplications();
    }
  }
  , [user,fetchUserApplications]);

  return (
    <>
      <Navbar />
      <div className='container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10'>

        <h2 className='text-xl font-semibold'>Your Resume</h2>

        <div className='flex gap-2 mb-6 mt-3'>
          {isEdit || (userData && userData.resume === "") ? (
            <>
              <label htmlFor='resumeUpload' className='flex items-center cursor-pointer'>
                <p className='bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg mr-2'>
                  {resume ? resume.name : "Select Resume"}
                </p>
                <input
                  id='resumeUpload'
                  onChange={(e) => {
                    console.log("File selected:", e.target.files[0]);
                    setResume(e.target.files[0]);
                  }}
                  accept='application/pdf'
                  type='file'
                  hidden
                />
                <img src={assets.profile_upload_icon} alt='Upload' className='w-6 h-6' />
              </label>

              <button
                onClick={updateResume}
                className='bg-green-100 border border-green-400 rounded-lg px-3 py-1.5'
              >
                Save
              </button>
            </>
          ) : (
            <div className='flex gap-2'>
              {userData?.resume && (
                <a
                  className='bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg'
                  href={userData.resume}
                  target='_blank'
                  rel='noreferrer'
                >
                  View Resume
                </a>
              )}
              <button
                onClick={() => setIsEdit(true)}
                className='text-gray-500 border border-gray-300 rounded-lg px-3 py-1.5'
              >
                Edit
              </button>
            </div>
          )}
        </div>

        <h2 className='text-xl font-semibold mb-4'>Jobs Applied</h2>

        <table className='min-w-full bg-white border rounded-lg text-sm'>
          <thead>
            <tr>
              <th className='py-2 px-2 border-b text-left'>Company</th>
              <th className='py-2 px-2 border-b text-left'>Job Title</th>
              <th className='py-2 px-2 border-b text-left max-sm:hidden'>Location</th>
              <th className='py-2 px-2 border-b text-left max-sm:hidden'>Date</th>
              <th className='py-2 px-2 border-b text-left'>Status</th>
            </tr>
          </thead>
          <tbody>
  {userApplications ? (
    userApplications.map((job, index) => (
      <tr key={index} className="hover:bg-gray-100">
        <td className="py-2 px-2 flex items-center gap-1 border-b">
          <img src={job.companyId.image} alt="Company" className="w-8 h-8 rounded-full object-cover"/>
          {job.companyId.name}
        </td>
        <td className="py-2 px-2 border-b">{job.jobId.title}</td>
        <td className="py-2 px-2 border-b max-sm:hidden">{job.jobId.location}</td>
        <td className="py-2 px-2 border-b max-sm:hidden">
          {moment(job.date).format("ll")}
        </td>
        <td className="py-2 px-2 border-b">
          {job.status === "Accepted" ? (
            <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded-full text-xs">
              {job.status}
            </span>
          ) : job.status === "Rejected" ? (
            <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">
              {job.status}
            </span>
          ) : job.status === "Interview" ? (
            <span className="bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded-full text-xs">
              {job.status}
            </span>
          ) : (
            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
              {job.status}
            </span>
          )}
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="5" className="py-4 text-center text-gray-500">
        No applications found
      </td>
    </tr>
  )}
</tbody>

        </table>
      </div>
    </>
  );
};

export default Applications;
