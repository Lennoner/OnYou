import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

// Helper to generate random code
function generateCode(length = 6) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export async function POST(req: Request) {
    const userId = "1"; // Mock ID

    try {
        const code = generateCode();

        const invite = await prisma.invite.create({
            data: {
                code,
                creatorId: userId,
                // expires in 7 days
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }
        });

        return NextResponse.json({ success: true, code: invite.code });

    } catch (error) {
        console.error("Failed to create invite:", error);
        return NextResponse.json({ error: "Failed to create invite" }, { status: 500 });
    }
}
