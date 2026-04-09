import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const EmployerDashboard = () => {
    const { user, token } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('jobs');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Fetch Employer's Jobs
            const jobsRes = await fetch('http://localhost:5000/api/jobs/employer/my-jobs', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const jobsData = await jobsRes.json();
            if (jobsData.success) setJobs(jobsData.jobs);

            // Fetch Applications
            const appsRes = await fetch('http://localhost:5000/api/applications/employer/all', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const appsData = await appsRes.json();
            if (appsData.success) setApplications(appsData.applications);

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteJob = async (id) => {
        if (!window.confirm('Are you sure you want to delete this job?')) return;

        try {
            const response = await fetch(`http://localhost:5000/api/jobs/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                setJobs(jobs.filter(job => job.id !== id));
            }
        } catch (error) {
            console.error('Error deleting job:', error);
        }
    };

    const handleStatusUpdate = async (appId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:5000/api/applications/${appId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                setApplications(applications.map(app =>
                    app.id === appId ? { ...app, status: newStatus } : app
                ));
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    if (loading) return <div className="loading-state"><div className="spinner"></div></div>;

    return (
        <div className="dashboard-page fade-in">
            <div className="container">
                <div className="dashboard-header text-center">
                    <h1 className="page-title">Employer <span className="gradient-text">Dashboard</span></h1>
                    <p className="page-subtitle">Welcome back, {user?.name}</p>

                    <div className="dashboard-actions">
                        <Link to="/employer/post-job" className="btn btn-primary btn-lg">
                            + Post New Job
                        </Link>
                    </div>
                </div>

                <div className="dashboard-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'jobs' ? 'active' : ''}`}
                        onClick={() => setActiveTab('jobs')}
                    >
                        My Jobs ({jobs.length})
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
                        onClick={() => setActiveTab('applications')}
                    >
                        Applications ({applications.length})
                    </button>
                </div>

                <div className="dashboard-content glass-card">
                    {activeTab === 'jobs' ? (
                        <div className="jobs-list">
                            {jobs.length > 0 ? (
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Job Title</th>
                                            <th>Location</th>
                                            <th>Type</th>
                                            <th>Posted</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {jobs.map(job => (
                                            <tr key={job.id}>
                                                <td className="font-medium text-white">{job.title}</td>
                                                <td>{job.location}</td>
                                                <td>
                                                    <span className="badge badge-primary">{job.job_type}</span>
                                                </td>
                                                <td>{new Date(job.created_at).toLocaleDateString()}</td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <Link to={`/jobs/${job.id}`} className="btn-icon">👁️</Link>
                                                        <button
                                                            onClick={() => handleDeleteJob(job.id)}
                                                            className="btn-icon btn-delete"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="empty-state">
                                    <p>You haven't posted any jobs yet.</p>
                                    <Link to="/employer/post-job" className="btn btn-outline mt-md">Post Your First Job</Link>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="applications-list">
                            {applications.length > 0 ? (
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Applicant</th>
                                            <th>Job Title</th>
                                            <th>Applied On</th>
                                            <th>Resume</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {applications.map(app => (
                                            <tr key={app.id}>
                                                <td>
                                                    <div className="applicant-info">
                                                        <div className="applicant-name">{app.jobSeeker?.name}</div>
                                                        <div className="applicant-email">{app.jobSeeker?.email}</div>
                                                        <details style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
                                                            <summary style={{ cursor: 'pointer', color: 'var(--primary-light)' }}>More Details</summary>
                                                            <div style={{ padding: '0.5rem 0', color: 'var(--text-secondary)' }}>
                                                                {app.jobSeeker?.phone && <div><strong>Phone:</strong> {app.jobSeeker?.phone}</div>}
                                                                {app.jobSeeker?.location && <div><strong>Location:</strong> {app.jobSeeker?.location}</div>}
                                                                {app.jobSeeker?.bio && <div style={{ marginTop: '0.5rem' }}><strong>Bio:</strong> {app.jobSeeker?.bio}</div>}
                                                                {app.jobSeeker?.education && <div style={{ marginTop: '0.5rem' }}><strong>Education:</strong> <span style={{ whiteSpace: 'pre-wrap' }}>{app.jobSeeker?.education}</span></div>}
                                                                {app.jobSeeker?.experience && <div style={{ marginTop: '0.5rem' }}><strong>Experience:</strong> <span style={{ whiteSpace: 'pre-wrap' }}>{app.jobSeeker?.experience}</span></div>}
                                                                {app.cover_letter && <div style={{ marginTop: '0.5rem' }}><strong>Cover Letter:</strong> <span style={{ whiteSpace: 'pre-wrap' }}>{app.cover_letter}</span></div>}
                                                            </div>
                                                        </details>
                                                    </div>
                                                </td>
                                                <td>{app.job?.title}</td>
                                                <td>{new Date(app.applied_at).toLocaleDateString()}</td>
                                                <td>
                                                    {app.resume_url && (
                                                        <a href={`http://localhost:5000/${app.resume_url}`} target="_blank" rel="noopener noreferrer" className="text-link">
                                                            View Resume
                                                        </a>
                                                    )}
                                                </td>
                                                <td>
                                                    <span className={`status-badge status-${app.status.toLowerCase()}`}>
                                                        {app.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <select
                                                        value={app.status}
                                                        onChange={(e) => handleStatusUpdate(app.id, e.target.value)}
                                                        className="status-select"
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="reviewed">Reviewed</option>
                                                        <option value="interviewed">Interviewed</option>
                                                        <option value="hired">Hired</option>
                                                        <option value="rejected">Rejected</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="empty-state">
                                    <p>No applications received yet.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmployerDashboard;
