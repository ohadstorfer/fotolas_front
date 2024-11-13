import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { removeNewPrices, removeNewSess, removeNewSessDetails, selectNewSess } from '../slicers/sessAlbumSlice';
import { useNavigate } from 'react-router-dom';
import pica from 'pica';
import ExifReader from 'exifreader';
// import fileType from 'file-type';
import { fileTypeFromBuffer } from 'file-type';
import Stepper from '@mui/joy/Stepper';
import Step from '@mui/joy/Step';
import StepIndicator from '@mui/joy/StepIndicator';
import { teal } from '@mui/material/colors';
import { useAppDispatch } from '../app/hooks';
import { Button, Typography, useMediaQuery } from '@mui/material';
import { Alert } from '@mui/joy';
import WarningIcon from '@mui/icons-material/Warning';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Box from '@mui/joy/Box';
import CircularProgress from '@mui/joy/CircularProgress';
import LinearProgress from '@mui/joy/LinearProgress';
import Warning from '@mui/icons-material/Warning';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import ReportIcon from '@mui/icons-material/Report';
import { selectSpanish, selectToken, toggleSpanish } from '../slicers/sighnInSlice';
import { Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material';
import ConfirmationDialog from './ConfirmationDialog';






const Home = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [fileInfo, setFileInfo] = useState<string | null>(null);
  const [timeEstimation, setTimeEstimation] = useState<string | null>(null);
  const [NetworkError, setNetworkError] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const newSess = useSelector(selectNewSess);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [watermarkImg, setWatermarkImg] = useState<HTMLImageElement | null>(null);
  const isMobile = useMediaQuery('(max-width:600px)');
  const spanish = useSelector(selectSpanish)
  const [dialogOpen, setDialogOpen] = useState(false);



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




  useEffect(() => {
    return () => {
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, []);





  const setSpanish = () => {
    dispatch(toggleSpanish());
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






  useEffect(() => {
    const fetchWatermark = async () => {
      try {
        const watermarkUrl = 'https://surfingram-profile-images.s3.us-east-2.amazonaws.com/imageswatermark.png';
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






  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files);
      const invalidFiles: string[] = [];
      const maxFileSize = 20 * 1024 * 1024 * 1024; // 20 GB in bytes
      let totalSize = 0;

      // Define the number of bytes to read from the start of the file
      const bytesToRead = 4100; // You can adjust this if needed

      for (const file of fileList) {
        // Accumulate the total size of the files
        totalSize += file.size;

        // Read the first `bytesToRead` bytes of the file
        const buffer = await file.slice(0, bytesToRead).arrayBuffer();
        const type = await fileTypeFromBuffer(new Uint8Array(buffer));

        // Check if the file type is an image and either JPEG or PNG
        if (!type || (type.mime !== 'image/jpeg' && type.mime !== 'image/png')) {
          invalidFiles.push(file.name);
        }
      }

      const totalSizeInGB = (totalSize / (1024 * 1024 * 1024)).toFixed(3);
      setFileInfo(`${fileList.length} images, ${totalSizeInGB} GB`);

      // Check if the total file size exceeds the limit
      if (totalSize > maxFileSize) {
        setFileError(spanish
          ? 'Solo puedes subir hasta un límite de 20 GB. Por favor, selecciona menos imágenes.'
          : 'You can upload a maximum of 20 GB. Please select fewer images.'
        );
        setFiles([]); // Clear the files if the total size exceeds the limit
      } else if (invalidFiles.length > 0) {
        setFileError(spanish
          ? `Por favor, selecciona solo imágenes en formato JPEG o PNG. Archivos inválidos: ${invalidFiles.join(', ')}`
          : `Please select only JPEG or PNG images. Invalid files: ${invalidFiles.join(', ')}`
        );
        setFiles([]); // Clear the files if any are invalid
      } else {
        // Calculate the estimated upload time
        const uploadSpeedMbps = 20; // Upload speed in Mbps
        const uploadSpeedBps = uploadSpeedMbps * 1_000_000; // Convert to bits per second
        const totalSizeInBits = totalSize * 8 * 1.5; // Convert total size to bits
        const estimatedTimeInSeconds = totalSizeInBits / uploadSpeedBps; // Calculate time in seconds
        const estimatedTimeInMinutes = (estimatedTimeInSeconds / 60).toFixed(2); // Convert to minutes

        // Set the time estimation message
        setFileError(null);
        setFiles(fileList); // Update state with valid files
        setTimeEstimation(spanish
          ? `Subir esto puede tardar más de ${estimatedTimeInMinutes} minutos con una buena conexión a Internet.`
          : `Uploading this can take more than ${estimatedTimeInMinutes} minutes with a good internet connection.`
        );
      }
    }
  };



  const onUploadClick = () => {
    fileInputRef.current?.click();
  };






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











  const picaInstance = pica();

  const compressImage = async (file: File): Promise<File> => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
    });

    const targetHeight = 480;
    const aspectRatio = img.width / img.height;
    const targetWidth = Math.round(targetHeight * aspectRatio);

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
            const targetHeight = 480;
            const aspectRatio = img.width / img.height;
            const targetWidth = Math.round(targetHeight * aspectRatio);

            const canvas = document.createElement('canvas');
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            const ctx = canvas.getContext('2d');

            if (!ctx) {
              return reject(new Error('Canvas context not available'));
            }

            // Draw the main image on the canvas
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Set up the watermark canvas for resizing
            const watermarkCanvas = document.createElement('canvas');
            watermarkCanvas.width = targetWidth;
            watermarkCanvas.height = targetHeight;
            const watermarkCtx = watermarkCanvas.getContext('2d');

            if (!watermarkCtx) {
              return reject(new Error('Watermark canvas context not available'));
            }

            // Draw the watermark image resized to fit the target dimensions
            watermarkCtx.drawImage(watermarkImg, 0, 0, targetWidth, targetHeight);

            // Apply the watermark with 50% opacity
            ctx.globalAlpha = 0.5;  // Set global alpha to 50% opacity
            ctx.drawImage(watermarkCanvas, 0, 0);

            // Reset the globalAlpha after drawing the watermark
            ctx.globalAlpha = 1.0;

            // Prepare for resizing the final image
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
      console.log({
        original_urls: originalUrls,
        watermarked_urls: watermarkedUrls,
        session_album: newSess,
        exif_dates: exifDates
      });

      await axios.post('https://oyster-app-b3323.ondigitalocean.app/api/create_images_and_waves/', {
        original_urls: originalUrls,
        watermarked_urls: watermarkedUrls,
        session_album: newSess?.id,
        exif_dates: exifDates
      });
      return true;
    } catch (error) {
      console.error('Error creating images and waves:', error);
      setError('Failed to create images and waves.');
      return false;
    }
  };







  // Function to remove acceleration endpoint from URL
  const removeAccelerationEndpoint = (url: string): string => {
    return url.replace('s3-accelerate.amazonaws.com', 's3.amazonaws.com');
  };











  let retryTimeout: ReturnType<typeof setTimeout> | null = null;

  const uploadFilesToS3 = async (files: File[], urlType: string, maxRetries = 3) => {
    console.log(`Starting upload for ${files.length} ${urlType} files`);


    try {
      const response = await axios.get(`https://oyster-app-b3323.ondigitalocean.app/presigned_urls_for_${urlType}?num_urls=${files.length}`);
      const presignedUrls = response.data.urls;
      console.log(`Received presigned URLs for ${urlType} files`);

      const uploadPromises = files.map((file, index) => {
        const url = presignedUrls[index];
        let attempt = 0;

        const uploadWithRetry = async (): Promise<string> => {
          try {
            console.log(`Attempting to upload ${file.name} to S3 (${urlType}), attempt ${attempt + 1}`);
            await axios.put(url, file, {
              headers: {
                'Content-Type': file.type,
              },
            });
            console.log(`${file.name} uploaded successfully to ${urlType}`);
            return url.split('?')[0];
          } catch (error) {
            if (axios.isAxiosError(error)) {
              // Handle network errors separately
              if (error.code === 'ECONNABORTED' || error.message === 'Network Error' ||
                error.response?.status === 408 || !navigator.onLine) {
                console.log('Network error occurred. Retrying...');
                if (navigator.onLine) {
                  attempt++;
                }

                if (attempt >= maxRetries) {
                  console.error(`Failed to upload ${file.name} after ${maxRetries} attempts`);
                  throw new Error(`Failed to upload ${file.name} after ${maxRetries} attempts.`);
                }

                const delay = 100;
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
                      console.log('User is offline, waiting for connection restoration.');
                      setError('Network error: Waiting for connection to resume.');
                      setNetworkError(true);
                      clearTimeout(retryTimeout as ReturnType<typeof setTimeout>);

                      const connectionRestoredListener = async () => {
                        console.log('Connection restored, resuming upload.');
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
                          console.log('Connection restored, resuming upload.');
                          setNetworkError(false);
                          window.removeEventListener('online', connectionRestoredListener);
                          uploadWithRetry().then(resolve).catch(reject);
                        } else {
                          console.log('Still offline, waiting for the connection to resume.');
                        }
                      }, delay);
                    }
                  };

                  retryUpload();
                });
              } else {
                // For non-network errors, stop the upload process
                console.error(`Non-network error encountered during upload:`, error);
                setError('Upload failed due to an unexpected error. Please try again later.');
                throw new Error('Stopping upload due to an unexpected error.');
              }
            } else if (error instanceof Error) {
              // Handle other generic errors
              console.error(`Unexpected error encountered during upload:`, error.message);
              throw error;
            } else {
              console.error('An unknown error occurred during the upload process');
              throw new Error('An unknown error occurred during the upload process.');
            }
          }
        };

        return uploadWithRetry();
      });

      const results = await Promise.all(uploadPromises);
      console.log(`All ${urlType} files uploaded successfully`);
      return results;
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error uploading ${urlType} files:`, error.message);
        throw error;
      } else {
        console.error('An unknown error occurred while uploading files');
        throw new Error('An unknown error occurred while uploading files.');
      }
    }
  };






  // Example handleUpload function with error handling for both network and non-network errors
  const handleUpload = async () => {




    if (files.length === 0) {
      console.error('No files selected.');
      return;
    }

    setUploading(true);
    setError(null);
    console.log('Starting file upload process');

    try {
      const batchSize = 5;
      const allOriginalUploadedUrls: string[] = [];
      const allWatermarkedUploadedUrls: string[] = [];
      const allExifDates: any[] = [];

      for (let i = 0; i < files.length; i += batchSize) {
        const batch = files.slice(i, i + batchSize);
        console.log(`Processing batch of ${batch.length} files`);

        // Upload original files
        const originalUploadPromise = uploadFilesToS3(batch, 'originals');
        const exifExtractionPromises = batch.map(file => {
          console.log(`Extracting EXIF data for ${file.name}`);
          return extractExifData(file);
        });

        const exifDates = await Promise.all(exifExtractionPromises);
        console.log('EXIF data extraction complete');
        allExifDates.push(...exifDates);

        const originalUploadedUrls = await originalUploadPromise;
        console.log('Original images uploaded successfully:', originalUploadedUrls);
        allOriginalUploadedUrls.push(...originalUploadedUrls);

        console.log('Starting compression and watermarking for the batch');

        // Compress and watermark images
        const compressedFiles = await Promise.all(batch.map(async (file) => {
          try {
            console.log(`Compressing ${file.name}`);
            const compressedFile = await compressImage(file);
            console.log(`Compression successful for ${file.name}`);
            return compressedFile;
          } catch (error) {
            console.error(`Error compressing ${file.name}:`, error);
            throw error;
          }
        }));

        const watermarkedFiles = await Promise.all(compressedFiles.map(async (file) => {
          try {
            console.log(`Creating watermark for ${file.name}`);
            const watermarkedFile = await createWatermarkedImage(file);
            console.log(`Watermark creation successful for ${file.name}`);
            return watermarkedFile;
          } catch (error) {
            console.error(`Error creating watermark for ${file.name}:`, error);
            throw error;
          }
        }));

        console.log(`Uploading ${watermarkedFiles.length} watermarked files to S3`);
        const watermarkedUploadedUrls = await uploadFilesToS3(watermarkedFiles, 'watermarked');
        console.log('Watermarked images uploaded successfully:', watermarkedUploadedUrls);
        allWatermarkedUploadedUrls.push(...watermarkedUploadedUrls);
      }

      // Filter and transform URLs
      const validOriginalUrls = allOriginalUploadedUrls
        .filter((url): url is string => !!url)
        .map(removeAccelerationEndpoint);

      const validWatermarkedUrls = allWatermarkedUploadedUrls
        .filter((url): url is string => !!url)
        .map(removeAccelerationEndpoint);



      console.log('Calling createImagesAndWaves with valid URLs and EXIF dates');
      const ImagesCreatedSuccessfully = await createImagesAndWaves(validOriginalUrls, validWatermarkedUrls, allExifDates);

      if (ImagesCreatedSuccessfully) {
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
          navigate('/FailedUpload'); // Navigate to /FailedUpload if not a network error
        }
      } else {
        navigate('/FailedUpload'); // Navigate to /FailedUpload for non-Error objects
      }
      setUploading(false);
    }
  };



  return (
    <div>



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
          {spanish ? 'Subir imágenes' : 'Upload Images'}
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
            margin: '0 auto', // Center horizontally
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
          <Button onClick={onUploadClick} startIcon={<AddAPhotoIcon />} size="large"> {spanish ? 'Seleccionar imágenes' : 'Select Images'}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
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



      {!uploading && files.length > 0 && (
        <Alert
          variant="outlined"
          color="warning"
          startDecorator={<WarningIcon />}
          sx={{
            maxWidth: isMobile ? '90%' : '420px',
            margin: '0 auto', // Center horizontally
            textAlign: 'center',
            marginTop: 2, marginBottom: 2
          }}
        >
          <Typography>
            {spanish ? 'Por favor, asegúrate de seleccionar las imágenes correctas. Una vez que comience el proceso de carga, no se podrán hacer cambios.' : 'Please ensure you select the correct images. Once the upload process begins, changes cannot be made.'}
          </Typography>
        </Alert>
      )}




      {!uploading && files.length > 0 && (
        <>
          <Button onClick={onUploadClick} startIcon={<ChangeCircleIcon />} sx={{ marginBottom: '100px' }} >{spanish ? 'Cambiar imágenes' : 'Change Images'} </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </>
      )}

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





      {/* <Alert
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
      </Alert> */}




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
      {/* 88888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888 */}

      {NetworkError &&
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




      {uploading && !NetworkError &&
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





export default Home;
