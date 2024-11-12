import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, useMediaQuery } from '@mui/material';
import { teal } from '@mui/material/colors';
import Stepper from '@mui/joy/Stepper';
import Step from '@mui/joy/Step';
import StepIndicator from '@mui/joy/StepIndicator';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useAppDispatch } from '../app/hooks';
import { removeNewPrices, removeNewSess, selectNewSess } from '../slicers/sessAlbumSlice';
import { Alert } from '@mui/joy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { selectSpanish } from '../slicers/sighnInSlice';
import axios from 'axios';
import { clearCart, selectCart, selectCartOfWaves, selectSessAlbumOfCart } from '../slicers/cartSlice';
import { createPurchaseWithImagesAsync, createPurchaseWithVideosAsync, createPurchaseWithWavesAsync } from '../slicers/purchaseSlice';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import JSZip from 'jszip';
import { saveAs } from 'file-saver'; // Run `npm install file-saver`


const PaymentSuccessfull = () => {
  const newSess = useSelector(selectNewSess);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery('(max-width:600px)');
  const spanish = useSelector(selectSpanish)
  const cart = useSelector(selectCart);
  const cartType = useSelector((state: any) => state.cart.cartType);
  const [cartCopy, setCartCopy] = useState<number[]>([]);
  const [cartTypeCopy, setCartTypeCopy] = useState<any>();

  const wavesInCart = useSelector(selectCartOfWaves);
  const cartTotalPrice = useSelector((state: any) => state.cart.cartTotalPrice);
  const sessAlbumOfCart = useSelector(selectSessAlbumOfCart);
  const cartTotalItems = useSelector((state: any) => state.cart.cartTotalItems);
  const [isCartCopied, setIsCartCopied] = useState(false);



  // First useEffect: Copy cart and cartType, then trigger a flag when done
  useEffect(() => {
    // Make a copy of the cart and cartType when the component mounts
    const copiedCart = JSON.parse(sessionStorage.getItem('cart') || '[]'); // Parse to convert from JSON string to array
    const copiedCartType = sessionStorage.getItem('cartType');; // Retrieve cartType as string

    setCartCopy(copiedCart);
    setCartTypeCopy(copiedCartType); // Set the copied cart and cartType state

    // Call the appropriate purchase function based on cartType
    if (copiedCartType === '"singleImages"') {
      console.log("handlePurchaseForImages");
      handlePurchaseForImages();
    } else if (copiedCartType === '"videos"') {
      console.log("handlePurchaseForVideos");
      handlePurchaseForVideos();
    } else if (copiedCartType === '"waves"') {
      console.log("handlePurchaseForWaves");
      handlePurchaseForWaves();
    }

    // Once the cart has been copied and processed, set the flag to true
    setIsCartCopied(true); // Set this flag to notify the second useEffect
  }, [dispatch]);

  // Second useEffect: Clear cart only after the first useEffect is done
  useEffect(() => {
    if (cartCopy && cartTypeCopy) {
      // Delay clearing the cart until after the first useEffect has finished
      setTimeout(() => {
        dispatch(clearCart());
      }, 0);
    }
  }, [isCartCopied, dispatch]);






  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = ''; // Browser's default warning dialog
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload); // Clean up
    };
  }, [dispatch]);





  const handleDownload = async () => {
    try {
      if (cartTypeCopy === '"singleImages"') {
        console.log('Downloading single images...');
        await downloadSingleImages();
      } else if (cartTypeCopy === '"waves"') {
        console.log('Downloading wave images...');
        await downloadWaves2();
      } else if (cartTypeCopy === '"videos"') {
        console.log('Downloading videos...');
        await downloadVideos();
      } else {
        console.error('Invalid cart type.');
        alert('Invalid cart type. Please select a valid option.');
      }
    } catch (error) {
      console.error('Error during download process:', error);
      alert('An error occurred during the download process. Please try again.');
    }
  };









  const downloadWaves2 = async () => {
    try {
      const response = await axios.post('https://oyster-app-b3323.ondigitalocean.app/api/get_images_for_multiple_waves/', { waveIds: cartCopy });
      const images = response.data;
  
      const zip = new JSZip();
      for (const image of images) {
        try {
          const imageResponse = await axios.get(image.photo, { responseType: 'blob' });
          zip.file(image.photo.split('/').pop(), imageResponse.data);
        } catch (downloadError) {
          console.error(`Error downloading image ${image.photo}:`, downloadError);
        }
      }
  
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'downloaded_images.zip');
    } catch (error) {
      console.error('Error creating ZIP file:', error);
    }
  };






  const downloadWaves = async () => {
    try {
      // Make a request to get the image URLs for the specified wave IDs in the cart
      const response = await axios.post('https://oyster-app-b3323.ondigitalocean.app/api/get_images_for_multiple_waves/', { waveIds: cartCopy });
      const images = response.data;
      console.log(images);

      // Download all images concurrently
      await Promise.all(images.map(async (image: any) => {
        try {
          // Fetch the image as a blob
          const imageResponse = await axios.get(image.photo, { responseType: 'blob' });

          // Create a blob URL for the image
          const url = window.URL.createObjectURL(new Blob([imageResponse.data]));

          // Create an anchor element for downloading the image
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', image.photo.split('/').pop()); // Set the file name based on the URL
          document.body.appendChild(link);
          link.click();

          // Clean up the DOM and release the blob URL
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        } catch (downloadError) {
          // Handle individual download errors without stopping the entire process
          console.error(`Error downloading image ${image.photo}:`, downloadError);
        }
      }));
    } catch (error) {
      // Log general errors related to the API request or response parsing
      console.error('Error downloading images:', error);
    }
  };





  const downloadSingleImages = async () => {
    try {
      // Make a request to get image URLs for the provided image IDs
      const response = await axios.post('https://oyster-app-b3323.ondigitalocean.app/api/get_images_by_ids/', { image_ids: cartCopy });
      const images = response.data;
      console.log(images);

      // Download all images concurrently
      await Promise.all(images.map(async (image: any) => {
        try {
          // Fetch the image as a blob
          const imageResponse = await axios.get(image.photo, { responseType: 'blob' });

          // Create a blob URL for the image
          const url = window.URL.createObjectURL(new Blob([imageResponse.data]));

          // Create an anchor element for downloading the image
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', image.photo.split('/').pop()); // Set the file name based on the URL
          document.body.appendChild(link);
          link.click();

          // Clean up the DOM and release the blob URL
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        } catch (downloadError) {
          // Handle individual download errors without stopping the entire process
          console.error(`Error downloading image ${image.photo}:`, downloadError);
        }
      }));
    } catch (error) {
      // Log general errors related to the API request or response parsing
      console.error('Error downloading images:', error);
    }
  };





  const downloadVideos = async () => {
    try {
      // Make a request to get video URLs for the provided video IDs
      const response = await axios.post('https://oyster-app-b3323.ondigitalocean.app/api/get_videos_by_ids/', { video_ids: cartCopy });
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





  const handleNavigateHome = () => {
    navigate('/'); // Navigate to the home page
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









  return (
    <div className="container">
      <Alert
        variant="outlined"
        color="success"
        startDecorator={<CheckCircleIcon />}
        sx={{
          maxWidth: isMobile ? '90%' : '400px',
          margin: '0 auto', // Center horizontally
          textAlign: 'center',
        }}
      >
        <Typography>
          {spanish
            ? '¡Imágenes/Vídeos comprados con éxito! Ahora puedes presionar aquí para descargarlos o descargarlos en tu perfil en los próximos días. (Las imágenes se eliminarán automáticamente después de 30 días y los vídeos después de 5 días)'
            : 'Successfully bought images/videos! You can press here to download them now or download them from your profile in the remaining days. (Images are automatically deleted after 30 days and videos after 5 days)'}
        </Typography>
      </Alert>



      <Button
        variant="contained"
        sx={{
          marginTop: 2,
          backgroundColor: teal[400], // Set custom background color
          '&:hover': {
            backgroundColor: teal[600], // Custom color on hover (optional)
          },
        }}
        onClick={handleDownload}
      >
        {spanish ? 'Descargar' : 'Download'} <ArrowCircleDownIcon sx={{ marginLeft: '5px' }} />
      </Button>


      <br></br>
      <br></br>
      <br></br>
      <br></br>

      <Button
        variant="text"
        sx={{
          
          fontSize: '0.9rem',
          color: teal[400]  ,             // Text color
          // padding: '10px 20px',        // Padding for button size
          borderRadius: '8px',         // Rounded corners
          cursor: 'pointer',
          '&:hover': { backgroundColor: teal[400], color: 'white'  , }  // Hover effect
        }}
        onClick={handleNavigateHome}
      >
        {spanish ? 'Ir a la página principal' : 'Go to Homepage'}
      </Button>
    </div>
  );
};

export default PaymentSuccessfull;
