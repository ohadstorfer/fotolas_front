import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/joy/Box';
import Avatar from '@mui/joy/Avatar';
import Typography from '@mui/joy/Typography';
import Link from '@mui/joy/Link';
import { useAppDispatch } from '../app/hooks';
import { calculateTimeAgo, selectSessAlbums, sessGetDataAsync } from '../slicers/sessAlbumSlice';
import { getDataAsync } from '../slicers/perAlbumSlice';
import { AspectRatio } from '@mui/joy';
import { TiLocation } from 'react-icons/ti';
import { teal } from '@mui/material/colors';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { useNavigate  } from 'react-router-dom';
import { selectPhotographer } from '../slicers/photographerSlice';
import { getSpotById } from '../slicers/spotSlice';

interface SessAlbumProps {
  filterType: string;
  filterId: number;
}

// SessAlbum component
const SessAlbum: React.FC <SessAlbumProps>= ({ filterType, filterId }) => {
  const sessAlbum = useSelector(selectSessAlbums);
  const dispatch = useAppDispatch();
  const navigate  = useNavigate();
  const photographer = useSelector(selectPhotographer);
  

  useEffect(() => {
    dispatch(sessGetDataAsync({ filterType, filterId }));
  }, [dispatch, filterType, filterId]);



  const handleDisplaySessClick = (filterType: string, filterId: number) => {
    dispatch(sessGetDataAsync({ filterType, filterId }));
    // navigate('/');
  };


  const handleCardClick = (albumId: number) => {
    dispatch(getDataAsync(albumId));
    navigate('/PerAlbum');
  };

  


  const handleSpotClick = async ( spotId: number) => {
    navigate(`/c/${spotId}`);  };

  const PhotographerClick = (photographerId: number) => {
    navigate(`/Photographer/${photographerId}`);
  };


  return (
    <div>
      
      <ImageList variant="masonry" cols={3} gap={8} sx={{marginRight: '20px', marginLeft: '20px',marginBottom: '20px', marginTop:'20px'}}>
        {sessAlbum.map((sessAlbum) => (
          <ImageListItem key={sessAlbum.id}>
            <Card>
              <CardActionArea onClick={() => handleCardClick(sessAlbum.id)}>
                <AspectRatio ratio="4/3">
                  <CardMedia
                    component="img"
                    height="200"
                    image={sessAlbum.cover_image}
                    alt={`Image ${sessAlbum.id}`}
                  />
                </AspectRatio>
              </CardActionArea>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', bgcolor: teal[400] }}>

                {/* <Avatar src={sessAlbum.photographer_profile_image} /> */}
                <span onClick={() => PhotographerClick(sessAlbum.photographer)}>
                <Avatar src={sessAlbum.photographer_profile_image}></Avatar>
                </span>


                <Typography sx={{ fontSize: 'sm', fontWeight: 'md' }}>
                    <span onClick={() => PhotographerClick(sessAlbum.photographer)}>
                    {sessAlbum.photographer_name }
                  </span>
                </Typography>

                <Typography sx={{ fontSize: 'sm', fontWeight: 'md', marginLeft: 'auto' }}>
                  {calculateTimeAgo(new Date(sessAlbum.sessDate))}
                </Typography>

                <Link
                  sx={{
                    fontSize: 'sm',
                    fontWeight: 'md',
                    color: 'black',
                    marginLeft: 'auto',
                    marginRight: '8px',
                    // This will align the link to the right
                  }}
                >
                  <TiLocation />
                  <span onClick={() => handleSpotClick( sessAlbum.spot)}>
                  {sessAlbum.spot_name}
                  </span>
                  
                </Link>
              </Box>
            </Card>
          </ImageListItem>
        ))}
      </ImageList>
    </div>
  );
};

export default SessAlbum;




