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
import InfoIcon from '@mui/icons-material/Info';
import { selectSpanish } from '../slicers/sighnInSlice';
import SessAlbumDetails from './SessAlbumDetails';


const ExpiredSessAlbum = () => {
  const newSess = useSelector(selectNewSess);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery('(max-width:600px)');
  const spanish = useSelector(selectSpanish)





  const handleNavigateHome = () => {
    navigate('/'); // Navigate to the home page
  };




  return (
    <div className="container">
      <SessAlbumDetails />





      <Alert
      variant="outlined"
      color="neutral"
      startDecorator={<InfoIcon />}
      sx={{
        maxWidth: isMobile ? '90%' : '400px',
        margin: '0 auto', // Center horizontally
        textAlign: 'center',
        marginTop: '20px',
      }}
    >

      <Typography>
      <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>This album is expired. </span><br />
        Images and videos on our website are available for a limited time. Images remain accessible for 30 days, while videos are available for 5 days.
      </Typography>
    </Alert>


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

export default ExpiredSessAlbum;
