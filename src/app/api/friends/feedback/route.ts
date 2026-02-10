import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const session = await getSession();
        const body = await req.json();
        const { targetUserId, scores, answers } = body;

        const myName = session?.user?.name || "익명";

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
