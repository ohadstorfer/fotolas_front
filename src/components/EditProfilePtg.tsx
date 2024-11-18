import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/material/Typography';
import { useAppDispatch } from '../app/hooks';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectProfilePhotographer } from '../slicers/profilePtgSlice';
import { teal } from '@mui/material/colors';
import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { TextField, useMediaQuery } from '@mui/material';
import axios from 'axios';
import pica from 'pica';
import { fetchDefaultAlbumPricesImages, fetchDefaultAlbumPricesVideos, resetNewDefaultAlbumPricesImages, resetNewDefaultAlbumPricesVideos, resetUpdatedPhotographer, selectDefaultAlbumPricesImages, selectDefaultAlbumPricesVideos, selectNewDefaultAlbumPricesImages, selectNewDefaultAlbumPricesVideos, selectUpdatePhotographer, updateDefaultAlbumPricesForImagesAsync, updateDefaultAlbumPricesForVideosAsync, updatePhotographerAsync } from '../slicers/becomePhotographerSlice';
import { refreshNavbar } from '../slicers/signUpSlice';
import { Alert } from '@mui/joy';
import ReportIcon from '@mui/icons-material/Report';
import { fileTypeFromBuffer } from 'file-type';
import LinearProgress from '@mui/joy/LinearProgress';
import ProfilePtg from './ProfilePtg';
import { selectSpanish, toggleSpanish } from '../slicers/sighnInSlice';
import { Dialog, DialogActions, DialogContent, DialogContentText, } from '@mui/material';
import VerificationAlertsForSettings from './VerificationAlertsForSettings';



