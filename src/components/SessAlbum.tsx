import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/joy/Box';
import Avatar from '@mui/joy/Avatar';
import Typography from '@mui/joy/Typography';
import Link from '@mui/joy/Link';
import { useAppDispatch } from '../app/hooks';
import { calculateTimeAgo, selectNextPage, selectPreviousPage, selectSessAlbums, sessGetDataAsync, setSelectedSessAlbum } from '../slicers/sessAlbumSlice';
import { getDataAsync } from '../slicers/perAlbumSlice';
import { AspectRatio } from '@mui/joy';
import { TiLocation } from 'react-icons/ti';
import { teal } from '@mui/material/colors';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { useNavigate  } from 'react-router-dom';
import { selectPhotographer } from '../slicers/photographerSlice';
import { getSpotById, selectAllSpots } from '../slicers/spotSlice';
import {  fetchImagesAsync, fetchImagesBySessAsync, fetchVideosBySessionAsync } from '../slicers/ImagesSlice';
import { fetchPricesBySessionAlbumId, setSessAlbumOfCart } from '../slicers/cartSlice';
import { Autocomplete, Button, TextField } from '@mui/material';

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
  const [selectedSpot, setSelectedSpot] = useState<any | null>(null);
  const allSpots = useSelector(selectAllSpots);
  const nextPage = useSelector(selectNextPage);
  const previousPage = useSelector(selectPreviousPage);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(sessGetDataAsync({ filterType, filterId }));
  }, [dispatch, filterType, filterId]);

  const handleCardClickImg = async (albumId: number) => {
    dispatch(getDataAsync({ albumId, page: 1, pageSize: 21 }));
    await dispatch(fetchPricesBySessionAlbumId(albumId));
    navigate('/PerAlbum');
  };

  const handleCardClickVideo = async (albumId: number) => {
    dispatch(fetchVideosBySessionAsync({ albumId }));
    await dispatch(fetchPricesBySessionAlbumId(albumId));
    navigate('/Video');
  };
  
  const handleCardClickSingleImages = async (albumId: number) => {
    dispatch(fetchImagesBySessAsync({ albumId }));
    await dispatch(fetchPricesBySessionAlbumId(albumId));
    navigate('/UndividedImgs');
  };


  const handleCardClick = (sessAlbum: any) => {
    if (sessAlbum.videos) {     
      console.log("videos: ", sessAlbum.videos); 
      handleCardClickVideo(sessAlbum.id);
    } 
    else if (sessAlbum.dividedToWaves) {
      console.log("dividedToWaves: ", sessAlbum.dividedToWaves);
      handleCardClickImg(sessAlbum.id);
    }
    else {
      console.log("dividedToWaves: ", sessAlbum.dividedToWaves);
      handleCardClickSingleImages(sessAlbum.id);
    }
    dispatch(setSelectedSessAlbum(sessAlbum))
  };


  const handleSpotClick = async (spotId: number) => {
    navigate(`/Spot/${spotId}`);
  };

  const handlePhotographerClick = (photographerId: number) => {
    navigate(`/Photographer/${photographerId}`);
  };





  const handleNextPage = () => {
  if (nextPage) {
    const page = new URL(nextPage).searchParams.get('page');
    dispatch(sessGetDataAsync({
      filterType,
      filterId,
      page: parseInt(page || '1', 10),
      pageSize: 21,
    }));
  }
};

const handlePreviousPage = () => {
  if (previousPage) {
    const page = new URL(previousPage).searchParams.get('page');
    dispatch(sessGetDataAsync({
      filterType,
      filterId,
      page: parseInt(page || '1', 10),
      pageSize: 21,
    }));
  }
};





  return (
    <><Box sx={{ display: 'flex',justifyContent: 'center', alignItems: 'center', p: 1.5, gap: 1.5, '& > button': { flex: 1 } }}>
      <Autocomplete
                disablePortal
                onChange={(event, newValue) => setSelectedSpot(newValue)}
                id="combo-box-demo"
                options={allSpots}
                getOptionLabel={(spot) => spot.name} // Specify how to get the label from each spot object
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Spot" />}
                value={selectedSpot}
              />

    </Box><div>
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
                      alt={`Image ${sessAlbum.id}`} />
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
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button variant="contained" onClick={handlePreviousPage} disabled={!previousPage} sx={{ mr: 2 }}>
          Previous
        </Button>
        <Button variant="contained" onClick={handleNextPage} disabled={!nextPage}>
          Next
        </Button>
      </Box>
      </div></>
  );
};

export default SessAlbum;




