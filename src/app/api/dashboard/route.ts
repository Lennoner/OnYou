import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req: Request) {
    const session = await getSession();

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    try {
        // 1. Check if user has completed self-survey
        const selfSurvey = await prisma.surveyResponse.findFirst({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        const hasSelfSurvey = !!selfSurvey;

        // 2. Get peer feedback count
        const peerFeedbacks = await prisma.peerFeedback.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        const feedbackCount = peerFeedbacks.length;

        // 3. Get invites and calculate response rate
        const invites = await prisma.invite.findMany({
            where: { creatorId: userId }
        });
        const totalInvited = invites.reduce((sum, inv) => sum + inv.maxUses, 0);
        const responseCount = invites.reduce((sum, inv) => sum + inv.usedCount, 0);
        const responseRate = totalInvited > 0 ? Math.round((responseCount / totalInvited) * 100) : 0;

        // 4. Get friend/connection count
        const friendCount = await prisma.friendConnection.count({
            where: { userId }
        });

        // 5. Get letter count
        const letterCount = await prisma.letter.count({
            where: { senderId: userId }
        });

        // 6. Determine primary action state
        let primaryAction: 'no_survey' | 'no_invite' | 'waiting_feedback' | 'has_feedback';

        if (!hasSelfSurvey) {
            primaryAction = 'no_survey';
        } else if (invites.length === 0) {
            primaryAction = 'no_invite';
        } else if (feedbackCount === 0) {
            primaryAction = 'waiting_feedback';
        } else {
            primaryAction = 'has_feedback';
        }

        return NextResponse.json({
            user: {
                name: session.user.name,
                email: session.user.email,
                image: session.user.image
            },
            stats: {
                friendCount,
                feedbackCount,
                letterCount,
                inviteCount: invites.length
            },
            activity: {
                hasSelfSurvey,
                feedbackCount,
                totalInvited,
                responseCount,
                responseRate,
                primaryAction
            }
        });

    } catch (error) {
        console.error("Failed to fetch dashboard:", error);
        return NextResponse.json({ error: "Failed to fetch dashboard" }, { status: 500 });
    }
}
