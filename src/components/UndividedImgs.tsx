import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAppDispatch } from '../app/hooks';
import { ImageList, ImageListItem, Card, CardActionArea, Box, IconButton, CardMedia, Typography, Button, useMediaQuery, Dialog, DialogContent, Pagination, styled } from '@mui/material';
import { AspectRatio } from '@mui/joy';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import { fetchImagesBySessAsync, fetchVideosBySessionAsync, select_total_pages_Images, selectImg, selectNextImages, selectPreviousImages } from '../slicers/ImagesSlice';
import { addToCart_singleImages, calculatePriceForImages, fetchPricesBySessionAlbumId, removeCartType, removeFromCart_singleImages, removeSessAlbumOfCart, selectCart, selectSessAlbumOfCart, setCartType, setSessAlbumOfCart } from '../slicers/cartSlice';
import { teal } from '@mui/material/colors';
import SessAlbumDetails from './SessAlbumDetails';
import { selectSelectedSessAlbum } from '../slicers/sessAlbumSlice';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { selectSpanish } from '../slicers/sighnInSlice';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ExpiredSessAlbum from './ExpiredSessAlbum';

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
  const navigate = useNavigate();
  const spanish = useSelector(selectSpanish)
  const total_pages_Videos = useSelector(select_total_pages_Images);
  const [currentPage, setCurrentPage] = React.useState(1);
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




  



  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    dispatch(
      fetchImagesBySessAsync({
        albumId: selectedSessAlbum!.id,
        page: page,
      })
    );
    window.scrollTo(0, 0);
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

  const handleNavigateHome = () => {
    navigate('/'); // Navigate to the home page
  };



  const CustomPagination = styled(Pagination)({
    '& .MuiPaginationItem-root': {
      color: teal[400], // Apply teal color to pagination items
    },
    '& .Mui-selected': {
      backgroundColor: "#26a69b", // Solid teal background for selected page
      color: '#fff', // Ensure text is white on selected page
    },
  });



  if (selectedSessAlbum?.days_until_expiration! < 0) {
    return <ExpiredSessAlbum />;
  }
  


  return (
    <div>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
  <SessAlbumDetails />

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
    <ArrowBackIosIcon fontSize="small" /> {spanish ? 'Ir a la página principal' : 'Back to Homepage'}
  </Button>

  {Prices && (
    <Box sx={{ padding: '5px', borderRadius: '8px'}}>
      <Typography>Price Details:</Typography>
      <Typography>For 1-5 images: {Prices.price_1_to_5} $</Typography>
      <Typography>For 6-50 images: {Prices.price_6_to_50} $</Typography>
      <Typography>For 51+ images: {Prices.price_51_plus} $</Typography>
    </Box>
  )}
</Box>



<Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
    <CustomPagination
      count={total_pages_Videos!}
      page={currentPage}
      onChange={handlePageChange}
      variant="outlined"
      color="primary"
    />
  </Box>



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



<Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
    <CustomPagination
      count={total_pages_Videos!}
      page={currentPage}
      onChange={handlePageChange}
      variant="outlined"
      color="primary"
    />
  </Box>


  
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
