import * as React from 'react';
import Box from '@mui/material/Box';
import { useAppDispatch } from '../app/hooks';
import { useEffect } from 'react';
import { Button } from '@mui/material';
import { teal } from '@mui/material/colors';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectSpanish } from '../slicers/sighnInSlice';


export default function PhotographerNavbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // Get current location
  const spanish = useSelector(selectSpanish)


  useEffect(() => {
    if (1) {

    }
  }, [dispatch]);

  const editProfilePtgClick = () => {
    navigate("/EditProfilePtg");
  };
  const dashboardClick = () => {
    navigate(`/DashboardPhotographer`);
  };

  const addAlbumClick = () => {
    navigate(`/ProtectedRoutesCreatSessAlbumcopy`);
  };

  const myAlbumsClick = () => {
    navigate("/MyAlbums");
  };

  // Helper function to determine if the current path matches
  const isActive = (path: string) => location.pathname === path;

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        maxWidth: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 1,
        bgcolor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: '0 0 0px 0',
        textAlign: 'center',
        marginTop: '63px',
        padding: '10px',
        gap: 1.5,
        boxSizing: 'border-box',
        overflowX: 'hidden',
      }}
    >

      <Button
        onClick={addAlbumClick}
        variant="contained"
        style={{
          backgroundColor: isActive("/CreatSessAlbumErrors") ? 'white' : teal[400],
          color: isActive("/CreatSessAlbumErrors") ? 'black' : 'black'
        }}
      >
        {spanish ? 'Subir Álbum' : 'Upload Album'}
      </Button>

      <Button
        onClick={myAlbumsClick}
        variant="contained"
        style={{
          backgroundColor: isActive("/MyAlbums") ? 'white' : teal[400],
          color: isActive("/MyAlbums") ? 'black' : 'black'
        }}
      >
        {spanish ? 'Mi Álbumes' : 'My Albums'}
        
      </Button>

      <Button
        onClick={dashboardClick}
        variant="contained"
        style={{
          backgroundColor: isActive("/DashboardPhotographer") ? 'white' : teal[400],
          color: isActive("/DashboardPhotographer") ? 'black' : 'black'
        }}
      >
        {spanish ? 'Ganancias Resumen' : 'Earnings Summary'}
      </Button>

      <Button
        onClick={editProfilePtgClick}
        variant="contained"
        style={{
          backgroundColor: isActive("/EditProfilePtg") ? 'white' : teal[400],
          color: isActive("/EditProfilePtg") ? 'black' : 'black'
        }}
      >
        {spanish ? 'Perfil Ajustes' : 'Profile Settings'}
      </Button>
    </Box>
  );
}
