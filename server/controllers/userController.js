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
        if (isAlreadyApplied) {
            return res.status(400).json({ success: false, message: "You have already applied for job" });
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
      console.error("Error applying for job:", error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
        
}

//Get user's job applications
export const getUserJobApplications = async (req, res) => {
    try{
        const userId=req.auth.userId;
        const jobApplications=await JobApplication.find({ userId })
        .populate('companyId', 'name email image')
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
import streamifier from 'streamifier';

export const updateUserResume = async (req, res) => {

  try {
    const userId = req.auth.userId;
    const resumeFile = req.file;

    if (!resumeFile) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const userData = await User.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      async (error, result) => {
        if (error) {
          return res.status(500).json({ success: false, message: "Cloudinary upload failed" });
        }

        userData.resume = result.secure_url;
        await userData.save();
        return res.status(200).json({
          success: true,
          message: "Resume updated successfully",
          resumeUrl: userData.resume,
        });
      }
    );

    streamifier.createReadStream(resumeFile.buffer).pipe(uploadStream);

  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
