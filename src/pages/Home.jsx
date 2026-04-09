import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
    const { isAuthenticated, isEmployer } = useAuth();

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container">
                    <div className="hero-content fade-in">
                        <h1 className="hero-title">
                            Find Your Dream Job
                            <span className="gradient-text"> Today</span>
                        </h1>
                        <p className="hero-subtitle">
                            Connect with top employers and discover opportunities that match your skills and aspirations.
                            Your next career move starts here.
                        </p>
                        <div className="hero-actions">
                            {!isAuthenticated ? (
                                <>
                                    <Link to="/register" className="btn btn-primary btn-lg">
                                        Get Started
                                    </Link>
                                    <Link to="/jobs" className="btn btn-outline btn-lg">
                                        Browse Jobs
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/jobs" className="btn btn-primary btn-lg">
                                        Browse Jobs
                                    </Link>
                                    {isEmployer && (
                                        <Link to="/employer/post-job" className="btn btn-secondary btn-lg">
                                            Post a Job
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="stats-grid">
                        <div className="stat-card glass-card scale-in">
                            <div className="stat-icon">💼</div>
                            <div className="stat-number">10,000+</div>
                            <div className="stat-label">Active Jobs</div>
                        </div>
                        <div className="stat-card glass-card scale-in" style={{ animationDelay: '0.1s' }}>
                            <div className="stat-icon">🏢</div>
                            <div className="stat-number">5,000+</div>
                            <div className="stat-label">Companies</div>
                        </div>
                        <div className="stat-card glass-card scale-in" style={{ animationDelay: '0.2s' }}>
                            <div className="stat-icon">👥</div>
                            <div className="stat-number">50,000+</div>
                            <div className="stat-label">Job Seekers</div>
                        </div>
                        <div className="stat-card glass-card scale-in" style={{ animationDelay: '0.3s' }}>
                            <div className="stat-icon">✨</div>
                            <div className="stat-number">95%</div>
                            <div className="stat-label">Success Rate</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <h2 className="section-title text-center">
                        Why Choose <span className="gradient-text">JobPortal</span>
                    </h2>
                    <p className="section-subtitle text-center">
                        Everything you need to find the perfect job or hire the best talent
                    </p>

                    <div className="features-grid">
                        <div className="feature-card glass-card fade-in">
                            <div className="feature-icon">🔍</div>
                            <h3 className="feature-title">Advanced Search</h3>
                            <p className="feature-description">
                                Filter jobs by location, salary, type, and more to find exactly what you're looking for.
                            </p>
                        </div>

                        <div className="feature-card glass-card fade-in" style={{ animationDelay: '0.1s' }}>
                            <div className="feature-icon">🚀</div>
                            <h3 className="feature-title">Easy Application</h3>
                            <p className="feature-description">
                                Apply to multiple jobs with one click. Upload your resume once and use it everywhere.
                            </p>
                        </div>

                        <div className="feature-card glass-card fade-in" style={{ animationDelay: '0.2s' }}>
                            <div className="feature-icon">📊</div>
                            <h3 className="feature-title">Track Applications</h3>
                            <p className="feature-description">
                                Monitor your application status in real-time with our intuitive dashboard.
                            </p>
                        </div>

                        <div className="feature-card glass-card fade-in" style={{ animationDelay: '0.3s' }}>
                            <div className="feature-icon">🔒</div>
                            <h3 className="feature-title">Secure & Private</h3>
                            <p className="feature-description">
                                Your data is protected with industry-standard security and encryption.
                            </p>
                        </div>

                        <div className="feature-card glass-card fade-in" style={{ animationDelay: '0.4s' }}>
                            <div className="feature-icon">💬</div>
                            <h3 className="feature-title">Direct Communication</h3>
                            <p className="feature-description">
                                Connect directly with employers and get real-time updates on your applications.
                            </p>
                        </div>

                        <div className="feature-card glass-card fade-in" style={{ animationDelay: '0.5s' }}>
                            <div className="feature-icon">📱</div>
                            <h3 className="feature-title">Mobile Friendly</h3>
                            <p className="feature-description">
                                Access the portal from any device. Job hunting on the go has never been easier.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-card glass-card">
                        <h2 className="cta-title">Ready to Take the Next Step?</h2>
                        <p className="cta-description">
                            Join thousands of job seekers and employers who have found success with JobPortal
                        </p>
                        <div className="cta-actions">
                            <Link to="/register" className="btn btn-primary btn-lg">
                                Create Account
                            </Link>
                            <Link to="/jobs" className="btn btn-outline btn-lg">
                                Explore Jobs
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
