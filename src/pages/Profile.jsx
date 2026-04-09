import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
    const { user, updateUser, token, isJobSeeker } = useAuth();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: '',
        companyName: '',
        companyDescription: '',
        website: '',
        industry: '',
        phone: '',
        skills: '',
        experience: '',
        education: '',
        location: '',
        bio: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                role: user.role || '',
                companyName: user.company_name || '',
                companyDescription: user.companyDescription || '',
                website: user.website || '',
                industry: user.industry || '',
                phone: user.phone || '',
                skills: Array.isArray(user.skills) ? user.skills.join(', ') : (user.skills || ''),
                experience: user.experience || '',
                education: user.education || '',
                location: user.location || '',
                bio: user.bio || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const payload = {
                ...formData,
                skills: formData.skills.includes(',')
                    ? formData.skills.split(',').map(s => s.trim())
                    : formData.skills
            };

            const response = await fetch('http://localhost:5000/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                updateUser(data.user);
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to update profile' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-page fade-in">
            <div className="container">
                <div className="profile-wrapper glass-card">
                    <div className="profile-sidebar">
                        <div className="profile-header text-center">
                            <div className="avatar-large">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                            <h3>{user?.name}</h3>
                            <p className="role-badge">{user?.role === 'employer' ? 'Employer' : 'Job Seeker'}</p>
                        </div>
                    </div>

                    <div className="profile-content">
                        <h2 className="section-title">Edit Profile</h2>

                        {message && (
                            <div className={`alert alert-${message.type}`}>
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="profile-form">
                            <div className="grid-2">
                                <div className="form-group">
                                    <label className="form-label">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-input"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-input"
                                        value={formData.email}
                                        disabled
                                        style={{ opacity: 0.6 }}
                                    />
                                </div>
                            </div>

                            <div className="grid-2">
                                <div className="form-group">
                                    <label className="form-label">Phone</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        className="form-input"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+1 234 567 8900"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        className="form-input"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="City, Country"
                                    />
                                </div>
                            </div>

                            {user?.role === 'employer' ? (
                                <>
                                    <div className="grid-2">
                                        <div className="form-group">
                                            <label className="form-label">Company Name</label>
                                            <input
                                                type="text"
                                                name="companyName"
                                                className="form-input"
                                                value={formData.companyName}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Industry</label>
                                            <input
                                                type="text"
                                                name="industry"
                                                className="form-input"
                                                value={formData.industry}
                                                onChange={handleChange}
                                                placeholder="e.g. Technology, Healthcare, Finance"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Website</label>
                                        <input
                                            type="url"
                                            name="website"
                                            className="form-input"
                                            value={formData.website}
                                            onChange={handleChange}
                                            placeholder="https://example.com"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Company Description</label>
                                        <textarea
                                            name="companyDescription"
                                            className="form-textarea"
                                            value={formData.companyDescription}
                                            onChange={handleChange}
                                            placeholder="Describe your company and its mission..."
                                            rows="4"
                                        ></textarea>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="form-group">
                                        <label className="form-label">Professional Bio</label>
                                        <textarea
                                            name="bio"
                                            className="form-textarea"
                                            value={formData.bio}
                                            onChange={handleChange}
                                            placeholder="Tell us a little about yourself..."
                                            rows="3"
                                        ></textarea>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Skills (Comma separated)</label>
                                        <input
                                            type="text"
                                            name="skills"
                                            className="form-input"
                                            value={formData.skills}
                                            onChange={handleChange}
                                            placeholder="React, Java, Design..."
                                        />
                                    </div>
                                    <div className="grid-2">
                                        <div className="form-group">
                                            <label className="form-label">Experience</label>
                                            <textarea
                                                name="experience"
                                                className="form-textarea"
                                                value={formData.experience}
                                                onChange={handleChange}
                                                placeholder="Describe your work experience..."
                                                rows="4"
                                            ></textarea>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Education</label>
                                            <textarea
                                                name="education"
                                                className="form-textarea"
                                                value={formData.education}
                                                onChange={handleChange}
                                                placeholder="Describe your educational background..."
                                                rows="4"
                                            ></textarea>
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="form-actions text-right">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
