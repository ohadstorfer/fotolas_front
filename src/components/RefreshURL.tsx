import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, useMediaQuery } from '@mui/material';
import { teal } from '@mui/material/colors';
import Stepper from '@mui/joy/Stepper';
import Step from '@mui/joy/Step';
import StepIndicator from '@mui/joy/StepIndicator';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useAppDispatch } from '../app/hooks';
import { removeNewPrices, removeNewSess, selectNewSess } from '../slicers/sessAlbumSlice';
import { Alert } from '@mui/joy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { selectSpanish } from '../slicers/sighnInSlice';
import { selectUser } from '../slicers/userSlice';


const RefreshURL = () => {
  const newSess = useSelector(selectNewSess);
  const [error, setError] = useState(false)
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery('(max-width:600px)');
  const spanish = useSelector(selectSpanish)
  const user = useSelector(selectUser)
  const [hasContent, setHasContent] = useState(false);
  const [accountCreatePending, setAccountCreatePending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [accountLinkCreatePending, setAccountLinkCreatePending] = useState(false);







  const createStripeAccountLink = async (stripeAccountId: string) => {
    try {
      setLoading(true);
      setAccountLinkCreatePending(true);
      setError(false);
  
      const response = await fetch("https://oyster-app-b3323.ondigitalocean.app/account_link/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ account: stripeAccountId }),
      });
  
      const json = await response.json();
      setAccountLinkCreatePending(false);
  
      const { url, error } = json;
      if (url) {
        window.location.href = url;
      } else if (error) {
        setError(true);
      }
    } catch (error) {
      setAccountLinkCreatePending(false);
      setError(true);
    } finally {
      setLoading(false);
    }
  };





  const handleButtonClick = () => {
    console.log(user?.stripe_account_id);
    
    const stripeAccountId = user?.stripe_account_id;
    if (stripeAccountId) {
      createStripeAccountLink(stripeAccountId);
    } else {
      console.error("Stripe account ID is missing");
    }
  };




  return (
    <div className="container">
      <Alert
        variant="outlined"
        color="success"
        startDecorator={<CheckCircleIcon />}
        sx={{
          maxWidth: isMobile ? '90%' : '400px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <Typography>
          {spanish
            ? 'Tu solicitud para convertirte en fotógrafo está en proceso de verificación. Te notificaremos por correo electrónico si ha sido aprobada o si necesitas proporcionar más detalles.'
            : 'Your request to become a photographer is under review. You will receive updates via email if it is approved or if you need to provide more information.'}
        </Typography>
      </Alert>

      <Button
        sx={{
          marginTop: '16px',
          backgroundColor: teal[400],
          color: 'white',
          '&:hover': {
            backgroundColor: teal[500],
          },
        }}
        onClick={handleButtonClick}
        disabled={loading || accountLinkCreatePending}
      >
        {spanish ? '¡Continúa con tu proceso de incorporación!' : 'Continue with your onboarding process!'}
      </Button>

      {error && (
        <Alert color="danger" sx={{ mt: 2 }}>
        {spanish ? '¡Algo salió mal! Inténtalo de nuevo.' : 'Something went wrong! Please try again.'}
      </Alert>
      )}
    </div>
  );
};

export default RefreshURL;
