import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { personalGetDataAsync, resetImages, selectImg } from '../slicers/ImagesSlice';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import {  Dialog, DialogContent, Grid, IconButton, ImageList, ImageListItem, useMediaQuery } from '@mui/material';
import { AspectRatio } from '@mui/joy';
import CloseIcon from '@mui/icons-material/Close';

const Images: React.FC = () => {
  const imgs = useSelector(selectImg);
  const isMobile = useMediaQuery('(max-width:600px)');
  // Dialog state for opening the image in larger view
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);





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

      <ImageList variant="standard" cols={isMobile ? 2 : 3} gap={3}  >
        {imgs.map((img) => (
          <ImageListItem key={img.id}>
            <Card>
              <CardActionArea onClick={() => handleOpenDialog(img.WatermarkedPhoto)}>
                <AspectRatio ratio="4/3">
                  <CardMedia
                    component="img"
                    height="200"
                    image={img.WatermarkedPhoto} // Use the image URL from your Redux store
                    alt={`Image ${img.id}`}
                  />
                </AspectRatio>
              </CardActionArea>

            </Card>
          </ImageListItem>
        ))}
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

export default Images;
