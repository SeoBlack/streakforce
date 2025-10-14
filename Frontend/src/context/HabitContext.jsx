import React, { useCallback, useEffect, useState } from "react";
import HabitContext from "./habitContextBase";
import { API_ENDPOINTS } from "../utils/api";
import { useAuth } from "./useAuth";

const HabitProvider = ({ children }) => {
  const { apiCall, isAuthenticated } = useAuth();

  const [habits, setHabits] = useState([]);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const clearError = useCallback(() => setError(null), []);

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
    [apiCall]
  );

  const createHabit = useCallback(
    async ({ title, description, duration, privacy, members = [], aspect }) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiCall(API_ENDPOINTS.HABITS, {
          method: "POST",
          body: JSON.stringify({
            title,
            description,
            duration,
            privacy,
            members,
            aspect,
          }),
        });
        const newHabit = response?.data;
        if (newHabit) {
          setHabits((prev) => [newHabit, ...prev]);
        }
        return { success: true, data: newHabit };
      } catch (err) {
        setError(err.message);
        return { success: false, error: err.message };
      } finally {
        setIsLoading(false);
      }
    },
    [apiCall]
  );

  const deleteHabit = useCallback(
    async (id) => {
      if (!id) return { success: false, error: "Habit ID is required" };
      setIsLoading(true);
      setError(null);
      try {
        await apiCall(`${API_ENDPOINTS.HABITS}/${id}`, { method: "DELETE" });
        setHabits((prev) => prev.filter((h) => h._id !== id));
        if (selectedHabit?._id === id) {
          setSelectedHabit(null);
        }
        return { success: true };
      } catch (err) {
        setError(err.message);
        return { success: false, error: err.message };
      } finally {
        setIsLoading(false);
      }
    },
    [apiCall, selectedHabit]
  );

  useEffect(() => {
    if (isAuthenticated) {
      getAllHabits();
    } else {
      setHabits([]);
      setSelectedHabit(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]); // Only re-fetch when authentication status changes

  const value = {
    habits,
    selectedHabit,
    isLoading,
    error,
    // actions
    clearError,
    getAllHabits,
    getHabitById,
    createHabit,
    deleteHabit,
    setSelectedHabit,
  };

  return (
    <HabitContext.Provider value={value}>{children}</HabitContext.Provider>
  );
};

export default HabitProvider;
