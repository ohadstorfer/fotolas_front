import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {

  removeFromCart,
  selectWavesInCart_WAVES,
  fetchWavesByListAsync,
  removeWaveFromCart,
  updateTotalPrice,
} from '../slicers/perAlbumSlice';
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
import { selectCart, calculatePriceForImages, calculatePriceForWaves, removeCartType, removeFromCart_singleImages, removeFromCart_waves, removeSessAlbumOfCart, removeFromCart_videos, selectCartOfVideos, selectCartOfSingleImages, selectSessAlbumOfCart, selectWavesInCart, selectCartOfWaves, fetchPricesBySessionAlbumId, fetchPricesForVideosBySessionAlbumId, setCopyCart } from '../slicers/cartSlice';
import { selectImg, selectVideos } from '../slicers/ImagesSlice';
import { AspectRatio } from '@mui/joy';
import { createPurchaseAsync, createPurchaseItemAsync, createPurchaseWithImagesAsync, createPurchaseWithVideosAsync, createPurchaseWithWavesAsync, selectEmail, setEmail } from '../slicers/purchaseSlice';
import Video from './Video';
import VideosInCart from './VideosInCart';
import UndividedImgsInCart from './UndividedImgsInCart';
import PerAlbumInCart from './PerAlbumInCart';
import SmartDisplayIcon from '@mui/icons-material/SmartDisplay';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { selectUser } from '../slicers/userSlice';
import { useNavigate } from 'react-router-dom';
import { selectSpanish, selectToken } from '../slicers/sighnInSlice';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import {  Dialog, DialogContent, useMediaQuery } from '@mui/material';
import EmailForPayment from './EmailForPayment';


