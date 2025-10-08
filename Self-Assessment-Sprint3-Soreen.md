# Self-Assessment - Sprint 3

## Example 1: Optimizing Context Functions with useCallback

Initially, our `HabitContext` provided functions directly without memoization, which caused unnecessary re-renders in child components. Here's the original problematic implementation:

```javascript
// Frontend/src/context/HabitContext.jsx (Original - Problematic)
const HabitProvider = ({ children }) => {
  const { apiCall, isAuthenticated } = useAuth();
  const [habits, setHabits] = useState([]);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // This function was recreated on every render
  const getHabitById = async (id) => {
    if (!id) return { success: false, error: "Habit ID is required" };
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiCall(`${API_ENDPOINTS.HABITS}/${id}`, {
        method: "GET",
      });
      const data = response?.data || null;
      setSelectedHabit(data);
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    habits,
    selectedHabit,
    isLoading,
    error,
    getHabitById,
    // other functions...
  };

  return (
    <HabitContext.Provider value={value}>{children}</HabitContext.Provider>
  );
};
```

**The Problem:**

- Every time `HabitProvider` re-rendered (e.g., when state changed), `getHabitById` was recreated as a new function
- This caused the `value` object to be recreated with a new reference
- All components consuming this context would re-render, even if they didn't use the changed data
- In `HabitPage.jsx`, the `useEffect` dependency array included `getHabitById`, causing infinite render loops

**The Solution:**
We wrapped all context functions with `useCallback` and carefully managed dependencies:

```javascript
// Frontend/src/context/HabitContext.jsx (Optimized)
const HabitProvider = ({ children }) => {
  const { apiCall, isAuthenticated } = useAuth();
  const [habits, setHabits] = useState([]);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function is memoized and only recreates when apiCall changes
  const getHabitById = useCallback(
    async (id) => {
      if (!id) return { success: false, error: "Habit ID is required" };
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiCall(`${API_ENDPOINTS.HABITS}/${id}`, {
          method: "GET",
        });
        const data = response?.data || null;
        setSelectedHabit(data);
        return { success: true, data };
      } catch (err) {
        setError(err.message);
        return { success: false, error: err.message };
      } finally {
        setIsLoading(false);
      }
    },
    [apiCall] // Only recreate when apiCall changes
  );

  const getAllHabits = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiCall(API_ENDPOINTS.HABITS, { method: "GET" });
      const data = response?.data || [];
      setHabits(Array.isArray(data) ? data : []);
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, [apiCall]);

  const value = {
    habits,
    selectedHabit,
    isLoading,
    error,
    getHabitById,
    getAllHabits,
    // other memoized functions...
  };

  return (
    <HabitContext.Provider value={value}>{children}</HabitContext.Provider>
  );
};
```

**Key Improvements:**

1. **Stable Function References:** `useCallback` ensures functions maintain the same reference across re-renders unless dependencies change
2. **Prevented Infinite Loops:** Components using these functions in `useEffect` dependency arrays no longer trigger unnecessary re-renders
3. **Performance Optimization:** Child components only re-render when the actual data they consume changes, not when unrelated context state updates
4. **Proper Dependency Management:** Each callback only depends on `apiCall`, which itself is memoized in `AuthContext`

**Real-World Impact:**
In `HabitPage.jsx`, we safely used the memoized function:

```javascript
useEffect(() => {
  if (id) {
    getHabitById(id);
  }
}, [id, getHabitById]); // Safe because getHabitById is now stable
```

---

## Example 2: Preventing Unnecessary Calculations with useMemo

In our `Submission` component, we needed to find a specific habit from an array every time the component rendered. Here's the initial implementation:

```javascript
// Frontend/src/components/submission.jsx (Original - Inefficient)
export default function Submission({ checkin, onContinue, onShare }) {
  const { habits } = useHabits();

  // This search ran on EVERY render, even when habits and checkin didn't change
  const habit = habits.find((habit) => habit._id === checkin.habitId);

  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="submission-card">
      <h1>{checkin.streak || 1}</h1>
      <h2>{habit?.title || "Your Habit"}</h2>
      <span>+{checkin.xp || 20} XP</span>
      {/* ...rest of component */}
    </div>
  );
}
```

**The Problem:**

- The `habits.find()` operation executed on every render
- When `showConfetti` state changed (or any parent component re-rendered), the array search ran again
- If `habits` was a large array (e.g., 50+ habits), this created unnecessary performance overhead
- The calculation result was the same unless `habits` or `checkin` actually changed

**The Solution:**
We used `useMemo` to cache the result of the expensive calculation:

```javascript
// Frontend/src/components/submission.jsx (Optimized)
export default function Submission({ checkin, onContinue, onShare }) {
  const { habits } = useHabits();

  // Memoized calculation - only re-runs when habits or checkin changes
  const habit = useMemo(
    () => habits.find((habit) => habit._id === checkin.habitId),
    [habits, checkin]
  );

  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="submission-card">
      <h1>{checkin.streak || 1}</h1>
      <h2>{habit?.title || "Your Habit"}</h2>
      <span>+{checkin.xp || 20} XP</span>
      {/* ...rest of component */}
    </div>
  );
}
```

