import * as React from 'react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import { useAppDispatch } from '../app/hooks';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getPhotographerById, selectPhotographer } from '../slicers/photographerSlice';
import { teal } from '@mui/material/colors';
import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import SessAlbum from './SessAlbum';
import { selectNewSess, selectPrices, selectVideos, sessGetDataAsync, updatePricesAsync, updatePricesForVideosAsync } from '../slicers/sessAlbumSlice';
import { TextField } from '@mui/material';
import { createSpotAsync, selectSpot } from '../slicers/spotSlice';


export default function UserCard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate()
  const newSpot = useSelector(selectSpot);
  const newSess = useSelector(selectNewSess);
  const prices = useSelector(selectPrices);
  const videos = useSelector(selectVideos)
  console.log(videos);



  //   useEffect(() => {
  //     console.log('prices:', prices);
  //     if(prices)
  //     {videos? navigate('/PleaseWorkVideo') :navigate('/PleaseWork') }

  //  }, [prices]);

  useEffect(() => {
    console.log('prices from the component 1: ', prices);
    if (prices) {
      console.log('prices from the component 2: ', prices);
      navigate('/PleaseWorkVideoCloudinary')
    }
  }, [prices]);


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const credentials = {
      session_album: Number(newSess),
      price_1_to_5: Number(data.get("price_1_to_5")),
      price_6_to_15: Number(data.get("price_6_to_15")),
      price_16_plus: Number(data.get("price_16_plus")),
    };

    try {
      console.log(credentials);
      await dispatch(updatePricesForVideosAsync(credentials));
    } catch (error) {
      console.error('updatePrices failed:', error);
    }
  };



  return (
    <><Box component="form" noValidate onSubmit={handleSubmit} encType="multipart/form-data"
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
          {/* 8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888 */}



          <TextField
            margin="normal"
            required
            fullWidth
            name="price_1_to_5"
            label="Set a price for albums with 1 to 5 videos"
            type="number"
            id="price_1_to_5"
            autoComplete="current-price_1_to_5"
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="price_6_to_15"
            label="Set a price for albums with 6 to 15 videos"
            type="number"
            id="price_6_to_15"
            autoComplete="current-price_6_to_15"
          />


          <TextField
            margin="normal"
            required
            fullWidth
            name="price_16_plus"
            label="Set a price for albums with 16 videos or more videos"
            type="number"
            id="price_16_plus"
            autoComplete="current-price_16_plus"
          />


          <Box sx={{ display: 'flex', p: 1.5, my: 3, gap: 1.5, '& > button': { flex: 1 } }}>

            <Button type="submit"
              fullWidth
              sx={{ backgroundColor: teal[400], color: 'white' }}>
              Confirm
            </Button>
          </Box>

        </CardContent>
      </Card>

    </Box>
    </>
  );
}
