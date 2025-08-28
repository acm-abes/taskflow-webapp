import React, { useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Card from './Card';
import './Board.css';

function Board({ board, addNewCard, deleteCard, deleteBoard, updateCard, toggleCardCompleted, toggleActivityCompleted, addCardActivity, updateCardDeadline, toggleTaskCompleted, addActivityTask, addCardLabel }) {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardDescription, setNewCardDescription] = useState('');
  const [showBoardMenu, setShowBoardMenu] = useState(false);

  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      addNewCard(board.id, newCardTitle, newCardDescription);
      setNewCardTitle('');
      setNewCardDescription('');
    }
    setIsAddingCard(false);
  };

  return (
    <div className="board">
      <div className="board-header">
        <h3>{board.title}</h3>
        <div className="board-menu-container">
          <button 
            className="board-menu-button" 
            onClick={() => setShowBoardMenu(!showBoardMenu)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </button>
          {showBoardMenu && (
            <div className="board-menu">
              <div className="board-menu-item" onClick={() => deleteBoard(board.id)}>
                Delete list
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Droppable droppableId={board.id}>
        {(provided) => (
          <div 
            className="cards-container"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {board.cards.map((card, index) => (
              <Card 
                  key={card.id} 
                  card={card} 
                  index={index}
                  boardId={board.id}
                  deleteCard={deleteCard}
                  updateCard={updateCard}
                  toggleCardCompleted={toggleCardCompleted}
                  toggleActivityCompleted={toggleActivityCompleted}
                  addCardActivity={addCardActivity}
                  updateCardDeadline={updateCardDeadline}
                  toggleTaskCompleted={toggleTaskCompleted}
                  addActivityTask={addActivityTask}
                  addCardLabel={addCardLabel}
                />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      
      {isAddingCard ? (
        <div className="add-card-form">
          <textarea
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            placeholder="Enter a title for this card..."
            autoFocus
            className="card-title-input"
          />
          <textarea
            value={newCardDescription}
            onChange={(e) => setNewCardDescription(e.target.value)}
            placeholder="Enter a description (optional)..."
            className="card-description-input"
          />
          <div className="add-card-actions">
            <button onClick={handleAddCard}>Add Card</button>
            <button onClick={() => setIsAddingCard(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="add-card" onClick={() => setIsAddingCard(true)}>
          <span>+ Add a card</span>
        </div>
      )}
    </div>
  );
}

export default Board;