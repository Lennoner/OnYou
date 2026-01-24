import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { inviteCode, respondentName, scores, answers } = body;

        // Validate required fields
        if (!inviteCode || typeof inviteCode !== 'string') {
            return NextResponse.json({ error: "Invite code is required" }, { status: 400 });
        }
        if (!respondentName || typeof respondentName !== 'string') {
            return NextResponse.json({ error: "Respondent name is required" }, { status: 400 });
        }
        if (!scores || typeof scores !== 'object') {
            return NextResponse.json({ error: "Scores are required" }, { status: 400 });
        }
        if (!answers || typeof answers !== 'object') {
            return NextResponse.json({ error: "Answers are required" }, { status: 400 });
        }

        // 1. Verify Invite Code
        const invite = await prisma.invite.findUnique({
            where: { code: inviteCode }
        });

        if (!invite) {
            return NextResponse.json({ error: "Invalid invite code" }, { status: 404 });
        }

        // 2. Create PeerFeedback
        const feedback = await prisma.peerFeedback.create({
            data: {
                userId: invite.creatorId,
                respondentName,
                scores: JSON.stringify(scores),
                answers: JSON.stringify(answers)
            }
        });

        // 3. Update Invite usage (optional)
        await prisma.invite.update({
            where: { id: invite.id },
            data: { usedCount: { increment: 1 } }
        });

        return NextResponse.json({ success: true, feedbackId: feedback.id });

    } catch (error) {
        console.error("Failed to submit feedback:", error);
        return NextResponse.json({ error: "Submission failed" }, { status: 500 });
    }
}
