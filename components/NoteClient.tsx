"use client"
import React, { useState } from 'react'
import { toast } from 'react-hot-toast';   // ✅ FIX 1: use named import instead of default

const NotesClient = ({initialNotes}) => {
    const [notes, setNotes] = useState(initialNotes);
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");

    const createNote = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!title.trim() || !content.trim()) return;

        setLoading(true);
        try {
            const response = await fetch("/api/notes", {
                method : "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({title, content})
            })
            const result = await response.json();
            if(result.success){
                // ✅ FIX 2: use functional state update to avoid stale closure
                setNotes(prevNotes => [result.data, ...prevNotes])  
                toast.success("Note created successfully!!")
                setTitle("")
                setContent("")
            } else {
                toast.error("Failed to create note");   // ✅ FIX 3: handle unsuccessful response
            }
        } catch (error) {
            console.error("Error creating note : ", error)
            toast.error("Something went wrong");
        } finally {
            setLoading(false);   // ✅ FIX 4: ensure loading resets in all cases
        }
    }

  return (
    <div className='space-y-6'>
        <form onSubmit={createNote} className='p-6 bg-white rounded-lg shadow-md'>
            <h2 className='text-xl font-semibold mb-4 text-gray-800'>
                Create new Note
            </h2>
            <div className='space-y-4'>
                <input type="text" placeholder='Note Title' value={title} onChange={(e) => setTitle(e.target.value)} className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800' required/>
                <textarea placeholder='Note Content' value={content} onChange={(e) => setContent(e.target.value)} rows={4} className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800'></textarea> 
                <button className='bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 transform' type='submit' disabled={loading}>
                    {loading ? "Creating..." : "Create Note"}
                </button>
            </div>
        </form>
        <div className='space-y-4'>
            <h2 className='text-xl font-semibold'>Your Notes ({notes.length})</h2>
            {
                notes.length === 0 ? (
                    <p className='text-gray-500'>No Notes yet. Create your first Note above.</p>
                ) : (
                    notes.map((note) => (
                        <div key={note._id} className='bg-white p-6 rounded-lg shadow-md'>
                            <div className='flex justify-between items-start mb-2'>
                                <h3 className='text-lg font-semibold'>{note.title}</h3>
                                <div className='flex gap-2'>
                                    <button className='text-blue-500 hover:text-blue-600 text-sm'>
                                        Edit
                                    </button>
                                    <button className='text-red-500 hover:text-red-600 text-sm'>
                                        Delete
                                    </button>
                                </div>
                            </div>
                            <p className='text-gray-700 mb-2'>{note.content}</p>
                        </div>
                    ))
                )
            }
        </div>
    </div>
  )
}

export default NotesClient