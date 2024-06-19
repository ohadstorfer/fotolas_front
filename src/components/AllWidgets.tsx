import React, { useEffect, useState } from 'react'
import UploadWidget from './UploadWidget'
import { Box, Button } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux';
import { selectNewSess } from '../slicers/sessAlbumSlice';
import { lastAPIAsync, selectAlbums, selectFinish, selectStatus, setYallaTrue, updatePricesAsync } from '../slicers/uploadPerAlbum';
import { useNavigate } from 'react-router-dom';
import { teal } from '@mui/material/colors';
import { DragDropContext } from 'react-beautiful-dnd';

const AllWidgets = () => {
  const [widgetCount, setWidgetCount] = useState(1);
  const albums = useSelector(selectAlbums);
  const newSessId = useSelector(selectNewSess);
  const status = useSelector(selectStatus);
  const finsh = useSelector(selectFinish);
  const dispatch = useDispatch();
  const navigate = useNavigate()


  useEffect(() => {
    if (newSessId !== null) {
      dispatch(updatePricesAsync(newSessId) as any);
    }
  }, [status]);

  //   useEffect(() => {
  //     if (finsh===true) {
  //       navigate('/');
  //     }
  // }, [finsh]);



  const credentials = {
    session_album_id: newSessId as number,
    images_arrays: albums as string[][],
  };

  const uploadAlbum = () => {
    dispatch(lastAPIAsync(credentials) as any);
  };

  const addWidget = () => {
    setWidgetCount((prevCount) => prevCount + 1);
  };


  const changeYalla = () => {
    dispatch(setYallaTrue())
  };


  const onDragEnd = () => {
    // TODO: reorder our column
  };



  return (
    <DragDropContext onDragEnd={onDragEnd}>
    <Box>

      {[...Array(widgetCount)].map((_, index) => (
        <UploadWidget key={index} />
      ))}

      <Button onClick={addWidget} variant="contained" style={{ backgroundColor: teal[400], color: 'white' }}>
        Add More Surfers
      </Button>

      <br /><br />


      <Button onClick={changeYalla} variant="contained" style={{ backgroundColor: teal[400], color: 'white' }}>
        changeYalla
      </Button>

      <Button onClick={uploadAlbum} variant="contained" style={{ backgroundColor: teal[400], color: 'white' }}>
        Upload Album!
      </Button>

    </Box>
    </DragDropContext>
  );
};

export default AllWidgets;