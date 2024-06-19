// src/components/Cart.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { selectCart, removeFromCart, selectPersonalAlbum } from '../slicers/perAlbumSlice';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import { useAppDispatch } from '../app/hooks';
import Box from '@mui/joy/Box';
import IconButton from '@mui/material/IconButton';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import { teal } from '@mui/material/colors';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Avatar from '@mui/material/Avatar';
import { IoImagesOutline } from 'react-icons/io5';
import axios from 'axios';
import Button from '@mui/material/Button';

const Cart: React.FC = () => {
  const cart = useSelector(selectCart);
  const personalAlbums = useSelector(selectPersonalAlbum);
  const dispatch = useAppDispatch();

  const cartItems = personalAlbums.filter(album => cart.includes(album.id));

  const handleRemoveFromCart = (albumId: number) => {
    dispatch(removeFromCart(albumId));
  };

  const downloadImages = async () => {
    try {
      // Fetch images for waves from the backend
      const response = await axios.post('http://localhost:8000/api/get_images_for_multiple_waves/', { waveIds: cart });
      const images = response.data;

      // Trigger downloads for each image
      images.forEach((image:any) => {
        const link = document.createElement('a');
        link.href = image.original_image_url; // Adjust based on your Img model fields
        link.download = image.original_image_url.split('/').pop(); // Extract file name
        link.click();
      });
    } catch (error) {
      console.error('Error downloading images:', error);
    }
  };

  return (
    <div>
      <h2>Your Cart</h2>
      <Button variant="contained" color="primary" onClick={downloadImages}>
        Download Original Images
      </Button>
      <ImageList variant="masonry" cols={3} gap={8} sx={{ margin: '20px' }}>
        {cartItems.map((personalAlbum) => (
          <ImageListItem key={personalAlbum.id}>
            <Card sx={{ maxWidth: 150 }}> {/* Smaller card size */}
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="100" // Smaller image height
                  image={personalAlbum.cover_image}
                  alt={`Image ${personalAlbum.id}`}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0,
                    p: 0,
                    bgcolor: 'rgba(0, 0, 0, 0.6)',
                    borderRadius: '8 0 0 0px',
                  }}
                >
                  <Avatar sx={{ bgcolor: teal[100], width: 50, height: 24 }}>
                    <span style={{ marginRight: '4px', fontSize: '0.75rem', color: 'black' }}>{personalAlbum.image_count}</span> <IoImagesOutline style={{ color: 'black' }} />
                  </Avatar>
                  <IconButton
                    sx={{ color: teal[100] }}
                    aria-label="remove from cart"
                    onClick={() => handleRemoveFromCart(personalAlbum.id)}
                  >
                    <RemoveShoppingCartIcon />
                  </IconButton>
                </Box>
              </CardActionArea>
            </Card>
          </ImageListItem>
        ))}
      </ImageList>
    </div>
  );
};

export default Cart;
