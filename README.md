# Job Portal Application

A full-stack job portal application that connects college students with job opportunities posted by college administrators. The application features user authentication, job posting, application management, and more.

## Features

- **User Authentication**: Secure login and registration for students and administrators
- **Role-Based Access Control**: Different interfaces and permissions for students and administrators
- **Job Management**: Admins can create, edit, and delete job postings
- **Application Tracking**: Students can apply to jobs and track application status
- **Profile Management**: Users can update their personal information
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode Support**: Toggle between light and dark themes

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Framer Motion for animations

### Backend
- Node.js
- Express.js
- MySQL
- TypeScript
- JWT Authentication

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- MySQL (v8 or higher)

## Installation

### 1. Clone the repository

```
git clone https://github.com/AbhimanyuAhuja12/CampusHire-JobPortal.git
```

### 2. Set up the backend

```
cd backend
```

# Install dependencies
npm install

# Create .env file

Edit the `.env` file with your database credentials and JWT secret:

```
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=job_portal
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

### 3. Set up the database

Create a MySQL database named `job_portal` 

### 4. Set up the frontend

```
come into root folder than write command:
cd frontend
cd campus_hire
```

# Install dependencies
```
npm install
```

# Create .env.local file
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 5. Start the development servers

#### Backend
```
cd backend
npm run dev
```

#### Frontend
```
cd frontend
cd campus_hire
npm run dev
```

The frontend will be available at `http://localhost:3000` and the backend API at `http://localhost:5000/api`.

## Project Structure

```
job-portal-application/
├── backend/
│   ├── config/           # Database and app configuration
│   ├── controllers/      # Request handlers
│   ├── database/         # SQL schema and migrations
│   ├── middleware/       # Express middleware
│   ├── models/           # Data models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── utils/            # Utility functions
│   ├── app.ts            # Express app setup
│   └── server.ts         # Server entry point
│
├── frontend/
│   ├── app/              # Next.js app directory
│   │   ├── admin/        # Admin pages
│   │   ├── auth/         # Authentication pages
│   │   ├── dashboard/    # Student dashboard
│   │   ├── jobs/         # Job listings
│   │   └── page.tsx      # Home page
│   ├── components/       # React components
│   │   ├── layout/       # Layout components
│   │   └── ui/           # UI components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   └── public/           # Static assets
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/profile` - Get current user profile

### Jobs
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get a specific job
- `POST /api/jobs` - Create a new job (admin only)
- `PUT /api/jobs/:id` - Update a job (admin only)
- `DELETE /api/jobs/:id` - Delete a job (admin only)

### Applications
- `GET /api/applications/my-applications` - Get user's applications
- `POST /api/applications` - Apply for a job
- `PUT /api/applications/:id` - Update application status (admin only)

### Users
- `GET /api/users` - Get all users (admin only)
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/:id/approve` - Approve a user (admin only)

## User Roles

### Student
- Browse job listings
- Apply for jobs
- Track application status
- Update profile

### Admin
- Create, edit, and delete job postings
- Review and manage job applications
- Approve student accounts
- View statistics

