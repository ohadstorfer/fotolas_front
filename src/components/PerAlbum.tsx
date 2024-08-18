import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getDataAsync, selectPersonalAlbum, addToCart, removeFromCart, removeWaveFromCart, updateTotalPrice } from '../slicers/perAlbumSlice';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import { useAppDispatch } from '../app/hooks';
import { personalGetDataAsync } from '../slicers/ImagesSlice';
import Box from '@mui/joy/Box';
import { AspectRatio, IconButton, Link, Typography } from '@mui/joy';
import { IoImagesOutline } from "react-icons/io5";
import Avatar from '@mui/joy/Avatar';
import { teal } from '@mui/material/colors';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { useNavigate } from 'react-router-dom';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import axios from 'axios';
import { addToCart_singleImages, fetchPricesBySessionAlbumId, selectCart, addToCart_waves, calculatePriceForImages, calculatePriceForWaves, removeCartType, removeFromCart_singleImages, removeSessAlbumOfCart, selectSessAlbumOfCart, setCartType, setSessAlbumOfCart, removeFromCart_waves } from '../slicers/cartSlice';
import { calculateTimeAgo, selectSelectedSessAlbum, selectSessAlbums } from '../slicers/sessAlbumSlice';
import { TiLocation } from 'react-icons/ti';
import SessAlbumDetails from './SessAlbumDetails';

const PerAlbum: React.FC = () => {
  const personalAlbums = useSelector(selectPersonalAlbum);
  const selectedSessAlbum = useSelector(selectSelectedSessAlbum);
  const cart = useSelector(selectCart);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const cartTotalImages = useSelector((state: any) => state.perAlbum.cartTotalImages);
  const cartTotalPrice = useSelector((state: any) => state.perAlbum.cartTotalPrice);
  const sessAlbumOfCart = useSelector(selectSessAlbumOfCart);


  const handleAddToCartNew = async (waveId: number, imageCount: number, sessionAlbum: number) => {
    if (sessAlbumOfCart && sessAlbumOfCart !== selectedSessAlbum) {
      alert('You can only add waves from the same session album.');
      return;
    }

    if (!sessAlbumOfCart) {
      await dispatch(fetchPricesBySessionAlbumId(sessionAlbum));
      dispatch(setSessAlbumOfCart(selectedSessAlbum!));
      dispatch(setCartType("waves"));
    }

    dispatch(addToCart_waves({ waveId, imageCount }));
    dispatch(calculatePriceForImages());
  };

  const handleRemoveFromCart = (waveId: number, imageCount: number) => {
    if (cart.length === 1) {
      dispatch(removeSessAlbumOfCart());
      dispatch(removeCartType());
    }

    dispatch(removeFromCart_waves({ waveId, imageCount }));
    dispatch(calculatePriceForImages());
  };

  const handleCardClick = (albumId: number) => {
    dispatch(personalGetDataAsync(albumId));
    navigate('/Images');
  };

  const handleSpotClick = (spotId: number) => {
    navigate(`/Spot/${spotId}`);
  };

  const handlePhotographerClick = (photographerId: number) => {
    navigate(`/Photographer/${photographerId}`);
  };

  return (
    <div>
      <SessAlbumDetails></SessAlbumDetails>

      <ImageList variant="masonry" cols={3} gap={8} sx={{ margin: '20px' }}>
        {personalAlbums.map((personalAlbum) => {
          const isInCart = cart.includes(personalAlbum.id);

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
                      <Avatar sx={{ bgcolor: teal[100], width: 40, height: 40 }}>
                        <span style={{ marginRight: '4px', fontSize: '0.75rem', color: 'black' }}>
                          {personalAlbum.image_count}
                        </span>
                        <IoImagesOutline style={{ color: 'black' }} />
                      </Avatar>
                      <IconButton
                        sx={{
                          bgcolor: isInCart ? teal[100] : 'inherit',
                          color: isInCart ? 'black' : teal[100],
                        }}
                        aria-label={isInCart ? 'remove from cart' : 'add to cart'}
                        onClick={(e) => {
                          e.stopPropagation();
                          isInCart
                            ? handleRemoveFromCart(personalAlbum.id, personalAlbum.image_count)
                            : handleAddToCartNew(personalAlbum.id, personalAlbum.image_count, personalAlbum.session_album);
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

export default PerAlbum;
