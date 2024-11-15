import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getDataAsync, selectPersonalAlbum, addToCart, removeFromCart, removeWaveFromCart, updateTotalPrice, selectNextPageWaves, selectPreviousPageWaves, selectServerError, clearPerAlbums } from '../slicers/perAlbumSlice';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import { useAppDispatch } from '../app/hooks';
import { personalGetDataAsync, resetImages } from '../slicers/ImagesSlice';
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
import { selectSelectedSessAlbum, selectSessAlbums } from '../slicers/sessAlbumSlice';
import { TiLocation } from 'react-icons/ti';
import SessAlbumDetails from './SessAlbumDetails';
import { Button, useMediaQuery, Dialog, DialogContent } from '@mui/material';
import Images from './Images';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import { selectSpanish } from '../slicers/sighnInSlice';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

const PerAlbum: React.FC = () => {
  const personalAlbums = useSelector(selectPersonalAlbum);
  const selectedSessAlbum = useSelector(selectSelectedSessAlbum);
  const cart = useSelector(selectCart);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const cartTotalImages = useSelector((state: any) => state.perAlbum.cartTotalImages);
  const cartTotalPrice = useSelector((state: any) => state.perAlbum.cartTotalPrice);
  const Prices = useSelector((state: any) => state.cart.prices);
  const nextPage = useSelector(selectNextPageWaves);
  const previousPage = useSelector(selectPreviousPageWaves);
  const isMobile = useMediaQuery('(max-width:600px)');
  const sessAlbumOfCart = useSelector(selectSessAlbumOfCart);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAlbumId, setSelectedAlbumId] = useState<number | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<personalAlbum | null>(null);
  const [isInCart, setIsInCart] = useState(false);
  const serverError = useSelector(selectServerError);
  const spanish = useSelector(selectSpanish)



  interface personalAlbum {
    sessAlbum: any;
    id: number;
    cover_image: string;
    session_album: number;
    image_count: number;
  }





  useEffect(() => {
    dispatch(clearPerAlbums())
    if (selectedSessAlbum) {
      const albumId = selectedSessAlbum.id
      dispatch(getDataAsync({ albumId, page: 1, pageSize: 21 }));
      dispatch(fetchPricesBySessionAlbumId(albumId));

    }
  }, [dispatch]);



  useEffect(() => {
    if (serverError === 'An error occurred') {
      navigate(`/ServerErrorPage`);
    }
  }, [serverError]);


  // const handleCardClickImg = async (albumId: number) => {
  //   dispatch(getDataAsync({ selectedSessAlbum.id, page: 1, pageSize: 21 }));
  //   await dispatch(fetchPricesBySessionAlbumId(albumId));
  //   navigate('/PerAlbum');
  // };





  const handleAddToCartNew = async (waveId: number, imageCount: number, sessionAlbum: number) => {
    if (sessAlbumOfCart && sessAlbumOfCart.id !== sessionAlbum) {
      alert('Your cart already contains items from a different session. You can only add items from the same session to your cart.');
      return;
    }

    if (!sessAlbumOfCart) {
      // await dispatch(fetchPricesBySessionAlbumId(sessionAlbum));
      dispatch(setSessAlbumOfCart(selectedSessAlbum!));
      dispatch(setCartType("waves"));
    }

    dispatch(addToCart_waves({ waveId, imageCount }));
    dispatch(calculatePriceForImages());
  };



  const handleRemoveFromCart = (waveId: number, imageCount: number) => {
    // Show confirmation dialog
    // const confirmed = window.confirm('Remove this wave from your cart?');

    // if (confirmed) {
    if (cart.length === 1) {
      dispatch(removeSessAlbumOfCart());
      dispatch(removeCartType());
    }

    dispatch(removeFromCart_waves({ waveId, imageCount }));
    dispatch(calculatePriceForImages());
    // }
  };







  useEffect(() => {
    if (selectedSessAlbum) {
      const albumId = selectedSessAlbum.id
      dispatch(getDataAsync({ albumId, page: 1, pageSize: 21 }));
    }
  }, [dispatch]);

  useEffect(() => {
    // Check if the selected album is in the cart
    if (selectedAlbumId !== null) {
      const albumInCart = cart.some(item => item === selectedAlbumId);
      setIsInCart(albumInCart);
    }
  }, [cart, selectedAlbumId]);

  const handleCardClick = (albumId: number, personalAlbum: personalAlbum) => {
    dispatch(resetImages());
    dispatch(personalGetDataAsync(albumId));
    setSelectedAlbumId(albumId);
    setSelectedAlbum(personalAlbum); // Update selected album ID
    // setSelectedAlbum
    setOpenDialog(true);
  };


  const handleCloseDialog = () => {
    setOpenDialog(false);  // Close the dialog
    setSelectedAlbumId(null);  // Reset selected album ID
  };






  const handleSpotClick = (spotId: number) => {
    navigate(`/Spot/${spotId}`);
  };

  const handlePhotographerClick = (photographerId: number) => {
    navigate(`/Photographer/${photographerId}`);
  };


  const handleNavigateHome = () => {
    navigate('/'); // Navigate to the home page
  };


  const handleNextPage = () => {
    if (nextPage) {
      const page = new URL(nextPage).searchParams.get('page');
      dispatch(
        getDataAsync({
          albumId: selectedSessAlbum!.id,
          page: parseInt(page || '1', 10),
          pageSize: 21, // Use your desired page size
        })
      );
    }
  };

  const handlePreviousPage = () => {
    if (previousPage) {
      const page = new URL(previousPage).searchParams.get('page');
      dispatch(
        getDataAsync({
          albumId: selectedSessAlbum!.id,
          page: parseInt(page || '1', 10),
          pageSize: 21, // Use your desired page size
        })
      );
    }
  };


  return (
    <div>
<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
  <SessAlbumDetails />

  <Button
    variant="text"
    sx={{
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
    <Box sx={{ padding: '5px', borderRadius: '8px'}}>
      <Typography>Price Details:</Typography>
      <Typography>For 1-5 images: {Prices.price_1_to_5} $</Typography>
      <Typography>For 6-50 images: {Prices.price_6_to_50} $</Typography>
      <Typography>For 51+ images: {Prices.price_51_plus} $</Typography>
    </Box>
  )}
</Box>





      <ImageList variant="standard" cols={isMobile ? 2 : 4} sx={{ margin: '20px' }}>

        {personalAlbums.map((personalAlbum) => {
          const isInCart = cart.includes(personalAlbum.id);

          return (
            <ImageListItem key={personalAlbum.id}>
              <Card
                sx={{
                  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)', // Shadow on all sides
                  borderRadius: '8px', // Optional: smooth corners
                }}>
                <CardActionArea onClick={() => handleCardClick(personalAlbum.id, personalAlbum)}>
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
                        gap: isMobile ? 0.4 : 1,
                        p: isMobile ? 0.2 : 1,
                        bgcolor: 'rgba(0, 0, 0, 0.6)',
                        borderRadius: '0 0 8px 0',
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: teal[100],
                          width: isMobile ? 30 : 40,  // Width changes based on device
                          height: isMobile ? 30 : 40, // Height changes based on device
                        }}
                      >
                        <span style={{ marginRight: isMobile ? '1px' : '4px', fontSize: '0.75rem', color: 'black' }}>
                          {personalAlbum.image_count}
                        </span>
                        <IoImagesOutline style={{ color: 'black' }} />
                      </Avatar>
                      <IconButton
                        sx={{
                          width: isMobile ? '20px' : '40px',  // Width changes based on device
                          height: isMobile ? '20px' : '40px',
                          bgcolor: isInCart ? teal[100] : 'inherit',
                          color: isInCart ? 'black' : teal[100],
                          padding: isMobile ? '2px' : '8px',
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






      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="lg"
        PaperProps={{
          style: {
            width: isMobile ? '100%' : '75%',
            margin: 'auto', // centers the dialog
          }
        }}>



        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'center', // Horizontally center the content
            alignItems: 'center', // Vertically center the content
            flexDirection: 'row', // Layout the children in a row
            gap: 2, // Add spacing between elements
            position: 'relative', // For the absolute close button
          }}>



          <Box>
            <span style={{ marginRight: isMobile ? '1px' : '4px', fontSize: '1.5rem', color: 'black' }}>
              {selectedAlbum?.image_count}
            </span>
            <IoImagesOutline style={{ color: 'black' }} />
          </Box>



          <Button
            sx={{
              width: isMobile ? '10px' : '40px',  // Width changes based on device
              height: isMobile ? '40px' : '40px',
              bgcolor: isInCart ? teal[100] : 'inherit',
              color: isInCart ? 'black' : 'black',
              padding: isMobile ? '2px' : '8px',
            }}
            aria-label={isInCart ? 'remove from cart' : 'add to cart'}
            onClick={(e) => {
              e.stopPropagation();
              isInCart
                ? handleRemoveFromCart(selectedAlbumId!, selectedAlbum!.image_count)
                : handleAddToCartNew(selectedAlbumId!, selectedAlbum!.image_count, selectedAlbum!.session_album);
            }}
          >

            {isInCart ? <RemoveShoppingCartIcon /> : <AddShoppingCartIcon />}
          </Button>





          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white', // Text/icon color
              backgroundColor: '#9e9e9e', // Background color (grey)
              '&:hover': {
                backgroundColor: '#757575', // Darker grey on hover
              },
              '&:active': {
                backgroundColor: '#616161', // Even darker grey when active
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>


        <IconButton
          aria-label="close"
          onClick={handleCloseDialog}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white', // Text/icon color
            backgroundColor: '#9e9e9e', // Background color (grey)
            '&:hover': {
              backgroundColor: '#757575', // Darker grey on hover
            },
            '&:active': {
              backgroundColor: '#616161', // Even darker grey when active
            },
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent >
          {/* Render the Images component within the dialog */}
          <Images />
        </DialogContent>
      </Dialog>


    </div>
  );
};

export default PerAlbum;
