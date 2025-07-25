import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import PostFilters from "./PostFilters";
import { useUser } from "../context/UserContext"; // Assuming you have a user context
import { Link } from "react-router-dom";

const PostList = ({ userId }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { currentUser } = useUser(); // Get current user data including credits

    const fetchPosts = async (filters = {}) => {
        try {
            setLoading(true);
            setError(null);

            const query = new URLSearchParams();
            if (userId) {
                query.append("user", userId);
            }
            if (filters.search) {
                query.append("search", filters.search);
            }
            if (filters.category) {
                query.append("category", filters.category);
            }
            if (filters.listingType) {
                query.append("listingType", filters.listingType);
            }

            const url = `http://localhost:5000/api/posts?${query.toString()}`;

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
        } catch (error) {
            console.error("Post fetch error:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [userId]);

    const handleFilter = (filters) => {
        fetchPosts(filters);
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
            {posts.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-lg shadow mx-4">
                    <p className="text-gray-500">
                        {userId ? "No books shared yet." : "No books match your search."}
                    </p>
                    {userId && (
                        <Link
                            to="/create-post"
                            className="mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                        >
                            Share Your First Book
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-14">
                    {posts.map((post) => (
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
