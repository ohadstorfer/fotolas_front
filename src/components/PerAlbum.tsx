// ImageList.tsx for Session Album
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getDataAsync, selectPersonalAlbum } from '../slicers/perAlbumSlice';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import { useAppDispatch } from '../app/hooks';
import { personalGetDataAsync } from '../slicers/ImagesSlice';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import { calculateTimeAgo, selectSessAlbums, sessGetDataAsync } from '../slicers/sessAlbumSlice';
import { AspectRatio, Link } from '@mui/joy';
import { IoImagesOutline } from "react-icons/io5";
import Avatar from '@mui/joy/Avatar';
import { lightBlue, teal } from '@mui/material/colors';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { TiLocation } from 'react-icons/ti';
import { useNavigate  } from 'react-router-dom';


const PerAlbum: React.FC = () => {
  const personalAlbums = useSelector(selectPersonalAlbum);
  const sessAlbum = useSelector(selectSessAlbums);
  const dispatch = useAppDispatch();
  const navigate  = useNavigate();

  // useEffect(() => {
  //   dispatch(getDataAsync());
  // }, [dispatch]);

  const handleCardClick = (albumId: number) => {
    dispatch(personalGetDataAsync(albumId));
    navigate('/Images');
  };

  return (
    <div>
      <h2>Personal Albums</h2>

      <ImageList variant="masonry" cols={3} gap={8} sx={{marginRight: '20px', marginLeft: '20px',marginBottom: '20px', marginTop:'20px'}}>
        {personalAlbums.map((personalAlbum) => (
          <ImageListItem key={personalAlbum.id}>
            <Card
              sx={{
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
              }}
            >
              <CardActionArea onClick={() => handleCardClick(personalAlbum.id)}>
                <AspectRatio ratio="4/3">
                  <CardMedia

                    component="img"
                    height="200"
                    image={personalAlbum.cover_image}
                    alt={`Image ${personalAlbum.id}`}
                  />
                </AspectRatio>
              </CardActionArea>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', bgcolor: teal[400] }}>

                <Avatar sx={{ bgcolor: teal[100] }}>
                  <span style={{ marginRight: '4px' }}>{personalAlbum.image_count}</span> <IoImagesOutline />
                </Avatar>


                {/* <Typography sx={{ fontSize: 'sm', fontWeight: 'md', marginLeft: 'auto', marginRight: 'auto+70' }}>
                  {calculateTimeAgo(new Date(sessAlbum[personalAlbum.session_album - 1].sessDate))}
                </Typography> */}


                <Link
                  sx={{
                    fontSize: 'sm',
                    fontWeight: 'md',
                    color: 'black',
                    marginLeft: 'auto',
                    marginRight: '8px',
                  }}
                >

                  {/* <TiLocation />
                  {sessAlbum[personalAlbum.session_album - 1].spot_name} */}
                </Link>

              </Box>
            </Card>
          </ImageListItem>
        ))}
      </ImageList>
    </div>
  );
};

export default PerAlbum;
