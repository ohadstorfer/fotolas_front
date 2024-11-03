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
import { createSessAlbumAsync, removeNewPrices, removeNewSess, selectNewSess, selectVideos, sessGetDataAsync } from '../slicers/sessAlbumSlice';
import { getPhotographerByUserId, selectProfilePhotographer } from '../slicers/profilePtgSlice';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, useMediaQuery } from '@mui/material';
import UploadButton from './UpdButton';
import { loginAsync, selectLoggedIn, selectSpanish, selectToken, toggleSpanish } from '../slicers/sighnInSlice';
import { becomePhotographerAsync } from '../slicers/becomePhotographerSlice';
import UploadWidget from './UploadWidget';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker, LocalizationProvider, MobileDatePicker, MobileDateTimePicker } from '@mui/x-date-pickers';
import CreateSpot from './CreateSpot'; // Import CreateSpot component
import { getAllSpots, selectAllSpots, selectNewSpot, selectSpot } from '../slicers/spotSlice';
import Autocomplete from '@mui/material/Autocomplete';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import axios from 'axios';
import pica from 'pica';
import { selectUser } from '../slicers/userSlice';
import Stepper from '@mui/joy/Stepper';
import Step from '@mui/joy/Step';
import StepIndicator from '@mui/joy/StepIndicator';
import { Alert } from '@mui/joy';
import WarningIcon from '@mui/icons-material/Warning';
import LinearProgress from '@mui/joy/LinearProgress';
import HelpIcon from '@mui/icons-material/Help';
import IconButton from '@mui/material/IconButton'





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
    }, 'image/jpeg', 0.8); // Set JPEG quality to 0.8 for compression
  });
};








const uploadOriginalFilesToS3 = async (file: File, retryCount = 3) => {
  try {
    const response = await axios.get(`https://9km-curious-mach.circumeo-apps.net/presigned_urls_for_watermarked?num_urls=1`);
    const presignedUrl = response.data.urls[0];

    for (let attempt = 0; attempt < retryCount; attempt++) {
      try {
        await axios.put(presignedUrl, file, {
          headers: {
            'Content-Type': file.type,
          },
        });
        return presignedUrl.split('?')[0];
      } catch (err) {
        if (attempt < retryCount - 1) {
          console.warn(`Retrying upload for ${file.name}, attempt ${attempt + 1}`);
        } else {
          throw err;
        }
      }
    }
  } catch (error) {
    console.error('Error uploading file to S3:', error);
  }
};