**Key Improvements:**

1. **Cached Computation:** The `find()` operation only runs when `habits` or `checkin` actually changes
2. **Optimized Re-renders:** When `showConfetti` state updates, the habit search doesn't re-run
3. **Better Performance:** For large habit arrays, this significantly reduces unnecessary CPU cycles
4. **Clear Dependencies:** The dependency array `[habits, checkin]` explicitly shows when recalculation is needed

**Lessons Learned:**

- **When to Use useMemo:** Best for expensive calculations (array operations, filtering, complex computations) that depend on specific values
- **Don't Overuse:** Simple variable assignments don't need `useMemo` - only use it when there's measurable benefit
- **Dependency Array Matters:** Just like `useEffect` and `useCallback`, proper dependencies are crucial for correctness

---

## Example 3: Building a Robust Context API with Nested Dependencies

Our authentication system initially had issues with the Context API structure that caused circular dependencies and inconsistent state. Here's the problematic setup:

```javascript
// Frontend/src/context/AuthContext.jsx (Original - Had Issues)
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // This function was not memoized
  const apiCall = async (url, options = {}) => {
    const token = state.token;
    const config = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };
    const response = await fetch(`${API_BASE_URL}${url}`, config);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Request failed");
    }
    return await response.json();
  };

  // verifyToken was also not memoized
  const verifyToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      return;
    }
    const response = await apiCall(API_ENDPOINTS.VERIFY, { method: "GET" });
    if (response.success === false) {
      return response;
    }
    const { user } = response;
    dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: { user, token } });
  };

  useEffect(() => {
    verifyToken();
  }, []); // This caused warnings about missing dependencies

  const value = {
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    login,
    register,
    logout,
    clearError,
    updateProfile,
    apiCall,
    googleLogin,
    forgotPassword,
    getProfileByUserId,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

**The Problems:**

1. `apiCall` was recreated on every render, causing all dependent contexts (HabitContext, CheckinContext) to recreate their functions
2. `verifyToken` wasn't memoized but was used in `useEffect`, triggering ESLint warnings
3. The `value` object was recreated on every state change, causing all consumers to re-render
4. Nested contexts (Habit, Checkin) that depended on `apiCall` had unstable dependencies

**The Solution:**
We properly structured the Context with `useCallback` for all functions:

```javascript
// Frontend/src/context/AuthContext.jsx (Optimized)
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Memoized helper - only recreates when token changes
  const apiCall = useCallback(
    async (url, options = {}) => {
      const token = state.token;
      const config = {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
      };
      const response = await fetch(`${API_BASE_URL}${url}`, config);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Request failed");
      }
      return await response.json();
    },
    [state.token] // Only recreate when token changes
  );

  // Memoized with proper dependencies
  const verifyToken = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      return;
    }
    const response = await apiCall(API_ENDPOINTS.VERIFY, { method: "GET" });
    if (response.success === false) {
      return response;
    }
    const { user } = response;
    dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: { user, token } });
  }, [apiCall]);

  const getProfileByUserId = useCallback(
    async (userId) => {
      const response = await apiCall(
        `${API_ENDPOINTS.GET_USER_PROFILE_BY_ID}${userId}`,
        { method: "GET" }
      );
      if (response.success === false) {
        return response;
      }
      return response.user;
    },
    [apiCall]
  );

  useEffect(() => {
    verifyToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Safe - only run once on mount

  const value = {
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    login,
    register,
    logout,
    clearError,
    updateProfile,
    apiCall,
    googleLogin,
    forgotPassword,
    getProfileByUserId,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

**Key Improvements:**

1. **Stable API Helper:** `apiCall` is memoized with `[state.token]` as dependency, creating a stable reference for other contexts
2. **Proper Dependency Chain:** `verifyToken` depends on `apiCall`, which is now stable
3. **Cascading Optimization:** Since `apiCall` is stable, `HabitContext` and `CheckinContext` functions that depend on it are also stable
4. **Clean Context Consumption:** Other contexts can safely use `apiCall` without causing re-render loops

**Lessons Learned:**

- **Context Provider Optimization:** Always memoize functions provided through Context API to prevent cascading re-renders
- **Dependency Hierarchy:** When contexts depend on other contexts (HabitContext uses AuthContext's `apiCall`), stable references are critical
- **useReducer + useCallback:** This pattern works well for complex state management - `useReducer` for state, `useCallback` for actions
- **ESLint Hooks Rules:** The exhaustive-deps rule helps catch these issues early - address warnings rather than disable them

**Real-World Impact:**
This optimization improved our app's performance dramatically:

- Before: Every token change caused HabitContext and CheckinContext to recreate all their functions, triggering re-renders across the app
- After: Token changes only affect authentication-related components; habit and check-in components remain stable unless their specific data changes
