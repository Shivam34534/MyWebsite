import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const run = async () => {
    try {
        const form = new FormData();
        form.append('email', `test_${Date.now()}@example.com`);
        form.append('password', 'password123');
        form.append('fullName', 'Test User');
        form.append('username', `testuser_${Date.now()}`);
        form.append('location', 'New York');

        // created dummy files
        fs.writeFileSync('test_profile.txt', 'profile_content');
        fs.writeFileSync('test_cover.txt', 'cover_content');

        form.append('profile', fs.createReadStream('test_profile.txt'), 'test_profile.txt');
        form.append('cover', fs.createReadStream('test_cover.txt'), 'test_cover.txt');

        console.log('Sending request...');
        const res = await axios.post('http://localhost:4000/api/dev/signup', form, {
            headers: {
                ...form.getHeaders()
            }
        });

        console.log('Response Status:', res.status);
        console.log('Response Body:', JSON.stringify(res.data, null, 2));

        // Cleanup
        fs.unlinkSync('test_profile.txt');
        fs.unlinkSync('test_cover.txt');

    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
};

run();
