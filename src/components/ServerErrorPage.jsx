import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography, Box } from '@mui/material';
import { teal } from '@mui/material/colors';
import { styled } from '@mui/system';

const CenteredBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '70vh',
  textAlign: 'center',
}));

const CustomButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  backgroundColor: teal[500],
  '&:hover': {
    backgroundColor: teal[700],
  },
}));

const ServerErrorPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    console.log('Navigating to home...');
    window.location.href = '/'; // Redirect and refresh
    // or
    // window.location.reload(); // Refresh the current page
  };

  return (
    <Container component="main" maxWidth="xs">
      <CenteredBox>
        <Typography variant="h2" gutterBottom color="error">
          Oops!
        </Typography>
        <Typography variant="h5" gutterBottom>
          Something went wrong
        </Typography>
        <Typography variant="body1" paragraph>
          An unexpected error occurred. Please try again later or contact support if the issue persists.
        </Typography>
        <CustomButton
          variant="contained"
          color="primary"
          onClick={handleGoHome} // Redirect to home or other page
        >
          return to home page
        </CustomButton>
      </CenteredBox>
    </Container>
  );
};

export default ServerErrorPage;
