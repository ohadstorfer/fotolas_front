import axios from 'axios';

export function login(credentials: { email: string, password: string }) {
  const MY_SERVER = 'https://9km-curious-mach.circumeo-apps.net/api/token/';
  return axios.post(MY_SERVER, credentials);
}




export async function validateToken(token: string): Promise<boolean> {
  const MY_SERVER = 'https://9km-curious-mach.circumeo-apps.net/validate-token/';

  
    const response = await axios.get(MY_SERVER, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    // Assuming your API responds with a JSON object { valid: true }
    return response.data.valid;
  }





  // Function to handle password reset request
export function passwordResetRequest(email: { email: string }) {
  const MY_SERVER = 'https://9km-curious-mach.circumeo-apps.net/password-reset-request/';
  return axios.post(MY_SERVER, email);
}



// Function to handle the password reset with token
export function passwordReset(data: { token: string; password: string }) {
  const MY_SERVER = 'https://9km-curious-mach.circumeo-apps.net/password-reset/';
  return axios.post(MY_SERVER, data);
}