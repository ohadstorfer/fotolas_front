import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useAppDispatch } from '../app/hooks';
import { loginAsync, passwordResetRequestAsync, selectEmailSent, selectError, selectLoggedIn, selectToken } from '../slicers/sighnInSlice';
import { teal } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
import { getUserById } from '../slicers/userSlice';
import { getPhotographerByUserId } from '../slicers/profilePtgSlice';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { refreshNavbarActtion } from '../slicers/signUpSlice';
import Container from '@mui/material/Container';



// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function ResetPassword() {
    const dispatch = useAppDispatch();
    const navigate  = useNavigate();
    const storedToken = localStorage.getItem("token");
    const token = storedToken ? JSON.parse(storedToken) : null;
    const conectedUser = useSelector(selectToken)
    const isLoggedIn = useSelector(selectLoggedIn)
    const emailSent = useSelector(selectEmailSent);
    const errorSendingEmail = useSelector(selectError);
    const [isLoading, setIsLoading] = useState(false);



    useEffect(() => {
      if (isLoggedIn===true) { 
        console.log("isLoggedIn===true");
        
        dispatch(refreshNavbarActtion());
        navigate('/'); 
      }
    }, [isLoggedIn]);



  
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsLoading(true);
      const data = new FormData(event.currentTarget);
    
      const credentials = {
        email: data.get("email") as string,
      };
    
      try {
        await dispatch(passwordResetRequestAsync(credentials));
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error('Login failed:', error);
      }
    };


    

    return (
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: teal[400] }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              {emailSent ? 'Check Your Email' : 'Reset Password'}
            </Typography>

            {emailSent ? (
              <Typography component="p" variant="body1" align="center" sx={{ mt: 2 }}>
                We have sent a password reset link to your email. Please check your inbox and follow the instructions to reset your password.
              </Typography>
            ) : (
              <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  error={!!errorSendingEmail}
                  helperText={errorSendingEmail ? 'No user found with this email. Please check your email or sign up.' : ''}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading}
                  sx={{ mt: 3, mb: 2, backgroundColor: teal[400] }}
                >
                  {isLoading ? 'Loading...' : 'Send Email'}
                  {/* Send Email */}
                </Button>
                <Grid container>
                  <Grid item>
                    <Link href="/SignUp" variant="body2">
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        </Container>
      </ThemeProvider>
    );
}