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
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import teal from '@mui/material/colors/teal';
import { GiSurferVan } from "react-icons/gi";
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks';
import { logout, parseJwt, selectToken } from '../slicers/sighnInSlice';
import { Avatar } from '@mui/material';
import { useSelector } from 'react-redux';
import { getPhotographerByUserId, selectProfilePhotographer } from '../slicers/profilePtgSlice';
import { useEffect, useState } from 'react';
import { clearUser, getUserById, selectUser } from '../slicers/userSlice';
import { clearPhotographer } from '../slicers/photographerSlice';
import { selectBecomePhotographer } from '../slicers/becomePhotographerSlice';
import { selectSessAlbums } from '../slicers/sessAlbumSlice';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { selectCartTotalItems } from '../slicers/cartSlice';
import { IoImagesOutline } from 'react-icons/io5';
import { selectRefreshNavbar } from '../slicers/signUpSlice';
import { fetchSurferPurchasedItemsAsync } from '../slicers/purchaseSlice';



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

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: teal[400], // Set the background color to teal[400]
}));











export default function PrimarySearchAppBar() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const storedToken = localStorage.getItem("token");
  const token = storedToken ? JSON.parse(storedToken) : null;
  const photographer = useSelector(selectProfilePhotographer);
  const user = useSelector(selectUser)
  const slicerToken = useSelector(selectToken)
  const isLoggedIn = useSelector(selectToken)
  const newPhotographer= useSelector(selectBecomePhotographer)
  const sessAlbum = useSelector(selectSessAlbums);
  const totalImages = useSelector(selectCartTotalItems)
  const refreshNavbar = useSelector(selectRefreshNavbar)
  const surferId = JSON.parse(localStorage.getItem('token') || '{}').id;


  useEffect(() => {
    dispatch(getUserById(Number(token?.id)));
    dispatch(getPhotographerByUserId(Number(token?.id)));
  }
    , [refreshNavbar, isLoggedIn,newPhotographer]);




  // useEffect(() => {
  //   console.log("the user is: ", user?.fullName);
  // }
  //   , [user]);



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
    navigate('/SignUp');
  };

  const handleCart = () => {
    navigate('/Cart');
  };

  const handleSignIn = () => {
    navigate('/SignIn');
  };

  const handleLogOut = () => {
    handleMenuClose();
    dispatch(clearUser());
    dispatch(clearPhotographer());
    dispatch(logout());
    navigate('/SignIn', { replace: true });
  };

  const PhotographerClick = () => {
    handleMenuClose()
    navigate(`/ProfilePtg/${token.id}`);
  };

  const BecomePhotographerClick = () => {
    handleMenuClose()
    navigate(`/BecomePhotographer/${token.id}`);
  };

  const SurferDashboardClick = () => {
    handleMenuClose()
    console.log(surferId);
    dispatch(fetchSurferPurchasedItemsAsync(surferId));
    navigate(`/DashboardSurfer`);
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
      return [
        <MenuItem key="becomePhotographer" onClick={BecomePhotographerClick}>Become a photographer</MenuItem>,
        <MenuItem key="account" onClick={SurferDashboardClick}>My account</MenuItem>,
        <MenuItem key="logout" onClick={handleLogOut}>Log Out</MenuItem>,
      ];
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
      <StyledAppBar position="fixed">
        <Toolbar>
          {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            // sx={{ mr: 2 }}
          >
            {/* <MenuIcon /> */}

          {/* </IconButton> */}
          <Link to="/" style={iconContainerStyle}>
            <GiSurferVan size={40} />
          </Link>

          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>

            <IconButton size="large" aria-label="show 4 new mails" color="inherit">
              <Badge badgeContent={totalImages} color="error" onClick={handleCart}>
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              {/* *************************************************************************************************************************************************************************************** */}
              {user?.is_photographer ? (<Avatar src={photographer?.profile_image} />) : (<AccountCircle />)}
              {/* {user ? console.log(user) :"bbbbbbbbb"} */}

            </IconButton>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>

          </Box>
        </Toolbar>
      </StyledAppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}
