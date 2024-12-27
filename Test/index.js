import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Async function to upload a photo
async function uploadPhoto(filePath) {
  try {
    console.log(`Uploading file: ${filePath}`);

    // Use a timestamp to ensure a unique public_id
    const timestamp = new Date().toISOString();
    const response = await cloudinary.uploader.upload(filePath, {
      public_id: `om_${timestamp}`, // Unique public ID
    });

    console.log("Upload successful:", response);
    return response.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error.message, error);
    throw error; // Re-throw for further handling
  }
}

// Call the function
(async () => {
  try {
    const filePath = "./om.jpg";
    const uploadedUrl = await uploadPhoto(filePath);
    console.log("Uploaded URL:", uploadedUrl);
  } catch (error) {
    console.error("Error in file upload:", error.message);
  }
})();


