import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import { useAppDispatch } from '../app/hooks';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {  getPhotographerById, selectPhotographer } from '../slicers/photographerSlice';
import { teal } from '@mui/material/colors';
import { useEffect, useState } from 'react';
import SessAlbum from './SessAlbum';
import { sessGetDataAsync } from '../slicers/sessAlbumSlice';
import { MdModeEdit } from "react-icons/md";
import { IoMdAddCircleOutline } from "react-icons/io";
import { FaHistory } from "react-icons/fa";
import { getPhotographerByUserId, selectProfilePhotographer } from '../slicers/profilePtgSlice';
import { styled, useMediaQuery } from '@mui/material';
import { selectLoggedIn, selectToken } from '../slicers/sighnInSlice';
import Alert from '@mui/material/Alert';
import { selectUser } from '../slicers/userSlice';


export default function UserCard() {
  const dispatch = useAppDispatch();
  const navigate  = useNavigate();
  const photographer = useSelector(selectProfilePhotographer);
  const conectedUser = useSelector(selectToken)
  const user = useSelector(selectUser)
  const isLoggedIn = useSelector(selectLoggedIn)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');
  const token = useSelector(selectToken)
  //                 'Authorization': `Bearer ${token}`



  useEffect(() => {
    console.log(isLoggedIn);
    console.log(user?.is_photographer);
    console.log(conectedUser);
    if (!isLoggedIn || !user?.is_photographer || !conectedUser) {
      setError(true);
      navigate(`/`);
    } else {
      const accessToken = token?.access
      const tokenString = typeof accessToken === 'string' ? accessToken : JSON.stringify(accessToken || '');
      const tokenValue = tokenString.replace(/"/g, '');

      dispatch(getPhotographerByUserId({ userId: Number(conectedUser.id), token: tokenValue }));
    }
  }, [dispatch, isLoggedIn, user, navigate, conectedUser]);




  
  // Set error if the connected user does not match the photographer's user
  useEffect(() => {
    if (photographer) {
      setLoading(false);
    }
  }, [photographer]);


  const editProfilePtgClick = () => {
    navigate("/EditProfilePtg");
  };
  const dashboardClick = () => {
    navigate(`/DashboardPhotographer`);
  };

  const addAlbum = () => {
    navigate(`/ProtectedRoutesCreatSessAlbumcopy`);
    // navigate(`/CreatSessAlbum`);
    
  };
  
  

  if (loading) {
    return (
      <Button loading>Default</Button>
      
    );
  }

  return (
    <Box
      sx={{
        width: isMobile ? '90%' : '50%',  // Width changes based on device
        margin: '0 auto',
        marginTop: '16px',
        display: 'flex',  // Use flexbox to center content
        justifyContent: 'center',  // Center horizontally
      }}
    >
      <Card
        orientation="horizontal"
        sx={{
          width: '100%',
          flexWrap: 'wrap',
          borderRadius: '16px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
        }}
      >
        <AspectRatio flex ratio="1" maxHeight={182} sx={{ minWidth: 182 }}>
          <img
            src={photographer?.profile_image}
            loading="lazy"
            alt=""
          />
        </AspectRatio>
        <CardContent>
          <Typography fontSize="xl" fontWeight="lg">
            {photographer && photographer.photographer_name}
          </Typography>
          <Typography level="body-sm" fontWeight="lg" textColor="text.tertiary">
            {photographer && photographer.about}
          </Typography>
          <Sheet
            sx={{
              bgcolor: 'background.level1',
              borderRadius: 'sm',
              p: 1.5,
              my: 1.5,
              display: 'flex',
              gap: 2,
              '& > div': { flex: 1 },
            }}
          >
            <div>
              <Typography level="body-xs" fontWeight="lg">
                Albums
              </Typography>
              <Typography fontWeight="lg">{photographer && photographer.session_album_count}</Typography>
            </div>
            <div>
              <Typography level="body-xs" fontWeight="lg">
                Spots
              </Typography>
              <Typography fontWeight="lg">{photographer && photographer.unique_spots_count}</Typography>
            </div>
          </Sheet>
          {/* <Box sx={{ display: 'flex', gap: 1.5, '& > button': { flex: 1 } }}>
            <Button onClick={dashboardClick} variant="solid" style={{ backgroundColor: teal[400], color: 'white' }}>
              History  <FaHistory />
            </Button>
            <Button onClick={addAlbum} variant="solid" style={{ backgroundColor: teal[400], color: 'white' }}>
              Add Album <IoMdAddCircleOutline />
            </Button>
            <Button onClick={editProfilePtgClick} variant="solid" style={{ backgroundColor: teal[400], color: 'white' }}>
              Edit Profile <MdModeEdit />
            </Button>
          </Box> */}
        </CardContent>
      </Card>
    </Box>
  );
}