import axios from 'axios';


export function uploadingToCloudinary(formData:{}) {
    const MY_SERVER = 'http://api.cloudinary.com/v1_1/dauupwecm/image/upload';
  return axios.post(MY_SERVER, formData);
}
    