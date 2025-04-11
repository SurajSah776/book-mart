import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import EditProfile from "./components/EditProfile";
import Homepage from "./pages/Homepage";
import Footer from "./components/Footer";
import Register from "./pages/Register";
import Login from "./pages/Login";
import VerifyOTP from "./pages/VerifyOTP";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ContactForm from "./pages/ContactForm";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import AuthRedirectRoute from "./AuthRedirectRoute";

// Post Components
import CreatePost from "./components/CreatePost";
import PostList from "./components/PostList";
import PostDetails from "./pages/PostDetails";
// Profile Page
import Profile from "./components/Profile";
// Messaging
import Messages from "./pages/Messages";

function App() {
  return (
    <div className="flex flex-col justify-between min-h-screen">
      {/* Setting the Routing */}
      <Navbar />
      <div className="pt-[30px] sm:pt-[40px]">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/contact-form" element={<ContactForm />} />

          {/* Auth routes that redirect to dashboard if user is already logged in */}
          <Route element={<AuthRedirectRoute />}>
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Routes for post */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/posts" element={<PostList />} />
            <Route path="/posts/:id" element={<PostDetails />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            {/* To visit user profile */}
            <Route path="/profile/:userId" element={<Profile />} />
          </Route>

          {/* Messages */}
          <Route element={<ProtectedRoute />}>
            <Route path="/messages" element={<Messages />} />
          </Route>
        </Routes>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
