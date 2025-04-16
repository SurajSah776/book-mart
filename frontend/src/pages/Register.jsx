import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TermsAndConditions from "../components/TermsAndConditions";

function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
  });

  const navigate = useNavigate();

  // Error State
  const [error, setError] = useState("");
  const [verificationMessage, setVerificationMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  // Handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error messages when user starts typing
    setError("");
    setVerificationMessage("");
  };

  // Handle Submit Button Click
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setVerificationMessage("");

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    // Validate password strength
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setRegisteredEmail(data.email);
        // Store email for OTP verification
        localStorage.setItem("pendingVerificationEmail", data.email);
        // Clear form
        setFormData({
          email: "",
          password: "",
          confirmPassword: "",
          firstName: "",
          lastName: "",
          phone: "",
        });
        // Redirect to OTP verification page
        navigate("/verify-otp");
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Error registering:", error);
      setError("An error occurred during registration. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-fit min-h-[98vh] max-h-[100vh] mx-auto my-[50px] flex flex-col gap-2 items-center justify-center px-[30px] shadow-[5px_5px_12px_0px_gray] rounded-lg bg-f5f5f0">
        {/* Error and Verification Messages */}
        {error && !verificationMessage && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}
        {verificationMessage && (
          <p className="text-green-500 text-sm mb-4">{verificationMessage}</p>
        )}

        <form
          onSubmit={handleSubmit}
          className="min-w-md max-w-lg mx-auto p-2 text-md"
        >
          {/* Email Address */}
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="email"
              name="email"
              id="floating_email"
              value={formData.email}
              onChange={handleChange}
              placeholder=" "
              required
              className="block py-2.5 px-0 w-full text-md text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-[#3e78ed] peer"
            />
            <label
              for="floating_email"
              className="peer-focus:font-medium absolute text-md text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Email address
            </label>
          </div>

          {/* Password */}
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="password"
              name="password"
              id="floating_password"
              value={formData.password}
              onChange={handleChange}
              placeholder=" "
              required
              className="block py-2.5 px-0 w-full text-md text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-[#3e78ed] peer"
            />
            <label
              for="floating_password"
              className="peer-focus:font-medium absolute text-md text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Password
            </label>

            {/* Error Message(If password doesnt match) */}
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          {/* Confirm Password */}
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="password"
              name="confirmPassword"
              id="floating_confirm_password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder=" "
              required
              className="block py-2.5 px-0 w-full text-md text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-[#3e78ed] peer"
            />
            <label
              for="floating_confirm_password"
              className="peer-focus:font-medium absolute text-md text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Confirm Password
            </label>

            {/* Error Message(If password doesnt match) */}
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          {/* Full Name */}
          <div className="grid md:grid-cols-2 md:gap-6">
            {/* First Name */}
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="text"
                name="firstName"
                id="floating_firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder=" "
                required
                className="block py-2.5 px-0 w-full text-md text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-[#3e78ed] peer"
              />
              <label
                for="floating_firstName"
                className="peer-focus:font-medium absolute text-md text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                First Name
              </label>
            </div>

            {/* Last Name */}
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="text"
                name="lastName"
                id="floating_lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder=" "
                required
                className="block py-2.5 px-0 w-full text-md text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-[#3e78ed] peer"
              />
              <label
                for="floating_lastName"
                className="peer-focus:font-medium absolute text-md text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Last Name
              </label>
            </div>
          </div>

          {/* Phone Number */}
          <div className="grid md:grid-cols-2 md:gap-6">
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="tel"
                pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
                name="phone"
                id="floating_phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder=" "
                required
                className="block py-2.5 px-0 w-full text-md text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-[#3e78ed] peer"
              />
              <label
                for="floating_phone"
                className="peer-focus:font-medium absolute text-md text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Phone Number
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className={`text-white bg-[#3e78ed] ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "hover:bg-[#2d5ba3]"
              } focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-md w-full sm:w-auto px-5 py-2.5 text-center flex items-center justify-center`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-3"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Registering...
                </>
              ) : (
                "Register"
              )}
            </button>
          </div>
        </form>

        {/* Or Signup/Register */}
        <div className="flex flex-col justify-center items-center gap-4">
          <span className="text-md text-gray-600">or</span>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Already a user?</span>

            <button className="text-white bg-[#3e78ed] hover:bg-[#2d5ba3] focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-md w-full sm:w-auto px-5 py-2.5 text-center">
              <Link to="/login">Login</Link>
            </button>
          </div>
        </div>

        {/* Terms and Conditions */}
        <TermsAndConditions />
      </div>
    </>
  );
}

export default Register;
