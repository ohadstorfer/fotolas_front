import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchPhotographerPurchasesAsync, selectPhotographerPurchases } from '../slicers/purchaseSlice';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectProfilePhotographer } from '../slicers/profilePtgSlice';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'order_date', headerName: 'Order Date', width: 150 },
  { field: 'total_price', headerName: 'Total Price', width: 150 },
  { field: 'total_item_quantity', headerName: 'Item Quantity', type: 'number', width: 110 },
  { field: 'surfer_name', headerName: 'Buyer Name', width: 150 },
  { field: 'spot_name', headerName: 'Spot Name', width: 150 },
  { field: 'sessDate', headerName: 'Session Date', width: 150 },
];

export default function PhotographerPurchases() {
  const dispatch = useAppDispatch();
  const photographerPurchases = useAppSelector(selectPhotographerPurchases);
  const photographer = useSelector(selectProfilePhotographer);
  console.log(photographerPurchases);
  
  const photographerName = photographer?.photographer_name
  console.log(photographerName);
  

  useEffect(() => {
    if (photographerName) {
      console.log(photographerName);
      dispatch(fetchPhotographerPurchasesAsync(photographerName));
    }
  }, [dispatch, photographerName]);

  return (
    <Box sx={{ height: 400, width: '100%' }}>
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
        // checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}
