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
import { selectCart, calculatePriceForImages, calculatePriceForWaves, removeCartType, removeFromCart_singleImages, removeFromCart_waves, removeSessAlbumOfCart, removeFromCart_videos, selectCartOfVideos, selectCartOfSingleImages, selectSessAlbumOfCart, selectWavesInCart, selectCartOfWaves, fetchPricesBySessionAlbumId, fetchPricesForVideosBySessionAlbumId, setCopyCart } from '../slicers/cartSlice';
import { selectImg, selectVideos } from '../slicers/ImagesSlice';
import { AspectRatio } from '@mui/joy';
import { createPurchaseAsync, createPurchaseItemAsync, createPurchaseWithImagesAsync, createPurchaseWithVideosAsync, createPurchaseWithWavesAsync } from '../slicers/purchaseSlice';
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
    } else{
       navigate('/SignUpForPayment')
    }
  };








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
          amount: cartTotalPrice * 100 , // Amount in cents, e.g., $10.00 -> 1000
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









  const downloadVideosFromS3 = async () => {
    try {
      // Fetch video metadata and URLs from your backend
      const response = await axios.post(
        'https://oyster-app-b3323.ondigitalocean.app/api/get_videos_by_ids/',
        { video_ids: cart }
      );
      const videos = response.data;
  
      // Function to handle downloading a single video
      const downloadVideo = async (video: any): Promise<void> => {
        return new Promise((resolve, reject) => {
          try {
            const link = document.createElement('a');
            link.href = video.video; // S3 URL
            link.setAttribute('download', video.video.split('/').pop() || 'video'); // Extract filename or fallback
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            resolve();
          } catch (error) {
            console.error(`Error downloading video ${video.video}:`, error);
            reject(error);
          }
        });
      };
  
      // Download all videos sequentially
      for (const video of videos) {
        await downloadVideo(video);
      }
  
      console.log('All videos downloaded successfully.');
    } catch (error) {
      console.error('Error downloading videos:', error);
    }
  };




    const downloadVideos = async () => {
    try {
      // Make a request to get video URLs for the provided video IDs
      const response = await axios.post('https://oyster-app-b3323.ondigitalocean.app/api/get_videos_by_ids/', { video_ids: cart });
      const videos = response.data;
      console.log(videos);

      // Download all videos concurrently
      await Promise.all(videos.map(async (video: any) => {
        try {
          // Fetch the video as a blob
          const videoResponse = await axios.get(video.video, { responseType: 'blob' });

          // Create a blob URL for the video
          const url = window.URL.createObjectURL(new Blob([videoResponse.data]));

          // Create an anchor element for downloading the video
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', video.video.split('/').pop()); // Set the file name based on the URL
          document.body.appendChild(link);
          link.click();

          // Clean up the DOM and release the blob URL
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        } catch (downloadError) {
          // Handle individual download errors without stopping the entire process
          console.error(`Error downloading video ${video.video}:`, downloadError);
        }
      }));
    } catch (error) {
      // Log general errors related to the API request or response parsing
      console.error('Error downloading videos:', error);
    }
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

          <Button variant="contained" color="primary" onClick={handleIsConnected}>
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
          <Button variant="contained" color="primary" onClick={handleIsConnected}>
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
          <Button variant="contained" color="primary" onClick={handleIsConnected}>
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




        <Button
          variant="contained"
          sx={{
            marginTop: 2,
            backgroundColor: teal[400], // Set custom background color
            '&:hover': {
              backgroundColor: teal[600], // Custom color on hover (optional)
            },
          }}
          onClick={downloadVideos}
        >
          Download 
        </Button>
      






      {cartType === null && (
        <div>
          <h2>Your Cart Is Empty</h2>
        </div>

      )}



    </div>
  );
};

export default Cart;
