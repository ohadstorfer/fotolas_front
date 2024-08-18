import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardActionArea, CardContent, CardMedia, ImageList, ImageListItem, Typography } from '@mui/material';
import { teal } from '@mui/material/colors';
import { selectNewSess } from '../slicers/sessAlbumSlice';
import { Cloudinary } from 'cloudinary-core';
import axios from 'axios';
import { AspectRatio } from '@mui/joy';

interface VideoUrl {
  original: string;
  transformed: string;
}

const UploadWidget = () => {
  const [uploadedUrls, setUploadedUrls] = useState<VideoUrl[]>([]);
  const newSess = useSelector(selectNewSess);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cloudinaryRef = useRef<any>();
  const widgetRef = useRef<any>();
  const cloudinary = new Cloudinary({ cloud_name: 'dauupwecm', secure: true });

  useEffect(() => {
    const handleUpload = async (error: any, result: any) => {
      if (result.event === 'success') {
        const videoUrl = result.info.secure_url;
        console.log('Original video URL:', videoUrl);

        // Apply watermark and compression
        const transformedUrl = cloudinary.video_url(result.info.public_id, {
          transformation: [
            { width: 1000, quality: 'auto', fetch_format: 'auto' },
            { overlay: 'nyb5atdbyazvl2ja93ow', opacity: 50, flags: 'relative', width: 2000 }
          ],
          resource_type: 'video'
        });

        setUploadedUrls((prevUrls) => [...prevUrls, { original: videoUrl, transformed: transformedUrl }]);
        console.log('Transformed video URL:', transformedUrl);

        try {
          await createVideos([{ original: videoUrl, transformed: transformedUrl }]);
          navigate('/');
        } catch (err) {
          console.error('Error creating videos:', err);
        }
      }
    };

    cloudinaryRef.current = (window as any).cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: 'dauupwecm',
        uploadPreset: 'ntncxwfx',
        resource_type: 'video'
      },
      handleUpload
    );
  }, [cloudinary, navigate]);


  const createVideos = async (videos: VideoUrl[]) => {
    try {
      console.log({
        videos,
        session_album: newSess,
      });
      const response = await axios.post('http://localhost:8000/create_videos/', {
        videos,
        session_album: newSess,
      });
      console.log(response.data.message);
    } catch (error) {
      console.error('Error creating videos:', error);
    }
  };

  return (
    <div>
      <Button onClick={() => widgetRef.current.open()} variant="contained" style={{ backgroundColor: teal[400], color: 'white' }}>
        Upload Videos
      </Button>





      <ImageList variant="masonry" cols={3} gap={8} sx={{ marginRight: '20px', marginLeft: '20px', marginBottom: '20px', marginTop: '20px' }}>
        {uploadedUrls.map((url, index) => (
          <ImageListItem key={index}>
            <Card>
              <CardActionArea>
                <AspectRatio ratio="4/3">
                  <CardMedia
                    component="video"
                    controls
                    height="200"
                    src={url.transformed} // Use the video URL from your Redux store
                  />
                </AspectRatio>
              </CardActionArea>

            </Card>
          </ImageListItem>
        ))}
      </ImageList>



    </div>
  );
};

export default UploadWidget;
