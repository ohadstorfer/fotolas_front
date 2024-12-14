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
import { Alert, Box, CircularProgress } from '@mui/joy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { selectSpanish } from '../slicers/sighnInSlice';
import axios from 'axios';
import { clearCart, selectCart, selectCartOfWaves, selectCopyCart, selectCopyCartType, selectSessAlbumOfCart, setCopyCart } from '../slicers/cartSlice';
import { createPurchaseWithImagesAsync, createPurchaseWithVideosAsync, createPurchaseWithWavesAsync, selectPurchaseID } from '../slicers/purchaseSlice';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Dialog, DialogActions, DialogContent, DialogContentText, } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';



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
  const purchasID = useSelector(selectPurchaseID);
  const wavesInCart = useSelector(selectCartOfWaves);
  const cartTotalPrice = useSelector((state: any) => state.cart.cartTotalPrice);
  const sessAlbumOfCart = useSelector(selectSessAlbumOfCart);
  const cartTotalItems = useSelector((state: any) => state.cart.cartTotalItems);
  const [isCartCopied, setIsCartCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [openMessage, setOpenMessage] = React.useState(false);



  // First useEffect: Copy cart and cartType, then trigger a flag when done
  useEffect(() => {
    // dispatch(setCopyCart())

    // Call the appropriate purchase function based on cartType
    if (cartTypeCopy === 'singleImages') {
      console.log("handlePurchaseForImages");
      handlePurchaseForImages();
      downloadSingleImages2();
    } else if (cartTypeCopy === 'videos') {
      console.log("handlePurchaseForVideos");
      handlePurchaseForVideos();
      downloadVideos2();
    } else if (cartTypeCopy === 'waves') {
      console.log("handlePurchaseForWaves");
      handlePurchaseForWaves();
      downloadWaves2();
    }

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



  const handleDownload = async () => {
    try {
      if (cartTypeCopy === 'singleImages') {
        console.log('Downloading single images...');
        await downloadSingleImages2();
      } else if (cartTypeCopy === 'waves') {
        console.log('Downloading wave images...');
        await downloadWaves2();
      } else if (cartTypeCopy === 'videos') {
        console.log('Downloading videos...');
        await downloadVideos2();
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





  const downloadWaves2 = async () => {
    setIsDownloading(true);
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
      saveAs(content, 'surfpik.zip');
    } catch (error) {
      console.error('Error creating ZIP file:', error);
    } finally {
      setIsDownloading(false);
      handleOpenMessage()
    }
  };



  const downloadSingleImages2 = async () => {
    setIsDownloading(true);
    try {
      const response = await axios.post('https://oyster-app-b3323.ondigitalocean.app/api/get_images_by_ids/', { image_ids: cartCopy });
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
      saveAs(content, 'surfpik.zip');
    } catch (error) {
      console.error('Error creating ZIP file:', error);
    } finally {
      setIsDownloading(false);
      handleOpenMessage()
    }
  };



  const downloadVideos2 = async () => {
    setIsDownloading(true);
    try {
      const response = await axios.post('https://oyster-app-b3323.ondigitalocean.app/api/get_videos_by_ids/', { video_ids: cartCopy });
      const videos = response.data;

      const zip = new JSZip();
      for (const video of videos) {
        try {
          const imageResponse = await axios.get(video.video, { responseType: 'blob' });
          zip.file(video.video.split('/').pop(), imageResponse.data);
        } catch (downloadError) {
          console.error(`Error downloading image ${video.video}:`, downloadError);
        }
      }

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'surfpik.zip');
    } catch (error) {
      console.error('Error creating ZIP file:', error);
    } finally {
      setIsDownloading(false);
      handleOpenMessage()
    }
  };









  // const downloadWaves = async () => {
  //   try {
  //     // Make a request to get the image URLs for the specified wave IDs in the cart
  //     const response = await axios.post('https://oyster-app-b3323.ondigitalocean.app/api/get_images_for_multiple_waves/', { waveIds: cartCopy });
  //     const images = response.data;
  //     console.log(images);

  //     // Download all images concurrently
  //     await Promise.all(images.map(async (image: any) => {
  //       try {
  //         // Fetch the image as a blob
  //         const imageResponse = await axios.get(image.photo, { responseType: 'blob' });

  //         // Create a blob URL for the image
  //         const url = window.URL.createObjectURL(new Blob([imageResponse.data]));

  //         // Create an anchor element for downloading the image
  //         const link = document.createElement('a');
  //         link.href = url;
  //         link.setAttribute('download', image.photo.split('/').pop()); // Set the file name based on the URL
  //         document.body.appendChild(link);
  //         link.click();

  //         // Clean up the DOM and release the blob URL
  //         document.body.removeChild(link);
  //         window.URL.revokeObjectURL(url);
  //       } catch (downloadError) {
  //         // Handle individual download errors without stopping the entire process
  //         console.error(`Error downloading image ${image.photo}:`, downloadError);
  //       }
  //     }));
  //   } catch (error) {
  //     // Log general errors related to the API request or response parsing
  //     console.error('Error downloading images:', error);
  //   }
  // };





  // const downloadSingleImages = async () => {
  //   try {
  //     // Make a request to get image URLs for the provided image IDs
  //     const response = await axios.post('https://oyster-app-b3323.ondigitalocean.app/api/get_images_by_ids/', { image_ids: cartCopy });
  //     const images = response.data;
  //     console.log(images);

  //     // Download all images concurrently
  //     await Promise.all(images.map(async (image: any) => {
  //       try {
  //         // Fetch the image as a blob
  //         const imageResponse = await axios.get(image.photo, { responseType: 'blob' });

  //         // Create a blob URL for the image
  //         const url = window.URL.createObjectURL(new Blob([imageResponse.data]));

  //         // Create an anchor element for downloading the image
  //         const link = document.createElement('a');
  //         link.href = url;
  //         link.setAttribute('download', image.photo.split('/').pop()); // Set the file name based on the URL
  //         document.body.appendChild(link);
  //         link.click();

  //         // Clean up the DOM and release the blob URL
  //         document.body.removeChild(link);
  //         window.URL.revokeObjectURL(url);
  //       } catch (downloadError) {
  //         // Handle individual download errors without stopping the entire process
  //         console.error(`Error downloading image ${image.photo}:`, downloadError);
  //       }
  //     }));
  //   } catch (error) {
  //     // Log general errors related to the API request or response parsing
  //     console.error('Error downloading images:', error);
  //   }
  // };







// const downloadVideos = async () => {
//   try {
//     const response = await axios.post(
//       'https://oyster-app-b3323.ondigitalocean.app/api/get_videos_by_ids/',
//       { video_ids: cartCopy }
//     );
//     const videos = response.data;

//     const maxConcurrentDownloads = 3;
//     let currentDownloads = 0;

//     const downloadVideo = async (video: any) => {
//       try {
//         const videoResponse = await axios.get(video.video, { responseType: 'blob' });
//         const url = window.URL.createObjectURL(new Blob([videoResponse.data]));

//         const link = document.createElement('a');
//         link.href = url;
//         link.setAttribute('download', video.video.split('/').pop());
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         window.URL.revokeObjectURL(url);
//       } catch (error) {
//         console.error(`Error downloading video ${video.video}:`, error);
//       } finally {
//         currentDownloads--;
//       }
//     };

//     // Create a queue for controlled concurrency
//     const downloadQueue = async () => {
//       while (videos.length > 0 && currentDownloads < maxConcurrentDownloads) {
//         const video = videos.shift();
//         currentDownloads++;
//         await downloadVideo(video);
//       }
//     };

//     // Start initial concurrent downloads
//     const initialDownloads = Array.from({ length: maxConcurrentDownloads }, downloadQueue);
//     await Promise.all(initialDownloads);

//     console.log('All videos downloaded.');
//   } catch (error) {
//     console.error('Error downloading videos:', error);
//   }
// };



  // const downloadVideos = async () => {
  //   try {
  //     // Make a request to get video URLs for the provided video IDs
  //     const response = await axios.post('https://oyster-app-b3323.ondigitalocean.app/api/get_videos_by_ids/', { video_ids: cartCopy });
  //     const videos = response.data;
  //     console.log(videos);

  //     // Download all videos concurrently
  //     await Promise.all(videos.map(async (video: any) => {
  //       try {
  //         // Fetch the video as a blob
  //         const videoResponse = await axios.get(video.video, { responseType: 'blob' });

  //         // Create a blob URL for the video
  //         const url = window.URL.createObjectURL(new Blob([videoResponse.data]));

  //         // Create an anchor element for downloading the video
  //         const link = document.createElement('a');
  //         link.href = url;
  //         link.setAttribute('download', video.video.split('/').pop()); // Set the file name based on the URL
  //         document.body.appendChild(link);
  //         link.click();

  //         // Clean up the DOM and release the blob URL
  //         document.body.removeChild(link);
  //         window.URL.revokeObjectURL(url);
  //       } catch (downloadError) {
  //         // Handle individual download errors without stopping the entire process
  //         console.error(`Error downloading video ${video.video}:`, downloadError);
  //       }
  //     }));
  //   } catch (error) {
  //     // Log general errors related to the API request or response parsing
  //     console.error('Error downloading videos:', error);
  //   }
  // };





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
          onClick={handleDownload}
        >
          Download Again <ArrowCircleDownIcon sx={{ marginLeft: '5px' }} />
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
