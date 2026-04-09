import express from 'express';
import dataStore from '../store/dataStore.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/jobs
// @desc    Get all jobs with filters
// @access  Public
router.get('/', async (req, res) => {
    try {
        const {
            keyword,
            location,
            jobType,
            experienceLevel,
            minSalary,
            maxSalary,
            page = 1,
            limit = 10
        } = req.query;

        // Build filters
        const filters = {
            status: 'active',
            keyword,
            location,
            job_type: jobType,
            experience_level: experienceLevel,
            min_salary: minSalary,
            max_salary: maxSalary
        };

        // Remove undefined filters
        Object.keys(filters).forEach(key =>
            filters[key] === undefined && delete filters[key]
        );

        // Get filtered jobs
        let jobs = dataStore.findJobs(filters);

        // Add employer info to each job
        jobs = jobs.map(job => {
            const employer = dataStore.findUserById(job.employer_id);
            return {
                ...job,
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

        // Pagination
        const total = jobs.length;
        const pageNum = Number(page);
        const limitNum = Number(limit);
        const from = (pageNum - 1) * limitNum;
        const to = from + limitNum;
        const paginatedJobs = jobs.slice(from, to);

        res.status(200).json({
            success: true,
            count: paginatedJobs.length,
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum),
            jobs: paginatedJobs
        });
    } catch (error) {
        console.error('Get jobs error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching jobs',
            error: error.message
        });
    }
});

// @route   GET /api/jobs/:id
// @desc    Get single job
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const job = dataStore.findJobById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // Add employer info
        const employer = dataStore.findUserById(job.employer_id);
        const jobWithEmployer = {
            ...job,
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

        res.status(200).json({
            success: true,
            job: jobWithEmployer
        });
    } catch (error) {
        console.error('Get job error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching job',
            error: error.message
        });
    }
});

// @route   POST /api/jobs
// @desc    Create a new job
// @access  Private (Employer only)
router.post('/', protect, authorize('employer'), async (req, res) => {
    try {
        const jobData = {
            title: req.body.title,
            description: req.body.description,
            responsibilities: req.body.responsibilities,
            qualifications: req.body.qualifications,
            job_type: req.body.jobType,
            location: req.body.location,
            salary_min: req.body.salaryRange?.min || req.body.salaryMin,
            salary_max: req.body.salaryRange?.max || req.body.salaryMax,
            salary_currency: req.body.salaryRange?.currency || 'USD',
            experience_level: req.body.experienceLevel,
            skills: req.body.skills || [],
            benefits: req.body.benefits || [],
            employer_id: req.user.id,
            company_name: req.user.company_name || req.body.companyName,
            status: req.body.status || 'active',
            deadline: req.body.deadline || null
        };

        const job = dataStore.createJob(jobData);

        res.status(201).json({
            success: true,
            message: 'Job created successfully',
            job
        });
    } catch (error) {
        console.error('Create job error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating job',
            error: error.message
        });
    }
});

// @route   PUT /api/jobs/:id
// @desc    Update a job
// @access  Private (Employer only - own jobs)
router.put('/:id', protect, authorize('employer'), async (req, res) => {
    try {
        const existingJob = dataStore.findJobById(req.params.id);

        if (!existingJob) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        if (existingJob.employer_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this job'
            });
        }

        const updateData = {
            title: req.body.title,
            description: req.body.description,
            responsibilities: req.body.responsibilities,
            qualifications: req.body.qualifications,
            job_type: req.body.jobType,
            location: req.body.location,
            salary_min: req.body.salaryRange?.min || req.body.salaryMin,
            salary_max: req.body.salaryRange?.max || req.body.salaryMax,
            experience_level: req.body.experienceLevel,
            skills: req.body.skills,
            benefits: req.body.benefits,
            status: req.body.status,
            deadline: req.body.deadline
        };

        // Remove undefined values
        Object.keys(updateData).forEach(key =>
            updateData[key] === undefined && delete updateData[key]
        );

        const job = dataStore.updateJob(req.params.id, updateData);

        res.status(200).json({
            success: true,
            message: 'Job updated successfully',
            job
        });
    } catch (error) {
        console.error('Update job error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating job',
            error: error.message
        });
    }
});

// @route   DELETE /api/jobs/:id
// @desc    Delete a job
// @access  Private (Employer only - own jobs)
router.delete('/:id', protect, authorize('employer'), async (req, res) => {
    try {
        const job = dataStore.findJobById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        if (job.employer_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this job'
            });
        }

        dataStore.deleteJob(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Job deleted successfully'
        });
    } catch (error) {
        console.error('Delete job error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting job',
            error: error.message
        });
    }
});

// @route   GET /api/jobs/employer/my-jobs
// @desc    Get employer's jobs
// @access  Private (Employer only)
router.get('/employer/my-jobs', protect, authorize('employer'), async (req, res) => {
    try {
        const jobs = dataStore.findJobs({ employer_id: req.user.id });

        res.status(200).json({
            success: true,
            count: jobs.length,
            jobs
        });
    } catch (error) {
        console.error('Get my jobs error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching jobs',
            error: error.message
        });
    }
});

export default router;
