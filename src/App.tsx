import './App.css';
import Images from './components/Images';
import Navbar from './components/Navbar';
import PerAlbum from './components/PerAlbum';
import Photographer from './components/Photographer';
import SessAlbum from './components/SessAlbum';
import { createBrowserRouter, createRoutesFromElements, Link, Outlet, Route, RouterProvider, useLocation } from 'react-router-dom'
import Spot from './components/Spot';
import SignInSide from './components/SignInSide';
import SignUp from './components/SignUp';
import ProfilePhotographer from './components/ProfilePtg';
import EditProfilePtg from './components/EditProfilePtg';
import BecomePhotographer from './components/BecomePhotographer';
import UploadWidget from './components/UploadWidget';
import UploadImage from './components/UploadImage';
import DragDrop from './components/DroppablePerAlbum';
import CardDragDrop from './components/Draggable';
import DragDropContext from './components/DragDropContext';
import AllWidgets from './components/AllWidgets';
import CreatSessAlbum from './components/CreatSessAlbum';
import CreateSpot from './components/CreateSpot';
import CreatePrices from './components/CreatePrices';
import UploadWidgetCopyyyy from './components/UploadWidgetCopyyyy';
import UploadWidgetTheThird from './components/UploadWidgetTheThird';
import FileUploadComponent from './components/FileUploadComponent';
import SecondFileUploadComponent from './components/SecondFileUploadComponent';
import PleaseWork from './components/PleaseWork';
import Cart from './components/Cart';
import PleaseWorkVideoCloudinary from './components/PleaseWorkVideoCloudinary';
import Video from './components/Video';
import PleaseWorkcopy from './components/PleaseWorkVideoS3';
import CreatePricesForVideos from './components/CreatePricesForVideos';
import UndividedImgs from './components/UndividedImgs';
import DashboardSurferImages from './components/DashboardSurfer';
import DashboardSurfer from './components/DashboardSurfer';
import PleaseWorkVideoS3 from './components/PleaseWorkVideoS3';
import PleaseWorkneww from './components/PleaseWorkneww';
import DashboardPhotographer from './components/DashboardPhotographer';
import ProtectedRoutesPhotographers from './utils/ProtectedRoutesPhotographers';
import ProtectedRoutesCreatSessAlbumcopy from './components/ProtectedRoutesCreatSessAlbumcopy';
import PleaseWorkErrors from './components/PleaseWorkErrors';
import CreatSessAlbumErrors from './components/CreatSessAlbumErrors';
import Successfull from './components/Successfull';
import PleaseWorkVideoS3Errors from './components/PleaseWorkVideoS3Errors';
import FailedUpload from './components/FailedUpload';
import CartErrors from './components/CartErrors';
import ResetPassword from './components/ResetPassword';
import ResetPasswordStep2 from './components/ResetPasswordStep2';
import ErrorBoundary from './utils/ErrorBoundary';
import ErrorPage from './components/ErrorPage';
import { Error } from '@mui/icons-material';
import ServerErrorPage from './components/ServerErrorPage';
import CoverImageHomePage from './components/CoverImageHomePage';
import PhotographerNavbar from './components/PhotographerNavbar';
import MyAlbums from './components/MyAlbums';



