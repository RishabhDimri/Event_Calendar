# Event Calendar

A feature-rich and modern calendar application built with **React**, **TypeScript**, and **Vite**, designed to manage events dynamically with a clean and user-friendly interface.

## Features

### 1. Calendar View
- Displays a grid view of the current month with properly aligned days.
- Includes navigation buttons to switch between previous and next months.
- Highlights the current day and selected day visually.

### 2. Event Management
- **Add Events**: Click on a day to add a new event, including:
  - Event Name
  - Start and End Time
  - Optional Description
- **Edit or Delete Events**: Manage existing events by editing or deleting them.
- **Event List**: View all events for the selected day in a modal.

### 3. Data Persistence
- Events are saved in **localStorage**, ensuring data persists even after page refreshes.

### 4. Bonus Features (Optional)
- Drag-and-drop functionality to reschedule events between days.
- Color coding for events (e.g., work, personal, others).
- Export events for a specific month as **JSON** or **CSV**.

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **UI Components**: shadcn
- **Deployment**: Vercel

## Installation and Setup

### Prerequisites
- Node.js installed on your system.

### Steps to Run Locally
1. Clone the repository:
   ```bash
   git clone https://github.com/RishabhDimri/Event_Calendar.git

2. Navigate to the project directory:
   ```bash
   cd Event_Calendar

3. Install dependencies:
   ```bash
   npm install

4. Start the development server:
   ```bash
   npm run dev
