import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Compress from 'compress.js';
import { useSelector } from 'react-redux';
import { selectNewSess } from '../slicers/sessAlbumSlice';
import { useNavigate } from 'react-router-dom';

const PleaseWorkcopy = () => {
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
        const watermarkUrl = 'http://res.cloudinary.com/dauupwecm/image/upload/v1716428098/nyb5atdbyazvl2ja93ow.png';
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

  const uploadFilesToS3 = async (files: File[], urlEndpoint: string, retryCount = 3) => {
    try {
      const response = await axios.get(`${urlEndpoint}?num_urls=${files.length}`);
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

  const compressFiles = async (files: File[]): Promise<File[]> => {
    const compress = new Compress();
    const options = {
 // the max size in MB, defaults to 2MB
      quality: 0.75, // the quality of the image, max is 1,
      maxWidth: 800, // the max width of the output image, defaults to 1920px
      maxHeight: 533, // the max height of the output image, defaults to 1920px
      resize: true, // defaults to true, set false if you do not want to resize the image width and height
    };

    const compressedFilesData = await compress.compress(files, options);

    return compressedFilesData.map((c) => {
      const base64str = c.data;
      const videoExt = c.ext;
      return Compress.convertBase64ToFile(base64str, videoExt);
    });
  };

  const createWatermarkedVideo = async (file: File): Promise<File> => {
    if (!watermarkImg) {
      throw new Error('Watermark image not loaded');
    }

    return new Promise<File>((resolve, reject) => {
      console.log('Type of file:', typeof file);
      console.log('Instance of File:', file instanceof File);
      console.log('File object:', file);

      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      console.log('objectUrl:', objectUrl);

      img.src = objectUrl;
      img.crossOrigin = 'Anonymous';

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Canvas context not available'));
        }

        ctx.drawImage(img, 0, 0);
        ctx.drawImage(watermarkImg, 0, 0, img.width, img.height);

        canvas.toBlob((blob) => {
          if (blob) {
            const watermarkedFile = new File([blob], `watermarked_${file.name}`, { type: 'image/jpeg' });
            URL.revokeObjectURL(objectUrl);  // Clean up object URL
            resolve(watermarkedFile);
          } else {
            URL.revokeObjectURL(objectUrl);  // Clean up object URL
            reject(new Error('Blob creation failed'));
          }
        }, 'image/jpeg');
      };

      img.onerror = (error) => {
        URL.revokeObjectURL(objectUrl);  // Clean up object URL
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
      const originalUploadedUrls = await uploadFilesToS3(files, 'http://localhost:8000/presigned_urls_for_original_videos');

      if (originalUploadedUrls.length === 0) {
        throw new Error('Failed to upload original files.');
      }

      // Step 2: Compress the files
      const compressedFiles = await compressFiles(files);

      // Step 3: Create watermarked versions of the compressed files
      const watermarkedFiles = await Promise.all(compressedFiles.map((file) => createWatermarkedVideo(file)));

      // Step 4: Upload watermarked files to S3
      const watermarkedUploadedUrls = await uploadFilesToS3(watermarkedFiles, 'http://localhost:8000/presigned_urls_for_watermarked_videos');

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

export default PleaseWorkcopy;
