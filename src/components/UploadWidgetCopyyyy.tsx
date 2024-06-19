import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectYalla, updateAlbums } from '../slicers/uploadPerAlbum';
import { Button } from '@mui/material';
import { teal } from '@mui/material/colors';

interface ImageInfo {
  creationTime: number;
  imageUrl: string;
}

const UploadWidget: React.FC = () => {
  const cloudinaryRef = useRef<any>();
  const widgetRef = useRef<any>();
  const [allImages, setAllImages] = useState<ImageInfo[][]>([[]]);
  const yalla = useSelector(selectYalla);
  const [surfers, setSurfers] = useState<string[][]>([[], [], []]); // Array of surfer arrays
  const dispatch = useDispatch();

  useEffect(() => {
    const handleUpload = (error: any, result: any) => {
      if (result.info.secure_url) {
        console.log(result);
        // REQUEST THE DATA HERE
        // HERE I WANT TO GET THE CreateDate FROM THE METADATA OF THAT IMAGE
        // BELOW, I WANT TO PUT THE CreateDate AS creationTime
        const creationTime = (result.info.image_metadata)
        console.log(creationTime);
        if (!allImages[allImages.length - 1].length || creationTime - allImages[allImages.length - 1][allImages[allImages.length - 1].length - 1].creationTime > 5000) {
          setAllImages(prevImages => [...prevImages, [{ creationTime, imageUrl: result.info.secure_url }]]);
        } else {
          setAllImages(prevImages => {
            const updatedImages = [...prevImages];
            updatedImages[updatedImages.length - 1].push({ creationTime, imageUrl: result.info.secure_url });
            return updatedImages;
          });
        }
        
        // Fetch EXIF data after upload
        const publicId = result.info.public_id;
        if (cloudinaryRef.current) { // Ensure cloudinaryRef.current is not undefined
          cloudinaryRef.current.api.resource(publicId, {exif: true}, (error: any, result: any) => {
            if (!error) {
              // Access DateTimeOriginal from the fetched metadata
              const dateTimeOriginal = result.exif.DateTimeOriginal;
              console.log("DateTimeOriginal:", dateTimeOriginal);
              // Update state or do other operations with dateTimeOriginal
            }
          });
        } else {
          console.error("Cloudinary reference is not initialized.");
        }
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
      const imageUrls = allImages.map(imageGroup => imageGroup.map(imageInfo => imageInfo.imageUrl)).flat();
      dispatch(updateAlbums(imageUrls));
    }
  }, [yalla, allImages, dispatch]);

  const addSurfer = () => {
    setSurfers(prevSurfers => [...prevSurfers, []]);
  };

  return (
    <div>
      <Button onClick={() => widgetRef.current.open()} variant="contained" style={{ backgroundColor: teal[400], color: 'white' }}>
        Upload Images Of A Surfer
      </Button>

      {/* Render uploaded images */}
      {allImages.length > 0 && (
        <div>
          {allImages.map((imageGroup, groupIndex) => (
            <div key={groupIndex}>
              {imageGroup.map((imageInfo, index) => (
                <div key={`${groupIndex}-${index}`}>
                  <h4>Images Uploaded at {new Date(imageInfo.creationTime).toLocaleString()}:</h4>
                  <ul style={{ listStyleType: 'none', padding: 0, display: 'flex' }}>
                    <li>
                      <img src={imageInfo.imageUrl} alt={`Image ${groupIndex}-${index}`} style={{ width: '100px', height: 'auto', marginRight: '10px' }} />
                    </li>
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Rest of the JSX */}
    </div>
  );
};

export default UploadWidget;
