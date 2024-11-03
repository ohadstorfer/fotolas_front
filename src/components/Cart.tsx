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
import { selectCart, calculatePriceForImages, calculatePriceForWaves, removeCartType, removeFromCart_singleImages, removeFromCart_waves, removeSessAlbumOfCart, removeFromCart_videos, selectCartOfVideos, selectCartOfSingleImages, selectSessAlbumOfCart } from '../slicers/cartSlice';
import { selectImg, selectVideos } from '../slicers/ImagesSlice';
import { AspectRatio } from '@mui/joy';
import { createPurchaseAsync, createPurchaseItemAsync, createPurchaseWithImagesAsync, createPurchaseWithVideosAsync, createPurchaseWithWavesAsync } from '../slicers/purchaseSlice';

const Cart: React.FC = () => {
  const cart = useSelector(selectCart);
  const wavesInCart = useSelector(selectWavesInCart_WAVES);
  const cartTotalPrice = useSelector((state: any) => state.cart.cartTotalPrice);
  const cartTotalImages = useSelector((state: any) => state.perAlbum.cartTotalImages);
  const cartTotalItems = useSelector((state: any) => state.cart.cartTotalItems);
  const totalImagesInWaves = useSelector((state: any) => state.cart.totalImagesInWaves);
  const prices = useSelector((state: any) => state.perAlbum.prices);
  const cartType = useSelector((state: any) => state.cart.cartType);
  const videos = useSelector(selectVideos);
  const cartOfVideos = useSelector(selectCartOfVideos);
  const cartOfSingleImages = useSelector(selectCartOfSingleImages);
  const sessAlbumOfCart = useSelector(selectSessAlbumOfCart);
  const imgs = useSelector(selectImg);
  const dispatch = useAppDispatch();








  useEffect(() => {
    if (cart.length > 0) {
      dispatch(fetchWavesByListAsync(cart));
    }
  }, [dispatch, cart]);

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








  const calculatePrice = (totalImages: number) => {
    if (!prices) return 0;
    if (totalImages >= 1 && totalImages <= 5) return parseFloat(prices.price_1_to_5);
    if (totalImages >= 6 && totalImages <= 20) return parseFloat(prices.price_6_to_20);
    if (totalImages >= 21 && totalImages <= 50) return parseFloat(prices.price_21_to_50);
    return parseFloat(prices.price_51_plus);
  };

  const handleRemoveFromCart = async (albumId: number, imageCount: number) => {
    const totalPrice = calculatePrice(cartTotalImages - imageCount);
    dispatch(removeFromCart({ albumId, imageCount }));
    dispatch(removeWaveFromCart(albumId));
    dispatch(updateTotalPrice(totalPrice));
  };



  

  const handleRemoveFromCartWaves = (waveId: number, imageCount: number) => {
    if (cart.length===1) {
      dispatch(removeSessAlbumOfCart());
      dispatch(removeCartType());
    }
    dispatch(removeFromCart_waves({ waveId, imageCount  })); // Assuming each image is counted as 1
    dispatch(calculatePriceForImages());
  };



  const handleRemoveFromCartSingleImages = (imgId: number) => {
    if (cart.length===1) {
      dispatch(removeSessAlbumOfCart());
      dispatch(removeCartType());
    }
    dispatch(removeFromCart_singleImages({ imgId: imgId })); // Assuming each image is counted as 1
    dispatch(calculatePriceForImages());
  };


  const handleRemoveFromCartVideos = (VideoId: number) => {
    if (cart.length===1) {
      dispatch(removeSessAlbumOfCart());
      dispatch(removeCartType());
    }
    dispatch(removeFromCart_videos({videoId: VideoId})); // Assuming each image is counted as 1
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
    const imageIds = cartOfSingleImages.map((img) => img.id);

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
    const videoIds = cartOfVideos.map((video) => video.id);

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
  const wave_ids  = wavesInCart.map((wave) => wave.id);

  const purchaseData = {
    photographer_id,
    surfer_id,
    total_price,
    total_item_quantity,
    session_album_id,
    wave_ids : wave_ids ,
    sessDate: sessDate,
    spot_name: spot_name,
    photographer_name: photographer_name,
    surfer_name: surfer_name,
  };
  console.log(purchaseData);

  await dispatch(createPurchaseWithWavesAsync(purchaseData));
};



  return (
    <div>
      {cartType === "videos" && (
        <>
          <div>
            <h2>Total Price: ${cartTotalPrice.toFixed(2)}</h2>
          </div>
          <Button variant="contained" color="primary" onClick={handlePurchaseForVideos}>
            Pay
          </Button>
          <br />
          <br />
          <Button variant="contained" color="primary" onClick={downloadImages}>
            Download Images
          </Button>



          <ImageList variant="masonry" cols={8} gap={5} sx={{ margin: '20px' }}>
            {cartOfVideos.map((video) => (
              <ImageListItem key={video.id}>
                <Card>
                {/* <Card sx={{ maxWidth: 150 }}> */}
                  <CardActionArea>
                  <AspectRatio ratio="4/3">
                  <video controls height="100" src={video.WatermarkedVideo} style={{ width: '100%' }} />
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
                        sx={{ color: teal[100], p: 0.5 }}
                        aria-label="remove from cart"
                        onClick={() => handleRemoveFromCartVideos(video.id)}
                      >
                        <RemoveShoppingCartIcon style={{ fontSize: '1rem' }} />
                      </IconButton>
                    </Box>
                    </AspectRatio>
                  </CardActionArea>
                </Card>
              </ImageListItem>
            ))}
          </ImageList>
        </>
      )}




{cartType === "waves" && (
        <>
          <div>
            <h2>Total Price: ${cartTotalPrice.toFixed(2)}</h2>
          </div>
          <Button variant="contained" color="primary" onClick={handlePurchaseForWaves}>
            Pay
          </Button>
          <br />
          <br />
          <Button variant="contained" color="primary" onClick={downloadImages}>
            Download Images
          </Button>





          <ImageList variant="masonry" cols={8} gap={5} sx={{ margin: '20px' }}>
            {wavesInCart.map((personalAlbum) => (
              <ImageListItem key={personalAlbum.id}>
                <Card sx={{ maxWidth: 150 }}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="100"
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
                        gap: 0.5,
                        p: 0.5,
                        bgcolor: 'rgba(0, 0, 0, 0.6)',
                        borderRadius: '8px 0 0 0',
                      }}
                    >
                      <Avatar sx={{ bgcolor: teal[100], width: 30, height: 30 }}>
                        <span style={{ marginRight: '2px', fontSize: '0.75rem', color: 'black' }}>
                          {personalAlbum.image_count}
                        </span>
                        <IoImagesOutline style={{ color: 'black', fontSize: '0.75rem' }} />
                      </Avatar>
                      <IconButton
                        sx={{ color: teal[100], p: 0.5 }}
                        aria-label="remove from cart"
                        onClick={() => handleRemoveFromCartWaves(personalAlbum.id, personalAlbum.image_count)}
                      >
                        <RemoveShoppingCartIcon style={{ fontSize: '1rem' }} />
                      </IconButton>
                    </Box>
                  </CardActionArea>
                </Card>
              </ImageListItem>
            ))}
          </ImageList>
        </>
      )}



