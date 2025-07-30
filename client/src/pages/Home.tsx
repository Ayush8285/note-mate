import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import noteImage from "/assets/images.jpg";
import { motion } from "framer-motion";

const Home: React.FC = () => {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="text-center py-20 px-4 bg-gradient-to-r from-cyan-100 to-blue-100">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-extrabold text-gray-800 mb-6"
        >
          Welcome to Note Mate
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-lg text-gray-600 max-w-2xl mx-auto"
        >
          Your smart, secure, and simple note-taking companion for staying productive.
        </motion.p>
      </section>

      {/* Why NoteMate Section */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-10 py-20 px-6 md:px-20 bg-gradient-to-r from-white to-blue-50">
        <div className="md:w-1/2">
          <img
            src={noteImage}
            alt="NoteMate app"
            className="rounded-xl shadow-xl"
          />
        </div>
        <div className="md:w-1/2">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-3xl font-bold text-gray-800 mb-4"
          >
            Why Choose NoteMate?
          </motion.h2>
          <ul className="list-disc list-inside text-gray-700 text-lg space-y-2">
            <li>Create and manage unlimited notes</li>
            <li>Organize with folders and tags</li>
            <li>Secure cloud sync and backup</li>
            <li>Quick search, edit, and real-time share</li>
            <li>Clean & distraction-free interface</li>
          </ul>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-6 md:px-20 bg-gradient-to-r from-purple-100 to-pink-100">
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center text-gray-800 mb-10"
        >
          Perfect For Everyone
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-gray-700 text-lg">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Students</h3>
            <p>Take class notes, organize subjects, and sync across devices.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Professionals</h3>
            <p>Manage tasks, meeting notes, and project ideas in one place.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Creators</h3>
            <p>Draft articles, storyboards, and creative ideas on the go.</p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="text-center py-20 px-6 bg-gradient-to-r from-indigo-100 to-blue-200">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-bold text-gray-800 mb-6"
        >
          Ready to Start Writing?
        </motion.h2>
        <p className="text-gray-700 mb-8 text-lg">
          Join thousands of users and bring your ideas to life with NoteMate.
        </p>
        <a
          href="/signup"
          className="inline-block px-8 py-3 bg-blue-600 text-white rounded-full text-lg hover:bg-blue-700 transition"
        >
          Get Started for Free
        </a>
      </section>

      <Footer />
    </>
  );
};

export default Home;
