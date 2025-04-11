import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import PostList from "../components/PostList";
import { FaBookOpen } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Getting current user
  const { currentUser } = useUser();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
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
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-bold">
          Welcome back, {userData?.firstName || "Book Lover"}!
        </h1>
        <FaBookOpen className="ml-2 text-blue-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Your Recent Shares</h2>
          <PostList userId={userData?._id} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md h-fit">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button
              onClick={() => (window.location.href = "/create-post")}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Share a New Book
            </button>

            {/* Profile page */}
            <NavLink
              to={`/profile/${currentUser?._id}`}
              className="flex items-center px-1 h-full hover:bg-gray-600"
            >
              <button className="w-full bg-gray-100 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-200">
                View Your Profile
              </button>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
