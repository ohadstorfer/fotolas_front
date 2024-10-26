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
import { loginAsync, passwordResetAsync, selectLoggedIn, selectPasswordChanged, selectToken } from '../slicers/sighnInSlice';
import { teal } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
import { getUserById } from '../slicers/userSlice';
import { getPhotographerByUserId } from '../slicers/profilePtgSlice';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { refreshNavbar } from '../slicers/signUpSlice';
import Container from '@mui/material/Container';



// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function ResetPasswordStep2() {
    const dispatch = useAppDispatch();
    const navigate  = useNavigate();
    const passwordChanged = useSelector(selectPasswordChanged)
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false); // Loading state
     // Extract the token from the query string
     const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');



    useEffect(() => {
      if (!token) {
        // Redirect the user or show an error if token is missing
        console.error('No token found in the URL');
        navigate('/');  // Redirect to home or error page
      }
    }, [token, navigate]);



  
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const validationErrors = validateForm(data);
    
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
    
      // Check if the token is null before proceeding
      if (!token) {
        setErrors({ token: "Token is missing or invalid." });
        return;
      }
    
      setLoading(true);
      setErrors({});
    
      const payload = {
        token, // Ensure token is a string
        password: data.get("password") as string,
      };
    
      // Dispatch the action with the payload
      try {
        await dispatch(passwordResetAsync(payload));
      } catch (error) {
        console.error('Password reset failed:', error);
      } finally {
        setLoading(false);
      }
    };
    




    const validateForm = (data: FormData) => {
      const newErrors: { [key: string]: string } = {};
  
      
      const password = data.get("password") as string;
      const confirmPassword = data.get("confirmPassword") as string;
  
      
      if (!password) newErrors.password = "Password is required";
      else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
  
      if (password !== confirmPassword) newErrors.confirmPassword = "Passwords must match";
  
      return newErrors;
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
  
            {!passwordChanged ? (
              <>
                <Typography component="h1" variant="h5">
                  Create a new password
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        error={!!errors.password}
                        helperText={errors.password}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        id="confirmPassword"
                        autoComplete="new-password"
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                      />
                    </Grid>
                  </Grid>
  
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2, backgroundColor: teal[400] }}
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Reset Password"}
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <Typography component="h1" variant="h5" sx={{ color: 'green' }}>
                  Password changed successfully!
                </Typography>
                <Typography component="p" variant="body2">
                  You can now log in with your new password.
                </Typography>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, backgroundColor: teal[400] }}
                  onClick={() => navigate('/SignIn')}
                >
                  Go to Sign In
                </Button>
              </>
            )}
          </Box>
        </Container>
      </ThemeProvider>
    );
  }