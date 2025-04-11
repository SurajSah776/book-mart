import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaBook, FaUserEdit, FaInfoCircle } from "react-icons/fa";
import MessageBox from "../components/MessageBox";
import { useUser } from "../context/UserContext";

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { currentUser } = useUser();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/posts/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  // Displaying the details of the post
  console.log("Post Details : ", post);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (!post) return <div className="text-center py-8">Book not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-5 pt-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
      >
        <FaArrowLeft className="mr-1" /> Back to all books
      </button>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {post.image && (
          <div className="h-64 overflow-hidden">
            {/* <img
              src={`/public${post.image}`}
              alt={post.bookName}
              className="w-full h-full object-cover"
            /> */}

            <img
              src={
                post.image
                  ? post.image.startsWith("http")
                    ? post.image
                    : `http://localhost:5000${post.image}`
                  : "/book-placeholder.jpg"
              }
              alt={`Cover of ${post.bookName}`}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/book-placeholder.jpg";
              }}
            />
          </div>
        )}

        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">{post.bookName}</h1>

          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center text-gray-600">
              <FaUserEdit className="mr-1" /> {post.authorName}
            </div>
            <span
              className={`px-3 py-1 text-sm rounded-full ${
                post.category === "New"
                  ? "bg-green-100 text-green-800"
                  : post.category === "Used"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {post.category}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center">
                <FaInfoCircle className="mr-2" /> Publication Details
              </h3>
              {post.publicationName && (
                <p className="text-sm">Publisher: {post.publicationName}</p>
              )}
              {post.isbn && <p className="text-sm mt-1">ISBN: {post.isbn}</p>}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Shared By</h3>
              <p className="text-sm">
                {post.user?.username || "Book enthusiast"}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Shared on {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">About This Book</h3>
            <p className="text-gray-700">
              {post.description || "No additional description provided."}
            </p>
          </div>

          {/* Message Box */}
          <MessageBox postId={id} postOwner={post.user} />
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
