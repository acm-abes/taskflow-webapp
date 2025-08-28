import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import './Card.css';

function Card({ card, index, boardId, deleteCard, updateCard, toggleCardCompleted, toggleActivityCompleted, addCardActivity, updateCardDeadline, toggleTaskCompleted, addActivityTask, addCardLabel }) {
  const [showCardMenu, setShowCardMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(card.title);
  const [editDescription, setEditDescription] = useState(card.description || '');
  const [showActivities, setShowActivities] = useState(false);
  const [newActivity, setNewActivity] = useState('');
  const [expandedActivities, setExpandedActivities] = useState({});
  const [newTasks, setNewTasks] = useState({});
  const [showDeadlinePicker, setShowDeadlinePicker] = useState(false);
  const [selectedDeadline, setSelectedDeadline] = useState(card.deadline || '');
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  // Predefined colors for labels
  const colorOptions = [
    { name: 'green', color: '#61bd4f', id: 'green' },
    { name: 'Yellow', color: '#f2d600', id: 'yellow' },
    { name: 'Orange', color: '#ff9f1a', id: 'orange' },
    { name: 'important', color: '#eb5a46', id: 'important' },
    { name: 'Purple', color: '#c377e0', id: 'purple' },
    { name: 'Blue', color: '#0079bf', id: 'blue' }
  ];
  
  // State for custom label text
  const [customLabelText, setCustomLabelText] = useState('');
  const [selectedColorId, setSelectedColorId] = useState('');
  const [showCustomTextInput, setShowCustomTextInput] = useState(false);

  // Function to add a color label to the card
  const handleAddLabel = (colorId, customText = '') => {
    // Check if the label already exists to avoid duplicates
    if (!card.labels.includes(colorId)) {
      // If custom text is provided, use it instead of the default color name
      const labelData = customText ? { id: colorId, text: customText } : colorId;
      addCardLabel(boardId, card.id, labelData);
    }
    setShowColorPicker(false);
    setShowCustomTextInput(false);
    setCustomLabelText('');
  };

  // Function to handle color selection and show custom text input
  const handleColorSelect = (colorId) => {
    setSelectedColorId(colorId);
    setShowCustomTextInput(true);
  };

  // Function to submit custom label
  const handleCustomLabelSubmit = () => {
    if (selectedColorId) {
      handleAddLabel(selectedColorId, customLabelText.trim() || colorOptions.find(opt => opt.id === selectedColorId).name);
    }
  };

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided) => (
        <div
          className={`card ${card.completed ? 'card-completed' : ''}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="card-radio-container">
            <input 
              type="radio" 
              className="card-radio" 
              checked={card.completed} 
              onChange={(e) => {
                e.stopPropagation();
                toggleCardCompleted(boardId, card.id);
              }} 
            />
          </div>
          <div className="card-labels">
            {card.labels && card.labels.map((label, i) => {
              // Check if the label is an object with id and text properties
              if (label && typeof label === 'object' && label.id) {
                const colorOption = colorOptions.find(opt => opt.id === label.id);
                if (colorOption) {
                  return (
                    <span 
                      key={i} 
                      className={`card-label`}
                      style={{ backgroundColor: colorOption.color }}
                    >
                      {label.text || colorOption.name}
                    </span>
                  );
                }
                // Return null if no matching color option found
                return null;
              } 
              // Check if the label is one of our color IDs (string)
              else {
                const colorOption = colorOptions.find(opt => opt.id === label);
                if (colorOption) {
                  // If it's a color ID, use the color from our options
                  return (
                    <span 
                      key={i} 
                      className={`card-label`}
                      style={{ backgroundColor: colorOption.color }}
                    >
                      {colorOption.name}
                    </span>
                  );
                } else {
                  // Otherwise, use the existing label format
                  return (
                    <span key={i} className={`card-label label-${label.toLowerCase()}`}>
                      {label}
                    </span>
                  );
                }
              }
            })}
          </div>
          {isEditing ? (
            <div className="card-edit-form">
              <textarea
                className="card-edit-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Enter card title..."
                autoFocus
              />
              <textarea
                className="card-edit-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Enter card description..."
              />
              <div className="card-edit-actions">
                <button 
                  className="card-edit-save" 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (editTitle.trim()) {
                      updateCard(boardId, card.id, editTitle, editDescription);
                      setIsEditing(false);
                    }
                  }}
                >
                  Save
                </button>
                <button 
                  className="card-edit-cancel" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditTitle(card.title);
                    setEditDescription(card.description || '');
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="card-content">
              <div className="card-title">{card.title}</div>
              {card.description && (
                <div className="card-description">{card.description}</div>
              )}
              
              {card.deadline && (
                <div className="card-deadline">
                  <span className="card-deadline-label">Deadline:</span>
                  <span className="card-deadline-date">{card.deadline}</span>
                </div>
              )}
              
              {showDeadlinePicker && (
                <div className="card-deadline-picker">
                  <input 
                    type="date" 
                    value={selectedDeadline}
                    onChange={(e) => setSelectedDeadline(e.target.value)}
                  />
                  <div className="card-deadline-actions">
                    <button 
                      onClick={() => {
                        updateCardDeadline(boardId, card.id, selectedDeadline);
                        setShowDeadlinePicker(false);
                      }}
                    >
                      Save
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedDeadline(card.deadline || '');
                        setShowDeadlinePicker(false);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              
              {card.activities && card.activities.length > 0 && (
                <div className="card-activities-summary">
                  <span onClick={() => setShowActivities(!showActivities)} className="card-activities-toggle">
                    Activities: {card.activities.filter(a => a.completed).length}/{card.activities.length}
                  </span>
                </div>
              )}
              
              {showActivities && card.activities && card.activities.length > 0 && (
                <div className="card-activities">
                  <h4>Activities</h4>
                  {card.activities.map(activity => (
                    <div key={activity.id} className="card-activity-container">
                      <div className="card-activity-item">
                        <input 
                          type="checkbox" 
                          checked={activity.completed} 
                          onChange={() => toggleActivityCompleted(boardId, card.id, activity.id)}
                        />
                        <span 
                          className={`${activity.completed ? 'completed' : ''} activity-text`}
                          onClick={() => {
                            setExpandedActivities(prev => ({
                              ...prev,
                              [activity.id]: !prev[activity.id]
                            }));
                          }}
                        >
                          {activity.text}
                          <span className="task-count">
                            ({activity.tasks && activity.tasks.length > 0 ? activity.tasks.filter(t => t.completed).length : 0}/{activity.tasks ? activity.tasks.length : 0})
                          </span>
                          <span className="expand-icon">
                            {expandedActivities[activity.id] ? '▼' : '►'}
                          </span>
                        </span>
                      </div>
                      
                      {expandedActivities[activity.id] && (
                        <div className="activity-tasks">
                          {activity.tasks && activity.tasks.length > 0 ? activity.tasks.map(task => (
                            <div key={task.id} className="task-item">
                              <input 
                                type="checkbox" 
                                checked={task.completed} 
                                onChange={() => toggleTaskCompleted(boardId, card.id, activity.id, task.id)}
                              />
                              <span className={task.completed ? 'completed' : ''}>{task.text}</span>
                            </div>
                          )) : <div>No tasks available</div>}
                          
                          <div className="add-task">
                            <input 
                              type="text" 
                              value={newTasks[activity.id] || ''}
                              onChange={(e) => setNewTasks(prev => ({
                                ...prev,
                                [activity.id]: e.target.value
                              }))}
                              placeholder="Add a new task..."
                            />
                            <button 
                              onClick={() => {
                                if (newTasks[activity.id]?.trim()) {
                                  addActivityTask(boardId, card.id, activity.id, newTasks[activity.id]);
                                  setNewTasks(prev => ({
                                    ...prev,
                                    [activity.id]: ''
                                  }));
                                }
                              }}
                              disabled={!newTasks[activity.id]?.trim()}
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="card-add-activity">
                    <input 
                      type="text" 
                      value={newActivity}
                      onChange={(e) => setNewActivity(e.target.value)}
                      placeholder="Add a new activity..."
                    />
                    <button 
                      onClick={() => {
                        addCardActivity(boardId, card.id, newActivity);
                        setNewActivity('');
                      }}
                      disabled={!newActivity.trim()}
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          {showColorPicker && (
            <div className="card-color-picker">
              <h4>Select a color</h4>
              <div className="color-options">
                {colorOptions.map((option) => (
                  <div 
                    key={option.id}
                    className="color-option"
                    style={{ backgroundColor: option.color }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleColorSelect(option.id);
                    }}
                  >
                    <span className="color-name">{option.name}</span>
                  </div>
                ))}
              </div>
              <button 
                className="close-color-picker"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowColorPicker(false);
                }}
              >
                Cancel
              </button>
            </div>
          )}
          
          {showCustomTextInput && (
            <div className="card-custom-label-input">
              <h4>Enter custom label text</h4>
              <input
                type="text"
                value={customLabelText}
                onChange={(e) => setCustomLabelText(e.target.value)}
                placeholder="Enter custom text (optional)"
                autoFocus
              />
              <div className="custom-label-actions">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCustomLabelSubmit();
                  }}
                >
                  Add Label
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowCustomTextInput(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          <div className="card-menu-container">
            <button 
              className="card-menu-button" 
              onClick={(e) => {
                e.stopPropagation();
                setShowCardMenu(!showCardMenu);
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
            </button>
            {showCardMenu && (
              <div className="card-menu">
                <div 
                  className="card-menu-item" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                    setShowCardMenu(false);
                  }}
                >
                  Edit card
                </div>

                <div 
                  className="card-menu-item" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowColorPicker(true);
                    setShowCardMenu(false);
                  }}
                >
                  Add color label
                </div>

                <div 
                  className="card-menu-item" 
                  onClick={(e) => {
                    e.stopPropagation();
                    // Only toggle if activities exist
                    if (card.activities && card.activities.length > 0) {
                      setShowActivities(!showActivities);
                    } else {
                      // Show a message or handle the case when no activities exist
                      alert('No activities available for this card.');
                    }
                    setShowCardMenu(false);
                  }}
                >
                  {showActivities ? 'Hide activities' : 'Show activities'}
                </div>

                <div 
                  className="card-menu-item" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeadlinePicker(true);
                    setShowCardMenu(false);
                  }}
                >
                  {card.deadline ? 'Change deadline' : 'Set deadline'}
                </div>

                <div 
                  className="card-menu-item" 
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteCard(boardId, card.id);
                    setShowCardMenu(false);
                  }}
                >
                  Delete card
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default Card;