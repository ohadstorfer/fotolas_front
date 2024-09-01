import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAppDispatch } from '../app/hooks';
import { ImageList, ImageListItem, Card, CardActionArea, Box, IconButton, CardMedia, Typography, Button } from '@mui/material';
import { AspectRatio } from '@mui/joy';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import { fetchImagesBySessAsync, selectImg, selectNextImages, selectPreviousImages } from '../slicers/ImagesSlice';
import { addToCart_singleImages, calculatePriceForImages, fetchPricesBySessionAlbumId, removeCartType, removeFromCart_singleImages, removeSessAlbumOfCart, selectCart, selectSessAlbumOfCart, setCartType, setSessAlbumOfCart } from '../slicers/cartSlice'; // Import the actions and selectors from the cart slice
import { teal } from '@mui/material/colors';
import SessAlbumDetails from './SessAlbumDetails';
import { selectSelectedSessAlbum } from '../slicers/sessAlbumSlice';

const UndividedImgs: React.FC = () => {
  const dispatch = useAppDispatch();
  const imgs = useSelector(selectImg);
  const cart = useSelector(selectCart);
  const sessAlbumOfCart = useSelector(selectSessAlbumOfCart);
  const selectedSessAlbum = useSelector(selectSelectedSessAlbum);
  const Prices = useSelector((state: any) => state.cart.prices);
  const nextPage = useSelector(selectNextImages);
  const previousPage = useSelector(selectPreviousImages);


  interface Img {
    id: number;
    photo: string;
    WatermarkedPhoto: string;
    price: number;
    personal_album: number;
    SessionAlbum: number;
}
  
  const handleAddToCart = async (img: Img, sessionAlbum: number) => {
    if (sessAlbumOfCart && sessAlbumOfCart !== selectedSessAlbum) {
      alert('You can only add waves from the same session album.');
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

    if (cart.length===1) {
      dispatch(removeSessAlbumOfCart());
      dispatch(removeCartType());
    }

    dispatch(removeFromCart_singleImages({ imgId: imgId })); // Assuming each image is counted as 1
    dispatch(calculatePriceForImages());
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



  return (
    <div>
      <SessAlbumDetails></SessAlbumDetails>


      {Prices &&(
        <Box sx={{ padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '8px', margin: '20px' }}>
          <Typography>
            Price Details:
          </Typography>
          <Typography>
            For 1-5 images: {Prices.price_1_to_5} $
          </Typography>
          <Typography>
            For 6-20 images: {Prices.price_6_to_20} $
          </Typography>
          <Typography>
            For 21-50 images: {Prices.price_21_to_50} $
          </Typography>
          <Typography>
            For 51+ images: {Prices.price_51_plus} $
          </Typography>
        </Box>
      )}


      
      <ImageList variant="masonry" cols={3} gap={8} sx={{ margin: '20px' }}>
        {imgs.map((img) => {
          const isInCart = cart.includes(img.id);
          return (
            <ImageListItem key={img.id}>
              <Card>
                <CardActionArea>
                  <AspectRatio ratio="4/3">
                    <CardMedia
                      component="img"
                      height="200"
                      image={img.WatermarkedPhoto} 
                      alt={`Image ${img.id}`}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        p: 1,
                        bgcolor: 'rgba(0, 0, 0, 0.6)',
                        borderRadius: '8px 0 0 0',
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

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button variant="contained" onClick={handlePreviousPage} disabled={!previousPage} sx={{ mr: 2 }}>
          Previous
        </Button>
        <Button variant="contained" onClick={handleNextPage} disabled={!nextPage}>
          Next
        </Button>
      </Box>
      
    </div>
  );
};

export default UndividedImgs;
