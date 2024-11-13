import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAppDispatch } from '../app/hooks';
import { ImageList, ImageListItem, Card, CardActionArea, Box, IconButton, CardMedia, Typography, Button, useMediaQuery, Dialog, DialogContent } from '@mui/material';
import { AspectRatio } from '@mui/joy';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import { fetchImagesBySessAsync, selectImg, selectNextImages, selectPreviousImages } from '../slicers/ImagesSlice';
import { addToCart_singleImages, calculatePriceForImages, fetchPricesBySessionAlbumId, removeCartType, removeFromCart_singleImages, removeSessAlbumOfCart, selectCart, selectSessAlbumOfCart, setCartType, setSessAlbumOfCart } from '../slicers/cartSlice';
import { teal } from '@mui/material/colors';
import SessAlbumDetails from './SessAlbumDetails';
import { selectSelectedSessAlbum } from '../slicers/sessAlbumSlice';
import CloseIcon from '@mui/icons-material/Close';

const UndividedImgs: React.FC = () => {
  const dispatch = useAppDispatch();
  const imgs = useSelector(selectImg);
  const cart = useSelector(selectCart);
  const sessAlbumOfCart = useSelector(selectSessAlbumOfCart);
  const selectedSessAlbum = useSelector(selectSelectedSessAlbum);
  const Prices = useSelector((state: any) => state.cart.prices);
  const nextPage = useSelector(selectNextImages);
  const previousPage = useSelector(selectPreviousImages);
  const isMobile = useMediaQuery('(max-width:600px)');

  // Dialog state for opening the image in larger view
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  interface Img {
    id: number;
    photo: string;
    WatermarkedPhoto: string;
    price: number;
    personal_album: number;
    SessionAlbum: number;
  }

  useEffect(() => {
    if (selectedSessAlbum) {
      const albumId = selectedSessAlbum.id;
      dispatch(fetchImagesBySessAsync({ albumId }));
      dispatch(fetchPricesBySessionAlbumId(albumId));
    }
  }, [dispatch, selectedSessAlbum]);

  const handleAddToCart = async (img: Img, sessionAlbum: number) => {
    if (sessAlbumOfCart && sessAlbumOfCart !== selectedSessAlbum) {
      alert('Your cart already contains items from a different session. You can only add items from the same session to your cart.');
      return;
    }

    if (!sessAlbumOfCart) {
      await dispatch(fetchPricesBySessionAlbumId(sessionAlbum));
      dispatch(setSessAlbumOfCart(selectedSessAlbum!));
      dispatch(setCartType('singleImages'));
    }

    dispatch(addToCart_singleImages(img));
    dispatch(calculatePriceForImages());
  };



  const handleRemoveFromCart = (imgId: number) => {
    // const confirmed = window.confirm('Remove this image from your cart?');
    // if (confirmed) {
      if (cart.length === 1) {
        dispatch(removeSessAlbumOfCart());
        dispatch(removeCartType());
      }
      dispatch(removeFromCart_singleImages({ imgId: imgId }));
      dispatch(calculatePriceForImages());
    // }
  };




  const handleNextPage = () => {
    if (nextPage) {
      const page = new URL(nextPage).searchParams.get('page');
      dispatch(
        fetchImagesBySessAsync({
          albumId: selectedSessAlbum!.id,
          page: parseInt(page || '1', 10),
        })
      );
    }
  };

  const handlePreviousPage = () => {
    if (previousPage) {
      const page = new URL(previousPage).searchParams.get('page');
      dispatch(
        fetchImagesBySessAsync({
          albumId: selectedSessAlbum!.id,
          page: parseInt(page || '1', 10),
        })
      );
    }
  };

  // Handle opening the dialog with the clicked image
  const handleOpenDialog = (image: string) => {
    setSelectedImage(image);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedImage(null);
  };

  return (
    <div>
      <SessAlbumDetails />
      {Prices && (
        <Box sx={{ padding: '5px', borderRadius: '8px', margin: '5px'}}>
          <Typography>Price Details:</Typography>
          <Typography>For 1-5 images: {Prices.price_1_to_5} $</Typography>
          <Typography>For 6-50 images: {Prices.price_6_to_50} $</Typography>
          <Typography>For 51+ images: {Prices.price_51_plus} $</Typography>
        </Box>
      )}

      <ImageList variant="standard" cols={isMobile ? 2 : 4} sx={{ margin: '20px' }}>
        {imgs.map((img: Img) => {
          const isInCart = cart.includes(img.id);
          return (
            <ImageListItem key={img.id}>
              <Card
              sx={{
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)', // Shadow on all sides
                borderRadius: '8px', // Optional: smooth corners
              }}>
                <CardActionArea onClick={() => handleOpenDialog(img.WatermarkedPhoto)}>
                  <AspectRatio ratio="4/3">
                    <CardMedia component="img" height="200" image={img.WatermarkedPhoto} alt={`Image ${img.id}`} />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        p: 0.5,
                        bgcolor: 'rgba(0, 0, 0, 0.6)',
                        borderRadius: '0 0 8px 0',
                      }}
                    >
                      <IconButton
                        sx={{
                          bgcolor: isInCart ? teal[100] : 'inherit',
                          color: isInCart ? 'black' : teal[100],
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          isInCart ? handleRemoveFromCart(img.id) : handleAddToCart(img, img.SessionAlbum);
                        }}
                      >
                        {isInCart ? <RemoveShoppingCartIcon /> : <AddShoppingCartIcon />}
                      </IconButton>
                    </Box>
                  </AspectRatio>
                </CardActionArea>
              </Card>
            </ImageListItem>
          );
        })}
      </ImageList>

      {(nextPage || previousPage) && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button variant="contained" onClick={handlePreviousPage} disabled={!previousPage} sx={{ mr: 2 }}>
              Previous
            </Button>
            <Button variant="contained" onClick={handleNextPage} disabled={!nextPage}>
              Next
            </Button>
          </Box>
        )}




      {/* Dialog for viewing larger image */}
      <Dialog
        open={open}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          style: {
            width: isMobile ? '100%' : '60%',
            margin: 'auto', // centers the dialog
          }
        }}
      >


        <IconButton
          aria-label="close"
          onClick={handleCloseDialog}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white', // Text/icon color
            backgroundColor: '#9e9e9e', // Background color (grey)
            '&:hover': {
              backgroundColor: '#757575', // Darker grey on hover
            },
            '&:active': {
              backgroundColor: '#616161', // Even darker grey when active
            },
          }}
        >
          <CloseIcon />
        </IconButton>



        <DialogContent
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 0, // Optional: removes padding around the image
          }}
        >
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Larger View"
              style={{
                width: '100%',    // Ensures the image takes up full width
                height: 'auto',   // Maintains aspect ratio
                maxWidth: '100%', // Ensures it doesn’t exceed the container’s width
                display: 'block',
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UndividedImgs;
