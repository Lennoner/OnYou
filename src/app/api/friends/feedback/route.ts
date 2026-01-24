import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { targetUserId, scores, answers } = body;

        // Mock current user
        const myName = "지수";

        if (!targetUserId) {
            return NextResponse.json({ error: "Missing target" }, { status: 400 });
        }

        const feedback = await prisma.peerFeedback.create({
            data: {
                userId: targetUserId,
                respondentName: myName,
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
