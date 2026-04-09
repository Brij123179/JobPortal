import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, isAuthenticated, logout, isEmployer, isJobSeeker } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="container">
                <div className="navbar-content">
                    <Link to="/" className="navbar-brand">
                        <div className="brand-icon">💼</div>
                        <span className="brand-text">JobPortal</span>
                    </Link>

                    <div className="navbar-menu">
                        <Link to="/jobs" className="nav-link">
                            Browse Jobs
                        </Link>

                        {isAuthenticated ? (
                            <>
                                {isEmployer && (
                                    <>
                                        <Link to="/employer/dashboard" className="nav-link">
                                            Dashboard
                                        </Link>
                                        <Link to="/employer/post-job" className="nav-link">
                                            Post Job
                                        </Link>
                                    </>
                                )}

                                {isJobSeeker && (
                                    <>
                                        <Link to="/jobseeker/dashboard" className="nav-link">
                                            Dashboard
                                        </Link>
                                        <Link to="/jobseeker/applications" className="nav-link">
                                            My Applications
                                        </Link>
                                    </>
                                )}

                                <Link to="/profile" className="nav-link">
                                    Profile
                                </Link>

                                <div className="navbar-user">
                                    <span className="user-name">{user?.name}</span>
                                    <button onClick={handleLogout} className="btn btn-ghost btn-sm">
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-ghost btn-sm">
                                    Login
                                </Link>
                                <Link to="/register" className="btn btn-primary btn-sm">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
