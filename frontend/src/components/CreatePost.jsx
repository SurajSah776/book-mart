import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBook } from "react-icons/fa";

const CreatePost = () => {
  const [formData, setFormData] = useState({
    bookName: "",
    authorName: "",
    publicationName: "",
    isbn: "",
    category: "Prefer not to say",
    listingType: "donate",
    price: "",
    address: "",
    paymentMethod: "cash_on_delivery",
    description: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (JPEG, PNG, etc.)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    setError("");
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!image) {
      setError("Please select an image");
      setIsLoading(false);
      return;
    }

    try {
      // 1. Upload the image
      const imageFormData = new FormData();
      imageFormData.append("image", image);

      const uploadResponse = await fetch("http://localhost:5000/api/uploads", {
        method: "POST",
        body: imageFormData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error(errorText || "Image upload failed");
      }

      const uploadResult = await uploadResponse.json();

      if (!uploadResult || !uploadResult.imageUrl) {
        throw new Error("Image upload response is missing image URL");
      }

      // 2. Create the post with all data
      const postData = {
        ...formData,
        image: uploadResult.imageUrl,
      };

      const postResponse = await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(postData),
      });

      if (!postResponse.ok) {
        const errorData = await postResponse.json();
        throw new Error(
          errorData.message ||
            `Failed to create post: ${postResponse.status} ${postResponse.statusText}`
        );
      }

      const result = await postResponse.json();

      if (result) {
        navigate("/posts");
      } else {
        throw new Error("Failed to create post - no response data");
      }
    } catch (error) {
      console.error("Post creation Error:", error);
      setError(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 rounded-lg shadow-md mt-6 background">
      <h1 className="text-2xl font-bold mb-6 flex items-center text-color">
        <FaBook className="mr-2" /> Share a New Book
      </h1>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Keep all your existing form fields exactly as they are */}
        {/* Book Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Book Name *
          </label>
          <input
            type="text"
            name="bookName"
            value={formData.bookName}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 text-color border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Author Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Author Name *
          </label>
          <input
            type="text"
            name="authorName"
            value={formData.authorName}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 text-color border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Publication Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Publication Name
            </label>
            <input
              type="text"
              name="publicationName"
              value={formData.publicationName}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 text-color border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ISBN Number
            </label>
            <input
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 text-color border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Book Condition */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Book Condition
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 text-color border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="New">New</option>
            <option value="Used">Used</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>

        {/* Listing Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Listing Type *
          </label>
          <select
            name="listingType"
            value={formData.listingType}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 text-color border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="donate">Donate (Exchange for Credits)</option>
            <option value="sell">Sell</option>
          </select>
        </div>

        {/* Price - Only shown if listingType is "sell" */}
        {formData.listingType === "sell" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (₹) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 text-color border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              required
            />
          </div>
        )}

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pickup Address *
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 text-color border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="2"
            placeholder="Enter your address where the book can be picked up"
            required
          />
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment Method
          </label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 text-color border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="cash_on_delivery">Cash on Delivery</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 text-color border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"            rows="3"
            placeholder="Tell us about this book..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Book Cover Image *
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 text-color border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {preview && (
            <div className="mt-2">
              <img
                src={preview}
                alt="Preview"
                className="max-w-[200px] rounded-md"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium accent hover:secondary focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          >
          {isLoading ? "Sharing Book..." : "Share Book"}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
