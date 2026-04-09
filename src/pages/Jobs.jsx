import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Jobs.css';

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        keyword: '',
        location: '',
        jobType: ''
    });

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            let query = new URLSearchParams();
            if (filters.keyword) query.append('keyword', filters.keyword);
            if (filters.location) query.append('location', filters.location);
            if (filters.jobType) query.append('jobType', filters.jobType);

            const response = await fetch(`http://localhost:5000/api/jobs?${query.toString()}`);
            const data = await response.json();

            if (data.success) {
                setJobs(data.jobs);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchJobs();
    };

    const handleChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="jobs-page fade-in">
            <div className="container">
                <div className="page-header text-center">
                    <h1 className="page-title">
                        Find Your Next <span className="gradient-text">Opportunity</span>
                    </h1>
                    <p className="page-subtitle">
                        Browse thousands of job listings from top companies
                    </p>
                </div>

                {/* Search & Filter Section */}
                <div className="search-section glass-card">
                    <form onSubmit={handleSearch} className="search-form">
                        <div className="search-grid">
                            <div className="form-group mb-0">
                                <div className="input-icon-wrapper">
                                    <span className="input-icon">🔍</span>
                                    <input
                                        type="text"
                                        name="keyword"
                                        className="form-input has-icon"
                                        placeholder="Job title, keywords, or company"
                                        value={filters.keyword}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="form-group mb-0">
                                <div className="input-icon-wrapper">
                                    <span className="input-icon">📍</span>
                                    <input
                                        type="text"
                                        name="location"
                                        className="form-input has-icon"
                                        placeholder="City, state, or remote"
                                        value={filters.location}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="form-group mb-0">
                                <select
                                    name="jobType"
                                    className="form-select"
                                    value={filters.jobType}
                                    onChange={handleChange}
                                >
                                    <option value="">All Job Types</option>
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Contract">Contract</option>
                                    <option value="Internship">Internship</option>
                                    <option value="Freelance">Freelance</option>
                                </select>
                            </div>
                            <button type="submit" className="btn btn-primary">
                                Search Jobs
                            </button>
                        </div>
                    </form>
                </div>

                {/* Results Section */}
                <div className="jobs-results">
                    {loading ? (
                        <div className="loading-state text-center">
                            <div className="spinner"></div>
                            <p className="mt-md">Loading jobs...</p>
                        </div>
                    ) : jobs.length > 0 ? (
                        <div className="jobs-grid">
                            {jobs.map((job, index) => (
                                <Link
                                    to={`/jobs/${job.id}`}
                                    key={job.id}
                                    className="job-card glass-card scale-in"
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    <div className="job-header">
                                        <div className="company-logo-placeholder">
                                            {job.company_name?.charAt(0) || 'C'}
                                        </div>
                                        <div>
                                            <h3 className="job-title">{job.title}</h3>
                                            <p className="company-name">{job.company_name}</p>
                                        </div>
                                    </div>

                                    <div className="job-tags">
                                        <span className="tag tag-location">📍 {job.location}</span>
                                        <span className="tag tag-type">💼 {job.job_type}</span>
                                        {job.salary_min && (
                                            <span className="tag tag-salary">💰 ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}</span>
                                        )}
                                    </div>

                                    <p className="job-description">
                                        {job.description?.substring(0, 150)}...
                                    </p>

                                    <div className="job-footer">
                                        <span className="posted-date">
                                            Posted {new Date(job.created_at).toLocaleDateString()}
                                        </span>
                                        <span className="btn-link">View Details →</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state glass-card text-center">
                            <div className="empty-icon">🔍</div>
                            <h3>No jobs found</h3>
                            <p>Try adjusting your search criteria or browse all jobs.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Jobs;
