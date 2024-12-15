import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useAppDispatch } from '../app/hooks';
import { refreshNavbarActtion, selectCredentials, selectExistedUseError, selectRefreshNavbar, selectSignUP, signUpAsync } from '../slicers/signUpSlice';
import { teal } from '@mui/material/colors';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginAsync, selectLoggedIn } from '../slicers/sighnInSlice';
import CircularProgress from '@mui/material/CircularProgress';
import { Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, } from '@mui/material';
import { FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import TermsForApprovment from './TermsForApprovment';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { setEmail } from '../slicers/purchaseSlice';


const defaultTheme = createTheme({
  palette: {
    background: {
      default: '#FFEEAD', // Set the default background color
    }
  },
});




export default function EmailForPayment() {
  const navigate = useNavigate();
  const existedUseError = useSelector(selectExistedUseError);
  const isLoggedIn222 = useSelector(selectLoggedIn);
  const dispatch = useAppDispatch();
  const refreshNavbarbool = useSelector(selectRefreshNavbar);

  // State for error messages
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false); // Loading state

  const [openTerms, setOpenTerms] = React.useState(false);
  const [isChecked, setIsChecked] = React.useState(false);
  const [changeToRed, setChangeToRed] = React.useState(false);





  useEffect(() => {
    if (isLoggedIn222) {
      navigate('/CartErrors');
    }
  }, [isLoggedIn222]);





  const validateForm = (data: FormData) => {
    const newErrors: { [key: string]: string } = {};
    const email = data.get("email") as string;
    const confirmEmail = data.get("confirmEmail") as string;

    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email address is invalid";
    if (email !== confirmEmail) newErrors.confirmEmail = "Emails must match";

    return newErrors;
  };






  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isChecked) {
      setChangeToRed(true);
      alert("Please agree to the terms and conditions before proceeding.");
      return;
    }

    const data = new FormData(event.currentTarget);
    const validationErrors = validateForm(data);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true); // Set loading to true
    const credentials = {
      email: data.get("email") as string,
    };

    try {
      dispatch (setEmail(credentials))
      
    } catch (error) {
      console.error('SignUp failed:', error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };







  const handleOpenTerms = () => setOpenTerms(true);
  const handleCloseTerms = () => setOpenTerms(false);






  return (
    <ThemeProvider theme={defaultTheme} >
      <Container component="main" maxWidth="xs" >
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: teal[400] }}>
            <AlternateEmailIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Email
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.5 }}>
            We need it to send your files.
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="confirmEmail"
                  label="Confirm Email Address"
                  name="confirmEmail"
                  autoComplete="email"
                  error={!!errors.confirmEmail}
                  helperText={errors.confirmEmail}
                />
              </Grid>




            </Grid>




            <Grid item xs={12}>
              <FormControl
                required
              >
                <Box
                  sx={{
                    mt: 2,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Checkbox
                    checked={isChecked}
                    onChange={(e) => setIsChecked(e.target.checked)}
                    sx={{
                      color: teal[400],
                      '&.Mui-checked': {
                        color: teal[400],
                      },
                    }}
                  />
                  <Typography
                    variant="body2"
                    color={changeToRed && !loading ? "red" : "textSecondary"}
                    onClick={handleOpenTerms}
                    sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Please read and approve our Terms and Conditions.
                  </Typography>
                </Box>
              </FormControl>
            </Grid>



            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: teal[400] }}
              disabled={loading} // Disable button when loading
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <>
                  Continue to checkout <ShoppingCartCheckoutIcon />
                </>
              )}
            </Button>
            
          </Box>
        </Box>
      </Container>






      





      {openTerms && (
        <Dialog
          open={openTerms}
          onClose={handleCloseTerms}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <TermsForApprovment></TermsForApprovment>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseTerms} autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      )}





    </ThemeProvider>




  );
}
