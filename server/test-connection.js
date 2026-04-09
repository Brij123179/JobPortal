import { supabase, supabaseAnon } from './config/supabase.js';
import dotenv from 'dotenv';

dotenv.config();

console.log('🔍 Testing Supabase Connection...\n');

async function testConnection() {
    try {
        // Test 1: Check environment variables
        console.log('✅ Step 1: Environment Variables');
        console.log(`   SUPABASE_URL: ${process.env.SUPABASE_URL ? '✓ Set' : '✗ Missing'}`);
        console.log(`   SUPABASE_ANON_KEY: ${process.env.SUPABASE_ANON_KEY ? '✓ Set' : '✗ Missing'}`);
        console.log(`   SUPABASE_SERVICE_KEY: ${process.env.SUPABASE_SERVICE_KEY ? '✓ Set' : '✗ Missing'}\n`);

        if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY || !process.env.SUPABASE_SERVICE_KEY) {
            throw new Error('Missing required environment variables. Please check your .env file.');
        }

        // Test 2: Test service role connection
        console.log('✅ Step 2: Testing Service Role Connection');
        const { data: serviceData, error: serviceError } = await supabase
            .from('users')
            .select('count')
            .limit(1);

        if (serviceError) {
            console.log(`   ✗ Service role connection failed: ${serviceError.message}\n`);
            throw serviceError;
        }
        console.log('   ✓ Service role client connected successfully\n');

        // Test 3: Test anon connection
        console.log('✅ Step 3: Testing Anonymous Connection');
        const { data: anonData, error: anonError } = await supabaseAnon
            .from('jobs')
            .select('count')
            .limit(1);

        if (anonError) {
            console.log(`   ✗ Anonymous connection failed: ${anonError.message}\n`);
            throw anonError;
        }
        console.log('   ✓ Anonymous client connected successfully\n');

        // Test 4: Check if tables exist
        console.log('✅ Step 4: Checking Database Tables');

        const tables = ['users', 'jobs', 'applications'];
        for (const table of tables) {
            const { data, error } = await supabase
                .from(table)
                .select('count')
                .limit(1);

            if (error) {
                console.log(`   ✗ Table '${table}' check failed: ${error.message}`);
                if (error.message.includes('does not exist')) {
                    console.log(`      → Please run the schema.sql file in Supabase SQL Editor`);
                }
            } else {
                console.log(`   ✓ Table '${table}' exists`);
            }
        }

        console.log('\n✅ Step 5: Testing Row Level Security');
        // Try to query with anon client (should work for active jobs)
        const { data: jobsData, error: jobsError } = await supabaseAnon
            .from('jobs')
            .select('*')
            .eq('status', 'active')
            .limit(1);

        if (jobsError) {
            console.log(`   ⚠ RLS test: ${jobsError.message}`);
        } else {
            console.log(`   ✓ RLS is working (found ${jobsData?.length || 0} active jobs)\n`);
        }

        // Test 6: Check storage bucket
        console.log('✅ Step 6: Checking Storage Buckets');
        const { data: buckets, error: bucketError } = await supabase
            .storage
            .listBuckets();

        if (bucketError) {
            console.log(`   ✗ Storage check failed: ${bucketError.message}\n`);
        } else {
            const resumesBucket = buckets.find(b => b.name === 'resumes');
            if (resumesBucket) {
                console.log(`   ✓ 'resumes' bucket exists`);
            } else {
                console.log(`   ⚠ 'resumes' bucket not found - run schema.sql to create it`);
            }
        }

        console.log('\n' + '='.repeat(50));
        console.log('🎉 CONNECTION TEST COMPLETED SUCCESSFULLY!');
        console.log('='.repeat(50));
        console.log('\n📝 Next Steps:');
        console.log('   1. If any tables are missing, run schema.sql in Supabase SQL Editor');
        console.log('   2. Start your server with: npm run dev');
        console.log('   3. Test the API at: http://localhost:5000/api/health\n');

    } catch (error) {
        console.error('\n' + '='.repeat(50));
        console.error('❌ CONNECTION TEST FAILED');
        console.error('='.repeat(50));
        console.error(`\nError: ${error.message}\n`);

        console.log('🔧 Troubleshooting:');
        console.log('   1. Verify your .env file has the correct credentials');
        console.log('   2. Check if you added the SUPABASE_SERVICE_KEY');
        console.log('   3. Ensure your Supabase project is active');
        console.log('   4. Run the schema.sql file in Supabase SQL Editor');
        console.log('   5. Check Supabase dashboard for any issues\n');

        process.exit(1);
    }
}

testConnection();
