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
import { sessGetDataAsync } from '../slicers/sessAlbumSlice';
import { getPhotographerByUserId, selectProfilePhotographer } from '../slicers/profilePtgSlice';
import { TextField } from '@mui/material';
import UploadButton from './UpdButton';
import { loginAsync } from '../slicers/sighnInSlice';
import { becomePhotographerAsync, selectBecomePhotographer } from '../slicers/becomePhotographerSlice';
import { selectUser } from '../slicers/userSlice';
import axios from 'axios';
import pica from 'pica';

export default function UserCard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const photographer = useSelector(selectProfilePhotographer);
  const newPhotographer = useSelector(selectBecomePhotographer);
  const { userId } = useParams();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [about, setAbout] = useState<string | null>(null);

  useEffect(() => {
    if (about) {
      handleSubmit();
    }
  }, [imageUrl]);

  useEffect(() => {
    if (newPhotographer === true) {
      navigate('/');
    }
  }, [newPhotographer]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const compressImage = async (file: File): Promise<File> => {
    const picaInstance = pica();
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
      quality: 3,
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
      }, 'image/jpeg', 0.8);
    });
  };

  const uploadToS3 = async (file: File): Promise<string> => {
    const response = await axios.get(`http://localhost:8000/presigned_urls_for_watermarked?num_urls=1`);
    const presignedUrl = response.data.urls[0];

    await axios.put(presignedUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
    });

    return presignedUrl.split('?')[0];
  };

  const uploadImage = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (selectedFile) {
        const compressedFile = await compressImage(selectedFile);
        const s3Url = await uploadToS3(compressedFile);
        setImageUrl(s3Url);
        setImagePreview(null);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    const credentials = {
      about: String(about),
      user: Number(userId),
      profile_image: String(imageUrl),
    };

    try {
      console.log(credentials);
      await dispatch(becomePhotographerAsync(credentials));
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleSubmitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setAbout(data.get("About") as string);
    await uploadImage(e as any);
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmitForm} encType="multipart/form-data"
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
          {imagePreview && (<img src={imagePreview} alt='profileImg' />)}
        </AspectRatio>
        <CardContent>
          <input type="file" accept="image/png,image/jpeg" name="image" onChange={handleImageChange} />
          <TextField
            margin="normal"
            required
            fullWidth
            name="About"
            label="About - Write something about yourself"
            type="About"
            id="About"
            autoComplete="current-About"
          />
          <Box sx={{ display: 'flex', p: 1.5, my: 3, gap: 1.5, '& > button': { flex: 1 } }}>
            <Button variant="solid" style={{ backgroundColor: teal[400], color: 'white' }}>
              Cancel
            </Button>
            <Button type="submit" fullWidth sx={{ backgroundColor: teal[400], color: 'white' }}>
              Submit
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
