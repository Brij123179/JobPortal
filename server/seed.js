import bcrypt from 'bcryptjs';
import dataStore from './store/dataStore.js';

export const seedDatabase = async () => {
    console.log('Seeding initial data...');
    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('password123', salt);

        // Create Employer
        const employer = dataStore.createUser({
            name: 'Tech Corp Admin',
            email: 'admin@techcorp.com',
            password_hash: passwordHash,
            role: 'employer',
            company_name: 'Tech Corp',
            companyDescription: 'Leading tech solutions provider.',
            website: 'https://techcorp.com',
            industry: 'Information Technology',
            phone: '123-456-7890'
        });

        // Create Job Seeker
        const jobSeeker = dataStore.createUser({
            name: 'John Doe',
            email: 'john@example.com',
            password_hash: passwordHash,
            role: 'job_seeker',
            phone: '098-765-4321'
        });

        // Create some Jobs
        const job1 = dataStore.createJob({
            title: 'Senior Frontend Engineer',
            description: 'We are looking for an experienced Frontend Engineer with deep knowledge of React and modern web development.',
            responsibilities: 'Develop new UI features, Build reusable code and libraries, Ensure the technical feasibility of UI/UX designs.',
            qualifications: '5+ years experience with React.js, Deep understanding of JavaScript, HTML5, CSS3.',
            job_type: 'Full-time',
            location: 'San Francisco, CA (Remote)',
            salary_min: 120000,
            salary_max: 160000,
            salary_currency: 'USD',
            experience_level: 'Senior',
            skills: ['React', 'JavaScript', 'CSS', 'HTML'],
            benefits: ['Health Insurance', '401k', 'Unlimited PTO'],
            employer_id: employer.id,
            company_name: employer.company_name,
            status: 'active'
        });

        const job2 = dataStore.createJob({
            title: 'Backend Developer',
            description: 'Join our backend team to build scalable APIs and microservices.',
            responsibilities: 'Write clean, scalable Node.js code, design database schemas, optimize application performance.',
            qualifications: '3+ years with Node.js and Express, experience with PostgreSQL and MongoDB.',
            job_type: 'Full-time',
            location: 'New York, NY',
            salary_min: 100000,
            salary_max: 140000,
            salary_currency: 'USD',
            experience_level: 'Mid',
            skills: ['Node.js', 'Express', 'MongoDB'],
            benefits: ['Health Insurance', 'Gym Membership'],
            employer_id: employer.id,
            company_name: employer.company_name,
            status: 'active'
        });

        const job3 = dataStore.createJob({
            title: 'UI/UX Designer',
            description: 'Looking for a creative UI/UX designer to craft intuitive user experiences.',
            responsibilities: 'Create user flows, wireframes, prototypes and mockups. Translate requirements into style guides.',
            qualifications: 'Portfolio demonstrating UI/UX expertise. Proficiency in Figma.',
            job_type: 'Contract',
            location: 'Remote',
            salary_min: 80000,
            salary_max: 110000,
            salary_currency: 'USD',
            experience_level: 'Entry',
            skills: ['Figma', 'UI Design', 'UX Design', 'Prototyping'],
            benefits: ['Flexible Hours'],
            employer_id: employer.id,
            company_name: employer.company_name,
            status: 'active'
        });

        console.log('Seed completed successfully. Default user passwords are "password123".');
    } catch (error) {
        console.error('Error seeding data:', error);
    }
};
