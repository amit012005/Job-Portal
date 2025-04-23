import User from '../models/User.js';
import Job from '../models/Job.js';
import JobApplication from '../models/JobApplication.js';
import {v2 as cloudinary} from 'cloudinary';

//Get user data
export const getUserData = async (req, res) => {
    const userId=req.auth.userId;
    try{
        const user=await User.findById(userId);
        if(!user){
            return res.status(404).json({success:false, message:"User not found"});
        }
        return res.status(200).json({success:true, user });
    }
    catch(error){
        return res.status(500).json({success:false,  message:error.message});
    }
    
}

//Apply for a job
export const applyForJob = async (req, res) => {
    const { jobId } = req.body;
    const userId=req.auth.userId;
    try {
        const isAlreadyApplied = await JobApplication.findOne({ userId, jobId });
        if (isAlreadyApplied.length > 0) {
            return res.status(400).json({ success: false, message: "You have already applied for this job" });
        }
        const jobData= await Job.findById(jobId);
        if(!jobData){
            return res.status(404).json({ success: false, message: "Job not found" });
        }
        const jobApplication = new JobApplication({ 
            companyId: jobData.companyId,
            userId,
            jobId,
            date: Date.now()
        });
        await jobApplication.save();
        return res.status(200).json({ success: true, message: "Application submitted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
        
}

//Get user's job applications
export const getUserJobApplications = async (req, res) => {
    try{
        const userId=req.auth.userId;
        const jobApplications=await JobApplication.find({ userId })
        .populate('company', 'name email image')
        .populate('jobId', 'title description location salary level category')
        .exec();
        if(jobApplications.length===0){
            return res.status(404).json({ success: false, message: "No job applications found" });
        }
        return res.status(200).json({ success: true, jobApplications });
    }
    catch(error){
        return res.status(500).json({ success: false, message: error.message });
    }
}

//update user profile(resume)
export const updateUserResume = async (req, res) => {
    try {
        const userId=req.auth.userId;
        const resumeFile = req.resumeFile; 
        const userData = await User.findById(userId);
        if(resumeFile){
            const resumeUpload = await cloudinary.uploader.upload(resumeFile.path);
            userData.resume = resumeUpload.secure_url;
            await userData.save();
        }
        return res.status(200).json({ success: true, message: "Resume updated successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
