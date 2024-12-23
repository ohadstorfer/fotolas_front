import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, useMediaQuery } from '@mui/material';
import { teal } from '@mui/material/colors';
import { useAppDispatch } from '../app/hooks';
import { removeNewPrices, removeNewSess, selectNewSess } from '../slicers/sessAlbumSlice';
import { Alert, Box, CircularProgress } from '@mui/joy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { selectSpanish } from '../slicers/sighnInSlice';
import axios from 'axios';
import { clearCart, selectCart, selectCartOfWaves, selectCopyCart, selectCopyCartType, selectSessAlbumOfCart, setCopyCart } from '../slicers/cartSlice';
import { createPurchaseWithImagesAsync, createPurchaseWithVideosAsync, createPurchaseWithWavesAsync, selectEmail, selectPurchaseID } from '../slicers/purchaseSlice';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import { Dialog, DialogActions, DialogContent, DialogContentText, } from '@mui/material';




const PaymentSuccessfull = () => {
  const newSess = useSelector(selectNewSess);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery('(max-width:600px)');
  const spanish = useSelector(selectSpanish)
  const cart = useSelector(selectCart);
  const cartType = useSelector((state: any) => state.cart.cartType);
  // const [cartCopy, setCartCopy] = useState<number[]>([]);
  // const [cartTypeCopy, setCartTypeCopy] = useState<any>();
  const cartCopy = useSelector(selectCopyCart);
  const cartTypeCopy = useSelector(selectCopyCartType);
  const purchaseID = useSelector(selectPurchaseID);
  const wavesInCart = useSelector(selectCartOfWaves);
  const cartTotalPrice = useSelector((state: any) => state.cart.cartTotalPrice);
  const sessAlbumOfCart = useSelector(selectSessAlbumOfCart);
  const cartTotalItems = useSelector((state: any) => state.cart.cartTotalItems);
  const [isCartCopied, setIsCartCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [openMessage, setOpenMessage] = React.useState(false);
  const email = useSelector(selectEmail)
  



  // First useEffect: Copy cart and cartType, then trigger a flag when done
  useEffect(() => {
    dispatch(setCopyCart())
    console.log(cartTypeCopy);
    

    // Call the appropriate purchase function based on cartType
    // if (cartType === 'singleImages') {
    //   console.log("handlePurchaseForImages");
    //   handlePurchaseForImages();
    //   // callLambdaSingleImages();
    // } else if (cartType === 'videos') {
    //   console.log("handlePurchaseForVideos");
    //   handlePurchaseForVideos();
    //   // callLambdaVideo();
    // } else if (cartType === 'waves') {
    //   console.log("handlePurchaseForWaves");
    //   handlePurchaseForWaves();
    //   // callLambdaWaves();
    // }

    // Once the cart has been copied and processed, set the flag to true
    setIsCartCopied(true); // Set this flag to notify the second useEffect
  }, [dispatch]);





  // Second useEffect: Clear cart only after the first useEffect is done
  useEffect(() => {
    if (cartCopy && cartTypeCopy) {
      console.log("clearing cart");
      setTimeout(() => {
        dispatch(clearCart());
      }, 0);
    }
  }, [isCartCopied, dispatch]);




  // useEffect(() => {
  //   if (purchaseID) {
  //     console.log("purchaseID" + purchaseID);
  //     if (cartTypeCopy === 'singleImages') {
  //       callLambdaSingleImages();
  //     } else if (cartTypeCopy === 'videos') {
  //       callLambdaVideo();
  //     } else if (cartTypeCopy === 'waves') {
  //       callLambdaWaves();
  //     }
  //   }
  // }, [purchaseID]);






  const Downloading = async () => {
    console.log("dodododo");
    
    try {
      if (cartTypeCopy === 'singleImages') {
        console.log('Downloading single images...');
        await callLambdaSingleImages();
      }  if (cartTypeCopy === 'waves') {
        console.log('Downloading wave images...');
        await callLambdaWaves();
      }  if (cartTypeCopy === 'videos') {
        console.log('Downloading videos...');
        await callLambdaVideo();
      }
    } catch (error) {
      console.error('Error during download process:', error);
      alert('An error occurred during the download process. Please try again.');
    }
  };




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





















  const callLambdaVideo = async () => {
    setIsDownloading(true);
    try {
      const bucket = 'surfingram-original-video';

      // Step 1: Get video URLs from the backend
      const videoResponse = await axios.post(
        'https://oyster-app-b3323.ondigitalocean.app/api/get_videos_by_ids/',
        { video_ids: cartCopy }
      );

      const videos: { video: string }[] = videoResponse.data;

      // Step 2: Extract file names from URLs
      const filenames = videos
        .map((videoObj) => {
          const videoUrl = videoObj.video;
          const url = new URL(videoUrl);
          return url.pathname.split('/').pop(); // Extract file name
        })
        .filter((filename): filename is string => filename !== undefined); // Filter out undefined values

      if (filenames.length === 0) {
        console.error('No valid filenames were retrieved.');
        return;
      }

      // Step 3: Construct the zip file name
      const zipFileName = `surfpik_${purchaseID}.zip`;

      // Step 4: Prepare query parameters
      const params = new URLSearchParams();
      params.append('bucket', bucket);
      params.append('zipFileName', zipFileName);
      params.append('user_email', email.email);
      filenames.forEach((filename) => params.append('filenames', filename)); // Safe now

      // Step 5: Make the GET request to Django
      const response = await axios.get(
        'https://oyster-app-b3323.ondigitalocean.app/invoke-lambda/',
        { params }
      );

      // Step 6: Handle response
      if (response.status === 200) {
        console.log('Lambda function executed successfully:', response.data);

        const { url } = response.data;
        console.log(url); // Should now print the URL

        handleDownload(url); // Trigger the download
        return url; // Return the URL
      } else {
        console.error('Lambda function failed:', response.data);
      }
    } catch (error) {
      console.error('Error calling Django view:', error);
    }finally{
      setIsDownloading(false)
      handleOpenMessage()
    }
  };







  

  const callLambdaWaves = async () => {
    setIsDownloading(true);
    try {
      const bucket = 'surfingram';

      // Step 1: Get video URLs from the backend
      const imagesResponse = await axios.post(
        'https://oyster-app-b3323.ondigitalocean.app/api/get_images_for_multiple_waves/',
        { waveIds: cartCopy }
      );
      console.log(imagesResponse.data);

      const images: { photo: string }[] = imagesResponse.data; // Assuming each image object has a 'photo' property

      // Step 2: Extract file names from URLs
      const filenames = images
        .map((imageObj) => {
          const imageUrl = imageObj.photo; // Accessing 'photo' inside each image object
          console.log('Extracting file name from URL:', imageUrl); // Log the image URL

          const url = new URL(imageUrl);
          const fileName = url.pathname.split('/').pop(); // Extract file name
          console.log('Extracted file name:', fileName); // Log the extracted file name

          return fileName;
        })
        .filter((filename): filename is string => filename !== undefined); // Filter out undefined values

      console.log('Final list of file names:', filenames); // Log the final list of file names
      if (filenames.length === 0) {
        console.error('No valid filenames were retrieved.');
        return;
      }

      // Step 3: Construct the zip file name
      const zipFileName = `surfpik_${purchaseID}.zip`;

      // Step 4: Prepare query parameters
      const params = new URLSearchParams();
      params.append('bucket', bucket);
      params.append('zipFileName', zipFileName);
      params.append('user_email', email.email);
      filenames.forEach((filename) => params.append('filenames', filename)); // Safe now

      // Step 5: Make the GET request to Django
      const response = await axios.get(
        'https://oyster-app-b3323.ondigitalocean.app/invoke-lambda/',
        { params }
      );

      // Step 6: Handle response
      if (response.status === 200) {
        console.log('Lambda function executed successfully:', response.data);

        const { url } = response.data;
        console.log(url); // Should now print the URL

        handleDownload(url); // Trigger the download
        return url; // Return the URL
      } else {
        console.error('Lambda function failed:', response.data);
      }
    } catch (error) {
      console.error('Error calling Django view:', error);
    }finally{
      setIsDownloading(false)
      handleOpenMessage()
    }
  };









  const callLambdaSingleImages = async () => {
    setIsDownloading(true);
    try {
      const bucket = 'surfingram';

      // Step 1: Get video URLs from the backend
      const imagesResponse = await axios.post(
        'https://oyster-app-b3323.ondigitalocean.app/api/get_images_by_ids/',
        { waveIds: cartCopy }
      );

      const images: { images: string }[] = imagesResponse.data;

      // Step 2: Extract file names from URLs
      const filenames = images
        .map((imagesObj) => {
          const imagesUrl = imagesObj.images;
          const url = new URL(imagesUrl);
          return url.pathname.split('/').pop(); // Extract file name
        })
        .filter((filename): filename is string => filename !== undefined); // Filter out undefined values

      if (filenames.length === 0) {
        console.error('No valid filenames were retrieved.');
        return;
      }

      // Step 3: Construct the zip file name
      const zipFileName = `surfpik_${purchaseID}.zip`;

      // Step 4: Prepare query parameters
      const params = new URLSearchParams();
      params.append('bucket', bucket);
      params.append('zipFileName', zipFileName);
      params.append('user_email', email.email);
      filenames.forEach((filename) => params.append('filenames', filename)); // Safe now

      // Step 5: Make the GET request to Django
      const response = await axios.get(
        'https://oyster-app-b3323.ondigitalocean.app/invoke-lambda/',
        { params }
      );

      // Step 6: Handle response
      if (response.status === 200) {
        console.log('Lambda function executed successfully:', response.data);

        const { url } = response.data;
        console.log(url); // Should now print the URL

        handleDownload(url); // Trigger the download
        return url; // Return the URL
      } else {
        console.error('Lambda function failed:', response.data);
      }
    } catch (error) {
      console.error('Error calling Django view:', error);
    }finally{
      setIsDownloading(false)
      handleOpenMessage()
    }
  };





  const handleDownload = (url: any) => {
    const fileUrl = url;
    const fileName = 'Surfpik.zip'; // Set the desired file name

    // Create an anchor element to trigger the download
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;

    // Append the link to the body (for Safari mobile compatibility)
    document.body.appendChild(link);

    // Trigger the click event to start download
    link.click();

    // Clean up the DOM
    document.body.removeChild(link);
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
    console.log("handlePurchaseForWaves");

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







  const handleOpenMessage = () => {
    setOpenMessage(true);
  };

  const handleCloseMessage = () => {
    setOpenMessage(false);
  };








  return (
    <div className="container">

      {/* <Alert
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
            ? '¡Imágenes/Vídeos comprados con éxito! Ahora puedes presionar aquí para descargarlos o descargarlos en tu perfil mas tarde.'
            : 'Successfully bought images/videos! You can press here to download them now or download them from your profile later.'}
        </Typography>
      </Alert> */}



      {isDownloading &&
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
            Your images/videos are being downloaded. This process may take a few minutes, so thank you for your patience.
          </Typography>

          <CircularProgress color="success" />
        </Alert>
      }



      {!isDownloading &&
        <Button
          variant="contained"
          sx={{
            marginTop: 2,
            backgroundColor: teal[400], // Set custom background color
            '&:hover': {
              backgroundColor: teal[600], // Custom color on hover (optional)
            },
          }}
          onClick={Downloading}
        >
          Download <ArrowCircleDownIcon sx={{ marginLeft: '5px' }} />
        </Button>
      }







      <Box sx={{ padding: '5px', borderRadius: '8px', margin: '5px' }}>
        <Button onClick={handleOpenMessage} sx={{ color: 'black' }}>
          How to find my images/videos?
        </Button>
      </Box>






      <br></br>
      <br></br>
      <br></br>
      <br></br>

      <Button
        variant="text"
        sx={{

          fontSize: '0.9rem',
          color: teal[400],             // Text color
          // padding: '10px 20px',        // Padding for button size
          borderRadius: '8px',         // Rounded corners
          cursor: 'pointer',
          '&:hover': { backgroundColor: teal[400], color: 'white', }  // Hover effect
        }}
        onClick={handleNavigateHome}
        disabled={isDownloading}
      >
        {spanish ? 'Ir a la página principal' : 'Go to Homepage'}
      </Button>




      {openMessage && (
        <Dialog
          open={openMessage}
          onClose={handleCloseMessage}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <Typography variant="body1" paragraph align="center">
                <strong>How to find your images/videos:</strong>
              </Typography>


              <Typography variant="body1" paragraph>
                Check your phone's files and search for <strong><em>“surfpik.zip”</em></strong>. You may find it under <em>"Recents"</em> or <em>"Downloads"</em>.
              </Typography>

              <Typography variant="body1" paragraph>
                Tap on the <em>“surfpik.zip”</em> file to open it. Your device will either create a new folder named <em>“surfpik”</em> containing all your images, or simply display the images within.
              </Typography>


            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseMessage} autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      )}


    </div>
  );
};

export default PaymentSuccessfull;






