import ImageKit from 'imagekit';

// Initialize ImageKit client (ESM). If your project uses CommonJS, convert this file
// to use `const ImageKit = require('imagekit');` and `module.exports = imagekit;`.
let imagekit;
if (process.env.IMAGEKIT_PRIVATE_KEY) {
    imagekit = new ImageKit({
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    });
} else {
    imagekit = {
        upload: async () => { throw new Error("ImageKit not configured"); },
        url: () => ""
    };
}

export const getImageKitUrl = (uploadResponse, transformation = []) => {
    if (!uploadResponse) return '';

    // Standardize transformation keys for maximum compatibility
    const optimizedTransformations = transformation.map(t => {
        const entry = {};
        if (t.height) entry.h = t.height;
        else if (t.h) entry.h = t.h;
        if (t.width) entry.w = t.width;
        else if (t.w) entry.w = t.w;
        if (t.quality) entry.q = t.quality;
        else if (t.q) entry.q = t.q;
        if (t.format) entry.f = t.format;
        return Object.keys(entry).length > 0 ? entry : t;
    });

    const options = {
        transformation: optimizedTransformations,
        transformationPostPosition: "path" // Critical for video support
    };

    if (uploadResponse.url) {
        options.src = uploadResponse.url;
    } else {
        let filePath = uploadResponse.filePath || uploadResponse.path || uploadResponse.name || '';
        if (!filePath) return '';
        if (!filePath.startsWith('/')) filePath = `/${filePath}`;
        options.path = filePath;
    }

    try {
        return imagekit.url(options);
    } catch (err) {
        console.error("[ImageKit] URL generation failed:", err);
        return uploadResponse.url || '';
    }
};

export default imagekit;