import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    const session = await getSession();

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const friendId = params.id;

    try {
        // Check if this is a registered user or a guest feedback
        const user = await prisma.user.findUnique({
            where: { id: friendId },
            select: { id: true, name: true, image: true }
        });

        // Get connection info if exists
        const connection = await prisma.friendConnection.findUnique({
            where: {
                userId_friendId: {
                    userId: session.user.id,
                    friendId
                }
            }
        });

        // Get feedback history (feedbacks this friend gave to me)
        const receivedFeedbacks = await prisma.peerFeedback.findMany({
            where: {
                userId: session.user.id,
                respondentName: user?.name || undefined
            },
            orderBy: { createdAt: 'desc' },
            take: 10
        });

        // Get letters between us
        const letters = await prisma.letter.findMany({
            where: {
                OR: [
                    { senderId: session.user.id, receiverId: friendId },
                    { senderId: friendId, receiverId: session.user.id }
                ]
            },
            orderBy: { createdAt: 'desc' },
            take: 10
        });

        // If it's a guest (PeerFeedback entry, not a User)
        if (!user) {
            const guestFeedback = await prisma.peerFeedback.findUnique({
                where: { id: friendId }
            });

            if (!guestFeedback) {
                return NextResponse.json({ error: "Not found" }, { status: 404 });
            }

            return NextResponse.json({
                id: guestFeedback.id,
                name: guestFeedback.respondentName || "익명",
                relation: "피드백 게스트",
                type: "GUEST",
                history: [{
                    id: guestFeedback.id,
                    type: "FEEDBACK",
                    date: new Date(guestFeedback.createdAt).toLocaleDateString('ko-KR'),
                    content: "피드백을 보내주었습니다.",
                    direction: "RECEIVED"
                }]
            });
        }

        // Build history timeline
        const history = [
            ...receivedFeedbacks.map(f => ({
                id: f.id,
                type: "FEEDBACK" as const,
                date: new Date(f.createdAt).toLocaleDateString('ko-KR'),
                content: (() => {
                    try {
                        const answers = JSON.parse(f.answers);
                        return answers['past-text'] || answers['present-text'] || "피드백을 보내주었습니다.";
                    } catch { return "피드백을 보내주었습니다."; }
                })(),
                direction: "RECEIVED" as const
            })),
            ...letters.map(l => ({
                id: l.id,
                type: "LETTER" as const,
                date: new Date(l.createdAt).toLocaleDateString('ko-KR'),
                content: l.content.length > 50 ? l.content.slice(0, 50) + '...' : l.content,
                direction: l.senderId === session.user.id ? "SENT" as const : "RECEIVED" as const
            }))
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return NextResponse.json({
            id: user.id,
            name: user.name || "친구",
            relation: connection?.relation || "친구",
            type: "USER",
            history
        });

    } catch (error) {
        console.error("Failed to fetch friend detail:", error);
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}
