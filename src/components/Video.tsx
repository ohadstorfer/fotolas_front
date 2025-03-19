import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ImageList, ImageListItem, Card, CardActionArea, Box, IconButton, Typography, Button, useMediaQuery, Pagination, styled } from '@mui/material';
import { AspectRatio } from '@mui/joy';
import { fetchVideosBySessionAsync, select_total_pages_Videos, selectNextVideos, selectPreviousVideos, selectVideos } from '../slicers/ImagesSlice';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import { selectSelectedSessAlbum } from '../slicers/sessAlbumSlice';
import { fetchPricesBySessionAlbumId } from '../slicers/perAlbumSlice';
import { addToCart_videos, selectCart, calculatePriceForVideos, removeFromCart_videos, removeSessAlbumOfCart, selectSessAlbumOfCart, setSessAlbumOfCart, fetchPricesForVideosBySessionAlbumId, setCartType, removeCartType } from '../slicers/cartSlice';
import { useAppDispatch } from '../app/hooks';
import { teal } from '@mui/material/colors';
import SessAlbumDetails from './SessAlbumDetails';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { selectSpanish } from '../slicers/sighnInSlice';
import ExpiredSessAlbum from './ExpiredSessAlbum';


interface Video {
  id: number;
  video: string;
  WatermarkedVideo: string;
  img: string;
  SessionAlbum: number;
}

