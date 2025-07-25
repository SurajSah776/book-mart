import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setMessage("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                setTimeout(() => {
                    navigate("/login");
                }, 3000);
            } else {
                setError(data.message || "Failed to reset password");
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
                        Reset Your Password
                    </h2>
                </div>

                {error && (
                    <div className="text-red-500 text-sm text-center">{error}</div>
                )}
                {message && (
                    <div className="text-green-500 text-sm text-center">{message}</div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="password" className="sr-only">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
                            placeholder="New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="confirm-password" class="sr-only">
                            Confirm Password
                        </label>
                        <input
                            id="confirm-password"
                            name="confirm-password"
                            type="password"
                            required
                            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                            {isLoading ? "Resetting..." : "Reset Password"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;