import React,{useState} from 'react'
import { assets, jobsApplied } from '../assets/assets'
import moment from 'moment';

const Applications = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [resume, setResume] = useState(null);

  return (
    <div className='container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10'>
      <h2 className='text-xl font-semibold'>Your Resume</h2>
      <div className='flex gap-2 mb-6 mt-3'>
        {isEdit ? (
          <>
            <label htmlFor='resumeUpload' className='flex items-center'>
              <p className='bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg mr-2'>Select Resume</p>
              <input
                id='resumeUpload'
                onChange={(e) => setResume(e.target.files[0])}
                accept='application/pdf'
                type='file'
                hidden
              />
              <img src={assets.profile_upload_icon} alt='Upload' className='w-6 h-6 cursor-pointer' />
            </label>
            <button onClick={() => setIsEdit(false)} className='bg-green-100 border border-green-400 rounded-lg px-3 py-1.5'>
              Save
            </button>
          </>
        ) : (
          <div className='flex gap-2'>
            <a className='bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg' href=''>
              Resume
            </a>
            <button onClick={() => setIsEdit(true)} className='text-gray-500 border border-gray-300 rounded-lg px-3 py-1.5'>
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
          {jobsApplied.map((job, index) => (
            <tr key={index} className='hover:bg-gray-100'>
              <td className='py-2 px-2 flex items-center gap-1 border-b'>
                <img src={job.logo} alt='Company' />
                {job.company}
              </td>
              <td className='py-2 px-2 border-b'>{job.title}</td>
              <td className='py-2 px-2 border-b max-sm:hidden'>{job.location}</td>
              <td className='py-2 px-2 border-b max-sm:hidden'>{moment(job.date).format('ll')}</td>
              <td className='py-2 px-2 border-b'>
                {job.status === 'Accepted' ? (
                  <span className='bg-green-100 text-green-600 px-2 py-0.5 rounded-full text-xs'>{job.status}</span>
                ) : job.status === 'Rejected' ? (
                  <span className='bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs'>{job.status}</span>
                ) : job.status === 'Interview' ? (
                  <span className='bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded-full text-xs'>{job.status}</span>
                ) : (
                  <span className='bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs'>{job.status}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Applications;
