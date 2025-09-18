# StreakForce API Endpoints

## Environment Variables Required

Create a `.env` file in the backend directory with:

```
DATABASE_URL=mongodb://localhost:27017/streakforce
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
GOOGLE_PROJECT_ID=your_google_project_id_here
GEMINI_API_KEY=your_gemini_api_key


```

## Base URL

```
http://localhost:5000
```

## API Endpoints

### 🔐 Authentication

#### POST /auth/register

Register a new user

**Request Body:**

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**

```json
{
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "johndoe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### POST /auth/login

Authenticate and return JWT

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "johndoe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### 👤 Users

#### GET /users/:id

Fetch user profile

- **Headers**: `Authorization: Bearer <token>`

**Response:**

```json
{
  "message": "User profile retrieved successfully",
  "user": {
    "id": "user_id",
    "username": "johndoe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### PUT /users/:id

Update user profile

- **Headers**: `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Fitness enthusiast",
  "profilePicture": "https://example.com/photo.jpg"
}
```

**Response:**

```json
{
  "message": "User profile updated successfully",
  "user": {
    "id": "user_id",
    "username": "johndoe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "bio": "Fitness enthusiast",
    "profilePicture": "https://example.com/photo.jpg"
  }
}
```

### 🔥 Habits

#### POST /habits

Create a new habit

- **Headers**: `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "name": "Morning Run",
  "description": "Run for 30 minutes every morning",
  "createdBy": "user_id"
}
```

**Response:**

```json
{
  "message": "Habit created successfully",
  "habit": {
    "id": "habit_id",
    "name": "Morning Run",
    "description": "Run for 30 minutes every morning",
    "createdBy": "user_id"
  }
}
```

#### GET /habits/:id

Get habit details

- **Headers**: `Authorization: Bearer <token>`

**Response:**

```json
{
  "message": "Habit details retrieved successfully",
  "habit": {
    "id": "habit_id",
    "name": "Morning Run",
    "description": "Run for 30 minutes every morning",
    "createdBy": "user_id"
  }
}
```

### 👥 Teams

#### POST /teams

Create a team

- **Headers**: `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "name": "Fitness Warriors",
  "description": "A team focused on fitness goals",
  "isPrivate": false,
  "maxMembers": 20,
  "createdBy": "user_id"
}
```

**Response:**

```json
{
  "message": "Team created successfully",
  "team": {
    "name": "Fitness Warriors",
    "description": "A team focused on fitness goals",
    "inviteCode": "ABC12345",
    "isPrivate": false,
    "maxMembers": 20,
    "createdBy": "user_id",
    "members": [
      {
        "user": "user_id",
        "role": "admin",
        "joinedAt": "2024-01-15T10:00:00.000Z"
      }
    ]
  }
}
```

#### GET /teams/:id

Get team details

- **Headers**: `Authorization: Bearer <token>`

**Response:**

```json
{
  "message": "Team details retrieved successfully",
  "team": {
    "id": "team_id",
    "name": "Fitness Warriors",
    "description": "A team focused on fitness goals",
    "inviteCode": "ABC12345",
    "isPrivate": false,
    "maxMembers": 20,
    "createdBy": "user_id"
  }
}
```

### 📊 Progress & Check-Ins

#### POST /checkins

Submit a daily check-in

- **Headers**: `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "habitId": "habit_id_here",
  "checkInDate": "2024-01-15T10:00:00Z",
  "userId": "user_id"
}
```

**Response:**

```json
{
  "message": "Check-in submitted successfully",
  "checkIn": {
    "id": "checkin_id",
    "habitId": "habit_id_here",
    "checkInDate": "2024-01-15T10:00:00Z",
    "userId": "user_id"
  }
}
```

### 🤖 AI Features

#### POST /ai/query

Execute AI query using Google Gemini

**Request Body:**

```json
{
  "query": "What are some good habits for improving productivity?"
}
```

**Response:**

```json
{
  "message": "AI query executed successfully",
  "result": "AI-generated response text here"
}
```

## Response Format

All endpoints return JSON responses with the following structure:

**Success responses:**

```json
{
  "message": "Success message",
  "data": { ... }
}
```

**Error responses:**

```json
{
  "message": "Error message"
}
```

**Common HTTP Status Codes:**

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## Authentication

Most endpoints require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Running the Server

1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Create `.env` file with required variables (see Environment Variables section)
4. Start development server: `npm run dev` or `node index.js`
5. The server will run on `http://localhost:5000`

## Available Endpoints Summary

- **Authentication**: `/auth/register`, `/auth/login`
- **Users**: `/users/:id` (GET, PUT)
- **Habits**: `/habits` (POST), `/habits/:id` (GET)
- **Teams**: `/teams` (POST), `/teams/:id` (GET)
- **Check-ins**: `/checkins` (POST)
- **AI**: `/ai/query` (POST)
