import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
import { useAppDispatch } from '../app/hooks';
import { ImageList, ImageListItem } from '@mui/material';
import { selectSurferPurchases, fetchSurferPurchasedItemsAsync } from '../slicers/purchaseSlice';
import axios from 'axios';

const DashboardSurfer: React.FC = () => {
  const dispatch = useAppDispatch();
  const surferPurchases = useSelector(selectSurferPurchases);

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
  

  const renderItems = (items: any[], type: 'image' | 'video') => {
    return items.map((item) => (
      <ImageListItem key={item.id}>
        <Card>
          <CardActionArea>
            {type === 'image' ? (
              <CardMedia
                component="img"
                height="200"
                image={item.WatermarkedPhoto}
                alt={`Image ${item.id}`}
              />
            ) : (
              <video controls height="200" src={item.WatermarkedVideo} style={{ width: '100%' }} />
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
      <ImageList variant="masonry" cols={3} gap={8} sx={{ margin: '20px' }}>
        {surferPurchases?.purchased_images &&
          Object.values(surferPurchases.purchased_images as any[]).map((imageItems) =>
            renderItems(imageItems, 'image')
          )}
      </ImageList>

      <ImageList variant="masonry" cols={3} gap={8} sx={{ margin: '20px' }}>
        {surferPurchases?.purchased_videos &&
          Object.values(surferPurchases.purchased_videos as any[]).map((videoItems) =>
            renderItems(videoItems, 'video')
          )}
      </ImageList>
    </div>
  );
};

export default DashboardSurfer;
