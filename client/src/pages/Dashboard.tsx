import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, X } from "lucide-react";
import { fetchNotes, createNote, updateNote, deleteNote } from "../api/note";
import { getCurrentUser } from "../api/user";

interface Note {
  _id: string;
  title: string;
  content: string;
}

interface User {
  name: string;
  email: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>([]);
  const [user, setUser] = useState<User | null>(null);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  const [editedContent, setEditedContent] = useState("");
  const [expandedNote, setExpandedNote] = useState<Note | null>(null);

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    const fetchData = async () => {
      try {
        const user = await getCurrentUser();
        setUser(user);
        const notes = await fetchNotes();
        setNotes(notes);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleAddNote = async () => {
    if (!newContent.trim()) return;
    try {
      const newNote = await createNote({
        content: newContent.trim(),
      });
      setNotes((prev) => [...prev, newNote]);
      setNewTitle("");
      setNewContent("");
      setShowCreateForm(false);
    } catch (err) {
      console.error("Failed to add note", err);
    }
  };

  const handleUpdateNote = async () => {
    if (!expandedNote || !editedContent.trim()) return;
    try {
      await updateNote(expandedNote._id, { content: editedContent });
      setNotes((prev) =>
        prev.map((n) =>
          n._id === expandedNote._id ? { ...n, content: editedContent } : n
        )
      );
      setExpandedNote(null);
    } catch (err) {
      console.error("Failed to update note", err);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await deleteNote(id);
      setNotes((prev) => prev.filter((note) => note._id !== id));
      setExpandedNote(null);
    } catch (err) {
      console.error("Failed to delete note", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="relative min-h-screen bg-gray-50 px-4 py-6 md:px-12 lg:px-24">
      {/* Header */}

      <div className="flex flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <img
            src="/assets/logo1.jpg"
            alt="Logo"
            className="w-6 h-6 sm:w-10 sm:h-10 rounded shadow mr-3 sm:mr-10"
          />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Dashboard
          </h1>
        </div>
        <button
          onClick={handleLogout}
          className="text-blue-600 text-sm sm:text-base md:text-lg font-medium underline transition cursor-pointer"
        >
          Sign Out
        </button>
      </div>

      {/* User Info */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-300 p-6 w-full text-center md:text-left">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1">
          Welcome, <span className="font-bold">{user?.name || "..."}</span>
        </h2>
        <p className="text-gray-600 text-sm sm:text-base break-all">
          Email: {user?.email || "..."}
        </p>
      </div>

      {/* Create Note Toggle */}
      <div className="mb-6 mt-5 text-center">
        {!showCreateForm ? (
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition cursor-pointer"
            onClick={() => setShowCreateForm(true)}
          >
            Create Note
          </button>
        ) : (
          <div className="max-w-2xl mx-auto bg-white p-4 rounded shadow">
            <input
              type="text"
              placeholder="Title (optional)"
              className="w-full px-4 py-2 border border-gray-300 rounded mb-3"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <textarea
              placeholder="Write your note..."
              className="w-full px-4 py-2 border border-gray-300 rounded resize-none"
              rows={4}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />
            <div className="flex justify-end gap-4 mt-3">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                onClick={() => {
                  setShowCreateForm(false);
                  setNewTitle("");
                  setNewContent("");
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleAddNote}
              >
                Add Note
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((note, index) => (
          <div
            key={note._id}
            onClick={() => {
              setExpandedNote(note);
              setEditedContent(note.content);
            }}
            className="bg-white p-4 rounded shadow-lg border border-gray-300 cursor-pointer hover:shadow-xl transition-shadow duration-300"
          >
            <h3 className="font-semibold text-gray-800 mb-2">
              {note.title || `Note ${index + 1}`}
            </h3>
          </div>
        ))}
      </div>

      {/* Modal Overlay for Expanded Note */}
      {expandedNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-opacity duration-300">
          <div
            className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg transform
      opacity-0 scale-95 translate-y-4
      animate-modal-in relative"
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
              onClick={() => setExpandedNote(null)}
              title="Close"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold mb-2">
              {expandedNote.title || "Untitled Note"}
            </h3>
            <textarea
              className="w-full border border-gray-300 rounded p-3 text-sm"
              rows={6}
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              placeholder="Edit your note..."
              title="Edit note content"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => handleDeleteNote(expandedNote._id)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                <Trash2 className="inline-block mr-1" size={18} /> Delete
              </button>
              <button
                onClick={handleUpdateNote}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
