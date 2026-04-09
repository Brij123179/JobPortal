import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a job title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please provide a job description']
    },
    responsibilities: {
        type: String,
        required: [true, 'Please provide job responsibilities']
    },
    qualifications: {
        type: String,
        required: [true, 'Please provide required qualifications']
    },
    jobType: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'],
        required: [true, 'Please specify job type']
    },
    location: {
        type: String,
        required: [true, 'Please provide job location']
    },
    salaryRange: {
        min: {
            type: Number,
            required: true
        },
        max: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            default: 'USD'
        }
    },
    experienceLevel: {
        type: String,
        enum: ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'],
        required: true
    },
    skills: [{
        type: String
    }],
    benefits: [{
        type: String
    }],
    employer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'closed', 'draft'],
        default: 'active'
    },
    applicationsCount: {
        type: Number,
        default: 0
    },
    deadline: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for search optimization
jobSchema.index({ title: 'text', description: 'text', skills: 'text' });
jobSchema.index({ jobType: 1, location: 1, status: 1 });

const Job = mongoose.model('Job', jobSchema);

export default Job;
