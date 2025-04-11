import { Link } from "react-router-dom";
import { data } from "../data";
import { motion } from "framer-motion";
import {
  FaBook,
  FaExchangeAlt,
  FaShoppingCart,
  FaArrowRight,
} from "react-icons/fa";

function Homepage() {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto pt-20 pb-16 px-4 sm:px-6 lg:px-8 text-center"
      >
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
          Share, Earn & Buy
          <br />
          <span className="text-gray-600">Your Favorite Books</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Join our platform where you can share books to earn credits, use
          credits to request books, or purchase books directly from our
          collection.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/register"
              className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-3 px-8 rounded-lg flex items-center gap-2 transform transition-all duration-300"
            >
              Get Started <FaArrowRight />
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/about"
              className="border-2 border-gray-700 text-gray-700 hover:bg-gray-700 hover:text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300"
            >
              Learn More
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="p-8 bg-white border border-gray-200 shadow-lg rounded-xl transform transition-all duration-300 hover:shadow-xl"
          >
            <FaExchangeAlt className="text-4xl text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              Share Books
            </h2>
            <p className="text-gray-600">
              Donate your books to the community and earn credits that you can
              use to request other books.
            </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="p-8 bg-white border border-gray-200 shadow-lg rounded-xl transform transition-all duration-300 hover:shadow-xl"
          >
            <FaBook className="text-4xl text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              Earn Credits
            </h2>
            <p className="text-gray-600">
              Get credits for every book you share. Use these credits to request
              books from other members.
            </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="p-8 bg-white border border-gray-200 shadow-lg rounded-xl transform transition-all duration-300 hover:shadow-xl"
          >
            <FaShoppingCart className="text-4xl text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              Buy Books
            </h2>
            <p className="text-gray-600">
              No credits? No problem! Purchase books directly from our
              collection at competitive prices.
            </p>
          </motion.div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Choose how you want to get your next book
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Sign Up", desc: "Create your free account" },
              {
                step: "2",
                title: "Share & Earn",
                desc: "Share books to earn credits",
              },
              {
                step: "3",
                title: "Request Books",
                desc: "Use credits or purchase",
              },
              {
                step: "4",
                title: "Enjoy Reading",
                desc: "Get your books and read",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-md text-center"
              >
                <div className="w-12 h-12 bg-gray-700 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            What Our Users Say
          </h2>
          <p className="text-xl text-gray-600">
            Join thousands of satisfied book lovers
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {data.reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <p className="text-gray-600 italic mb-4">"{review.review}"</p>
              <div className="flex items-center justify-end">
                <div>
                  <p className="font-semibold text-gray-800">
                    {review.userName}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Homepage;
