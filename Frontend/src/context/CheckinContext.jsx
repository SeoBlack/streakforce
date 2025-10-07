import React, { useCallback, useEffect, useState } from "react";
import CheckinContext from "./checkinContextBase";
import { API_ENDPOINTS } from "../utils/api";
import { useAuth } from "./useAuth";

const CheckinProvider = ({ children }) => {
  const { apiCall } = useAuth();

  const [checkins, setCheckins] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const clearError = useCallback(() => setError(null), []);

  /**
   * Submit a check-in for a habit
   * @param {string} habitId - The ID of the habit to check in
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  const submitCheckIn = useCallback(
    async (habitId) => {
      if (!habitId) {
        return { success: false, error: "Habit ID is required" };
      }

      setIsLoading(true);
      setError(null);
      const response = await apiCall(API_ENDPOINTS.CHECKINS, {
        method: "POST",
        body: JSON.stringify({ habitId }),
      });

      const newCheckin = response?.checkIn;

      if (newCheckin) {
        setCheckins((prev) => [newCheckin, ...prev]);
      }

      setIsLoading(false);
      return {
        success: true,
        data: newCheckin,
        message: response?.message || "Check-in submitted successfully",
      };
    },
    [apiCall]
  );

  /**
   * Get check-ins for a specific habit
   * @param {string} habitId - The ID of the habit
   * @returns {Array} - Array of check-ins for the habit
   */
  const getCheckinsForHabit = useCallback(
    (habitId) => {
      if (!habitId) return [];
      return checkins.filter((checkin) => checkin.habitId === habitId);
    },
    [checkins]
  );

  /**
   * Get all check-ins for the current user
   * @returns {Array} - Array of all check-ins
   */
  const getAllCheckins = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiCall(API_ENDPOINTS.CHECKINS, {
        method: "GET",
      });

      setCheckins(response || []);
      setIsLoading(false);
      return { success: true, data: response };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [apiCall]);

  /**
   * Check if user has checked in today for a specific habit
   * @param {string} habitId - The ID of the habit
   * @returns {boolean} - True if user has checked in today
   */
  const hasCheckedInToday = useCallback(
    (habitId) => {
      if (!habitId) return false;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const habitCheckins = checkins.filter(
        (checkin) => checkin.habitId === habitId
      );

      return habitCheckins.some((checkin) => {
        const checkinDate = new Date(checkin.checkInDate);
        checkinDate.setHours(0, 0, 0, 0);
        return checkinDate.getTime() === today.getTime();
      });
    },
    [checkins]
  );

  /**
   * Clear all check-ins from state
   */
  const clearCheckins = useCallback(() => {
    setCheckins([]);
  }, []);

  const value = {
    checkins,
    isLoading,
    error,
    // Actions
    clearError,
    submitCheckIn,
    getCheckinsForHabit,
    hasCheckedInToday,
    clearCheckins,
  };

  useEffect(() => {
    getAllCheckins();
  }, [getAllCheckins]);

  return (
    <CheckinContext.Provider value={value}>{children}</CheckinContext.Provider>
  );
};

export default CheckinProvider;
