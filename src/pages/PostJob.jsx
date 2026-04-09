import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './PostJob.css';

const PostJob = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        companyName: '',
        location: '',
        jobType: 'Full-time',
        experienceLevel: 'Entry Level',
        salaryMin: '',
        salaryMax: '',
        description: '',
        responsibilities: '',
        qualifications: '',
        skills: '',
        benefits: '',
        deadline: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Convert comma-separated strings to arrays
            const payload = {
                ...formData,
                skills: formData.skills.split(',').map(s => s.trim()),
                benefits: formData.benefits.split(',').map(b => b.trim()),
                salaryRange: {
                    min: Number(formData.salaryMin),
                    max: Number(formData.salaryMax),
                    currency: 'USD'
                }
            };

            const response = await fetch('http://localhost:5000/api/jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to post job');
            }

            navigate('/jobs');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="post-job-page fade-in">
            <div className="container">
                <div className="form-card glass-card">
                    <div className="form-header text-center">
                        <h1 className="page-title">Post a <span className="gradient-text">New Job</span></h1>
                        <p className="page-subtitle">Find the perfect candidate for your team</p>
                    </div>

                    {error && <div className="alert alert-error">{error}</div>}

                    <form onSubmit={handleSubmit} className="job-form">
                        {/* Basic Info */}
                        <div className="form-section">
                            <h3 className="section-heading">Basic Information</h3>
                            <div className="grid-2">
                                <div className="form-group">
                                    <label className="form-label">Job Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        className="form-input"
                                        placeholder="e.g. Senior React Developer"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Company Name</label>
                                    <input
                                        type="text"
                                        name="companyName"
                                        className="form-input"
                                        placeholder="Your Company Name"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid-2">
                                <div className="form-group">
                                    <label className="form-label">Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        className="form-input"
                                        placeholder="e.g. San Francisco, CA (or Remote)"
                                        value={formData.location}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Job Type</label>
                                    <select
                                        name="jobType"
                                        className="form-select"
                                        value={formData.jobType}
                                        onChange={handleChange}
                                    >
                                        <option value="Full-time">Full-time</option>
                                        <option value="Part-time">Part-time</option>
                                        <option value="Contract">Contract</option>
                                        <option value="Internship">Internship</option>
                                        <option value="Freelance">Freelance</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="form-section">
                            <h3 className="section-heading">Job Details</h3>
                            <div className="grid-3">
                                <div className="form-group">
                                    <label className="form-label">Experience Level</label>
                                    <select
                                        name="experienceLevel"
                                        className="form-select"
                                        value={formData.experienceLevel}
                                        onChange={handleChange}
                                    >
                                        <option value="Entry Level">Entry Level</option>
                                        <option value="Mid Level">Mid Level</option>
                                        <option value="Senior Level">Senior Level</option>
                                        <option value="Executive">Executive</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Min Salary ($)</label>
                                    <input
                                        type="number"
                                        name="salaryMin"
                                        className="form-input"
                                        placeholder="e.g. 80000"
                                        value={formData.salaryMin}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Max Salary ($)</label>
                                    <input
                                        type="number"
                                        name="salaryMax"
                                        className="form-input"
                                        placeholder="e.g. 120000"
                                        value={formData.salaryMax}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Skills (Comma separated)</label>
                                <input
                                    type="text"
                                    name="skills"
                                    className="form-input"
                                    placeholder="e.g. React, Node.js, TypeScript, PostgreSQL"
                                    value={formData.skills}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Benefits (Comma separated)</label>
                                <input
                                    type="text"
                                    name="benefits"
                                    className="form-input"
                                    placeholder="e.g. Health Insurance, Remote Work, 401k"
                                    value={formData.benefits}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Application Deadline</label>
                                <input
                                    type="date"
                                    name="deadline"
                                    className="form-input"
                                    value={formData.deadline}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="form-section">
                            <h3 className="section-heading">Description</h3>
                            <div className="form-group">
                                <label className="form-label">Job Description</label>
                                <textarea
                                    name="description"
                                    className="form-textarea"
                                    rows="6"
                                    placeholder="Describe the role and responsibilities..."
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Key Responsibilities</label>
                                <textarea
                                    name="responsibilities"
                                    className="form-textarea"
                                    rows="4"
                                    placeholder="List the main duties..."
                                    value={formData.responsibilities}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Qualifications</label>
                                <textarea
                                    name="qualifications"
                                    className="form-textarea"
                                    rows="4"
                                    placeholder="List required qualifications..."
                                    value={formData.qualifications}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>
                        </div>

                        <div className="form-actions text-right">
                            <button
                                type="button"
                                className="btn btn-ghost"
                                onClick={() => navigate('/employer/dashboard')}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary btn-lg"
                                disabled={loading}
                            >
                                {loading ? <span className="spinner-sm"></span> : 'Post Job'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PostJob;
