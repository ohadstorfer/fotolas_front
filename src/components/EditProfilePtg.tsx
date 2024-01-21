import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
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
import { getPhotographerByUserId, selectProfilePhotographer } from '../slicers/profilePtgSlice';
import { TextField } from '@mui/material';
import UploadButton from './UpdButton';



export default function UserCard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const photographer = useSelector(selectProfilePhotographer);
  const { userId } = useParams();
  const [loading, setLoading] = useState(true);
  const [isEditable, setIsEditable] = useState(false);


  useEffect(() => {
    if (userId) {
      dispatch(getPhotographerByUserId(Number(userId)));
      dispatch(sessGetDataAsync({ filterType: "photographer", filterId: Number(userId) }))
        .then(() => setLoading(false))
        .catch(() => setLoading(false));
    }
  }, [dispatch, userId]);




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
        <AspectRatio flex ratio="1" maxHeight={182} sx={{ minWidth: 182 }}>
          <img
            src={photographer?.profile_image}
            loading="lazy"
            alt="" />
            <UploadButton></UploadButton>
        </AspectRatio>
        <CardContent>
          
         
            
            <TextField 
            fullWidth
            size="medium"
            variant="standard"
            defaultValue= "Full Name" // Set default value
          />
          <br></br>
          <TextField 
            fullWidth
            size="medium"
            variant="standard"
            defaultValue= "About- Write something about yourself" // Set default value
          />

          <Box sx={{ display: 'flex', p: 1.5, my: 3, gap: 1.5, '& > button': { flex: 1 } }}>
            <Button variant="solid" style={{ backgroundColor: teal[400], color: 'white' }}>
              Cancle 
            </Button>
            <Button variant="solid" style={{ backgroundColor: teal[400], color: 'white' }}>
              Submit 
            </Button>
          </Box>

        </CardContent>

      </Card>



    </Box>
    </>
  );
}
