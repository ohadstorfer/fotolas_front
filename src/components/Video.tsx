import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { ImageList, ImageListItem, Card, CardActionArea, Box, IconButton, Typography, Button } from '@mui/material';
import { AspectRatio } from '@mui/joy';
import { fetchVideosBySessionAsync, selectNextVideos, selectPreviousVideos, selectVideos } from '../slicers/ImagesSlice';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import { selectSelectedSessAlbum } from '../slicers/sessAlbumSlice';
import { fetchPricesBySessionAlbumId } from '../slicers/perAlbumSlice';
import { addToCart_videos, selectCart, calculatePriceForVideos, removeFromCart_videos, removeSessAlbumOfCart, selectSessAlbumOfCart, setSessAlbumOfCart, fetchPricesForVideosBySessionAlbumId, setCartType, removeCartType } from '../slicers/cartSlice';
import { useAppDispatch } from '../app/hooks';
import { teal } from '@mui/material/colors';
import SessAlbumDetails from './SessAlbumDetails';

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

  const [activeVideos, setActiveVideos] = useState<{ [key: number]: boolean }>({});

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
    if (cart.length === 1) {
      dispatch(removeSessAlbumOfCart());
      dispatch(removeCartType());
    }
    dispatch(removeFromCart_videos({ videoId }));
    dispatch(calculatePriceForVideos());
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


      {Prices &&(
        <Box sx={{ padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '8px', margin: '20px' }}>
          <Typography>
            Price Details:
          </Typography>
          <Typography>
            For 1-5 images: {Prices.price_1_to_5} $
          </Typography>
          <Typography>
            For 6-20 images: {Prices.price_6_to_20} $
          </Typography>
          <Typography>
            For 21-50 images: {Prices.price_21_to_50} $
          </Typography>
          <Typography>
            For 51+ images: {Prices.price_51_plus} $
          </Typography>
        </Box>
      )}



      <ImageList variant="masonry" cols={3} gap={8} sx={{ margin: '20px' }}>
        {videos.map((video) => {
          const isInCart = cart.includes(video.id);
          const isActive = activeVideos[video.id];

          return (
            <ImageListItem key={video.id}>
              <Card>
                <CardActionArea onClick={() => handleVideoClick(video.id)}>
                  <AspectRatio ratio="4/3">
                    {isActive ? (
                      <video controls src={video.WatermarkedVideo} style={{ width: '100%', height: '350px', objectFit: 'cover' }} />
                    ) : (
                      <img src={video.img} alt={`Thumbnail for video ${video.id}`} style={{ width: '100%', height: '350px', objectFit: 'cover' }} />
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
                        borderRadius: '8px 0 0 0',
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
                  </AspectRatio>
                </CardActionArea>
              </Card>
            </ImageListItem>
          );
        })}
      </ImageList>


      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button variant="contained" onClick={handlePreviousPage} disabled={!previousPage} sx={{ mr: 2 }}>
          Previous
        </Button>
        <Button variant="contained" onClick={handleNextPage} disabled={!nextPage}>
          Next
        </Button>
      </Box>

      
    </div>
  );
};

export default Video;
