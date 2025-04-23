import express from 'express';
import { getUserData,applyForJob ,getUserJobApplications,updateUserResume} from '../controllers/userController.js';
import upload from '../config/multer.js';

const router = express.Router();

//Get user data
router.get('/user',getUserData);

//Apply for a job
router.post('/apply',applyForJob);

//Get user's job applications
router.get('/applications',getUserJobApplications);

//Update user profile(resume)
router.post('/update-resume',upload.single('resume'),updateUserResume);

export default router;