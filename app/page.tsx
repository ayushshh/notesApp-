import NotesClient from "@/components/NoteClient";
import connectDb from "@/lib/db";
import { Note } from "@/model/note";

export async function getNotes(){
  await connectDb()
  const notes = await Note.find({}).sort({createdAt: -1}).lean()

  return notes.map ((note) => ({
    ...note,
    _id:note._id.toString()
  }))
}


export default async function Home() {
  const notes = await getNotes();
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Notes App</h1> 
      <NotesClient initialNotes={notes}/>
    </div>
  );
}
