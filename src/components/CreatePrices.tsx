import * as React from 'react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import { useAppDispatch } from '../app/hooks';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getPhotographerById, selectPhotographer } from '../slicers/photographerSlice';
import { teal } from '@mui/material/colors';
import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import SessAlbum from './SessAlbum';
import { removeNewPrices, removeNewSess, removeNewSessDetails, selectNewPrices, selectNewSess, selectVideos, sessGetDataAsync, updatePricesAsync } from '../slicers/sessAlbumSlice';
import { Checkbox, FormControlLabel, TextField, Typography, useMediaQuery } from '@mui/material';
import { createSpotAsync, selectSpot } from '../slicers/spotSlice';
import Stepper from '@mui/joy/Stepper';
import Step from '@mui/joy/Step';
import StepIndicator from '@mui/joy/StepIndicator';
import { Alert } from '@mui/joy';
import WarningIcon from '@mui/icons-material/Warning';
import { selectSpanish, toggleSpanish } from '../slicers/sighnInSlice';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, } from '@mui/material';
import { fetchDefaultAlbumPricesImages, fetchDefaultAlbumPricesVideos, selectDefaultAlbumPricesImages, selectDefaultAlbumPricesVideos, selectNewDefaultAlbumPricesImages, selectNewDefaultAlbumPricesVideos, updateDefaultAlbumPricesForImagesAsync } from '../slicers/becomePhotographerSlice';
import { selectProfilePhotographer } from '../slicers/profilePtgSlice';




