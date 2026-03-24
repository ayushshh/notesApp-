import connectDb from "@/lib/db";
import { Note } from "@/model/note";
import { NextResponse, NextRequest } from "next/server";

export async function GET() {
    try {
        await connectDb();
        const notes = await Note.find({}).sort({createdAt : -1})
        return NextResponse.json({
            success : true,
            data : notes
        }, {status : 200})
    } catch (error) {
        return NextResponse.json({
            success : false,
            data : error
        }, {status : 400})
    }
}

export async function POST(request: NextRequest){
    try {
        await connectDb();
        const body = await request.json();
        const notes = await Note.create(body);

        return NextResponse.json({
            success : true,
            data : notes
        }, {status : 200})
    } catch (error : unknown) {
        return NextResponse.json({
            success : false,
            data : error
        }, {status : 400})
    }
} 