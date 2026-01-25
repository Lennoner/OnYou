import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { successResponse, ApiErrors } from "@/lib/api-response";
import { checkRateLimit } from "@/lib/validation";

// Helper to generate random code
function generateCode(length = 6) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export async function POST(req: Request) {
    // Get user ID from session
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return ApiErrors.unauthorized();
    }

    const userId = session.user.id;

    // Rate limiting: 10 invite codes per hour per user
    const rateLimit = checkRateLimit(`invite:${userId}`, 10, 3600000);
    if (!rateLimit.allowed) {
        return ApiErrors.tooManyRequests("Too many invite codes created. Please try again later.");
    }

    try {
        const code = generateCode();

        const invite = await prisma.invite.create({
            data: {
                code,
                creatorId: userId,
                // expires in 7 days
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }
        });

        return successResponse(
            { code: invite.code },
            "Invite code created successfully"
        );

    } catch (error) {
        console.error("Failed to create invite:", error);
        return ApiErrors.internalError("Failed to create invite");
    }
}
