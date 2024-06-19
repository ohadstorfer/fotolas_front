import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectNewSess } from '../slicers/sessAlbumSlice';
import { useNavigate } from 'react-router-dom';
import watermark from 'watermarkjs';

const Home = () => {
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const newSess = useSelector(selectNewSess);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files);
      setFiles(fileList);
    }
  };

  const onUploadClick = () => {
    fileInputRef.current?.click();
  };

  const uploadFilesToS3 = async (files: File[], retryCount = 3) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/get_batch_presigned_urlssss?num_urls=${files.length}`);
      const presignedUrls = response.data.urls;

      const uploadPromises = files.map(async (file, index) => {
        const url = presignedUrls[index];
        for (let attempt = 0; attempt < retryCount; attempt++) {
          try {
            await axios.put(url, file, {
              headers: {
                'Content-Type': file.type,
              },
            });
            return url.split('?')[0];
          } catch (err) {
            if (attempt < retryCount - 1) {
              console.warn(`Retrying upload for ${file.name}, attempt ${attempt + 1}`);
            } else {
              throw err;
            }
          }
        }
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      console.log('All files uploaded successfully.');
      return uploadedUrls;
    } catch (error) {
      console.error('Error uploading files:', error);
      throw error;
    }
  };

  const createWatermarkedImage = async (imageUrl: string) => {
    return new Promise<File>((resolve, reject) => {
      const img: HTMLImageElement = new Image();
      img.src = imageUrl;
      img.crossOrigin = "Anonymous";

      img.onload = () => {
        try {
          const watermarkUrl = 'http://res.cloudinary.com/dauupwecm/image/upload/v1716428098/nyb5atdbyazvl2ja93ow.png';
          const watermarkImg = new Image();
          watermarkImg.src = watermarkUrl;
          watermarkImg.crossOrigin = "Anonymous";
          
          watermarkImg.onload = () => {
            watermark([img, watermarkImg])
              .image(watermark.image.center(0.5))
              .then((watermarkedImg: HTMLImageElement) => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');

                if (ctx) {
                  ctx.drawImage(watermarkedImg, 0, 0, canvas.width, canvas.height);
                  canvas.toBlob((blob) => {
                    if (blob) {
                      const watermarkedFile = new File([blob], `watermarked_${imageUrl.split('/').pop()}`, { type: 'image/jpeg' });
                      resolve(watermarkedFile);
                    } else {
                      reject(new Error('Blob creation failed'));
                    }
                  }, 'image/jpeg');
                } else {
                  reject(new Error('Canvas context not available'));
                }
              })
              .catch((error: any) => {
                reject(error);
              });
          };

          watermarkImg.onerror = (error) => {
            reject(error);
          };
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      console.error('No files selected.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Step 1: Upload original files to S3
      const originalUploadedUrls = await uploadFilesToS3(files);

      if (originalUploadedUrls.length === 0) {
        throw new Error('Failed to upload original files.');
      }

      // Step 2: Create watermarked versions of the files using their URLs
      const watermarkedFiles = await Promise.all(originalUploadedUrls.map(url => createWatermarkedImage(url)));

      // Step 3: Upload watermarked files to S3
      const watermarkedUploadedUrls = await uploadFilesToS3(watermarkedFiles);

      if (watermarkedUploadedUrls.length === 0) {
        throw new Error('Failed to upload watermarked files.');
      }

      // Step 4: Create images and waves in the database
      await createImagesAndWaves(originalUploadedUrls, watermarkedUploadedUrls);

      // Navigate to the home route after successful creation of images and waves
      navigate('/');
    } catch (error) {
      console.error('Upload process failed:', error);
      setError('Failed to upload files. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const createImagesAndWaves = async (originalUrls: string[], watermarkedUrls: string[]) => {
    try {
      const response = await axios.post('http://localhost:8000/api/create_images_and_waves/', {
        original_urls: originalUrls,
        watermarked_urls: watermarkedUrls,
        session_album: newSess,
      });
      console.log(response.data.message);
    } catch (error) {
      console.error('Error creating images and waves:', error);
      setError('Failed to create images and waves.');
    }
  };

  return (
    <div className="container">
      <p>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
          multiple
        />
        <button onClick={onUploadClick}>Select files to upload</button>&nbsp;
        or drag-and-drop files into this browser window.
      </p>

      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default Home;
