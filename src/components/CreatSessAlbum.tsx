import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import { useAppDispatch } from '../app/hooks';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getPhotographerById, selectPhotographer } from '../slicers/photographerSlice';
import { teal } from '@mui/material/colors';
import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import SessAlbum from './SessAlbum';
import { createSessAlbumAsync, removeNewPrices, removeNewSess, selectNewSess, selectVideos, sessGetDataAsync } from '../slicers/sessAlbumSlice';
import { getPhotographerByUserId, selectProfilePhotographer } from '../slicers/profilePtgSlice';
import { TextField } from '@mui/material';
import UploadButton from './UpdButton';
import { loginAsync, selectLoggedIn, selectToken } from '../slicers/sighnInSlice';
import { becomePhotographerAsync } from '../slicers/becomePhotographerSlice';
import UploadWidget from './UploadWidget';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import CreateSpot from './CreateSpot'; // Import CreateSpot component
import { getAllSpots, selectAllSpots, selectNewSpot, selectSpot } from '../slicers/spotSlice';
import Autocomplete from '@mui/material/Autocomplete';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import axios from 'axios';
import pica from 'pica';
import { selectUser } from '../slicers/userSlice';
import Stepper from '@mui/joy/Stepper';
import Step from '@mui/joy/Step';
import StepIndicator from '@mui/joy/StepIndicator';

const picaInstance = pica();

const compressImage = async (file: File): Promise<File> => {
  const img = new Image();
  img.src = URL.createObjectURL(file);
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = reject;
  });

  const targetWidth = 800;
  const targetHeight = 533;

  const offscreenCanvas = document.createElement('canvas');
  offscreenCanvas.width = img.width;
  offscreenCanvas.height = img.height;

  const ctx = offscreenCanvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas context not available');
  }

  ctx.drawImage(img, 0, 0, offscreenCanvas.width, offscreenCanvas.height);

  const compressedCanvas = document.createElement('canvas');
  compressedCanvas.width = targetWidth;
  compressedCanvas.height = targetHeight;

  await picaInstance.resize(offscreenCanvas, compressedCanvas, {
    quality: 3, // Lower the quality for harder compression
    unsharpAmount: 0,
    unsharpRadius: 0,
    unsharpThreshold: 0,
  });

  return new Promise((resolve, reject) => {
    compressedCanvas.toBlob((blob) => {
      if (blob) {
        const compressedFile = new File([blob], `compressed_${file.name}`, { type: 'image/jpeg' });
        resolve(compressedFile);
      } else {
        reject(new Error('Blob creation failed'));
      }
    }, 'image/jpeg', 0.8); // Set JPEG quality to 0.8 for compression
  });
};








const uploadOriginalFilesToS3 = async (file: File, retryCount = 3) => {
  try {
    const response = await axios.get(`https://9km-curious-mach.circumeo-apps.net/presigned_urls_for_watermarked?num_urls=1`);
    const presignedUrl = response.data.urls[0];

    for (let attempt = 0; attempt < retryCount; attempt++) {
      try {
        await axios.put(presignedUrl, file, {
          headers: {
            'Content-Type': file.type,
          },
        });
        return presignedUrl.split('?')[0];
      } catch (err) {
        if (attempt < retryCount - 1) {
          console.warn(`Retrying upload for ${file.name}, attempt ${attempt + 1}`);
        } else {
          throw err;
        }
      }
    }
  } catch (error) {
    console.error('Error uploading file to S3:', error);
  }
};








