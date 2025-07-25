import { useState } from "react";
import { Link } from "react-router-dom";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setMessage("");

        try {
            const response = await fetch("http://localhost:5000/api/auth/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
            } else {
                setError(data.message || "Failed to send password reset email");
            }
        } catch (error) {
            setError("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Forgot Your Password?
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Enter your email address and we will send you a link to reset your password.
                    </p>
                </div>

                {error && (
                    <div className="text-red-500 text-sm text-center">{error}</div>
                )}
                {message && (
                    <div className="text-green-500 text-sm text-center">{message}</div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="sr-only">
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                                isLoading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-gray-600 hover:bg-gray-700"
                            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500`}
                        >
                            {isLoading ? "Sending..." : "Send Password Reset Email"}
                        </button>
                    </div>
                </form>
                <div className="text-sm text-center">
                    <Link to="/login" className="font-medium text-gray-600 hover:text-gray-500">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;