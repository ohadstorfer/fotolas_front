import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAppDispatch } from '../app/hooks';
import { ImageList, ImageListItem, Card, CardActionArea, Box, IconButton, CardMedia } from '@mui/material';
import { AspectRatio } from '@mui/joy';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import { selectImg } from '../slicers/ImagesSlice';
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

  return (
    <div>
      <SessAlbumDetails></SessAlbumDetails>
      
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
    </div>
  );
};

export default UndividedImgs;