export default function UserCard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const conectedUser = useSelector(selectToken)
  const user = useSelector(selectUser)
  const isLoggedIn = useSelector(selectLoggedIn)
  const photographer = useSelector(selectProfilePhotographer);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [imageUrl, setimageUrl] = useState<string | null>(null);
  const [showCreateSpot, setShowCreateSpot] = useState(false);
  const newSpot = useSelector(selectNewSpot);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const newSess = useSelector(selectNewSess);
  const allSpots = useSelector(selectAllSpots);
  const [selectedSpot, setSelectedSpot] = useState<any | null>(null);
  const videos = useSelector(selectVideos);
  const [value, setValue] = React.useState<string | number>('');
  const [open, setOpen] = React.useState(false);

  

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = ''; // This line triggers the browser's default warning dialog
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload); // Clean up
    };
  }, [dispatch]);






  const handleChange = (event: SelectChangeEvent<typeof value>) => {
    setValue(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };




  useEffect(() => {
    if (!allSpots.length) {
      console.log(allSpots);
      dispatch(getAllSpots());
    }
  }, [dispatch, allSpots.length]);




  useEffect(() => {
    if (newSpot) {
      setSelectedSpot(newSpot);
      dispatch(getAllSpots());
    }
  }, [newSpot, dispatch]);




  useEffect(() => {
    if (newSess) {
      if (videos) {
        // Navigate to the video pricing page after creating a session album with videos
        navigate('/CreatePricesForVideos');
      } else {
        // Navigate to the image pricing page
        navigate('/CreatePrices');
      }
    }
  }, [newSess, videos, navigate]);




  useEffect(() => {
    if (imageUrl) {
      handleSubmit();
    }
  }, [imageUrl]);





  





  const uploadImage = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);

    if (!selectedDate || !selectedSpot) {
      console.error('Please select a date and a spot.');
      alert('Please select a date and a spot.');
      setIsLoading(false);
      return;
    }

    try {
      let imageUrl;
      if (selectedFile && (selectedFile.type === 'image/png' || selectedFile.type === 'image/jpg' || selectedFile.type === 'image/jpeg')) {
        const compressedFile = await compressImage(selectedFile);
        imageUrl = await uploadOriginalFilesToS3(compressedFile);
      }
      if (!selectedFile) {
        console.error('Please upload a cover image for your album.');
        alert('Please upload a cover image for your album.');
      }
      setimageUrl(imageUrl);
      console.log('imageUrl: ', imageUrl);
      // handleSubmit();

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };






  const handleSubmit222222 = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    console.log(data);
    await uploadImage(e as any);
  };

  



  const handleSubmit = async () => {

    if (!value) {
      console.error('Please select either Images or Videos.');
      alert('Please select either Images or Videos.');
      return;
    }
    if (!imageUrl) {
      console.error('Please upload a cover image for your album.');
      alert('Please upload a cover image for your album.');
      return;
    }
    if (!selectedDate || !selectedSpot) {
      console.error('Please select a date and a spot.');
      alert('Please select a date and a spot.');
      return;
    }


    const formattedDate = selectedDate?.toJSON();
    const credentials = {
      sessDate: new Date(formattedDate),
      spot: Number(selectedSpot.id),
      photographer: Number(photographer?.id),
      cover_image: String(imageUrl),
      videos: value === 20, // Set videos to true if value is 20 (Videos)
    };
    try {
      console.log(credentials);
      await dispatch(createSessAlbumAsync(credentials));
    } catch (error) {
      console.error('Error creating sess album:', error);
    }
  };

  const handleAddSpotClick = () => {
    setShowCreateSpot(true);
  };




  const handleCancelUpload = () => {
    // dispatch(removeNewSess());
    // dispatch(removeNewPrices());
    navigate('/');
  };


  return (
    <>


      <Stepper sx={{ width: '100%' }}>
        <Step
          orientation="vertical"
          indicator={<StepIndicator variant="solid" sx={{ backgroundColor: teal[400], color: 'white' }}>1</StepIndicator>}
        >
          Add Session Details
        </Step>
        <Step
          orientation="vertical"
          indicator={<StepIndicator variant="outlined">2</StepIndicator>}
        >
          Set Prices
        </Step>
        <Step orientation="vertical" indicator={<StepIndicator variant="outlined">3</StepIndicator>}>
          Upload Images / Videos
        </Step>
        <Step orientation="vertical" indicator={<StepIndicator variant="outlined">4</StepIndicator>}>
          Done!
        </Step>
      </Stepper>



      <div>
        <FormControl sx={{ m: 1, minWidth: 200 }}>
          <InputLabel id="demo-controlled-open-select-label">Images or Videos</InputLabel>
          <Select
            labelId="demo-controlled-open-select-label"
            id="demo-controlled-open-select"
            open={open}
            onClose={handleClose}
            onOpen={handleOpen}
            value={value}
            label="Value"
            onChange={handleChange}
          >
            <MenuItem value={10}>Images</MenuItem>
            <MenuItem value={20}>Videos</MenuItem>
          </Select>
        </FormControl>
      </div>

      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit222222}
        encType="multipart/form-data"
        sx={{
          width: '50%',
          margin: 'auto',
          marginTop: '16px',
        }}
      >
        <Card
          orientation="horizontal"
          sx={{
            width: '100%',
            flexWrap: 'wrap',
            [`& > *`]: {
              '--stack-point': '500px',
              minWidth: 'clamp(0px, (calc(var(--stack-point) - 2 * var(--Card-padding) - 2 * var(--variant-borderWidth, 0px)) + 1px - 100%) * 999, 100%)',
            },
            borderRadius: '16px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
          }}
        >
          <AspectRatio flex ratio="1" maxHeight={182} sx={{ minWidth: 182 }}>
            {imagePreview && <img src={imagePreview} alt="profileImg" />}
          </AspectRatio>
          <CardContent>
            <input type="file" accept="image/png,image/jpeg" name="image" onChange={handleImageChange} />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                value={selectedDate}
                onChange={(newDate) => setSelectedDate(newDate)}
              />
            </LocalizationProvider>

            <Box sx={{ display: 'flex', p: 1.5, gap: 1.5, '& > button': { flex: 1 } }}>
              <Autocomplete
                disablePortal
                onChange={(event, newValue) => setSelectedSpot(newValue)}
                id="combo-box-demo"
                options={allSpots}
                getOptionLabel={(spot) => spot.name} // Specify how to get the label from each spot object
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Spot" />}
                value={selectedSpot}
              />
              <Button
                type="button"
                onClick={handleAddSpotClick}
                sx={{ backgroundColor: teal[400], color: 'white' }}
              >
                Add a spot
              </Button>
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5, '& > button': { flex: 1 } }}>
              <Button size="md" color="danger" onClick={handleCancelUpload}>
                Cancle
              </Button>
              <Button disabled={isLoading} type="submit" fullWidth sx={{ backgroundColor: teal[400], color: 'white' }}>
                {isLoading ? 'Uploading...' : 'Continue'}
              </Button>
            </Box>


          </CardContent>
        </Card>
      </Box>

      {/* Render CreateSpot conditionally */}
      {showCreateSpot && <CreateSpot />}
    </>
  );
}
