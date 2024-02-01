import React, { useEffect, useState } from 'react'
import UploadWidget from './UploadWidget'
import { Box } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux';
import { selectNewSess } from '../slicers/sessAlbumSlice';
import { lastAPIAsync, selectAlbums, selectStatus, setYallaTrue, updatePricesAsync } from '../slicers/uploadPerAlbum';

const AllWidgets = () => {
    const [widgetCount, setWidgetCount] = useState(1);
    const albums = useSelector(selectAlbums);
    const newSessId = useSelector(selectNewSess);
    const status = useSelector(selectStatus);
    const dispatch = useDispatch();


    useEffect(() => {
      if (status!=null) {
        console.log("status- from the useEffect: ", status);
        
        dispatch(updatePricesAsync(status)as any);
      }
    }, [status]);


    // useEffect(() => {
    //   if (albums) {
    //     console.log(albums);
    //   }
    // }, [albums]);

    const credentials = {
      session_album_id: newSessId as number,
      images_arrays: albums as string[][],
    };
  
    const uploadAlbum = () => {
      dispatch(lastAPIAsync(credentials)as any);
    };

    const addWidget = () => {
      setWidgetCount((prevCount) => prevCount + 1);
    };
  

    const changeYalla = () => {
      dispatch(setYallaTrue())
    };

    

    return (
      <Box>
        <button onClick={addWidget}>Add More Surfers</button>
        
        <br />
        {[...Array(widgetCount)].map((_, index) => (
          <UploadWidget key={index} />
        ))}

        <button onClick={changeYalla}>changeYalla</button>
        <button onClick={uploadAlbum}>Upload Album!</button>
        
    
      </Box>
    );
  };
  
  export default AllWidgets;