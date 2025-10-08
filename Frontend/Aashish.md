### Overview

This project showcases the full integration between backend and frontend for a habit tracking application with gamified elements and team collaboration.
Key contributions include:

- Secure authentication via JWT middleware.

- Comprehensive user schema design with embedded stats and profile.

- Habit creation and retrieval APIs.

- XP and streak logic for motivation.

- Email invitation system for team habits.

- Frontend React components with context-based state management and protected routing.

### Backend: Habit Retrieval

The getUserAllHabits controller retrieves all habits affiliated with a specific user, populating related member and creator data for richer client display.

```javascript
const habits = await Habit.find({ members: userId })
  .populate("members", "fullName email")
  .populate("createdBy", "fullName email");

res.status(200).json({
  message: "All habit affiliated to the user",
  data: habits,
});
```

Reflection:

Ensures users can see both personal and team habits.

Uses Mongoose population to enrich returned data with user info.

Implements defensive checks (if (!userId)) and proper error responses.

Backend: User Schema Design

I structured a flexible user model that cleanly separates profile and gamification stats.

```javascript
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, minlength: 6, select: true },
  profile: userProfileSchema,
  stats: userStatsSchema,
});

const userStatsSchema = new mongoose.Schema({
  xp: { current: Number, total: Number },
  level: { current: Number, title: String },
  streak: {
    current: Number,
    longest: Number,
    lastCheckIn: Date,
  },
});

```
Reflection:

Cleanly modularizes profile and stats for scalability.

Uses virtuals (like fullName) for derived fields.

Implements secure password hashing with bcrypt via pre("save").

Avoids overexposing sensitive data by stripping fields in toJSON.


### Authentication Middleware

I implemented a middleware to verify and attach the logged-in user to each request using JWT.
This ensures protected routes can only be accessed by authenticated users.

```javascript
const token = req.headers.authorization.split(" ")[1];
const decoded = jwt.verify(token, process.env.JWT_SECRET);
const user = await User.findById(decoded.userId);
req.user = user;
```

Reflection:

Ensures secure token validation for all protected endpoints.

Attaches authenticated user info (req.user) to be reused later.

Includes proper error handling for missing or invalid tokens.

Keeps routes stateless, following REST best practices.

### Habit Creation Logic

The createHabit function enables both solo and team habits.
For team habits, I added validation, duplicate filtering, and automated email invitations.

```javascript
if (privacy === "team") {
  const uniqueMembers = [...new Set(members)];
  const foundMembers = await Users.find({ email: { $in: uniqueMembers } });
  const missingMembers = members.filter(
    (email) => !foundMembers.map(m => m.email).includes(email)
  );

  if (missingMembers.length > 0) {
    return res.status(400).json({ message: `${missingMembers.join(", ")} are not registered users.` });
  }

  sendEmail({
    to: member.email,
    subject: "New Habit Team Invitation",
    data: { habitName: title, duration, startDate, endDate }
  });
}
```

Reflection:

Prevents duplicate or invalid team member entries.

Dynamically calculates start and end dates based on habit duration.

Integrates email notifications via NodeMailer for collaboration.

Emphasizes data consistency and user feedback on every request.


### Check-In, XP, and Streak System

To make habits more engaging, I created a gamified progress system.
Users earn XP for daily check-ins and level up when thresholds are met.
I also implemented streak tracking to encourage consistency.

```javascript
const earnedXp = 10;
user.stats.xp.current += earnedXp;
const xpNeeded = 100 * user.stats.level.current;

if (user.stats.xp.current >= xpNeeded) {
  user.stats.xp.current -= xpNeeded;
  user.stats.level.current += 1;
  user.stats.level.title = getLevelTitle(user.stats.level.current);
}

### For streaks:

const oneDay = 24 * 60 * 60 * 1000;
if (lastCheck && today - lastCheck <= oneDay * 1.5) {
  user.stats.streak.current += 1;
} else {
  user.stats.streak.current = 1;
}

```
Reflection:

Added progressive XP scaling based on current level.

Prevented duplicate daily check-ins by validating timestamps.

Designed streak logic with a 36-hour tolerance for flexibility.

Updates user’s XP, level, and streaks in real-time after each check-in.

### Email Notification Module

The email system improves collaboration and communication between team members.

```javascript
const transporter = nodeMailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

```
Reflection:

Built a modular email utility that reads HTML templates dynamically.

Supports tokenized placeholders like {{habitName}} or {{startDate}}.

Ensures proper error handling for failed deliveries.


### Frontend: Route Protection
React’s layout system enforces authentication-based navigation control.
If a user is not logged in, they’re redirected to /login.
If logged in, they’re redirected to /home.

```javascript

useEffect(() => {
  if (!isAuthenticated) {
    navigate("/login");
  }
}, [isAuthenticated, navigate]);

```

Reflection:

Protects routes declaratively within React Router layouts.

Provides a clean separation between public (AuthLayout) and private (MainLayout) routes.

Keeps UX consistent across login states.

### Frontend: Habit Creation Workflow

The Create Challenge page connects user input with backend APIs using React state hooks and context (useHabits).
It supports both solo and team habits, with dynamic email invitations.

```javascript

const habitData = {
  title: habitName,
  duration,
  privacy,
  description: habitDescription,
  members: emails,
  aspect,
};

const response = await createHabit(habitData);
if (response.success) {
  toast.success("Habit created successfully!");
  navigate("/habits");
}

```

Reflection:

Ensures input validation before sending requests.

Displays instant feedback with toast notifications.

Connects directly with backend email invitations and habit persistence logic.

Encourages teamwork and accountability through collaborative creation flow.


### Key Learnings

1. Mastered end-to-end flow from authentication to protected data retrieval.

2. Gained practical experience designing nested Mongoose schemas and virtual fields.

3. Improved understanding of frontend-backend synchronization using React contexts.

4. Learned to handle async operations gracefully with try/catch and consistent error feedback.

5. Built a scalable foundation for gamified habit tracking (XP, levels, streaks).


### Future Improvements

1. Implement pagination and caching for large datasets.

2. Add habit analytics dashboards with completion trends.

3. Integrate real-time notifications using WebSockets or Firebase.

4. Enhance team management (roles, permissions, progress tracking).


