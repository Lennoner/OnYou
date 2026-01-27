import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { successResponse, ApiErrors } from "@/lib/api-response";

export async function GET(req: Request) {
    // Get user ID from session
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return ApiErrors.unauthorized();
    }

    const userId = session.user.id;

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                _count: {
                    select: {
                        friends: true,
                        receivedLetters: true,
                        surveys: true
                    }
                },
            }
        });

        if (!user) {
            return ApiErrors.notFound("User not found");
        }

        return successResponse({
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            stats: {
                friendCount: user._count.friends,
                letterCount: user._count.receivedLetters,
                surveyCount: user._count.surveys
            }
        });
    } catch (error) {
        console.error("Failed to fetch user:", error);
        return ApiErrors.internalError("Failed to fetch user");
    }
}
