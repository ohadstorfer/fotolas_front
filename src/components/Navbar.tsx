import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { teal, orange } from '@mui/material/colors';
import { GiSurferVan } from "react-icons/gi";
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks';
import { logout, parseJwt, selectIsExpired, selectLoggedIn, selectToken, validateTokenAsync  } from '../slicers/sighnInSlice';
import { Autocomplete, Avatar, InputAdornment, TextField, useMediaQuery } from '@mui/material';
import { useSelector } from 'react-redux';
import { getPhotographerByUserId, selectProfilePhotographer } from '../slicers/profilePtgSlice';
import { useEffect, useState } from 'react';
import { clearUser, getUserById, selectUser } from '../slicers/userSlice';
import { clearPhotographer } from '../slicers/photographerSlice';
import { selectSessAlbums } from '../slicers/sessAlbumSlice';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { selectCartTotalItems } from '../slicers/cartSlice';
import { selectRefreshNavbar } from '../slicers/signUpSlice';
import { fetchSurferPurchasedItemsAsync } from '../slicers/purchaseSlice';
import { getAllSpots, selectAllSpots } from '../slicers/spotSlice';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { refreshNavbarActtion } from '../slicers/signUpSlice';



const iconContainerStyle = {
  textDecoration: 'none', // Remove text decoration
  color: 'inherit', // Inherit color from parent
};

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));











// Styled InputAdornment to position the SearchIcon
const AutocompleteIconWrapper = styled(InputAdornment)(({ theme }) => ({
  padding: theme.spacing(0, 0),
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white', // Set icon color if needed
}));






const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: teal[400], // Set the background color to teal[400]
}));











