import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchPhotographerPurchasesAsync, selectPhotographerPurchases } from '../slicers/purchaseSlice';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectProfilePhotographer } from '../slicers/profilePtgSlice';
import { useMediaQuery } from '@mui/material';
import { selectSpanish } from '../slicers/sighnInSlice';



export default function PhotographerPurchases() {
  const dispatch = useAppDispatch();
  const photographerPurchases = useAppSelector(selectPhotographerPurchases);
  const photographer = useSelector(selectProfilePhotographer);
  const isMobile = useMediaQuery('(max-width:600px)');
  const spanish = useSelector(selectSpanish)

  console.log(photographerPurchases);
  
  const photographerName = photographer?.photographer_name
  console.log(photographerName);
  

  useEffect(() => {
    if (photographerName) {
      console.log(photographerName);
      dispatch(fetchPhotographerPurchasesAsync(photographerName));
    }
  }, [dispatch, photographerName]);



  const columns: GridColDef[] = [
    { field: 'sessDate', headerName: spanish ? 'Fecha de Sesión' : 'Session Date', width: 150, align: 'center', headerAlign: 'center' },
    { field: 'spot_name', headerName: spanish ? 'Nombre del Lugar' : 'Spot Name', width: 150, align: 'center', headerAlign: 'center' },
    { field: 'netPrice', headerName: spanish ? 'Precio Neto ($)' : 'Net Price ($)', width: 150, align: 'center', headerAlign: 'center' },
    { field: 'total_price', headerName: spanish ? 'Precio Total ($)' : 'Total Price ($)', width: 150, align: 'center', headerAlign: 'center' },
    { field: 'total_item_quantity', headerName: spanish ? 'Cantidad de Artículos' : 'Item Quantity', type: 'number', width: spanish ? 180: 110, align: 'center', headerAlign: 'center' },
    { field: 'order_date', headerName: spanish ? 'Fecha de Pedido' : 'Order Date', width: 150, align: 'center', headerAlign: 'center' },
    { field: 'id', headerName: spanish ? 'ID' : 'ID', width: 90, align: 'center', headerAlign: 'center' },
    // { field: 'surfer_name', headerName: spanish ? 'Nombre del Comprador' : 'Buyer Name', width: spanish ? 180 :150, align: 'center', headerAlign: 'center' },
  ];

  
  return (
    <>
    {/* <Box
      sx={{
        position: 'relative', // Set position to relative for positioning child elements
        width: '100%',
        display: 'flex',
        justifyContent: 'center', // Center content horizontally
        alignItems: 'center', // Center content vertically
        p: 1,
        bgcolor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: '0 0 0px 0',
        textAlign: 'center', // Ensure the text is centered
        marginTop: '20px', // Ensure there's no extra margin
        padding: '15px',
      }}
    ></Box> */}



<Box sx={{ height: 400, width: '90%', ml: isMobile ? 2 : 8, mr: isMobile ? 2 : 7 }}>
  <DataGrid
    rows={photographerPurchases}
    columns={columns}
    getRowId={(row) => row.id} // Ensure unique row identification
    initialState={{
      pagination: {
        paginationModel: {
          pageSize: 5,
        },
      },
    }}
    pageSizeOptions={[5]}
    disableRowSelectionOnClick
    sx={{
      backgroundColor: '#f9f9f9', // Set the table background color to a light grey
      '& .MuiDataGrid-row': {
        backgroundColor: '#f9f9f9', // Set rows background color to white
      },
    }}
  />
</Box>




</>
  );
}
