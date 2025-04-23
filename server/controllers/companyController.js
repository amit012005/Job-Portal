import Company from "../models/Company.js";
import bcrypt from "bcrypt";
import {v2 as cloudinary} from "cloudinary";
import  {generateToken}  from "../utils/generateToken.js";
import Job from "../models/Job.js";


//Register a new company
export const registerCompany = async (req, res) => {

  const { name, email, password } = req.body;
  const imageFile=req.file;
  if(!name ||!email ||!password ||!imageFile) {
    return res.json({success:false,message:"All fields are required"});
  }
  try {
    const companyExists = await Company.findOne({ email });
    if (companyExists) {
      return res.json({ success: false, message: "Company already exists" });
    }
    // Hash the password
    const salt=await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const imageUpload = await cloudinary.uploader.upload(imageFile.path);

    const newCompany = new Company({
      name,
      email,
      password:hashPassword,
      image:imageUpload.secure_url,
    });
     await newCompany.save();
    res.json({ success: true, 
      company: {
        _id: newCompany._id,
        name: newCompany.name,
        email: newCompany.email,
        image: newCompany.image,
      },
      token: generateToken(newCompany._id),
     });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({success:false, message: error.message });
  }
};

//Company login
export const loginCompany = async (req, res) => {
  try {
    const { email, password } = req.body;
    const company = await Company.findOne({ email });
    if (!company) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = generateToken(company._id);
    return res.json({ success: true, company, token });
  } catch (error) {
    return res.status(500).json({success:false, message: error.message });
  }
};

//Get company details
export const getCompanyData = async (req, res) => {
    
  
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
      return res.status(201).json({success:true, job });
    }
    catch (error) {
      console.error(error);
      return res.status(500).json({success:false, message:error.message });
    }
  }

//Get company job applications
export const getCompanyJobApplicants = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Validate input
    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required" });
    }

    // Mocked job applications logic
    // In a real application, you would fetch the applications from the database
    const applications = [
      { id: 1, name: "John Doe", status: "Applied" },
      { id: 2, name: "Jane Smith", status: "Interviewed" },
    ]; // Mocked applications

    return res.status(200).json({ message: "Job applications fetched successfully", applications });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

//get company posted jobs
export const getCompanyPostedJobs = async (req, res) => {
  try{
    const companyId=req.company._id;
    const jobs=await Job.find({companyId});
    return res.status(200).json({success:true, jobsData:jobs });
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({success:false, message:error.message });
  }
}

//change job application status
export const changeJobApplicationStatus = async (req, res) => {
  try {
    const { applicationId, status } = req.body;

    // Validate input
    if (!applicationId || !status) {
      return res.status(400).json({ message: "Application ID and status are required" });
    }

    // Mocked change status logic
    // In a real application, you would update the status in the database
    const updatedApplication = { id: applicationId, status }; // Mocked update

    return res.status(200).json({ message: "Application status updated successfully", application: updatedApplication });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
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

