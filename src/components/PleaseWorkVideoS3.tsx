import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { removeNewPrices, removeNewSess, selectNewSess } from '../slicers/sessAlbumSlice';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks';
import { Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { teal } from '@mui/material/colors';
import Stepper from '@mui/joy/Stepper';
import Step from '@mui/joy/Step';
import StepIndicator from '@mui/joy/StepIndicator';




const PleaseWorkcopy = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const newSess = useSelector(selectNewSess);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();


  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = ''; // This line triggers the browser's default warning dialog
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload); // Clean up
    };
  }, [dispatch]);



  

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
        console.log(url);

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

  const handleUpload = async () => {
    if (files.length === 0) {
      console.error('No files selected.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Step 1: Upload original files to S3
      const originalUploadedUrls = await uploadFilesToS3(files, 'https://oyster-app-b3323.ondigitalocean.app/presigned_urls_for_original_videos');

      if (originalUploadedUrls.length === 0) {
        throw new Error('Failed to upload original files.');
      }

      // Step 2: Generate watermarked URLs
      const watermarkedUploadedUrls = originalUploadedUrls.map(url => {
        const filename = url.split('/').pop();
        const transformedFilename = filename.replace(/\.[^/.]+$/, ".mp4-tuvsconverted.mp4");
        return url.replace('surfingram-original-video', 'surfingram-transformed-video').replace(filename, transformedFilename);
      });

      // Step 3: Generate img URLs
      const imgUrls = originalUploadedUrls.map(url => {
        const filename = url.split('/').pop();
        const imgFilename = filename.replace(/\.[^/.]+$/, ".mp4-tuvsconverted.0000000.jpg");
        return url.replace('surfingram-original-video', 'surfingram-transformed-video').replace(filename, imgFilename);
      });

      // Step 4: Send URLs to the backend
      await createVideos(originalUploadedUrls, watermarkedUploadedUrls, imgUrls);

      // Navigate to the home route after successful creation of videos
      navigate('/Successfull');
    } catch (error) {
      console.error('Upload process failed:', error);
      setError('Failed to upload files. Please try again.');
    } finally {
      dispatch(removeNewSess())
      dispatch(removeNewPrices())
      setUploading(false);
    }
  };

  const createVideos = async (originalUrls: string[], watermarkedUrls: string[], imgUrls: string[]) => {
    try {
      console.log({
        video: originalUrls,
        WatermarkedVideo: watermarkedUrls,
        img: imgUrls,
        SessionAlbum: newSess?.id
      });

      const response = await axios.post('https://oyster-app-b3323.ondigitalocean.app/create-multuple-videos/', {
        video: originalUrls,
        WatermarkedVideo: watermarkedUrls,
        img: imgUrls,
        SessionAlbum: newSess,
      });
      console.log(response.data.message);
    } catch (error) {
      console.error('Error creating videos:', error);
      setError('Failed to create videos.');
    }
  };

  return (
    <div className="container">



<Stepper sx={{ width: '100%' }}>
        <Step orientation="vertical" indicator={<StepIndicator>1</StepIndicator>}>
          Add Session Details
        </Step>
        <Step
          orientation="vertical"
          indicator={<StepIndicator>2</StepIndicator>}
        >
          Set Prices
        </Step>
        <Step orientation="vertical" indicator={<StepIndicator variant="solid" sx={{ backgroundColor: teal[400], color: 'white' }}>3</StepIndicator>}>
          Upload Videos
        </Step>
        <Step orientation="vertical" indicator={<StepIndicator variant="outlined">4</StepIndicator>}>
          Done!
        </Step>
      </Stepper>




      <p>
        <input
          type="file"
          accept="video/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
          multiple
        />
        <button onClick={onUploadClick}>Select files to upload</button>&nbsp;
      </p>

      {/* <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button> */}

      <Button onClick={handleUpload} disabled={uploading}
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
        sx={{ backgroundColor: teal[400], color: 'white' }}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </Button>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default PleaseWorkcopy;
