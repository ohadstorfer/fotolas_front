import React, { useState, useEffect } from 'react';
import { loadConnectAndInitialize, StripeConnectInstance } from '@stripe/connect-js';
import { ConnectPayouts, ConnectComponentsProvider, ConnectBalances, ConnectPayments, ConnectNotificationBanner, ConnectAccountManagement } from '@stripe/react-connect-js';
import { useSelector } from 'react-redux';
import { selectUser } from '../slicers/userSlice';
import { Box, Card } from '@mui/joy';
import { Button, Typography, useMediaQuery } from '@mui/material';
import { Navigate } from 'react-router-dom';
import { teal } from '@mui/material/colors';
import { selectSpanish } from '../slicers/sighnInSlice';

const VerificationAlerts = () => {
  // Explicitly typing state as either null or StripeConnectInstance
  const [stripeConnectInstance, setStripeConnectInstance] = useState<StripeConnectInstance | null>(null);
  const [hasContent, setHasContent] = useState(false);
  const user = useSelector(selectUser)
  const isMobile = useMediaQuery('(max-width:600px)');
  const [accountCreatePending, setAccountCreatePending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false)
  const spanish = useSelector(selectSpanish)
  const [accountLinkCreatePending, setAccountLinkCreatePending] = useState(false);
  

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const response = await fetch('https://oyster-app-b3323.ondigitalocean.app/create_account_session_for_alerts/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            connected_account_id: user?.stripe_account_id, // Replace with actual connected account ID
          }),
        });

        const data = await response.json();
        if (data.client_secret) {
          const stripeConnectInstance = await loadConnectAndInitialize({
            publishableKey: 'pk_live_51Q9vqBEA0SDQjG9L0iSug0YSg4HvtRkWjSAJRCpoZZIhPlSFL5hrQgjZ4e4y0oAiFHmNOfr4yFArcpESyVSzRhgb00ahskJ9qn',
            appearance: {
              variables: {
                colorBackground: '#f9f9f9',
                borderRadius: '8px',
                colorBorder: '#444444'
              }
            },

            fetchClientSecret: async () => data.client_secret,
          });

          setStripeConnectInstance(stripeConnectInstance);
        } else {
          console.error('Error fetching client secret:', data.error);
        }
      } catch (error) {
        console.error('Error during request:', error);
      }
    };

    fetchClientSecret();
  }, []);



  if (!stripeConnectInstance) {
    return <div>Loading...</div>;
  }


  
  if (user?.is_photographer === true) {
        return <Navigate to="/EditProfilePtg" />;
    }






    const createStripeAccountLink = async (stripeAccountId: string) => {
      try {
        setLoading(true);
        setAccountLinkCreatePending(true);
        setError(false);
    
        const response = await fetch("https://oyster-app-b3323.ondigitalocean.app/account_link/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ stripe_account_id: stripeAccountId }),
        });
    
        const json = await response.json();
        setAccountLinkCreatePending(false);
    
        const { url, error } = json;
        if (url) {
          window.location.href = url;
        } else if (error) {
          setError(true);
        }
      } catch (error) {
        setAccountLinkCreatePending(false);
        setError(true);
      } finally {
        setLoading(false);
      }
    };





    const handleButtonClick = () => {
      const stripeAccountId = user?.stripe_account_id;
      if (stripeAccountId) {
        createStripeAccountLink(stripeAccountId);
      } else {
        console.error("Stripe account ID is missing");
      }
    };


  return (
    


    <ConnectComponentsProvider connectInstance={stripeConnectInstance}>

      {/* Typography Message */}
      <Box
        sx={{
          width: isMobile ? '90%' : '50%',
          margin: '16px auto',
          textAlign: 'center', // Center-align the text
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Refresh the page to check for updates in your verification status.
        </Typography>
      </Box>




      <Button
              sx={{
                marginTop: '16px',
                backgroundColor: teal[400],
                color: 'white',
              }}
              onClick={handleButtonClick}
            >
              {spanish ? "¡Continúa con tu proceso de incorporación!" : "Continue with your onboarding process!"}
            </Button>


            

      <Box
        sx={{
          width: isMobile ? '90%' : '50%',
          margin: '0 auto',
          marginTop: '16px',
          display: 'flex', // Use flexbox for layout
        }}
      >
        <ConnectNotificationBanner
          collectionOptions={{
            fields: 'eventually_due',
            futureRequirements: 'include',
          }} />

      </Box>





      <Box
        sx={{
          width: isMobile ? '90%' : '50%',
          margin: '0 auto',
          marginTop: '16px',
          display: 'flex', // Use flexbox for layout
        }}
      >
        <Card
          orientation="horizontal"
          sx={{
            width: '100%',
            flexWrap: 'wrap',
            borderRadius: '16px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
          }}
        >

          <ConnectAccountManagement
            collectionOptions={{
              fields: 'eventually_due',
              futureRequirements: 'include',
            }}
          />
        </Card>
      </Box>


    </ConnectComponentsProvider>

  );
};

export default VerificationAlerts;
