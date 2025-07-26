// src/components/ResumeAnalyzer.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function ResumeAnalyzer({ jobDescription }) {
  const [resume, setResume] = useState(null);
  const [jobDesc, setJobDesc] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (jobDescription) {
      const plainTextDescription = jobDescription.replace(/<[^>]*>?/gm, '');
      setJobDesc(plainTextDescription);
    }
  }, [jobDescription]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== 'application/pdf') {
        toast.error("Please upload a PDF file only.");
        e.target.value = null; 
        setResume(null);
        return;
    }
    setResume(file);
  };
  
  const handleAnalyze = async () => {
    if (!resume) {
        toast.error("Please upload your resume.");
        return;
    }
    if (!jobDesc.trim()) {
        toast.error("Please provide the job description.");
        return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    
    const formData = new FormData();
    formData.append('resume', resume);
    formData.append('job_desc', jobDesc);
    
    try {
      // IMPORTANT: Point this to your new Python Flask API
      const res = await axios.post('https://job-portal-resume-analyzer.onrender.com/api/analyze', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
      });
      
      if (res.data.success) {
        setResult(res.data.analysis);
        toast.success("Analysis complete!");
      } else {
        throw new Error(res.data.message || 'Analysis failed');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "An unexpected error occurred.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto p-6 bg-slate-50 border rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800">AI Resume Analyzer</h2>
      <p className="text-sm text-gray-600 mb-4">Get an instant analysis of how well your resume matches the job description.</p>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Upload Resume (PDF only)</label>
        <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
        <textarea
            value={jobDesc}
            onChange={e => setJobDesc(e.target.value)}
            placeholder="Paste job description here"
            className="w-full h-40 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="w-full bg-blue-600 text-white px-4 py-2.5 rounded-md disabled:opacity-50 hover:bg-blue-700 transition-colors font-semibold"
      >
        {loading ? 'Analyzing...' : 'Analyze My Resume'}
      </button>

      {error && <div className="mt-4 text-red-600 bg-red-100 p-3 rounded-md">{error}</div>}

      {result && (
        <div className="mt-6 p-4 bg-white border rounded-lg">
          <h3 className="font-bold text-lg mb-4 text-gray-900">Analysis Report</h3>
          
          <div className='mb-4'>
            <label className='text-sm font-semibold text-gray-600'>Overall Match Score</label>
            <div className="w-full bg-gray-200 rounded-full h-4 mt-1">
              <div 
                className="bg-green-500 h-4 rounded-full text-xs font-medium text-blue-100 text-center p-0.5 leading-none" 
                style={{ width: `${result.overall_score * 100}%` }}
              >
                {`${(result.overall_score * 100).toFixed(1)}%`}
              </div>
            </div>
          </div>
          
          <div className='mb-4'>
            <h4 className='font-semibold text-gray-800'>Summary</h4>
            <p className='text-sm text-gray-700 mt-1'>{result.summary}</p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <h4 className='font-semibold text-green-700'>Strengths</h4>
              <ul className='list-disc list-inside mt-1 space-y-1 text-sm text-gray-700'>
                {result.strengths.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
            <div>
              <h4 className='font-semibold text-red-700'>Weaknesses / Gaps</h4>
              <ul className='list-disc list-inside mt-1 space-y-1 text-sm text-gray-700'>
                {result.weaknesses.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
             <div>
              <h4 className='font-semibold text-blue-700'>Matched Skills</h4>
              <p className='text-sm text-gray-700 mt-1'>{result.matched_skills.join(', ')}</p>
            </div>
             <div>
              <h4 className='font-semibold text-orange-700'>Missing Skills</h4>
              <p className='text-sm text-gray-700 mt-1'>{result.missing_skills.join(', ')}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResumeAnalyzer;