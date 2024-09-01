import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import { useAppDispatch } from '../app/hooks';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectProfilePhotographer } from '../slicers/profilePtgSlice';
import { teal } from '@mui/material/colors';
import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { TextField } from '@mui/material';
import axios from 'axios';
import pica from 'pica';
import { updatePhotographerAsync } from '../slicers/becomePhotographerSlice';

export default function EditProfilePtg() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const photographer = useSelector(selectProfilePhotographer);
  const { userId } = useParams();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(photographer?.profile_image || null);
  const [about, setAbout] = useState<string>(photographer?.about || '');

  useEffect(() => {
    if (photographer) {
      setImageUrl(photographer.profile_image || null);
      setAbout(photographer.about || '');
    }
  }, [photographer]);

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
    } finally {
      setIsLoading(false);
    }
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
    }
  };

  return (
    <Box component="form" noValidate onSubmit={submitProfile} encType="multipart/form-data"
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
          <input type="file" accept="image/*" name="image" onChange={handleImageChange} />
          <TextField
            margin="normal"
            required
            fullWidth
            name="About"
            label="About - Write something about yourself"
            type="text"
            id="About"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          />
          <Button
            type="submit"
            variant="solid"
            color="primary"
            sx={{ marginTop: 2 }}
            disabled={isLoading}
          >
            {isLoading ? 'Uploading...' : 'Update Profile'}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