export default function PrimarySearchAppBar() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // const storedToken = localStorage.getItem("token");
  // const token = storedToken ? JSON.parse(storedToken) : null;
  const photographer = useSelector(selectProfilePhotographer);
  const user = useSelector(selectUser)
  const isLoggedIn = useSelector(selectLoggedIn)
  const sessAlbum = useSelector(selectSessAlbums);
  const totalImages = useSelector(selectCartTotalItems)
  const refreshNavbar = useSelector(selectRefreshNavbar)
  const conectedUser = useSelector(selectToken)
  const surferId = Number(conectedUser?.id);
  const allSpots = useSelector(selectAllSpots);
  const [selectedSpot, setSelectedSpot] = useState<any | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const isMobile = useMediaQuery('(max-width:600px)');
  const isExpired = useSelector(selectIsExpired);


  useEffect(() => {
    dispatch(getUserById(Number(conectedUser?.id)));
    // if(conectedUser?.is_photographer){dispatch(getPhotographerByUserId(Number(conectedUser?.id)));}
    const accessToken = conectedUser?.access
    const tokenString = typeof accessToken === 'string' ? accessToken : JSON.stringify(accessToken || '');
    const tokenValue = tokenString.replace(/"/g, '');

    dispatch(getPhotographerByUserId({ userId: Number(conectedUser?.id), token: tokenValue }));
    dispatch(getAllSpots());
  }
    , [refreshNavbar, isLoggedIn]);





    // useEffect(() => {
    //   const storedToken = localStorage.getItem('token');
    //   let token = storedToken ? JSON.parse(storedToken) : null;
    
    //   if (user?.is_photographer && token && token.is_photographer === false) {
    //     // Update the token's `is_photographer` to true and save it back to local storage
    //     token.is_photographer = true;
    //     localStorage.setItem('token', JSON.stringify(token));
    //   }
    
    //   if (conectedUser?.id) {
    //     const accessToken = conectedUser.access;
    //     const tokenValue = typeof accessToken === 'string' ? accessToken : JSON.stringify(accessToken || '').replace(/"/g, '');
    
    //     dispatch(getPhotographerByUserId({ userId: Number(conectedUser.id), token: tokenValue }));
    //   }
    // }, [dispatch, user]);





    useEffect(() => {
      const storedToken = localStorage.getItem('token');
      let token = storedToken ? JSON.parse(storedToken) : null;
    
      if (user?.is_photographer) {
        if (token && token.is_photographer === false) {
          // Update the token's `is_photographer` to true and save it back to local storage
          token.is_photographer = true;
          localStorage.setItem('token', JSON.stringify(token));
    
          // Dispatch refreshNavbar
          dispatch(refreshNavbarActtion());
        }
      }
    
      if (conectedUser?.id) {
        const accessToken = conectedUser.access;
        const tokenValue = typeof accessToken === 'string' ? accessToken : JSON.stringify(accessToken || '').replace(/"/g, '');
    
        dispatch(getPhotographerByUserId({ userId: Number(conectedUser.id), token: tokenValue }));
      }

      
    }, [dispatch, user]);







  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleSignUp = () => {
    handleMenuClose()
    navigate('/SignUp');
  };

  const handleSignIn = () => {
    handleMenuClose()
    navigate('/SignIn');
  };

  const handleCart = () => {
    navigate('/CartErrors');
    // navigate('/Cart');
  };


  const handleValidateLogIn = () => {
    if (conectedUser) {
      const accessToken = conectedUser?.access
      const tokenString = typeof accessToken === 'string' ? accessToken : JSON.stringify(accessToken || '');
      const tokenValue = tokenString.replace(/"/g, '');
      dispatch(validateTokenAsync(tokenValue))
    }
  };
  // useEffect for valitading if the token is valid
  useEffect(() => {
    if (isExpired == true) { handleLogOut() }
  }
    , [isExpired]);


  const handleLogOut = () => {
    handleMenuClose();
    dispatch(clearUser());
    dispatch(clearPhotographer());
    dispatch(logout());
    navigate('/SignIn', { replace: true });
  };

  const PhotographerClick = () => {
    handleMenuClose()
    handleValidateLogIn()
    // navigate("/ProfilePtg");
    navigate("/EditProfilePtg");
  };

  const BecomePhotographerClick = () => {
    handleMenuClose()
    handleValidateLogIn()
    // navigate("/BecomePhotographer");
    navigate("/BecomePhotographercopy");
  };


  const VerificationStatus = () => {
    handleMenuClose()

    navigate("/VerificationAlerts");
  };

  const SurferDashboardClick = () => {
    handleMenuClose()
    handleValidateLogIn()
    console.log(conectedUser?.id);
    dispatch(fetchSurferPurchasedItemsAsync(surferId));
    navigate(`/DashboardSurfer`);
  };

  const addAlbumClick = () => {
    handleValidateLogIn()
    navigate(`/ProtectedRoutesCreatSessAlbumcopy`);
    // navigate(`/CreatSessAlbum`);
  };


  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const renderLoggedInMenu = () => {

    if (user?.is_photographer) {
      return [
        <MenuItem key="profile" onClick={PhotographerClick}>Profile</MenuItem>,
        <MenuItem key="logout" onClick={handleLogOut}>Log Out</MenuItem>
      ];
    } else {
      if (user?.stripe_account_id && user?.verification_status === "Pending Verification" ){
        return[
          <MenuItem key="account" onClick={VerificationStatus}>Verification Status</MenuItem>,
          <MenuItem key="account" onClick={SurferDashboardClick}>My Albums</MenuItem>,
          <MenuItem key="logout" onClick={handleLogOut}>Log Out</MenuItem>,
        ]
      }else{
        
      return [
        <MenuItem key="becomePhotographer" onClick={BecomePhotographerClick}>Become a photographer</MenuItem>,
        <MenuItem key="account" onClick={SurferDashboardClick}>My Albums</MenuItem>,
        <MenuItem key="logout" onClick={handleLogOut}>Log Out</MenuItem>,
      ];}
    }
  };

  const renderLoggedOutMenu = () => (
    [
      <MenuItem key="login" onClick={handleSignIn}>Log In</MenuItem>,
      <MenuItem key="signup" onClick={handleSignUp}>Sign Up</MenuItem>
    ]
  );



  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {user ? renderLoggedInMenu() : renderLoggedOutMenu()}

    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>

      </MenuItem>

      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>

    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <StyledAppBar position="fixed"  >
      {/* <StyledAppBar position="fixed" sx={{ backgroundColor: user?.is_photographer ? '#A66E38' : teal[400] }}> */}
        <Toolbar>
        <Link to="/" style={{ ...iconContainerStyle, marginLeft: '-10px' }}>
            {/* <img
              src={user?.is_photographer
                ? `${process.env.PUBLIC_URL}/pequenisimo logo brown.jpg`
                : `${process.env.PUBLIC_URL}/pequenisimo logo.jpg`} alt="Home"
              style={{ width: 50, height: 50 }}
            /> */}
          <img
            src={`${process.env.PUBLIC_URL}/pequenisimo logo.jpg`}
            alt="Home"
            style={{ width: 50, height: 50 }}
          />
          </Link>

          {/* <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search> */}


          <Autocomplete
            sx={{ paddingLeft: isMobile ? '10px' : '40px' }}
            disablePortal
            onChange={(event, newValue) => setSelectedSpot(newValue)}
            id="combo-box-demo"
            options={allSpots}
            getOptionLabel={(spot) => spot.name}
            // value={selectedSpot}
            onInputChange={(event, newInputValue) => setSearchValue(newInputValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Spot"
                fullWidth
                InputLabelProps={{
                  style: {
                    color: 'white',
                  },
                }}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <AutocompleteIconWrapper position="start">
                      <SearchIcon />
                    </AutocompleteIconWrapper>
                  ),
                  style: {
                    height: '40px',
                    width: isMobile ? (user?.is_photographer ? '100px' : '180px') : '300px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              />
            )}
            renderOption={(props, option) => (
              <li
                {...props}
                key={option.name}
                style={{
                  width: '180px', // Fixed width for the options
                }}
              >
                {option.name}
              </li>
            )}
            noOptionsText={<Typography sx={{ p: 1 }}>No options</Typography>}
          />


          {/* Conditionally render "PHOTOGRAPHER" in the center */}
          {user?.is_photographer && (
            <Box
              sx={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)', // Center horizontally
                textAlign: 'center',
              }}
            >
              <IconButton size="large" aria-label="Upload a new album" color="inherit" onClick={addAlbumClick}>
              <AddAPhotoIcon fontSize="large" />
              </IconButton>
            </Box>
          )}


          {/* Spacing to push other elements to the right */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Cart Icon */}
          <IconButton size="large" aria-label="show items in cart" color="inherit" onClick={handleCart}>
            <Badge badgeContent={totalImages} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>

          {/* User Profile or Account Icon */}
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            {user?.is_photographer ? (
              <Avatar src={photographer?.profile_image} />
            ) : (
              <AccountCircle />
            )}
          </IconButton>
        </Toolbar>
      </StyledAppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>


  );
}
