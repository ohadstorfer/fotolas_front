import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { selectToken } from '../slicers/sighnInSlice';
import { selectNewSess, removeNewSess, removeNewPrices, fetchSessAlbumByIdAsync, selectNewSessDetails } from '../slicers/sessAlbumSlice'; // Import the new async thunk and selector
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import CreatSessAlbum from './CreatSessAlbum';
import { AppDispatch } from '../app/store';
import CreatSessAlbumErrors from './CreatSessAlbumErrors';

const ProtectedRoutesCreatSessAlbumcopy = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>(); // Type dispatch with AppDispatch
    const conectedUser = useSelector(selectToken);
    const newSess = useSelector(selectNewSess);
    const newSessDetails = useSelector(selectNewSessDetails); // Selector for newSessDetails
    const [showDialog, setShowDialog] = useState(false);




    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = ''; // This line triggers the browser's default warning dialog
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
          window.removeEventListener('beforeunload', handleBeforeUnload); // Clean up
        };
      }, [dispatch]);



    useEffect(() => {

        if (newSess) {
            
                dispatch(fetchSessAlbumByIdAsync(newSess.id));
                setShowDialog(true);
            
        }else {
            console.log("there is already a session");
            navigate('/CreatSessAlbumErrors');
        }
    }, [newSess, dispatch, navigate]);




    // useEffect(() => {

    //     if (newSess) {
    //         console.log("there is already a session");
            
    //         // Check if newSess was updated less than 2 seconds ago
    //         const updatedAt = new Date(newSess.updated_at).getTime();
    //         const currentTime = new Date().getTime();
    //         const timeDifference = currentTime - updatedAt;

    //         if (timeDifference < 2000) { // 2000ms = 2 seconds
    //             // If the album was updated less than 2 seconds ago, navigate automatically
    //             if (newSess.videos) {
    //                 navigate('/CreatePricesForVideos');
    //             } else {
    //                 navigate('/CreatePrices');
    //             }
    //         } else {
    //             dispatch(fetchSessAlbumByIdAsync(newSess.id));
    //             setShowDialog(true);
    //         }
    //     }else {
    //         console.log("there is already a session");
    //         navigate('/CreatSessAlbumErrors');
    //     }
    // }, [newSess, dispatch, navigate]);





    const handleContinue = () => {
        setShowDialog(false);
        if (newSess!.videos) {
            navigate('/CreatePricesForVideos');
        } else {
            navigate('/CreatePrices');
        }
    };





    const handleNewAlbum = () => {
        setShowDialog(false);
        dispatch(removeNewSess());
        dispatch(removeNewPrices());
        navigate('/CreatSessAlbumErrors');
    };

    return (
        <>
            {newSess && 
            (
                <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
                    <DialogTitle>Existing Album in Progress</DialogTitle>
                    <DialogContent>
                        <Typography variant="body1">
                            You already have an album creation process in progress. Here are the details:
                        </Typography>
                        <Typography variant="body2">
                            <strong>Session Date:</strong> {new Date(newSess.sessDate).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2">
                            <strong>Spot Name:</strong> {newSessDetails?.spot_name}
                        </Typography>
                        <Typography variant="body2">
                            <strong>Cover Image:</strong> <img src={newSess.cover_image} alt="Cover" width="100" />
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleContinue} color="primary">
                            Continue with Existing Album
                        </Button>
                        <Button onClick={handleNewAlbum} color="secondary">
                            Create New Album
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
            {/* {!newSess && <CreatSessAlbumErrors />} */}
        </>
    );
};

export default ProtectedRoutesCreatSessAlbumcopy;
