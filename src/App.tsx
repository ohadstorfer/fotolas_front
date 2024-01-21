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

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />}>
      <Route index element={<SessAlbum filterType="aaaaa" filterId={5} />} />
      <Route path="/PerAlbum" element={<PerAlbum />} />
      <Route path="/Images" element={<Images />} />
      <Route path="/Photographer/:photographerId" element={<Photographer />} />
      <Route path="/ProfilePtg/:userId" element={<ProfilePhotographer />} />
      <Route path="/Spot/:spotId" element={<Spot />} />
      <Route path="/SignIn" element={<SignInSide />} />
      <Route path="/SignUp" element={<SignUp />} />
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
    {/* <EditProfilePtg></EditProfilePtg> */}
    <Outlet ></Outlet>
  </div>
  </>
  )
}



export default App;
