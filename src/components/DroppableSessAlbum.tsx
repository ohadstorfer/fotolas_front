import { ImageList, ImageListItem } from '@mui/material';
import React, { DragEvent, ReactNode } from 'react';

interface DroppableSessAlbumProps {
  id?: string;
  className?: string;
  children: ReactNode;
}

const DroppableSessAlbum: React.FC<DroppableSessAlbumProps> = ({ id, className, children }) => {
  const drop = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    const card_id = e.dataTransfer.getData("card_id");

    const card = document.getElementById(card_id);

    if (card) {
      card.style.display = "block";
      e.currentTarget.appendChild(card);
    }
  };

  const dragOver = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
  };

  // Define the styles inline
  const boardStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: 750,
    width: '100%',
    maxWidth: '900px',
    backgroundColor: 'rgb(3, 2, 0)',
    padding: '15px',
    borderRadius: '16px',
  };

  return (
    <div id={id} className={className} onDrop={drop} onDragOver={dragOver} style={boardStyles}>
          {children}
    </div>
  );
};

export default DroppableSessAlbum;
