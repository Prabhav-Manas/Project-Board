# Project-Board
Project Board is a full-stack web application built with the MEAN stack (MongoDB, Express.js, Angular, Node.js) that allows users to register, log in, and manage project records efficiently.

## Features

### User Authentication & Authorization
- Sign Up & Sign In
- Email Verification (via Nodemailer)
- Forgot Password & Reset Password
- File Upload in authentication
- Route Guards (Auth Guard & Login Guard) for secure navigation
- HTTP Interceptor for attaching tokens to API requests

### Project Management
- Create, Read, Update, and Delete (CRUD) operations for project records
- RESTful API endpoints for all backend operations
- API integration with Angular frontend
- Pagination & Search Filters implemented on both backend & frontend

### Security
- Password hashing
- Token-based authentication (JWT)

# Tech Stack
- **Frontend**: Angular
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Email Service**: Nodemailer

# Installation

## Clone the repository
```bash
git clone https://github.com/your-username/Project-Board.git
```

## Install dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

## Run the application
```bash
# Backend
cd backend
npm run start:server

# Frontend
cd ../frontend
ng serve
```

## Visit the app in your browser:
```bash
http://localhost:4200
```