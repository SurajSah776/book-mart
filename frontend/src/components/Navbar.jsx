import { NavLink, useNavigate } from "react-router-dom";
import NotificationBell from "./NotificationBell";
import { useUser } from "../context/UserContext";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaEnvelope } from "react-icons/fa";

export default function Navbar() {
  const navigate = useNavigate();
  const { currentUser, logout } = useUser();
  const isAuthenticated = !!currentUser;
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread message count
  useEffect(() => {
    if (currentUser) {
      const fetchUnreadCount = async () => {
        try {
          const response = await axios.get(
            "http://localhost:5000/api/messages/conversations",
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            }
          );
          const totalUnread = response.data.reduce(
            (sum, conv) => sum + (conv.unreadCount || 0),
            0
          );
          setUnreadCount(totalUnread);
        } catch (error) {
          console.error("Error fetching unread count:", error);
        }
      };

      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000); // Check every 30 seconds
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  console.log("Current User = " + currentUser);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logout(); // Use the logout from UserContext
      navigate("/login");
    }
  };

  return (
    <div className="bg-gray-500 text-white flex justify-between px-2 sm:px-4 items-center h-[50px] text-base sm:text-lg rounded-none fixed top-0 left-0 w-full z-40">
      {/* Logo */}
      <div className="left h-full flex items-center hover:cursor-pointer text-sm sm:text-lg font-semibold">
        <NavLink to="/">BookMart</NavLink>
      </div>
      {/* Middle Menu */}
      <div className="middle h-full">
        <ul className="flex h-full text-sm sm:text-base">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center px-2 sm:px-4 h-full hover:bg-gray-600 ${
                  isActive ? "bg-gray-600 font-semibold" : ""
                }`
              }
            >
              Home
            </NavLink>
          </li>

          {!isAuthenticated && (
            <>
              <li>
                <NavLink
                  to="/contact"
                  className={({ isActive }) =>
                    `flex items-center px-2 sm:px-4 h-full hover:bg-gray-600 ${
                      isActive ? "bg-gray-600 font-semibold" : ""
                    }`
                  }
                >
                  Contact
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    `flex items-center px-2 sm:px-4 h-full hover:bg-gray-600 ${
                      isActive ? "bg-gray-600 font-semibold" : ""
                    }`
                  }
                >
                  About
                </NavLink>
              </li>
            </>
          )}

          {isAuthenticated && (
            <ul className="flex gap-0.5 sm:gap-1">
              <li>
                <NavLink
                  to="/posts"
                  className={({ isActive }) =>
                    `flex items-center px-2 sm:px-4 h-full hover:bg-gray-600 ${
                      isActive ? "bg-gray-600 font-semibold" : ""
                    }`
                  }
                >
                  Browse Books
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `flex items-center px-2 sm:px-4 h-full hover:bg-gray-600 ${
                      isActive ? "bg-gray-600 font-semibold" : ""
                    }`
                  }
                >
                  Dashboard
                </NavLink>
              </li>
              {currentUser && currentUser.isAdmin && (
                <li>
                  <NavLink
                    to="/admin/users"
                    className={({ isActive }) =>
                      `flex items-center px-2 sm:px-4 h-full hover:bg-gray-600 ${
                        isActive ? "bg-gray-600 font-semibold" : ""
                      }`
                    }
                  >
                    Admin
                  </NavLink>
                </li>
              )}
            </ul>
          )}
        </ul>
      </div>

      {/* Right Menu */}
      <div className="right h-full">
        {/* Logout option */}
        <div className="flex h-full">
          {isAuthenticated ? (
            <div className="flex gap-0.5 sm:gap-1 px-0.5 sm:px-1 items-center">
              <NavLink
                to="/messages"
                className="relative flex items-center px-2 h-full hover:bg-gray-600"
              >
                <FaEnvelope className="text-xl" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </NavLink>
              <NotificationBell />

              <button
                onClick={handleLogout}
                className="flex items-center font-semibold px-2 sm:px-4 h-full hover:bg-gray-600 text-sm sm:text-base"
              >
                Logout
              </button>

              {/* User Profile  */}
              <NavLink
                to={`/profile/${currentUser?._id}`}
                className="flex items-center px-0.5 sm:px-1 h-full hover:bg-gray-600"
              >
                <img
                  src={
                    currentUser?.profilePic
                      ? `http://localhost:5000${currentUser.profilePic}`
                      : "/profile.svg"
                  }
                  alt="Profile"
                  className="bg-gray-300 rounded-[50%] w-[30px] sm:w-[35px] h-[30px] sm:h-[35px] object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/profile.svg";
                  }}
                />
              </NavLink>
            </div>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `flex items-center font-semibold px-2 sm:px-4 h-full hover:bg-gray-600 text-sm sm:text-base ${
                    isActive ? "bg-gray-600 font-bold" : ""
                  }`
                }
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `flex items-center font-semibold px-2 sm:px-4 h-full hover:bg-gray-600 text-sm sm:text-base ${
                    isActive ? "bg-gray-600 font-bold" : ""
                  }`
                }
              >
                Signup
              </NavLink>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
