import { db } from '@/db';
import { session } from '@/db/schema';

async function main() {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const sampleSessions = [
        {
            id: 'session_alice_001',
            token: 'test_token_alice',
            userId: 'user_01h4kxt2e8z9y3b1n7m6q5w8r4',
            expiresAt: thirtyDaysFromNow,
            createdAt: now,
            updatedAt: now,
            ipAddress: '127.0.0.1',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
        {
            id: 'session_bob_001',
            token: 'test_token_bob',
            userId: 'user_02j5lyu3f9a1z4c2o8n7r6x9s5',
            expiresAt: thirtyDaysFromNow,
            createdAt: now,
            updatedAt: now,
            ipAddress: '127.0.0.1',
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
    ];

    await db.insert(session).values(sampleSessions);
    
    console.log('✅ Sessions seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});