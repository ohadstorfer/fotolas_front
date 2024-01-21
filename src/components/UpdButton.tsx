import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: "50%",
  left: "50%",
  whiteSpace: 'nowrap',
  width: 1,
  
});

export default function InputFileUpload() {
  return (
    <Button component="label" variant="contained"  startIcon={<CloudUploadIcon />} >
      Create Album
      <VisuallyHiddenInput type="file" />
    </Button>
  );
}
