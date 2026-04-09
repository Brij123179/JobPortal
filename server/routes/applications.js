import express from 'express';
import multer from 'multer';
import path from 'path';
import dataStore from '../store/dataStore.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for resume uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/resumes/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        const allowedTypes = /pdf|doc|docx/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only PDF and DOC files are allowed'));
        }
    }
});

// @route   POST /api/applications
// @desc    Apply for a job
// @access  Private (Job Seeker only)
router.post('/', protect, authorize('jobseeker'), upload.single('resume'), async (req, res) => {
    try {
        const { jobId, coverLetter } = req.body;

        // Check if job exists
        const job = dataStore.findJobById(jobId);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // Check if already applied
        const existingApplication = dataStore.findApplicationByJobAndUser(jobId, req.user.id);

        if (existingApplication) {
            return res.status(400).json({
                success: false,
                message: 'You have already applied for this job'
            });
        }

        const application = dataStore.createApplication({
            job_id: jobId,
            job_seeker_id: req.user.id,
            employer_id: job.employer_id,
            cover_letter: coverLetter,
            resume_url: req.file ? req.file.path : req.user.resume
        });

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            application
        });
    } catch (error) {
        console.error('Apply job error:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting application',
            error: error.message
        });
    }
});

// @route   GET /api/applications/my-applications
// @desc    Get job seeker's applications
// @access  Private (Job Seeker only)
router.get('/my-applications', protect, authorize('jobseeker'), async (req, res) => {
    try {
        let applications = dataStore.findApplications({ job_seeker_id: req.user.id });

        // Populate job and employer info
        applications = applications.map(app => {
            const job = dataStore.findJobById(app.job_id);
            const employer = dataStore.findUserById(app.employer_id);

            return {
                ...app,
                job: job ? {
                    id: job.id,
                    title: job.title,
                    company_name: job.company_name,
                    location: job.location,
                    job_type: job.job_type,
                    salary_min: job.salary_min,
                    salary_max: job.salary_max,
                    status: job.status
                } : null,
                employer: employer ? {
                    name: employer.name,
                    company_name: employer.company_name,
                    companyDescription: employer.companyDescription,
                    website: employer.website,
                    industry: employer.industry,
                    email: employer.email,
                    phone: employer.phone
                } : null
            };
        });

        res.status(200).json({
            success: true,
            count: applications.length,
            applications
        });
    } catch (error) {
        console.error('Get applications error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching applications',
            error: error.message
        });
    }
});

// @route   GET /api/applications/job/:jobId
// @desc    Get applications for a specific job
// @access  Private (Employer only - own jobs)
router.get('/job/:jobId', protect, authorize('employer'), async (req, res) => {
    try {
        const job = dataStore.findJobById(req.params.jobId);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // Check if user owns the job
        if (job.employer_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view these applications'
            });
        }

        let applications = dataStore.findApplications({ job_id: req.params.jobId });

        // Populate job seeker info
        applications = applications.map(app => {
            const jobSeeker = dataStore.findUserById(app.job_seeker_id);

            return {
                ...app,
                jobSeeker: jobSeeker ? {
                    id: jobSeeker.id,
                    name: jobSeeker.name,
                    email: jobSeeker.email,
                    phone: jobSeeker.phone,
                    skills: jobSeeker.skills,
                    experience: jobSeeker.experience,
                    education: jobSeeker.education,
                    location: jobSeeker.location,
                    bio: jobSeeker.bio
                } : null
            };
        });

        res.status(200).json({
            success: true,
            count: applications.length,
            applications
        });
    } catch (error) {
        console.error('Get job applications error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching applications',
            error: error.message
        });
    }
});

// @route   GET /api/applications/employer/all
// @desc    Get all applications for employer's jobs
// @access  Private (Employer only)
router.get('/employer/all', protect, authorize('employer'), async (req, res) => {
    try {
        let applications = dataStore.findApplications({ employer_id: req.user.id });

        // Populate job and job seeker info
        applications = applications.map(app => {
            const job = dataStore.findJobById(app.job_id);
            const jobSeeker = dataStore.findUserById(app.job_seeker_id);

            return {
                ...app,
                job: job ? {
                    id: job.id,
                    title: job.title,
                    location: job.location,
                    job_type: job.job_type
                } : null,
                jobSeeker: jobSeeker ? {
                    id: jobSeeker.id,
                    name: jobSeeker.name,
                    email: jobSeeker.email,
                    phone: jobSeeker.phone,
                    skills: jobSeeker.skills,
                    experience: jobSeeker.experience,
                    education: jobSeeker.education,
                    location: jobSeeker.location,
                    bio: jobSeeker.bio
                } : null
            };
        });

        res.status(200).json({
            success: true,
            count: applications.length,
            applications
        });
    } catch (error) {
        console.error('Get all applications error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching applications',
            error: error.message
        });
    }
});

// @route   PUT /api/applications/:id/status
// @desc    Update application status
// @access  Private (Employer only)
router.put('/:id/status', protect, authorize('employer'), async (req, res) => {
    try {
        const { status, notes } = req.body;

        const application = dataStore.findApplicationById(req.params.id);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        // Check if user owns the job
        if (application.employer_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this application'
            });
        }

        const updatedApp = dataStore.updateApplication(req.params.id, {
            status,
            notes: notes || application.notes,
            reviewed_at: new Date().toISOString()
        });

        res.status(200).json({
            success: true,
            message: 'Application status updated successfully',
            application: updatedApp
        });
    } catch (error) {
        console.error('Update application error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating application',
            error: error.message
        });
    }
});

// @route   GET /api/applications/:id
// @desc    Get single application
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const application = dataStore.findApplicationById(req.params.id);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        // Check authorization
        const isJobSeeker = application.job_seeker_id === req.user.id;
        const isEmployer = application.employer_id === req.user.id;

        if (!isJobSeeker && !isEmployer) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this application'
            });
        }

        // Populate related data
        const job = dataStore.findJobById(application.job_id);
        const jobSeeker = dataStore.findUserById(application.job_seeker_id);
        const employer = dataStore.findUserById(application.employer_id);

        const populatedApp = {
            ...application,
            job,
            jobSeeker: jobSeeker ? {
                id: jobSeeker.id,
                name: jobSeeker.name,
                email: jobSeeker.email,
                phone: jobSeeker.phone,
                skills: jobSeeker.skills,
                experience: jobSeeker.experience,
                education: jobSeeker.education,
                location: jobSeeker.location,
                bio: jobSeeker.bio,
                resume: jobSeeker.resume
            } : null,
            employer: employer ? {
                id: employer.id,
                name: employer.name,
                company_name: employer.company_name,
                companyDescription: employer.companyDescription,
                website: employer.website,
                industry: employer.industry,
                email: employer.email,
                phone: employer.phone
            } : null
        };

        res.status(200).json({
            success: true,
            application: populatedApp
        });
    } catch (error) {
        console.error('Get application error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching application',
            error: error.message
        });
    }
});

export default router;
