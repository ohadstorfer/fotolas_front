import React, { useState, useEffect } from 'react';
import { loadConnectAndInitialize, StripeConnectInstance } from '@stripe/connect-js';
import { ConnectPayouts, ConnectComponentsProvider } from '@stripe/react-connect-js';
import { useSelector } from 'react-redux';
import { selectUser } from '../slicers/userSlice';

const App = () => {
  // Explicitly typing state as either null or StripeConnectInstance
  const [stripeConnectInstance, setStripeConnectInstance] = useState<StripeConnectInstance | null>(null);
  const user = useSelector(selectUser)
  console.log(user);
  

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        console.log(user);
        // const response = await fetch('https://oyster-app-b3323.ondigitalocean.app/create_account_session/', {
        const response = await fetch('http://127.0.0.1:8000/create_account_session/', {
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
      <ConnectPayouts />
    </ConnectComponentsProvider>
  );
};

export default App;
