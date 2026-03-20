import { v2 as cloudinary } from 'cloudinary';
import 'dotenv/config.js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadToCloudinary = (buffer, isVideo = false) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { 
                folder: 'social_app', 
                resource_type: isVideo ? 'video' : 'image',
                transformation: isVideo ? [] : [{ quality: 'auto', fetch_format: 'webp', width: 1280 }]
            },
            (error, result) => {
                if (result) resolve(result.secure_url);
                else reject(error);
            }
        );
        uploadStream.end(buffer);
    });
};

export default cloudinary;
