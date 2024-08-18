import React from 'react';
import { useSelector } from 'react-redux';
import { ImageList, ImageListItem, Card, CardActionArea, Box, IconButton } from '@mui/material';
import { AspectRatio } from '@mui/joy';
import { selectImg, selectVideos } from '../slicers/ImagesSlice';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import { selectDividedToWaves, selectSelectedSessAlbum } from '../slicers/sessAlbumSlice';
import { fetchPricesBySessionAlbumId } from '../slicers/perAlbumSlice';
import { addToCart_videos, selectCart, calculatePriceForVideos, removeFromCart_videos, removeSessAlbumOfCart, selectSessAlbumOfCart, setSessAlbumOfCart, fetchPricesForVideosBySessionAlbumId, setCartType, removeCartType } from '../slicers/cartSlice';
import { useAppDispatch } from '../app/hooks';
import { teal } from '@mui/material/colors';
import SessAlbumDetails from './SessAlbumDetails';

const Video: React.FC = () => {
  const videos = useSelector(selectVideos);
  const cart = useSelector(selectCart);
  const sessAlbumOfCart = useSelector(selectSessAlbumOfCart);
  const dispatch = useAppDispatch();
  const imgs = useSelector(selectImg);
  const selectedSessAlbum = useSelector(selectSelectedSessAlbum);

  interface Video {
    id: number;
    video: string;
    WatermarkedVideo: string;
    SessionAlbum: number;
  }

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
    dispatch(addToCart_videos(video)); // Pass the video object directly
    dispatch(calculatePriceForVideos());
  };


  const handleRemoveFromCart = (VideoId: number) => {
    if (cart.length === 1) {
      dispatch(removeSessAlbumOfCart());
      dispatch(removeCartType());
    }

    dispatch(removeFromCart_videos({ videoId: VideoId })); // Assuming each image is counted as 1
    dispatch(calculatePriceForVideos());
  };



  return (
    <div>
      <SessAlbumDetails></SessAlbumDetails>
      
      <ImageList variant="masonry" cols={3} gap={8} sx={{ margin: '20px' }}>
        {videos.map((video) => {
          const isInCart = cart.includes(video.id);
          return (
            <ImageListItem key={video.id}>
              <Card>
                <CardActionArea>
                  <AspectRatio ratio="4/3">
                    <video controls height="200" src={video.WatermarkedVideo} style={{ width: '100%' }} />
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
    </div>
  );




};

export default Video;
