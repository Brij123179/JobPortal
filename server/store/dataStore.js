// In-memory data store (no database required)
// Data will be lost when server restarts

import { v4 as uuidv4 } from 'uuid';

class DataStore {
    constructor() {
        this.users = [];
        this.jobs = [];
        this.applications = [];
    }

    // ============ USERS ============

    createUser(userData) {
        const user = {
            id: uuidv4(),
            ...userData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        this.users.push(user);
        return user;
    }

    findUserByEmail(email) {
        return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    }

    findUserById(id) {
        return this.users.find(u => u.id === id);
    }

    updateUser(id, updates) {
        const index = this.users.findIndex(u => u.id === id);
        if (index === -1) return null;

        this.users[index] = {
            ...this.users[index],
            ...updates,
            updated_at: new Date().toISOString()
        };
        return this.users[index];
    }

    // ============ JOBS ============

    createJob(jobData) {
        const job = {
            id: uuidv4(),
            ...jobData,
            applications_count: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        this.jobs.push(job);
        return job;
    }

    findJobs(filters = {}) {
        let filteredJobs = [...this.jobs];

        // Filter by status
        if (filters.status) {
            filteredJobs = filteredJobs.filter(j => j.status === filters.status);
        }

        // Filter by employer
        if (filters.employer_id) {
            filteredJobs = filteredJobs.filter(j => j.employer_id === filters.employer_id);
        }

        // Search by keyword
        if (filters.keyword) {
            const keyword = filters.keyword.toLowerCase();
            filteredJobs = filteredJobs.filter(j =>
                j.title.toLowerCase().includes(keyword) ||
                j.description.toLowerCase().includes(keyword) ||
                (j.skills && j.skills.some(s => s.toLowerCase().includes(keyword)))
            );
        }

        // Filter by location
        if (filters.location) {
            filteredJobs = filteredJobs.filter(j =>
                j.location.toLowerCase().includes(filters.location.toLowerCase())
            );
        }

        // Filter by job type
        if (filters.job_type) {
            filteredJobs = filteredJobs.filter(j => j.job_type === filters.job_type);
        }

        // Filter by experience level
        if (filters.experience_level) {
            filteredJobs = filteredJobs.filter(j => j.experience_level === filters.experience_level);
        }

        // Filter by salary
        if (filters.min_salary) {
            filteredJobs = filteredJobs.filter(j => j.salary_min >= Number(filters.min_salary));
        }
        if (filters.max_salary) {
            filteredJobs = filteredJobs.filter(j => j.salary_max <= Number(filters.max_salary));
        }

        // Sort by created date (newest first)
        filteredJobs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        return filteredJobs;
    }

    findJobById(id) {
        return this.jobs.find(j => j.id === id);
    }

    updateJob(id, updates) {
        const index = this.jobs.findIndex(j => j.id === id);
        if (index === -1) return null;

        this.jobs[index] = {
            ...this.jobs[index],
            ...updates,
            updated_at: new Date().toISOString()
        };
        return this.jobs[index];
    }

    deleteJob(id) {
        const index = this.jobs.findIndex(j => j.id === id);
        if (index === -1) return false;

        this.jobs.splice(index, 1);
        // Also delete related applications
        this.applications = this.applications.filter(a => a.job_id !== id);
        return true;
    }

    incrementJobApplications(jobId) {
        const job = this.findJobById(jobId);
        if (job) {
            job.applications_count = (job.applications_count || 0) + 1;
        }
    }

    // ============ APPLICATIONS ============

    createApplication(appData) {
        const application = {
            id: uuidv4(),
            ...appData,
            status: appData.status || 'pending',
            applied_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        this.applications.push(application);

        // Increment job applications count
        this.incrementJobApplications(appData.job_id);

        return application;
    }

    findApplications(filters = {}) {
        let filteredApps = [...this.applications];

        if (filters.job_id) {
            filteredApps = filteredApps.filter(a => a.job_id === filters.job_id);
        }

        if (filters.job_seeker_id) {
            filteredApps = filteredApps.filter(a => a.job_seeker_id === filters.job_seeker_id);
        }

        if (filters.employer_id) {
            filteredApps = filteredApps.filter(a => a.employer_id === filters.employer_id);
        }

        if (filters.status) {
            filteredApps = filteredApps.filter(a => a.status === filters.status);
        }

        // Sort by applied date (newest first)
        filteredApps.sort((a, b) => new Date(b.applied_at) - new Date(a.applied_at));

        return filteredApps;
    }

    findApplicationById(id) {
        return this.applications.find(a => a.id === id);
    }

    findApplicationByJobAndUser(jobId, userId) {
        return this.applications.find(a =>
            a.job_id === jobId && a.job_seeker_id === userId
        );
    }

    updateApplication(id, updates) {
        const index = this.applications.findIndex(a => a.id === id);
        if (index === -1) return null;

        this.applications[index] = {
            ...this.applications[index],
            ...updates,
            updated_at: new Date().toISOString()
        };
        return this.applications[index];
    }

    // ============ UTILITY ============

    reset() {
        this.users = [];
        this.jobs = [];
        this.applications = [];
    }

    getStats() {
        return {
            users: this.users.length,
            jobs: this.jobs.length,
            applications: this.applications.length
        };
    }
}

// Create singleton instance
const dataStore = new DataStore();

export default dataStore;
