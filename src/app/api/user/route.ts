import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    // Use mock ID for dev
    const userId = "1";

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                _count: {
                    select: {
                        friends: true,
                        receivedLetters: true,
                        surveys: true
                    }
                },
                // We could also fetch recent letters or surveys here
            }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            stats: {
                friendCount: user._count.friends,
                letterCount: user._count.receivedLetters,
                surveyCount: user._count.surveys
            }
        });
    } catch (error) {
        console.error("Failed to fetch user:", error);
        return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
    }
}
