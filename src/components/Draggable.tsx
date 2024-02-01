import React, { DragEvent, ReactNode } from 'react';
import '../dragDrop.css';

interface CardDragDropProps {
  id?: string;
  className?: string;
  children: ReactNode;
}

const CardDragDrop: React.FC<CardDragDropProps> = ({ id, className, children }) => {
  const dragStart = (e: DragEvent<HTMLDivElement>): void => {
    const target = e.target as HTMLDivElement;
    e.dataTransfer.setData("card_id", target.id);

    setTimeout(() => {
      if (target.style.display === 'none') {
        target.style.display = 'block';
      }
    }, 0);
  };

  const dragOver = (e: DragEvent<HTMLDivElement>): void => {

    e.stopPropagation();
  };

  // Define the styles inline
  const cardStyles: React.CSSProperties = {
    padding: '15px 25px',
    backgroundColor: 'aliceblue',
    maxWidth: '100px',
    cursor: 'pointer',
    marginBottom: '15px',
    borderRadius: '16px',
};

return (
  <div id={id} className={className} draggable onDragStart={dragStart} onDragOver={dragOver} style={cardStyles}>
    {children}
  </div>
);
};

export default CardDragDrop;
