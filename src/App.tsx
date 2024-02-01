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
import Upd from './components/Upd';
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
      <Route path="/CreatSessAlbum" element={<CreatSessAlbum />} />
      <Route path="/AllWidgets" element={<AllWidgets />} />

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
  <div> 
    
  <Outlet ></Outlet>
  </div>
  </>
  )
}



export default App;
