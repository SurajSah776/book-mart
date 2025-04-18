import { Link } from "react-router-dom";
import { FaUser, FaEllipsisH } from "react-icons/fa";
import RequestBookButton from "./RequestBookButton";
import { useUser } from "../context/UserContext";

const PostCard = ({ post }) => {
  const { currentUser } = useUser();

  // console.log("/nPostCard Details : \n" + post);

  // Determine if request button should be shown
  const shouldShowRequestButton = () => {
    // Don't show if:
    // - User isn't logged in
    // - User is viewing their own post
    // - Book is already donated
    // - User has no credits left
    return (
      currentUser &&
      post.user._id !== currentUser._id &&
      post.status !== "donated" &&
      currentUser.credits > 0
    );
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white rounded-lg shadow-md mb-4 border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-col h-full min-h-[400px]">
      {/* Post Header with User Info */}
      <div className="p-3 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Link
            to={`/profile/${post.user._id}`}
            className="hover:opacity-80 transition-opacity"
            aria-label={`View ${post.user.firstName}'s profile`}
          >
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {post.profilePic ? (
                <img
                  src={post.user.profilePic}
                  alt={`${post.user.firstName}'s profile`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/profile-placeholder.svg";
                  }}
                />
              ) : (
                <FaUser className="text-gray-500 text-sm" />
              )}
            </div>
          </Link>

          <div className="flex flex-col">
            <Link
              to={`/profile/${post.user._id}`}
              className="font-semibold hover:underline text-gray-800 text-sm"
            >
              {post.user.firstName} {post.user.lastName}
            </Link>
            <span className="text-xs text-gray-500">
              Posted {formatDate(post.createdAt)}
            </span>
          </div>
        </div>

        <button
          className="text-gray-500 hover:bg-gray-100 p-1.5 rounded-full transition-colors"
          aria-label="Post options"
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          <FaEllipsisH className="text-sm" />
        </button>
      </div>

      {/* Post Content */}
      <Link
        to={`/posts/${post._id}`}
        className="p-3 flex-grow block hover:bg-gray-50 transition-colors"
      >
        {/* Book Description */}
        {post.description && (
          <p className="mb-2 text-gray-700 text-sm line-clamp-2">
            {post.description}
          </p>
        )}

        {/* Book Image */}
        <div className="mb-2 rounded-lg overflow-hidden border border-gray-100 h-48 flex items-center justify-center bg-gray-50">
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

        {/* Book Details */}
        <div className="space-y-1.5">
          <h3 className="font-bold text-base text-gray-900 line-clamp-1">
            {post.bookName}
          </h3>

          <div className="flex items-center text-gray-600 text-sm">
            <span className="font-medium mr-1">Author:</span>
            <span className="line-clamp-1">{post.authorName}</span>
          </div>

          {post.publicationName && (
            <div className="flex items-center text-xs text-gray-500">
              <span className="font-medium mr-1">Publisher:</span>
              <span className="line-clamp-1">{post.publicationName}</span>
            </div>
          )}

          <div className="flex items-center text-sm">
            <span className="font-medium mr-1">Condition:</span>
            <span
              className={`${
                post.category === "New"
                  ? "text-green-600"
                  : post.category === "Used"
                  ? "text-amber-600"
                  : "text-gray-500"
              }`}
            >
              {post.category}
            </span>
          </div>

          {/* Listing Type */}
          <div className="flex items-center justify-between mt-1">
            <span
              className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                post.listingType === "donate"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {post.listingType === "donate" ? "Exchange" : "For Sale"}
            </span>

            {post.listingType === "sell" && post.price && (
              <span className="text-sm font-bold text-green-700">
                ₹{post.price}
              </span>
            )}
          </div>

          {/* Address */}
          {post.address && (
            <div className="flex items-center text-xs text-gray-500">
              <span className="font-medium mr-1">Location:</span>
              <span className="line-clamp-1">
                {post.address.split(",").slice(-2, -1)[0]?.trim() ||
                  post.address.substring(0, 20) + "."}
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Action Area */}
      <div className="px-3 pb-3 mt-auto">
        {shouldShowRequestButton() ? (
          <RequestBookButton postId={post._id} />
        ) : post.status === "donated" ? (
          <div className="text-center py-1.5 text-xs text-gray-500 bg-gray-50 rounded">
            This book has been donated
          </div>
        ) : !currentUser ? (
          <div className="text-center py-1.5 text-xs text-gray-500">
            <Link to="/login" className="text-blue-600 hover:underline">
              Log in
            </Link>{" "}
            to request this book
          </div>
        ) : post.user._id === currentUser._id ? (
          <div className="text-center py-1.5 text-xs text-gray-500">
            Your book listing
          </div>
        ) : (
          <div className="text-center py-1.5 text-xs text-gray-500">
            Not enough credits to request
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
