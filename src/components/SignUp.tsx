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


const defaultTheme = createTheme({
  palette: {
    background: {
      default: '#FFEEAD', // Set the default background color
    }
  },
});

export default function SignUp() {
  const navigate = useNavigate();
  const existedUseError = useSelector(selectExistedUseError);
  const isLoggedIn222 = useSelector(selectLoggedIn);
  const dispatch = useAppDispatch();
  const refreshNavbarbool = useSelector(selectRefreshNavbar);

  // State for error messages
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    if (isLoggedIn222) {
      navigate('/');
    }
  }, [isLoggedIn222]);


  useEffect(() => {
    if (existedUseError) {
      console.log(existedUseError);
  
      // Check if the error message is related to email already registered
      if (existedUseError.includes("Request failed with status code 400")) {
        alert("This email is already registered. Please use a different email address.");
      }
    }
  }, [existedUseError]);


  const validateForm = (data: FormData) => {
    const newErrors: { [key: string]: string } = {};

    const firstName = data.get("firstName") as string;
    const lastName = data.get("lastName") as string;
    const email = data.get("email") as string;
    const confirmEmail = data.get("confirmEmail") as string;
    const password = data.get("password") as string;
    const confirmPassword = data.get("confirmPassword") as string;

    if (!firstName) newErrors.firstName = "First name is required";
    if (!lastName) newErrors.lastName = "Last name is required";
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email address is invalid";

    if (email !== confirmEmail) newErrors.confirmEmail = "Emails must match";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";

    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords must match";

    return newErrors;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const validationErrors = validateForm(data);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true); // Set loading to true
    const credentials = {
      email: data.get("email") as string,
      fullName: `${data.get("firstName")} ${data.get("lastName")}`.trim(),
      password: data.get("password") as string,
    };

    try {
      await dispatch(signUpAsync(credentials));
      await dispatch(loginAsync({
        email: data.get("email") as string,
        password: data.get("password") as string,
      }));
      dispatch(refreshNavbarActtion());
    } catch (error) {
      console.error('SignUp failed:', error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };




  const handleSignIn = () => {
    navigate('/SignIn');
  };




  return (
    <ThemeProvider theme={defaultTheme} >
      <Container component="main" maxWidth="xs" >
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: teal[400] }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                />
              </Grid>
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
              disabled={loading} // Disable button when loading
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"} {/* Show loading indicator */}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="#" variant="body2" onClick={handleSignIn}>
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
