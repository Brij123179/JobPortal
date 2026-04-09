import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const JobSeekerDashboard = () => {
    const { user, token } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/applications/my-applications', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.success) {
                    setApplications(data.applications);
                }
            } catch (error) {
                console.error('Error fetching applications:', error);
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchApplications();
    }, [token]);

    if (loading) return <div className="loading-state"><div className="spinner"></div></div>;

    return (
        <div className="dashboard-page fade-in">
            <div className="container">
                <div className="dashboard-header text-center">
                    <h1 className="page-title">My <span className="gradient-text">Applications</span></h1>
                    <p className="page-subtitle">Track the status of your job applications</p>
                </div>

                <div className="dashboard-content glass-card">
                    {applications.length > 0 ? (
                        <div className="table-responsive">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Job Title</th>
                                        <th>Company</th>
                                        <th>Applied Date</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applications.map(app => (
                                        <tr key={app._id || app.id}>
                                            <td className="font-medium text-white">{app.job?.title || 'Unknown Job'}</td>
                                            <td>{app.employer?.company_name || 'Unknown Company'}</td>
                                            <td>{new Date(app.applied_at).toLocaleDateString()}</td>
                                            <td>
                                                <span className={`status-badge status-${app.status?.toLowerCase() || 'pending'}`}>
                                                    {app.status || 'Pending'}
                                                </span>
                                            </td>
                                            <td>
                                                <Link to={`/jobs/${app.job?.id}`} className="btn btn-sm btn-outline">
                                                    View Job
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="empty-state text-center">
                            <div className="empty-icon">📂</div>
                            <h3>No applications yet</h3>
                            <p className="mb-md">You haven't applied to any jobs yet.</p>
                            <Link to="/jobs" className="btn btn-primary">Browse Jobs</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobSeekerDashboard;