export default function UserCard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate()
  const newSpot = useSelector(selectSpot);
  const newSess = useSelector(selectNewSess);
  const newPrices = useSelector(selectNewPrices);
  const videos = useSelector(selectVideos)
  const isMobile = useMediaQuery('(max-width:600px)');
  const spanish = useSelector(selectSpanish)
  const [openMessage, setOpenMessage] = React.useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const photographer = useSelector(selectProfilePhotographer);
  const defaultPricesImages = useSelector(selectDefaultAlbumPricesImages);
  const newDefaultPricesImages = useSelector(selectNewDefaultAlbumPricesImages);
  const [checkboxSelected, setCheckboxSelected] = useState(false);



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
    if (photographer) {
      dispatch(fetchDefaultAlbumPricesImages(photographer.id));
    }
  }, [dispatch,]);




  const setSpanish = () => {
    dispatch(toggleSpanish());
  };

  //   useEffect(() => {
  //     console.log('prices:', prices);
  //     if(prices)
  //     {videos? navigate('/PleaseWorkVideo') :navigate('/PleaseWork') }

  //  }, [prices]);


  useEffect(() => {

    if (newPrices) {
      console.log('prices:', newPrices);
      navigate('/PleaseWorkErrors')
    }


  }, [newPrices]);


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const price_1_to_5_str = data.get("price_1_to_5");
    const price_6_to_50_str = data.get("price_6_to_50"); // Updated to reflect new pricing structure
    const price_51_plus_str = data.get("price_51_plus"); // Updated to reflect new pricing structure

    // Check if any field is empty or not a valid number
    if (
      !price_1_to_5_str ||
      !price_6_to_50_str ||
      !price_51_plus_str ||
      isNaN(Number(price_1_to_5_str)) ||
      isNaN(Number(price_6_to_50_str)) ||
      isNaN(Number(price_51_plus_str))
    ) {
      alert("Please add a value for all fields.");
      return;
    }

    const credentials = {
      session_album: Number(newSess?.id),
      price_1_to_5: Number(price_1_to_5_str),
      price_6_to_50: Number(price_6_to_50_str), // Updated to reflect new pricing structure
      price_51_plus: Number(price_51_plus_str), // Updated to reflect new pricing structure
    };

    // Price validation scenarios
    if (credentials.price_1_to_5 > credentials.price_6_to_50) {
      handleOpenMessage(
        spanish
          ? 'El precio para 1 a 5 imágenes es mayor que el precio para 6 a 50 imágenes. Por favor, ajusta los precios para que tengan sentido.'
          : "The price for 1 to 5 images is higher than the price for 6 to 50 images. Please adjust the prices to ensure they are logical."
      );
      return;
    }

    if (credentials.price_6_to_50 > credentials.price_51_plus) {
      handleOpenMessage(
        spanish
          ? 'El precio para 6 a 50 imágenes es mayor que el precio para 51 o más imágenes. Por favor, ajusta los precios para que tengan sentido.'
          : "The price for 6 to 50 images is higher than the price for 51 or more images. Please adjust the prices to ensure they are logical."
      );
      return;
    }

    try {
      // If checkbox is selected, submit default image pricing
      if (checkboxSelected) {
        await DefaultImagePricingSubmit(e);
      }
      console.log(credentials);
      await dispatch(updatePricesAsync(credentials));
    } catch (error) {
      console.error('updatePrices failed:', error);
    }
  };










  const DefaultImagePricingSubmit = async (e: FormEvent<HTMLFormElement>) => {
    console.log("handleImagePricingSubmit");

    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (!photographer) {
      console.error('Photographer data is not available.');
      return;
    }
    const price_1_to_5_str = data.get("price_1_to_5");
    const price_6_to_50_str = data.get("price_6_to_50"); // Updated to reflect new pricing structure
    const price_51_plus_str = data.get("price_51_plus"); // Updated to reflect new pricing structure

    // Check if any field is empty or not a valid number
    if (
      !price_1_to_5_str ||
      !price_6_to_50_str ||
      !price_51_plus_str ||
      isNaN(Number(price_1_to_5_str)) ||
      isNaN(Number(price_6_to_50_str)) ||
      isNaN(Number(price_51_plus_str))
    ) {
      alert("Please add a value for all fields.");
      return;
    }

    const credentials = {
      photographer: photographer.id,
      price_1_to_5: Number(price_1_to_5_str),
      price_6_to_50: Number(price_6_to_50_str), // Updated to reflect new pricing structure
      price_51_plus: Number(price_51_plus_str), // Updated to reflect new pricing structure
    };

    // Price validation scenarios
    if (credentials.price_1_to_5 > credentials.price_6_to_50) {
      handleOpenMessage(
        spanish
          ? 'El precio para 1 a 5 imágenes es mayor que el precio para 6 a 50 imágenes. Por favor, ajusta los precios para que tengan sentido.'
          : "The price for 1 to 5 images is higher than the price for 6 to 50 images. Please adjust the prices to ensure they are logical."
      );
      return;
    }

    if (credentials.price_6_to_50 > credentials.price_51_plus) {
      handleOpenMessage(
        spanish
          ? 'El precio para 6 a 50 imágenes es mayor que el precio para 51 o más imágenes. Por favor, ajusta los precios para que tengan sentido.'
          : "The price for 6 to 50 images is higher than the price for 51 or more images. Please adjust the prices to ensure they are logical."
      );
      return;
    }

    try {
      console.log(credentials);
      await dispatch(updateDefaultAlbumPricesForImagesAsync(credentials));
    } catch (error) {
      console.error('updatePrices failed:', error);
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




  const handleOpenMessage = (msg: string) => {
    setMessage(msg);
    setOpenMessage(true);
  };

  const handleCloseMessage = () => {
    setOpenMessage(false);
  };




  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckboxSelected(event.target.checked);
  };



  return (
    <>
      <Stepper sx={{ width: '100%', marginBottom: '40px', }}>
        <Step
          orientation="vertical"
          indicator={
            <StepIndicator>
              1
            </StepIndicator>
          }
        >
          {spanish ? 'Agregar detalles de la sesión' : 'Add Session Details'}
        </Step>
        <Step
          orientation="vertical"
          indicator={<StepIndicator variant="solid" sx={{ backgroundColor: teal[400], color: 'white' }}>2</StepIndicator>}
        >
          {spanish ? 'Establecer precios' : 'Set Prices'}
        </Step>
        <Step orientation="vertical" indicator={<StepIndicator variant="outlined">3</StepIndicator>}>
          {spanish ? 'Subir imágenes' : 'Upload Images'}
        </Step>
        <Step orientation="vertical" indicator={<StepIndicator variant="outlined">4</StepIndicator>}>
          {spanish ? '¡Hecho!' : 'Done!'}
        </Step>
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
          {spanish ? 'Por favor, verifica antes de continuar. Los precios no se podrán cambiar más tarde.' : 'Please double check before you continue. Prices can not be changed later.'}
        </Typography>
      </Alert>





      {defaultPricesImages &&

        <Box component="form" noValidate onSubmit={handleSubmit} encType="multipart/form-data"
          sx={{
            width: isMobile ? '90%' : '50%',  // Width changes based on device
            margin: '0 auto',
            marginTop: '16px',
            justifyContent: 'center',  // Center horizontally
            display: 'flex',  // Use flexbox to layout cards side by side
            // justifyContent: 'space-between',  // Create space between the cards
            // gap: 2,  // Add some spacing between the cards
          }}
        >
          <Card
            orientation="horizontal"
            sx={{
              width: '100%',
              flexWrap: 'wrap',
              [`& > *`]: {
                '--stack-point': '500px',
                minWidth: 'clamp(0px, (calc(var(--stack-point) - 2 * var(--Card-padding) - 2 * var(--variant-borderWidth, 0px)) + 1px - 100%) * 999, 100%)',
              },


              borderRadius: '16px', // Add rounded corners for a modern look
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)', // Add a subtle shadow
            }}
          >


            <CardContent>
              {/* 8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888 */}



              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="body1" sx={{ width: '100%', mr: 1 }}>
                  {spanish ? '1 a 5 imágenes' : '1 to 5 images'}
                </Typography>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="price_1_to_5"
                  type="number"
                  id="price_1_to_5"
                  defaultValue={defaultPricesImages ? defaultPricesImages[0].price_1_to_5 : ''}
                  inputProps={{
                    style: { textAlign: 'center' }
                  }}
                />
              </Box>


              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="body1" sx={{ width: '100%', mr: 1 }}>
                  {spanish ? '6 a 50 imágenes' : '6 to 50 images'}
                </Typography>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="price_6_to_50"
                  type="number"
                  id="price_6_to_50"
                  defaultValue={defaultPricesImages ? defaultPricesImages[0].price_6_to_50 : ''}
                  inputProps={{
                    style: { textAlign: 'center' }
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="body1" sx={{ width: '100%', mr: 1 }}>
                  {spanish ? 'más de 50 imágenes' : 'more than 50 images'}
                </Typography>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="price_51_plus"
                  type="number"
                  id="price_51_plus"
                  defaultValue={defaultPricesImages ? defaultPricesImages[0].price_51_plus : ''}
                  inputProps={{
                    style: { textAlign: 'center' }
                  }}
                />
              </Box>


              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <FormControlLabel control={<Checkbox checked={checkboxSelected} onChange={handleCheckboxChange} />} label={spanish ? 'Guardar precios como predeterminados' : "Save pricing as default"} />
              </Box>


              <Box sx={{ display: 'flex', p: 1.5, my: 1, gap: 1.5, '& > button': { flex: 1 } }}>
                <Button size="md" color="danger" onClick={handleCancelUpload}>
                  {spanish ? 'Cancelar' : "Cancel"}
                </Button>

                <Button type="submit"
                  fullWidth
                  sx={{ backgroundColor: teal[400], color: 'white' }}>
                  {spanish ? 'Confirmar' : "Confirm"}
                </Button>
              </Box>

            </CardContent>
          </Card>



        </Box>

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


    </>
  );
}
