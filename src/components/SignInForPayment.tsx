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
import { refreshNavbarActtion } from '../slicers/signUpSlice';
import Container from '@mui/material/Container';
import { FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';



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
    const [showPassword, setShowPassword] = React.useState(false);



    useEffect(() => {
      if (isLoggedIn===true) { 
        dispatch(refreshNavbarActtion());
        navigate('/CartErrors'); 
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
      navigate('/SignUpForPayment');
    };
    const handleForgotPassword = () => {
      navigate('/RequestResetPassword');
    };




    const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
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
              <FormControl
              required
              fullWidth
              variant="outlined"
            >
              <InputLabel htmlFor="password">Password</InputLabel>
              <OutlinedInput
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                label="Password"
                autoComplete="current-password"
                error={!!badRequest}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword ? 'hide the password' : 'display the password'
                      }
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      onMouseUp={handleMouseUpPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {/* Display helper text for errors */}
              {badRequest && (
                <FormHelperText error>
                  Incorrect email or password.
                </FormHelperText>
              )}
            </FormControl>
              
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