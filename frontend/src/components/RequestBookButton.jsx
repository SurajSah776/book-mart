import { useState, useEffect } from "react";
import { FaHandHolding, FaShoppingCart } from "react-icons/fa";
import { useUser } from "../context/UserContext";

const RequestBookButton = ({ postId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [post, setPost] = useState(null);
  const [isLoadingPost, setIsLoadingPost] = useState(true);
  const { currentUser, updateCredits, refreshUser } = useUser();

  // Fetch post details to determine if it's for sale or exchange
  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/posts/${postId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch post details");
        }

        const data = await response.json();
        setPost(data);
      } catch (err) {
        console.error("Error fetching post:", err);
      } finally {
        setIsLoadingPost(false);
      }
    };

    fetchPostDetails();
  }, [postId]);

  const handleRequest = async () => {
    // For credit transactions, check if user has enough credits
    if (
      post.listingType === "donate" &&
      (!currentUser || currentUser.credits < 1)
    ) {
      setError("You need at least 1 credit to request this book");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/transactions/request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({ postId }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Request failed");
      }

      const data = await response.json();

      // Refresh user data to get updated credit count from backend
      if (data.transactionType === "credit") {
        refreshUser();
      }

      alert("Book requested successfully! The owner will contact you.");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingPost) {
    return (
      <div className="mt-3">
        <button
          disabled
          className="w-full flex items-center justify-center py-2 px-4 rounded-md bg-gray-400 text-white"
        >
          Loading...
        </button>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="mt-3">
        <p className="text-red-500 text-sm">Error loading book details</p>
      </div>
    );
  }

  const isCreditTransaction = post.listingType === "donate";
  const buttonText = isCreditTransaction
    ? `Exchange Book (1 Credit)`
    : `Buy Book (₹${post.price})`;
  const buttonIcon = isCreditTransaction ? (
    <FaHandHolding />
  ) : (
    <FaShoppingCart />
  );
  const buttonColor = isCreditTransaction
    ? "bg-blue-600 hover:bg-blue-700"
    : "bg-green-600 hover:bg-green-700";

  return (
    <div className="mt-3">
      <button
        onClick={handleRequest}
        disabled={isLoading}
        className={`w-full flex items-center justify-center py-2 px-4 rounded-md ${
          isLoading ? "bg-gray-400" : buttonColor
        } text-white`}
      >
        <span className="mr-2">{buttonIcon}</span>
        {isLoading ? "Processing..." : buttonText}
      </button>
      {error && <p className="mt-1 text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default RequestBookButton;
