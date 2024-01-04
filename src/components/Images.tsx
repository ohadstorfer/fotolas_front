import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { personalGetDataAsync, selectImg } from '../slicers/ImagesSlice';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { useAppDispatch } from '../app/hooks';
import { Grid, ImageList, ImageListItem } from '@mui/material';

const PerAlbum: React.FC = () => {
  const imgs = useSelector(selectImg);
  const dispatch = useAppDispatch();
  
  
  // useEffect(() => {
  //   dispatch(getDataAsync());
  // }, [dispatch]);


  return (
    <div>
      <h2>Images</h2>
      <ImageList variant="masonry" cols={3} gap={8}>
      {imgs.map((img) => (
        <ImageListItem key={img.id}>
        <Card key={img.id} sx={{
                '&:hover': {
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  '&:hover, &:focus-within': {
                    opacity: 1,
                  },
                  opacity: 0,
                  transition: '0.1s ease-in',
                  background:
                    'linear-gradient(180deg, transparent 62%, rgba(0,0,0,0.00345888) 63.94%, rgba(0,0,0,0.014204) 65.89%, rgba(0,0,0,0.0326639) 67.83%, rgba(0,0,0,0.0589645) 69.78%, rgba(0,0,0,0.0927099) 71.72%, rgba(0,0,0,0.132754) 73.67%, rgba(0,0,0,0.177076) 75.61%, rgba(0,0,0,0.222924) 77.56%, rgba(0,0,0,0.267246) 79.5%, rgba(0,0,0,0.30729) 81.44%, rgba(0,0,0,0.341035) 83.39%, rgba(0,0,0,0.367336) 85.33%, rgba(0,0,0,0.385796) 87.28%, rgba(0,0,0,0.396541) 89.22%, rgba(0,0,0,0.4) 91.17%)',
                },
              }}>
          <CardActionArea>
            <CardMedia
              component="img"
              height="200"
              image={img.photo} // Use the image URL from your Redux store
              alt={`Image ${img.id}`}
            />
          </CardActionArea>
        </Card>
        </ImageListItem>
      ))}
      </ImageList>
    </div>
  );
};

export default PerAlbum;
