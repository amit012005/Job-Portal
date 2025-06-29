import Company from "../models/Company.js";
import JobApplication from "../models/JobApplication.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import {v2 as cloudinary} from "cloudinary";
import  {generateToken}  from "../utils/generateToken.js";
import Job from "../models/Job.js";
import streamifier from 'streamifier';


//Register a new company
export const registerCompany = async (req, res) => {
  const { name, email, password } = req.body;
  const imageFile = req.file;

  if (!name || !email || !password || !imageFile) {
    return res.json({ success: false, message: "All fields are required" });
  }

  try {
    const companyExists = await Company.findOne({ email });
    if (companyExists) {
      return res.json({ success: false, message: "Company already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // ✅ Upload from buffer using streamifier
    const imageUpload = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'companies' },
        (error, result) => {
          if (result) resolve(result);
          else reject(error);
        }
      );
      streamifier.createReadStream(imageFile.buffer).pipe(stream);
    });

    const newCompany = new Company({
      name,
      email,
      password: hashPassword,
      image: imageUpload.secure_url,
    });

    await newCompany.save();

    res.json({
      success: true,
      company: {
        _id: newCompany._id,
        name: newCompany.name,
        email: newCompany.email,
        image: newCompany.image,
      },
      token: generateToken(newCompany._id),
    });

  } catch (error) {
    console.error("Company registration error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//Company login
export const loginCompany = async (req, res) => {
  try {
    const { email, password } = req.body;
    const company = await Company.findOne({ email });
    // console.log(company);
    if (!company) {
      return res.json({success:false, message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, company.password);
    console.log(isMatch);
    if (!isMatch) {
      return res.json({success:false, message: "Invalid email or password" });
    }
    const token = generateToken(company._id);
    return res.json({ success: true, company, token });
  } catch (error) {
    return res.json({success:false, message: error.message });
  }
};

//Get company details
export const getCompanyData = async (req, res) => {
    // console.log("Company data fetched successfully");
  
  try{
    const company=req.company;
    res.json({success:true, company})
  }
  catch (error) {
    console.error(error);
    res.status(500).json({success:false, message: error.message });
  }
}

//Post a new Job
export const postJob = async (req, res) => {
    const { title, description, location, salary,level ,category} = req.body;

    const companyId=req.company._id;
    try{
      const job = await Job.create({
        title,
        description,
        location,
        salary,
        companyId,
        date:Date.now(),
        level,
        category,
      });
      await job.save();
      return res.status(201).json({success:true, message: "Job posted successfully", job });
    }
    catch (error) {
      console.error(error);
      return res.status(500).json({success:false, message:error.message });
    }
  }

//Get company job applications
export const getCompanyJobApplicants = async (req, res) => {
  try {
    const companyId = req.company._id;
    const jobApplications = await JobApplication.find({ companyId })
      .populate('userId', 'name image resume')
      .populate('jobId', 'title location category level salary')
      .exec();
    return res.json({ success: true, jobApplications });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
}

//get company posted jobs
export const getCompanyPostedJobs = async (req, res) => {
  try{
    const companyId=req.company._id;
    const jobs=await Job.find({companyId});
    //Adding applicants count to each job
    const jobsData=await Promise.all(jobs.map(async (job) => {
      const applicantsCount = await JobApplication.countDocuments({ jobId: job._id });
      return {
        ...job.toObject(),
        applicants: applicantsCount,
      };
    }));
     res.status(200).json({success:true, jobsData });
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({success:false, message:error.message });
  }
}

//change job application status
export const changeJobApplicationStatus = async (req, res) => {
  try{
    const {id,status}=req.body;
    //find job application data and update status
    await JobApplication.findOneAndUpdate({_id:id},{status});

    return res.json({success:true, message:"Job application status changed successfully"});
  }
  catch (error) {
    return res.json({success:false, message:error.message });
  }

}

//Change job visibility
export const changeVisibility = async (req, res) => {
  try{
    const {id}=req.body;
    const companyId=req.company._id;
    const job=await Job.findById(id);
    if(companyId.toString()===job.companyId.toString()){
      job.visible=!job.visible;
      await job.save();
      return res.status(200).json({success:true, message:"Job visibility changed successfully", job });
    }
    else{
      return res.status(401).json({success:false, message:"You are not authorized to change this job visibility"});
    }
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({success:false, message:error.message });
  }
}

