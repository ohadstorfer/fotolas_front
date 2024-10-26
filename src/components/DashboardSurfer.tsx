import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
import { useAppDispatch } from '../app/hooks';
import { Box, Dialog, DialogContent, ImageList, ImageListItem, useMediaQuery } from '@mui/material';
import { selectSurferPurchases, fetchSurferPurchasedItemsAsync } from '../slicers/purchaseSlice';
import axios from 'axios';
import AutoDeleteIcon from '@mui/icons-material/AutoDelete';
import red from '@mui/material/colors/red';
import CloseIcon from '@mui/icons-material/Close';



const DashboardSurfer: React.FC = () => {
  const dispatch = useAppDispatch();
  const surferPurchases = useSelector(selectSurferPurchases);
  const isMobile = useMediaQuery('(max-width:600px)');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [open, setOpen] = useState(false);



  // Get surferId from local storage
  const surferId = JSON.parse(localStorage.getItem('user') || '{}').id;

  useEffect(() => {
    if (surferId) {
      // Dispatch the action to fetch the purchased items when the component mounts
      dispatch(fetchSurferPurchasedItemsAsync(surferId));
    }
  }, [dispatch, surferId]);





  const downloadFile = async (url: string | undefined) => {
    if (!url) {
      console.error('Invalid URL');
      return;
    }
    try {
      const response = await axios.get(url, { responseType: 'blob' });
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a'); // Declare and initialize the link element
      const filename = url.split('/').pop() || 'downloaded_file'; // Provide a default filename
      link.href = blobUrl;

      // Ensure that filename is always a string
      const safeFilename = filename.split('/').pop() || 'downloaded_file';
      link.setAttribute('download', safeFilename);

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
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




  const renderItems = (items: any[], type: 'image' | 'video') => {
    if (!Array.isArray(items)) return null;
    return items.map((item) => (
      <ImageListItem key={item.id}>
        <Card>
          <CardActionArea onClick={() => handleOpenDialog(item.WatermarkedPhoto)}>
            {type === 'image' ? (
              <CardMedia
                component="img"
                height="200"
                image={item.WatermarkedPhoto}
                alt={`Image ${item.id}`}
              />
            ) : (
              <video controls height='100%' src={item.WatermarkedVideo} style={{ width: '100%' }} />
            )}




            {item.days_until_expiration <= 3 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  display: 'flex',
                  alignItems: 'center',
                  p: 1,
                  bgcolor: 'rgba(0, 0, 0, 0.0)',
                }}
              >

                {item.days_until_expiration === 0 ? (
                  <span style={{ color: red[500], fontSize: isMobile ? '14px' : '16px', fontWeight: 'bold' }}>
                    Today
                  </span>
                ) : (
                  <div style={{ lineHeight: '0.8' }}>
                    <span style={{ color: 'white', fontSize: isMobile ? '14px' : '16px', fontWeight: 'bold' }}>
                      {item.days_until_expiration} <br style={{ lineHeight: '0.6' }} /> {item.days_until_expiration === 1 ? 'day' : 'days'}
                    </span>
                  </div>
                )}


                {item.days_until_expiration <= 3 && (
                  <AutoDeleteIcon
                    style={{
                      color: item.days_until_expiration === 0 ? red[500] : 'white',
                      fontSize: isMobile ? '20px' : '20px',
                      cursor: 'pointer',
                    }}
                  />
                )}


              </Box>
            )}

            <IconButton
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
              }}
              onClick={() =>
                downloadFile(type === 'image' ? item.photo : item.video)
              }
            >
              <DownloadIcon />
            </IconButton>
          </CardActionArea>
        </Card>
      </ImageListItem>
    ));
  };

  return (
    <div>
      <ImageList variant="masonry" cols={isMobile ? 2 : 4} gap={8} sx={{ margin: '20px' }}>
        {surferPurchases?.purchased_images &&
          renderItems(surferPurchases.purchased_images, 'image')}
      </ImageList>

      <ImageList variant="masonry" cols={isMobile ? 2 : 4} gap={8} sx={{ margin: '20px' }}>
        {surferPurchases?.purchased_videos &&
          renderItems(surferPurchases.purchased_videos, 'video')}
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

export default DashboardSurfer;
