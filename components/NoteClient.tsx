"use client"
import React, { useState } from 'react'

const NotesClient = () => {
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
            console.log(result);
            setLoading(false);
        } catch (error) {
            console.error("Error creating note : ", error)
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
    </div>
  )
}

export default NotesClient