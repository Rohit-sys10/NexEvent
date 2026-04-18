# NexEvent

**Event Management Platform**

A comprehensive full-stack event management solution enabling users to discover, create, and register for events with real-time updates and instant notifications. Built with modern technologies for scalability, security, and optimal user experience.

## Live Demo

Experience the application live:

-  Frontend: https://nex-event-five.vercel.app  
-  Backend API: https://nexevent-l7az.onrender.com  


---

## Test Credentials

Use the following accounts to explore different roles in the application:

### User Access
- **Email:** usernew@gmail.com  
- **Password:** 789321  

### Organizer Access
- **Email:** organizer@gmail.com  
- **Password:** 564896  

---


## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Usage Guide](#usage-guide)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## Features

### Core Functionality
- **User Authentication** – Secure JWT-based registration and login with encrypted password storage
- **Role-Based Access Control** – Distinct organizer and attendee roles with granular permissions
- **Event Management** – Full CRUD operations for event creation, modification, and deletion
- **Event Registration** – Seamless registration system with duplicate prevention and capacity tracking
- **Real-Time Updates** – Live registration count synchronization across all connected clients via Socket.io
- **Persistent Notifications** – Database-backed notification system with read/unread status tracking
- **Responsive UI** – Fully optimized for desktop and mobile devices using React and Tailwind CSS

### Technical Features
- **Real-Time Communication** – Socket.io integration for instant event and notification updates
- **Clean Architecture** – MVC pattern backend with component-driven React frontend
- **Security First** – bcryptjs password hashing, JWT authentication, CORS protection, input validation
- **Data Persistence** – MongoDB with Mongoose ODM for reliable data management
- **State Management** – Context API for centralized authentication and notification state

## Tech Stack

### Backend
- **Node.js** – JavaScript runtime environment
- **Express.js** – Lightweight web framework
- **MongoDB** – NoSQL database with Mongoose ODM
- **Socket.io** – Real-time bidirectional communication
- **JWT** – Stateless authentication
- **bcryptjs** – Password hashing and security
- **Helmet** – Security headers middleware
- **CORS** – Cross-origin resource sharing

### Frontend
- **React 19** – Modern UI library with hooks
- **Vite** – Fast bundler and development server
- **Tailwind CSS** – Utility-first styling framework
- **React Router** – Client-side routing
- **React Hook Form** – Efficient form state management
- **Zod** – TypeScript-first schema validation
- **Socket.io Client** – Real-time event communication
- **Lucide React** – Icon library

## Project Structure

```
NexEvent/
├── .gitignore
├── package.json
├── pnpm-lock.yaml
├── README.md
├── client/
│   ├── .env
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── public/
│   │   └── icon.svg
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── styles.css
│       ├── components/
│       │   ├── ErrorBoundary.jsx
│       │   ├── EventCard.jsx
│       │   ├── Navbar.jsx
│       │   ├── NotificationBell.jsx
│       │   ├── ProtectedRoute.jsx
│       │   ├── event/
│       │   │   ├── EventCard.jsx
│       │   │   └── EventForm.jsx
│       │   ├── layout/
│       │   │   └── Navbar.jsx
│       │   ├── notification/
│       │   │   └── NotificationDropdown.jsx
│       │   └── ui/
│       │       ├── Avatar.jsx
│       │       ├── Badge.jsx
│       │       ├── Button.jsx
│       │       ├── Card.jsx
│       │       ├── EmptyState.jsx
│       │       ├── Input.jsx
│       │       ├── Skeleton.jsx
│       │       └── Toaster.jsx
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   ├── NotificationContext.jsx
│       │   └── ToastContext.jsx
│       ├── hooks/
│       │   ├── useAuth.js
│       │   ├── useCountdown.js
│       │   ├── useEventFilters.js
│       │   ├── useEventForm.js
│       │   ├── useEventState.js
│       │   ├── useNotification.js
│       │   ├── useNotifications.js
│       │   ├── useRegistrationActions.js
│       │   ├── useSocket.js
│       │   └── useToast.js
│       ├── lib/
│       │   ├── event.js
│       │   ├── socket.js
│       │   └── ui.js
│       ├── pages/
│       │   ├── CreateEvent.jsx
│       │   ├── Dashboard.jsx
│       │   ├── EditEvent.jsx
│       │   ├── EventDetail.jsx
│       │   ├── Login.jsx
│       │   ├── MyRegistrations.jsx
│       │   └── Signup.jsx
│       ├── services/
│       │   ├── api.js
│       │   ├── eventService.js
│       │   ├── http.js
│       │   └── notificationService.js
│       └── state/
│           └── EventState.jsx
└── server/
   ├── .env
   ├── .gitignore
   ├── package.json
   ├── package-lock.json
   └── src/
      ├── app.js
      ├── server.js
      ├── config/
      │   ├── cors.js
      │   └── database.js
      ├── controllers/
      │   ├── authController.js
      │   ├── eventController.js
      │   ├── notificationController.js
      │   └── registrationController.js
      ├── middleware/
      │   ├── authMiddleware.js
      │   └── errorHandler.js
      ├── models/
      │   ├── Event.js
      │   ├── Notification.js
      │   ├── Registration.js
      │   └── User.js
      ├── routes/
      │   ├── auth.js
      │   ├── events.js
      │   ├── notifications.js
      │   └── registrations.js
      └── socket/
         ├── realtime.js
         └── socketHandlers.js
```

## Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **pnpm** v8 or higher (or npm/yarn)
- **MongoDB** – Atlas cloud instance or local installation

### Installation

#### 1. Backend Setup

```bash
cd server
pnpm install
```

Create a `.env` file in the `server` directory:

```env
# Database Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/nexevent

# Authentication
JWT_SECRET=your-secure-jwt-secret-key-change-in-production
JWT_EXPIRE=7d

# Server Configuration
NODE_ENV=development
PORT=5000

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Optional: Socket.io Configuration
SOCKET_URL=http://localhost:5000
```

Start the development server:

```bash
pnpm run dev
```

Backend will be available at `http://localhost:5000`

#### 2. Frontend Setup

```bash
cd client
pnpm install
```

Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

Start the development server:

```bash
pnpm run dev
```

Frontend will be available at `http://localhost:5173`

#### 3. Root Installation (Optional - for monorepo setup)

```bash
pnpm install
pnpm run dev
```

This will start both backend and frontend concurrently if configured in the root `package.json`.

## Usage Guide

### User Registration & Authentication

1. Navigate to the **Sign Up** page
2. Select your account type:
   - **Attendee** – Discover and register for events
   - **Organizer** – Create and manage events
3. Complete the registration form with valid credentials
4. Verify your email (if configured) and log in

### For Event Attendees

- **Browse Events** – Explore upcoming events on the dashboard
- **Filter & Search** – Find events by category, date, or location
- **Event Details** – View comprehensive event information, capacity, and attendee count
- **Register** – One-click registration with duplicate prevention
- **Manage Registrations** – View all your registered events in "My Registrations"
- **Real-Time Notifications** – Receive instant updates about event changes and cancellations
- **Notification Center** – Access all notifications with read/unread status tracking

### For Event Organizers

- **Create Events** – Set title, description, date, time, location, and capacity
- **Manage Attendees** – View list of registered attendees in real-time
- **Edit Events** – Modify event details after creation
- **Delete Events** – Remove events and notify registered attendees
- **Event Analytics** – Monitor registration count and attendance status
- **Real-Time Updates** – See live attendee count updates across all connected users

## API Reference

### Authentication Endpoints

```http
POST /api/auth/register
```
Register a new user account.

```http
POST /api/auth/login
```
Authenticate user and receive JWT token.

### Event Endpoints

```http
GET /api/events
```
Retrieve all events with optional filters.

```http
POST /api/events
```
Create a new event (Organizer only).

```http
GET /api/events/:id
```
Retrieve event details.

```http
PUT /api/events/:id
```
Update event information (Organizer only).

```http
DELETE /api/events/:id
```
Delete an event (Organizer only).

