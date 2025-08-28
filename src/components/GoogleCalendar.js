import React, { useEffect, useState } from 'react';
import './GoogleCalendar.css';

function GoogleCalendar() {
  const [isCalendarLoaded, setIsCalendarLoaded] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState([]);

  // Function to initialize the Google Calendar API
  const initGoogleCalendar = () => {
    // Check if the Google API script is already loaded
    if (window.gapi) {
      loadCalendar();
      return;
    }

    // Load the Google API script
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => loadCalendar();
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  };

  // Function to load the calendar after the API is loaded
  const loadCalendar = () => {
    window.gapi.load('client:auth2', initClient);
  };

  // Initialize the Google API client
  const initClient = () => {
    // You need to replace these with your own Google API credentials
    // Get credentials from Google Cloud Console: https://console.cloud.google.com/
    // This is a placeholder - you must replace with your actual credentials
    const API_KEY = 'YOUR_API_KEY';
    const CLIENT_ID = 'YOUR_CLIENT_ID';
    
    // If API keys are not set, don't try to initialize the client
    if (API_KEY === 'YOUR_API_KEY' || CLIENT_ID === 'YOUR_CLIENT_ID') {
      console.warn('Google Calendar API credentials not configured');
      return;
    }
    const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];
    const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

    window.gapi.client
      .init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      })
      .then(() => {
        // Listen for sign-in state changes
        window.gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state
        updateSigninStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get());
      })
      .catch(error => {
        console.error('Error initializing Google Calendar API', error);
      });
  };

  // Update UI based on sign-in status
  const updateSigninStatus = (isSignedIn) => {
    if (isSignedIn) {
      setIsCalendarLoaded(true);
      listUpcomingEvents();
    } else {
      setIsCalendarLoaded(false);
    }
  };

  // Function to handle sign-in
  const handleAuthClick = () => {
    if (window.gapi && window.gapi.auth2) {
      window.gapi.auth2.getAuthInstance().signIn();
    } else {
      console.error('Google API not loaded yet');
    }
  };

  // Function to handle sign-out
  const handleSignoutClick = () => {
    if (window.gapi && window.gapi.auth2) {
      window.gapi.auth2.getAuthInstance().signOut();
    }
  };

  // Function to list upcoming events
  const listUpcomingEvents = () => {
    window.gapi.client.calendar.events
      .list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: 'startTime',
      })
      .then(response => {
        const events = response.result.items;
        setCalendarEvents(events);
      })
      .catch(error => {
        console.error('Error fetching calendar events', error);
      });
  };

  // Initialize Google Calendar when component mounts
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // Only initialize if we're in a browser environment
    if (typeof window !== 'undefined') {
      initGoogleCalendar();
    }
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="google-calendar-container">
      <div className="calendar-header">
        <h3>Google Calendar</h3>
        {isCalendarLoaded ? (
          <button onClick={handleSignoutClick} className="calendar-auth-button">
            Sign Out
          </button>
        ) : (
          <button onClick={handleAuthClick} className="calendar-auth-button">
            Connect Google Calendar
          </button>
        )}
      </div>

      {isCalendarLoaded ? (
        <div className="calendar-events">
          {calendarEvents.length > 0 ? (
            <ul className="event-list">
              {calendarEvents.map((event, index) => (
                <li key={index} className="event-item">
                  <div className="event-title">{event.summary}</div>
                  <div className="event-time">
                    {event.start.dateTime ? (
                      <span>{formatDate(event.start.dateTime)}</span>
                    ) : (
                      <span>{event.start.date} (All day)</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-events">No upcoming events found.</p>
          )}
        </div>
      ) : (
        <div className="calendar-placeholder">
          <p>To use Google Calendar integration:</p>
          <ol>
            <li>Create a project in <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer">Google Cloud Console</a></li>
            <li>Enable the Google Calendar API</li>
            <li>Create OAuth 2.0 credentials (API Key and Client ID)</li>
            <li>Replace the placeholder credentials in this component</li>
          </ol>
          <button onClick={handleAuthClick} className="calendar-auth-button" disabled={window.gapi?.auth2?.getAuthInstance?.() === undefined}>
            Connect Google Calendar
          </button>
        </div>
      )}
    </div>
  );
}

export default GoogleCalendar;