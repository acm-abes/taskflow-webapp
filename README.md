# Trello Clone

A Trello-like task management application built with React. This application allows users to create boards, add cards, and drag-and-drop cards between different lists.

## Features

- Create and delete boards (lists)
- Add and delete cards
- Drag and drop cards between boards
- Responsive design
- Card labels for categorization

## Technologies Used

- React
- react-beautiful-dnd for drag and drop functionality
- UUID for generating unique IDs

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine

### Installation

1. Clone the repository or download the source code
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm start
```

5. Open your browser and navigate to `http://localhost:3000`

## Usage

- **Add a new list**: Click on "+ Add another list" and enter a title
- **Add a new card**: Click on "+ Add a card" within a list and enter a title
- **Move a card**: Drag and drop a card to another list
- **Delete a card**: Click on the menu button (•••) on a card and select "Delete card"
- **Delete a list**: Click on the menu button (•••) on a list header and select "Delete list"

## Future Enhancements

- User authentication
- Multiple boards
- Card details modal with more options
- Attachments and checklists
- Activity log
- Collaborative features