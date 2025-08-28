import React, { useState } from 'react';
import './BoardSwitcher.css';

const BoardSwitcher = ({ onBoardSwitch }) => {
  // Define available boards
  const boards = [
    {
      id: 'my-board',
      name: 'My Board',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="3" y1="9" x2="21" y2="9"></line>
          <line x1="9" y1="21" x2="9" y2="9"></line>
        </svg>
      )
    },
    {
      id: 'planner',
      name: 'Planner',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      )
    },
    {
      id: 'inbox',
      name: 'Inbox',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
          <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
        </svg>
      )
    }
  ];

  const [activeBoard, setActiveBoard] = useState('my-board');

  const handleBoardSwitch = (boardId) => {
    setActiveBoard(boardId);
    if (onBoardSwitch) {
      onBoardSwitch(boardId);
    }
  };

  return (
    <div className="board-switcher">
      <div className="board-options">
        {boards.map((board) => (
          <div
            key={board.id}
            className={`board-option ${activeBoard === board.id ? 'active' : ''}`}
            onClick={() => handleBoardSwitch(board.id)}
          >
            <div className="board-icon">{board.icon}</div>
            <div className="board-name">{board.name}</div>
          </div>
        ))}
        <div
          className="board-option switch-board"
          onClick={() => handleBoardSwitch('my-board')}
        >
          <div className="board-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 0 0-9-9 9 9 0 0 0-9 9 9 9 0 0 0 9 9 9 9 0 0 0 9-9z"></path>
              <path d="M9 17l6-10"></path>
              <path d="M9 7l6 10"></path>
            </svg>
          </div>
          <div className="board-name">Switch Board</div>
        </div>
      </div>
    </div>
  );
};

export default BoardSwitcher;