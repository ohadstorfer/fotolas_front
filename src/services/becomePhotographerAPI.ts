import axios from 'axios';

export function becomePhotographer(credentials: { user: number, about: string,  profile_image: string  }) {
  console.log(credentials);
  
  const MY_SERVER = 'http://127.0.0.1:8000/photographers/';
  return axios.post(MY_SERVER, credentials);
}



export function updatePhotographer(credentials: { photographerId: number, user: number, about: string, profile_image: string }) {
  console.log(credentials);
  
  const { photographerId, ...updateData } = credentials; // Extract the ID from the credentials
  
  const MY_SERVER = `http://127.0.0.1:8000/photographers/${photographerId}/`;
  
  return axios.put(MY_SERVER, updateData);
}