function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(

      <Route path="/" element={<ErrorBoundary fallback={<ErrorPage />}><Root /></ErrorBoundary>}>
        <Route index element={<SessAlbum filterType="aaaaa" filterId={5} />} />
        <Route path="/PerAlbum" element={<PerAlbum />} />
        <Route path="/Images" element={<Images />} />
        <Route path="/Photographer/:photographerId" element={<Photographer />} />
        <Route path="/Spot/:spotId" element={<Spot />} />
        <Route path="/SignIn" element={<SignInSide />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/AllWidgets" element={<AllWidgets />} />
        <Route path="/FileUploadComponent" element={<FileUploadComponent />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/CartErrors" element={<CartErrors />} />
        <Route path="/Video" element={<Video />} />
        <Route path="/UndividedImgs" element={<UndividedImgs />} />
        <Route path="/DashboardSurfer" element={<DashboardSurfer />} />
        <Route path="/BecomePhotographer" element={<BecomePhotographer />} />
        <Route path="/RequestResetPassword" element={<ResetPassword />} />
        <Route path="/reset-password/" element={<ResetPasswordStep2 />} />
        <Route path="/ServerErrorPage" element={<ServerErrorPage />} />
        <Route path="/CoverImageHomePage" element={<CoverImageHomePage />} />


        <Route element={<ProtectedRoutesPhotographers />}>
          <Route path="/ProfilePtg" element={<ProfilePhotographer />} />
          <Route path="/EditProfilePtg" element={<EditProfilePtg />} />
          <Route path="/CreatePrices" element={<CreatePrices />} />
          <Route path="/CreatePricesForVideos" element={<CreatePricesForVideos />} />
          <Route path="/PleaseWork" element={<PleaseWork />} />
          <Route path="/PleaseWorkneww" element={<PleaseWorkneww />} />
          <Route path="/PleaseWorkVideoCloudinary" element={<PleaseWorkVideoCloudinary />} />
          <Route path="/PleaseWorkVideoS3" element={<PleaseWorkVideoS3 />} />
          <Route path="/PleaseWorkVideoS3Errors" element={<PleaseWorkVideoS3Errors />} />
          <Route path="/PleaseWorkErrors" element={<PleaseWorkErrors />} />
          <Route path="/DashboardPhotographer" element={<DashboardPhotographer />} />
          <Route path="/CreatSessAlbum" element={<CreatSessAlbum />} />
          <Route path="/CreatSessAlbumErrors" element={<CreatSessAlbumErrors />} />
          <Route path="/ProtectedRoutesCreatSessAlbumcopy" element={<ProtectedRoutesCreatSessAlbumcopy />} />
          <Route path="/Successfull" element={<Successfull />} />
          <Route path="/FailedUpload" element={<FailedUpload />} />
          <Route path="/MyAlbums" element={<MyAlbums />} />


        </Route>

      </Route>

    )
  );

  return (

    <div className="App">

      <RouterProvider router={router} />

    </div>

  );
}


const Root = () => {
  const location = useLocation();

  const hideNavbarRoutes = [
    '/PleaseWorkVideoS3',
    '/PleaseWorkneww',
    '/PleaseWorkErrors',
    '/PleaseWorkVideoS3Errors',
    // '/ProtectedRoutesCreatSessAlbumcopy',
  ];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  const showCoverImage = [
    '/',
  ];
  const shouldShowCoverImage = showCoverImage.includes(location.pathname);

  const showPhotographerNavbar = [
    '/DashboardPhotographer',
    '/CreatSessAlbumErrors',
    '/EditProfilePtg',
    '/ProfilePtg',
    '/MyAlbums',
    '/FailedUpload',
  ];
  const shouldShowPhotographerNavbar = showPhotographerNavbar.includes(location.pathname);



  return (
    <>
      <div>
        {!shouldHideNavbar && <Navbar />}
        {shouldShowPhotographerNavbar && <PhotographerNavbar />}
      </div>

      {shouldShowCoverImage &&
        <div style={{ marginTop: '70px', padding: '0px' }}>
          <CoverImageHomePage />
        </div>
      }


      <div
        style={{
          marginTop: shouldShowPhotographerNavbar ? '9px' : (!shouldShowCoverImage ? '80px' : '0px'),
          padding: '0px'
        }}
      >


        <div>
          <Outlet />
        </div>
        {/* <ErrorPage></ErrorPage> */}
        {/* <ResetPassword></ResetPassword> */}
        {/* <ResetPasswordStep2></ResetPasswordStep2> */}
        {/* <Successfull></Successfull> */}
        {/* <DashboardSurferImages></DashboardSurferImages> */}
        {/* <DashboardPhotographer></DashboardPhotographer> */}
        {/* <PleaseWorkneww></PleaseWorkneww> */}
        {/* <Cart></Cart> */}
        {/* <BecomePhotographer></BecomePhotographer> */}
        {/* <hr></hr> */}
        {/* <CreatePricesForVideos></CreatePricesForVideos> */}
        {/* <CreatePrices></CreatePrices> */}
        {/* <CreatSessAlbumErrors></CreatSessAlbumErrors> */}
        {/* <FailedUpload></FailedUpload> */}
        {/* <PleaseWorkErrors></PleaseWorkErrors> */}
        {/* <hr></hr> */}
        {/* <PleaseWorkVideoS3Errors></PleaseWorkVideoS3Errors> */}
        {/* <FailedUpload></FailedUpload> */}
        {/* <SignUp></SignUp> */}

      </div>
    </>
  )
}



export default App;
