import * as React from 'react';
import Box from '@mui/joy/Box';
import { useMediaQuery } from '@mui/material';

export default function CoverImageHomePage() {
  const isMobile = useMediaQuery('(max-width:600px)');
  const [isLoading, setIsLoading] = React.useState(true);


  const handleImageLoad = () => {
    setIsLoading(false); // Set loading to false once the image has loaded
  };



  return (
    <Box
    sx={{
      width: '100%',
      height: 'auto',
    }}
  >
    {isLoading && (
      <Box sx={{ width: '100%', height: 'auto', backgroundColor: 'gray' }}>
        {/* Optional: You can add a placeholder here (like a spinner) */}
      </Box>
    )}

    <img
      src={isMobile ? `${process.env.PUBLIC_URL}/COVER.png` : `${process.env.PUBLIC_URL}/COVERslim.png`}
      style={{
        width: '100%',
        height: 'auto',
        objectFit: 'cover', // Ensures the image covers the space
      }}
      onLoad={handleImageLoad} // Trigger handleImageLoad once the image is loaded
    />
  </Box>

  );
}
