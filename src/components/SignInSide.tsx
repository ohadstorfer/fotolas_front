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
import { loginAsync, selectError, selectLoggedIn, selectToken } from '../slicers/sighnInSlice';
import { teal } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
import { getUserById } from '../slicers/userSlice';
import { getPhotographerByUserId } from '../slicers/profilePtgSlice';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { refreshNavbar } from '../slicers/signUpSlice';
import Container from '@mui/material/Container';



// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function SignInSide() {
    const dispatch = useAppDispatch();
    const navigate  = useNavigate();
    const storedToken = localStorage.getItem("token");
    const token = storedToken ? JSON.parse(storedToken) : null;
    const conectedUser = useSelector(selectToken)
    const isLoggedIn = useSelector(selectLoggedIn)
    const badRequest = useSelector(selectError);
    const [isLoading, setIsLoading] = React.useState(false);



    useEffect(() => {
      if (isLoggedIn===true) { 
        dispatch(refreshNavbar());
        navigate('/'); 
      }
    }, [isLoggedIn]);



  
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsLoading(true);
      const data = new FormData(event.currentTarget);
    
      const credentials = {
        email : (data.get("email") as string).toLowerCase(),
        password: data.get("password") as string,
      };
    
      try {
        await dispatch(loginAsync(credentials));
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error('Login failed:', error);
      }
    };




    const handleSignUp = () => {
      navigate('/SignUp');
    };
    const handleForgotPassword = () => {
      navigate('/RequestResetPassword');
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
              Sign in
            </Typography>
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
                error={!!badRequest}
                helperText={badRequest ? 'Incorrect email or password.' : ''}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                error={!!badRequest}
                helperText={badRequest ? 'Incorrect email or password.' : ''}
              />
              
              <Button
                type="submit"
                disabled={isLoading}
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, backgroundColor: teal[400] }}
              >
                {isLoading ? 'Loading...' : 'Sign In'}
                {/* Sign In */}
              </Button>
              <Grid container>
              <Grid item xs>
                {/* Link to Forgot Password */}
                <Link variant="body2" onClick={handleForgotPassword} style={{ cursor: 'pointer' }}>
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                {/* Link to Sign Up */}
                <Link variant="body2" onClick={handleSignUp} style={{ cursor: 'pointer' }}>
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    );
}