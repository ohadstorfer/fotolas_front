import React, { useState } from 'react';
import axios from 'axios';

const ImageUploader: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(event.target.files);
    }
  };

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      console.error('No files selected.');
      return;
    }
  
    try {
      // Get the number of selected files
      const numFiles = selectedFiles.length;
  
      // Call Django backend to obtain batch of presigned upload URLs
      const response = await axios.get(`https://9km-curious-mach.circumeo-apps.net/api/get_batch_presigned_urlssss?num_urls=${numFiles}`);
      const presignedUrls = response.data.urls;
      console.log(presignedUrls);
  
      // Prepare an array to store the upload promises
      const uploadPromises: Promise<any>[] = [];
  
      // Iterate through the selected files and upload each one using the presigned URL
      Array.from(selectedFiles).forEach((file, index) => {
        const fileReader = new FileReader();
  
        // Read the file as a binary string
        fileReader.readAsBinaryString(file);
  
        // Define the onload callback function
        fileReader.onload = () => {
          const fileData = fileReader.result;
  
          // Upload the file data using the presigned URL
          const uploadPromise = axios.put(presignedUrls[index], fileData, {
            headers: {
              'Content-Type': file.type, // Set the content type based on the file type
            },
          });
  
          // Add the upload promise to the array
          uploadPromises.push(uploadPromise);
        };
      });
  
      // Wait for all uploads to complete
      await Promise.all(uploadPromises);
  
      console.log('Files uploaded successfully.');
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };
  
  

  return (
    <div>
      <input type="file" accept="image/*" multiple onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default ImageUploader;
