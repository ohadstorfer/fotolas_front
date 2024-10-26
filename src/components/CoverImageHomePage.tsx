import * as React from 'react';
import Box from '@mui/joy/Box';
import { useMediaQuery } from '@mui/material';

export default function CoverImageHomePage() {
  const isMobile = useMediaQuery('(max-width:600px)');





  return (
  <Box
  // style={{ marginTop: '70px', padding: '0px' }}
    sx={{
      width: '100%',  // Ensure full width
      height: 'auto', // Adjust height automatically based on the image ratio
    }}
  >
    <img
      src={isMobile ? `${process.env.PUBLIC_URL}/COVER.png` : `${process.env.PUBLIC_URL}/COVERslim.png`}
      alt="Cover"
      style={{
        width: '100%',
        height: 'auto',
        objectFit: 'cover', // Ensures the image covers the space
      }}
    />
  </Box>

  );
}
