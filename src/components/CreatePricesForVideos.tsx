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
import { removeNewPrices, removeNewSess, removeNewSessDetails, selectNewPrices, selectNewSess, selectVideos, sessGetDataAsync, updatePricesAsync, updatePricesForVideosAsync } from '../slicers/sessAlbumSlice';
import { TextField, Typography, useMediaQuery } from '@mui/material';
import { createSpotAsync, selectSpot } from '../slicers/spotSlice';
import Stepper from '@mui/joy/Stepper';
import Step from '@mui/joy/Step';
import StepIndicator from '@mui/joy/StepIndicator';
import { Alert } from '@mui/joy';
import WarningIcon from '@mui/icons-material/Warning';



export default function UserCard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate()
  const newSpot = useSelector(selectSpot);
  const newSess = useSelector(selectNewSess);
  const newPrices = useSelector(selectNewPrices);
  const videos = useSelector(selectVideos)
  const isMobile = useMediaQuery('(max-width:600px)');
  console.log(videos);



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



  //   useEffect(() => {
  //     console.log('prices:', prices);
  //     if(prices)
  //     {videos? navigate('/PleaseWorkVideo') :navigate('/PleaseWork') }

  //  }, [prices]);

  useEffect(() => {
    console.log('prices from the component 1: ', newPrices);
    if (newPrices) {
      console.log('prices from the component 2: ', newPrices);
      navigate('/PleaseWorkVideoS3Errors')
    }
  }, [newPrices]);


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const price_1_to_5_str = data.get("price_1_to_5");
    const price_6_to_15_str = data.get("price_6_to_15");
    const price_16_plus_str = data.get("price_16_plus");

    // Check if any field is empty or not a valid number
    if (
      !price_1_to_5_str ||
      !price_6_to_15_str ||
      !price_16_plus_str ||
      isNaN(Number(price_1_to_5_str)) ||
      isNaN(Number(price_6_to_15_str)) ||
      isNaN(Number(price_16_plus_str))
    ) {
      alert("Please add a value for all fields.");
      return;
    }

    const credentials = {
      session_album: Number(newSess?.id),
      price_1_to_5: Number(price_1_to_5_str),
      price_6_to_15: Number(price_6_to_15_str),
      price_16_plus: Number(price_16_plus_str),
    };

    // Price validation scenarios
    if (credentials.price_1_to_5 > credentials.price_6_to_15) {
      const confirm1 = window.confirm(
        "The price for 1 to 5 videos is higher than the price for 6 to 15 videos. Are you sure you want to proceed?"
      );
      if (!confirm1) return;
    }

    if (credentials.price_6_to_15 > credentials.price_16_plus) {
      const confirm2 = window.confirm(
        "The price for 6 to 15 videos is higher than the price for 16 or more videos. Are you sure you want to proceed?"
      );
      if (!confirm2) return;
    }

    if (credentials.price_1_to_5 > credentials.price_16_plus) {
      const confirm3 = window.confirm(
        "The price for 1 to 5 videos is higher than the price for 16 or more videos. Are you sure you want to proceed?"
      );
      if (!confirm3) return;
    }

    try {
      console.log(credentials);
      await dispatch(updatePricesForVideosAsync(credentials));
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
          Add Session Details
        </Step>
        <Step
          orientation="vertical"
          indicator={<StepIndicator variant="solid" sx={{ backgroundColor: teal[400], color: 'white' }}>2</StepIndicator>}
        >
          Set Prices
        </Step>
        <Step orientation="vertical" indicator={<StepIndicator variant="outlined">3</StepIndicator>}>
          Upload Videos
        </Step>
        <Step orientation="vertical" indicator={<StepIndicator variant="outlined">4</StepIndicator>}>
          Done!
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
        Please double check before you continue. Prices can not be changed later.
      </Typography>
    </Alert>







      <Box component="form" noValidate onSubmit={handleSubmit} encType="multipart/form-data"
        sx={{
          width: '50%',
          margin: 'auto',
          marginTop: '16px',
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



            <TextField
              margin="normal"
              required
              fullWidth
              name="price_1_to_5"
              label="Set a price for albums with 1 to 5 videos"
              type="number"
              id="price_1_to_5"
              autoComplete="current-price_1_to_5"
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="price_6_to_15"
              label="Set a price for albums with 6 to 15 videos"
              type="number"
              id="price_6_to_15"
              autoComplete="current-price_6_to_15"
            />


            <TextField
              margin="normal"
              required
              fullWidth
              name="price_16_plus"
              label="Set a price for albums with 16 videos or more videos"
              type="number"
              id="price_16_plus"
              autoComplete="current-price_16_plus"
            />


            <Box sx={{ display: 'flex', p: 1.5, my: 3, gap: 1.5, '& > button': { flex: 1 } }}>

              <Button size="md" color="danger" onClick={handleCancelUpload}>
                Cancle
              </Button>

              <Button type="submit"
                fullWidth
                sx={{ backgroundColor: teal[400], color: 'white' }}>
                Confirm
              </Button>
            </Box>

          </CardContent>
        </Card>

      </Box>
    </>
  );
}
