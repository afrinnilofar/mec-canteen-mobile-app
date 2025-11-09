import { db } from '@/db';
import { user } from '@/db/schema';

async function main() {
    const sampleUsers = [
        {
            id: 'user_01h4kxt2e8z9y3b1n7m6q5w8r4',
            name: 'Alice Johnson',
            email: 'alice@campus.edu',
            emailVerified: true,
            image: null,
            createdAt: new Date('2024-01-15'),
            updatedAt: new Date('2024-01-15'),
        },
        {
            id: 'user_02j5lyu3f9a1z4c2o8n7r6x9s5',
            name: 'Bob Smith',
            email: 'bob@campus.edu',
            emailVerified: true,
            image: null,
            createdAt: new Date('2024-01-20'),
            updatedAt: new Date('2024-01-20'),
        },
        {
            id: 'user_03k6mzv4g0b2a5d3p9o8s7y0t6',
            name: 'Admin User',
            email: 'admin@campus.edu',
            emailVerified: true,
            image: null,
            createdAt: new Date('2024-01-10'),
            updatedAt: new Date('2024-01-10'),
        }
    ];

    await db.insert(user).values(sampleUsers);
    
    console.log('✅ User seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});