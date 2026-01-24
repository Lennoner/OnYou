import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    // Get user ID from session
    const session = await getServerSession(authOptions);

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
        const realFriends = connections.map(f => {
            let tags = [];
            if (f.tags) {
                try {
                    tags = JSON.parse(f.tags);
                } catch (parseError) {
                    console.error("Failed to parse tags for friend:", f.id, parseError);
                    tags = []; // Use empty array if parsing fails
                }
            }

            return {
                id: f.friend.id,
                name: f.friend.name,
                avatar: f.friend.image || "/placeholder-user.jpg",
                relation: f.relation,
                tags,
                closeness: f.closeness,
                lastInteraction: "최근",
                type: "USER"
            };
        });

        // 4. Format Guests
        // Group by respondentName to avoid duplicates if same guest answered multiple times?
        // For MVP, simplistic mapping:
        const guestFriends = guestFeedbacks.map(f => ({
            id: f.id, // Use feedback ID as temporary Friend ID
            name: f.respondentName || "익명 친구",
            avatar: null, // No avatar for guests
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
