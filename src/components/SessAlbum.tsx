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
import { clearSessAlbums, formatSessDate, selectNextPage, selectPreviousPage, selectSessAlbums, sessGetDataAsync, setSelectedSessAlbum } from '../slicers/sessAlbumSlice';
import { fetchPricesForVideosBySessionAlbumId, getDataAsync } from '../slicers/perAlbumSlice';
import { Alert, AspectRatio } from '@mui/joy';
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
import InfoIcon from '@mui/icons-material/Info';

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





  useEffect(() => {
    dispatch(clearSessAlbums())
    dispatch(sessGetDataAsync({ filterType, filterId }));
  }, [dispatch, filterType, filterId]);







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
        pageSize: 20,
      }));
      window.scrollTo(0, 0);
    }
  };

  const handlePreviousPage = () => {
    if (previousPage) {
      const page = new URL(previousPage).searchParams.get('page');
      dispatch(sessGetDataAsync({
        filterType,
        filterId,
        page: parseInt(page || '1', 10),
        pageSize: 20,
      }));
      window.scrollTo(0, 0);
    }
  };








  return (
    <>
      
      <div>
        <ImageList variant="standard" cols={isMobile ? 1 : 4} gap={8} sx={{ marginRight: '20px', marginLeft: '20px', marginBottom: '20px' }}>
          {sessAlbum.map((sessAlbum) => (
            <ImageListItem key={sessAlbum.id}>
              <Card
                sx={{
                  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)', // Shadow on all sides
                  borderRadius: '8px', // Optional: smooth corners
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
                    <Box
                      sx={{
                        position: 'relative',        // Set position to relative for positioning child elements
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',    // Center content horizontally
                        alignItems: 'center',        // Center content vertically
                        p: 1,
                        bgcolor: 'rgba(0, 0, 0, 0.5)',
                        borderRadius: '0 0 0px 0',
                        textAlign: 'center',         // Ensure the text is centered
                      }}
                    >
                      {/* Icons positioned absolutely at the top left corner */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0, // Set top position for > 5 days
                          left: 0, // Move to the left if > 5 days
                          // right: sessAlbum.days_until_expiration > 3 ? 'auto' : 12, // Keep it on the right for <= 5 days
                          display: 'flex',
                          alignItems: 'center',
                          gap: isMobile ? 0.4 : 1,
                          p: 1,
                          bgcolor: 'rgba(0, 0, 0, 0.0)',
                        }}
                      >

                        <span
                          style={{
                            color: 'white',           // Make the text white
                            fontSize: isMobile ? '10px' : '14px',  // Adjust font size
                            fontWeight: 'bold',       // Make the text bold
                            cursor: 'pointer'         // Make the span clickable
                          }}
                        >
                          {sessAlbum.videos ? <SmartDisplayIcon /> : <PhotoLibraryIcon />}
                        </span>
                      </Box>




                      {/* Conditional rendering of the icon and text */}
                      {sessAlbum.days_until_expiration <= 3 && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            right: 9,
                            display: 'flex',
                            alignItems: 'center',
                            p: 1,
                            bgcolor: 'rgba(0, 0, 0, 0.0)',
                          }}
                        >
                          {sessAlbum.days_until_expiration < 0 ? (
                            <span style={{ color: red[500], fontSize: isMobile ? '14px' : '16px', fontWeight: 'bold' }}>
                              Expired
                            </span>
                          ) : sessAlbum.days_until_expiration === 0 ? (
                            <span style={{ color: red[500], fontSize: isMobile ? '14px' : '16px', fontWeight: 'bold' }}>
                              Last Day
                            </span>
                          ) : (
                            <div style={{ lineHeight: '0.7' }}>
                              <span style={{ color: 'white', fontSize: isMobile ? '12px' : '12px', fontWeight: 'bold', marginRight: '5px' }}>
                                {sessAlbum.days_until_expiration} {sessAlbum.days_until_expiration === 1 ? 'day' : 'days'} <br style={{ lineHeight: '0.8' }} /> remaining
                              </span>
                            </div>
                          )}

                          {sessAlbum.days_until_expiration <= 3 && sessAlbum.days_until_expiration >= 0 && (
                            <AutoDeleteIcon
                              style={{
                                color: sessAlbum.days_until_expiration === 0 ? red[500] : 'white',
                                fontSize: isMobile ? '20px' : '20px',
                                cursor: 'pointer',
                              }}
                            />
                          )}
                        </Box>
                      )}




                      {/* Spot name centered */}

                      <span
                        onClick={(event) => {
                          event.stopPropagation(); // Prevent the click event from bubbling up to the card
                          handleSpotClick(sessAlbum.spot);
                        }}
                        style={{
                          color: 'white',           // Make the text white
                          fontSize: '18px',  // Adjust font size
                          fontWeight: 'bold',       // Make the text bold
                          cursor: 'pointer',        // Make the span clickable
                        }}
                      >
                        {sessAlbum.spot_name}
                      </span>
                    </Box>
                  </AspectRatio>
                </CardActionArea>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', bgcolor: teal[400], boxShadow: '0 -8px 8px rgba(0, 0, 0, 0.4)', position: 'relative', }}>
                  <span
                    onClick={() => handlePhotographerClick(sessAlbum.photographer)}
                    style={{
                      display: 'inline-flex', // Ensure the span behaves as a block container for the avatar
                      padding: '4px',        // Adjust the padding as needed
                      cursor: 'pointer',     // Optional: change the cursor to pointer to indicate it's clickable
                    }}
                  >
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
                  {/* <Link
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
                  </Link> */}
                </Box>
              </Card>
            </ImageListItem>
          ))}
        </ImageList>



        {/* <Alert
      variant="outlined"
      color="neutral"
      startDecorator={<InfoIcon  />}
      sx={{
        maxWidth: isMobile ? '90%' : '400px',
        margin: '0 auto', // Center horizontally
        textAlign: 'center',
      }}
    >
      <Typography>
      Images and videos on our website are available for a limited time. Images remain accessible for 30 days, while videos are available for 5 days.      </Typography>

    </Alert> */}


    
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
      </div></>
  );
};

export default SessAlbum;




