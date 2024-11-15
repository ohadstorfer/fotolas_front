import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function SimpleBottomNavigation() {
  const [value, setValue] = React.useState(0);
  const navigate = useNavigate();

  
  

  const handleAboutClick = async () => {
    navigate('/About');
  };

  const handleContactUsClick = async () => {
    navigate('/ContactUs');
  };


  return (
    <Box sx={{ fontSize: '17px', width: '100%' }}>
  <BottomNavigation
    sx={{
      bgcolor: 'rgba(199, 157, 110, 0.4)',
      color: '#333333',
      height: 42,
    }}
    showLabels
  >
    <BottomNavigationAction
      label="About us"
      sx={{
        fontSize: '17px',
        '& .MuiBottomNavigationAction-label': { fontSize: '17px' }, // Ensure font size applies to the label
      }}
      onClick={handleAboutClick}
    />
    <BottomNavigationAction
      label="Terms of use"
      sx={{
        fontSize: '17px',
        '& .MuiBottomNavigationAction-label': { fontSize: '17px' }, // Ensure font size applies to the label
      }}
    />
        <BottomNavigationAction
      label="Contact us"
      sx={{
        fontSize: '17px',
        '& .MuiBottomNavigationAction-label': { fontSize: '17px' }, // Ensure font size applies to the label      
      }}
      onClick={handleContactUsClick}
    />
  </BottomNavigation>
</Box>
  ); 
}
