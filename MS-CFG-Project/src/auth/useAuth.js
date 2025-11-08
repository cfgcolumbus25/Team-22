import { useState, useEffect } from "react";
import { onAuthChange, getCurrentUserData } from "./authService";

/**
 * Custom React hook for authentication state
 * @returns {Object} { user, userData, loading, role }
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const unsubscribe = onAuthChange((authUser, authUserData) => {
      setUser(authUser);
      setUserData(authUserData);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return {
    user,
    userData,
    loading,
    role: userData?.role || null,
    isAuthenticated: !!user,
    isAdmin: userData?.role === "admin",
    isLearner: userData?.role === "learner",
    isInstitution: userData?.role === "institution"
  };
}

