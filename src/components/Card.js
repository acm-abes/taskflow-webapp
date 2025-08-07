import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import './Card.css';

function Card({ card, index, boardId, deleteCard, updateCard, toggleCardCompleted, toggleActivityCompleted, addCardActivity, updateCardDeadline, toggleTaskCompleted, addActivityTask }) {
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
            {card.labels.map((label, i) => (
              <span key={i} className={`card-label label-${label.toLowerCase()}`}>
                {label}
              </span>
            ))}
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
              
              {showActivities && (
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
                            ({activity.tasks.filter(t => t.completed).length}/{activity.tasks.length})
                          </span>
                          <span className="expand-icon">
                            {expandedActivities[activity.id] ? '▼' : '►'}
                          </span>
                        </span>
                      </div>
                      
                      {expandedActivities[activity.id] && (
                        <div className="activity-tasks">
                          {activity.tasks.map(task => (
                            <div key={task.id} className="task-item">
                              <input 
                                type="checkbox" 
                                checked={task.completed} 
                                onChange={() => toggleTaskCompleted(boardId, card.id, activity.id, task.id)}
                              />
                              <span className={task.completed ? 'completed' : ''}>{task.text}</span>
                            </div>
                          ))}
                          
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
                    setShowActivities(!showActivities);
                    setShowCardMenu(false);
                  }}
                >
                  {showActivities ? 'Hide activities' : 'Show activities'}
                </div>

                <div 
                  className="card-menu-item" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeadlinePicker(!showDeadlinePicker);
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