import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    // Get user from session
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || !session?.user?.name) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { targetUserId, scores, answers } = body;

        // Validate required fields
        if (!targetUserId || typeof targetUserId !== 'string') {
            return NextResponse.json({ error: "Target user ID is required" }, { status: 400 });
        }
        if (!scores || typeof scores !== 'object') {
            return NextResponse.json({ error: "Scores are required" }, { status: 400 });
        }
        if (!answers || typeof answers !== 'object') {
            return NextResponse.json({ error: "Answers are required" }, { status: 400 });
        }

        const feedback = await prisma.peerFeedback.create({
            data: {
                userId: targetUserId,
                respondentName: session.user.name,
                scores: JSON.stringify(scores),
                answers: JSON.stringify(answers)
            }
        });

        return NextResponse.json({ success: true, feedbackId: feedback.id });
    } catch (error) {
        console.error("Failed to submit feedback:", error);
        return NextResponse.json({ error: "Submission failed" }, { status: 500 });
    }
}
