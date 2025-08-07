import React, { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { v4 as uuidv4 } from 'uuid';
import './App.css';
import Board from './components/Board';
import Navbar from './components/Navbar';
import BoardSwitcher from './components/BoardSwitcher';

function App() {


  // Define multiple board sets
  const boardSets = {
    'my-board': [
      {
        id: uuidv4(),
        title: 'Today',
        cards: [
          {
            id: uuidv4(),
            title: 'Learn React',
            description: 'Study React fundamentals and hooks',
            labels: ['Frontend', 'Important'],
            completed: false,
            members: [],
            deadline: '2023-12-31',
            activities: [
              { 
                id: uuidv4(), 
                text: 'Read React documentation', 
                completed: false,
                tasks: [
                  { id: uuidv4(), text: 'Read about useState', completed: false },
                  { id: uuidv4(), text: 'Read about useEffect', completed: false }
                ]
              },
              { 
                id: uuidv4(), 
                text: 'Practice with hooks', 
                completed: true,
                tasks: [
                  { id: uuidv4(), text: 'Create sample app', completed: true },
                  { id: uuidv4(), text: 'Implement custom hooks', completed: true }
                ]
              }
            ]
          },
          {
            id: uuidv4(),
            title: 'Build a Trello Clone',
            description: 'Create a Trello-like application using React',
            labels: ['Project', 'Frontend'],
            completed: false,
            members: [],
            deadline: '2023-12-15',
            activities: [
              { 
                id: uuidv4(), 
                text: 'Set up project structure', 
                completed: true,
                tasks: [
                  { id: uuidv4(), text: 'Create React app', completed: true },
                  { id: uuidv4(), text: 'Install dependencies', completed: true }
                ]
              },
              { 
                id: uuidv4(), 
                text: 'Implement drag and drop', 
                completed: false,
                tasks: [
                  { id: uuidv4(), text: 'Install react-beautiful-dnd', completed: true },
                  { id: uuidv4(), text: 'Create draggable components', completed: false }
                ]
              }
            ]
          }
        ]
      },
      {
        id: uuidv4(),
        title: 'This Week',
        cards: [
          {
            id: uuidv4(),
            title: 'Design UI Components',
            description: 'Create reusable UI components for the application',
            labels: ['Design', 'Frontend'],
            completed: false,
            members: [],
            deadline: '2024-01-10',
            activities: [
              { id: uuidv4(), text: 'Create button components', completed: true },
              { id: uuidv4(), text: 'Design card layout', completed: false }
            ]
          }
        ]
      },
      {
        id: uuidv4(),
        title: 'Later',
        cards: [
          {
            id: uuidv4(),
            title: 'Project Setup',
            description: 'Initialize project with React and required dependencies',
            labels: ['Setup'],
            completed: false,
            members: [],
            deadline: '2023-12-10',
            activities: [
              { id: uuidv4(), text: 'Install dependencies', completed: true },
              { id: uuidv4(), text: 'Configure webpack', completed: false }
            ]
          }
        ]
      }
    ],
    'planner': [
      {
        id: uuidv4(),
        title: 'Today',
        cards: [
          {
            id: uuidv4(),
            title: 'Team Meeting',
            description: 'Discuss project progress with team',
            labels: ['Meeting'],
            completed: false,
            members: [],
            deadline: '2023-12-05',
            activities: [
              { id: uuidv4(), text: 'Prepare agenda', completed: true },
              { id: uuidv4(), text: 'Send meeting invites', completed: false }
            ]
          }
        ]
      },
      {
        id: uuidv4(),
        title: 'This Week',
        cards: [
          {
            id: uuidv4(),
            title: 'Complete Frontend',
            description: 'Finish all frontend tasks',
            labels: ['Task'],
            completed: false,
            members: [],
            activities: [
              { id: uuidv4(), text: 'Implement responsive design', completed: false },
              { id: uuidv4(), text: 'Fix UI bugs', completed: false }
            ]
          }
        ]
      },
      {
        id: uuidv4(),
        title: 'This Month',
        cards: [
          {
            id: uuidv4(),
            title: 'Project Delivery',
            description: 'Deliver the project to client',
            labels: ['Milestone'],
            completed: false,
            members: [],
            activities: [
              { id: uuidv4(), text: 'Prepare documentation', completed: false },
              { id: uuidv4(), text: 'Final testing', completed: false }
            ]
          }
        ]
      }
    ],
    'inbox': [
      {
        id: uuidv4(),
        title: 'New',
        cards: [
          {
            id: uuidv4(),
            title: 'Review Pull Request',
            description: 'Check and approve team member PR',
            labels: ['Code Review'],
            completed: false,
            members: [],
            activities: [
              { id: uuidv4(), text: 'Check code quality', completed: false },
              { id: uuidv4(), text: 'Test functionality', completed: false }
            ]
          }
        ]
      },
      {
        id: uuidv4(),
        title: 'Assigned',
        cards: [
          {
            id: uuidv4(),
            title: 'Fix Navigation Bug',
            description: 'Address the navigation issue in mobile view',
            labels: ['Bug'],
            completed: false,
            members: [],
            activities: [
              { id: uuidv4(), text: 'Reproduce the bug', completed: true },
              { id: uuidv4(), text: 'Fix responsive layout', completed: false }
            ]
          }
        ]
      }
    ]
  };

  const [currentBoardSet, setCurrentBoardSet] = useState('my-board');
  const [boards, setBoards] = useState(boardSets[currentBoardSet]);

  const handleBoardSwitch = (boardId) => {
    setCurrentBoardSet(boardId);
    setBoards(boardSets[boardId]);
  };

  const [isAddBoardOpen, setIsAddBoardOpen] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');

  const handleDragEnd = (result) => {
    const { destination, source } = result;

    // If there's no destination or the item is dropped in the same place
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    // Make a copy of the boards
    const newBoards = [...boards];
    
    // Find source and destination board indices
    const sourceBoardIndex = newBoards.findIndex(board => board.id === source.droppableId);
    const destBoardIndex = newBoards.findIndex(board => board.id === destination.droppableId);
    
    // Get the card that was dragged
    const draggedCard = newBoards[sourceBoardIndex].cards[source.index];
    
    // Remove the card from the source board
    newBoards[sourceBoardIndex].cards.splice(source.index, 1);
    
    // Add the card to the destination board
    newBoards[destBoardIndex].cards.splice(destination.index, 0, draggedCard);
    
    // Update the state
    setBoards(newBoards);
  };

  const addNewCard = (boardId, cardTitle, cardDescription = '') => {
    if (!cardTitle.trim()) return;
    
    const newCard = {
      id: uuidv4(),
      title: cardTitle,
      description: cardDescription,
      labels: [],
      completed: false,
      members: [],
      deadline: '',
      activities: []
    };

    const updatedBoards = boards.map(board => {
      if (board.id === boardId) {
        return {
          ...board,
          cards: [...board.cards, newCard]
        };
      }
      return board;
    });

    setBoards(updatedBoards);
    
    // Update the boardSets with the new card
    boardSets[currentBoardSet] = updatedBoards;
  };

  const addNewBoard = () => {
    if (!newBoardTitle.trim()) return;
    
    const newBoard = {
      id: uuidv4(),
      title: newBoardTitle,
      cards: []
    };

    const updatedBoards = [...boards, newBoard];
    setBoards(updatedBoards);
    
    // Update the boardSets with the new board
    boardSets[currentBoardSet] = updatedBoards;
    
    setNewBoardTitle('');
    setIsAddBoardOpen(false);
  };

  const deleteCard = (boardId, cardId) => {
    const updatedBoards = boards.map(board => {
      if (board.id === boardId) {
        return {
          ...board,
          cards: board.cards.filter(card => card.id !== cardId)
        };
      }
      return board;
    });

    setBoards(updatedBoards);
    
    // Update the boardSets with the deleted card
    boardSets[currentBoardSet] = updatedBoards;
  };

  const deleteBoard = (boardId) => {
    const updatedBoards = boards.filter(board => board.id !== boardId);
    setBoards(updatedBoards);
    
    // Update the boardSets with the deleted board
    boardSets[currentBoardSet] = updatedBoards;
  };

  const updateCard = (boardId, cardId, updatedTitle, updatedDescription) => {
    const updatedBoards = boards.map(board => {
      if (board.id === boardId) {
        return {
          ...board,
          cards: board.cards.map(card => {
            if (card.id === cardId) {
              return {
                ...card,
                title: updatedTitle,
                description: updatedDescription
              };
            }
            return card;
          })
        };
      }
      return board;
    });

    setBoards(updatedBoards);
    
    // Update the boardSets with the updated card
    boardSets[currentBoardSet] = updatedBoards;
  };

  const updateCardDeadline = (boardId, cardId, deadline) => {
    const updatedBoards = boards.map(board => {
      if (board.id === boardId) {
        return {
          ...board,
          cards: board.cards.map(card => {
            if (card.id === cardId) {
              return {
                ...card,
                deadline
              };
            }
            return card;
          })
        };
      }
      return board;
    });

    setBoards(updatedBoards);
    
    // Update the boardSets with the updated card
    boardSets[currentBoardSet] = updatedBoards;
  };

  const toggleCardCompleted = (boardId, cardId) => {
    const updatedBoards = boards.map(board => {
      if (board.id === boardId) {
        return {
          ...board,
          cards: board.cards.map(card => {
            if (card.id === cardId) {
              return {
                ...card,
                completed: !card.completed
              };
            }
            return card;
          })
        };
      }
      return board;
    });

    setBoards(updatedBoards);
    
    // Update the boardSets with the updated card
    boardSets[currentBoardSet] = updatedBoards;
  };

  const toggleActivityCompleted = (boardId, cardId, activityId) => {
    const updatedBoards = boards.map(board => {
      if (board.id === boardId) {
        return {
          ...board,
          cards: board.cards.map(card => {
            if (card.id === cardId) {
              return {
                ...card,
                activities: card.activities.map(activity => {
                  if (activity.id === activityId) {
                    const newCompletedState = !activity.completed;
                    // When marking an activity as completed, also mark all its tasks as completed
                    return {
                      ...activity,
                      completed: newCompletedState,
                      tasks: activity.tasks.map(task => ({
                        ...task,
                        completed: newCompletedState ? true : task.completed
                      }))
                    };
                  }
                  return activity;
                })
              };
            }
            return card;
          })
        };
      }
      return board;
    });

    setBoards(updatedBoards);
    
    // Update the boardSets with the updated card
    boardSets[currentBoardSet] = updatedBoards;
  };

  const toggleTaskCompleted = (boardId, cardId, activityId, taskId) => {
    const updatedBoards = boards.map(board => {
      if (board.id === boardId) {
        return {
          ...board,
          cards: board.cards.map(card => {
            if (card.id === cardId) {
              return {
                ...card,
                activities: card.activities.map(activity => {
                  if (activity.id === activityId) {
                    // Update the specific task
                    const updatedTasks = activity.tasks.map(task => {
                      if (task.id === taskId) {
                        return {
                          ...task,
                          completed: !task.completed
                        };
                      }
                      return task;
                    });
                    
                    // Check if all tasks are completed after the update
                    const allTasksCompleted = updatedTasks.every(task => task.completed);
                    
                    // Auto-complete the activity if all tasks are completed
                    return {
                      ...activity,
                      tasks: updatedTasks,
                      completed: allTasksCompleted || activity.completed
                    };
                  }
                  return activity;
                })
              };
            }
            return card;
          })
        };
      }
      return board;
    });

    setBoards(updatedBoards);
    
    // Update the boardSets with the updated card
    boardSets[currentBoardSet] = updatedBoards;
  };

  const addActivityTask = (boardId, cardId, activityId, taskText) => {
    if (!taskText.trim()) return;
    
    const newTask = {
      id: uuidv4(),
      text: taskText,
      completed: false
    };

    const updatedBoards = boards.map(board => {
      if (board.id === boardId) {
        return {
          ...board,
          cards: board.cards.map(card => {
            if (card.id === cardId) {
              return {
                ...card,
                activities: card.activities.map(activity => {
                  if (activity.id === activityId) {
                    return {
                      ...activity,
                      tasks: [...activity.tasks, newTask]
                    };
                  }
                  return activity;
                })
              };
            }
            return card;
          })
        };
      }
      return board;
    });

    setBoards(updatedBoards);
    
    // Update the boardSets with the updated card
    boardSets[currentBoardSet] = updatedBoards;
  };

  const addCardActivity = (boardId, cardId, activityText) => {
    if (!activityText.trim()) return;
    
    const newActivity = {
      id: uuidv4(),
      text: activityText,
      completed: false,
      tasks: []
    };

    const updatedBoards = boards.map(board => {
      if (board.id === boardId) {
        return {
          ...board,
          cards: board.cards.map(card => {
            if (card.id === cardId) {
              return {
                ...card,
                activities: [...card.activities, newActivity]
              };
            }
            return card;
          })
        };
      }
      return board;
    });

    setBoards(updatedBoards);
    
    // Update the boardSets with the updated card
    boardSets[currentBoardSet] = updatedBoards;
  };



  return (
    <div className="app">
      <Navbar />
      <div className="board-container">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="boards">
            {boards.map(board => (
              <Board 
                key={board.id} 
                board={board} 
                addNewCard={addNewCard}
                deleteCard={deleteCard}
                deleteBoard={deleteBoard}
                updateCard={updateCard}
                toggleCardCompleted={toggleCardCompleted}
                toggleActivityCompleted={toggleActivityCompleted}
                addCardActivity={addCardActivity}
                updateCardDeadline={updateCardDeadline}
                toggleTaskCompleted={toggleTaskCompleted}
                addActivityTask={addActivityTask}
              />
            ))}
            
            {isAddBoardOpen ? (
              <div className="add-board-form">
                <input
                  type="text"
                  value={newBoardTitle}
                  onChange={(e) => setNewBoardTitle(e.target.value)}
                  placeholder="Enter board title"
                  autoFocus
                />
                <div className="add-board-actions">
                  <button onClick={addNewBoard}>Add Board</button>
                  <button onClick={() => setIsAddBoardOpen(false)}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="add-board" onClick={() => setIsAddBoardOpen(true)}>
                <span>+ Add another list</span>
              </div>
            )}
          </div>
        </DragDropContext>
      </div>
      <BoardSwitcher onBoardSwitch={handleBoardSwitch} />
    </div>
  );
}

export default App;