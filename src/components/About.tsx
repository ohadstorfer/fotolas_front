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

const About = () => {
    const isMobile = useMediaQuery('(max-width:600px)');


  return (
    <>


      {/* About Section */}
      <Container id="about-section" maxWidth="lg">
      <AboutSection sx={{ width: isMobile? '95%' : '75%', margin: '0 auto' }}>
  <Typography variant="h4" gutterBottom align="center">
    About Us
  </Typography>
  <Typography variant="body1" paragraph>
    At Surfpik, we make it easy for surfers to quickly find their perfect surf moments – whether it’s an image or video from their latest session. No more searching through folders or emails, just log in and access everything in one place.
  </Typography>
  <Typography variant="body1" paragraph>
    For photographers, Surfpik simplifies the upload process and exposes your work to a wider audience. Share your images and videos effortlessly, and let surfers find and enjoy your work with ease.
  </Typography>
  <Typography variant="body1" paragraph>
    Surfpik connects surfers with photographers, creating a seamless experience for everyone involved.
  </Typography>
</AboutSection>


        {/* Features Section */}
        <Grid container spacing={4} justifyContent="center" alignItems="center">
  <Grid item xs={12} sm={6} md={4}>
    <FeatureCard sx={{ borderRadius: 2, minHeight: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 3 }}>
      <Typography variant="h6" gutterBottom>
        For Surfers
      </Typography>
      <Typography variant="body2">
        Quickly access all of your images and videos from surf sessions. No more searching through emails or folders – just log in and find your content.
      </Typography>
    </FeatureCard>
  </Grid>
  <Grid item xs={12} sm={6} md={4}>
    <FeatureCard sx={{ borderRadius: 2, minHeight: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 3 }}>
      <Typography variant="h6" gutterBottom>
        For Photographers
      </Typography>
      <Typography variant="body2">
        Upload your photos and videos to the platform with ease. No need to organize folders or send multiple emails – just upload, and surfers can access their media.
      </Typography>
    </FeatureCard>
  </Grid>
  <Grid item xs={12} sm={6} md={4}>
    <FeatureCard sx={{ borderRadius: 2, minHeight: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 3 }}>
      <Typography variant="h6" gutterBottom>
        Seamless Experience
      </Typography>
      <Typography variant="body2">
        Whether you're on the go or at home, access your content easily from any device. Our platform is designed to be fast, intuitive, and user-friendly.
      </Typography>
    </FeatureCard>
  </Grid>
</Grid>

      </Container>


    </>
  );
};

export default About;
