import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data)
};

// Jobs API
export const jobsAPI = {
    getAll: (params) => api.get('/jobs', { params }),
    getById: (id) => api.get(`/jobs/${id}`),
    create: (data) => api.post('/jobs', data),
    update: (id, data) => api.put(`/jobs/${id}`, data),
    delete: (id) => api.delete(`/jobs/${id}`),
    getMyJobs: () => api.get('/jobs/employer/my-jobs')
};

// Applications API
export const applicationsAPI = {
    apply: (formData) => api.post('/applications', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getMyApplications: () => api.get('/applications/my-applications'),
    getJobApplications: (jobId) => api.get(`/applications/job/${jobId}`),
    getAllApplications: () => api.get('/applications/employer/all'),
    updateStatus: (id, data) => api.put(`/applications/${id}/status`, data),
    getById: (id) => api.get(`/applications/${id}`)
};

// Users API
export const usersAPI = {
    getProfile: () => api.get('/users/profile'),
    updateProfile: (formData) => api.put('/users/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
};

export default api;
