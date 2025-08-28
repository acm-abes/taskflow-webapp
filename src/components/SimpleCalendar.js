import React, { useState, useEffect } from 'react';
import './SimpleCalendar.css';

function SimpleCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', startTime: '', endTime: '' });
  const [showAddEvent, setShowAddEvent] = useState(false);

  // Get days in month
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  // Handle day click
  const handleDayClick = (day) => {
    if (day) {
      const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      setSelectedDate(selectedDate);
    }
  };

  // Handle adding a new event
  const handleAddEvent = () => {
    if (newEvent.title && newEvent.date) {
      const event = {
        id: Date.now(),
        title: newEvent.title,
        date: newEvent.date,
        startTime: newEvent.startTime || '',
        endTime: newEvent.endTime || ''
      };
      
      setEvents([...events, event]);
      setNewEvent({ title: '', date: '', startTime: '', endTime: '' });
      setShowAddEvent(false);
    }
  };

  // Check if a day has events
  const hasEvents = (day) => {
    if (!day) return false;
    
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      .toISOString().split('T')[0];
      
    return events.some(event => event.date === dateStr);
  };

  // Get events for selected date
  const getEventsForSelectedDate = () => {
    if (!selectedDate) return [];
    
    const dateStr = selectedDate.toISOString().split('T')[0];
    return events.filter(event => event.date === dateStr);
  };

  // Delete an event
  const deleteEvent = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  // Load events from localStorage on component mount
  useEffect(() => {
    const savedEvents = localStorage.getItem('calendarEvents');
    if (savedEvents) {
      const parsedEvents = JSON.parse(savedEvents);
      
      // Migrate old events with 'time' field to new format with startTime/endTime
      const migratedEvents = parsedEvents.map(event => {
        if (event.time && !event.startTime) {
          return {
            ...event,
            startTime: event.time,
            endTime: ''
          };
        }
        return event;
      });
      
      setEvents(migratedEvents);
    }
  }, []);

  // Save events to localStorage when events change
  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }, [events]);

  return (
    <div className="simple-calendar-container">
      <div className="calendar-header">
        <h3>Calendar</h3>
        <div className="calendar-nav">
          <button onClick={prevMonth}>&lt;</button>
          <span>{formatDate(currentDate)}</span>
          <button onClick={nextMonth}>&gt;</button>
        </div>
      </div>

      <div className="calendar-grid">
        <div className="weekdays">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>
        <div className="days">
          {getDaysInMonth(currentDate).map((day, index) => (
            <div 
              key={index} 
              className={`day ${day ? '' : 'empty'} ${selectedDate && day && selectedDate.getDate() === day && selectedDate.getMonth() === currentDate.getMonth() ? 'selected' : ''} ${hasEvents(day) ? 'has-events' : ''}`}
              onClick={() => handleDayClick(day)}
            >
              {day}
              {hasEvents(day) && <div className="event-dot"></div>}
            </div>
          ))}
        </div>
      </div>

      <div className="calendar-events-section">
        {selectedDate ? (
          <div className="selected-date-events">
            <h4>{selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h4>
            
            {getEventsForSelectedDate().length > 0 ? (
              <ul className="events-list">
                {getEventsForSelectedDate().map(event => (
                  <li key={event.id} className="event-item">
                    <div className="event-details">
                      <div className="event-title">{event.title}</div>
                      {(event.startTime || event.endTime) && (
                        <div className="event-time">
                          {event.startTime && `From: ${event.startTime}`}
                          {event.startTime && event.endTime && ' - '}
                          {event.endTime && `To: ${event.endTime}`}
                        </div>
                      )}
                      {event.time && <div className="event-time">{event.time}</div>}
                    </div>
                    <button className="delete-event" onClick={() => deleteEvent(event.id)}>×</button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-events">No events for this day</p>
            )}
            
            <button className="add-event-button" onClick={() => setShowAddEvent(true)}>Add Event</button>
          </div>
        ) : (
          <div className="calendar-placeholder">
            <p>Select a date to view or add events</p>
          </div>
        )}

        {showAddEvent && (
          <div className="add-event-form">
            <h4>Add New Event</h4>
            <input 
              type="text" 
              placeholder="Event title" 
              value={newEvent.title}
              onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
            />
            <input 
              type="date" 
              value={newEvent.date}
              onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
            />
            <input 
              type="time" 
              placeholder="Start Time"
              value={newEvent.startTime}
              onChange={(e) => setNewEvent({...newEvent, startTime: e.target.value})}
            />
            <input 
              type="time" 
              placeholder="End Time"
              value={newEvent.endTime}
              onChange={(e) => setNewEvent({...newEvent, endTime: e.target.value})}
            />
            <div className="form-actions">
              <button onClick={handleAddEvent}>Save</button>
              <button onClick={() => setShowAddEvent(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SimpleCalendar;