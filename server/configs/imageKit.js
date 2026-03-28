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
    if (uploadResponse.url) {
        return imagekit.url({ src: uploadResponse.url, transformation });
    }
    let filePath = uploadResponse.filePath || uploadResponse.path || uploadResponse.name || '';
    if (!filePath) return '';
    if (!filePath.startsWith('/')) {
        filePath = `/${filePath}`;
    }
    return imagekit.url({ path: filePath, transformation });
};

export default imagekit;