import React from 'react';
import {  Typography, useMediaQuery } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { Alert } from '@mui/joy';

const LimitedTimeAlert = () => {
const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <Alert
      variant="outlined"
      color="neutral"
      startDecorator={<InfoIcon />}
      sx={{
        maxWidth: isMobile ? '90%' : '400px',
        margin: '0 auto', // Center horizontally
        textAlign: 'center',
      }}
    >
      {/* <Typography>
        Images and videos on our website are available for a limited time. Images remain accessible for 30 days, while videos are available for 5 days.
      </Typography> */}

      <Typography>
      Albums on our website are only available for a limited time, remaining accessible for 30 days.
      </Typography>

    </Alert>
  );
};

export default LimitedTimeAlert;
