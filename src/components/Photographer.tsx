import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Button from '@mui/material/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import { useAppDispatch } from '../app/hooks';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getPhotographerById, selectPhotographer } from '../slicers/photographerSlice';
import { teal } from '@mui/material/colors';
import { useEffect, useState } from 'react';
import SessAlbum from './SessAlbum';
import { sessGetDataAsync } from '../slicers/sessAlbumSlice';
import { useMediaQuery } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';




export default function UserCard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const photographer = useSelector(selectPhotographer);
  const { photographerId } = useParams();
  const [loading, setLoading] = useState(true);
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    if (photographerId) {
      dispatch(getPhotographerById(Number(photographerId)));
      dispatch(sessGetDataAsync({ filterType: "photographer", filterId: Number(photographerId) }))
        .then(() => setLoading(false))
        .catch(() => setLoading(false));
    }
  }, [dispatch, photographerId]);




  const handleNavigateHome = () => {
    navigate('/'); // Navigate to the home page
  };


  return (
    <><Box
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
          [`& > *`]: {
            '--stack-point': '500px',
            minWidth: 'clamp(0px, (calc(var(--stack-point) - 2 * var(--Card-padding) - 2 * var(--variant-borderWidth, 0px)) + 1px - 100%) * 999, 100%)',
          },


          borderRadius: '16px', // Add rounded corners for a modern look
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)', // Add a subtle shadow
        }}
      >
        <AspectRatio flex ratio="1" maxHeight={182} sx={{ minWidth: 182 }}>
          <img
            src={photographer?.profile_image}
            loading="lazy"
            alt="" />
        </AspectRatio>
        <CardContent>
          <Typography fontSize="xl" fontWeight="lg">
            {photographer && photographer.photographer_name}
          </Typography>
          <Typography level="body-sm" fontWeight="lg" textColor="text.tertiary">
            {photographer && photographer.about}
          </Typography>
          <Sheet
            sx={{
              bgcolor: 'background.level1',
              borderRadius: 'sm',
              p: 1.5,
              my: 1.5,
              display: 'flex',
              gap: 2,
              '& > div': { flex: 1 },
            }}
          >
            <div>
              <Typography level="body-xs" fontWeight="lg">
                Albums
              </Typography>
              <Typography fontWeight="lg">{photographer && photographer.session_album_count}</Typography>
            </div>
            <div>
              <Typography level="body-xs" fontWeight="lg">
                Spots
              </Typography>
              <Typography fontWeight="lg">{photographer && photographer.unique_spots_count}</Typography>
            </div>
          </Sheet>
        </CardContent>

      </Card>



    </Box>



    <br></br>
    <Button
          variant="text"
          sx={{
            margin: '5px 0',
            fontSize: '0.9rem',
            color: teal[400],
            borderRadius: '8px',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: teal[400],
              color: 'white',
            },
          }}
          onClick={handleNavigateHome}
        >
          <ArrowBackIosIcon fontSize="small" /> Back to Homepage
        </Button>
        <br></br>



      <Box>{!loading && photographer?.id && <SessAlbum filterType="photographer" filterId={photographer.id} />}</Box></>


  );
}
