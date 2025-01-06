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
import { createPurchaseAsync, createPurchaseItemAsync, createPurchaseNewAsync, createPurchaseWithImagesAsync, createPurchaseWithVideosAsync, createPurchaseWithWavesAsync, selectEmail, selectPurchaseID, setEmail } from '../slicers/purchaseSlice';
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
import {  Checkbox, CssBaseline, Dialog, DialogActions, DialogContent, FormControl, useMediaQuery } from '@mui/material';
import EmailForPayment from './EmailForPayment';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import TermsForApprovment from './TermsForApprovment';
import CircularProgress from '@mui/material/CircularProgress';
import { store } from '../app/store';






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
  const purchaseID = useSelector(selectPurchaseID);
  const [isNewEmail, setIsNewEmail] = useState(false);


  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false); // Loading state
  const [openTerms, setOpenTerms] = React.useState(false);
  const [isChecked, setIsChecked] = React.useState(false);
  const [changeToRed, setChangeToRed] = React.useState(false);





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
    const createPurchaseIfEmailIsSet = async () => {
      if (email && isNewEmail) {
        try {
          await createPurchase2();
        } catch (error) {
          console.error("Error during purchase creation:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    createPurchaseIfEmailIsSet();
  }, [email]);



  useEffect(() => {
    if (purchaseID && isNewEmail) {
      handleCheckout()
    }
  }, [purchaseID]);





  // useEffect(() => {
  //   console.log("useEffect triggered with email:", email);
  
  //   const createPurchase = async () => {
  //     if (!email) {
  //       console.log("Email is missing, aborting...");
  //       return;
  //     }
  
  //     // const surfer_id = JSON.parse(localStorage.getItem('token') || '{}').id;
  //     // const surfer_name = JSON.parse(localStorage.getItem('token') || '{}').fullName;
  //     const surfer_id = null;
  //     const surfer_name = null;
  //     const photographer_id = sessAlbumOfCart!.photographer;
  //     const total_price = cartTotalPrice;
  //     const total_item_quantity = cartTotalItems;
  //     const session_album_id = sessAlbumOfCart!.id;
  //     const sessDate = sessAlbumOfCart!.sessDate;
  //     const spot_name = sessAlbumOfCart!.spot_name;
  //     const photographer_name = sessAlbumOfCart!.photographer_name;
  //     const type = cartType;
  //     const user_email = email.email;
  //     let filenames: string[] = [];
  
  //     try {
  //       console.log("Cart type:", cartType);
  //       console.log("Cart content:", cart);
  
  //       if (cartType === 'videos') {
  //         console.log("Fetching videos...");
  //         const videoResponse = await axios.post(
  //           'https://oyster-app-b3323.ondigitalocean.app/api/get_videos_by_ids/',
  //           { video_ids: cart }
  //         );
  //         filenames = videoResponse.data.map((video: { video: string }) => {
  //           const urlParts = video.video.split('/');
  //           return urlParts[urlParts.length - 1]; // Extract the file name from the URL
  //         });
  //         console.log("Fetched video filenames:", filenames);
  //       } else if (cartType === 'waves') {
  //         console.log("Fetching wave images...");
  //         const imagesResponse = await axios.post(
  //           'https://oyster-app-b3323.ondigitalocean.app/api/get_images_for_multiple_waves/',
  //           { waveIds: cart }
  //         );
  //         filenames = imagesResponse.data.map((image: { photo: string }) => {
  //           const urlParts = image.photo.split('/');
  //           return urlParts[urlParts.length - 1]; // Extract the file name from the URL
  //         });
  //         console.log("Fetched wave image filenames:", filenames);
  //       } else if (cartType === 'singleImages') {
  //         console.log("Fetching single images...");
  //         const imagesResponse = await axios.post(
  //           'https://oyster-app-b3323.ondigitalocean.app/api/get_images_by_ids/',
  //           { image_ids: cart }
  //         );
  //         filenames = imagesResponse.data.map((image: { photo: string }) => {
  //           const urlParts = image.photo.split('/');
  //           return urlParts[urlParts.length - 1]; // Extract the file name from the URL
  //         });
  //         console.log("Fetched single image filenames:", filenames);
  //       }
  
  //       const purchaseData = {
  //         photographer_id,
  //         surfer_id,
  //         total_price,
  //         total_item_quantity,
  //         session_album_id,
  //         sessDate,
  //         spot_name,
  //         photographer_name,
  //         surfer_name,
  //         user_email,
  //         type,
  //         filenames,
  //       };
  
  //       console.log('Creating purchase with data:', purchaseData);
  //       await dispatch(createPurchaseNewAsync(purchaseData));
  //     } catch (error) {
  //       console.error('Error creating purchase:', error);
  //     }
  //   };
  
  //   createPurchase();
  // }, [email]);




  


  const createPurchase2 = async (): Promise<void> => {
    if (!email) {
      console.log("Email is missing, aborting...");
      return;
    }
  
    const surfer_id = JSON.parse(localStorage.getItem("token") || "{}").id;
    const surfer_name = JSON.parse(localStorage.getItem("token") || "{}").fullName;
    const photographer_id = sessAlbumOfCart!.photographer;
    const total_price = cartTotalPrice;
    const total_item_quantity = cartTotalItems;
    const session_album_id = sessAlbumOfCart!.id;
    const sessDate = sessAlbumOfCart!.sessDate;
    const spot_name = sessAlbumOfCart!.spot_name;
    const photographer_name = sessAlbumOfCart!.photographer_name;
    const type = cartType;
    const user_email = email.email;
    let filenames: string[] = [];
  
    try {
      console.log("Cart type:", cartType);
      console.log("Cart content:", cart);
  
      if (cartType === "videos") {
        console.log("Fetching videos...");
        const videoResponse = await axios.post(
          "https://oyster-app-b3323.ondigitalocean.app/api/get_videos_by_ids/",
          { video_ids: cart }
        );
        filenames = videoResponse.data.map((video: { video: string }) => {
          const urlParts = video.video.split("/");
          return urlParts[urlParts.length - 1]; // Extract the file name from the URL
        });
        console.log("Fetched video filenames:", filenames);
      } else if (cartType === "waves") {
        console.log("Fetching wave images...");
        const imagesResponse = await axios.post(
          "https://oyster-app-b3323.ondigitalocean.app/api/get_images_for_multiple_waves/",
          { waveIds: cart }
        );
        filenames = imagesResponse.data.map((image: { photo: string }) => {
          const urlParts = image.photo.split("/");
          return urlParts[urlParts.length - 1]; // Extract the file name from the URL
        });
        console.log("Fetched wave image filenames:", filenames);
      } else if (cartType === "singleImages") {
        console.log("Fetching single images...");
        const imagesResponse = await axios.post(
          "https://oyster-app-b3323.ondigitalocean.app/api/get_images_by_ids/",
          { image_ids: cart }
        );
        filenames = imagesResponse.data.map((image: { photo: string }) => {
          const urlParts = image.photo.split("/");
          return urlParts[urlParts.length - 1]; // Extract the file name from the URL
        });
        console.log("Fetched single image filenames:", filenames);
      }
  
      const purchaseData = {
        photographer_id,
        surfer_id,
        total_price,
        total_item_quantity,
        session_album_id,
        sessDate,
        spot_name,
        photographer_name,
        surfer_name,
        user_email,
        type,
        filenames,
      };
  
      console.log("Creating purchase with data:", purchaseData);
      const result = await dispatch(createPurchaseNewAsync(purchaseData)).unwrap();
      console.log("Purchase created:", result);
    } catch (error) {
      console.error("Error creating purchase:", error);
      throw error; // Rethrow the error to handle it in the calling function
    }
  };
 







  const handleCheckout = async () => {
    setIsNewEmail(false);
    try {
      if (!purchaseID) {
        createPurchase2();  // Call createPurchase if there is no purchaseID
        return;  // Exit the function after the purchase is created
      }
      
      dispatch(setCopyCart());
  
      console.log("Sending request to create checkout session with the following data:", {
        purchase_id: purchaseID,
        product_name: cartType,
        amount: cartTotalPrice, // Amount in cents
        currency: "usd",
        quantity: cartTotalItems,
        connected_account_id: sessAlbumOfCart?.photographer_stripe_account_id,
      });
  
      // Send a request to your Django endpoint to create a checkout session
      const response = await fetch("https://oyster-app-b3323.ondigitalocean.app/api/create-checkout-session/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_name: cartType,
          amount: cartTotalPrice * 100, // Amount in cents, e.g., $10.00 -> 1000
          currency: "usd",
          quantity: 1,
          connected_account_id: sessAlbumOfCart?.photographer_stripe_account_id,
          purchase_id: purchaseID, // Use the updated purchaseID here
        }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        console.log("Redirecting to Stripe checkout...");
        window.location.href = result.url; // Redirect to Stripe checkout URL
      } else {
        console.error("Error creating checkout session:", result);
      }
    } catch (error) {
      console.error("Error in handleCheckout:", error);
    }
  };


  const handleNavigateHome = () => {
    navigate('/'); // Navigate to the home page
  };




  const handleCloseDialog = () => {
    setOpenDialog(false);  // Close the dialog
  };













  const validateForm = (data: FormData) => {
    const newErrors: { [key: string]: string } = {};
    const email = data.get("email") as string;
    const confirmEmail = data.get("confirmEmail") as string;

    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email address is invalid";
    if (email !== confirmEmail) newErrors.confirmEmail = "Emails must match";

    return newErrors;
  };



  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isChecked) {
      setChangeToRed(true);
      alert("Please agree to the terms and conditions before proceeding.");
      return;
    }
    const data = new FormData(event.currentTarget);
    const validationErrors = validateForm(data);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true); // Set loading to true
    const credentials = {
      email: data.get("email") as string,
    };
    try {
      dispatch (setEmail(credentials))
    } catch (error) {
      console.error('SignUp failed:', error);
    } finally {
      setIsNewEmail(true);
      setLoading(false); // Reset loading state
    }
  };

  




  const handleOpenTerms = () => setOpenTerms(true);
  const handleCloseTerms = () => setOpenTerms(false);






  const defaultTheme = createTheme({
    palette: {
      background: {
        default: '#FFEEAD', // Set the default background color
      }
    },
  });
  





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




      






      {/* {openDialog && ( */}


<Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="lg"
        PaperProps={{
          style: {
            backgroundColor: "#FFEEAD",
            width: isMobile ? '100%' : '50%',
            margin: 'auto', // centers the dialog
          }
        }}>

        <DialogContent >
          
       




      <ThemeProvider theme={defaultTheme} >
      <Container component="main" maxWidth="xs" >
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: teal[400] }}>
            <AlternateEmailIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Email
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.5 }}>
            We need it to send you your files.
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="confirmEmail"
                  label="Confirm Email Address"
                  name="confirmEmail"
                  autoComplete="email"
                  error={!!errors.confirmEmail}
                  helperText={errors.confirmEmail}
                />
              </Grid>




            </Grid>




            <Grid item xs={12}>
              <FormControl
                required
              >
                <Box
                  sx={{
                    mt: 2,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Checkbox
                    checked={isChecked}
                    onChange={(e) => setIsChecked(e.target.checked)}
                    sx={{
                      color: teal[400],
                      '&.Mui-checked': {
                        color: teal[400],
                      },
                    }}
                  />
                  <Typography
                    variant="body2"
                    color={changeToRed && !loading ? "red" : "textSecondary"}
                    onClick={handleOpenTerms}
                    sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Please read and approve our Terms and Conditions.
                  </Typography>
                </Box>
              </FormControl>
            </Grid>



            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: teal[400] }}
              disabled={loading} // Disable button when loading
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <>
                  Continue to checkout <ShoppingCartCheckoutIcon />
                </>
              )}
            </Button>
            
          </Box>
        </Box>
      </Container>
    





      





      {openTerms && (
        <Dialog
          open={openTerms}
          onClose={handleCloseTerms}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <TermsForApprovment></TermsForApprovment>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseTerms} autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      )}





    </ThemeProvider>


    </DialogContent>
    </Dialog>


{/* )} */}






    </div>
  );
};

export default Cart;
