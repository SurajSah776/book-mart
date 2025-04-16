import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaBook, FaHandshake, FaUsers, FaLeaf } from "react-icons/fa";
import TermsAndConditions from "../components/TermsAndConditions";

function About() {
  return (
    <div className="bg-white min-h-screen py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <motion.div  className="bg-white p-8 rounded-xl shadow-lg border border-e9ecef">
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-212529 mb-4">
              About BookExchange
            </h1>
            <p className="text-xl text-gray-600">
              Connecting readers, sharing knowledge, building community
            </p>
          </motion.div>

          <div className="space-y-12">
            {/* Mission Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-start gap-4"
            >
              <div className="flex-shrink-0">
                <FaBook className="text-3xl text-3e78ed" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-212529 mb-3">
                  Our Mission
                </h2> 
                <p className="text-gray-600 leading-relaxed">
                  We believe that every book deserves a new reader and every
                  reader deserves access to great books. Our platform
                  facilitates the exchange of books within communities, making
                  reading more accessible and sustainable while building
                  meaningful connections between book lovers.
                </p>
              </div>
            </motion.div>

            {/* How It Works */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-start gap-4"
            >
              <div className="flex-shrink-0">
                <FaHandshake className="text-3xl text-3e78ed" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-212529 mb-3">
                  How It Works
                </h2>
                <div className="grid md:grid-cols-2 gap-4 text-495057">
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-3e78ed text-white rounded-full flex items-center justify-center text-sm">
                        1
                      </span>
                      Create your free account
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-3e78ed text-white rounded-full flex items-center justify-center text-sm">
                        2
                      </span>
                      Post books you want to share
                    </li>
                  </ul>
                  <ul className="space-y-2"> 
                    <li className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-gray-700 text-white rounded-full flex items-center justify-center text-sm">
                        3
                      </span>
                      Earn credits for sharing
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-gray-700 text-white rounded-full flex items-center justify-center text-sm">
                        4
                      </span>
                      Use credits to get books
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Community Impact */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="flex items-start gap-4"
            >
              <div className="flex-shrink-0">
                <FaUsers className="text-3xl text-3e78ed" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-212529 mb-3">
                  Community Impact
                </h2> 
                <p className="text-gray-600 leading-relaxed">
                  Our platform has facilitated thousands of book exchanges,
                  creating a vibrant community of readers who share not just
                  books, but also their love for reading. Join us in making
                  knowledge more accessible while reducing waste and building
                  lasting connections.
                </p>
              </div>
            </motion.div>

            {/* Sustainability */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
              className="flex items-start gap-4"
            >
              <div className="flex-shrink-0">
                <FaLeaf className="text-3xl text-3e78ed" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-212529 mb-3">
                  Sustainability
                </h2> 
                <p className="text-gray-600 leading-relaxed">
                  By promoting book reuse, we're helping reduce paper waste and
                  the environmental impact of book production. Every book
                  exchanged is a step towards a more sustainable future for
                  reading.
                </p>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="text-center mt-12"
          >
            <Link
              to="/register"
              className="inline-block bg-3e78ed hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300"
            >
              Join Our Community
            </Link>
            <div className="mt-8">
              <TermsAndConditions />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default About;
