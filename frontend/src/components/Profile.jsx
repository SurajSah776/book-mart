import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import PostCard from "../components/PostCard";
import { FaUser, FaPhone, FaEnvelope, FaBook } from "react-icons/fa";
import CreditBadge from "./CreditBadge";

const Profile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setCurrentUser(data);
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch user data
        const userRes = await fetch(
          `http://localhost:5000/api/users/${userId}/profile`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        // Debugging:
        console.log("User response:", userRes);

        if (!userRes.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await userRes.json();
        setUser(userData);

        // Fetch user's posts
        const postsRes = await fetch(
          `http://localhost:5000/api/posts?user=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        if (!postsRes.ok) {
          throw new Error("Failed to fetch user posts");
        }

        const postsData = await postsRes.json();
        setPosts(postsData);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
    fetchData();
  }, [userId]);

  if (loading) return <div className="text-center py-8">Loading...</div>;

  if (error)
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  if (!user) return <div className="text-center py-8">User not found</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {user.profilePic ? (
                <img
                  src={
                    user.profilePic.startsWith("http")
                      ? user.profilePic
                      : `http://localhost:5000${user.profilePic}`
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaUser className="text-gray-500 text-3xl" />
              )}
            </div>

            {console.log(user.user)}

            <div>
              <h1 className="text-2xl font-bold">
                {user.user.firstName} {user.user.lastName}
              </h1>

              <div className="mt-2 space-y-1">
                <div className="flex items-center text-gray-700">
                  <FaPhone className="mr-2" />
                  <span>{user.user.phone}</span>
                </div>

                <div className="flex items-center text-gray-700">
                  <FaEnvelope className="mr-2" />
                  <span>{user.user.email}</span>
                </div>
              </div>
            </div>

            {/* Credits and Stats */}
            <div className="text-sm text-gray-600">
              <div className="mb-2">
                <span className="font-semibold">Credits Available:</span>{" "}
                {user.user.credits || 0}
                {/* Credit */}
                <div className="flex items-center text-sm sm:text-md mr-2 sm:mr-4">
                  <CreditBadge credits={user.user.credits || 0} />
                </div>
              </div>

              <div className="mb-2">
                <span className="font-semibold">Books Donated:</span>{" "}
                {user.user.booksDonated || 0}
              </div>

              <div className="mb-2">
                <span className="font-semibold">Books Received:</span>{" "}
                {user.user.booksReceived || 0}
              </div>
            </div>
          </div>
          {/* Edit Profile Button - Only shown for current user */}
          {currentUser && currentUser._id === userId && (
            <div className="mt-4">
              <Link
                to="/edit-profile"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition duration-200"
              >
                Edit Profile
              </Link>
            </div>
          )}
        </div>

        {/* User's Posts */}
        <div className="mb-4 flex items-center">
          <FaBook className="mr-2" />

          <h2 className="text-xl font-semibold">
            {user.user.firstName}'s Books ({posts.length})
          </h2>
        </div>

        {posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p>No books posted yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
