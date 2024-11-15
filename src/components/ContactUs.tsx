import React from 'react';
import { Container, Typography, Box, Grid, Paper, Button } from '@mui/material';
import { styled, useMediaQuery } from '@mui/system';

// Styled components for enhanced look
const HeroSection = styled(Box)(({ theme }) => ({
  backgroundImage: 'url(https://via.placeholder.com/1200x500)', // Replace with your image URL
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  color: 'white',
  padding: theme.spacing(2, 2),
  textAlign: 'center',
}));

const AboutSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 2),
//   backgroundColor: theme.palette.grey[100],
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
//   boxShadow: theme.shadows[3],
//   '&:hover': {
//     boxShadow: theme.shadows[6],
//   },
}));

const ContactUs = () => {
    const isMobile = useMediaQuery('(max-width:600px)');


  return (
    <>


      {/* About Section */}
      <Container id="about-section" maxWidth="lg">
      <AboutSection sx={{ width: isMobile? '95%' : '75%', margin: '0 auto' }}>
  <Typography variant="h4" gutterBottom align="center">
    Contact Us
  </Typography>
  <Typography variant="body1" paragraph>
   We would love to hear from you! Contact us by email or our phone number using WhatsApp.
  </Typography>
</AboutSection>


        {/* Features Section */}
        <Grid container spacing={4} justifyContent="center" alignItems="center">
  <Grid item xs={12} sm={6} md={4}>
    <FeatureCard sx={{ borderRadius: 2, minHeight: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 3 }}>
      <Typography variant="h6" gutterBottom>
        WhatsApp
      </Typography>
      <Typography variant="body2">
        {"You can find us by the number"}
  <br />
  {"+972-544-673-407"}
      </Typography>
    </FeatureCard>
  </Grid>
  <Grid item xs={12} sm={6} md={4}>
    <FeatureCard sx={{ borderRadius: 2, minHeight: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 3 }}>
      <Typography variant="h6" gutterBottom>
        Email
      </Typography>
      <Typography variant="body2">
        Our Email address is surfpik@surfpik.com . Send us a message and we will get back to you.
      </Typography>
    </FeatureCard>
  </Grid>
  </Grid>

      </Container>


    </>
  );
};

export default ContactUs;
