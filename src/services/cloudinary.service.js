import {v2 as cloudinary} from "cloudinary";
import fs from "fs"

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET_KEY
});

// UPLOAD files
const uploadFile = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {resource_type: 'auto'});
        console.log('File uploaded successfully! ', response.url);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath); // on error/exception unlink the local file.
    }
}

export {uploadFile};