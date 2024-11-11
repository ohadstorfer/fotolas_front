import React, { useEffect } from 'react';
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
import { selectCart, calculatePriceForImages, calculatePriceForWaves, removeCartType, removeFromCart_singleImages, removeFromCart_waves, removeSessAlbumOfCart, removeFromCart_videos, selectCartOfVideos, selectCartOfSingleImages, selectSessAlbumOfCart, selectWavesInCart, selectCartOfWaves, fetchPricesBySessionAlbumId, fetchPricesForVideosBySessionAlbumId } from '../slicers/cartSlice';
import { selectImg, selectVideos } from '../slicers/ImagesSlice';
import { AspectRatio } from '@mui/joy';
import { createPurchaseAsync, createPurchaseItemAsync, createPurchaseWithImagesAsync, createPurchaseWithVideosAsync, createPurchaseWithWavesAsync } from '../slicers/purchaseSlice';
import Video from './Video';
import VideosInCart from './VideosInCart';
import UndividedImgsInCart from './UndividedImgsInCart';
import PerAlbumInCart from './PerAlbumInCart';
import SmartDisplayIcon from '@mui/icons-material/SmartDisplay';

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





  useEffect(() => {
    if (cartType === "waves" && cart.length > 0) {
      dispatch(fetchWavesByListAsync(cart));
      console.log(sessAlbumOfCart?.photographer_stripe_account_id);
      
    }
  }, [dispatch, cart]); 




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











  const handleRemoveFromCartWaves = (waveId: number, imageCount: number) => {
    if (cart.length === 1) {
      dispatch(removeSessAlbumOfCart());
      dispatch(removeCartType());
    }
    dispatch(removeFromCart_waves({ waveId, imageCount })); // Assuming each image is counted as 1
    dispatch(calculatePriceForImages());
  };



  const handleRemoveFromCartSingleImages = (imgId: number) => {
    if (cart.length === 1) {
      dispatch(removeSessAlbumOfCart());
      dispatch(removeCartType());
    }
    dispatch(removeFromCart_singleImages({ imgId: imgId })); // Assuming each image is counted as 1
    dispatch(calculatePriceForImages());
  };


  const handleRemoveFromCartVideos = (VideoId: number) => {
    if (cart.length === 1) {
      dispatch(removeSessAlbumOfCart());
      dispatch(removeCartType());
    }
    dispatch(removeFromCart_videos({ videoId: VideoId })); // Assuming each image is counted as 1
    dispatch(calculatePriceForImages());
  };




  const downloadImages = async () => {
    try {
      const response = await axios.post('https://oyster-app-b3323.ondigitalocean.app/api/get_images_for_multiple_waves/', { waveIds: cart });
      const images = response.data;
      console.log(images);

      images.forEach(async (image: any) => {
        const imageResponse = await axios.get(image.photo, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([imageResponse.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', image.photo.split('/').pop());
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    } catch (error) {
      console.error('Error downloading images:', error);
    }
  };





  const handlePurchaseForImages = async () => {
    console.log("handlePurchaseForImages");

    const surfer_id = JSON.parse(localStorage.getItem('token') || '{}').id;
    const surfer_name = JSON.parse(localStorage.getItem('token') || '{}').fullName;
    const photographer_id = sessAlbumOfCart!.photographer; // Assuming all items are from the same photographer
    const total_price = cartTotalPrice;
    const total_item_quantity = cartTotalItems;
    const session_album_id = sessAlbumOfCart!.id;
    const sessDate = sessAlbumOfCart!.sessDate;
    const spot_name = sessAlbumOfCart!.spot_name;
    const photographer_name = sessAlbumOfCart!.photographer_name;
    const imageIds = cart

    const purchaseData = {
      photographer_id,
      surfer_id,
      total_price,
      total_item_quantity,
      session_album_id,
      image_ids: imageIds,
      sessDate: sessDate,
      spot_name: spot_name,
      photographer_name: photographer_name,
      surfer_name: surfer_name,
    };
    console.log(purchaseData);

    await dispatch(createPurchaseWithImagesAsync(purchaseData));
  };




  const handlePurchaseForVideos = async () => {
    console.log("handlePurchaseForVideos");

    const surfer_id = JSON.parse(localStorage.getItem('token') || '{}').id;
    const surfer_name = JSON.parse(localStorage.getItem('token') || '{}').fullName;
    const photographer_id = sessAlbumOfCart!.photographer; // Assuming all items are from the same photographer
    const total_price = cartTotalPrice;
    const total_item_quantity = cartTotalItems;
    const session_album_id = sessAlbumOfCart!.id;
    const sessDate = sessAlbumOfCart!.sessDate;
    const spot_name = sessAlbumOfCart!.spot_name;
    const photographer_name = sessAlbumOfCart!.photographer_name;
    const videoIds = cart

    const purchaseData = {
      photographer_id,
      surfer_id,
      total_price,
      total_item_quantity,
      session_album_id,
      video_ids: videoIds,
      sessDate: sessDate,
      spot_name: spot_name,
      photographer_name: photographer_name,
      surfer_name: surfer_name,
    };
    console.log(purchaseData);

    await dispatch(createPurchaseWithVideosAsync(purchaseData));
  };




  const handlePurchaseForWaves = async () => {
    console.log("handlePurchaseForImages");

    const surfer_id = JSON.parse(localStorage.getItem('token') || '{}').id;
    const surfer_name = JSON.parse(localStorage.getItem('token') || '{}').fullName;
    const photographer_id = sessAlbumOfCart!.photographer; // Assuming all items are from the same photographer
    const total_price = cartTotalPrice;
    const total_item_quantity = cartTotalItems;
    const session_album_id = sessAlbumOfCart!.id;
    const sessDate = sessAlbumOfCart!.sessDate;
    const spot_name = sessAlbumOfCart!.spot_name;
    const photographer_name = sessAlbumOfCart!.photographer_name;
    const wave_ids = cart;

    const purchaseData = {
      photographer_id,
      surfer_id,
      total_price,
      total_item_quantity,
      session_album_id,
      wave_ids: wave_ids,
      sessDate: sessDate,
      spot_name: spot_name,
      photographer_name: photographer_name,
      surfer_name: surfer_name,
    };
    console.log(purchaseData);

    await dispatch(createPurchaseWithWavesAsync(purchaseData));
  };







  const handleCheckout = async () => {
    try {
      console.log('Sending request to create checkout session with the following data:', {
        product_name: cartType,
        amount: cartTotalPrice, // Amount in cents
        currency: 'usd',
        quantity: cartTotalItems,
        connected_account_id: sessAlbumOfCart?.photographer_stripe_account_id,
      });


      // Send a request to your Django endpoint to create a checkout session
      const response = await fetch('http://127.0.0.1:8000/api/create-checkout-session/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_name: cartType,
          amount: cartTotalPrice, // Amount in cents, e.g., $10.00 -> 1000
          currency: 'usd',
          quantity: cartTotalItems,
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






  return (
    <div>
      {cartType === "videos" && (
        <>
          <div>
            <h2> {cartTotalItems} Videos <SmartDisplayIcon style={{ color: 'black' }} /></h2>
            <h2>Total Price: ${cartTotalPrice.toFixed(2)}</h2>
          </div>

          
          {/* <Button variant="contained" color="primary" onClick={handlePurchaseForVideos}>
            Pay
          </Button>
          <br />
          <br />
          <Button variant="contained" color="primary" onClick={downloadImages}>
            Download Images
          </Button> */}


          <Button variant="contained" color="primary" onClick={handleCheckout}>
            Pay with Stripe
          </Button>


          <VideosInCart></VideosInCart>
        </>
      )}




      {cartType === "waves" && (
        <>
          <div>
            <h2>{cartTotalItems} Images <IoImagesOutline style={{ color: 'black' }} /></h2>
            <h2>Total Price: ${cartTotalPrice.toFixed(2)}</h2>
          </div>

          {/* cartTotalImages */}
          {/* <Button variant="contained" color="primary" onClick={handlePurchaseForWaves}>
            Pay
          </Button>
          <br />
          <br />
          <Button variant="contained" color="primary" onClick={downloadImages}>
            Download Images
          </Button> */}


          <Button variant="contained" color="primary" onClick={handleCheckout}>
            Pay with Stripe
          </Button>


          <PerAlbumInCart></PerAlbumInCart>
        </>
      )}



      {cartType === "singleImages" && (
        <>
          <div>
            <h2>{cartTotalItems} Images <IoImagesOutline style={{ color: 'black' }} /></h2>
            <h2>Total Price: ${cartTotalPrice.toFixed(2)}</h2>
          </div>
          {/* <Button variant="contained" color="primary" onClick={handlePurchaseForImages}>
            Pay
          </Button>
          <br />
          <br />
          <Button variant="contained" color="primary" onClick={downloadImages}>
            Download Images
          </Button> */}

          <Button variant="contained" color="primary" onClick={handleCheckout}>
            Pay with Stripe
          </Button>



          <UndividedImgsInCart></UndividedImgsInCart>
        </>
      )}





      {cartType === null && (
        <div>
          <h2>Your Cart Is Empty</h2>
        </div>

      )}



    </div>
  );
};

export default Cart;
