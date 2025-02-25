import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Typography, Box, Dialog, DialogActions, DialogContent, DialogContentText, useMediaQuery } from '@mui/material';
import { teal } from '@mui/material/colors';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { selectSpanish } from '../slicers/sighnInSlice';
import { clearEmail, clearPurchaseID, selectPurchaseID } from '../slicers/purchaseSlice';
import { Alert, CircularProgress } from '@mui/joy';
import { useAppDispatch } from '../app/hooks';

const PaymentSuccessfull = () => {
  const navigate = useNavigate();
  const spanish = useSelector(selectSpanish);
  const purchaseID = useSelector(selectPurchaseID);
  const [fileExists, setFileExists] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openMessage, setOpenMessage] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');
  const dispatch = useAppDispatch();
  



  // Periodically check if the file exists
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!purchaseID) {
        console.log("purchaseID is null. Retrying...");
        return; // Skip this interval iteration and retry
      }
      try {
        
        console.log("Performing a HEAD request");
        const response = await axios.head(`https://surfingram-purchases.s3.us-east-2.amazonaws.com/surfpik_${purchaseID}.zip`); // Perform a HEAD request
        if (response.status === 200) {
          console.log("response.status === 200");
          setFileExists(true);
          setIsChecking(false);
          clearInterval(interval); // Stop checking once the file is found
        }
      } catch (err) {
        console.log("error");
        if (axios.isAxiosError(err) && err.response?.status !== 404) {
          // setError('An error occurred while checking the file.');
          // setIsChecking(false);
          // clearInterval(interval);
        }
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [dispatch, purchaseID]);












  const handleDownload = async () => {
    try {
      const response = await axios.get(`https://surfingram-purchases.s3.us-east-2.amazonaws.com/surfpik_${purchaseID}.zip`, { responseType: 'blob' }); // Download the file
      const blob = new Blob([response.data], { type: 'application/zip' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `surfpik_${purchaseID}.zip`;
      link.click();
    } catch (err) {
      setError('An error occurred while downloading the file.');
    }
  };

  const handleNavigateHome = () => navigate('/');

  const handleOpenMessage = () => setOpenMessage(true);

  const handleCloseMessage = () => setOpenMessage(false);







  return (
    <div className="container">
      




{isChecking &&
        <><Alert
          variant="outlined"
          color="success"
          sx={{
            maxWidth: isMobile ? '90%' : '400px',
            margin: '0 auto', // Center horizontally
            textAlign: 'center',
          }}
        >
          <Typography>
            We're sending you an email with a link to download your files. This process may take a few minutes, so thank you for your patience.
          </Typography>

          <CircularProgress color="success" />
        </Alert>
        <br></br> 
        <Typography>
        The email may have already been sent. Please check your inbox, including the spam or junk folder.
          </Typography></>
      }




{fileExists &&
        <Alert
          variant="outlined"
          color="success"
          startDecorator={<CheckCircleIcon />}
          sx={{
            maxWidth: isMobile ? '90%' : '400px',
            margin: '0 auto', // Center horizontally
            textAlign: 'center',
          }}
        >
          <Typography>
          We have sent you an email with a link to download your files. Please note that the files will be available for download for the next 30 days.          </Typography>

        </Alert>
      }


<br></br> 



      {fileExists && (
        <Button
          variant="contained"
          sx={{
            marginTop: 2,
            backgroundColor: teal[400],
            '&:hover': { backgroundColor: teal[600] },
          }}
          onClick={handleDownload}
        >
          Download File <ArrowCircleDownIcon sx={{ marginLeft: '5px' }} />
        </Button>
      )}

      {error && (
        <Typography variant="body2" color="error" textAlign="center" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {fileExists && (
      <Box sx={{ padding: '5px', borderRadius: '8px', margin: '5px' }}>
        <Button onClick={handleOpenMessage} sx={{ color: 'black' }}>
          How to find my images/videos?
        </Button>
      </Box>
      )}

      <Button
        variant="text"
        sx={{
          fontSize: '0.9rem',
          color: teal[400],
          borderRadius: '8px',
          cursor: 'pointer',
          '&:hover': { backgroundColor: teal[400], color: 'white' },
        }}
        onClick={handleNavigateHome}
        disabled={isChecking}
      >
        {spanish ? 'Ir a la página principal' : 'Go to Homepage'}
      </Button>

      {openMessage && (
        <Dialog open={openMessage} onClose={handleCloseMessage}>
          <DialogContent>
            <DialogContentText>
              <Typography variant="body1" paragraph align="center">
                <strong>How to find your images/videos:</strong>
              </Typography>
              <Typography variant="body1" paragraph>
                Check your phone's files and search for <strong><em>"surfpik_{purchaseID}.zip"</em></strong>. You may find it under <em>"Recents"</em> or <em>"Downloads"</em>.
              </Typography>
              <Typography variant="body1" paragraph>
                Tap on the <em>“surfpik.zip”</em> file to open it. Your device will either create a new folder named <em>“surfpik”</em> containing all your images, or simply display the images within.
              </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseMessage} autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default PaymentSuccessfull;