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

const Images: React.FC = () => {
  const imgs = useSelector(selectImg);
  const dispatch = useAppDispatch();


  // useEffect(() => {
  //   dispatch(getDataAsync());
  // }, [dispatch]);


  return (
    <div>

      <ImageList variant="masonry" cols={3} gap={8} sx={{ marginRight: '20px', marginLeft: '20px', marginBottom: '20px', marginTop: '20px' }}>
        {imgs.map((img) => (
          <ImageListItem key={img.id}>
            <Card>
              <CardActionArea>
                <AspectRatio ratio="4/3">
                  <CardMedia
                    component="img"
                    height="200"
                    image={img.WatermarkedPhoto} // Use the image URL from your Redux store
                    alt={`Image ${img.id}`}
                  />
                </AspectRatio>
              </CardActionArea>
              {/* <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', bgcolor: teal[400] }}>
          <Avatar sx={{ bgcolor: teal[100] }}>
                  <span style={{ marginRight: '4px' }}></span> <IoImagesOutline />
          </Avatar>
          <Avatar sx={{ bgcolor: teal[100] }}>
                <span style={{ marginRight: '4px' }}>{Math.floor(img.price)}$</span>
          </Avatar>
          </Box> */}
            </Card>
          </ImageListItem>
        ))}
      </ImageList>
    </div>
  );
};

export default Images;
