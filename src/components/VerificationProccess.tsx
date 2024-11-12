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


const VerificationProccess = () => {
  const newSess = useSelector(selectNewSess);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery('(max-width:600px)');
  const spanish = useSelector(selectSpanish)
  const user = useSelector(selectUser)


  useEffect(() => {
    // Redirect if user is already a photographer
    if (user?.is_photographer) {
      navigate('/EditProfilePtg');
    }
  }, [user, navigate]);



  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = ''; // Browser's default warning dialog
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload); // Clean up
    };
  }, [dispatch]);





  const handleNavigateHome = () => {
    navigate('/'); // Navigate to the home page
  };



  const VerificationStatus = () => {
    navigate("/VerificationAlerts");
  };



  return (
    <div className="container">



      <Alert
        variant="outlined"
        color="success"
        startDecorator={<CheckCircleIcon />}
        sx={{
          maxWidth: isMobile ? '90%' : '400px',
          margin: '0 auto', // Center horizontally
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
        variant="contained"
        sx={{
          marginTop: 2,
          backgroundColor: teal[400], // Set custom background color
          '&:hover': {
            backgroundColor: teal[600], // Custom color on hover (optional)
          }
        }}
        onClick={VerificationStatus}
      >
        {spanish ? "Ir a verificar el estado de tu solicitud de verificación" : 'Go to check your verification status'}
      </Button>
    </div>
  );
};

export default VerificationProccess;
