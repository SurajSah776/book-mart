import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaPhone, FaEnvelope, FaSave, FaCamera } from "react-icons/fa";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    profilePic: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload image
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("http://localhost:5000/api/uploads", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      setFormData((prev) => ({ ...prev, profilePic: data.imageUrl }));
    } catch (err) {
      setError("Failed to upload image");
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        if (!response.ok) throw new Error("Not authorized");

        const data = await response.json();

        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          phone: data.phone || "",
          profilePic: data.profilePic || "",
        });
        if (data.profilePic) {
          setImagePreview(data.profilePic);
        }
      } catch (err) {
        navigate("/login"); // Redirect if unauthorized
        setError("Failed to load profile");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          ...formData,
          profilePic: formData.profilePic || "",
        }),
      });

      if (!response.ok) {
        throw new Error("Update failed");
      }

      // Get current user ID before redirecting
      const userResponse = await fetch("http://localhost:5000/api/users/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      const userData = await userResponse.json();
      navigate(`/profile/${userData._id}`); // Redirect to profile after success
    } catch (err) {
      setError(err.message || "Failed to update profile");
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-6">
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 mx-auto">
            {imagePreview ? (
              <img
                src={
                  imagePreview.startsWith("http")
                    ? imagePreview
                    : `http://localhost:5000${imagePreview}`
                }
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <FaUser className="w-full h-full p-4 text-gray-400" />
            )}
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 bg-[#3e78ed] text-white p-2 rounded-full hover:bg-[#2e5ea3] transition-colors"
            type="button"
          >
            <FaCamera size={16} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
      </div>
      <h1 className="text-2xl font-bold mb-6 flex items-center text-[#212529]">
        <FaUser className="mr-2" /> Edit Profile
      </h1>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#212529]">
            First Name
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            className="mt-1 block w-full border border-[#e9ecef] rounded-md p-2 text-[#495057] hover:bg-[#f5f5f0]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#212529]">
            Last Name
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            className="mt-1 block w-full border border-[#e9ecef] rounded-md p-2 text-[#495057] hover:bg-[#f5f5f0]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#212529]">
            Email*
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="mt-1 block w-full border border-[#e9ecef] rounded-md p-2 text-[#495057] hover:bg-[#f5f5f0]"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone*
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="mt-1 block w-full border border-[#e9ecef] rounded-md p-2 text-[#495057] hover:bg-[#f5f5f0]"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#e91e63] text-white py-2 px-4 rounded-md hover:bg-[#bb164b] flex items-center justify-center"
        >
          <FaSave className="mr-2" /> Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
