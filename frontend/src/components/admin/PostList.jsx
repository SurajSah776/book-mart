import { useEffect, useState } from "react";
import axios from "axios";

function PostList() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/posts", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                });
                setPosts(response.data);
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const handleDelete = async (postId) => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            try {
                await axios.delete(`http://localhost:5000/api/admin/posts/${postId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                });
                setPosts(posts.filter((post) => post._id !== postId));
            } catch (error) {
                console.error("Error deleting post:", error);
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Posts</h1>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2">Book Name</th>
                        <th className="py-2">Author</th>
                        <th className="py-2">User</th>
                        <th className="py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.map((post) => (
                        <tr key={post._id}>
                            <td className="border px-4 py-2">{post.bookName}</td>
                            <td className="border px-4 py-2">{post.authorName}</td>
                            <td className="border px-4 py-2">{post.user.firstName} {post.user.lastName}</td>
                            <td className="border px-4 py-2">
                                <button
                                    onClick={() => handleDelete(post._id)}
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default PostList;