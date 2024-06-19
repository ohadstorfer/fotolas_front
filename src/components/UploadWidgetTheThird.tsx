import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@mui/material';
import { teal } from '@mui/material/colors';

interface MyImage {
  timeTaken: string;
  imageUrl: string;
}

const UploadWidget: React.FC = () => {
  const cloudinaryRef = useRef<any>();
  const widgetRef = useRef<any>();
  const [allImages, setAllImages] = useState<MyImage[]>([]);
  const [surfers, setSurfers] = useState<MyImage[][]>([[]]);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleUpload = (error: any, result: any) => {
      if (result.info.secure_url) {
        const image: MyImage = {
          timeTaken: new Date().toISOString(), // You can modify this to extract the actual timestamp
          imageUrl: result.info.secure_url,
        };
        setAllImages(prevImages => [...prevImages, image]);
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
    processImages();
  }, [allImages]);

  const processImages = () => {
    const imagesCopy = [...allImages];
    const sortedImages = imagesCopy.sort((a, b) => new Date(a.timeTaken).getTime() - new Date(b.timeTaken).getTime());

    const surfersCopy: MyImage[][] = [[]];
    let currentSurferIndex = 0;
    for (let i = 0; i < sortedImages.length - 1; i++) {
      const timeDelta = new Date(sortedImages[i + 1].timeTaken).getTime() - new Date(sortedImages[i].timeTaken).getTime();
      if (timeDelta > 5000) {
        currentSurferIndex++;
        surfersCopy.push([]);
      }
      surfersCopy[currentSurferIndex].push(sortedImages[i]);
    }
    surfersCopy[currentSurferIndex].push(sortedImages[sortedImages.length - 1]);
    setSurfers(surfersCopy);
  };

  const addSurfer = () => {
    setSurfers(prevSurfers => [...prevSurfers, []]);
  };

  return (
    <div>
      <br />
      <Button onClick={() => widgetRef.current.open()} variant="contained" style={{ backgroundColor: teal[400], color: 'white' }}>
        Upload Images Of A Surfer
      </Button>

      {allImages.length > 0 && (
        <>
          <div>
            <h4>Uploaded Images:</h4>
            <ul style={{ listStyleType: 'none', padding: 0, display: 'flex' }}>
              {allImages.map((image, index) => (
                <li key={index} style={{ marginRight: '10px' }}>
                  {image && image.imageUrl && <img src={image.imageUrl} alt={`Image ${index}`} style={{ width: '100px', height: 'auto' }} />}
                </li>
              ))}
            </ul>
          </div>

          {surfers.map((surferImages, surferIndex) => (
            surferImages.length > 0 && (
              <div key={surferIndex}>
                <h4>Surfer {surferIndex + 1}:</h4>
                <div style={{ display: 'flex' }}>
                  {surferImages.map((image, index) => (
                    <img key={index} src={image.imageUrl} alt={`Surfer ${surferIndex + 1} Image ${index}`} style={{ marginRight: '10px', width: '100px', height: 'auto' }} />
                  ))}
                </div>
              </div>
            )
          ))}

          <Button onClick={addSurfer} variant="contained" style={{ backgroundColor: teal[400], color: 'white' }}>
            Add More Surfers
          </Button>
        </>
      )}

      <hr />
    </div>
  );
};

export default UploadWidget;
