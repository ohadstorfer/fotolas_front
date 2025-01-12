import React, { useState, useEffect } from 'react';
import { loadConnectAndInitialize, StripeConnectInstance } from '@stripe/connect-js';
import { ConnectPayouts, ConnectComponentsProvider, ConnectBalances, ConnectPayments } from '@stripe/react-connect-js';
import { useSelector } from 'react-redux';
import { selectUser } from '../slicers/userSlice';
import { Box } from '@mui/joy';
import { useMediaQuery } from '@mui/material';
import DashboardPhotographer from './DashboardPhotographer';

const App = () => {
  // Explicitly typing state as either null or StripeConnectInstance
  const [stripeConnectInstance, setStripeConnectInstance] = useState<StripeConnectInstance | null>(null);
  const user = useSelector(selectUser)
  const isMobile = useMediaQuery('(max-width:600px)');
  console.log(user);


  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        console.log(user);
        const response = await fetch('https://oyster-app-b3323.ondigitalocean.app/create_account_session/', {
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
            publishableKey: 'pk_live_51Q9vqBEA0SDQjG9L0iSug0YSg4HvtRkWjSAJRCpoZZIhPlSFL5hrQgjZ4e4y0oAiFHmNOfr4yFArcpESyVSzRhgb00ahskJ9qn', // Replace with your Stripe publishable key
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

  return (

    <><ConnectComponentsProvider connectInstance={stripeConnectInstance}>
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <div style={{
          maxWidth: '100%',
          overflowX: 'hidden',
          width: isMobile ? '95%' : '70%',
          border: '2px solid rgba(0, 0, 0, 0.2)', // Thin border with semi-transparency
          borderRadius: '10px', // Rounded corners
          padding: '10px', // Optional padding inside the div
          backgroundColor: '#f9f9f9',
        }}>
          <ConnectBalances />
          {/* <ConnectPayments /> */}
        </div>
      </div>
    </ConnectComponentsProvider>
    
    <br></br>
    <DashboardPhotographer></DashboardPhotographer></>


  );
};

export default App;
