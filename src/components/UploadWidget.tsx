import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectYalla, updateAlbums } from '../slicers/uploadPerAlbum';
import { Button } from '@mui/material';
import { teal } from '@mui/material/colors';
import { Droppable, Draggable } from 'react-beautiful-dnd';

const UploadWidget = () => {
  const cloudinaryRef = useRef<any>();
  const widgetRef = useRef<any>();
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const yalla = useSelector(selectYalla);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleUpload = (error: any, result: any) => {
      if (result.info.secure_url) {
        setUploadedUrls((prevUrls) => [...prevUrls, result.info.secure_url]);
        console.log( result.info.created_at);
        
      }
    };

    cloudinaryRef.current = (window as any).cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: 'dauupwecm',
        uploadPreset: 'ntncxwfx',
      },
      handleUpload
    );
  }, []);


  useEffect(() => {
    if (yalla) {
      dispatch(updateAlbums(uploadedUrls));
    }
  }, [yalla, uploadedUrls, dispatch]);


  return (
    <div>
      <Button onClick={() => widgetRef.current.open()} variant="contained" style={{ backgroundColor: teal[400], color: 'white' }}>
        Upload Images Of A Surfer
      </Button>

      {uploadedUrls.length > 0 && (
        <Droppable droppableId="uploaded-images">
          {(provided) => (
            <ul ref={provided.innerRef} {...provided.droppableProps} style={{ listStyleType: 'none', padding: 0, display: 'flex' }}>
              {uploadedUrls.map((url, index) => (
                <Draggable key={index} draggableId={`image-${index}`} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{ marginRight: '10px' }}
                    >
                      <img src={url} alt={`Image ${index}`} style={{ width: '100px', height: 'auto' }} />
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      )}

      <hr />
    </div>
  );
};

export default UploadWidget;