import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/joy/Box';
import Avatar from '@mui/joy/Avatar';
import Typography from '@mui/joy/Typography';
import Link from '@mui/joy/Link';
import { useAppDispatch } from '../app/hooks';
import { clearSessAlbums, deactivateSessionAlbumThunk, formatSessDate, selectNextPage, selectPreviousPage, selectSessAlbums, sessGetDataAsync, setSelectedSessAlbum } from '../slicers/sessAlbumSlice';
import { fetchPricesForVideosBySessionAlbumId, getDataAsync } from '../slicers/perAlbumSlice';
import { AspectRatio } from '@mui/joy';
import { TiLocation } from 'react-icons/ti';
import { teal, red } from '@mui/material/colors';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { useNavigate } from 'react-router-dom';
import { selectPhotographer } from '../slicers/photographerSlice';
import { getSpotById, selectAllSpots } from '../slicers/spotSlice';
import { fetchImagesAsync, fetchImagesBySessAsync, fetchVideosBySessionAsync } from '../slicers/ImagesSlice';
import { fetchPricesBySessionAlbumId, setSessAlbumOfCart } from '../slicers/cartSlice';
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogContentText, IconButton, TextField, useMediaQuery } from '@mui/material';
import SmartDisplayIcon from '@mui/icons-material/SmartDisplay';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import AutoDeleteIcon from '@mui/icons-material/AutoDelete';
import { selectProfilePhotographer } from '../slicers/profilePtgSlice';
import DeleteIcon from '@mui/icons-material/Delete';
import { selectSpanish } from '../slicers/sighnInSlice';


interface sess {
  id: number;
  created_at: Date;
  updated_at: Date;
  cover_image: string;
  spot: number;
  photographer: number;
  albums_prices: number;
  sessDate: Date;
  spot_name: string;
  photographer_name: string;
  photographer_profile_image: string;
  videos: boolean;
  dividedToWaves: boolean;
  expiration_date: Date;
  days_until_expiration: number;
}

