import Job from '../models/Job.js';
//Get all jobs
export const getJobs=async (req, res) => {
    try {
        const jobs = await Job.find({visible:true}).populate({path:'companyId',select:'-password'});
        return res.status(200).json({success:true, jobs });
    } catch (error) {
        console.error(error);
        return res.status(500).json({success:false, message:error.message });
    }
}

//Get a single job by id
export const getJobById=async (req, res) => {
    try {
        const {id} = req.params;
        const job = await Job.findById(id).populate({path:'companyId',select:'-password'});
        if(!job){
            return res.status(404).json({success:false, message:"Job not found"});
        }
        return res.status(200).json({success:true, job });
    } catch (error) {
        console.error(error);
        return res.status(500).json({success:false, message:error.message });
    }
}