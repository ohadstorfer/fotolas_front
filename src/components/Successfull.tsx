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


const Successfull = () => {
  const newSess = useSelector(selectNewSess);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery('(max-width:600px)');




  

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
          Add Session Details
        </Step>
        <Step orientation="vertical" indicator={<StepIndicator>2</StepIndicator>}>
          Set Prices
        </Step>
        <Step orientation="vertical" indicator={<StepIndicator>3</StepIndicator>}>
          Upload Videos
        </Step>
        <Step orientation="vertical" indicator={<StepIndicator variant="solid" sx={{ backgroundColor: teal[400], color: 'white' }}>4</StepIndicator>}>
          Done!
        </Step>
      </Stepper>

      



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
          Your album has been created successfully and is now available to watch on our homepage!
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
            onClick={handleNavigateHome}
          >
            Go to Homepage
          </Button>
    </div>
  );
};

export default Successfull;
