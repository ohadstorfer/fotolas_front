import './App.css';
import Images from './components/Images';
import Navbar from './components/Navbar';
import PerAlbum from './components/PerAlbum';
import SessAlbum from './components/SessAlbum';




function App() {
  return (
    <div className="App">
      <Navbar></Navbar>
      <SessAlbum></SessAlbum>
      <hr></hr>
      <PerAlbum></PerAlbum>
      <hr></hr>
      <Images></Images>
      
    </div>
  );
}

export default App;
