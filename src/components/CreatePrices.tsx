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
import { selectNewSess, selectPrices, sessGetDataAsync, updatePricesAsync } from '../slicers/sessAlbumSlice';
import { TextField } from '@mui/material';
import { createSpotAsync, selectSpot } from '../slicers/spotSlice';


export default function UserCard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate()
  const newSpot = useSelector(selectSpot);
  const newSess = useSelector(selectNewSess);
  const prices = useSelector(selectPrices);


  useEffect(() => {
    console.log('prices:', prices);
    if(prices){navigate('/AllWidgets');}
    
 }, [prices]);


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const credentials = {
      session_album: Number(newSess),
      singlePhotoPrice: Number(data.get("singlePhotoPrice")),
      price_1_to_5: Number(data.get("price_1_to_5")),
      price_6_to_10: Number(data.get("price_6_to_10")),
      price_11_to_20: Number(data.get("price_11_to_20")),
      price_21_to_50: Number(data.get("price_21_to_50")),
      price_51_plus: Number(data.get("price_51_plus")),
    };

    try {
      console.log(credentials);
      await dispatch(updatePricesAsync(credentials));
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
            name="singlePhotoPrice"
            label="Set a price for 1 image"
            type="number"  
            id="singlePhotoPrice"
            autoComplete="current-singlePhotoPrice"
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="price_1_to_5"
            label="Set a price for albums with 1 to 5 images"
            type="number"  
            id="price_1_to_5"
            autoComplete="current-price_1_to_5"
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="price_6_to_10"
            label="Set a price for albums with 6 to 10 images"
            type="number"  
            id="price_6_to_10"
            autoComplete="current-price_6_to_10"
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="price_11_to_20"
            label="Set a price for albums with 11 to 20 images"
            type="number"  
            id="price_11_to_20"
            autoComplete="current-price_11_to_20"
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="price_21_to_50"
            label="Set a price for albums with 21 to 50 images"
            type="number"  
            id="price_21_to_50"
            autoComplete="current-price_21_to_50"
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="price_51_plus"
            label="Set a price for albums with more than 50 images"
            type="number"  
            id="price_51_plus"
            autoComplete="current-price_51_plus"
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
