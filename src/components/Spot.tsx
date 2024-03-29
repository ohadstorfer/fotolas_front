import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import { useAppDispatch } from '../app/hooks';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {  selectPhotographer } from '../slicers/photographerSlice';
import { teal } from '@mui/material/colors';
import { getSpotById, selectSpot } from '../slicers/spotSlice';
import { useEffect, useState } from 'react';
import { sessGetDataAsync } from '../slicers/sessAlbumSlice';
import SessAlbum from './SessAlbum';

export default function UserCard() {
  const dispatch = useAppDispatch();
  const navigate  = useNavigate();
  const photographer = useSelector(selectPhotographer);
  const spot = useSelector(selectSpot);
  const { spotId } = useParams();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (spotId) {
      dispatch(getSpotById(Number(spotId)));
      dispatch(sessGetDataAsync({ filterType: "photographer", filterId: Number(spotId) }))
        .then(() => setLoading(false))
        .catch(() => setLoading(false));
    }
  }, [dispatch, spotId]);

  
  return (
    <><Box
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


          borderRadius: '16px', // Add rounded corners for a modern look
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)', // Add a subtle shadow
        }}
      >

        <CardContent>
          <Typography fontSize="xl" fontWeight="lg">
            {spot?.name}
          </Typography>
          <Typography level="body-sm" fontWeight="lg" textColor="text.tertiary">
            {spot?.city} , {spot?.country}
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
              <Typography fontWeight="lg">34</Typography>
            </div>
            <div>
              <Typography level="body-xs" fontWeight="lg">
                Followers
              </Typography>
              <Typography fontWeight="lg">980</Typography>
            </div>
            <div>
              <Typography level="body-xs" fontWeight="lg">
                Photographers
              </Typography>
              <Typography fontWeight="lg">9</Typography>
            </div>
          </Sheet>
          <Box sx={{ display: 'flex', gap: 1.5, '& > button': { flex: 1 } }}>
            <Button variant="outlined" color="neutral">
              Copy Link
            </Button>
            <Button variant="solid" style={{ backgroundColor: teal[400], color: 'white' }}>
              Follow
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
    <Box>{!loading && spot?.id && <SessAlbum filterType="spot" filterId={spot.id} />}</Box></>

  );
}
