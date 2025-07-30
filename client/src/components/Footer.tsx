import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
        
        {/* Brand */}
        <div className="mb-4 md:mb-0 text-xl font-semibold">
          © {new Date().getFullYear()} NoteMate. All rights reserved.
        </div>

        {/* Navigation Links */}
        <div className="flex space-x-6 text-sm">
          <Link to="/" className="hover:underline transition">Home</Link>
          <Link to="/login" className="hover:underline transition">Login</Link>
          <Link to="/signup" className="hover:underline transition">Signup</Link>
          <a
            href="mailto:notemate.app2025@gmail.com"
            className="hover:underline transition"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
