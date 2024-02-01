import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectYalla, updateAlbums } from '../slicers/uploadPerAlbum';

const UploadWidget: React.FC = () => {
  const cloudinaryRef = useRef<any>();
  const widgetRef = useRef<any>();
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const yalla = useSelector(selectYalla);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleUpload = (error: any, result: any) => {
      if (result.info.secure_url) {
        setUploadedUrls((prevUrls) => [...prevUrls, result.info.secure_url]);
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
      console.log(uploadedUrls);
      
      dispatch(updateAlbums(uploadedUrls));
    }
  }, [yalla, uploadedUrls, dispatch]);

  return (
    <div>
      <button onClick={() => widgetRef.current.open()}>Upload</button>
      {uploadedUrls.length > 0 && (
        <div>
          <h2>Uploaded URLs:</h2>
          <ul>
            {uploadedUrls.map((url, index) => (
              <li key={index}>{url}</li>
            ))}
          </ul>
          <hr></hr>
        </div>
      )}
    </div>
  );
};

export default UploadWidget;
