import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectNewSess } from '../slicers/sessAlbumSlice';
import { useNavigate } from 'react-router-dom';
import pica from 'pica';
import ExifReader from 'exifreader';

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






  // const extractExifData = async (file: File): Promise<string | null> => {
  //   try {
  //     const arrayBuffer = await file.arrayBuffer();
  //     const tags = ExifReader.load(arrayBuffer);
  //     const dateOriginal = tags['DateTimeOriginal']?.description || 
  //                           tags['DateTimeDigitized']?.description || 
  //                           tags['DateTime']?.description;
  //     console.log(dateOriginal);
      
  //     return dateOriginal || null;
  //   } catch (error) {
  //     console.error('Error extracting EXIF data:', error);
  //     return null;
  //   }
  // };


  const extractExifData = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const tags = ExifReader.load(arrayBuffer);
      const dateOriginal = tags['DateTimeOriginal']?.description || 
                            tags['DateTimeDigitized']?.description || 
                            tags['DateTime']?.description;
      console.log(dateOriginal);
      
      return dateOriginal || "null";
    } catch (error) {
      console.error('Error extracting EXIF data:', error);
      return "null";
    }
  };



  
  const uploadFilesToS3 = async (files: File[], urlType: string, retryCount = 3) => {
    try {
      const response = await axios.get(`http://localhost:8000/presigned_urls_for_${urlType}?num_urls=${files.length}`);
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

      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error(`Error uploading ${urlType} files:`, error);
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
  
    const targetWidth = 854;
    const targetHeight = 480;
  
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
      }, 'image/jpeg', 0.8); // Set JPEG quality to 0.8 for compression
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
            const targetWidth = 854;
            const targetHeight = 480;
  
            const canvas = document.createElement('canvas');
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            const ctx = canvas.getContext('2d');
  
            if (!ctx) {
              return reject(new Error('Canvas context not available'));
            }
  
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
            // Resize the watermark image to fit
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
            }, 'image/jpeg', 0.8); // Set JPEG quality to 0.8 for compression
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

  const createImagesAndWaves = async (originalUrls: string[], watermarkedUrls: string[], exifDates: string[] = []) => {
    try {
      console.log({original_urls: originalUrls,
        watermarked_urls: watermarkedUrls,
        session_album: newSess,
        exif_dates: exifDates});
      
      await axios.post('http://localhost:8000/api/create_images_and_waves/', {
        original_urls: originalUrls,
        watermarked_urls: watermarkedUrls,
        session_album: newSess,
        exif_dates: exifDates
      });
    } catch (error) {
      console.error('Error creating images and waves:', error);
      setError('Failed to create images and waves.');
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
    const batchSize = 10; // Adjust batch size based on your system's performance
    const allOriginalUploadedUrls = [];
    const allWatermarkedUploadedUrls = [];
    const allExifDates = [];

    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);

      // Step 1: Start uploading original files to S3
      const originalUploadPromise = uploadFilesToS3(batch, 'originals');

      // Step 2: Extract EXIF data concurrently
      const exifExtractionPromises = batch.map(file => extractExifData(file));
      const exifDates = await Promise.all(exifExtractionPromises);
      allExifDates.push(...exifDates);


      // Wait for the original upload to complete
      const originalUploadedUrls = await originalUploadPromise;

      if (originalUploadedUrls.length === 0) {
        throw new Error('Failed to upload original files.');
      }
      allOriginalUploadedUrls.push(...originalUploadedUrls);

      // Step 3: Compress the files
      const compressedFiles = await Promise.all(batch.map(file => compressImage(file)));

      // Step 4: Create watermarked versions of the compressed files
      const watermarkedFiles = await Promise.all(compressedFiles.map(file => createWatermarkedImage(file)));

      // Step 5: Upload watermarked files to S3
      const watermarkedUploadedUrls = await uploadFilesToS3(watermarkedFiles, 'watermarked');

      if (watermarkedUploadedUrls.length === 0) {
        throw new Error('Failed to upload watermarked files.');
      }
      allWatermarkedUploadedUrls.push(...watermarkedUploadedUrls);
    }

    // Step 6: Create images and waves (after all batches are processed)
    await createImagesAndWaves(allOriginalUploadedUrls, allWatermarkedUploadedUrls, allExifDates);

    console.log('All files uploaded and processed successfully');
    setFiles([]);
    navigate('/');
  } catch (error) {
    console.error('Error during upload process:', error);
    setError('Upload failed. Please try again.');
  } finally {
    setUploading(false);
  }
};





  return (
    <div>
      <h1>Image Uploader</h1>
      <button onClick={onUploadClick}>Choose Files</button>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <button onClick={handleUpload} disabled={uploading || files.length === 0}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Home;
