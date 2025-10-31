import { v2 as cloudinary } from 'cloudinary';

const connectCloudinary = async () => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // underscore, not cloudname
        api_key: process.env.CLOUDINARY_API_KEY,       // correct key
        api_secret: process.env.CLOUDINARY_API_SECRET  // correct secret
    });
};

export default connectCloudinary;
