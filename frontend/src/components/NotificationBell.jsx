import { useState, useEffect, useRef } from "react";
import { FaBell } from "react-icons/fa";
import { useUser } from "../context/UserContext";
import { Link } from "react-router-dom";
import TransactionDetailsModal from "./TransactionDetailsModal";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const { currentUser } = useUser();
  const dropdownRef = useRef(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!currentUser) return;

    try {
      const response = await fetch("http://localhost:5000/api/notifications", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
        setUnreadCount(data.filter((n) => !n.isRead).length);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Mark a notification as read
  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/notifications/${notificationId}/read`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === notificationId ? { ...n, isRead: true } : n
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/notifications/read-all",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch notifications on component mount and when user changes
  useEffect(() => {
    fetchNotifications();

    // Set up polling for new notifications
    const interval = setInterval(fetchNotifications, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [currentUser]);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (!currentUser) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-[#3e78ed] hover:bg-gray-100 rounded-full"
        aria-label="Notifications"
      >
        <FaBell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-[#e91e63] rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20 max-h-96 overflow-y-auto">
          <div className="py-2 px-4 bg-gray-100 flex justify-between items-center">
            <h3 className="text-sm font-medium text-[#212529]">Notifications</h3>
            {notifications.length > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-[#3e78ed] hover:text-[#e91e63]"
              >
                Mark all as read
               </button>
            )}
          </div>

          <div className="divide-y divide-gray-200">
            {notifications.length === 0 ? (
              <div className="py-4 px-4 text-sm text-gray-500 text-center">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => {
                // Determine notification type and set appropriate actions
                const isBookRequest = notification.type === "book_request";
                const isTransactionComplete =
                  notification.type === "transaction_complete";

                // Create the appropriate link based on notification type
                let linkTo = "#";
                let linkText = "View details";

                if (isBookRequest) {
                  // For book requests, show requester's profile to the book owner
                  linkTo = `/profile/${notification.sender._id}`;
                  linkText = "View requester profile";
                }

                return (
                  <div
                    key={notification._id}
                    className={`py-3 px-4 divide-y divide-[#e9ecef] ${
                      !notification.isRead ? "bg-[#f5f5f0]" : ""
                    }`}
                   onClick={() =>
                      !notification.isRead && markAsRead(notification._id)
                    }
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        {notification.sender.profilePic ? (
                          <img
                            className="h-10 w-10 rounded-full"
                            src={`http://localhost:5000${notification.sender.profilePic}`}
                            alt="User"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-gray-600">
                              {notification.sender.firstName.charAt(0)}
                              {notification.sender.lastName.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm text-[#212529]">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(notification.createdAt)}
                        </p>
                        <div className="mt-2 space-x-4">
                          {isBookRequest && (
                            <Link
                              to={linkTo}
                              className="inline-block text-xs font-medium text-[#3e78ed] hover:text-[#e91e63]"
                            >
                              {linkText}
                            </Link>
                          )}
                          {(isBookRequest || isTransactionComplete) &&
                            notification.relatedTransaction && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedTransaction(
                                    notification.relatedTransaction
                                  );
                                  setShowTransactionModal(true);
                                  setIsOpen(false);
                                }}
                                className="inline-block text-xs font-medium text-green-600 hover:text-green-800"
                              >
                                View Order Details
                              </button>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {showTransactionModal && selectedTransaction && (
        <TransactionDetailsModal
          transaction={selectedTransaction}
          onClose={() => {
            setShowTransactionModal(false);
            setSelectedTransaction(null);
          }}
          onComplete={async (transactionId) => {
            try {
              const response = await fetch(
                "http://localhost:5000/api/transactions/complete",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem(
                      "authToken"
                    )}`,
                  },
                  body: JSON.stringify({ transactionId }),
                }
              );

              const data = await response.json();

              if (!response.ok) {
                throw new Error(
                  data.message || "Failed to complete transaction"
                );
              }

              setShowTransactionModal(false);
              setSelectedTransaction(null);
              fetchNotifications();
              alert(data.message); // Show success message
            } catch (error) {
              console.error("Error completing transaction:", error);
              alert(error.message || "Failed to complete transaction");
            }
          }}
          onReject={async (transactionId) => {
            try {
              const response = await fetch(
                "http://localhost:5000/api/transactions/reject",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem(
                      "authToken"
                    )}`,
                  },
                  body: JSON.stringify({ transactionId }),
                }
              );

              if (response.ok) {
                setShowTransactionModal(false);
                setSelectedTransaction(null);
                fetchNotifications();
              }
            } catch (error) {
              console.error("Error rejecting transaction:", error);
            }
          }}
          showStatus={
            selectedTransaction.status === "completed" ||
            selectedTransaction.status === "rejected"
          }
        />
      )}
    </div>
  );
};

export default NotificationBell;
