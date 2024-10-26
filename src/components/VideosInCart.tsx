import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ImageList, ImageListItem, Card, CardActionArea, Box, IconButton, Typography, Button, useMediaQuery } from '@mui/material';
import { AspectRatio } from '@mui/joy';
import { fetchVideosBySessionAsync, selectNextVideos, selectPreviousVideos, selectVideos } from '../slicers/ImagesSlice';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import { selectSelectedSessAlbum } from '../slicers/sessAlbumSlice';
import { fetchPricesBySessionAlbumId } from '../slicers/perAlbumSlice';
import { addToCart_videos, selectCart, calculatePriceForVideos, removeFromCart_videos, removeSessAlbumOfCart, selectSessAlbumOfCart, setSessAlbumOfCart, fetchPricesForVideosBySessionAlbumId, setCartType, removeCartType, selectCartOfVideos } from '../slicers/cartSlice';
import { useAppDispatch } from '../app/hooks';
import { teal } from '@mui/material/colors';
import SessAlbumDetails from './SessAlbumDetails';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

interface Video {
  id: number;
  video: string;
  WatermarkedVideo: string;
  img: string;
  SessionAlbum: number;
}

const VideosInCart: React.FC = () => {
  const videos = useSelector(selectCartOfVideos) as Video[];
  const cart = useSelector(selectCart);
  const sessAlbumOfCart = useSelector(selectSessAlbumOfCart);
  const dispatch = useAppDispatch();
  const selectedSessAlbum = useSelector(selectSelectedSessAlbum);
  const Prices = useSelector((state: any) => state.cart.prices);
  const nextPage = useSelector(selectNextVideos);
  const previousPage = useSelector(selectPreviousVideos);
  const isMobile = useMediaQuery('(max-width:600px)');
  const [activeVideos, setActiveVideos] = useState<{ [key: number]: boolean }>({});



  // useEffect(() => {
  //   if(selectedSessAlbum){
  //     const albumId = selectedSessAlbum.id
  //     dispatch(fetchVideosBySessionAsync({ albumId }));
  //   }
  // }, [dispatch]);




  const handleAddToCart = async (video: Video, sessionAlbum: number) => {
    if (sessAlbumOfCart && sessAlbumOfCart !== selectedSessAlbum) {
      alert('You can only add waves from the same session album.');
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
    const confirmed = window.confirm('Remove this video from your cart?');
    if (confirmed) {
      if (cart.length === 1) {
        dispatch(removeSessAlbumOfCart());
        dispatch(removeCartType());
      }
      dispatch(removeFromCart_videos({ videoId }));
      dispatch(calculatePriceForVideos());
    }
  };

  const handleVideoClick = (id: number) => {
    setActiveVideos((prev) => ({
      ...prev,
      [id]: true, // Always set the video to active (true) when clicked
    }));
  };





  const handleNextPage = () => {
    if (nextPage) {
      const page = new URL(nextPage).searchParams.get('page');
      dispatch(
        fetchVideosBySessionAsync({
          albumId: selectedSessAlbum!.id,
          page: parseInt(page || '1', 10),
        })
      );
    }
  };

  const handlePreviousPage = () => {
    if (previousPage) {
      const page = new URL(previousPage).searchParams.get('page');
      dispatch(
        fetchVideosBySessionAsync({
          albumId: selectedSessAlbum!.id,
          page: parseInt(page || '1', 10),
        })
      );
    }
  };





  return (
    <div>
      <SessAlbumDetails />


      {Prices && (
        <Box sx={{ padding: '5px', borderRadius: '8px', margin: '5px'}}>
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



      <ImageList variant="standard" cols={isMobile ? 1 : 3} sx={{ margin: '20px' }}>
        {videos.map((video) => {
          const isInCart = cart.includes(video.id);
          const isActive = activeVideos[video.id];

          return (
            <ImageListItem key={video.id}>
              <Card>
                <CardActionArea onClick={() => handleVideoClick(video.id)}>
                  <AspectRatio ratio="4/3">
                    {isActive ? (
                      <video controls src={video.WatermarkedVideo} />
                    ) : (
                      <img src={video.img} alt={`Thumbnail for video ${video.id}`} />
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


      


    </div>
  );
};

export default VideosInCart;
