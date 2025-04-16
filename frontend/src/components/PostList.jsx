import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import PostFilters from "./PostFilters";
import { useUser } from "../context/UserContext"; // Assuming you have a user context
import { Link } from "react-router-dom";

const PostList = ({ userId }) => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useUser(); // Get current user data including credits

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build API URL based on whether we're fetching user-specific posts
        const url = userId
          ? `http://localhost:5000/api/posts?user=${userId}`
          : "http://localhost:5000/api/posts";

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        if (!response.ok)
          throw new Error(`Failed to fetch posts: ${response.status}`);

        const data = await response.json();

        // Filter out donated books from the list
        const activePosts = data.filter((post) => post.status !== "donated");

        setPosts(activePosts);
        setFilteredPosts(activePosts);
      } catch (error) {
        console.error("Post fetch error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userId]);

  // Handle filtering based on search, category, and listing type
  const handleFilter = (filters) => {
    let result = [...posts];

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(
        (post) =>
          post.bookName.toLowerCase().includes(searchTerm) ||
          post.authorName.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.category && filters.category !== "All") {
      result = result.filter((post) => post.category === filters.category);
    }

    if (filters.listingType && filters.listingType !== "All") {
      if (filters.listingType === "Exchange") {
        result = result.filter((post) => post.listingType === "donate");
      } else if (filters.listingType === "Buy") {
        result = result.filter((post) => post.listingType === "sell");
      }
    }

    setFilteredPosts(result);
  };

  if (loading) return <div className="text-center py-8">Loading books...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="pb-8">
      {/* Filter section (only shown on main posts page) */}
      {!userId && (
        <div className="px-4 md:px-20 my-5">
          <PostFilters onFilter={handleFilter} />
        </div>
      )}

      {/* Empty state */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-8 bg-[#f5f5f0] rounded-lg shadow mx-4">
          <p className="text-[#212529]">
            {userId ? "No books shared yet." : "No books match your search."}
          </p>
          {userId && (
            <Link
              to="/create-post"
              className="mt-4 inline-block bg-[#3e78ed] text-white py-2 px-4 rounded-md hover:bg-[#2856a8]"
            >
              Share Your First Book
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-14">
          {filteredPosts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              currentUserId={currentUser?._id}
              currentUserCredits={currentUser?.credits || 0}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PostList;
