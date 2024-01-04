import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Box from '@mui/joy/Box';
import Avatar from '@mui/joy/Avatar';
import Typography from '@mui/joy/Typography';
import Link from '@mui/joy/Link';
import { useAppDispatch } from '../app/hooks';
import { calculateTimeAgo, selectSessAlbums, sessGetDataAsync } from '../slicers/sessAlbumSlice';
import { getDataAsync } from '../slicers/perAlbumSlice';
import { resetImages } from '../slicers/ImagesSlice';
import { AspectRatio } from '@mui/joy';
import { TiLocation } from 'react-icons/ti';
import { teal } from '@mui/material/colors';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

// SessAlbum component
const SessAlbum: React.FC = () => {
  const sessAlbum = useSelector(selectSessAlbums);


  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(sessGetDataAsync({}));
  }, [dispatch]);

  const handleCardClick = (albumId: number) => {
    dispatch(getDataAsync(albumId));
    dispatch(resetImages());
  };

  const handleDisplaySessClick = (filterType: string, filterId: number) => {
    dispatch(sessGetDataAsync({ filterType, filterId }));
    dispatch(resetImages());
  };





  return (
    <div>
      <h2>Session Albums</h2>
      <ImageList variant="masonry" cols={3} gap={8}>
        {sessAlbum.map((sessAlbum) => (
          <ImageListItem key={sessAlbum.id}>
            <Card
              sx={{
                '&:hover': {
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  '&:hover, &:focus-within': {
                    opacity: 1,
                  },
                  opacity: 0,
                  transition: '0.1s ease-in',
                  background:
                    'linear-gradient(180deg, transparent 62%, rgba(0,0,0,0.00345888) 63.94%, rgba(0,0,0,0.014204) 65.89%, rgba(0,0,0,0.0326639) 67.83%, rgba(0,0,0,0.0589645) 69.78%, rgba(0,0,0,0.0927099) 71.72%, rgba(0,0,0,0.132754) 73.67%, rgba(0,0,0,0.177076) 75.61%, rgba(0,0,0,0.222924) 77.56%, rgba(0,0,0,0.267246) 79.5%, rgba(0,0,0,0.30729) 81.44%, rgba(0,0,0,0.341035) 83.39%, rgba(0,0,0,0.367336) 85.33%, rgba(0,0,0,0.385796) 87.28%, rgba(0,0,0,0.396541) 89.22%, rgba(0,0,0,0.4) 91.17%)',
                },
              }}
              onClick={() => handleCardClick(sessAlbum.id)}
            >
              <CardActionArea>
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
                <Avatar src={sessAlbum.photographer_profile_image} />
                <Typography sx={{ fontSize: 'sm', fontWeight: 'md' }}>
                
                  <span onClick={() => handleDisplaySessClick('photographer', sessAlbum.photographer)}>
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
                  <span onClick={() => handleDisplaySessClick('spot', sessAlbum.photographer)}>
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
