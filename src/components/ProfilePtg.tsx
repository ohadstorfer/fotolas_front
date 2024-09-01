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
import {  getPhotographerById, selectPhotographer } from '../slicers/photographerSlice';
import { teal } from '@mui/material/colors';
import { useEffect, useState } from 'react';
import SessAlbum from './SessAlbum';
import { sessGetDataAsync } from '../slicers/sessAlbumSlice';
import { MdModeEdit } from "react-icons/md";
import { IoMdAddCircleOutline } from "react-icons/io";
import { FaHistory } from "react-icons/fa";
import { getPhotographerByUserId, selectProfilePhotographer } from '../slicers/profilePtgSlice';
import { styled } from '@mui/material';


export default function UserCard() {
  const dispatch = useAppDispatch();
  const navigate  = useNavigate();
  const photographer = useSelector(selectProfilePhotographer);
  const { userId } = useParams();
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    if (userId) {
      dispatch(getPhotographerByUserId(Number(userId)));
      // dispatch(sessGetDataAsync({ filterType: "photographer", filterId: Number(userId) }))
      //   .then(() => setLoading(false))
      //   .catch(() => setLoading(false));
    }
  }, [dispatch, userId]);

  const editProfilePtgClick = () => {
    navigate(`/EditProfilePtg/${photographer?.id}`);
  };
  const dashboardClick = () => {
    navigate(`/DashboardPhotographer/`);
  };

  const addAlbum = () => {
    navigate(`/CreatSessAlbum`);
  };
  
  

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
          <Box sx={{ display: 'flex', gap: 1.5, '& > button': { flex: 1 } }}>
            <Button onClick={dashboardClick} variant="solid" style={{ backgroundColor: teal[400], color: 'white' }}>
              History  <FaHistory />
            </Button>
            <Button onClick={addAlbum} variant="solid" style={{ backgroundColor: teal[400], color: 'white' }}>
              Add Album <IoMdAddCircleOutline />
            </Button>
            <Button onClick={editProfilePtgClick} variant="solid" style={{ backgroundColor: teal[400], color: 'white' }}>
              Edit Profile <MdModeEdit />
            </Button>
          </Box>
        </CardContent>

      </Card>



    </Box>
    {/* <Box>{!loading && photographer?.id && <SessAlbum filterType="photographer" filterId={photographer.id} />}</Box> */}
    </>
    

  );
}
