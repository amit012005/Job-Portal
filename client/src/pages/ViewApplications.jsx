import { React, useContext, useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';

const ViewApplications = () => {
  const { backendUrl, companyToken } = useContext(AppContext);
  const [applicants, setApplicants] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [topN, setTopN] = useState(10); // State for number of candidates to accept

  // Function to fetch company jobs
  const fetchCompanyJobs = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/company/list-jobs`, {
        headers: {
          token: companyToken,
        },
      });
      if (data.success) {
        setJobs(data.jobsData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };


  // Function to fetch job applicants
  const fetchCompanyJobApplications = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/company/applicants`, {
        headers: {
          token: companyToken
        }
      });
      if (data.success) {
        setApplicants(data.jobApplications.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }
  //Function to update job application status
  const changeJobApplicationStatus = async (id, status) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/company/change-status`, { id, status }, {
        headers: {
          token: companyToken
        }
      });
      if (data.success) {
        toast.success(data.message);
        fetchCompanyJobApplications();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  const handleAnalyzeAll = async () => {
    if (!selectedJob) {
      toast.error("Please select a job to analyze.");
      return;
    }
    if (topN < 1) {
      toast.error("Number of candidates to accept must be at least 1.");
      return;
    }

    try {
      const { data } = await axios.post(`${backendUrl}/api/company/analyze-resumes`, { jobId: selectedJob, topN: topN }, {
        headers: {
          token: companyToken,
        },
      });

      if (data.success) {
        toast.success(data.message);
        fetchCompanyJobApplications(); // Refresh the list to show updated statuses
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "An error occurred during analysis.");
    }
  };


  useEffect(() => {
    if (companyToken) {
      fetchCompanyJobs();
      fetchCompanyJobApplications();
    }
  }, [companyToken]);

  const filteredApplicants = selectedJob
    ? applicants.filter(applicant => applicant.jobId._id === selectedJob)
    : applicants;

  return applicants ? (
    <div className='container mx-auto'>
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <div>
          <label htmlFor="job-select" className="mr-2">Filter by Job:</label>
          <select
            id="job-select"
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">All Jobs</option>
            {jobs.map(job => (
              <option key={job._id} value={job._id}>{job.title}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-4">
          <div>
            <label htmlFor="top-n-input" className="mr-2">Accept Top:</label>
            <input
              id="top-n-input"
              type="number"
              value={topN}
              onChange={(e) => setTopN(Number(e.target.value))}
              className="border p-2 rounded w-24"
              min="1"
            />
          </div>
          <button
            onClick={handleAnalyzeAll}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
          >
            Analyze, Accept & Notify
          </button>
        </div>
      </div>
      {filteredApplicants.length === 0 ? (<div className='flex items-center justify-center h-[70vh]'>
        <p className='text-xl sm:text-2xl'>No Applications for this job</p>
      </div>) : (
        <div>
          <table className='w-full max-w-4xl bg-white border border-gray-200 max-sm:text-sm'>
            <thead>
              <tr className='border-b'>
                <th className='p-2 px-4 text-left'>#</th>
                <th className='p-2 px-4 text-left'>User name</th>
                <th className='p-2 px-4 text-left max-sm:hidden'>Job Title</th>
                <th className='p-2 px-4 text-left'>Resume</th>
                <th className='p-2 px-4 text-left'>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplicants.filter(item => item.jobId && item.userId).map((applicant, index) => (
                <tr key={index} className='text-gray-700'>
                  <td className='py-2 px-4 border-b text-center'>{index + 1}</td>
                  <td className='py-2 px-4 border-b text-center flex items-center gap-3'>
                    <img className='w-10 h-10 rounded-full mr-3 max-sm:hidden' src={applicant.userId.image} alt="" />
                    <span>{applicant.userId.name}</span>
                  </td>
                  <td className='py-2 px-4 border-b max-sm:hidden'>{applicant.jobId.title}</td>
                  <td className='py-2 px-4 border-b'><a className='bg-blue-50 text-blue-400 px-3 py-1 rounded inline-flex gap-2 items-center' href={applicant.userId.resume} target="_blank" rel="noopener noreferrer">View
                    Resume <img src={assets.resume_download_icon} alt="" /></a></td>
                  <td className='py-2 px-4 border-b relative'>
                      <span className={`px-3 py-1 rounded ${applicant.status === 'Accepted' ? 'bg-green-100 text-green-600' : applicant.status === 'Rejected' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                      {applicant.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  ) : <Loading className='flex justify-center items-center h-screen text-gray-500 text-xl'>Loading...</Loading>
}

export default ViewApplications;