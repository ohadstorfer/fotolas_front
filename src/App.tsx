import './App.css';
import Images from './components/Images';
import Navbar from './components/Navbar';
import PerAlbum from './components/PerAlbum';
import Photographer from './components/Photographer';
import SessAlbum from './components/SessAlbum';
import { createBrowserRouter, createRoutesFromElements, Link, Outlet, Route, RouterProvider }from 'react-router-dom'
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

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />}>
      <Route index element={<SessAlbum filterType="aaaaa" filterId={5} />} />
      <Route path="/PerAlbum" element={<PerAlbum />} />
      <Route path="/Images" element={<Images />} />
      <Route path="/Photographer/:photographerId" element={<Photographer />} />
      <Route path="/ProfilePtg/:userId" element={<ProfilePhotographer />} />
      <Route path="/EditProfilePtg/:photographerId" element={<EditProfilePtg />} />
      <Route path="/BecomePhotographer/:userId" element={<BecomePhotographer />} />
      <Route path="/Spot/:spotId" element={<Spot />} />
      <Route path="/SignIn" element={<SignInSide />} />
      <Route path="/SignUp" element={<SignUp />} />
      <Route path="/CreatePrices" element={<CreatePrices />} />
      <Route path="/CreatePricesForVideos" element={<CreatePricesForVideos />} />
      <Route path="/CreatSessAlbum" element={<CreatSessAlbum />} />
      <Route path="/AllWidgets" element={<AllWidgets />} />
      <Route path="/FileUploadComponent" element={<FileUploadComponent />} />
      <Route path="/PleaseWork" element={<PleaseWork />} />
      <Route path="/PleaseWorkneww" element={<PleaseWorkneww />} />
      <Route path="/PleaseWorkVideoCloudinary" element={<PleaseWorkVideoCloudinary />} />
      <Route path="/PleaseWorkVideoS3" element={<PleaseWorkVideoS3 />} />
      <Route path="/Cart" element={<Cart />} />
      <Route path="/Video" element={<Video />} />
      <Route path="/UndividedImgs" element={<UndividedImgs />} />
      <Route path="/DashboardSurfer" element={<DashboardSurfer />} />
      <Route path="/DashboardPhotographer" element={<DashboardPhotographer />} />

    </Route>
    )
  );
  
  return (
    <div className="App">
      <RouterProvider router={router}/>
    </div>
  );
}


const Root = () => {
  return( 
    <>
  <div>
    <Navbar></Navbar> 
  </div>

  <div style={{ marginTop: '80px', padding: '0px' }}>  
   

    <Outlet ></Outlet>
    {/* <DashboardSurferImages></DashboardSurferImages> */}
    {/* <DashboardPhotographer></DashboardPhotographer> */}
    {/* <PleaseWorkneww></PleaseWorkneww> */}
    {/* <hr></hr> */}
    {/* <BecomePhotographer></BecomePhotographer> */}
    {/* <PleaseWork></PleaseWork> */}
    {/* <UploadImage></UploadImage> */}
    {/* <hr></hr> */}
    {/* <PleaseWorkVideoCloudinary></PleaseWorkVideoCloudinary> */}
    {/* <UploadWidget></UploadWidget> */}
    {/* <PleaseWorkVideoS3></PleaseWorkVideoS3> */}
    {/* <CreatSessAlbum></CreatSessAlbum> */}
    {/* <CreatePricesForVideos></CreatePricesForVideos> */}
    {/* <CreatePrices></CreatePrices> */}
  </div>
  </>
  )
}



export default App;
