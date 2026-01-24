import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { GET as authRoute } from "../auth/[...nextauth]/route";

// Helper to get session (since we can't import authOptions easily if not exported, 
// but we exported the handler. We might need to refactor authOptions to be shared 
// if getServerSession requires it. 
// Actually, in App Router, we can use a slightly different pattern or just use the handler's config if extracted.
// For now, let's try a simpler approach since we are using the Mock Provider which puts user in session.

export async function GET(req: Request) {
    const userId = "1"; // Mock ID

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