### Registration Endpoints

```http
POST /api/events/:id/register
```
Register user for an event.

```http
GET /api/registrations
```
Retrieve user's event registrations.

### Notification Endpoints

```http
GET /api/notifications
```
Retrieve user's notifications.

```http
PATCH /api/notifications/:id/read
```
Mark notification as read.

### Real-Time Events (Socket.io)

- `eventCreated` – New event published
- `eventUpdated` – Event details modified
- `registrationUpdated` – Attendance count changed
- `notificationReceived` – Instant notification delivery
- `userRegistered` – New attendee registered
- `userUnregistered` – Attendee removed

## Deployment

### Frontend Deployment

**Recommended Platforms:**
- [Vercel](https://vercel.com) – Native Next.js/React support, automatic deployments
- [Netlify](https://netlify.com) – Easy Git integration, serverless functions
- [GitHub Pages](https://pages.github.com) – Free hosting for static sites

**Steps for Vercel:**
```bash
pnpm install -g vercel
vercel login
vercel
```

### Backend Deployment

**Recommended Platforms:**
- [Render](https://render.com) – Easy Node.js hosting, automatic deployments
- [Railway](https://railway.app) – Simple CLI deployment
- [Heroku](https://heroku.com) – Classic platform with good Node.js support
- [AWS](https://aws.amazon.com) – EC2, Elastic Beanstalk, or Lambda

**Environment Variables for Production:**
- Set `NODE_ENV=production`
- Use strong, unique `JWT_SECRET`
- Configure proper `FRONTEND_URL` and `CORS` settings
- Enable HTTPS for all endpoints
- Use MongoDB Atlas with IP whitelist

### Database (MongoDB Atlas)

1. Create free tier cluster at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create database user with strong password
3. Whitelist IP addresses (or use 0.0.0.0 for development only)
4. Copy connection string and set as `MONGO_URI`

## Development

### Running Tests

```bash
# Backend tests
cd server
pnpm run test

# Frontend tests
cd client
pnpm run test
```

### Code Quality

```bash
# Linting
pnpm run lint

# Type checking (TypeScript)
pnpm run type-check

# Format code
pnpm run format
```

### Building for Production

```bash
# Build backend
cd server
pnpm run build

# Build frontend
cd client
pnpm run build
```

## Project Architecture

### MVC Pattern (Backend)

- **Models** – MongoDB schemas defining data structure
- **Controllers** – Business logic and request handling
- **Routes** – API endpoint definitions and routing

### Component-Driven Design (Frontend)

- **Pages** – Route-level components
- **Components** – Reusable UI elements
- **Context** – Global state management
- **Hooks** – Custom logic extraction
- **Services** – API client abstraction

## Security Considerations

- Passwords hashed with bcryptjs (10 salt rounds)
- JWT tokens with expiration (default 7 days)
- CORS enabled only for whitelisted origins
- Input validation on all API endpoints
- Environment variables for sensitive data
- Helmet.js for security headers
- Rate limiting recommended for production

## Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Standards

- Follow existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR
- Keep commits atomic and descriptive

## Troubleshooting

### Backend Connection Issues

- Verify MongoDB URI is correct
- Check if MongoDB cluster is active
- Ensure IP address is whitelisted in MongoDB Atlas
- Verify network connectivity: `ping cluster0.mongodb.net`

### Socket.io Connection Failures

- Ensure backend is running on correct port
- Check `SOCKET_URL` environment variable
- Verify CORS is enabled for Socket.io
- Check browser console for error messages

### Frontend Build Errors

- Clear `node_modules` and `pnpm-lock.yaml`, reinstall
- Ensure Node.js version is v18+
- Check all environment variables are set
- Verify all imports are correct

## License

This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.

## Support

For support, questions, or bug reports:

- **GitHub Issues** – Report bugs and request features
- **Documentation** – See backend and frontend README files for additional details
- **Email** – Contact the development team

---

**Version:** 1.0.0  
**Last Updated:** April 2026  
**Author:** ROHIT
