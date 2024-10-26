import React, { useEffect, useState } from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import { useAppDispatch } from '../app/hooks';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { teal } from '@mui/material/colors';
import { TextField, Typography, useMediaQuery } from '@mui/material';

import { createSpotAsync, selectNewSpot, selectSpot } from '../slicers/spotSlice';
import { selectSpanish } from '../slicers/sighnInSlice';

export default function UserCard() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [name, setName] = useState<string>('');
    const [city, setCity] = useState<string>('');
    const [country, setCountry] = useState<string>('');
    const [isSpotAdded, setSpotAdded] = useState(false); // State to control the content
    const newSpot = useSelector(selectNewSpot);
    const isMobile = useMediaQuery('(max-width:600px)');
    const spanish = useSelector(selectSpanish)

    useEffect(() => {
        if(newSpot){setSpotAdded(true);}
    }, [newSpot]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const credentials = {
            name: data.get('name') as string,
            city: data.get('city') as string,
            country: data.get('country') as string,
        };

        try {
            console.log(credentials);
            await dispatch(createSpotAsync(credentials));
        } catch (error) {
            console.error('createSpotAsync failed:', error);
        }
    };

    return (
        <>
            <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                sx={{
                    width: '270px',
                    margin: '0 auto',
                    marginTop: '16px',
                    display: 'flex',  // Use flexbox to center content
                    justifyContent: 'center',  // Center horizontally
                  }}
            >
                <Card
                    orientation="horizontal"
                    sx={{
                        width: '100%',
                        flexWrap: 'wrap',
                        borderRadius: '16px',
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
                        justifyContent: 'center',
                    }}
                >
                    
                    <CardContent>
                    <Typography   variant="h5"  fontWeight="bold"  gutterBottom> {spanish ? 'Agregar un nuevo lugar / spot' : ' Add a New Spot'}  </Typography>
                        {isSpotAdded ? (
                            // If spot is added, display success message
                            <h2> {spanish ? '¡Lugar agregado con éxito!' : 'Spot added successfully!'}</h2>
                        ) : (
                            // If spot is not added, display the form
                            <>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="name"
                                    label={spanish ? 'Nombre del lugar' : 'Spot Name'}
                                    type="name"
                                    id="name"
                                    autoComplete="current-name"
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="country"
                                    label={spanish ? 'Pais' : 'Country'}
                                    type="country"
                                    id="country"
                                    autoComplete="current-country"
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="city"
                                    label={spanish ? 'Ciudad' : 'City'}
                                    type="city"
                                    id="city"
                                    autoComplete="current-city"
                                />
                                <Box sx={{ display: 'flex',  gap: 1.5, '& > button': { flex: 1 } }}>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        sx={{ backgroundColor: teal[400], color: 'white' }}
                                    >
                                        {spanish ? 'Agregar' : 'Add Spot'}
                                    </Button>
                                </Box>
                            </>
                        )}
                    </CardContent>
                </Card>
            </Box>
        </>
    );
}
