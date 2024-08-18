import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Box from '@mui/joy/Box';
import { Link, Typography } from '@mui/joy';
import Avatar from '@mui/joy/Avatar';
import { useNavigate } from 'react-router-dom';
import { calculateTimeAgo, selectSelectedSessAlbum, selectSessAlbums } from '../slicers/sessAlbumSlice';
import { TiLocation } from 'react-icons/ti';

const SessAlbumDetails: React.FC = () => {
  const sessAlbum = useSelector(selectSelectedSessAlbum);
  const navigate = useNavigate();



  const handleSpotClick = (spotId: number) => {
    navigate(`/Spot/${spotId}`);
  };

  const handlePhotographerClick = (photographerId: number) => {
    navigate(`/Photographer/${photographerId}`);
  };

  return (
    <div>
      {sessAlbum && (
        <Box sx={{ display: 'flex', gap: 4, alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <span onClick={() => handlePhotographerClick(sessAlbum.photographer)}>
              <Avatar src={sessAlbum.photographer_profile_image}></Avatar>
            </span>
            <Typography sx={{ fontSize: 'sm', fontWeight: 'md' }}>
              <span onClick={() => handlePhotographerClick(sessAlbum.photographer)}>
                {sessAlbum.photographer_name}
              </span>
            </Typography>
          </Box>
          <Typography sx={{ fontSize: 'sm', fontWeight: 'md' }}>
            {calculateTimeAgo(new Date(sessAlbum.sessDate))}
          </Typography>
          <Link
            sx={{
              fontSize: 'sm',
              fontWeight: 'md',
              color: 'black',
              // marginLeft: 'auto',
              // marginRight: '8px',
            }}
          >
            <TiLocation />
            <span onClick={() => handleSpotClick(sessAlbum.spot)}>
              {sessAlbum.spot_name}
            </span>
          </Link>
        </Box>
      )}

      
    </div>
  );
};

export default SessAlbumDetails;
