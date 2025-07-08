# WTWR Backend Server

The back-end project is focused on creating a server for the WTWR application. You'll gain a deeper understanding of how to work with databases, set up security and testing, and deploy web applications on a remote machine. The eventual goal is to create a server with an API and user authorization.

## Features

- User authentication with JWT
- MongoDB database integration
- RESTful API endpoints for clothing items
- Error handling middleware
- Input validation
- Security best practices

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- ESLint for code quality
- Jest for testing

## Running the Project

```bash
# Install dependencies
npm install

# Start the server
npm run start

# Start the server with hot reload (development)
npm run dev

# Run linter
npm run lint
```

## API Endpoints

### Users

- POST /signin - User login
- POST /signup - User registration
- GET /users/me - Get current user
- PATCH /users/me - Update user profile

### Clothing Items

- GET /items - Get all items
- POST /items - Create new item
- DELETE /items/:id - Delete item
- PUT /items/:id/likes - Like item
- DELETE /items/:id/likes - Unlike item

## Environment Variables

Create a .env file in the root directory with the following variables:

```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/wtwr_db
JWT_SECRET=your-secret-key
NODE_ENV=development
```

## Deployment

The application is deployed and accessible at:

- **Frontend**: https://BrianWTWRProject.jumpingcrab.com
- **Backend API**: https://api.BrianWTWRProject.jumpingcrab.com

The backend is running on a Google Cloud VM with PM2 process management, nginx reverse proxy, and SSL encryption via Let's Encrypt.
