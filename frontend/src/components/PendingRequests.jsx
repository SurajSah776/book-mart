import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import TransactionDetailsModal from "./TransactionDetailsModal";

const PendingRequests = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const { currentUser, refreshUser } = useUser();

  useEffect(() => {
    const fetchPendingRequests = async () => {
      if (!currentUser) return;

      try {
        const response = await fetch(
          "http://localhost:5000/api/transactions/pending-requests",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch pending requests");
        }

        const data = await response.json();
        setPendingRequests(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingRequests();
  }, [currentUser]);

  const handleCompleteTransaction = async (transactionId) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/transactions/complete",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({ transactionId }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to complete transaction");
      }

      // Remove the completed request from the list
      setPendingRequests((prev) =>
        prev.filter((req) => req._id !== transactionId)
      );

      // Refresh user data to update credits
      refreshUser();

      alert("Transaction completed successfully! You've earned 1 credit.");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRejectRequest = async (transactionId) => {
    if (!window.confirm("Are you sure you want to reject this request?")) {
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/transactions/reject",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({ transactionId }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to reject request");
      }

      // Remove the rejected request from the list
      setPendingRequests((prev) =>
        prev.filter((req) => req._id !== transactionId)
      );

      alert("Request rejected successfully.");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading pending requests...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  if (pendingRequests.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Pending Book Requests</h2>
        <p className="text-gray-600">You have no pending book requests.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Pending Book Requests</h2>
      <div className="space-y-4">
        {pendingRequests.map((request) => (
          <div
            key={request._id}
            className="border rounded-lg p-4 flex flex-col md:flex-row gap-4"
          >
            <div className="md:w-1/4">
              {request.book.image ? (
                <img
                  src={`http://localhost:5000${request.book.image}`}
                  alt={request.book.bookName}
                  className="w-full h-40 object-cover rounded"
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded">
                  <span className="text-gray-500">No image</span>
                </div>
              )}
            </div>

            <div className="md:w-3/4">
              <h3 className="text-lg font-medium">{request.book.bookName}</h3>
              <p className="text-gray-600 mb-2">
                Requested by: {request.fromUser.firstName}{" "}
                {request.fromUser.lastName}
              </p>

              <div className="mb-4">
                <h4 className="font-medium text-gray-700">
                  Contact Information:
                </h4>
                <p>Email: {request.fromUser.email}</p>
                <p>Phone: {request.fromUser.phone}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  to={`/profile/${request.fromUser._id}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  View Profile
                </Link>

                <button
                  onClick={() => handleCompleteTransaction(request._id)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Complete Transaction
                </button>

                <button
                  onClick={() => handleRejectRequest(request._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Reject Request
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingRequests;
