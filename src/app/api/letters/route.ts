import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    // Get user ID from session
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const senderId = session.user.id;

    try {
        const body = await req.json();
        const { content, template, recipientName } = body;

        // Basic Validation
        if (!content) {
            return NextResponse.json({ error: "Content is required" }, { status: 400 });
        }

        // In a real app, we might search for a user by recipientName or use a specific receiverId.
        // For now, if string is provided, we might just store it in content or handle it loosely since schema expects receiverId as User relation.
        // However, our schema `receiverId` is nullable. If we don't have a real user ID for the recipient, we leave it null.
        // But we might want to store the "intended name" somewhere.
        // Valid hack for MVP: If we don't have the user ID for "recipientName", we just create the letter with null receiverId.
        // Or we could try to find a user by name (mock).

        // Attempt to find friend by name to link relation (optional polish)
        let receiverId = null;
        if (recipientName) {
            const friend = await prisma.user.findFirst({
                where: { name: recipientName }
            });
            if (friend) receiverId = friend.id;
        }

        const letter = await prisma.letter.create({
            data: {
                senderId,
                receiverId: receiverId,
                content,
                template: template || "default",
                // If we want to store the "raw name" when no user is found, our current schema doesn't support it directly 
                // without adding a field like `recipientNameString`. 
                // For MVP, we proceed with relations.
            },
        });

        return NextResponse.json({ success: true, letter });
    } catch (error) {
        console.error("Failed to send letter:", error);
        return NextResponse.json({ error: "Failed to send letter" }, { status: 500 });
    }
}