export default function UserCard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const conectedUser = useSelector(selectToken)
  const user = useSelector(selectUser)
  const isLoggedIn = useSelector(selectLoggedIn)
  const spanish = useSelector(selectSpanish)
  const photographer = useSelector(selectProfilePhotographer);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [imageUrl, setimageUrl] = useState<string | null>(null);
  const [showCreateSpot, setShowCreateSpot] = useState(false);
  const newSpot = useSelector(selectNewSpot);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const newSess = useSelector(selectNewSess);
  const allSpots = useSelector(selectAllSpots);
  const [selectedSpot, setSelectedSpot] = useState<any | null>(null);
  const videos = useSelector(selectVideos);
  const [value, setValue] = React.useState<string | number>('');
  const [open, setOpen] = React.useState(false);
  const [openInfoCI, setOpenInfoCI] = React.useState(false);
  const [searchValue, setSearchValue] = useState('');
  const isMobile = useMediaQuery('(max-width:600px)'); // Detect mobile screen size
  const [openMessage, setOpenMessage] = React.useState(false);
  const [message, setMessage] = useState<string | null>(null);





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






  const handleChange = (event: SelectChangeEvent<typeof value>) => {
    setValue(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };


  const handleOpenInfoCI = () => {
    setOpenInfoCI(true);
  };

  const handleCloseInfoCI = () => {
    setOpenInfoCI(false);
  };


  const handleOpenMessage = (msg: string) => {
    setMessage(msg);
    setOpenMessage(true);
  };

  const handleCloseMessage = () => {
    setOpenMessage(false);
  };



  useEffect(() => {
    if (!allSpots.length) {
      console.log(allSpots);
      dispatch(getAllSpots());
    }
  }, [dispatch, allSpots.length]);




  useEffect(() => {
    if (newSpot) {
      setSelectedSpot(newSpot);
      dispatch(getAllSpots());
    }
  }, [newSpot, dispatch]);




  useEffect(() => {
    if (newSess) {
      if (videos) {
        // Navigate to the video pricing page after creating a session album with videos
        navigate('/CreatePricesForVideos');
        setIsLoading(false);
      } else {
        // Navigate to the image pricing page
        navigate('/CreatePrices');
        setIsLoading(false);
      }
    }
  }, [newSess, videos, navigate]);




  useEffect(() => {
    if (imageUrl) {
      handleSubmit();
    }
  }, [imageUrl]);











  const uploadImage = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);

    if (!selectedSpot) {
      console.error('Please select a spot.');
      handleOpenMessage(spanish ? 'Por favor selecciona un lugar.' : 'Please select a spot.');
      setIsLoading(false);
      return;
    }
    if (!selectedDate) {
      console.error('Please select a date.');
      handleOpenMessage(spanish ? 'Por favor selecciona una fecha.' : 'Please select a date.');
      setIsLoading(false);
      return;
    }
    if (!value) {
      console.error('Please select either Images or Videos.');

      handleOpenMessage(spanish ? 'Por favor selecciona imágenes o videos.' : 'Please select either Images or Videos.');

      setIsLoading(false);
      return;
    }

    try {
      let imageUrl;
      if (selectedFile && (selectedFile.type === 'image/png' || selectedFile.type === 'image/jpg' || selectedFile.type === 'image/jpeg')) {
        const compressedFile = await compressImage(selectedFile);
        imageUrl = await uploadOriginalFilesToS3(compressedFile);
      }
      if (!selectedFile) {
        console.error('Please upload a cover image for your album.');
        handleOpenMessage(spanish ? 'Por favor sube una imagen de portada para tu álbum.' : 'Please upload a cover image for your album.');
        setIsLoading(false);
        return
      }
      setimageUrl(imageUrl);
      console.log('imageUrl: ', imageUrl);
      // handleSubmit();

    } catch (error) {
      console.error(error);
    }
    // finally {
    //   setIsLoading(false);
    // }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };






  const handleSubmit222222 = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    console.log(data);
    await uploadImage(e as any);
  };





  const handleSubmit = async () => {

    // if (!value) {
    //   console.error('Please select either Images or Videos.');
    //   alert('Please select either Images or Videos.');
    //   return;
    // }
    // if (!imageUrl) {
    //   console.error('Please upload a cover image for your album.');
    //   alert('Please upload a cover image for your album.');
    //   return;
    // }
    if (!selectedDate) {
      console.error('Please select a date.');
      handleOpenMessage(spanish ? 'Por favor selecciona una fecha.' : 'Please select a date.');
      return;
    }


    const formattedDate = selectedDate?.toJSON();
    const credentials = {
      sessDate: new Date(formattedDate),
      spot: Number(selectedSpot.id),
      photographer: Number(photographer?.id),
      cover_image: String(imageUrl),
      videos: value === 20, // Set videos to true if value is 20 (Videos)
    };
    try {
      console.log(credentials);
      await dispatch(createSessAlbumAsync(credentials));
    } catch (error) {
      console.error('Error creating sess album:', error);
    }
  };

  const handleAddSpotClick = () => {
    setShowCreateSpot(true);
  };


  const setSpanish = () => {
    dispatch(toggleSpanish());
  };




  const handleCancelUpload = () => {
    // dispatch(removeNewSess());
    // dispatch(removeNewPrices());
    navigate('/');
  };





  return (
    <>
      <Box sx={{ width: '100%', maxWidth: '100vw', }}>

        <Stepper sx={{ width: '100%', marginBottom: '40px', }}>
          <Step
            orientation="vertical"
            indicator={<StepIndicator variant="solid" sx={{ backgroundColor: teal[400], color: 'white' }}>1</StepIndicator>}
          >
            {spanish ? 'Agregar detalles de la sesión' : 'Add Session Details'}
          </Step>
          <Step
            orientation="vertical"
            indicator={<StepIndicator variant="outlined">2</StepIndicator>}
          >
            {spanish ? 'Establecer precios' : 'Set Prices'}
          </Step>
          <Step orientation="vertical" indicator={<StepIndicator variant="outlined">3</StepIndicator>}>
            {spanish ? 'Subir imágenes / videos' : 'Upload Images / Videos'}
          </Step>
          <Step orientation="vertical" indicator={<StepIndicator variant="outlined">4</StepIndicator>}>
            {spanish ? '¡Hecho!' : 'Done!'}
          </Step>
        </Stepper>






        {/* <Box
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
          <Button
            color="neutral"
            variant="outlined"
            onClick={() => setSpanish()}
            disabled={!spanish} // Disable if spanish is false
          >
            English
          </Button>
          <Button
            color="neutral"
            variant="outlined"
            onClick={() => setSpanish()}
            disabled={spanish} // Disable if spanish is true
          >
            Español
          </Button>
        </Box>
      </Box> */}




        {/* Render CreateSpot conditionally */}
        {showCreateSpot && <CreateSpot />}



        {!isLoading && (

          <Box component="form"
            noValidate
            onSubmit={handleSubmit222222}
            encType="multipart/form-data" sx={{ margin: 'auto', marginTop: '16px' }}>

            <Stepper orientation="vertical" sx={{ width: 300, margin: 'auto', marginTop: '1px', paddingLeft: isMobile ? '65px' : '0', }}>


              <Step
                indicator={
                  <StepIndicator sx={{ marginRight: spanish ? '120px' : '80px', backgroundColor: '#FFEEAD', whiteSpace: 'nowrap', }}> {spanish ? 'Imagen de portada' : 'Cover Image '}
                    <IconButton
                      size="small"
                      sx={{ marginRight: '8px' }}
                      onClick={() => { handleOpenInfoCI() }}
                    >
                      <HelpIcon sx={{ fontSize: '16px' }} />
                    </IconButton> </StepIndicator>}>




                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', mb: 0 }}>
                  <Button
                    component="label"
                    sx={{
                      width: isMobile? 230 : 270,
                      height: 'auto',
                      padding: '14px 0',
                      border: '1px solid #aaa',
                      backgroundColor: '#FFEEAD',
                      borderRadius: '4px',
                      color: '#000',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: '#FFEEAD',
                        border: '1px solid #333',
                      },
                      display: 'flex',
                      justifyContent: 'flex-start'
                    }}
                  >
                    <Typography sx={{ fontWeight: 400, marginLeft: '15px', color: 'rgba(0, 0, 0, 0.6)' }}>
                      {spanish ? 'Subir una foto de perfil' : 'Upload a profile picture'}
                    </Typography>
                    <input
                      type="file"
                      accept="image/*"
                      name="image"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                  </Button>
                </Box>



                {/* <input
                  type="file"
                  style={{
                    width: '270px',      // Set width explicitly
                    height: 'auto',
                    padding: '12px 0',     // Set height as auto (or a specific value if needed)
                    border: '1px solid #ccc', // Add a border to make it visible
                    cursor: 'pointer'    // Change the cursor style to pointer for better UX
                  }}
                  accept="image/png,image/jpeg"
                  name="image"
                  onChange={handleImageChange}
                /> */}
              </Step>

              <Step>{imagePreview && <img src={imagePreview} alt="profileImg" style={{width: isMobile? 230 : 270, height: 'auto' }} />}</Step>




              <Step indicator={<StepIndicator sx={{ marginRight: '16px', backgroundColor: '#FFEEAD', }}> {spanish ? 'Fecha' : 'Date '} </StepIndicator>}>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <MobileDateTimePicker
                    disableFuture
                    sx={{ width: isMobile? 230 : 270 }}
                    value={selectedDate}
                    label={spanish ? 'Seleccionar una fecha' : "Select a Date"}
                    onChange={(newDate) => setSelectedDate(newDate)}
                  />
                </LocalizationProvider></Step>







              <Step indicator={<StepIndicator sx={{ marginRight: '16px', backgroundColor: '#FFEEAD', }}> {spanish ? 'Lugar' : 'Spot '} </StepIndicator>}>

                <Autocomplete
                  sx={{ width: isMobile? 230 : 270 }}
                  disablePortal
                  onChange={(event, newValue) => setSelectedSpot(newValue)}
                  id="combo-box-demo"
                  options={allSpots}
                  getOptionLabel={(spot) => spot.name}
                  value={selectedSpot}
                  onInputChange={(event, newInputValue) => setSearchValue(newInputValue)}
                  renderInput={(params) => <TextField {...params} label={spanish ? 'Seleccionar un lugar' : "Select a Location"} />}
                  renderOption={(props, option) => (
                    <li
                      {...props}
                      key={option.name}
                      style={{ backgroundColor: 'white', padding: '8px', borderBottom: '1px solid #ddd' }}
                    >
                      {option.name}
                    </li>
                  )}
                  noOptionsText={
                    searchValue ? (
                      <Box onClick={handleAddSpotClick} sx={{ cursor: 'pointer', backgroundColor: '#ffffff', color: 'primary.main', p: 1, }}>
                        {spanish ? 'Haz clic aquí para crear un nuevo lugar / spot' : 'Click here to create a new spot'}
                      </Box>
                    ) : (
                      <Typography sx={{ p: 1 }}>No options</Typography>
                    )
                  }
                />
              </Step>




              <Step indicator={<StepIndicator sx={{ marginBottom: '20px', marginRight: '100px', backgroundColor: '#FFEEAD', whiteSpace: 'nowrap', }}> {spanish ? 'Imagenes o videos' : "Images or Videos"}  </StepIndicator>}>
                <FormControl sx={{ width: isMobile? 230 : 270, marginBottom: '20px', }}>
                  <InputLabel id="demo-controlled-open-select-label">{spanish ? 'Imagenes o videos' : "Images or Videos"}</InputLabel>
                  <Select
                    labelId="demo-controlled-open-select-label"
                    id="demo-controlled-open-select"
                    open={open}
                    onClose={handleClose}
                    onOpen={handleOpen}
                    value={value}
                    label="Value"
                    onChange={handleChange}
                  >
                    <MenuItem value={10}> {spanish ? 'Imagenes' : "Images"}</MenuItem>
                    <MenuItem value={20}>Videos </MenuItem>
                  </Select>
                </FormControl></Step>


            </Stepper>



            <Alert
              variant="outlined"
              color="warning"
              startDecorator={<WarningIcon />}
              sx={{

                maxWidth: isMobile ? '90%' : '370px', // 90% width on mobile, 400px on larger screens
                margin: '0 auto', // Center horizontally
                textAlign: 'center',
              }}
            >
              <Typography>
                {spanish ? 'Por favor, verifique antes de continuar. Los detalles de la sesión no se pueden cambiar más tarde.' : "Please double check before you continue. Session details can not be changed later."}
              </Typography>
            </Alert>




            <Box sx={{ gap: 8, marginTop: '16px' }}>
              <Button size="md" color="danger" onClick={handleCancelUpload} sx={{ mr: 2 }}>
                {spanish ? 'Cancelar' : "Cancel"}
              </Button>
              <Button disabled={isLoading} type="submit" sx={{ backgroundColor: teal[400], color: 'white' }}>
                {isLoading ? (spanish ? 'Subiendo...' : 'Uploading...') : (spanish ? 'Continuar' : 'Continue')}
              </Button>
            </Box>

          </Box>
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
                Loading...
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



        {openInfoCI &&
          <Dialog
            open={openInfoCI}
            onClose={handleCloseInfoCI}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {spanish ? 'Subir Imagen de Portada' : "Cover Image Upload"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {spanish ? 'Sube una imagen de portada para tu álbum. Esta imagen representará tu álbum y será visible para los usuarios en nuestra página de inicio. Por ejemplo:' : "Upload a cover image for your album. This image will represent your album and be visible to users on our homepage. For example:"}
              </DialogContentText>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <img src={"https://surfingram-profile-images.s3.us-east-2.amazonaws.com/Screenshot+cover+image.png"} alt="Cover Preview" style={{ width: '50%', height: 'auto' }} />
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseInfoCI} autoFocus>
                OK
              </Button>
            </DialogActions>
          </Dialog>
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




      </Box>


    </>
  );
}