const MyAlbums: React.FC = () => {
  const sessAlbum = useSelector(selectSessAlbums);
  const [selectedSpot, setSelectedSpot] = useState<any | null>(null);
  const allSpots = useSelector(selectAllSpots);
  const nextPage = useSelector(selectNextPage);
  const previousPage = useSelector(selectPreviousPage);
  const isMobile = useMediaQuery('(max-width:600px)');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const photographer = useSelector(selectProfilePhotographer);
  const photographerId = Number(photographer?.id);
  const [open, setOpen] = useState(false); // State for dialog
  const [albumIdToDelete, setAlbumIdToDelete] = useState<number | null>(null); // State to store the ID of the album to delete
  const spanish = useSelector(selectSpanish)


  useEffect(() => {
    dispatch(clearSessAlbums())
    dispatch(sessGetDataAsync({ filterType: "photographer", filterId: photographerId }));
  }, [dispatch, photographerId]);

  const handleCardClickImg = async (albumId: number) => {
    navigate('/PerAlbum');
  };

  const handleCardClickVideo = async (albumId: number) => {
    navigate('/Video');
  };

  const handleCardClickSingleImages = async (albumId: number) => {
    dispatch(fetchImagesBySessAsync({ albumId }));
    navigate('/UndividedImgs');
  };

  const handleCardClick = (sessAlbum: any) => {
    if (sessAlbum.videos) {
      handleCardClickVideo(sessAlbum.id);
    } else if (sessAlbum.dividedToWaves) {
      handleCardClickImg(sessAlbum.id);
    } else {
      handleCardClickSingleImages(sessAlbum.id);
    }
    dispatch(setSelectedSessAlbum(sessAlbum));
  };

  const handleSpotClick = async (spotId: number) => {
    navigate(`/Spot/${spotId}`);
  };

  const handlePhotographerClick = (photographerId: number) => {
    navigate(`/Photographer/${photographerId}`);
  };


  // Open dialog and set the album ID to delete
  const handleDeleteClick = (albumId: number) => {
    setAlbumIdToDelete(albumId);
    setOpen(true);
  };

  // Handle confirmation of deletion
  const confirmDeactivateSessionAlbum = async () => {
    if (albumIdToDelete !== null) {
      await dispatch(deactivateSessionAlbumThunk(albumIdToDelete));
      dispatch(sessGetDataAsync({ filterType: "photographer", filterId: photographerId }));
    }
    handleClose(); // Close dialog after deletion
  };

  const handleClose = () => {
    setOpen(false);
    setAlbumIdToDelete(null); // Reset the album ID
  };



  const handleNextPage = () => {
    if (nextPage) {
      const page = new URL(nextPage).searchParams.get('page');
      dispatch(sessGetDataAsync({
        filterType: "photographer",
        filterId: photographerId,
        page: parseInt(page || '1', 10),
        pageSize: 20,
      }));
    }
  };

  const handlePreviousPage = () => {
    if (previousPage) {
      const page = new URL(previousPage).searchParams.get('page');
      dispatch(sessGetDataAsync({
        filterType: "photographer",
        filterId: photographerId,
        page: parseInt(page || '1', 10),
        pageSize: 20,
      }));
    }
  };

  return (
    <>
      <div>
        <ImageList variant="standard" cols={isMobile ? 1 : 4} gap={8} sx={{ marginRight: '20px', marginLeft: '20px', marginBottom: '20px' }}>
          {sessAlbum.map((sessAlbum) => (
            <ImageListItem key={sessAlbum.id}>
              <Card
                sx={{
                  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)',
                  borderRadius: '8px',
                  border: '1px solid rgba(0, 0, 0, 0.4)',
                }}
              >
                <CardActionArea onClick={() => handleCardClick(sessAlbum)}>
                  <AspectRatio ratio="4/3">
                    <CardMedia
                      component="img"
                      height="200"
                      image={sessAlbum.cover_image}
                      alt={`Image ${sessAlbum.id}`} />
                    <Box
                      sx={{
                        position: 'relative',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        p: 1,
                        bgcolor: 'rgba(0, 0, 0, 0.5)',
                        borderRadius: '0 0 0px 0',
                        textAlign: 'center',
                      }}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          display: 'flex',
                          alignItems: 'center',
                          gap: isMobile ? 0.4 : 1,
                          p: 1,
                          bgcolor: 'rgba(0, 0, 0, 0.0)',
                        }}
                      >
                        <span
                          style={{
                            color: 'white',
                            fontSize: isMobile ? '10px' : '14px',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                          }}
                        >
                          {sessAlbum.videos ? <SmartDisplayIcon /> : <PhotoLibraryIcon />}
                        </span>
                      </Box>


                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          right: 9,
                          display: 'flex',
                          alignItems: 'center',
                          p: 1,
                          bgcolor: 'rgba(0, 0, 0, 0.0)',
                        }}
                      >
                        {sessAlbum.days_until_expiration === 0 ? (
                          <span style={{ color: red[500], fontSize: isMobile ? '14px' : '16px', fontWeight: 'bold' }}>
                            {spanish ? 'Último Día' : 'Last Day'}
                          </span>
                        ) : (
                          <div style={{ lineHeight: '0.7' }}>
                            <span style={{ color: 'white', fontSize: isMobile ? '12px' : '12px', fontWeight: 'bold', marginRight: '5px' }}>
                              {sessAlbum.days_until_expiration}  {sessAlbum.days_until_expiration === 1 ? 'day' : 'days'}  <br style={{ lineHeight: '0.8' }} /> {spanish ? 'quedan' : 'left'}
                            </span>
                          </div>
                        )}


                        <AutoDeleteIcon
                          style={{
                            color: sessAlbum.days_until_expiration === 0 ? red[500] : 'white',
                            fontSize: isMobile ? '20px' : '20px',
                            cursor: 'pointer',
                          }}
                        />

                      </Box>


                      <span
                        onClick={(event) => {
                          event.stopPropagation();
                          handleSpotClick(sessAlbum.spot);
                        }}
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                        }}
                      >
                        {sessAlbum.spot_name}
                      </span>
                    </Box>
                  </AspectRatio>
                </CardActionArea>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', bgcolor: teal[400], boxShadow: '0 -8px 8px rgba(0, 0, 0, 0.4)', position: 'relative', }}>
                  <IconButton
                    aria-label="delete"
                    color="error"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDeleteClick(sessAlbum.id); // Call the new function here
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <Typography sx={{ marginLeft: 'auto', textAlign: 'center', marginRight: '10px' }}>{formatSessDate(sessAlbum.sessDate)}</Typography>
                </Box>
              </Card>
            </ImageListItem>
          ))}
        </ImageList>

        <div className="pagination-buttons" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <Button
            onClick={handlePreviousPage}
            variant="contained"
            color="primary"
            style={{ marginRight: '10px' }}
            disabled={!previousPage}
          >
            Previous
          </Button>
          <Button
            onClick={handleNextPage}
            variant="contained"
            color="primary"
            disabled={!nextPage}
          >
            Next
          </Button>
        </div>





        {/* Confirmation Dialog */}
        <Dialog open={open} onClose={handleClose}>
          <DialogContent>
            <DialogContentText>
              {spanish
                ? '¿Estás seguro de que quieres eliminar este álbum? Una vez eliminado, el álbum no se puede restaurar.'
                : 'Are you sure you want to delete this album? Once deleted, the album cannot be restored.'}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              {spanish ? 'Cancelar' : 'Cancel'}
            </Button>
            <Button onClick={confirmDeactivateSessionAlbum} color="secondary">
              {spanish ? 'Confirmar' : 'Confirm'}
            </Button>
          </DialogActions>
        </Dialog>




      </div>
    </>
  );
};

export default MyAlbums;
