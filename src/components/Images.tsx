import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { personalGetDataAsync, selectImg } from '../slicers/ImagesSlice';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { useAppDispatch } from '../app/hooks';
import { Avatar, Box, Grid, ImageList, ImageListItem } from '@mui/material';
import { teal } from '@mui/material/colors';
import { IoImagesOutline } from 'react-icons/io5';
import { AspectRatio } from '@mui/joy';

const PerAlbum: React.FC = () => {
  const imgs = useSelector(selectImg);
  const dispatch = useAppDispatch();
  
  
  // useEffect(() => {
  //   dispatch(getDataAsync());
  // }, [dispatch]);


  return (
    <div>
      <h2>Images</h2>
      <ImageList variant="masonry" cols={3} gap={8} sx={{marginRight: '20px', marginLeft: '20px',marginBottom: '20px', marginTop:'20px'}}>
      {imgs.map((img) => (
        <ImageListItem key={img.id}>
        <Card key={img.id} sx={{
                '&:hover': {
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 1)',
                  '&:hover, &:focus-within': {
                    opacity: 1,
                    transition: 'opacity 0.4s ease-out',
                  },
                  opacity: 0,
                  transition: '0.4s ease-in',
                  marginRight: '8px',
                  marginLeft: '8px',
                  background:
                    'linear-gradient(180deg, transparent 62%, rgba(0,0,0,0.00345888) 63.94%, rgba(0,0,0,0.014204) 65.89%, rgba(0,0,0,0.0326639) 67.83%, rgba(0,0,0,0.0589645) 69.78%, rgba(0,0,0,0.0927099) 71.72%, rgba(0,0,0,0.132754) 73.67%, rgba(0,0,0,0.177076) 75.61%, rgba(0,0,0,0.222924) 77.56%, rgba(0,0,0,0.267246) 79.5%, rgba(0,0,0,0.30729) 81.44%, rgba(0,0,0,0.341035) 83.39%, rgba(0,0,0,0.367336) 85.33%, rgba(0,0,0,0.385796) 87.28%, rgba(0,0,0,0.396541) 89.22%, rgba(0,0,0,0.4) 91.17%)',
                },
              }}>
          <CardActionArea>
          <AspectRatio ratio="4/3">
            <CardMedia
              component="img"
              height="200"
              image={img.photo} // Use the image URL from your Redux store
              alt={`Image ${img.id}`}
            />
            </AspectRatio>
          </CardActionArea>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', bgcolor: teal[400] }}>
          <Avatar sx={{ bgcolor: teal[100] }}>
                  <span style={{ marginRight: '4px' }}></span> <IoImagesOutline />
          </Avatar>
          <Avatar sx={{ bgcolor: teal[100] }}>
                <span style={{ marginRight: '4px' }}>{Math.floor(img.price)}$</span>
          </Avatar>
          </Box>
        </Card>
        </ImageListItem>
      ))}
      </ImageList>
    </div>
  );
};

export default PerAlbum;