export default function EditProfilePtg() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const photographer = useSelector(selectProfilePhotographer);
  const updatePhotographer = useSelector(selectUpdatePhotographer);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(photographer?.profile_image || null);
  const [about, setAbout] = useState<string>(photographer?.about || '');
  const isMobile = useMediaQuery('(max-width:600px)');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const spanish = useSelector(selectSpanish)
  const [openMessage, setOpenMessage] = React.useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const defaultPricesImages = useSelector(selectDefaultAlbumPricesImages);
  const defaultPricesVideos = useSelector(selectDefaultAlbumPricesVideos);
  const newDefaultPricesImages = useSelector(selectNewDefaultAlbumPricesImages);
  const newDefaultPricesVideos = useSelector(selectNewDefaultAlbumPricesVideos);




  useEffect(() => {
    if (updatePhotographer == true) {
      dispatch(refreshNavbar());
      dispatch(resetUpdatedPhotographer());
      // navigate('/');
    }
  }, [updatePhotographer]);




  useEffect(() => {
    if (photographer) {
      console.log("doing itttt");
      
      dispatch(fetchDefaultAlbumPricesImages(photographer.id));
      dispatch(fetchDefaultAlbumPricesVideos(photographer.id));
      setImagePreview(photographer.profile_image || null);
      setAbout(photographer.about || '');
    }
  }, [photographer,dispatch]);



  useEffect(() => {
    if (newDefaultPricesImages != null || newDefaultPricesVideos != null) {
      console.log(newDefaultPricesImages, newDefaultPricesVideos);

      handleOpenMessage(
        spanish
          ? 'Los precios se han actualizado con éxito.'
          : 'Prices have been successfully updated.'
      );
    }
  }, [newDefaultPricesImages, newDefaultPricesVideos]);





  useEffect(() => {
    if (newDefaultPricesImages != null && photographer ) {
      dispatch(fetchDefaultAlbumPricesImages(photographer.id));
      console.log("newDefaultPricesImages");
      
    }
  }, [newDefaultPricesImages]);


  useEffect(() => {
    if (newDefaultPricesVideos != null && photographer ) {
      dispatch(fetchDefaultAlbumPricesVideos(photographer.id));
      console.log("newDefaultPricesImages");
    }
  }, [newDefaultPricesVideos]);



  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    if (e.target.files && e.target.files.length > 0) {
      if (e.target.files.length > 1) {
        setFileError(spanish ? 'Por favor, selecciona solo una imagen.' : 'Please select only one image.');
        setSelectedFile(null);
        setImagePreview(null);
        return;
      }

      const file = e.target.files[0];
      const bytesToRead = 4100; // Define the number of bytes to read from the start of the file

      // Read the first `bytesToRead` bytes of the file
      const buffer = await file.slice(0, bytesToRead).arrayBuffer();
      const type = await fileTypeFromBuffer(new Uint8Array(buffer));

      // Check if the file type is an image and either JPEG or PNG
      if (!type || (type.mime !== 'image/jpeg' && type.mime !== 'image/png')) {
        setFileError(spanish ? 'Por favor, selecciona solo imágenes JPEG o PNG.' : 'Please select only JPEG or PNG images.');
        setSelectedFile(null);
        setImagePreview(null);
      } else {
        setFileError(null);
        setSelectedFile(file);
        setImagePreview(URL.createObjectURL(file));
      }
    } else {
      setFileError(spanish ? 'No se seleccionó ningún archivo.' : 'No file selected.');
      setSelectedFile(null);
      setImagePreview(null);
    }
  };





  // const handleImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
  //   if (e.target.files && e.target.files.length > 0) {
  //     const file = e.target.files[0];
  //     setSelectedFile(file);
  //     setImagePreview(URL.createObjectURL(file));
  //   }
  // };










  const compressImage = async (file: File): Promise<File> => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
    });
  
    const targetHeight = 600;
    const aspectRatio = img.width / img.height;
    const targetWidth = Math.round(targetHeight * aspectRatio);
  
    // Create a canvas for resizing
    const compressedCanvas = document.createElement('canvas');
    compressedCanvas.width = targetWidth;
    compressedCanvas.height = targetHeight;
  
    const ctx = compressedCanvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas context not available');
    }
  
    // Draw and resize the image directly on the canvas
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
  
    return new Promise((resolve, reject) => {
      compressedCanvas.toBlob((blob) => {
        if (blob) {
          const compressedFile = new File([blob], `compressed_${file.name}`, { type: 'image/jpeg' });
          resolve(compressedFile);
        } else {
          reject(new Error('Blob creation failed'));
        }
      }, 'image/jpeg', 0.8); // JPEG quality for compression
    });
  };








  const uploadToS3 = async (file: File): Promise<string> => {
    const response = await axios.get(`https://oyster-app-b3323.ondigitalocean.app/presigned_urls_for_profile_pictures?num_urls=1`);
    const presignedUrl = response.data.urls[0];

    await axios.put(presignedUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
    });

    return presignedUrl.split('?')[0];
  };








  const submitProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let finalImageUrl = photographer!.profile_image;

      if (selectedFile) {
        const compressedFile = await compressImage(selectedFile);
        const s3Url = await uploadToS3(compressedFile);
        finalImageUrl = s3Url;
      }

      await handleSubmit(finalImageUrl || photographer!.profile_image || '');
    } catch (error) {
      console.error('Error during submission:', error);
      setUploadError(spanish ? 'La carga falló. Por favor, inténtalo de nuevo más tarde.' : 'Upload failed. Please try again later.');
      setIsLoading(false);
    }
    // finally {
    //   setIsLoading(false);
    // }
  };







  const handleSubmit = async (finalImageUrl: string) => {
    if (!photographer) {
      console.error('Photographer data is not available.');
      return;
    }

    const credentials = {
      photographerId: photographer.id,
      about: about,
      user: photographer.user,
      profile_image: finalImageUrl || photographer.profile_image,
    };

    try {
      await dispatch(updatePhotographerAsync(credentials));
    } catch (error) {
      console.error('Update failed:', error);
      setIsLoading(false);
    }
    finally {
      setIsLoading(false);
    }
  };










  const handleImagePricingSubmit = async (e: FormEvent<HTMLFormElement>) => {
    console.log("handleImagePricingSubmit");

    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (!photographer) {
      console.error('Photographer data is not available.');
      return;
    }
    const price_1_to_5_str = data.get("price_1_to_5");
    const price_6_to_50_str = data.get("price_6_to_50"); // Updated to reflect new pricing structure
    const price_51_plus_str = data.get("price_51_plus"); // Updated to reflect new pricing structure

    // Check if any field is empty or not a valid number
    if (
      !price_1_to_5_str ||
      !price_6_to_50_str ||
      !price_51_plus_str ||
      isNaN(Number(price_1_to_5_str)) ||
      isNaN(Number(price_6_to_50_str)) ||
      isNaN(Number(price_51_plus_str))
    ) {
      alert("Please add a value for all fields.");
      return;
    }

    const credentials = {
      photographer: photographer.id,
      price_1_to_5: Number(price_1_to_5_str),
      price_6_to_50: Number(price_6_to_50_str), // Updated to reflect new pricing structure
      price_51_plus: Number(price_51_plus_str), // Updated to reflect new pricing structure
    };

    // Price validation scenarios
    if (credentials.price_1_to_5 > credentials.price_6_to_50) {
      handleOpenMessage(
        spanish
          ? 'El precio para 1 a 5 imágenes es mayor que el precio para 6 a 50 imágenes. Por favor, ajusta los precios para que tengan sentido.'
          : "The price for 1 to 5 images is higher than the price for 6 to 50 images. Please adjust the prices to ensure they are logical."
      );
      return;
    }

    if (credentials.price_6_to_50 > credentials.price_51_plus) {
      handleOpenMessage(
        spanish
          ? 'El precio para 6 a 50 imágenes es mayor que el precio para 51 o más imágenes. Por favor, ajusta los precios para que tengan sentido.'
          : "The price for 6 to 50 images is higher than the price for 51 or more images. Please adjust the prices to ensure they are logical."
      );
      return;
    }

    try {
      console.log(credentials);
      await dispatch(updateDefaultAlbumPricesForImagesAsync(credentials));
    } catch (error) {
      console.error('updatePrices failed:', error);
    }
  };














  const handleVideoPricingSubmit = async (e: FormEvent<HTMLFormElement>) => {
    console.log("handleVideoPricingSubmit");

    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (!photographer) {
      console.error('Photographer data is not available.');
      return;
    }
    const price_1_to_3_str = data.get("price_1_to_3"); // Updated to reflect new pricing structure
    const price_4_to_15_str = data.get("price_4_to_15"); // Updated to reflect new pricing structure
    const price_16_plus_str = data.get("price_16_plus"); // Updated to reflect new pricing structure

    // Check if any field is empty or not a valid number
    if (
      !price_1_to_3_str ||
      !price_4_to_15_str ||
      !price_16_plus_str ||
      isNaN(Number(price_1_to_3_str)) ||
      isNaN(Number(price_4_to_15_str)) ||
      isNaN(Number(price_16_plus_str))
    ) {
      alert("Please add a value for all fields.");
      return;
    }

    const credentials = {
      photographer: photographer.id,
      price_1_to_3: Number(price_1_to_3_str), // Updated to reflect new pricing structure
      price_4_to_15: Number(price_4_to_15_str), // Updated to reflect new pricing structure
      price_16_plus: Number(price_16_plus_str), // Updated to reflect new pricing structure
    };

    // Price validation scenarios
    if (credentials.price_1_to_3 > credentials.price_4_to_15) {
      handleOpenMessage(
        spanish
          ? 'El precio para 1 a 3 videos es mayor que el precio para 4 a 15 videos. Por favor, ajusta los precios para que tengan sentido.'
          : "The price for 1 to 3 videos is higher than the price for 4 to 15 videos. Please adjust the prices to ensure they are logical."
      );
      return;
    }

    if (credentials.price_4_to_15 > credentials.price_16_plus) {
      handleOpenMessage(
        spanish
          ? 'El precio para 4 a 15 videos es mayor que el precio para 16 o más videos. Por favor, ajusta los precios para que tengan sentido.'
          : "The price for 4 to 15 videos is higher than the price for 16 or more videos. Please adjust the prices to ensure they are logical."
      );
      return;
    }

    if (credentials.price_1_to_3 > credentials.price_16_plus) {
      handleOpenMessage(
        spanish
          ? 'El precio para 1 a 3 videos es mayor que el precio para 16 o más videos. Por favor, ajusta los precios para que tengan sentido.'
          : "The price for 1 to 3 videos is higher than the price for 16 or more videos. Please adjust the prices to ensure they are logical."
      );
      return;
    }

    try {
      console.log(credentials);
      await dispatch(updateDefaultAlbumPricesForVideosAsync(credentials));
    } catch (error) {
      console.error('updatePrices failed:', error);
    }
  };












  const handleSubmit2 = () => {
  };



  const handleOpenMessage = (msg: string) => {
    setMessage(msg);
    setOpenMessage(true);
  };

  const handleCloseMessage = () => {
    setOpenMessage(false);
    dispatch(resetNewDefaultAlbumPricesImages())
    dispatch(resetNewDefaultAlbumPricesVideos())
  };




  const setSpanish = () => {
    dispatch(toggleSpanish());
  };






  return (
    <div>
      {/* <ProfilePtg></ProfilePtg> */}





      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            marginBottom: '15px',
          }}
        >
          <Typography>Change Language:</Typography>

          <Button
            variant="outlined"
            onClick={() => setSpanish()}
            disabled={!spanish}
            sx={{
              backgroundColor: !spanish ? teal[400] : 'inherit',  // Set teal if English is selected
              color: !spanish ? 'white' : 'inherit',  // White text when English is selected
              '&:disabled': {
                backgroundColor: teal[400],  // Teal background when disabled
                color: 'white',
              },
            }}
          >
            English
          </Button>

          <Button
            variant="outlined"
            onClick={() => setSpanish()}
            disabled={spanish}
            sx={{
              backgroundColor: spanish ? teal[400] : 'inherit',  // Set teal if Spanish is selected
              color: spanish ? 'white' : 'inherit',  // White text when Spanish is selected
              '&:disabled': {
                backgroundColor: teal[400],  // Teal background when disabled
                color: 'white',
              },
            }}
          >
            Español
          </Button>
        </Box>
      </Box>







      {!isLoading  && (
        <Box component="form" noValidate onSubmit={submitProfile} encType="multipart/form-data"
          sx={{
            width: isMobile ? '90%' : '50%',  // Width changes based on device
            margin: '0 auto',
            marginTop: '16px',
            display: 'flex',  // Use flexbox to center content
            justifyContent: 'center',  // Center horizontally
          }}
        >
          <Card
            orientation="horizontal"
            sx={{
              width: '100%',
              flexWrap: 'wrap',
              borderRadius: '16px',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
            }}
          >
            <AspectRatio flex ratio="1" maxHeight={182} sx={{ minWidth: 182 }}>
              {imagePreview && (<img src={imagePreview} alt={spanish ? 'Sube una foto de perfil' : 'Upload a profile picture'} />)}
            </AspectRatio>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', mb: 0 }}>
                <Button
                  component="label"
                  sx={{
                    backgroundColor: 'white',  // Custom background color
                    fontSize: '1.1rem',
                    color: teal[400]  ,             // Text color
                    padding: '10px 20px',        // Padding for button size
                    borderRadius: '8px',         // Rounded corners
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: teal[400], color: 'white'  , }  // Hover effect
                  }}
                >
                  {spanish ? 'Sube una foto de perfil' : 'Upload a profile picture'}
                  <input
                    type="file"
                    accept="image/*"
                    name="image"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}  // Hide the actual input
                  />
                </Button>
              </Box>

              {/* <input type="file" accept="image/*" name="image" onChange={handleImageChange} /> */}


              <TextField
                margin="normal"
                required
                fullWidth
                name="About"
                label={spanish ? "Escribe algo sobre ti" : "Write something about yourself"}
                type="text"
                id="About"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
              />


              <Button
                type="submit"
                style={{ backgroundColor: teal[400], color: 'white' }}
                sx={{ marginTop: 2 }}
                disabled={isLoading}
              >
                {isLoading ? (spanish ? 'Subiendo...' : 'Uploading...') : (spanish ? 'Actualizar Perfil' : 'Update Profile')}
              </Button>
            </CardContent>
          </Card>
        </Box>
      )}



      {fileError && (
        <Alert
          variant="outlined"
          color="danger"
          startDecorator={<ReportIcon />}
          sx={{
            maxWidth: isMobile ? '90%' : '420px',
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <Typography>{fileError}</Typography>
        </Alert>
      )}
      {uploadError && (
        <Alert
          variant="outlined"
          color="danger"
          startDecorator={<ReportIcon />}
          sx={{
            maxWidth: isMobile ? '90%' : '420px',
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <Typography>{uploadError}</Typography>
        </Alert>
      )}



      {isLoading &&
        <Alert
          variant="soft"
          color="success"
          invertedColors

          sx={{
            maxWidth: isMobile ? '90%' : '400px',
            margin: '0 auto', // Center horizontally
            textAlign: 'center',
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: '25px' }}>
              {spanish ? 'Subiendo...' : 'Uploading...'}
            </Typography>
          </Box>
          <LinearProgress
            variant="solid"
            color="success"
            value={40}
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              borderRadius: 0,
            }}
          />
        </Alert>
      }




 {defaultPricesImages && defaultPricesVideos &&
      <><Box
          sx={{
            width: isMobile ? '90%' : '50%',
            margin: '0 auto',
            marginTop: '16px',
            display: 'flex', // Use flexbox for layout
            flexDirection: isMobile ? 'column' : 'row', // Stack items vertically on mobile
            justifyContent: isMobile ? 'center' : 'space-between', // Adjust alignment
            gap: 2, // Spacing between the forms
          }}
        >

          {/* Image Pricing Form */}
          <Box component="form" noValidate onSubmit={handleImagePricingSubmit} encType="multipart/form-data"
            sx={{
              flex: 1,
              display: 'flex',
              backgroundColor: '#FFEEAD',
              borderRadius: '16px',
              border: '1px solid rgba(0, 0, 0, 0.5)',
              boxSizing: 'border-box',
            }}
          >
            <Card
              sx={{
                width: '100%',
                flexWrap: 'wrap',
                boxSizing: 'border-box',
                backgroundColor: '#FFEEAD',
                borderRadius: '16px',
              }}
            >
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {spanish ? 'Precios Predeterminados de Imágenes' : 'Default Images Prices'}
              </Typography>

              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body1" sx={{ width: '100%', mr: 1 }}>
                    {spanish ? '1 a 5 imágenes' : '1 to 5 images'}
                  </Typography>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="price_1_to_5"
                    type="number"
                    id="price_1_to_5"
                    defaultValue={defaultPricesImages?.[0]?.price_1_to_5 || ''}
                    inputProps={{
                      style: { textAlign: 'center' }
                    }} />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body1" sx={{ width: '100%', mr: 1 }}>
                    {spanish ? '6 a 50 imágenes' : '6 to 50 images'}
                  </Typography>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="price_6_to_50"
                    type="number"
                    id="price_6_to_50"
                    defaultValue={defaultPricesImages?.[0]?.price_6_to_50 || ''}
                    inputProps={{
                      style: { textAlign: 'center' }
                    }} />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body1" sx={{ width: '100%', mr: 1 }}>
                    {spanish ? 'más de 50 imágenes' : 'more than 50 images'}
                  </Typography>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="price_51_plus"
                    type="number"
                    id="price_51_plus"
                    defaultValue={defaultPricesImages?.[0]?.price_51_plus || ''}
                    inputProps={{
                      style: { textAlign: 'center' }
                    }} />
                </Box>

                <Box sx={{ display: 'flex', p: 1.5, my: 3, gap: 1.5, '& > button': { flex: 1 } }}>
                  <Button type="submit" fullWidth sx={{ backgroundColor: teal[400], color: 'white' }}>
                    {spanish ? 'Confirmar' : 'Confirm'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Video Pricing Form */}
          <Box component="form" noValidate onSubmit={handleVideoPricingSubmit} encType="multipart/form-data"
            sx={{
              flex: 1,
              display: 'flex',
              backgroundColor: '#FFEEAD',
              borderRadius: '16px',
              border: '1px solid rgba(0, 0, 0, 0.5)',
              boxSizing: 'border-box',
            }}
          >
            <Card
              sx={{
                width: '100%',
                flexWrap: 'wrap',
                boxSizing: 'border-box',
                backgroundColor: '#FFEEAD',
                borderRadius: '16px',
              }}
            >
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {spanish ? 'Precios Predeterminados de videos' : 'Default Videos Prices'}
              </Typography>

              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body1" sx={{ width: '100%', mr: 1 }}>
                    {spanish ? '1 a 3 videos' : '1 to 3 videos'}
                  </Typography>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="price_1_to_3"
                    type="number"
                    id="price_1_to_3"
                    defaultValue={defaultPricesVideos?.[0]?.price_1_to_3 || ''}
                    inputProps={{
                      style: { textAlign: 'center' }
                    }} />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body1" sx={{ width: '100%', mr: 1 }}>
                    {spanish ? '4 a 15 videos' : '4 to 15 videos'}
                  </Typography>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="price_4_to_15"
                    type="number"
                    id="price_4_to_15"
                    defaultValue={defaultPricesVideos?.[0]?.price_4_to_15 || ''}
                    inputProps={{
                      style: { textAlign: 'center' }
                    }} />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body1" sx={{ width: '100%', mr: 1 }}>
                    {spanish ? 'más de 15 videos' : 'more than 15 videos'}
                  </Typography>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="price_16_plus"
                    type="number"
                    id="price_16_plus"
                    defaultValue={defaultPricesVideos?.[0]?.price_16_plus || ''}
                    inputProps={{
                      style: { textAlign: 'center' }
                    }} />
                </Box>

                <Box sx={{ display: 'flex', p: 1.5, my: 3, gap: 1.5, '& > button': { flex: 1 } }}>
                  <Button type="submit" fullWidth sx={{ backgroundColor: teal[400], color: 'white' }}>
                    {spanish ? 'Confirmar' : 'Confirm'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>

        </Box>
        <VerificationAlertsForSettings></VerificationAlertsForSettings></>
                }

      {openMessage && (
        <Dialog
          open={openMessage}
          onClose={handleCloseMessage}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {message} {/* Display the message from state */}
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
}

