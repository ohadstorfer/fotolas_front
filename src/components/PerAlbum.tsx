// src/components/PerAlbum.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { getDataAsync, selectPersonalAlbum, addToCart, selectCart, removeFromCart } from '../slicers/perAlbumSlice';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import { useAppDispatch } from '../app/hooks';
import { personalGetDataAsync } from '../slicers/ImagesSlice';
import Box from '@mui/joy/Box';
import { AspectRatio, IconButton } from '@mui/joy';
import { IoImagesOutline } from "react-icons/io5";
import Avatar from '@mui/joy/Avatar';
import { teal } from '@mui/material/colors';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { useNavigate } from 'react-router-dom';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

const PerAlbum: React.FC = () => {
  const personalAlbums = useSelector(selectPersonalAlbum);
  const cart = useSelector(selectCart);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleCardClick = (albumId: number) => {
    dispatch(personalGetDataAsync(albumId));
    navigate('/Images');
  };

  const handleAddToCart = (albumId: number) => {
    if(cart.includes(albumId)){
      dispatch(removeFromCart(albumId));
    }
    if (!cart.includes(albumId)) {
    dispatch(addToCart(albumId));
    sessionStorage.setItem('cart', JSON.stringify([...cart, albumId])); // Update session storage
    }
  };

  return (
    <div>
      <ImageList variant="masonry" cols={3} gap={8} sx={{ marginRight: '20px', marginLeft: '20px', marginBottom: '20px', marginTop: '20px' }}>
        {personalAlbums.map((personalAlbum) => {
          const isInCart = cart.includes(personalAlbum.id); // Check if the album is in the cart

          return (
            <ImageListItem key={personalAlbum.id}>
              <Card>
                <CardActionArea onClick={() => handleCardClick(personalAlbum.id)}>
                  <AspectRatio ratio="4/3">
                    <CardMedia
                      component="img"
                      height="200"
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
                        gap: 1,
                        p: 1,
                        bgcolor: 'rgba(0, 0, 0, 0.6)',
                        borderRadius: '8 0 0 0px',
                      }}
                    >
                      <Avatar sx={{ bgcolor: teal[100], width: 24, height: 24 }}>
                        <span style={{ marginRight: '4px', fontSize: '0.75rem' }}>{personalAlbum.image_count}</span> <IoImagesOutline />
                      </Avatar>
                      <IconButton
                        sx={{
                          bgcolor: isInCart ? teal[100] : 'inherit', // Change background color if in cart
                          color: isInCart ? 'black' : teal[100], // Change icon color if in cart
                          
                        }}
                        aria-label="add to shopping cart"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(personalAlbum.id);
                        }}
                      >
                        <AddShoppingCartIcon />
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

export default PerAlbum;
