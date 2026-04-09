import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Briefcase, Building2, Users, Star, Search, Rocket, LineChart, ShieldCheck, MessageSquare, Smartphone } from 'lucide-react';
import './Home.css';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
        opacity: 1, 
        transition: { staggerChildren: 0.15 } 
    }
};

const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
        y: 0, 
        opacity: 1, 
        transition: { type: 'spring', stiffness: 100, damping: 10 } 
    }
};

const Home = () => {
    const { isAuthenticated, isEmployer } = useAuth();

    return (
        <div className="home-page" style={{ overflow: 'hidden' }}>
            {/* Hero Section */}
            <section className="hero-section" style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', zIndex: 0 }}>
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.5 }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                        style={{
                            position: 'absolute', top: '25%', left: '25%', width: '384px', height: '384px',
                            background: 'var(--primary-600)', borderRadius: '50%', filter: 'blur(64px)', opacity: 0.2
                        }}
                    />
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1.2, opacity: 0.5 }}
                        transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", delay: 1 }}
                        style={{
                            position: 'absolute', top: '33%', right: '25%', width: '384px', height: '384px',
                            background: 'var(--secondary-500)', borderRadius: '50%', filter: 'blur(64px)', opacity: 0.2
                        }}
                    />
                </div>
                
                <div className="container" style={{ position: 'relative', zIndex: 10 }}>
                    <motion.div 
                        className="hero-content"
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                    >
                        <motion.h1 variants={itemVariants} className="hero-title">
                            Find Your Dream Job
                            <span className="gradient-text"> Today</span>
                        </motion.h1>
                        <motion.p variants={itemVariants} className="hero-subtitle">
                            Connect with top employers and discover opportunities that match your skills and aspirations.
                            Your next career move starts here.
                        </motion.p>
                        <motion.div variants={itemVariants} className="hero-actions">
                            {!isAuthenticated ? (
                                <>
                                    <Link to="/register" className="btn btn-primary btn-lg" style={{ borderRadius: '9999px' }}>
                                        Get Started
                                    </Link>
                                    <Link to="/jobs" className="btn btn-outline btn-lg" style={{ borderRadius: '9999px' }}>
                                        Browse Jobs
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/jobs" className="btn btn-primary btn-lg" style={{ borderRadius: '9999px' }}>
                                        Browse Jobs
                                    </Link>
                                    {isEmployer && (
                                        <Link to="/employer/post-job" className="btn btn-secondary btn-lg" style={{ borderRadius: '9999px' }}>
                                            Post a Job
                                        </Link>
                                    )}
                                </>
                            )}
                        </motion.div>
                    </motion.div>

                    {/* Stats */}
                    <motion.div 
                        className="stats-grid"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={containerVariants}
                        style={{ marginTop: '5rem' }}
                    >
                        <motion.div variants={itemVariants} className="stat-card glass-card">
                            <div className="stat-icon" style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}><Briefcase size={40} color="var(--primary-400)" /></div>
                            <div className="stat-number">10,000+</div>
                            <div className="stat-label">Active Jobs</div>
                        </motion.div>
                        <motion.div variants={itemVariants} className="stat-card glass-card">
                            <div className="stat-icon" style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}><Building2 size={40} color="var(--secondary-400)" /></div>
                            <div className="stat-number">5,000+</div>
                            <div className="stat-label">Companies</div>
                        </motion.div>
                        <motion.div variants={itemVariants} className="stat-card glass-card">
                            <div className="stat-icon" style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}><Users size={40} color="var(--accent-400)" /></div>
                            <div className="stat-number">50,000+</div>
                            <div className="stat-label">Job Seekers</div>
                        </motion.div>
                        <motion.div variants={itemVariants} className="stat-card glass-card">
                            <div className="stat-icon" style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}><Star size={40} color="hsl(45, 90%, 55%)" /></div>
                            <div className="stat-number">95%</div>
                            <div className="stat-label">Success Rate</div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section" style={{ position: 'relative', zIndex: 10 }}>
                <div className="container">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                        style={{ marginBottom: '4rem' }}
                    >
                        <h2 className="section-title text-center">
                            Why Choose <span className="gradient-text">JobPortal</span>
                        </h2>
                        <p className="section-subtitle text-center">
                            Everything you need to find the perfect job or hire the best talent
                        </p>
                    </motion.div>

                    <motion.div 
                        className="features-grid"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={containerVariants}
                    >
                        <motion.div variants={itemVariants} whileHover={{ y: -10 }} className="feature-card glass-card">
                            <div className="feature-icon"><Search size={32} color="var(--primary-400)" /></div>
                            <h3 className="feature-title">Advanced Search</h3>
                            <p className="feature-description">
                                Filter jobs by location, salary, type, and more to find exactly what you're looking for.
                            </p>
                        </motion.div>

                        <motion.div variants={itemVariants} whileHover={{ y: -10 }} className="feature-card glass-card">
                            <div className="feature-icon"><Rocket size={32} color="var(--secondary-400)" /></div>
                            <h3 className="feature-title">Easy Application</h3>
                            <p className="feature-description">
                                Apply to multiple jobs with one click. Upload your resume once and use it everywhere.
                            </p>
                        </motion.div>

                        <motion.div variants={itemVariants} whileHover={{ y: -10 }} className="feature-card glass-card">
                            <div className="feature-icon"><LineChart size={32} color="var(--accent-400)" /></div>
                            <h3 className="feature-title">Track Applications</h3>
                            <p className="feature-description">
                                Monitor your application status in real-time with our intuitive dashboard.
                            </p>
                        </motion.div>

                        <motion.div variants={itemVariants} whileHover={{ y: -10 }} className="feature-card glass-card">
                            <div className="feature-icon"><ShieldCheck size={32} color="hsl(0, 70%, 60%)" /></div>
                            <h3 className="feature-title">Secure & Private</h3>
                            <p className="feature-description">
                                Your data is protected with industry-standard security and encryption.
                            </p>
                        </motion.div>

                        <motion.div variants={itemVariants} whileHover={{ y: -10 }} className="feature-card glass-card">
                            <div className="feature-icon"><MessageSquare size={32} color="hsl(45, 90%, 55%)" /></div>
                            <h3 className="feature-title">Direct Communication</h3>
                            <p className="feature-description">
                                Connect directly with employers and get real-time updates on your applications.
                            </p>
                        </motion.div>

                        <motion.div variants={itemVariants} whileHover={{ y: -10 }} className="feature-card glass-card">
                            <div className="feature-icon"><Smartphone size={32} color="hsl(280, 70%, 60%)" /></div>
                            <h3 className="feature-title">Mobile Friendly</h3>
                            <p className="feature-description">
                                Access the portal from any device. Job hunting on the go has never been easier.
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section" style={{ position: 'relative', zIndex: 10 }}>
                <div className="container">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="cta-card glass-card"
                        style={{ position: 'relative', overflow: 'hidden' }}
                    >
                        <div style={{ position: 'absolute', top: '-5rem', right: '-5rem', width: '16rem', height: '16rem', background: 'var(--primary-600)', borderRadius: '50%', filter: 'blur(64px)', opacity: 0.2 }}></div>
                        <div style={{ position: 'absolute', bottom: '-5rem', left: '-5rem', width: '16rem', height: '16rem', background: 'var(--secondary-600)', borderRadius: '50%', filter: 'blur(64px)', opacity: 0.2 }}></div>
                        
                        <h2 className="cta-title" style={{ position: 'relative', zIndex: 10 }}>Ready to Take the Next Step?</h2>
                        <p className="cta-description" style={{ position: 'relative', zIndex: 10 }}>
                            Join thousands of job seekers and employers who have found success with JobPortal
                        </p>
                        <div className="cta-actions" style={{ position: 'relative', zIndex: 10 }}>
                            <Link to="/register" className="btn btn-primary btn-lg" style={{ borderRadius: '9999px' }}>
                                Create Account
                            </Link>
                            <Link to="/jobs" className="btn btn-outline btn-lg" style={{ borderRadius: '9999px' }}>
                                Explore Jobs
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Home;

