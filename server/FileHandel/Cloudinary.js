import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  timeout: 60000, // Optional: Extend timeout
  log_level: 'debug',
});

async function uploadPhoto(filePath, id) {
  try {
    console.log(filePath);
    
    const response = await cloudinary.uploader.upload(filePath, {
      public_id: `${id}_${Date.now()}`, // Use timestamp to ensure unique ID,
      transformation:[{quality:"50"}]
    });
    console.log(response);
    return response.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error.message, error);
    throw error; // Re-throw the error for further handling
  }
}



export { uploadPhoto };
  