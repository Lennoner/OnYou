import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { successResponse, ApiErrors } from "@/lib/api-response";
import { validateRequired, sanitizeHtml, checkRateLimit } from "@/lib/validation";

export async function POST(req: Request) {
    // Get user ID from session
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return ApiErrors.unauthorized();
    }

    const senderId = session.user.id;

    // Rate limiting: 20 letters per hour per user
    const rateLimit = checkRateLimit(`letter:${senderId}`, 20, 3600000);
    if (!rateLimit.allowed) {
        return ApiErrors.tooManyRequests("Too many letters sent. Please try again later.");
    }

    try {
        const body = await req.json();
        const { content, template, recipientName } = body;

        // Validation
        const validation = validateRequired(body, ['content']);
        if (!validation.valid) {
            return ApiErrors.validationError("Content is required");
        }

        if (typeof content !== 'string' || content.trim().length === 0) {
            return ApiErrors.validationError("Content must be a non-empty string");
        }

        if (content.length > 10000) {
            return ApiErrors.validationError("Content is too long (max 10000 characters)");
        }

        // Sanitize content to prevent XSS
        const sanitizedContent = sanitizeHtml(content);

        // Attempt to find friend by name to link relation
        let receiverId = null;
        if (recipientName && typeof recipientName === 'string') {
            const friend = await prisma.user.findFirst({
                where: { name: recipientName }
            });
            if (friend) receiverId = friend.id;
        }

        const letter = await prisma.letter.create({
            data: {
                senderId,
                receiverId,
                content: sanitizedContent,
                template: template || "default",
            },
        });

        return successResponse(
            { letterId: letter.id },
            "Letter sent successfully"
        );
    } catch (error) {
        console.error("Failed to send letter:", error);
        return ApiErrors.internalError("Failed to send letter");
    }
}
