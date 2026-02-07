import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    // Mock User ID for Sender
    const senderId = "1";

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
                recipientName: recipientName || null,
                content,
                template: template || "default",
            },
        });

        return NextResponse.json({ success: true, letter });
    } catch (error) {
        console.error("Failed to send letter:", error);
        return NextResponse.json({ error: "Failed to send letter" }, { status: 500 });
    }
}
