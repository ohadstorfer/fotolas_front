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
import { createSessAlbumAsync, selectNewSess, sessGetDataAsync } from '../slicers/sessAlbumSlice';
import { getPhotographerByUserId, selectProfilePhotographer } from '../slicers/profilePtgSlice';
import { TextField } from '@mui/material';
import UploadButton from './UpdButton';
import { loginAsync } from '../slicers/sighnInSlice';
import { becomePhotographerAsync } from '../slicers/becomePhotographerSlice';
import UploadWidget from './UploadWidget';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import CreateSpot from './CreateSpot'; // Import CreateSpot component
import { selectNewSpot, selectSpot } from '../slicers/spotSlice';

export default function UserCard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const photographer = useSelector(selectProfilePhotographer);
  const { userId } = useParams();
  const [loading, setLoading] = useState(true);
  const [isEditable, setIsEditable] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setimageUrl] = useState<string | null>(null);
  const [about, setabout] = useState<string | null>(null);
  const [showCreateSpot, setShowCreateSpot] = useState(false); // State to control rendering CreateSpot
  const newSpot = useSelector(selectNewSpot);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const newSess = useSelector(selectNewSess);
  const [isSpotAdded, setSpotAdded] = useState(false); // State to control the content

  useEffect(() => {
      if(newSpot){setSpotAdded(true);}
  }, [newSpot]);


  useEffect(() => {
    console.log('newSess:', newSess);
    if(newSess){navigate('/CreatePrices');}
    
 }, [newSess]);

  useEffect(() => {
    handleSubmit();
  }, [imageUrl]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageUrl;
      if (selectedFile && (selectedFile.type === 'image/png' || selectedFile.type === 'image/jpg' || selectedFile.type === 'image/jpeg')) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('cloud_name', 'dauupwecm');
        formData.append('upload_preset', 'ntncxwfx');

        const response = await fetch('http://api.cloudinary.com/v1_1/dauupwecm/image/upload', { method: 'post', body: formData });
        const imgData = await response.json();
        imageUrl = imgData.url.toString();
        setImagePreview(null);
      }
      setimageUrl(imageUrl);
      console.log('imageUrl: ', imageUrl);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };




  const handleSubmit222222 = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    console.log(data);
    setabout(data.get('About') as string);
    console.log(about);
    await uploadImage(e as any);
  };




  const handleSubmit = async () => {
    if (!selectedDate) {
      console.error('Please select a date.');
      return;
    }
    
    const formattedDate = selectedDate?.toJSON();
  const credentials = {
    sessDate: new Date(formattedDate),
    spot: Number(newSpot?.id),
    photographer: Number(photographer?.id),
    cover_image: String(imageUrl),
  };
    try {
      console.log(credentials);
      await dispatch(createSessAlbumAsync(credentials));
      // navigate('/');
    } catch (error) {
      console.error('Error creating sess album:', error);
    }
  };


  



  const handleAddSpotClick = () => {
    setShowCreateSpot(true);
  };




  return (
    <>
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
            {!isSpotAdded ?(
            <Box sx={{ display: 'flex', p: 1.5, gap: 1.5, '& > button': { flex: 1 } }}>
              <TextField
                required
                name="About"
                label="Spot"
                type="About"
                id="About"
                autoComplete="current-About"
              />
              <Button
                type="button"
                onClick={handleAddSpotClick}
                sx={{ backgroundColor: teal[400], color: 'white' }}
              >
                Add a spot
              </Button>
            </Box>
            ):(

            <Box sx={{ display: 'flex', my: 3, gap: 1.5, '& > button': { flex: 1 } }}>
              <Button type="submit" fullWidth sx={{ backgroundColor: teal[400], color: 'white' }}>
                Submit
              </Button>
            </Box>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Render CreateSpot conditionally */}
      {showCreateSpot && <CreateSpot />}
    </>
  );
}
