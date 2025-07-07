import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center px-4"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80')",
      }}
    >
      <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-lg p-10 max-w-md text-center shadow-lg">
        <h1
          className="text-6xl font-extrabold mb-4 text-gray-900 animate-fadeInScale"
          style={{ animationDuration: "1s", animationFillMode: "forwards" }}
        >
          404
        </h1>
        <p className="text-xl text-gray-700 mb-6 animate-fadeIn" style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}>
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link
          to="/dashboard"
          className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded shadow hover:bg-blue-700 hover:shadow-lg transition transform hover:-translate-y-1"
          style={{ animationDelay: "1s", animationFillMode: "forwards" }}
        >
          Go Home
        </Link>
      </div>

      <style>{`
        @keyframes fadeInScale {
          0% { opacity: 0; transform: scale(0.7); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-fadeInScale {
          opacity: 0;
          animation-name: fadeInScale;
          animation-timing-function: ease-out;
          animation-fill-mode: forwards;
        }
        .animate-fadeIn {
          opacity: 0;
          animation-name: fadeIn;
          animation-timing-function: ease-out;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
};

export default NotFound;
