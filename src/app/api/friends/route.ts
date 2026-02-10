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
        // 1. Fetch Registered Connections
        const connections = await prisma.friendConnection.findMany({
            where: { userId },
            include: { friend: true },
        });

        // 2. Fetch Guest Feedback (Unregistered)
        const guestFeedbacks = await prisma.peerFeedback.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });

        // 3. Format Real Friends
        const realFriends = connections.map(f => ({
            id: f.friend.id,
            name: f.friend.name,
            avatar: f.friend.image || "/placeholder-user.jpg",
            relation: f.relation,
            tags: f.tags ? JSON.parse(f.tags) : [],
            closeness: f.closeness,
            lastInteraction: "최근",
            type: "USER"
        }));

        // 4. Format Guests
        const guestFriends = guestFeedbacks.map(f => ({
            id: f.id,
            name: f.respondentName || "익명 친구",
            avatar: null,
            relation: "피드백 게스트",
            tags: ["게스트", "피드백완료"],
            closeness: 0,
            lastInteraction: new Date(f.createdAt).toLocaleDateString(),
            type: "GUEST"
        }));

        // 5. Merge
        const allFriends = [...realFriends, ...guestFriends];

        return NextResponse.json(allFriends);
    } catch (error) {
        console.error("Failed to fetch friends:", error);
        return NextResponse.json({ error: "Failed to fetch friends" }, { status: 500 });
    }
}
