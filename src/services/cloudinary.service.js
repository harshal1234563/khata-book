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
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath); // on error/exception unlink the local file.
    }
}

const deleteFile = async (publicId) => {
    try {
        const response = await cloudinary.uploader.destroy(publicId);
        return response.result?.toLowerCase() === "ok";
    } catch (e) {
        console.error("Error occurred while deleting file: ", e.message)
    }
}

const getPublicId = (url) => url.split('/').pop().split('.')[0];
export {uploadFile, deleteFile, getPublicId};