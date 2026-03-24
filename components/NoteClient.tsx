"use client";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

const NotesClient = ({ initialNotes }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [notes, setNotes] = useState(initialNotes || []); // ✅ default to empty array
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  const deleteNote = async (id: string) => {
    try {
      const response = await fetch(`/api/notes/${id}`, { method: "DELETE" });
      const result = await response.json();
      if (result.success) {
        setNotes(prevNotes => prevNotes.filter((note: any) => note?._id !== id));
        toast.success("Note deleted successfully");
      } else {
        toast.error("Failed to delete note");
      }
    } catch (error) {
      console.error("Error while deleting note:", error);
      toast.error("Something went wrong");
    }
  };

  const createNote = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      const result = await response.json();
      if (result.success && result.data) {
        setNotes(prevNotes => [result.data, ...prevNotes]);
        toast.success("Note created successfully!!");
        setTitle("");
        setContent("");
      } else {
        toast.error("Failed to create note");
      }
    } catch (error) {
      console.error("Error creating note:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (note: any) => {
    if (!note?._id) return;
    setEditingId(note._id);
    setEditTitle(note.title || "");
    setEditContent(note.content || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditContent("");
  };

  const updateNote = async (id: string) => {
    if (!editTitle.trim() || !editContent.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle, content: editContent }),
      });
      const result = await response.json();
      if (result.success && result.data) {
        setNotes(prevNotes =>
          prevNotes.map(note =>
            note?._id === id ? result.data : note
          )
        );
        toast.success("Note updated successfully!!");
        cancelEdit();
      } else {
        toast.error("Failed to update note");
      }
    } catch (error) {
      console.error("Error updating note:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Note Form */}
      <form onSubmit={createNote} className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Create new Note
        </h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Note Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            required
          />
          <textarea
            placeholder="Note Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          />
          <button
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 transform"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Note"}
          </button>
        </div>
      </form>

      {/* Notes List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Notes ({notes.length})</h2>
        {notes.length === 0 ? (
          <p className="text-gray-500">
            No Notes yet. Create your first Note above.
          </p>
        ) : (
          notes.map((note: any) =>
            note && note._id ? (
              <div key={note._id} className="bg-white p-6 rounded-lg shadow-md">
                {editingId === note._id ? (
                  <>
                    {/* Editing mode */}
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Note Title"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                        required
                      />
                      <textarea
                        placeholder="Note Content"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={4}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateNote(note._id)}
                          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 transform"
                        >
                          {loading ? "Updating..." : "Update Note"}
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 disabled:opacity-50 transform"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* View mode */}
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">{note.title}</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(note)}
                          className="text-blue-500 hover:text-blue-600 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteNote(note._id)}
                          className="text-red-500 hover:text-red-600 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-2">{note.content}</p>
                  </>
                )}
              </div>
            ) : null
          )
        )}
      </div>
    </div>
  );
};

export default NotesClient;