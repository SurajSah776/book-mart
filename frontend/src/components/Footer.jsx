import { NavLink } from "react-router-dom";
import TermsAndConditions from "./TermsAndConditions";

export default function Footer() {
  return (
    <footer className="bg-[#3e78ed] text-xs sm:text-lg text-[#f5f5f0]">
      <div className="container mx-auto">
        {/* Logo and Intro(Links and social media) */}
        <div className="flex flex-col md:flex-row justify-around items-center md:items-start gap-4 pt-2">
          <div className="pt-0 sm:pt-2">
            <h1 className="font-semibold text-2xl sm:text-3xl">BookMart</h1>

            <p className="text-[#f5f5f0]/80 max-w-sm text-justify text-wrap text-xs sm:text-sm">
              Exchange books for books, Let's build something amazing together!
            </p>

            <div>
              <TermsAndConditions />
            </div> 
          </div>

          {/* Quick Links */}
          <div className="max-w-sm pt-1 sm:pt-2">
            <h2 className="font-semibold text-xl sm:text-2xl">Quick Links</h2>

            <ul className="flex sm:flex-col flex-wrap gap-2 text-sm max-w-sm">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `py-1 px-2 hover:bg-[#e91e63] text-xs sm:text-sm ${
                    isActive ? "bg-[#e91e63] font-semibold" : ""
                  }`
                }
              >
                Home
              </NavLink>

              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `py-1 px-2 hover:bg-[#e91e63] text-xs sm:text-sm ${
                    isActive ? "bg-[#e91e63] font-semibold" : ""
                  }`
                }
              >
                Get Started
              </NavLink>

              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `py-1 px-2 hover:bg-[#e91e63] text-xs sm:text-sm ${
                    isActive ? "bg-[#e91e63] font-semibold" : ""
                  }`
                }
              >
                Contact
              </NavLink>

              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `py-1 px-2 hover:bg-[#e91e63] text-xs sm:text-sm ${
                    isActive ? "bg-[#e91e63] font-semibold" : ""
                  }`
                }
              >
                About
              </NavLink>
            </ul>
          </div>

          {/* Social Links */}
          <div className="pt-1 sm:pt-2">
            <h2 className="font-semibold text-xl sm:text-2xl mb-4">
              Follow Us
            </h2>

            {/* Social Media Links */}
            <div className="flex sm:flex-col flex-wrap gap-2 text-sm max-w-sm">
              {/* Github */}
              <div className="py-1 px-2 hover:bg-[#e91e63] text-xs sm:text-sm">
                <a href="https://github.com/SurajSah776" target="_blank">
                  Github
                </a>
              </div>

              {/* Facebook */}
              <div className="py-1 px-2 hover:bg-gray-600 text-xs sm:text-sm">
                <a 
                  href="https://www.facebook.com/surajkr.sah.775"
                  target="_blank"
                >
                  Facebook
                </a>
              </div>

              {/* LinkedIn */}
              <div className="py-1 px-2 hover:bg-[#e91e63] text-xs sm:text-sm">
                <a
                  href="https://www.linkedin.com/in/suraj-kumar-sah"
                  target="_blank"
                >
                  LinkedIn
                </a>
              </div>

              {/* Twitter */}
              <div className="py-1 px-2 hover:bg-[#e91e63] text-xs sm:text-sm">
                <a href="https://x.com/SurajSah776" target="_blank">
                  Twitter
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-1 border-[#f5f5f0]/50 my-6"></div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-[#f5f5f0]/80">
            © {new Date().getFullYear()} BookMart. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
