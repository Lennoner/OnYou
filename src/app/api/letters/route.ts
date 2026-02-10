import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
    const session = await getSession();

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const senderId = session.user.id;

    try {
        const body = await req.json();
        const { content, template, recipientName } = body;

        if (!content) {
            return NextResponse.json({ error: "Content is required" }, { status: 400 });
        }

        // Attempt to find friend by name to link relation
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
                receiverId,
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
