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
import { calculateTimeAgo, selectSessAlbums, sessGetDataAsync, setSelectedSessAlbum } from '../slicers/sessAlbumSlice';
import { getDataAsync } from '../slicers/perAlbumSlice';
import { AspectRatio } from '@mui/joy';
import { TiLocation } from 'react-icons/ti';
import { teal } from '@mui/material/colors';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { useNavigate  } from 'react-router-dom';
import { selectPhotographer } from '../slicers/photographerSlice';
import { getSpotById } from '../slicers/spotSlice';
import {  fetchImagesAsync, fetchImagesBySessAsync, fetchVideosBySessionAsync } from '../slicers/ImagesSlice';
import { fetchPricesBySessionAlbumId, setSessAlbumOfCart } from '../slicers/cartSlice';

interface SessAlbumProps {
  filterType: string;
  filterId: number;
}
interface sess {
  id: number;
  created_at: Date;
  updated_at: Date;
  cover_image: string;
  spot: number;
  photographer: number;
  albums_prices: number;
  sessDate: Date;
  spot_name: string;
  photographer_name: string;
  photographer_profile_image: string;
  videos: boolean;
  dividedToWaves: boolean;
}

const SessAlbum: React.FC<SessAlbumProps> = ({ filterType, filterId }) => {
  const sessAlbum = useSelector(selectSessAlbums);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(sessGetDataAsync({ filterType, filterId }));
  }, [dispatch, filterType, filterId]);

  const handleCardClickImg = (albumId: number) => {
    dispatch(getDataAsync(albumId));
    navigate('/PerAlbum');
  };

  const handleCardClickVideo = (albumId: number) => {
    dispatch(fetchVideosBySessionAsync(albumId));
    navigate('/Video');
  };

  const handleCardClickSingleImages = (albumId: number) => {
    // here i need to fetch images, instead of videos
    dispatch(fetchImagesBySessAsync(albumId));
    // dispatch(fetchPricesBySessionAlbumId(albumId));
    navigate('/UndividedImgs');
  };


  const handleCardClick = (sessAlbum: any) => {
    if (sessAlbum.videos) {      
      handleCardClickVideo(sessAlbum.id);
    } 
    else if (sessAlbum.dividedToWaves) {
      console.log(sessAlbum.dividedToWaves);
      handleCardClickSingleImages(sessAlbum.id);
    }
    else {
      console.log(sessAlbum.videos);
      handleCardClickImg(sessAlbum.id);
    }
    dispatch(setSelectedSessAlbum(sessAlbum))
  };


  const handleSpotClick = async (spotId: number) => {
    navigate(`/Spot/${spotId}`);
  };

  const handlePhotographerClick = (photographerId: number) => {
    navigate(`/Photographer/${photographerId}`);
  };

  return (
    <div>
      <ImageList variant="masonry" cols={3} gap={8} sx={{ marginRight: '20px', marginLeft: '20px', marginBottom: '20px', marginTop: '20px' }}>
        {sessAlbum.map((sessAlbum) => (
          <ImageListItem key={sessAlbum.id}>
            <Card>
              <CardActionArea onClick={() => handleCardClick(sessAlbum)}>
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
                <span onClick={() => handlePhotographerClick(sessAlbum.photographer)}>
                  <Avatar src={sessAlbum.photographer_profile_image}></Avatar>
                </span>
                <Typography sx={{ fontSize: 'sm', fontWeight: 'md' }}>
                  <span onClick={() => handlePhotographerClick(sessAlbum.photographer)}>
                    {sessAlbum.photographer_name}
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
                  }}
                >
                  <TiLocation />
                  <span onClick={() => handleSpotClick(sessAlbum.spot)}>
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




