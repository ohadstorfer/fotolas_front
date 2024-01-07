import './App.css';
import Images from './components/Images';
import Navbar from './components/Navbar';
import PerAlbum from './components/PerAlbum';
import Photographer from './components/Photographer';
import SessAlbum from './components/SessAlbum';
import { createBrowserRouter, createRoutesFromElements, Link, Outlet, Route, RouterProvider }from 'react-router-dom'

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />}>
        <Route index element={<SessAlbum />} />
        <Route path="/PerAlbum" element={<PerAlbum />} />
        <Route path="/Images" element={<Images />} />
        <Route path="/Photographer" element={<Photographer />} />
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
    {/* <Photographer></Photographer> */}
    <Outlet ></Outlet>
  </div>
  </>
  )
}



export default App;