const Video: React.FC = () => {
  const videos = useSelector(selectVideos) as Video[];
  const cart = useSelector(selectCart);
  const sessAlbumOfCart = useSelector(selectSessAlbumOfCart);
  const dispatch = useAppDispatch();
  const selectedSessAlbum = useSelector(selectSelectedSessAlbum);
  const Prices = useSelector((state: any) => state.cart.prices);
  const nextPage = useSelector(selectNextVideos);
  const previousPage = useSelector(selectPreviousVideos);
  const total_pages_Videos = useSelector(select_total_pages_Videos);
  const isMobile = useMediaQuery('(max-width:600px)');
  const [activeVideos, setActiveVideos] = useState<{ [key: number]: boolean }>({});
  const navigate = useNavigate();
  const spanish = useSelector(selectSpanish)
  const [currentPage, setCurrentPage] = React.useState(1);




  useEffect(() => {
    if (selectedSessAlbum) {
      const albumId = selectedSessAlbum.id
      dispatch(fetchVideosBySessionAsync({ albumId }));
      dispatch(fetchPricesForVideosBySessionAlbumId(albumId));
    }
  }, [dispatch]);




  const handleAddToCart = async (video: Video, sessionAlbum: number) => {
    if (sessAlbumOfCart && sessAlbumOfCart !== selectedSessAlbum) {
      alert('Your cart already contains items from a different session. You can only add items from the same session to your cart.');
      return;
    }
    if (!sessAlbumOfCart) {
      await dispatch(fetchPricesForVideosBySessionAlbumId(sessionAlbum));
      dispatch(setSessAlbumOfCart(selectedSessAlbum!));
      dispatch(setCartType("videos"));
    }
    dispatch(addToCart_videos(video));
    dispatch(calculatePriceForVideos());
  };






  const handleRemoveFromCart = (videoId: number) => {
    // const confirmed = window.confirm('Remove this video from your cart?');
    // if (confirmed) {
    if (cart.length === 1) {
      dispatch(removeSessAlbumOfCart());
      dispatch(removeCartType());
    }
    dispatch(removeFromCart_videos({ videoId }));
    dispatch(calculatePriceForVideos());
    // }
  };




  const handleVideoClick = (id: number) => {
    setActiveVideos((prev) => ({
      ...prev,
      [id]: true, // Always set the video to active (true) when clicked
    }));
  };





  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    dispatch(
      fetchVideosBySessionAsync({
        albumId: selectedSessAlbum!.id,
        page: page,
      })
    );
    window.scrollTo(0, 0);
  };




  const CustomPagination = styled(Pagination)({
    '& .MuiPaginationItem-root': {
      color: teal[400], // Apply teal color to pagination items
    },
    '& .Mui-selected': {
      backgroundColor: "#26a69b", // Solid teal background for selected page
      color: '#fff', // Ensure text is white on selected page
    },
  });



  const handleNavigateHome = () => {
    navigate('/'); // Navigate to the home page
  };




  if (selectedSessAlbum?.days_until_expiration! < 0 && !selectedSessAlbum?.forever) {
    return <ExpiredSessAlbum />;
  }



  return (
    <div>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <SessAlbumDetails />


        <Button
          variant="text"
          sx={{
            margin: '5px 0',
            fontSize: '0.9rem',
            color: teal[400],
            borderRadius: '8px',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: teal[400],
              color: 'white',
            },
          }}
          onClick={handleNavigateHome}
        >
          <ArrowBackIosIcon fontSize="small" /> {spanish ? 'Ir a la página principal' : 'Back to Homepage'}
        </Button>

        {Prices && (
          <Box sx={{ padding: '5px', borderRadius: '8px', margin: '5px' }}>
            <Typography>
              Price Details:
            </Typography>
            <Typography>
              For 1-3 videos: {Prices.price_1_to_3} $
            </Typography>
            <Typography>
              For 4-15 videos: {Prices.price_4_to_15} $
            </Typography>
            <Typography>
              For 15+ videos: {Prices.price_16_plus} $
            </Typography>
          </Box>
        )}

      </Box>


      {total_pages_Videos! > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CustomPagination
            count={total_pages_Videos!}
            page={currentPage}
            onChange={handlePageChange}
            variant="outlined"
          />
        </Box>
      )}



      <ImageList variant="standard" cols={isMobile ? 1 : 4} sx={{ margin: '20px' }}>
        {videos.map((video) => {
          const isInCart = cart.includes(video.id);
          const isActive = activeVideos[video.id];

          return (
            <ImageListItem key={video.id}>
              <Card
                sx={{
                  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)', // Shadow on all sides
                  borderRadius: '8px', // Optional: smooth corners
                }}>
                <CardActionArea onClick={() => handleVideoClick(video.id)}>
                  <AspectRatio ratio="4/3">
                    {isActive ? (
                      <video controls autoPlay muted src={video.WatermarkedVideo} />
                    ) : (
                      <img
                        src={video.img}
                        // alt={`Thumbnail for video ${video.id}`}
                        onError={(e) => {
                          e.currentTarget.src = video.img.replace('0000001', '0000000'); // Use fallback image on error
                        }}
                      />
                    )}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        p: 1,
                        bgcolor: 'rgba(0, 0, 0, 0.6)',
                        borderRadius: '0 0 8px 0',
                      }}
                    >
                      <IconButton
                        sx={{
                          bgcolor: isInCart ? teal[100] : 'inherit',
                          color: isInCart ? 'black' : teal[100],
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          isInCart ? handleRemoveFromCart(video.id) : handleAddToCart(video, video.SessionAlbum);
                        }}
                      >
                        {isInCart ? <RemoveShoppingCartIcon /> : <AddShoppingCartIcon />}
                      </IconButton>
                    </Box>
                    {!isActive && (
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          // p: 1,
                          // bgcolor: 'rgba(0, 0, 0, 0.5)',
                          borderRadius: '0 8px 0 0',
                        }}
                      >
                        <PlayCircleIcon sx={{ fontSize: 48 }} />
                      </Box>
                    )}
                  </AspectRatio>
                </CardActionArea>
              </Card>
            </ImageListItem>
          );
        })}
      </ImageList>



      {total_pages_Videos! > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CustomPagination
            count={total_pages_Videos!}
            page={currentPage}
            onChange={handlePageChange}
            variant="outlined"
          />
        </Box>
      )}







    </div>
  );
};

export default Video;
