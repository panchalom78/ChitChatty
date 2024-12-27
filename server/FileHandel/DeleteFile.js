import { access, constants, unlink } from "fs";
import { join } from "path";

/**
 * Deletes an image file from the server.
 * 
 * @param {string} filename - The name of the file to delete (e.g., "image1.jpg").
 * @param {string} folderPath - The absolute or relative path to the folder containing the file.
 * @param {function} callback - A callback function to handle the result.
 */
function deleteImage(filename, folderPath, callback) {
  // Construct the full file path
  const filePath = join(folderPath, filename);

  // Check if the file exists
  access(filePath, constants.F_OK, (err) => {
    if (err) {
      callback(new Error("File not found"), null);
      return;
    }

    // Delete the file
    unlink(filePath, (err) => {
      if (err) {
        callback(new Error("Error deleting the file"), null);
        return;
      }

      callback(null, "File deleted successfully");
    });
  });
}

export default deleteImage;
