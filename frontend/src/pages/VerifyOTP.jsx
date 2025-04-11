import { useState } from "react";
import { useNavigate } from "react-router-dom";

function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Get email from URL params or localStorage
  const email = localStorage.getItem("pendingVerificationEmail");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Clear the stored email
        localStorage.removeItem("pendingVerificationEmail");
        // Show success message and redirect to login
        alert("Email verified successfully! Please login.");
        navigate("/login");
      } else {
        setError(data.message || "Verification failed");
      }
    } catch (error) {
      setError(
        "An error occurred during verification. Please try again." + error
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/resend-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("New OTP has been sent to your email!");
      } else {
        setError(data.message || "Failed to resend OTP");
      }
    } catch (error) {
      setError(
        "An error occurred while resending OTP. Please try again." + error
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <p className="text-red-500">
            No email found for verification. Please register first.
          </p>
          <button
            onClick={() => navigate("/register")}
            className="mt-4 text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-md px-5 py-2.5"
          >
            Go to Registration
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify Your Email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please enter the OTP sent to {email}
          </p>
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="otp" className="sr-only">
              OTP
            </label>
            <input
              id="otp"
              name="otp"
              type="text"
              required
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
            />
          </div>

          <div className="flex flex-col space-y-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gray-600 hover:bg-gray-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500`}
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              type="button"
              onClick={handleResendOTP}
              disabled={isLoading}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Didn't receive OTP? Click to resend
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VerifyOTP;
