import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import { useAppDispatch } from '../app/hooks';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getPhotographerById, selectPhotographer } from '../slicers/photographerSlice';
import { teal } from '@mui/material/colors';
import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import SessAlbum from './SessAlbum';
import { sessGetDataAsync } from '../slicers/sessAlbumSlice';
import { getPhotographerByUserId, selectProfilePhotographer } from '../slicers/profilePtgSlice';
import { TextField, useMediaQuery } from '@mui/material';
import UploadButton from './UpdButton';
import { loginAsync, logout, selectSpanish, selectToken, toggleSpanish } from '../slicers/sighnInSlice';
import { becomePhotographerAsync, selectBecomePhotographer } from '../slicers/becomePhotographerSlice';
import { clearUser, selectUser } from '../slicers/userSlice';
import axios from 'axios';
import pica from 'pica';
import { fileTypeFromBuffer } from 'file-type';
import { Alert } from '@mui/joy';
import ReportIcon from '@mui/icons-material/Report';
import { clearPhotographer } from '../slicers/photographerSlice';
import LinearProgress from '@mui/joy/LinearProgress';
import { Dialog, DialogActions, DialogContent, DialogContentText, } from '@mui/material';




export default function UserCard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const photographer = useSelector(selectProfilePhotographer);
  const newPhotographer = useSelector(selectBecomePhotographer);
  const conectedUser = useSelector(selectToken)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [about, setAbout] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const isMobile = useMediaQuery('(max-width:600px)');
  const spanish = useSelector(selectSpanish)
  const [openMessage, setOpenMessage] = React.useState(false);
  const [message, setMessage] = useState<string | null>(null);
  




  useEffect(() => {
    if (about) {
      handleSubmit();
    }
  }, [imageUrl]);



  useEffect(() => {
    if (newPhotographer === true) {
      handleLogOut();
      navigate('/SignIn');
    }
  }, [newPhotographer]);



  const handleLogOut = () => {
    dispatch(clearUser());
    dispatch(clearPhotographer());
    dispatch(logout());
  };


  const handleSubmitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const data = new FormData(e.currentTarget);
    const aboutText = data.get("About") as string;

    // Validate directly from form data
    if (!aboutText) {
      console.error('Write something about yourself');
      handleOpenMessage(spanish ? 'Escribe algo sobre ti' : 'Write something about yourself');
      setIsLoading(false);
      return;
    }

    if (!selectedFile) {
      console.error('Select a profile picture');
      handleOpenMessage(spanish ? 'Selecciona una foto de perfil' : 'Select a profile picture');
      setIsLoading(false);
      return;
    }

    // Set 'about' after validation
    setAbout(aboutText);

    await uploadImage(e as any);
  };






  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    if (e.target.files && e.target.files.length > 0) {
      if (e.target.files.length > 1) {
        setFileError('Please select only one image.');
        setSelectedFile(null);
        setImagePreview(null);
        return;
      }

      const file = e.target.files[0];
      const bytesToRead = 4100; // Define the number of bytes to read from the start of the file

      // Read the first `bytesToRead` bytes of the file
      const buffer = await file.slice(0, bytesToRead).arrayBuffer();
      const type = await fileTypeFromBuffer(new Uint8Array(buffer));

      // Check if the file type is an image and either JPEG or PNG
      if (!type || (type.mime !== 'image/jpeg' && type.mime !== 'image/png')) {
        setFileError('Please select only JPEG or PNG images.');
        setSelectedFile(null);
        setImagePreview(null);
      } else {
        setFileError(null);
        setSelectedFile(file);
        setImagePreview(URL.createObjectURL(file));
      }
    } else {
      setFileError('No file selected.');
      setSelectedFile(null);
      setImagePreview(null);
    }
  };










  const compressImage = async (file: File): Promise<File> => {
    const picaInstance = pica();
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
      setUploadError('Upload failed. Please try again later.');
      throw new Error('Canvas context not available');
    }

    ctx.drawImage(img, 0, 0, offscreenCanvas.width, offscreenCanvas.height);

    const compressedCanvas = document.createElement('canvas');
    compressedCanvas.width = targetWidth;
    compressedCanvas.height = targetHeight;

    await picaInstance.resize(offscreenCanvas, compressedCanvas, {
      quality: 3,
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
          setUploadError('Upload failed. Please try again later.');
        }
      }, 'image/jpeg', 0.8);
    });
  };








  const uploadToS3 = async (file: File): Promise<string> => {
    const response = await axios.get(`https://oyster-app-b3323.ondigitalocean.app/presigned_urls_for_profile_pictures?num_urls=1`);
    const presignedUrl = response.data.urls[0];

    await axios.put(presignedUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
    });

    return presignedUrl.split('?')[0];
  };







  const uploadImage = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> => {
    e.preventDefault();
    // setIsLoading(true);

    try {
      if (selectedFile) {
        const compressedFile = await compressImage(selectedFile);
        const s3Url = await uploadToS3(compressedFile);
        setImageUrl(s3Url);
        // setImagePreview(null);
      }
    } catch (error) {
      console.error(error);
    } finally {
    }
  };







  const handleSubmit = async () => {
    const credentials = {
      about: String(about),
      user: Number(conectedUser!.id),
      profile_image: String(imageUrl),
    };

    try {
      console.log(credentials);
      const resultAction = await dispatch(becomePhotographerAsync(credentials));

      // Check if the action was fulfilled or rejected
      if (becomePhotographerAsync.fulfilled.match(resultAction)) {
        console.log('Photographer created successfully');
      } else if (becomePhotographerAsync.rejected.match(resultAction)) {
        throw new Error('Error creating photographer');
      }
    } catch (error) {
      setUploadError('Upload failed. Please try again later.');
      console.error('Error creating photographer:', error);
    } finally {
      setIsLoading(false);
    }
  };





  const handleCancelUpload = () => {
    const confirmCancel = window.confirm("Are you sure you want to cancel the upload?");

    if (confirmCancel) {
      setFileError(null);
      setUploadError(null);
      setAbout(null);
      setSelectedFile(null);
      navigate('/');
    }
  };







  const handleOpenMessage = (msg: string) => {
    setMessage(msg);
    setOpenMessage(true);
  };

  const handleCloseMessage = () => {
    setOpenMessage(false);
  };


  const setSpanish = () => {
    dispatch(toggleSpanish());
  };



  return (
    <div>


<Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            marginBottom: '15px',
          }}
        >
          <Typography>Change Language:</Typography>

          <Button
            variant="outlined"
            onClick={() => setSpanish()}
            disabled={!spanish}
            sx={{
              backgroundColor: !spanish ? teal[400] : 'inherit',  // Set teal if English is selected
              color: !spanish ? 'white' : 'inherit',  // White text when English is selected
              '&:disabled': {
                backgroundColor: teal[400],  // Teal background when disabled
                color: 'white',
              },
            }}
          >
            English
          </Button>

          <Button
            variant="outlined"
            onClick={() => setSpanish()}
            disabled={spanish}
            sx={{
              backgroundColor: spanish ? teal[400] : 'inherit',  // Set teal if Spanish is selected
              color: spanish ? 'white' : 'inherit',  // White text when Spanish is selected
              '&:disabled': {
                backgroundColor: teal[400],  // Teal background when disabled
                color: 'white',
              },
            }}
          >
            Español
          </Button>
        </Box>
      </Box>



      {!isLoading && (
      <div>
      <Typography
      component="h6"
      sx={{
        mb: 2,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '1.25rem',  // Adjust size as needed
      }}
    >
      {spanish ? 'Crea tu cuenta de fotógrafo' : 'Create Your Photographer Account'}
    </Typography>
    <Typography
      component="p"
      sx={{
        
        textAlign: 'center',
        color: 'text.secondary',
        fontSize: '1rem',  // Adjust size as needed
      }}
    >
      {spanish ? 'Sube una foto de perfil y escribe una breve descripción sobre ti (Por ejemplo, tu lugar habitual de trabajo).' : 'Upload a profile picture and write a brief description about yourself (For example, your usual work location).'}
    </Typography>
    <Typography
      component="p"
      sx={{
        mb: 4,
        textAlign: 'center',
        color: 'text.secondary',
        fontSize: '1rem',  // Adjust size as needed
      }}
    >
     {spanish ? 'Después de enviar, tendrás que iniciar sesión nuevamente para acceder a tu nuevo perfil.' : 'After submitting, you will have to log in again to access your new profile.'}
    </Typography>
  
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmitForm}
        encType="multipart/form-data"
        sx={{
          width: isMobile ? '90%' : '50%',
          margin: '0 auto',
          marginTop: '16px',
          display: 'flex',
        }}
      >
        <Card
          orientation="horizontal"
          sx={{
            width: '100%',
            flexWrap: 'wrap',
            borderRadius: '16px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
          }}
        >
          <AspectRatio flex ratio="1" maxHeight={182} sx={{ minWidth: 182 }}>
            {imagePreview && (<img src={imagePreview} alt='profileImg' />)}
          </AspectRatio>
          <CardContent> 

          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', mb: 0 }}>
                <Button
                  component="label"
                  sx={{
                    backgroundColor: 'white',  // Custom background color
                    fontSize: '1.1rem',
                    color: teal[400]  ,             // Text color
                    padding: '10px 20px',        // Padding for button size
                    borderRadius: '8px',         // Rounded corners
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: teal[400], color: 'white'  , }  // Hover effect
                  }}
                >
                  {spanish ? 'Subir una foto de perfil' : 'Upload a profile picture'}
                  <input
                    type="file"
                    accept="image/*"
                    name="image"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}  // Hide the actual input
                  />
                </Button>
              </Box>

            {/* <input type="file" accept="image/*" name="image" onChange={handleImageChange} /> */}



            <TextField
              margin="normal"
              required
              fullWidth
              name="About"
              label={spanish ? 'Escribe algo sobre ti' : 'Write something about yourself'}
              type="About"
              id="About"
              autoComplete="current-About"
            />
            <Box sx={{ display: 'flex', p: 1.5, my: 3, gap: 1.5, '& > button': { flex: 1 } }}>
              {!isLoading && (
                <Button onClick={handleCancelUpload} variant="outlined" color="danger">
                  {spanish ? 'Cancelar' : 'Cancel'}
                </Button>
              )} 
              <Button type="submit" fullWidth sx={{ backgroundColor: teal[400], color: 'white' }} disabled={isLoading}>
              {isLoading ? (spanish ? 'Cargando...' : 'Loading...') : (spanish ? 'Enviar' : 'Submit')}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
      </div>
  )}





      {fileError && (
        <Alert
          variant="outlined"
          color="danger"
          startDecorator={<ReportIcon />}
          sx={{
            maxWidth: isMobile ? '90%' : '420px',
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <Typography>{fileError}</Typography>
        </Alert>
      )}
  
      {uploadError && (
        <Alert
          variant="outlined"
          color="danger"
          startDecorator={<ReportIcon />}
          sx={{
            maxWidth: isMobile ? '90%' : '420px',
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <Typography>{uploadError}</Typography>
        </Alert>
      )}



{isLoading &&
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
            {spanish ? 'Subiendo...' : 'Uploading...'}
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


{openMessage && (
          <Dialog
            open={openMessage}
            onClose={handleCloseMessage}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {message} {/* Display the message from state */}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseMessage} autoFocus>
                OK
              </Button>
            </DialogActions>
          </Dialog>
        )}

    </div>
  );
  
}