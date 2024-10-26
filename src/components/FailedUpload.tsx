import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, useMediaQuery } from '@mui/material';
import { teal } from '@mui/material/colors';
import Stepper from '@mui/joy/Stepper';
import Step from '@mui/joy/Step';
import StepIndicator from '@mui/joy/StepIndicator';
import { useAppDispatch } from '../app/hooks';
import { removeNewPrices, removeNewSess, selectNewSess } from '../slicers/sessAlbumSlice';
import { Alert } from '@mui/joy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReportIcon from '@mui/icons-material/Report';
import { selectSpanish } from '../slicers/sighnInSlice';


const FailedUpload = () => {
  const newSess = useSelector(selectNewSess);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery('(max-width:600px)');
  const spanish = useSelector(selectSpanish)



  

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




  return (
    <div className="container">
      <Stepper sx={{ width: '100%' , marginBottom: '40px' }}>
        <Step orientation="vertical" indicator={<StepIndicator>1</StepIndicator>}>
        {spanish ? 'Agregar detalles de la sesión' : 'Add Session Details'}
        </Step>
        <Step orientation="vertical" indicator={<StepIndicator>2</StepIndicator>}>
        {spanish ? 'Establecer precios' : 'Set Prices'}
        </Step>
        <Step orientation="vertical" indicator={<StepIndicator>3</StepIndicator>}>
        {spanish ? 'Subir imágenes' : 'Upload Images'}
        </Step>
        <Step orientation="vertical" indicator={<StepIndicator variant="solid" color="danger">4</StepIndicator>}>
        {spanish ? 'Fallido' : 'Failed'}
        </Step>
      </Stepper>

      




        <Alert
          variant="outlined"
          color="danger"
          startDecorator={<ReportIcon  />}
          sx={{
            maxWidth: isMobile ? '90%' : '420px',
            margin: '0 auto', // Center horizontally
            textAlign: 'center',
          }}
        >
          <Typography>
          {spanish ? 'Falló la carga debido a un error inesperado. Por favor, inténtalo de nuevo más tarde.' : 'Upload failed due to an unexpected error. Please try again later.'}
          </Typography>
        </Alert>


        <img src={"https://media.istockphoto.com/id/2163736176/vector/a-hand-drawn-icon-of-broken-surfboard.jpg?s=612x612&w=0&k=20&c=o_L7pWZ_LSpEsmMKwi-x9EmeWpumDkv3-tzzDqCBgPk="} alt="profileImg" style={{ width: '270px', height: 'auto' }} />

<br></br>

        <Button
            variant="contained"
            sx={{
              marginTop: 2,
              backgroundColor: teal[400], // Set custom background color
              '&:hover': {
                backgroundColor: teal[600], // Custom color on hover (optional)
              }
            }}
            onClick={handleNavigateHome}
          >
            {spanish ? 'Ir a la página principal' : 'Go to Homepage'}
          </Button>
    </div>
  );
};

export default FailedUpload;
