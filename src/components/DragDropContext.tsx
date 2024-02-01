import React from 'react'
import DroppablePerAlbum from './DroppablePerAlbum'
import Draggable from './Draggable'
import DroppableSessAlbum from './DroppableSessAlbum'

const DragDropContext = () => {
    return (

        <main className='flexbox'>

            <DroppableSessAlbum id="board-2" className='board'>
                <Draggable id="card-2" className='card'>
                    <p>Card two</p>
                </Draggable>
            </DroppableSessAlbum>

            <DroppablePerAlbum id="board-1" className='board'>
                <Draggable id="card-1" className='card'>
                    <p>Card one</p>
                </Draggable>
            </DroppablePerAlbum>

        </main>)
}

export default DragDropContext