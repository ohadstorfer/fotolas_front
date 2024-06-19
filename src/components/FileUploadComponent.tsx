// FileUploadComponent.tsx

import React, { useState } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import EXIF from 'exif-js'; // For extracting EXIF data

interface Image {
  file: File;
  timestamp: string | null; // Change the type to string for the timestamp
}

const FileUploadComponent: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);

  const handleDrop = (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    const validFiles = acceptedFiles.filter(file => {
      const acceptedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      return acceptedTypes.includes(file.type);
    });

    const newImages: Image[] = validFiles.map(file => ({
      file,
      timestamp: null // Placeholder for timestamp
    }));
    setImages(prevImages => [...prevImages, ...newImages]);

    // Extract EXIF data for each image
    validFiles.forEach(file => {
      EXIF.getData(file as any, function(this: any) {
        let timestamp: string | null = null;

        // Check if DateTimeOriginal tag exists in the EXIF data
        const dateTimeOriginal = EXIF.getTag(this, 'DateTimeOriginal');
        if (dateTimeOriginal) {
          timestamp = dateTimeOriginal as string; // Assign the value of DateTimeOriginal to timestamp
        }

        // Update timestamp in state
        setImages(prevImages => {
          return prevImages.map(image => {
            if (image.file === file) {
              return { ...image, timestamp };
            }
            return image;
          });
        });
      });
    });

    if (fileRejections.length > 0) {
      console.error('Some files were rejected:', fileRejections);
      // Handle rejected files if needed
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    multiple: true,
    onDrop: handleDrop
  });

  return (
    <div>
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        <p>Drag 'n' drop some images here, or click to select images</p>
      </div>
      <div className="image-grid">
        {images.map((image, index) => (
          <div key={index} className="image-item">
            <img
              src={URL.createObjectURL(image.file)}
              alt={`Image ${index}`}
              style={{ width: '100px', height: 'auto' }} // Set width to 100px and height auto
            />
            <p>Timestamp: {image.timestamp || 'Unknown'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUploadComponent;
