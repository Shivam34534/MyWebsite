import 'dotenv/config.js';
import ImageKit from 'imagekit';
import fs from 'fs';

console.log('Testing ImageKit Connection...');
// Manually Load Env if not loaded automatically in test context (though dotenv/config does it)
// We rely on .env being in this directory or parent.

if (!process.env.IMAGEKIT_PRIVATE_KEY) {
    console.error('ERROR: IMAGEKIT_PRIVATE_KEY is missing from environment!');
    // Try to read .env manually to debug
    const envFile = fs.readFileSync('.env', 'utf8');
    const privateKeyLine = envFile.split('\n').find(l => l.includes('IMAGEKIT_PRIVATE_KEY'));
    console.log('Line in .env:', privateKeyLine);
} else {
    console.log('IMAGEKIT_PRIVATE_KEY is present.');

    const imagekit = new ImageKit({
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    });

    try {
        const dummyFile = Buffer.from('dummy image content');
        console.log('Attempting upload...');
        const response = await imagekit.upload({
            file: dummyFile,
            fileName: 'test_connection.txt',
            folder: '/test'
        });
        console.log('Upload SUCCESS!');
        console.log('URL:', response.url);
    } catch (error) {
        console.error('Upload FAILED:', error.message);
    }
}