const Cart: React.FC = () => {
  const cart = useSelector(selectCart);
  const wavesInCart = useSelector(selectCartOfWaves);
  const cartTotalPrice = useSelector((state: any) => state.cart.cartTotalPrice);
  const sessAlbumOfCart = useSelector(selectSessAlbumOfCart);
  const cartTotalItems = useSelector((state: any) => state.cart.cartTotalItems);
  const cartType = useSelector((state: any) => state.cart.cartType);

  const cartTotalImages = useSelector((state: any) => state.perAlbum.cartTotalImages);
  const totalImagesInWaves = useSelector((state: any) => state.cart.totalImagesInWaves);
  const prices = useSelector((state: any) => state.perAlbum.prices);
  const videos = useSelector(selectVideos);
  const cartOfVideos = useSelector(selectCartOfVideos);
  const cartOfSingleImages = useSelector(selectCartOfSingleImages);
  const imgs = useSelector(selectImg);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser)
  const conectedUser = useSelector(selectToken)
  const spanish = useSelector(selectSpanish)
  const email = useSelector(selectEmail)
  const isMobile = useMediaQuery('(max-width:600px)');
  const [openDialog, setOpenDialog] = useState(false);








  useEffect(() => {
    if (cartType === "waves" && cart.length > 0 || cartType === "singleImages" && cart.length > 0) {
      const albumId = sessAlbumOfCart!.id
      dispatch(fetchPricesBySessionAlbumId(albumId));
    }
    if (cartType === "videos" && cart.length > 0) {
      const albumId = sessAlbumOfCart!.id
      dispatch(fetchPricesForVideosBySessionAlbumId(albumId));
    }
  }, [dispatch]);







  useEffect(() => {
    console.log('wavesInCart', wavesInCart);
    console.log('Cart', cart);
  }, [dispatch, cart, wavesInCart]);


  useEffect(() => {
    // Check if cart is empty and remove sessionAlbum from sessionStorage
    if (cart.length === 0) {
      sessionStorage.removeItem('sessionAlbum');
      dispatch(updateTotalPrice(0)); // Reset total price
      sessionStorage.setItem('cartTotalPrice', JSON.stringify(0)); // Reset stored total price
    }
  }, [cart]);







  const handleIsConnected = () => {
    if (user && conectedUser) {
      handleCheckout()
    } else {
      navigate('/SignUpForPayment')
    }
  };



  const handleEmail = () => {
    setOpenDialog(true);
  };



  useEffect(() => {
    // Check if cart is empty and remove sessionAlbum from sessionStorage
    if (email) {
      handleCheckout()
    }
  }, [email]);






 







  const handleCheckout = async () => {
    dispatch(setCopyCart())
    try {
      console.log('Sending request to create checkout session with the following data:', {
        product_name: cartType,
        amount: cartTotalPrice, // Amount in cents
        currency: 'usd',
        quantity: cartTotalItems,
        connected_account_id: sessAlbumOfCart?.photographer_stripe_account_id,
      });


      // Send a request to your Django endpoint to create a checkout session
      const response = await fetch('https://oyster-app-b3323.ondigitalocean.app/api/create-checkout-session/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_name: cartType,
          amount: cartTotalPrice * 100, // Amount in cents, e.g., $10.00 -> 1000
          currency: 'usd',
          quantity: 1,
          connected_account_id: sessAlbumOfCart?.photographer_stripe_account_id,
        }),
      });

      const data = await response.json();

      // Redirect to the Stripe Checkout URL
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No URL returned');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to create checkout session.');
    }
  };



  const handleNavigateHome = () => {
    navigate('/'); // Navigate to the home page
  };




  const handleCloseDialog = () => {
    setOpenDialog(false);  // Close the dialog
  };



  return (
    <div>
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


      {cartType === "videos" && (
        <>
          <div>
            <h2>{cartTotalItems} Videos, Total Price: ${cartTotalPrice.toFixed(1)} </h2>
          </div>

          <Button variant="contained" color="primary" onClick={handleEmail}>
            continue to checkout <ShoppingCartCheckoutIcon></ShoppingCartCheckoutIcon>
          </Button>


          <VideosInCart></VideosInCart>

          {/* <Button variant="contained" color="primary" onClick={handlePurchaseForVideos}>
            Pay
          </Button>
          <br />
          <br />
          <Button variant="contained" color="primary" onClick={downloadImages}>
            Download Images
          </Button> */}
        </>
      )}







      {cartType === "waves" && (
        <>
          <div>
            <h2>{cartTotalItems} Images, Total Price: ${cartTotalPrice.toFixed(1)} </h2>
          </div>
          <Button variant="contained" color="primary" onClick={handleEmail}>
            continue to checkout <ShoppingCartCheckoutIcon></ShoppingCartCheckoutIcon>
          </Button>

          <PerAlbumInCart></PerAlbumInCart>

          {/* cartTotalImages */}
          {/* <Button variant="contained" color="primary" onClick={handlePurchaseForWaves}>
            Pay
          </Button>
          <br />
          <br />
          <Button variant="contained" color="primary" onClick={downloadImages}>
            Download Images
          </Button> */}

        </>
      )}







      {cartType === "singleImages" && (
        <>
          <div>
            <h2>{cartTotalItems} Images, Total Price: ${cartTotalPrice.toFixed(1)} </h2>
          </div>
          <Button variant="contained" color="primary" onClick={handleEmail}>
            continue to checkout <ShoppingCartCheckoutIcon></ShoppingCartCheckoutIcon>
          </Button>

          <UndividedImgsInCart></UndividedImgsInCart>


          {/* <Button variant="contained" color="primary" onClick={handlePurchaseForImages}>
            Pay
          </Button>
          <br />
          <br />
          <Button variant="contained" color="primary" onClick={downloadImages}>
            Download Images
          </Button> */}
        </>
      )}





      {cartType === null && (
        <div>
          <h2>Your Cart Is Empty</h2>
        </div>

      )}




      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="lg"
        PaperProps={{
          style: {
            backgroundColor: "#FFEEAD",
            width: isMobile ? '100%' : '75%',
            margin: 'auto', // centers the dialog
          }
        }}>

        <DialogContent >
          <EmailForPayment />
        </DialogContent>
      </Dialog>




    </div>
  );
};

export default Cart;
