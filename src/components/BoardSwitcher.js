import React, { useState } from 'react';
import './BoardSwitcher.css';

function BoardSwitcher({ onBoardSwitch }) {
  const [activeBoard, setActiveBoard] = useState('my-board');
  
  const boards = [
    { 
      id: 'my-board', 
      name: 'Board',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 3H5C3.9 3 3 3.9 3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
          <path d="M8.5 15h2v2h-2zm0-8h2v6h-2zm5 0h2v2h-2zm0 4h2v4h-2z"/>
        </svg>
      ) 
    },
    { 
      id: 'planner', 
      name: 'Planner',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM5 5v2h14V5H5z"/>
        </svg>
      ) 
    },
    { 
      id: 'inbox', 
      name: 'Inbox',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5v-3h3.56c.69 1.19 1.97 2 3.45 2s2.75-.81 3.45-2H19v3zm0-5h-4.99c0 1.1-.9 2-2 2s-2-.9-2-2H5V5h14v9z"/>
        </svg>
      ) 
    }
  ];

  const handleBoardSwitch = (boardId) => {
    setActiveBoard(boardId);
    if (onBoardSwitch) {
      onBoardSwitch(boardId);
    }
  };

  return (
    <div className="board-switcher">
      <div className="board-switcher-container">
        {boards.map(board => (
          <div 
            key={board.id}
            className={`board-option ${activeBoard === board.id ? 'active' : ''}`}
            onClick={() => handleBoardSwitch(board.id)}
          >
            <div className="board-icon">{board.icon}</div>
            <div className="board-name">{board.name}</div>
          </div>
        ))}
        <div className="board-option switch-boards">
          <div className="board-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
            </svg>
          </div>
          <div className="board-name">Switch boards</div>
        </div>
      </div>
    </div>
  );
}

export default BoardSwitcher;