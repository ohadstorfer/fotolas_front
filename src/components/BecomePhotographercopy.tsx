import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import { useAppDispatch } from '../app/hooks';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getPhotographerById, selectPhotographer } from '../slicers/photographerSlice';
import { teal } from '@mui/material/colors';
import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import SessAlbum from './SessAlbum';
import { sessGetDataAsync } from '../slicers/sessAlbumSlice';
import { getPhotographerByUserId, selectProfilePhotographer } from '../slicers/profilePtgSlice';
import { TextField, useMediaQuery } from '@mui/material';
import UploadButton from './UpdButton';
import { loginAsync, logout, selectSpanish, selectToken, toggleSpanish } from '../slicers/sighnInSlice';
import { becomePhotographerAsync, selectBecomePhotographer } from '../slicers/becomePhotographerSlice';
import { clearUser, selectUser } from '../slicers/userSlice';
import axios from 'axios';
import pica from 'pica';
import { fileTypeFromBuffer } from 'file-type';
import { Alert } from '@mui/joy';
import ReportIcon from '@mui/icons-material/Report';
import { clearPhotographer } from '../slicers/photographerSlice';
import LinearProgress from '@mui/joy/LinearProgress';
import { Dialog, DialogActions, DialogContent, DialogContentText, } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';




export default function UserCard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const photographer = useSelector(selectProfilePhotographer);
  const newPhotographer = useSelector(selectBecomePhotographer);
  const conectedUser = useSelector(selectToken)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [about, setAbout] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const isMobile = useMediaQuery('(max-width:600px)');
  const spanish = useSelector(selectSpanish)
  const [openMessage, setOpenMessage] = React.useState(false);
  const [message, setMessage] = useState<string | null>(null);
  

  const [accountCreatePending, setAccountCreatePending] = useState(false);
  const [accountLinkCreatePending, setAccountLinkCreatePending] = useState(false);
  const [error, setError] = useState(false);
  const [connectedAccountId, setConnectedAccountId] = useState();
  const [country, setCountry] = useState<string | undefined>(undefined);





  useEffect(() => {
    if (about) {
      handleSubmit();
    }
  }, [imageUrl]);



  useEffect(() => {
    
      console.log(country);
      
  }, [country]);


  useEffect(() => {
    if (newPhotographer === true) {
      handleLogOut();
      navigate('/SignIn');
    }
  }, [newPhotographer]);



  const handleLogOut = () => {
    dispatch(clearUser());
    dispatch(clearPhotographer());
    dispatch(logout());
  };


  const handleSubmitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const data = new FormData(e.currentTarget);
    const aboutText = data.get("About") as string;

    // Validate directly from form data
    if (!aboutText) {
      console.error('Write something about yourself');
      handleOpenMessage(spanish ? 'Escribe algo sobre ti' : 'Write something about yourself');
      setIsLoading(false);
      return;
    }

    if (!selectedFile) {
      console.error('Select a profile picture');
      handleOpenMessage(spanish ? 'Selecciona una foto de perfil' : 'Select a profile picture');
      setIsLoading(false);
      return;
    }

    // Set 'about' after validation
    setAbout(aboutText);

    await uploadImage(e as any);
  };






  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    if (e.target.files && e.target.files.length > 0) {
      if (e.target.files.length > 1) {
        setFileError('Please select only one image.');
        setSelectedFile(null);
        setImagePreview(null);
        return;
      }

      const file = e.target.files[0];
      const bytesToRead = 4100; // Define the number of bytes to read from the start of the file

      // Read the first `bytesToRead` bytes of the file
      const buffer = await file.slice(0, bytesToRead).arrayBuffer();
      const type = await fileTypeFromBuffer(new Uint8Array(buffer));

      // Check if the file type is an image and either JPEG or PNG
      if (!type || (type.mime !== 'image/jpeg' && type.mime !== 'image/png')) {
        setFileError('Please select only JPEG or PNG images.');
        setSelectedFile(null);
        setImagePreview(null);
      } else {
        setFileError(null);
        setSelectedFile(file);
        setImagePreview(URL.createObjectURL(file));
      }
    } else {
      setFileError('No file selected.');
      setSelectedFile(null);
      setImagePreview(null);
    }
  };










  const compressImage = async (file: File): Promise<File> => {
    const picaInstance = pica();
    const img = new Image();
    img.src = URL.createObjectURL(file);
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
    });

    const targetHeight = 480;
    const aspectRatio = img.width / img.height;
    const targetWidth = Math.round(targetHeight * aspectRatio);

    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = img.width;
    offscreenCanvas.height = img.height;

    const ctx = offscreenCanvas.getContext('2d');
    if (!ctx) {
      setUploadError('Upload failed. Please try again later.');
      throw new Error('Canvas context not available');
    }

    ctx.drawImage(img, 0, 0, offscreenCanvas.width, offscreenCanvas.height);

    const compressedCanvas = document.createElement('canvas');
    compressedCanvas.width = targetWidth;
    compressedCanvas.height = targetHeight;

    await picaInstance.resize(offscreenCanvas, compressedCanvas, {
      quality: 3,
      unsharpAmount: 0,
      unsharpRadius: 0,
      unsharpThreshold: 0,
    });

    return new Promise((resolve, reject) => {
      compressedCanvas.toBlob((blob) => {
        if (blob) {
          const compressedFile = new File([blob], `compressed_${file.name}`, { type: 'image/jpeg' });
          resolve(compressedFile);
        } else {
          reject(new Error('Blob creation failed'));
          setUploadError('Upload failed. Please try again later.');
        }
      }, 'image/jpeg', 0.8);
    });
  };








  const uploadToS3 = async (file: File): Promise<string> => {
    const response = await axios.get(`https://oyster-app-b3323.ondigitalocean.app/presigned_urls_for_profile_pictures?num_urls=1`);
    const presignedUrl = response.data.urls[0];

    await axios.put(presignedUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
    });

    return presignedUrl.split('?')[0];
  };







  const uploadImage = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> => {
    e.preventDefault();
    // setIsLoading(true);

    try {
      if (selectedFile) {
        const compressedFile = await compressImage(selectedFile);
        const s3Url = await uploadToS3(compressedFile);
        setImageUrl(s3Url);
        // setImagePreview(null);
      }
    } catch (error) {
      console.error(error);
    } finally {
    }
  };







  const handleSubmit = async () => {
    const credentials = {
      about: String(about),
      user: Number(conectedUser!.id),
      profile_image: String(imageUrl),
    };

    try {
      console.log(credentials);
      const resultAction = await dispatch(becomePhotographerAsync(credentials));

      // Check if the action was fulfilled or rejected
      if (becomePhotographerAsync.fulfilled.match(resultAction)) {
        console.log('Photographer created successfully');
      } else if (becomePhotographerAsync.rejected.match(resultAction)) {
        throw new Error('Error creating photographer');
      }
    } catch (error) {
      setUploadError('Upload failed. Please try again later.');
      console.error('Error creating photographer:', error);
    } finally {
      setIsLoading(false);
    }
  };





  const handleCancelUpload = () => {
    const confirmCancel = window.confirm("Are you sure you want to cancel the upload?");

    if (confirmCancel) {
      setFileError(null);
      setUploadError(null);
      setAbout(null);
      setSelectedFile(null);
      navigate('/');
    }
  };







  const handleOpenMessage = (msg: string) => {
    setMessage(msg);
    setOpenMessage(true);
  };

  const handleCloseMessage = () => {
    setOpenMessage(false);
  };


  const setSpanish = () => {
    dispatch(toggleSpanish());
  };





  interface CountryType {
    code: string;
    label: string;
    phone: string;
    suggested?: boolean;
  }





  const explanationText = spanish
    ? "Estás a punto de crear una cuenta de fotógrafo. Para ello, necesitarás proporcionar los detalles de tu cuenta bancaria para que puedas vender fotos y videos, y recibir pagos. También deberás seleccionar el país de tu cuenta bancaria."
    : "You are about to create a photographer account. To do so, you will need to provide your bank account details so you will be able to sell photos and videos and receive payments. You will also need to select the country of your bank account.";





  const countries: readonly CountryType[] = [
    { code: 'SV', label: 'El Salvador', phone: '503' },
    { code: 'AL', label: 'Albania', phone: '355' },
    { code: 'DZ', label: 'Algeria', phone: '213' },
    { code: 'AO', label: 'Angola', phone: '244' },
    { code: 'AG', label: 'Antigua & Barbuda', phone: '1-268' },
    { code: 'AR', label: 'Argentina', phone: '54' },
    { code: 'AM', label: 'Armenia', phone: '374' },
    { code: 'AU', label: 'Australia', phone: '61' },
    { code: 'AT', label: 'Austria', phone: '43' },
    { code: 'AZ', label: 'Azerbaijan', phone: '994' },
    { code: 'BS', label: 'Bahamas', phone: '1-242' },
    { code: 'BH', label: 'Bahrain', phone: '973' },
    { code: 'BD', label: 'Bangladesh', phone: '880' },
    { code: 'BE', label: 'Belgium', phone: '32' },
    { code: 'BJ', label: 'Benin', phone: '229' },
    { code: 'BT', label: 'Bhutan', phone: '975' },
    { code: 'BO', label: 'Bolivia', phone: '591' },
    { code: 'BA', label: 'Bosnia & Herzegovina', phone: '387' },
    { code: 'BW', label: 'Botswana', phone: '267' },
    { code: 'BN', label: 'Brunei', phone: '673' },
    { code: 'BG', label: 'Bulgaria', phone: '359' },
    { code: 'KH', label: 'Cambodia', phone: '855' },
    { code: 'CA', label: 'Canada', phone: '1', suggested: true },
    { code: 'CL', label: 'Chile', phone: '56' },
    { code: 'CO', label: 'Colombia', phone: '57' },
    { code: 'CR', label: 'Costa Rica', phone: '506' },
    { code: 'CI', label: 'Côte d’Ivoire', phone: '225' },
    { code: 'HR', label: 'Croatia', phone: '385' },
    { code: 'CY', label: 'Cyprus', phone: '357' },
    { code: 'CZ', label: 'Czech Republic', phone: '420' },
    { code: 'DK', label: 'Denmark', phone: '45' },
    { code: 'DO', label: 'Dominican Republic', phone: '1-809' },
    { code: 'EC', label: 'Ecuador', phone: '593' },
    { code: 'EG', label: 'Egypt', phone: '20' },
    { code: 'EE', label: 'Estonia', phone: '372' },
    { code: 'ET', label: 'Ethiopia', phone: '251' },
    { code: 'FI', label: 'Finland', phone: '358' },
    { code: 'FR', label: 'France', phone: '33', suggested: true },
    { code: 'GA', label: 'Gabon', phone: '241' },
    { code: 'GM', label: 'Gambia', phone: '220' },
    { code: 'DE', label: 'Germany', phone: '49', suggested: true },
    { code: 'GH', label: 'Ghana', phone: '233' },
    { code: 'GR', label: 'Greece', phone: '30' },
    { code: 'GT', label: 'Guatemala', phone: '502' },
    { code: 'GY', label: 'Guyana', phone: '592' },
    { code: 'HK', label: 'Hong Kong', phone: '852' },
    { code: 'HU', label: 'Hungary', phone: '36' },
    { code: 'IS', label: 'Iceland', phone: '354' },
    { code: 'IN', label: 'India', phone: '91' },
    { code: 'ID', label: 'Indonesia', phone: '62' },
    { code: 'IE', label: 'Ireland', phone: '353' },
    { code: 'IL', label: 'Israel', phone: '972' },
    { code: 'IT', label: 'Italy', phone: '39' },
    { code: 'JM', label: 'Jamaica', phone: '1-876' },
    { code: 'JP', label: 'Japan', phone: '81', suggested: true },
    { code: 'JO', label: 'Jordan', phone: '962' },
    { code: 'KZ', label: 'Kazakhstan', phone: '7' },
    { code: 'KE', label: 'Kenya', phone: '254' },
    { code: 'KW', label: 'Kuwait', phone: '965' },
    { code: 'LA', label: 'Laos', phone: '856' },
    { code: 'LV', label: 'Latvia', phone: '371' },
    { code: 'LI', label: 'Liechtenstein', phone: '423' },
    { code: 'LT', label: 'Lithuania', phone: '370' },
    { code: 'LU', label: 'Luxembourg', phone: '352' },
    { code: 'MO', label: 'Macao SAR China', phone: '853' },
    { code: 'MG', label: 'Madagascar', phone: '261' },
    { code: 'MY', label: 'Malaysia', phone: '60' },
    { code: 'MT', label: 'Malta', phone: '356' },
    { code: 'MU', label: 'Mauritius', phone: '230' },
    { code: 'MX', label: 'Mexico', phone: '52' },
    { code: 'MD', label: 'Moldova', phone: '373' },
    { code: 'MC', label: 'Monaco', phone: '377' },
    { code: 'MN', label: 'Mongolia', phone: '976' },
    { code: 'MA', label: 'Morocco', phone: '212' },
    { code: 'MZ', label: 'Mozambique', phone: '258' },
    { code: 'NA', label: 'Namibia', phone: '264' },
    { code: 'NL', label: 'Netherlands', phone: '31' },
    { code: 'NZ', label: 'New Zealand', phone: '64' },
    { code: 'NE', label: 'Niger', phone: '227' },
    { code: 'NG', label: 'Nigeria', phone: '234' },
    { code: 'MK', label: 'North Macedonia', phone: '389' },
    { code: 'NO', label: 'Norway', phone: '47' },
    { code: 'OM', label: 'Oman', phone: '968' },
    { code: 'PK', label: 'Pakistan', phone: '92' },
    { code: 'PA', label: 'Panama', phone: '507' },
    { code: 'PY', label: 'Paraguay', phone: '595' },
    { code: 'PE', label: 'Peru', phone: '51' },
    { code: 'PH', label: 'Philippines', phone: '63' },
    { code: 'PL', label: 'Poland', phone: '48' },
    { code: 'PT', label: 'Portugal', phone: '351' },
    { code: 'QA', label: 'Qatar', phone: '974' },
    { code: 'RO', label: 'Romania', phone: '40' },
    { code: 'RW', label: 'Rwanda', phone: '250' },
    { code: 'SM', label: 'San Marino', phone: '378' },
    { code: 'SA', label: 'Saudi Arabia', phone: '966' },
    { code: 'SN', label: 'Senegal', phone: '221' },
    { code: 'RS', label: 'Serbia', phone: '381' },
    { code: 'SG', label: 'Singapore', phone: '65' },
    { code: 'SK', label: 'Slovakia', phone: '421' },
    { code: 'SI', label: 'Slovenia', phone: '386' },
    { code: 'ZA', label: 'South Africa', phone: '27' },
    { code: 'KR', label: 'South Korea', phone: '82' },
    { code: 'ES', label: 'Spain', phone: '34' },
    { code: 'LK', label: 'Sri Lanka', phone: '94' },
    { code: 'LC', label: 'St. Lucia', phone: '1-758' },
    { code: 'SE', label: 'Sweden', phone: '46' },
    { code: 'CH', label: 'Switzerland', phone: '41' },
    { code: 'TW', label: 'Taiwan', phone: '886' },
    { code: 'TZ', label: 'Tanzania', phone: '255' },
    { code: 'TH', label: 'Thailand', phone: '66' },
    { code: 'TT', label: 'Trinidad & Tobago', phone: '1-868' },
    { code: 'TN', label: 'Tunisia', phone: '216' },
    { code: 'TR', label: 'Turkey', phone: '90' },
    { code: 'AE', label: 'United Arab Emirates', phone: '971' },
    { code: 'GB', label: 'United Kingdom', phone: '44', suggested: true },
    { code: 'US', label: 'United States', phone: '1', suggested: true, },
    { code: 'UY', label: 'Uruguay', phone: '598' },
    { code: 'UZ', label: 'Uzbekistan', phone: '998' },
    { code: 'VN', label: 'Vietnam', phone: '84' }
  ];












  return (
    <div>


      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            marginBottom: '15px',
          }}
        >
          <Typography>Change Language:</Typography>

          <Button
            variant="outlined"
            onClick={() => setSpanish()}
            disabled={!spanish}
            sx={{
              backgroundColor: !spanish ? teal[400] : 'inherit',  // Set teal if English is selected
              color: !spanish ? 'white' : 'inherit',  // White text when English is selected
              '&:disabled': {
                backgroundColor: teal[400],  // Teal background when disabled
                color: 'white',
              },
            }}
          >
            English
          </Button>

          <Button
            variant="outlined"
            onClick={() => setSpanish()}
            disabled={spanish}
            sx={{
              backgroundColor: spanish ? teal[400] : 'inherit',  // Set teal if Spanish is selected
              color: spanish ? 'white' : 'inherit',  // White text when Spanish is selected
              '&:disabled': {
                backgroundColor: teal[400],  // Teal background when disabled
                color: 'white',
              },
            }}
          >
            Español
          </Button>
        </Box>
      </Box>









      {fileError && (
        <Alert
          variant="outlined"
          color="danger"
          startDecorator={<ReportIcon />}
          sx={{
            maxWidth: isMobile ? '90%' : '420px',
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <Typography>{fileError}</Typography>
        </Alert>
      )}

      {uploadError && (
        <Alert
          variant="outlined"
          color="danger"
          startDecorator={<ReportIcon />}
          sx={{
            maxWidth: isMobile ? '90%' : '420px',
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <Typography>{uploadError}</Typography>
        </Alert>
      )}



      {isLoading &&
        <Alert
          variant="soft"
          color="success"
          invertedColors

          sx={{
            maxWidth: isMobile ? '90%' : '400px',
            margin: '0 auto', // Center horizontally
            textAlign: 'center',
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: '25px' }}>
              {spanish ? 'Subiendo...' : 'Uploading...'}
            </Typography>
          </Box>
          <LinearProgress
            variant="solid"
            color="success"
            value={40}
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              borderRadius: 0,
            }}
          />
        </Alert>
      }


      {openMessage && (
        <Dialog
          open={openMessage}
          onClose={handleCloseMessage}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {message} {/* Display the message from state */}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseMessage} autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      )}












      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '50%',
        margin: '0 auto'
      }}>
        <div className="banner">
          <h2>SurfPik</h2>
        </div>
        <div className="content">
          {/* Display the explanation */}
          <p>{explanationText}</p>

          <Autocomplete
            id="country-select-demo"
            sx={{ width: '70%', margin: '0 auto' }}
            options={countries}
            autoHighlight
            getOptionLabel={(option) => option.label}
            onChange={(event, value) => {
              if (value) {
                setCountry(value.code);
              } else {
                // Clear the country state if the selection is cleared
                setCountry(undefined);
              }
            }}
            renderOption={(props, option) => {
              const { key, ...optionProps } = props;
              return (
                <Box
                  key={key}
                  component="li"
                  sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                  {...optionProps}
                >
                  <img
                    loading="lazy"
                    width="20"
                    srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                    src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                    alt=""
                  />
                  {option.label} ({option.code})
                </Box>
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Choose a country"
                InputProps={{
                  ...params.InputProps,
                  autoComplete: 'new-password', // disable autocomplete and autofill
                }}
              />
            )}
          />

          {!accountCreatePending && !connectedAccountId && (
            <Button
            sx={{
              marginTop: '16px',
              backgroundColor: teal[400],
              color: 'white', 
            }}
              onClick={async () => {
                setAccountCreatePending(true);
                setError(false);
                fetch("http://127.0.0.1:8000/account/", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ Country: country, user_id: conectedUser?.id }),
                })
                  .then((response) => response.json())
                  .then((json) => {
                    setAccountCreatePending(false);
                    const { account, error } = json;
                    if (account) {
                      setConnectedAccountId(account);
                    }
                    if (error) {
                      setError(true);
                    }
                  })
                  .catch(() => {
                    setAccountCreatePending(false);
                    setError(true);
                  });
              }}
              disabled={!country}
            >
              {spanish ? "¡Crear cuenta!" : "Create an account!"}
            </Button>
          )}



          {connectedAccountId && !accountLinkCreatePending && (
            <button
              onClick={async () => {
                setAccountLinkCreatePending(true);
                setError(false);
                // fetch("https://oyster-app-b3323.ondigitalocean.app/account_link/", {
                fetch("http://127.0.0.1:8000/account_link/", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    account: connectedAccountId,
                  }),
                })
                  .then((response) => response.json())
                  .then((json) => {
                    setAccountLinkCreatePending(false);
                    const { url, error } = json;
                    if (url) {
                      window.location.href = url;
                    }
                    if (error) {
                      setError(true);
                    }
                  })
                  .catch(() => {
                    setAccountLinkCreatePending(false);
                    setError(true);
                  });
              }}
            >
              {spanish ? "Agregar información" : "Add information"}
            </button>
          )}
          {error && <p className="error">{spanish ? "¡Algo salió mal!" : "Something went wrong!"}</p>}
          {(connectedAccountId || accountCreatePending || accountLinkCreatePending) && (
            <div className="dev-callout">
              {connectedAccountId && <p>{spanish ? "Tu ID de cuenta conectada es: " : "Your connected account ID is: "} <code className="bold">{connectedAccountId}</code></p>}
              {accountCreatePending && <p>{spanish ? "Creando una cuenta conectada..." : "Creating a connected account..."}</p>}
              {accountLinkCreatePending && <p>{spanish ? "Creando un nuevo enlace de cuenta..." : "Creating a new Account Link..."}</p>}
            </div>
          )}
        </div>
      </Box>


    </div>


  );

}