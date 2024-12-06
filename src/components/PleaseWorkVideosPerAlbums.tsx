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
import { selectSpanish, toggleSpanish } from '../slicers/sighnInSlice';
import ConfirmationDialog from './ConfirmationDialog';




const PleaseWorkVideosPerAlbums = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [networkError, setNetworkError] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [fileInfo, setFileInfo] = useState<string | null>(null);
  const [timeEstimation, setTimeEstimation] = useState<string | null>(null);
  const [totalSize, setTotalSize] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const newSess = useSelector(selectNewSess);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery('(max-width:600px)');
  let retryTimeout: ReturnType<typeof setTimeout> | null = null;
  const spanish = useSelector(selectSpanish)
  const [dialogOpen, setDialogOpen] = useState(false);
  const [surferVideos, setSurferVideos] = useState<File[][]>([[]]);






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







  const setSpanish = () => {
    dispatch(toggleSpanish());
  };




  const handleFileChange = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileList = Array.from(e.target.files);
      const invalidFiles: string[] = [];
      const maxFileSize = 20 * 1024 * 1024 * 1024; // 20 GB
      const bytesToRead = 4100; // Number of bytes to read from each file
      let newTotalSize = totalSize;

      for (const file of fileList) {
        // Accumulate the total size of the files in the local variable
        newTotalSize += file.size;

        // Read the first `bytesToRead` bytes of the file
        const buffer = await file.slice(0, bytesToRead).arrayBuffer();
        const type = await fileTypeFromBuffer(new Uint8Array(buffer));

        // Validate file type
        if (!type || (type.mime !== 'video/mp4' && type.mime !== 'video/webm' && type.mime !== 'video/quicktime')) {
          invalidFiles.push(file.name);
        }
      }



      // Check total file size limit
      if (newTotalSize > maxFileSize) {
        setFileError(
          spanish
            ? 'Solo puedes subir hasta un límite de 20 GB. Por favor, selecciona menos videos.'
            : 'You can upload a maximum of 20 GB. Please select fewer videos.'
        );
        setFiles([]);
      } else if (invalidFiles.length > 0) {
        setFileError(
          spanish
            ? `Por favor, selecciona solo videos en formato MP4, WebM o MOV. Archivos inválidos: ${invalidFiles.join(', ')}`
            : `Please select only MP4, WebM, or MOV videos. Invalid files: ${invalidFiles.join(', ')}`
        );
        setFiles([]);
      } else {
        const uploadSpeedMbps = 20;
        const uploadSpeedBps = uploadSpeedMbps * 1_000_000;
        const totalSizeInBits = newTotalSize * 8;
        const estimatedTimeInSeconds = totalSizeInBits / uploadSpeedBps;
        const estimatedTimeInMinutes = (estimatedTimeInSeconds / 60).toFixed(0);

        setFileError(null);
        const updatedSurferVideos = [...surferVideos];
        updatedSurferVideos[index] = fileList;
        setSurferVideos(updatedSurferVideos);

        const totalVideos = updatedSurferVideos.flat().length;
        setTotalSize(newTotalSize); // Update the state after accumulating size
        const totalSizeInGB = (newTotalSize / (1024 * 1024 * 1024)).toFixed(3);
        setFileInfo(`${totalVideos} videos, ${totalSizeInGB} GB`);

        setTimeEstimation(
          spanish
            ? `Subir esto puede tardar más de ${estimatedTimeInMinutes} minutos con una buena conexión a Internet.`
            : `Uploading this can take more than ${estimatedTimeInMinutes} minutes with a good internet connection.`
        );
      }
    }
  };



  const onUploadClick = () => {
    fileInputRef.current?.click();
  };







  // Function to remove acceleration endpoint from URL
  const removeAccelerationEndpoint = (url: string): string => {
    return url.replace('s3-accelerate.amazonaws.com', 's3.amazonaws.com');
  };






  const uploadFilesToS3 = async (files: File[], urlEndpoint: string, retryCount = 3) => {
    try {
      console.log(`Starting upload for ${files.length} files`);

      // Extract MIME types of the files
    const fileTypes = files.map(file => file.type);

    // Log request payload
    console.log('Request Payload:', {
      num_urls: files.length,
      file_types: fileTypes
  });
  
    
     // Fetch presigned URLs with file types using GET with params
     const response = await axios.get(urlEndpoint, {
      params: {
          num_urls: files.length,
          file_types: fileTypes.join(','),  // Convert array to comma-separated string
      }
  });

      // Fetch presigned URLs for the files
      // const response = await axios.get(`${urlEndpoint}?num_urls=${files.length}`);
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
                      setNetworkError(true);
                      clearTimeout(retryTimeout as ReturnType<typeof setTimeout>);
                      // Add an event listener for when the connection is restored
                      const connectionRestoredListener = async () => {
                        console.log(`Connection restored, resuming upload for ${file.name}.`);
                        setNetworkError(false);
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
    if (surferVideos.length === 0 || surferVideos.every(batch => batch.length === 0)) {
      console.error('No files selected.');
      return;
    }
  
    setUploading(true);
    setError(null);
    console.log('Starting file upload process');
  
    try {
      const batchSize = 5;
      const allOriginalUploadedUrls: string[][] = [];
      const allWatermarkedUploadedUrls: string[][] = [];
      const allImgUrls: string[][] = [];
  
      for (const batch of surferVideos) {
        const batchOriginalUrls: string[] = [];
        const batchWatermarkedUrls: string[] = [];
        const batchImgUrls: string[] = [];
  
        for (let i = 0; i < batch.length; i += batchSize) {
          const subBatch = batch.slice(i, i + batchSize);
          console.log(`Processing sub-batch of ${subBatch.length} videos`);
  
          const originalUploadPromises = subBatch.map(file =>
            uploadFilesToS3([file], 'http://127.0.0.1:8000/presigned_urls_for_original_videos')
          );
          const originalUploadedUrlsBatch = await Promise.all(originalUploadPromises);
          const originalUploadedUrls = originalUploadedUrlsBatch.flat();
          console.log('Original videos uploaded successfully:', originalUploadedUrls);
          batchOriginalUrls.push(...originalUploadedUrls);
  
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
  
          batchWatermarkedUrls.push(...watermarkedUploadedUrls);
          batchImgUrls.push(...imgUrls);
        }
  
        allOriginalUploadedUrls.push(batchOriginalUrls);
        allWatermarkedUploadedUrls.push(batchWatermarkedUrls);
        allImgUrls.push(batchImgUrls);
      }
  
      const validOriginalUrls = allOriginalUploadedUrls.map(batch => batch.map(removeAccelerationEndpoint));
      const validWatermarkedUrls = allWatermarkedUploadedUrls.map(batch => batch.map(removeAccelerationEndpoint));
      const validImgUrls = allImgUrls.map(batch => batch.map(removeAccelerationEndpoint));
  
      console.log('Calling createVideos with valid arrays of arrays of URLs');
      const videosCreatedSuccessfully = await createVideos(validOriginalUrls, validWatermarkedUrls, validImgUrls);
  
      if (videosCreatedSuccessfully) {
        console.log('Upload process completed successfully');
        setUploading(false);
        dispatch(removeNewSess());
        dispatch(removeNewPrices());
        dispatch(removeNewSessDetails());
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
          navigate('/FailedUpload');
        }
      } else {
        navigate('/FailedUpload');
      }
      setUploading(false);
    }
  };





  const createVideos = async (
    originalUrls: string[][],
    watermarkedUrls: string[][],
    imgUrls: string[][],
    // newSessId: string
  ) => {
    try {
      // Map the original, watermarked, and img URLs into the correct structure
      const videosData = originalUrls.map((originalUrlsGroup, index) => 
        originalUrlsGroup.map((originalUrl, idx) => ({
          original: originalUrl,
          transformed: watermarkedUrls[index][idx],  // Assuming the arrays are of the same length
          img: imgUrls[index][idx]  // Similarly, assuming the arrays are of the same length
        }))
      );
  
      const response = await axios.post('http://127.0.0.1:8000/create-multuple-videos/', {
        videos: videosData,
        session_album: newSess?.id,
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
    setDialogOpen(true); // Open the dialog
  };

  const handleDialogClose = () => {
    setDialogOpen(false); // Close the dialog
  };

  const handleDialogConfirm = () => {
    dispatch(removeNewSess());
    dispatch(removeNewPrices());
    dispatch(removeNewSessDetails());
    navigate('/'); // Navigate after confirmation
    setDialogOpen(false); // Close the dialog
  };






  const addSurfer = () => {
    setSurferVideos([...surferVideos, []]);
  };




  return (
    <div className="container">
      <Stepper sx={{ width: '100%', marginBottom: '40px' }}>
        <Step orientation="vertical" indicator={<StepIndicator>1</StepIndicator>}>
          {spanish ? 'Agregar detalles de la sesión' : 'Add Session Details'}
        </Step>
        <Step
          orientation="vertical"
          indicator={<StepIndicator>2</StepIndicator>}
        >
          {spanish ? 'Establecer precios' : 'Set Prices'}
        </Step>
        <Step orientation="vertical" indicator={<StepIndicator variant="solid" sx={{ backgroundColor: teal[400], color: 'white' }}>3</StepIndicator>}>
          {spanish ? 'Subir videos' : 'Upload Videos'}
        </Step>
        <Step orientation="vertical" indicator={<StepIndicator variant="outlined">4</StepIndicator>}>
          {spanish ? '¡Hecho!' : 'Done!'}
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
            {spanish ? '¡No salgas de la página ni apagues tu computadora!' : 'Do not leave the page or turn off your computer!'}
          </Typography>
        </Alert>
      )}





      {!uploading && files.length === 0 && (
        <>
          <Typography
            variant="h6"
            sx={{ fontWeight: 'bold', marginTop: 2, marginBottom: 2 }}
          >
            {spanish ? 'Puedes subir hasta 20 GB' : 'You can upload up to 20 GB'}
          </Typography>

          {/* <Button onClick={onUploadClick} startIcon={<VideoCallIcon />} size="large">{spanish ? 'Seleccionar videos' : 'Select Videos'} </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="video/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          /> */}



<div>
      {surferVideos.map((surferVideo, index) => (
        <div key={index} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Button onClick={() => document.getElementById(`file-input-${index}`)?.click()}>
            Select Videos for Surfer "{index + 1}"
          </Button>
          <input
            id={`file-input-${index}`}
            type="file"
            multiple
            accept="video/mp4,video/webm,video/quicktime"
            style={{ display: 'none' }}
            onChange={(e) => handleFileChange(index, e)}
          />
          {surferVideo.length > 0 && (
            <Typography>
               - {surferVideo.length} videos
            </Typography>
          )}
        </div>
      ))}
      {surferVideos[surferVideos.length - 1]?.length > 0 && (
    <Button onClick={addSurfer} variant="contained">
      Add Surfer
    </Button>
  )}
    </div>



        </>
      )}



<br></br><br></br>



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


      <Button onClick={handleUpload} variant="contained" color="primary">Upload All</Button>










      {!uploading && files.length > 0 && (
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
            {spanish ? 'Por favor, asegúrate de seleccionar las videos correctas. Una vez que comience el proceso de carga, no se podrán hacer cambios.' : 'Please ensure you select the correct videos. Once the upload process begins, changes cannot be made.'}
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





      {/* {!uploading && files.length > 0 && (
        <>
          <Button onClick={onUploadClick} sx={{ marginBottom: '100px' }} startIcon={<ChangeCircleIcon />} >{spanish ? 'Cambiar videos' : 'Change Videos'} </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="video/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </>
      )} */}

      <br></br>







      {files.length > 0 && !uploading && (
        <Button onClick={handleUpload} disabled={uploading}
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
          size="large"
          sx={{ backgroundColor: teal[400], color: 'white' }}
        >
          {uploading ? (spanish ? 'Subiendo...' : 'Uploading...') : (spanish ? 'Cargar' : 'Upload')}
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
            <Typography >{spanish ? 'Conexión perdida' : 'Lost connection'}</Typography>
            <Typography >
              {spanish ? 'El proceso de carga se reanudará automáticamente una vez que te reconectes a internet.' : 'The upload process will resume automatically once you reconnect to the internet.'}
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
              {spanish ? 'Cargando...' : ' Uploading...'}
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
          {spanish ? 'Cancelar carga' : 'Cancel Upload'}
        </Button>
      )}


      <ConfirmationDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onConfirm={handleDialogConfirm}
        title={spanish ? 'Cancelar carga' : 'Cancel Upload'}
        message={spanish ? '¿Estás seguro de que quieres cancelar la carga?' : 'Are you sure you want to cancel the upload?'}
      />




    </div>
  );
};

export default PleaseWorkVideosPerAlbums;
