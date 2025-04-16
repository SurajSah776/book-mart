import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaPhone,
  FaUsers,
  FaBook,
  FaHandshake,
} from "react-icons/fa";

function Contact() {
  return (
    <div className="bg-white min-h-screen py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="bg-white p-8 rounded-xl shadow-lg border border-e9ecef">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              <span className="text-212529">Contact Us</span>
            </h1>
            <p className="text-xl text-495057">
              We're here to help you with your book exchange journey.
            </p>
          </motion.div>

          <div className="space-y-8">
            {/* Book Exchange Support */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}className="flex items-start gap-4 p-6 bg-f5f5f0 rounded-lg"
            >
              <div className="flex-shrink-0">
                <FaBook className="text-3xl text-3e78ed" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-212529 mb-3">
                  BookExchange Support
                </h2>
                <p className="text-495057 mb-4">
                  Need help with book exchanges, credits, or listing books? Our
                  dedicated team is here to assist you.
                </p>
                <div className="flex items-center gap-2 text-495057">
                  <FaEnvelope className="text-lg text-3e78ed" />
                  <a
                    href="mailto:hubkiit@gmail.com"
                    className="text-3e78ed hover:text-[#2855ab]"
                  >
                    hubkiit@gmail.com
                  </a>
                </div>
              </div>
            </motion.div>
          
            {/* Community Support */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-start gap-4 p-6 bg-f5f5f0 rounded-lg"
            >
              <div className="flex-shrink-0">
                <FaUsers className="text-3xl text-3e78ed" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-212529 mb-3">
                  Community Support
                </h2>
                <p className="text-gray-600 mb-4">
                  Questions about community guidelines, events, or connecting
                  with other readers? Contact our community team.
                </p>
                <div className="flex items-center gap-2 text-gray-700">
                  <FaEnvelope className="text-lg text-3e78ed" />
                  <a
                    href="mailto:community@bookmart.com"
                    className="text-3e78ed hover:text-[#2855ab]"
                  >
                    community@bookmart.com
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Partnership Inquiries */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="flex items-start gap-4 p-6 bg-f5f5f0 rounded-lg"
            >
              <div className="flex-shrink-0">
                <FaHandshake className="text-3xl text-3e78ed" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-212529 mb-3">
                  Partnership Inquiries
                </h2>
                <p className="text-gray-600 mb-4">
                  Interested in partnering with us? Whether you're a library,
                  bookstore, or organization, let's explore collaboration
                  opportunities.
                </p>
                <div className="flex items-center gap-2 text-495057">
                  <FaEnvelope className="text-lg text-3e78ed" />
                  <a
                    href="mailto:partnerships@bookexchange.com"
                    className="hover:text-gray-900"
                  >
                    partnerships@bookmart.com
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Emergency Support */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
              className="flex items-start gap-4 p-6 bg-f5f5f0 rounded-lg"
            >
              <div className="flex-shrink-0">
                <FaPhone className="text-3xl text-3e78ed" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-212529 mb-3">
                  Emergency Support
                </h2>
                <p className="text-gray-600 mb-4">
                  Need urgent assistance? Our support line is available during
                  business hours.
                </p>
                <div className="flex items-center gap-2 text-gray-700">
                  <FaPhone className="text-lg" />
                  <span>+91 934190XXXX</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Monday to Friday, 9:00 AM - 5:00 PM IST
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
            <p className="text-gray-600 mb-4">
              Follow us on social media for updates and community highlights
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="https://www.facebook.com/surajkr.sah.775"
                className="text-495057 hover:text-3e78ed transition-colors"
              >
                Facebook
              </a>
              <a
                href="https://github.com/SurajSah776
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Github
              </a>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default Contact;
