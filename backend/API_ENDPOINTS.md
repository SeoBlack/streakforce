# StreakForce API Endpoints

## Environment Variables Required

Create a `.env` file in the backend directory with:

```
DATABASE_URL=mongodb://localhost:27017/streakforce
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
```

## API Endpoints

### 🔐 Authentication

#### POST /auth/register

Register a new user

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### POST /auth/login

Authenticate and return JWT

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### 👤 Users

#### GET /users/:id

Fetch user profile

- **Headers**: `Authorization: Bearer <token>`

#### PUT /users/:id

Update user profile

- **Headers**: `Authorization: Bearer <token>`

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Fitness enthusiast",
  "profilePicture": "https://example.com/photo.jpg"
}
```

### 🔥 Habits

#### POST /habits

Create a new habit

- **Headers**: `Authorization: Bearer <token>`

```json
{
  "title": "Morning Run",
  "description": "Run for 30 minutes every morning",
  "category": "fitness",
  "frequency": "daily",
  "targetValue": 30,
  "unit": "minutes",
  "color": "#3B82F6",
  "icon": "🏃",
  "teamId": "optional_team_id"
}
```

#### GET /habits/:id

Get habit details

- **Headers**: `Authorization: Bearer <token>`

### 👥 Teams

#### POST /teams

Create a team

- **Headers**: `Authorization: Bearer <token>`

```json
{
  "name": "Fitness Warriors",
  "description": "A team focused on fitness goals",
  "isPrivate": false,
  "maxMembers": 20
}
```

#### GET /teams/:id

Get team details

- **Headers**: `Authorization: Bearer <token>`

### 📊 Progress & Check-Ins

#### POST /checkins

Submit a daily check-in

- **Headers**: `Authorization: Bearer <token>`

```json
{
  "habitId": "habit_id_here",
  "value": 30,
  "notes": "Great run today!",
  "mood": "😊",
  "checkInDate": "2024-01-15T10:00:00Z"
}
```

#### GET /progress/:userId

Get user progress & streak stats

- **Headers**: `Authorization: Bearer <token>`

### 📖 Challenges (Author Feature)

#### POST /challenges

Author creates a challenge

- **Headers**: `Authorization: Bearer <token>`

```json
{
  "title": "30-Day Fitness Challenge",
  "description": "Complete 30 days of consistent exercise",
  "category": "fitness",
  "duration": 30,
  "difficulty": "medium",
  "rules": ["Exercise for at least 30 minutes daily", "No skipping days"],
  "rewards": ["Certificate of completion", "Fitness badge"],
  "isPublic": true,
  "maxParticipants": 100,
  "startDate": "2024-02-01T00:00:00Z",
  "endDate": "2024-03-02T23:59:59Z"
}
```

#### GET /challenges/:id

Fetch challenge details

- **Headers**: `Authorization: Bearer <token>`

## Response Format

All endpoints return JSON responses with the following structure:

```json
{
  "message": "Success message",
  "data": { ... }
}
```

Error responses:

```json
{
  "message": "Error message",
  "details": ["Validation error details"]
}
```

## Authentication

Most endpoints require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Running the Server

1. Install dependencies: `npm install`
2. Create `.env` file with required variables
3. Start development server: `npm run dev`
4. Build for production: `npm run build && npm start`
