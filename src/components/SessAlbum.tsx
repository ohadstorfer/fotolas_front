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
import { formatSessDate, selectNextPage, selectPreviousPage, selectSessAlbums, sessGetDataAsync, setSelectedSessAlbum } from '../slicers/sessAlbumSlice';
import { fetchPricesForVideosBySessionAlbumId, getDataAsync } from '../slicers/perAlbumSlice';
import { AspectRatio, Skeleton } from '@mui/joy';
import { TiLocation } from 'react-icons/ti';
import { teal, red } from '@mui/material/colors';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { useNavigate } from 'react-router-dom';
import { selectPhotographer } from '../slicers/photographerSlice';
import { getSpotById, selectAllSpots } from '../slicers/spotSlice';
import { fetchImagesAsync, fetchImagesBySessAsync, fetchVideosBySessionAsync } from '../slicers/ImagesSlice';
import { fetchPricesBySessionAlbumId, setSessAlbumOfCart } from '../slicers/cartSlice';
import { Autocomplete, Button, TextField, useMediaQuery } from '@mui/material';
import SmartDisplayIcon from '@mui/icons-material/SmartDisplay';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import AutoDeleteIcon from '@mui/icons-material/AutoDelete';

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
  expiration_date: Date;
  days_until_expiration: number;
}

const SessAlbum: React.FC<SessAlbumProps> = ({ filterType, filterId }) => {
  const sessAlbum = useSelector(selectSessAlbums);
  const [selectedSpot, setSelectedSpot] = useState<any | null>(null);
  const allSpots = useSelector(selectAllSpots);
  const nextPage = useSelector(selectNextPage);
  const previousPage = useSelector(selectPreviousPage);
  const isMobile = useMediaQuery('(max-width:600px)');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);





  useEffect(() => {
    dispatch(sessGetDataAsync({ filterType, filterId }));
    setIsLoading(true);
  }, [dispatch, filterType, filterId]);

  useEffect(() => {
    setIsLoading(true);
  }, [sessAlbum]);





  const handleCardClickImg = async (albumId: number) => {
    // dispatch(getDataAsync({ albumId, page: 1, pageSize: 21 }));
    // await dispatch(fetchPricesBySessionAlbumId(albumId));
    navigate('/PerAlbum');
  };

  const handleCardClickVideo = async (albumId: number) => {
    // dispatch(fetchVideosBySessionAsync({ albumId }));
    // await dispatch(fetchPricesForVideosBySessionAlbumId(albumId));
    navigate('/Video');
  };

  const handleCardClickSingleImages = async (albumId: number) => {
    dispatch(fetchImagesBySessAsync({ albumId }));
    // await dispatch(fetchPricesBySessionAlbumId(albumId));
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
    <div>
    <ImageList variant="standard" cols={isMobile ? 1 : 4} gap={8} sx={{ marginRight: '20px', marginLeft: '20px', marginBottom: '20px' }}>
      {isLoading ? (
        // Show skeletons while loading
        Array.from({ length: isMobile ? 1 : 4 }).map((_, index) => (
          <ImageListItem key={index}>
            <Card
              sx={{
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)',
                borderRadius: '8px',
                border: '1px solid rgba(0, 0, 0, 0.4)',
              }}
            >
              <AspectRatio ratio="4/3">
                <Skeleton variant="rectangular" sx={{ height: '200px' }} />
              </AspectRatio>
            </Card>
          </ImageListItem>
        ))
      ) : (
        // Show actual images after loading
        sessAlbum.map((sessAlbum) => (
          <ImageListItem key={sessAlbum.id}>
            <Card
              sx={{
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)',
                borderRadius: '8px',
                border: '1px solid rgba(0, 0, 0, 0.4)',
              }}
            >
              <CardActionArea onClick={() => handleCardClick(sessAlbum)}>
                <AspectRatio ratio="4/3">
                  <CardMedia
                    component="img"
                    height="200"
                    image={sessAlbum.cover_image}
                    alt={`Image ${sessAlbum.id}`} />
                </AspectRatio>
              </CardActionArea>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', bgcolor: teal[400], boxShadow: '0 -8px 8px rgba(0, 0, 0, 0.4)', position: 'relative', }}>
                <span onClick={() => handlePhotographerClick(sessAlbum.photographer)} style={{ display: 'inline-flex', padding: '4px', cursor: 'pointer' }}>
                  <Avatar src={sessAlbum.photographer_profile_image} />
                </span>
                <Typography sx={{ fontSize: 'md', fontWeight: 'md' }}>
                  <span onClick={() => handlePhotographerClick(sessAlbum.photographer)} style={{ cursor: 'pointer', }}>
                    {sessAlbum.photographer_name}
                  </span>
                </Typography>
                <Typography sx={{ fontSize: 'md', fontWeight: 'md', marginLeft: 'auto', marginRight: '8px' }}>
                  {formatSessDate(sessAlbum.sessDate)}
                </Typography>
              </Box>
            </Card>
          </ImageListItem>
        ))
      )}
    </ImageList>
    {(nextPage || previousPage) && (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button variant="contained" onClick={handlePreviousPage} disabled={!previousPage} sx={{ mr: 2 }}>
          Previous
        </Button>
        <Button variant="contained" onClick={handleNextPage} disabled={!nextPage}>
          Next
        </Button>
      </Box>
    )}
  </div>
  );
};

export default SessAlbum;




