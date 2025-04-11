import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new TypeError("Received non-JSON response");
      }

      const data = await response.json();
      if (!data) {
        throw new Error("No data received");
      }

      setCurrentUser(data);
    } catch (error) {
      console.error("User fetch error:", error);
      localStorage.removeItem("authToken");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (currentUser) {
      console.log("Current User Data Updated:", currentUser);
    }
  }, [currentUser]);

  const updateCredits = (newCredits) => {
    setCurrentUser((prev) => ({ ...prev, credits: newCredits }));
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setCurrentUser(null);
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        loading,
        updateCredits,
        logout,
        refreshUser: fetchUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
