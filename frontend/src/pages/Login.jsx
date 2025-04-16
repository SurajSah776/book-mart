import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");

  // Form Data
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // const userData = { email, password };

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      console.log("Login Response:", data);

      // Storing the token and redirecting
      if (response.ok) {
        localStorage.setItem("authToken", data.token); // Store token
        alert("Login successful!✅");

        navigate("/dashboard"); // Redirect to home or dashboard
      } else {
        alert(data.message || "Login failed❌");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("An error occurred while logging in. Please try again.");
    }
  };

  return (
    <>
      <div className="bg-f5f5f0 w-fit min-h-[60vh] max-h-[80vh] mx-auto my-[50px] flex flex-col gap-2 items-center justify-center px-[30px] shadow-[5px_5px_12px_0px_gray] rounded-lg">
        <form onSubmit={handleSubmit} className="min-w-md max-w-lg mx-auto p-2">
          <div className="relative z-0 w-full mb-5 group">
            {/* Email */}
            <input
              type="email"
              name="email"
              id="floating_email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder=" "
              className="block py-2.5 px-0 w-full text-md text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-#3e78ed peer"
            />
            <label
              for="floating_email"
              className="peer-focus:font-medium absolute text-md text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-#3e78ed peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
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
              required
              placeholder=" "
              className="block py-2.5 px-0 w-full text-md text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-#3e78ed peer"
            />
            <label
              for="floating_password"
              className="peer-focus:font-medium absolute text-md text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-#3e78ed peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
             Password
            </label>
          </div>

          {/* Login Button */}
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="text-white bg-#3e78ed hover:bg-[#3162c1] focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-md w-full sm:w-auto px-5 py-2.5 text-center"
            >
              Login
            </button>
          </div>
        </form>

        {/* Or Signup/Register */}
        <div className="flex flex-col justify-center items-center gap-4">
          <span className="text-md text-gray-600">or</span>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">New to BookExchange?</span>

            <button className="text-white bg-#3e78ed hover:bg-[#3162c1] focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-md w-full sm:w-auto px-5 py-2.5 text-center">
              <Link to="/register">Register</Link>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
