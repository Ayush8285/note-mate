import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold text-white hover:scale-105 transition-transform"
          >
            <img src="/assets/logo1.jpg" alt="Logo" className="w-8 h-8 rounded-full" />
            <span>Note Mate</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/login"
              className="px-5 py-2 rounded-full text-white border border-white hover:bg-white hover:text-indigo-600 transition duration-300"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-5 py-2 rounded-full bg-white text-indigo-600 hover:bg-indigo-100 transition duration-300"
            >
              Signup
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 bg-gradient-to-r from-blue-500 to-indigo-600">
          <Link
            to="/login"
            className="block px-4 py-2 rounded-full text-white border border-white hover:bg-white hover:text-indigo-600 transition duration-300"
            onClick={() => setIsOpen(false)}
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="block px-4 py-2 rounded-full bg-white text-indigo-600 hover:bg-indigo-100 transition duration-300"
            onClick={() => setIsOpen(false)}
          >
            Signup
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
