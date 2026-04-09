import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './JobDetails.css';

const JobDetails = () => {
    const { id } = useParams();
    const { isAuthenticated, isJobSeeker, token } = useAuth();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [applicationStatus, setApplicationStatus] = useState(null); // 'success', 'error', null
    const [coverLetter, setCoverLetter] = useState('');
    const [resumeFile, setResumeFile] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/jobs/${id}`);
                const data = await response.json();
                if (data.success) {
                    setJob(data.job);
                }
            } catch (error) {
                console.error('Error fetching job details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [id]);

    const handleApplyClick = () => {
        if (!isAuthenticated) return;
        setShowModal(true);
    };

    const handleApplySubmit = async (e) => {
        e.preventDefault();
        setApplying(true);
        setApplicationStatus(null);

        try {
            const formData = new FormData();
            formData.append('jobId', id);
            formData.append('coverLetter', coverLetter);
            if (resumeFile) {
                formData.append('resume', resumeFile);
            }

            const response = await fetch('http://localhost:5000/api/applications', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                setApplicationStatus('success');
                setShowModal(false);
                alert('Application submitted successfully!');
            } else {
                setApplicationStatus('error');
                alert(data.message || 'Failed to apply');
            }
        } catch (error) {
            console.error('Application error:', error);
            setApplicationStatus('error');
        } finally {
            setApplying(false);
        }
    };

    if (loading) {
        return (
            <div className="job-details-page">
                <div className="container text-center">
                    <div className="spinner"></div>
                    <p className="mt-md">Loading job details...</p>
                </div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="job-details-page">
                <div className="container text-center">
                    <h2>Job not found</h2>
                    <Link to="/jobs" className="btn btn-primary mt-md">Back to Jobs</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="job-details-page fade-in">
            <div className="job-header-section">
                <div className="container">
                    <div className="job-header-content glass-card">
                        <div className="header-top">
                            <div className="company-logo-large">
                                {job.company_name?.charAt(0) || 'C'}
                            </div>
                            <div className="header-info">
                                <h1 className="job-title-large">{job.title}</h1>
                                <div className="header-meta">
                                    <span className="company-name-large">🏢 {job.company_name}</span>
                                    <span className="location-large">📍 {job.location}</span>
                                    <span className="type-large">💼 {job.job_type}</span>
                                </div>
                            </div>
                            <div className="header-actions">
                                {isAuthenticated ? (
                                    isJobSeeker && (
                                        <button
                                            className={`btn btn-apply btn-lg ${applicationStatus === 'success' ? 'btn-success' : 'btn-primary'}`}
                                            onClick={handleApplyClick}
                                            disabled={applying || applicationStatus === 'success'}
                                        >
                                            {applying ? (
                                                <span className="spinner-sm"></span>
                                            ) : applicationStatus === 'success' ? (
                                                'Applied Successfully ✓'
                                            ) : (
                                                'Apply Now'
                                            )}
                                        </button>
                                    )
                                ) : (
                                    <Link to="/login" className="btn btn-primary btn-lg">
                                        Login to Apply
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="job-content-section">
                <div className="container">
                    <div className="content-grid">
                        <div className="main-content glass-card">
                            <section className="content-section">
                                <h3>About the Role</h3>
                                <p>{job.description}</p>
                            </section>

                            {job.responsibilities && (
                                <section className="content-section">
                                    <h3>Key Responsibilities</h3>
                                    <ul>
                                        {Array.isArray(job.responsibilities)
                                            ? job.responsibilities.map((item, i) => <li key={i}>{item}</li>)
                                            : <li className="pre-wrap">{job.responsibilities}</li>
                                        }
                                    </ul>
                                </section>
                            )}

                            {job.qualifications && (
                                <section className="content-section">
                                    <h3>Qualifications</h3>
                                    <ul>
                                        {Array.isArray(job.qualifications)
                                            ? job.qualifications.map((item, i) => <li key={i}>{item}</li>)
                                            : <li className="pre-wrap">{job.qualifications}</li>
                                        }
                                    </ul>
                                </section>
                            )}
                        </div>

                        <div className="sidebar">
                            <div className="sidebar-card glass-card">
                                <h3>Job Overview</h3>
                                <div className="overview-item">
                                    <span className="icon">💰</span>
                                    <div className="details">
                                        <span className="label">Salary</span>
                                        <span className="value">
                                            ${job.salary_min?.toLocaleString()} - ${job.salary_max?.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="overview-item">
                                    <span className="icon">📅</span>
                                    <div className="details">
                                        <span className="label">Posted</span>
                                        <span className="value">
                                            {new Date(job.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="overview-item">
                                    <span className="icon">🎓</span>
                                    <div className="details">
                                        <span className="label">Experience</span>
                                        <span className="value">{job.experience_level || 'Not specified'}</span>
                                    </div>
                                </div>

                                {job.skills && job.skills.length > 0 && (
                                    <div className="skills-section">
                                        <h4>Required Skills</h4>
                                        <div className="skills-tags">
                                            {job.skills.map((skill, i) => (
                                                <span key={i} className="skill-tag">{skill}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {job.employer && (
                                <div className="sidebar-card glass-card" style={{ marginTop: '1.5rem' }}>
                                    <h3>About {job.company_name}</h3>
                                    {job.employer.companyDescription && (
                                        <p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                            {job.employer.companyDescription}
                                        </p>
                                    )}
                                    {job.employer.industry && (
                                        <div className="overview-item">
                                            <span className="icon">🏗️</span>
                                            <div className="details">
                                                <span className="label">Industry</span>
                                                <span className="value">{job.employer.industry}</span>
                                            </div>
                                        </div>
                                    )}
                                    {job.employer.website && (
                                        <div className="overview-item">
                                            <span className="icon">🌐</span>
                                            <div className="details">
                                                <span className="label">Website</span>
                                                <span className="value text-ellipsis">
                                                    <a href={job.employer.website} target="_blank" rel="noopener noreferrer" className="text-link">
                                                        Visit Website
                                                    </a>
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content glass-card">
                        <h2>Apply for {job.title}</h2>
                        <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>

                        <form onSubmit={handleApplySubmit} className="application-form mt-md">
                            <div className="form-group">
                                <label>Cover Letter</label>
                                <textarea
                                    className="form-input"
                                    rows="5"
                                    placeholder="Tell the employer why you're a good fit..."
                                    value={coverLetter}
                                    onChange={(e) => setCoverLetter(e.target.value)}
                                    required
                                ></textarea>
                            </div>

                            <div className="form-group">
                                <label>Resume (Optional if already on profile)</label>
                                <input
                                    type="file"
                                    className="form-input"
                                    accept=".pdf,.doc,.docx"
                                    onChange={(e) => setResumeFile(e.target.files[0])}
                                />
                                <small className="text-secondary">Accepted formats: PDF, DOC, DOCX (Max 5MB)</small>
                            </div>

                            <div className="modal-actions mt-lg">
                                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={applying}>
                                    {applying ? 'Submitting...' : 'Submit Application'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobDetails;
