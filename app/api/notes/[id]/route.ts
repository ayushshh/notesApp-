import connectDb from "@/lib/db";
import { Note } from "@/model/note";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
    const { id } = await context.params;
    const { title, content } = await request.json();  

    await connectDb();

    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { $set: { title, content } },
      { new: true }   
    );

    if (!updatedNote) {
      return NextResponse.json(
        { success: false, error: "Note not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: updatedNote },
      { status: 200 }
    );

    } catch (error) {
        return NextResponse.json({
            success : false,
            error : error instanceof Error ? error.message : String(error)
        }, {status: 400})
    }
} 

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await connectDb();
    const note = await Note.findByIdAndDelete(id);

    if (!note) {
      return NextResponse.json(
        { success: false, error: "Note not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, deletedData: note },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : String(error) },
      { status: 400 }
    );
  }
}