{cartType === "singleImages" && (
        <>
          <div>
            <h2>Total Price: ${cartTotalPrice.toFixed(2)}</h2>
          </div>
          <Button variant="contained" color="primary" onClick={handlePurchaseForImages}>
            Pay
          </Button>
          <br />
          <br />
          <Button variant="contained" color="primary" onClick={downloadImages}>
            Download Images
          </Button>





          <ImageList variant="masonry" cols={8} gap={5} sx={{ margin: '20px' }}>
            {cartOfSingleImages.map((img) => (
              <ImageListItem key={img.id}>
                <Card>
                {/* <Card sx={{ maxWidth: 150 }}> */}
                  <CardActionArea>
                  <AspectRatio ratio="4/3">
                  <CardMedia
                    component="img"
                    height="200"
                    image={img.WatermarkedPhoto} // Use the image URL from your Redux store
                    alt={`Image ${img.id}`}
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
                        borderRadius: '8px 0 0 0',
                      }}
                    >

                      <IconButton
                        sx={{ color: teal[100], p: 0.5 }}
                        aria-label="remove from cart"
                        onClick={() => handleRemoveFromCartSingleImages(img.id)}
                      >
                        <RemoveShoppingCartIcon style={{ fontSize: '1rem' }} />
                      </IconButton>
                    </Box>
                    </AspectRatio>
                  </CardActionArea>
                </Card>
              </ImageListItem>
            ))}
          </ImageList>
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
