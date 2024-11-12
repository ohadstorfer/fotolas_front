import React, { useState, useEffect } from 'react';
import { loadConnectAndInitialize, StripeConnectInstance } from '@stripe/connect-js';
import { ConnectPayouts, ConnectComponentsProvider, ConnectBalances, ConnectPayments, ConnectNotificationBanner, ConnectAccountManagement } from '@stripe/react-connect-js';
import { useSelector } from 'react-redux';
import { selectUser } from '../slicers/userSlice';
import { Box } from '@mui/joy';

const VerificationAlerts = () => {
  // Explicitly typing state as either null or StripeConnectInstance
  const [stripeConnectInstance, setStripeConnectInstance] = useState<StripeConnectInstance | null>(null);
  const [hasContent, setHasContent] = useState(false);
  const user = useSelector(selectUser)
  console.log(user);


  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        console.log(user);
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

    <ConnectComponentsProvider connectInstance={stripeConnectInstance}>


  {stripeConnectInstance && (
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <div style={{
          width: '70%',
          border: '2px solid rgba(0, 0, 0, 0.2)',
          borderRadius: '10px',
          padding: '10px',
          backgroundColor: '#f9f9f9',
        }}>
          <ConnectNotificationBanner
          />
        </div>
      </div>
    )}


<div style={{ display: 'flex', justifyContent: 'center', width: '100%', backgroundColor: '#FFEEAD', }}>
  <div style={{
    width: '70%',
    marginTop: '20px',
    backgroundColor: '#FFEEAD',  // Adding the background color
  }}>
    <ConnectAccountManagement
      collectionOptions={{
        fields: 'eventually_due',
        futureRequirements: 'include',
      }}
    />
  </div>
</div>


    </ConnectComponentsProvider>

  );
};

export default VerificationAlerts;
