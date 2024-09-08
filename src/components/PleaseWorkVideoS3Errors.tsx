import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { removeNewPrices, removeNewSess, removeNewSessDetails, selectNewSess } from '../slicers/sessAlbumSlice';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks';
import { Button, Typography, useMediaQuery } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { teal } from '@mui/material/colors';
import Stepper from '@mui/joy/Stepper';
import Step from '@mui/joy/Step';
import StepIndicator from '@mui/joy/StepIndicator';
import { Alert } from '@mui/joy';
import WarningIcon from '@mui/icons-material/Warning';
import { fileTypeFromBuffer } from 'file-type';
import Box from '@mui/joy/Box';
import CircularProgress from '@mui/joy/CircularProgress';
import LinearProgress from '@mui/joy/LinearProgress';
import Warning from '@mui/icons-material/Warning';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import ReportIcon from '@mui/icons-material/Report';




const PleaseWorkcopy = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [networkError, setNetworkError] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [fileInfo, setFileInfo] = useState<string | null>(null);
  const [timeEstimation, setTimeEstimation] = useState<string | null>(null);
  const [totalSize, setTotalSize] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const newSess = useSelector(selectNewSess);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery('(max-width:600px)');
  let retryTimeout: ReturnType<typeof setTimeout> | null = null;





  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = ''; // Triggers the browser's default warning dialog
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload); // Clean up
    };
  }, [dispatch]);







  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files);
      const invalidFiles: string[] = [];
      const maxFileSize = 20 * 1024 * 1024 * 1024; // 20 GB in bytes
      let totalSize = 0;

      // Define the number of bytes to read from the start of the file
      const bytesToRead = 4100;

      for (const file of fileList) {
        // Accumulate the total size of the files
        totalSize += file.size;

        // Read the first `bytesToRead` bytes of the file
        const buffer = await file.slice(0, bytesToRead).arrayBuffer();
        const type = await fileTypeFromBuffer(new Uint8Array(buffer));

        // Check if the file type is a video and is either MP4, WebM, or MOV
        if (!type || (type.mime !== 'video/mp4' && type.mime !== 'video/webm' && type.mime !== 'video/quicktime')) {
          invalidFiles.push(file.name);
        }
      }

      const totalSizeInGB = (totalSize / (1024 * 1024 * 1024)).toFixed(3);
      setFileInfo(`${fileList.length} videos, ${totalSizeInGB} GB`);



      // Check if the total file size exceeds the limit
      if (totalSize > maxFileSize) {
        setFileError('You can only upload up to 20 GB limit. Please select fewer videos.');
        setFiles([]); // Clear the files if the total size exceeds the limit
      } else if (invalidFiles.length > 0) {
        setFileError(`Please select only MP4, WebM, or MOV videos. Invalid files: ${invalidFiles.join(', ')}`);
        setFiles([]); // Clear the files if any are invalid
      } else {
         // Calculate the estimated upload time
         const uploadSpeedMbps = 20; // Upload speed in Mbps
         const uploadSpeedBps = uploadSpeedMbps * 1_000_000; // Convert to bits per second
         const totalSizeInBits = totalSize * 8; // Convert total size to bits
         const estimatedTimeInSeconds = totalSizeInBits / uploadSpeedBps; // Calculate time in seconds
         const estimatedTimeInMinutes = (estimatedTimeInSeconds / 60).toFixed(0); // Convert to minutes
 
         // Set the time estimation message
         setFileError(null);
         setFiles(fileList); // Update state with valid files
         setTimeEstimation (`Uploading this can take more than ${estimatedTimeInMinutes} minutes with a good internet connection.` )
        }
    }
  };



  const onUploadClick = () => {
    fileInputRef.current?.click();
  };







  const uploadFilesToS3 = async (files: File[], urlEndpoint: string, retryCount = 3) => {
    try {
      console.log(`Starting upload for ${files.length} files`);

      // Fetch presigned URLs for the files
      const response = await axios.get(`${urlEndpoint}?num_urls=${files.length}`);
      const presignedUrls = response.data.urls;
      console.log(`Received presigned URLs`);

      // Map files to their upload promises
      const uploadPromises = files.map((file, index) => {
        const url = presignedUrls[index];
        let attempt = 0;

        // Retry function
        const uploadWithRetry = async (): Promise<string> => {
          try {
            console.log(`Attempting to upload ${file.name}, attempt ${attempt + 1}`);
            await axios.put(url, file, {
              headers: {
                'Content-Type': file.type,
              },
            });
            console.log(`${file.name} uploaded successfully`);
            return url.split('?')[0]; // Return the URL without the query params
          } catch (error) {
            // Distinguish between network and non-network errors
            if (axios.isAxiosError(error)) {
              if (error.code === 'ECONNABORTED' || error.message === 'Network Error' || !navigator.onLine) {
                // Network-related errors
                console.log(`Network error occurred during upload of ${file.name}`);
                if (navigator.onLine) attempt++;

                if (attempt >= retryCount) {
                  console.error(`Failed to upload ${file.name} after ${retryCount} attempts`);
                  throw new Error(`Failed to upload ${file.name} after ${retryCount} attempts.`);
                }

                const delay = 100
                console.warn(`Retrying upload for ${file.name}, attempt ${attempt} with a delay of ${delay}ms`);

                return new Promise<string>((resolve, reject) => {
                  const retryUpload = async () => {
                    if (navigator.onLine) {
                      try {
                        const result = await uploadWithRetry();
                        resolve(result);
                      } catch (err) {
                        reject(err);
                      }
                    } else {
                      console.log(`User is offline, waiting for connection restoration for ${file.name}.`);
                      // Add an event listener for when the connection is restored
                      const connectionRestoredListener = async () => {
                        console.log(`Connection restored, resuming upload for ${file.name}.`);
                        window.removeEventListener('online', connectionRestoredListener);
                        try {
                          const result = await uploadWithRetry();
                          resolve(result);
                        } catch (err) {
                          reject(err);
                        }
                      };

                      window.addEventListener('online', connectionRestoredListener);

                      retryTimeout = setTimeout(() => {
                        if (navigator.onLine) {
                          window.removeEventListener('online', connectionRestoredListener);
                          uploadWithRetry().then(resolve).catch(reject);
                        } else {
                          console.log(`Still offline, waiting for connection for ${file.name}`);
                        }
                      }, delay);
                    }
                  };

                  retryUpload();
                });
              } else {
                // Non-network related errors (server errors, invalid URL, etc.)
                console.error(`Non-network error encountered during upload of ${file.name}:`, error);
                throw new Error(`Upload failed due to a non-network error for ${file.name}`);
              }
            } else {
              // Handle unexpected errors
              console.error(`Unexpected error during upload of ${file.name}:`, error);
              throw error;
            }
          }
        };

        // Initiate the retry logic for each file
        return uploadWithRetry();
      });

      // Wait for all uploads to complete
      const results = await Promise.all(uploadPromises);
      console.log('All files uploaded successfully');
      return results;
    } catch (error) {
      // Log the error and rethrow it for higher-level handling
      console.error('Error uploading files:', error);
      throw error;
    }
  };







  const handleUpload = async () => {
       // Show confirmation dialog to the user
  const confirmUpload = window.confirm(
    "After the upload process starts, you cannot make changes. Do you want to continue?"
  );
  // If the user cancels, exit the function
  if (!confirmUpload) {
    console.log('Upload canceled by the user.');
    return;
  }



    if (files.length === 0) {
      console.error('No files selected.');
      return;
    }

    setUploading(true);
    setError(null);
    console.log('Starting file upload process');

    try {
      const batchSize = 5; // Number of videos to upload in each batch
      const allOriginalUploadedUrls: string[] = [];
      const allWatermarkedUploadedUrls: string[] = [];
      const allImgUrls: string[] = [];

      for (let i = 0; i < files.length; i += batchSize) {
        const batch = files.slice(i, i + batchSize);
        console.log(`Processing batch of ${batch.length} videos`);

        // Upload original files
        const originalUploadPromises = batch.map(file => uploadFilesToS3([file], 'http://localhost:8000/presigned_urls_for_original_videos'));
        const originalUploadedUrlsBatch = await Promise.all(originalUploadPromises);
        const originalUploadedUrls = originalUploadedUrlsBatch.flat();
        console.log('Original videos uploaded successfully:', originalUploadedUrls);
        allOriginalUploadedUrls.push(...originalUploadedUrls);

        console.log('Starting watermark and image URL transformation for the batch');

        // Transform URLs
        const watermarkedUploadedUrls = originalUploadedUrls.map(url => {
          const filename = url.split('/').pop();
          if (!filename) {
            throw new Error('Filename is undefined');
          }
          const transformedFilename = filename.replace(/\.[^/.]+$/, ".mp4-tuvsconverted.mp4");
          return url
            .replace('surfingram-original-video', 'surfingram-transformed-video')
            .replace(filename, transformedFilename);
        });
        const imgUrls = originalUploadedUrls.map(url => {
          const filename = url.split('/').pop();
          if (!filename) {
            throw new Error('Filename is undefined');
          }
          const imgFilename = filename.replace(/\.[^/.]+$/, ".mp4-tuvsconverted.0000001.jpg");
          return url
            .replace('surfingram-original-video', 'surfingram-transformed-video')
            .replace(filename, imgFilename);
        });
        allWatermarkedUploadedUrls.push(...watermarkedUploadedUrls);
        allImgUrls.push(...imgUrls);
      }

      // Filter undefined URLs before calling the create function
      const validOriginalUrls = allOriginalUploadedUrls.filter((url): url is string => !!url);
      const validWatermarkedUrls = allWatermarkedUploadedUrls.filter((url): url is string => !!url);
      const validImgUrls = allImgUrls.filter((url): url is string => !!url);

      console.log('Calling createVideos with valid URLs');
      const videosCreatedSuccessfully = await createVideos(validOriginalUrls, validWatermarkedUrls, validImgUrls);

      if (videosCreatedSuccessfully) {
        console.log('Upload process completed successfully');
        setUploading(false);
        navigate('/Successfull');
      } else {
        setUploading(false);
        navigate('/FailedUpload');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      if (error instanceof Error) {
        if (error.message.includes('Network error')) {
          setError('Network error: Please reconnect to continue the upload process.');
        } else {
          navigate('/FailedUpload'); // Navigate to /FailedUpload if not a network error
        }
      } else {
        navigate('/FailedUpload'); // Navigate to /FailedUpload for non-Error objects
      }
      setUploading(false);
    }
  };





  const createVideos = async (originalUrls: string[], watermarkedUrls: string[], imgUrls: string[]) => {
    try {
      const response = await axios.post('http://localhost:8000/create-multuple-videos/', {
        video: originalUrls,
        WatermarkedVideo: watermarkedUrls,
        img: imgUrls,
        SessionAlbum: newSess?.id,
      });
      console.log(response.data.message);
      return true;
    } catch (error) {
      console.error('Error creating videos:', error);
      setError('Failed to create videos.');
      return false;
    }
  };





  const handleCancelUpload = () => {
    const confirmCancel = window.confirm('Are you sure you want to cancel the upload?');

    if (confirmCancel) {
      dispatch(removeNewSess());
      dispatch(removeNewPrices());
      dispatch(removeNewSessDetails());
      navigate('/');
    }
  };



  return (
    <div className="container">
      <Stepper sx={{ width: '100%', marginBottom: '40px' }}>
        <Step orientation="vertical" indicator={<StepIndicator>1</StepIndicator>}>
          Add Session Details
        </Step>
        <Step orientation="vertical" indicator={<StepIndicator>2</StepIndicator>}>
          Set Prices
        </Step>
        <Step orientation="vertical" indicator={<StepIndicator variant="solid" sx={{ backgroundColor: teal[400], color: 'white' }}>3</StepIndicator>}>
          Upload Videos
        </Step>
        <Step orientation="vertical" indicator={<StepIndicator variant="outlined">4</StepIndicator>}>
          Done!
        </Step>
      </Stepper>






      {uploading && (
        <Alert
          variant="outlined"
          color="warning"
          startDecorator={<WarningIcon />}
          sx={{
            maxWidth: isMobile ? '90%' : '400px',
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <Typography>
            Do not leave the page or turn off your computer!
          </Typography>
        </Alert>
      )}





      {!uploading && files.length === 0 && (
        <>
        <Typography
          variant="h6"
          sx={{ fontWeight: 'bold', marginTop: 2, marginBottom: 2 }}
        >
          You can upload up to 20 GB 
        </Typography>

          <Button onClick={onUploadClick} startIcon={<VideoCallIcon />} size="large">Select Videos </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="video/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </>
      )}



      {fileInfo && (
        <Typography
          variant="h6"
          sx={{ fontWeight: 'bold', marginTop: 2, marginBottom: 2 }}
        >
          {fileInfo}
        </Typography>
      )}
      {timeEstimation && (
        <Typography
          variant="h6"
          sx={{ fontWeight: 'bold', marginTop: 2, marginBottom: 2 }}
        >
          {timeEstimation}
        </Typography>
      )}

      








      {!uploading && files.length > 0 &&  (
        <Alert
          variant="outlined"
          color="warning"
          startDecorator={<WarningIcon />}
          sx={{
            maxWidth: isMobile ? '90%' : '420px',
            margin: '0 auto',
            textAlign: 'center',
            marginTop: 2, marginBottom: 2
          }}
        >
          <Typography>
            Make sure to select the right videos. After the upload process starts, you cannot make changes.
          </Typography>
        </Alert>
      )}



      {/* {!uploading && (
        <><button onClick={onUploadClick}>Select Videos</button><input
          ref={fileInputRef}
          type="file"
          multiple
          accept="video/*"
          onChange={handleFileChange}
          style={{ display: 'none' }} /></>
      )} */}





      {!uploading && files.length > 0 && (
        <>
          <Button onClick={onUploadClick} sx={{ marginBottom: '100px' }} startIcon={<ChangeCircleIcon />} >Change Videos </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="video/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </>
      )}

      <br></br>







      {files.length > 0 && !uploading &&(
        <Button onClick={handleUpload} disabled={uploading}
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
          size="large"
          sx={{ backgroundColor: teal[400], color: 'white' }}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </Button>
      )}




{fileError &&
       <Alert
       variant="outlined"
       color="danger"
       startDecorator={<ReportIcon />}
       sx={{
         maxWidth: isMobile ? '90%' : '420px',
         margin: '0 auto', // Center horizontally
         textAlign: 'center',
       }}
     >
       <Typography>
       {fileError}
       </Typography>
     </Alert>
       }






      {networkError &&
        <Alert
          variant="soft"
          color="danger"
          invertedColors
          startDecorator={
            <CircularProgress size="lg" color="danger">
              <Warning />
            </CircularProgress>
          }
          sx={{
            maxWidth: isMobile ? '90%' : '400px',
            margin: '0 auto', // Center horizontally
            textAlign: 'center',
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography >Lost connection</Typography>
            <Typography >
              Please verify your network connection and try again.
            </Typography>
          </Box>
        </Alert>
      }




      {uploading && !networkError &&
        <Alert
          variant="soft"
          color="success"
          invertedColors

          sx={{
            maxWidth: isMobile ? '90%' : '400px',
            margin: '0 auto', // Center horizontally
            textAlign: 'center',
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: '25px' }}>
              Uploading...
            </Typography>
          </Box>
          <LinearProgress
            variant="solid"
            color="success"
            value={40}
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              borderRadius: 0,
            }}
          />
        </Alert>
      }




      <br></br>

      {!uploading && (
        <Button
          size="medium" // Change from "md" to "medium"
          color="error" // Change from "danger" to "error"
          onClick={handleCancelUpload}
          sx={{ marginTop: '100px' }}
        >
          Cancel Upload
        </Button>
      )}







    </div>
  );
};

export default PleaseWorkcopy;
