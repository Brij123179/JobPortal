import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        element: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'jobseeker',
        companyName: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (formData.password !== formData.confirmPassword) {
                throw new Error("Passwords don't match");
            }

            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            login(data.user, data.token);
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="container">
                <div className="auth-card glass-card slide-in-right">
                    <h2 className="auth-title text-center">Create an Account</h2>
                    <p className="auth-subtitle text-center">
                        Join JobPortal today
                    </p>

                    {error && (
                        <div className="alert alert-error">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group role-selector">
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="role"
                                    value="jobseeker"
                                    checked={formData.role === 'jobseeker'}
                                    onChange={handleChange}
                                />
                                <span className="radio-tile">
                                    <span className="radio-icon">👤</span>
                                    <span className="radio-label-text">Job Seeker</span>
                                </span>
                            </label>

                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="role"
                                    value="employer"
                                    checked={formData.role === 'employer'}
                                    onChange={handleChange}
                                />
                                <span className="radio-tile">
                                    <span className="radio-icon">🏢</span>
                                    <span className="radio-label-text">Employer</span>
                                </span>
                            </label>
                        </div>

                        <div className="form-group">
                            <label htmlFor="name" className="form-label">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="form-input"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {formData.role === 'employer' && (
                            <div className="form-group fade-in">
                                <label htmlFor="companyName" className="form-label">Company Name</label>
                                <input
                                    type="text"
                                    id="companyName"
                                    name="companyName"
                                    className="form-input"
                                    placeholder="Tech Corp Inc."
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="form-input"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="form-input"
                                placeholder="********"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength="6"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                className="form-input"
                                placeholder="********"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                minLength="6"
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-block"
                            disabled={loading}
                        >
                            {loading ? <div className="spinner-sm"></div> : 'Register'}
                        </button>
                    </form>

                    <div className="auth-footer text-center">
                        <p>
                            Already have an account?{' '}
                            <Link to="/login" className="text-link">
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
