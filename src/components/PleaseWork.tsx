import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectNewSess } from '../slicers/sessAlbumSlice';
import { useNavigate } from 'react-router-dom';
import pica from 'pica';

const Home = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const newSess = useSelector(selectNewSess);
  const navigate = useNavigate();
  const [watermarkImg, setWatermarkImg] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const fetchWatermark = async () => {
      try {
        const watermarkUrl = 'https://surfingram-watermarked.s3.us-east-2.amazonaws.com/surfingram-watermark.png';
        const img = new Image();
        img.src = watermarkUrl;
        img.crossOrigin = 'Anonymous';

        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = reject;
        });

        setWatermarkImg(img);
      } catch (error) {
        console.error('Error fetching watermark image:', error);
      }
    };

    fetchWatermark();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files);
      setFiles(fileList);
    }
  };

  const onUploadClick = () => {
    fileInputRef.current?.click();
  };

  const uploadWatermarkedFilesToS3 = async (files: File[], retryCount = 3) => {
    try {
      const response = await axios.get(`http://localhost:8000/presigned_urls_for_watermarked?num_urls=${files.length}`);
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







  const uploadOriginalFilesToS3 = async (files: File[], retryCount = 3) => {
    try {
      const response = await axios.get(`http://localhost:8000/presigned_urls_for_originals?num_urls=${files.length}`);
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


  const picaInstance = pica();

  const compressImage = async (file: File): Promise<File> => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
    });
  
    const targetWidth = 800;
    const targetHeight = 533;
  
    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = img.width;
    offscreenCanvas.height = img.height;
  
    const ctx = offscreenCanvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas context not available');
    }
  
    ctx.drawImage(img, 0, 0, offscreenCanvas.width, offscreenCanvas.height);
  
    const compressedCanvas = document.createElement('canvas');
    compressedCanvas.width = targetWidth;
    compressedCanvas.height = targetHeight;
  
    await picaInstance.resize(offscreenCanvas, compressedCanvas, {
      quality: 3, // Lower the quality for harder compression
      unsharpAmount: 0,
      unsharpRadius: 0,
      unsharpThreshold: 0,
    });
  
    return new Promise((resolve, reject) => {
      compressedCanvas.toBlob((blob) => {
        if (blob) {
          const compressedFile = new File([blob], `compressed_${file.name}`, { type: 'image/jpeg' });
          resolve(compressedFile);
        } else {
          reject(new Error('Blob creation failed'));
        }
      }, 'image/jpeg', 0.8); // Set JPEG quality to 0.1 for harder compression
    });
  };
  

  const createWatermarkedImage = async (file: File): Promise<File> => {
    try {
      if (!watermarkImg) {
        throw new Error('Watermark image not loaded');
      }
  
      return new Promise<File>((resolve, reject) => {
        const img: HTMLImageElement = new Image();
        img.src = URL.createObjectURL(file);
        img.crossOrigin = 'Anonymous';
  
        img.onload = async () => {
          try {
            const targetWidth = 800;
            const targetHeight = 533;
  
            const canvas = document.createElement('canvas');
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            const ctx = canvas.getContext('2d');
  
            if (!ctx) {
              return reject(new Error('Canvas context not available'));
            }
  
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
            // Resize the watermark image to 800x533
            const watermarkCanvas = document.createElement('canvas');
            watermarkCanvas.width = targetWidth;
            watermarkCanvas.height = targetHeight;
            const watermarkCtx = watermarkCanvas.getContext('2d');
  
            if (!watermarkCtx) {
              return reject(new Error('Watermark canvas context not available'));
            }
  
            watermarkCtx.drawImage(watermarkImg, 0, 0, targetWidth, targetHeight);
  
            // Draw the resized watermark on the main canvas
            ctx.drawImage(watermarkCanvas, 0, 0);
  
            const offscreenCanvas = document.createElement('canvas');
            offscreenCanvas.width = canvas.width;
            offscreenCanvas.height = canvas.height;
  
            await picaInstance.resize(canvas, offscreenCanvas, {
              quality: 3, // Lower the quality for harder compression
              unsharpAmount: 0,
              unsharpRadius: 0,
              unsharpThreshold: 0,
            });
  
            offscreenCanvas.toBlob((blob) => {
              if (blob) {
                const watermarkedFile = new File([blob], `watermarked_${file.name}`, { type: 'image/jpeg' });
                resolve(watermarkedFile);
              } else {
                reject(new Error('Blob creation failed'));
              }
            }, 'image/jpeg', 0.8); // Set JPEG quality to 0.1 for harder compression
          } catch (error) {
            reject(error);
          }
        };
  
        img.onerror = (error) => {
          reject(error);
        };
      });
    } catch (error) {
      console.error('Error creating watermarked image:', error);
      throw error;
    }
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
      const originalUploadedUrls = await uploadOriginalFilesToS3(files);

      if (originalUploadedUrls.length === 0) {
        throw new Error('Failed to upload original files.');
      }

      // Step 2: Compress the files
      const compressedFiles = await Promise.all(files.map(file => compressImage(file)));

      // Step 3: Create watermarked versions of the compressed files
      const watermarkedFiles = await Promise.all(compressedFiles.map(file => createWatermarkedImage(file)));

      // Step 4: Upload watermarked files to S3
      const watermarkedUploadedUrls = await uploadWatermarkedFilesToS3(watermarkedFiles);

      if (watermarkedUploadedUrls.length === 0) {
        throw new Error('Failed to upload watermarked files.');
      }

      // Step 5: Create images and waves in the database
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
