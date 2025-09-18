# Frontend Self-Assessment

## Example 1: Improving Component Reusability

Initially, our Button component was functional but lacked flexibility for different use cases. Here's the original implementation:

```tsx
// Button.tsx - Basic implementation
const Button: React.FC<ButtonProps> = ({ children, onClick, className }) => {
  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
};
```

The component worked for basic button functionality but failed when:

- Navigation was needed (no Link support)
- Different button types were required (submit, reset)
- Consistent styling across the app was needed

To address these issues, we refactored the code to handle multiple use cases effectively:

```tsx
// Optimized Button.tsx
const Button: React.FC<ButtonProps> = ({
  children,
  to,
  onClick,
  type = "button",
  className,
}) => {
  const baseClasses =
    "w-full h-full font-semibold py-4 rounded-2xl text-base sm:text-xl transition-colors duration-200 shadow-lg transform active:scale-95 flex items-center justify-center";

  if (to) {
    return (
      <Link to={to} className={clsx(baseClasses, className)}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={clsx(baseClasses, className)}
    >
      {children}
    </button>
  );
};
```

**Key Improvements:**

- **Dual Functionality**: Added support for both navigation (Link) and regular button actions
- **Type Safety**: Added proper TypeScript interfaces with optional props
- **Consistent Styling**: Implemented base classes with clsx for conditional styling
- **Flexibility**: Made className optional for custom styling while maintaining consistency

## Example 2: Debugging State Management in HomePage

We encountered an issue with state initialization in our HomePage component. Here's the problematic setup:

```tsx
// Problematic state management
const HomePage: React.FC = () => {
  const [members, setMembers] = useState<typeof teamMembers>([]);
  const [habitList, setHabitList] = useState<typeof habits>([]);
  const [mainHabit] = useState({
    title: "Read 10 pages",
    streak: "15 day streak",
  });

  useEffect(() => {
    setMembers(teamMembers);
    setHabitList(habits);
  }, []);
```

The component worked but had unnecessary complexity:

- State was initialized as empty arrays then immediately populated
- useEffect was used for static data that could be initialized directly
- Multiple state variables for related data

**Solution:**
We simplified the state management by initializing with actual data:

```tsx
// Simplified state management
const HomePage: React.FC = () => {
  const [members] = useState<typeof teamMembers>(teamMembers);
  const [habitList] = useState<typeof habits>(habits);
  const [mainHabit] = useState({
    title: "Read 10 pages",
    streak: "15 day streak",
  });

  // Removed unnecessary useEffect
```

**Lessons Learned:**

- **Direct Initialization**: Initialize state with actual data when possible instead of empty values
- **Reduce Complexity**: Avoid unnecessary useEffect for static data
- **Performance**: Direct initialization is more efficient than setting state in useEffect

## Example 3: Form Validation in LoginForm

Our LoginForm component handled basic form submission but lacked proper validation and error handling:

```tsx
// Basic form handling
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  onLogin(email, password);
  navigate("/home");
};
```

The form worked for basic login but failed when:

- Invalid email formats were entered
- Empty fields were submitted
- Network errors occurred during login

**Solution:**
We added proper validation and error handling:

```tsx
// Enhanced form handling
const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

const validateForm = () => {
  const newErrors: { email?: string; password?: string } = {};

  if (!email) {
    newErrors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    newErrors.email = "Email is invalid";
  }

  if (!password) {
    newErrors.password = "Password is required";
  } else if (password.length < 6) {
    newErrors.password = "Password must be at least 6 characters";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) return;

  try {
    await onLogin(email, password);
    navigate("/home");
  } catch (error) {
    setErrors({ general: "Login failed. Please try again." });
  }
};
```

**Key Improvements:**

- **Client-side Validation**: Added email format and password length validation
- **Error State Management**: Implemented error state to display validation messages
- **Async Handling**: Added try-catch for proper error handling
- **User Experience**: Clear error messages guide users to fix issues

## Summary

These improvements demonstrate our focus on:

1. **Component Reusability**: Making components flexible and reusable across the application
2. **State Management**: Simplifying state logic and reducing unnecessary complexity
3. **User Experience**: Adding proper validation and error handling for better user interaction
4. **Code Quality**: Writing maintainable, type-safe code with clear separation of concerns
