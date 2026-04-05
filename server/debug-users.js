import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';
dotenv.config();

async function checkUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected to DB');
        const users = await User.find({}, 'email username _id full_name role');
        console.log('Users in DB:');
        users.forEach(u => console.log(`- ${u.email} (@${u.username}) ID: ${u._id} Role: ${u.role}`));
        
        // Count total
        const count = await User.countDocuments();
        console.log(`\nTotal users: ${count}`);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkUsers();
