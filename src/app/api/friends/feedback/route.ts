import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { successResponse, ApiErrors } from "@/lib/api-response";
import { validateRequired, validateScores, validateSurveyAnswers, checkRateLimit } from "@/lib/validation";

export async function POST(req: Request) {
    // Get user from session
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || !session?.user?.name) {
        return ApiErrors.unauthorized();
    }

    // Rate limiting: 50 feedbacks per hour per user
    const rateLimit = checkRateLimit(`friend-feedback:${session.user.id}`, 50, 3600000);
    if (!rateLimit.allowed) {
        return ApiErrors.tooManyRequests("Too many feedbacks submitted. Please try again later.");
    }

    try {
        const body = await req.json();
        const { targetUserId, scores, answers } = body;

        // Validate required fields
        const validation = validateRequired(body, ['targetUserId', 'scores', 'answers']);
        if (!validation.valid) {
            return ApiErrors.validationError(
                `Missing required fields: ${validation.missing.join(', ')}`
            );
        }

        if (typeof targetUserId !== 'string') {
            return ApiErrors.validationError("Target user ID must be a string");
        }

        if (!validateScores(scores)) {
            return ApiErrors.validationError("Invalid scores format. All scores must be numbers between 1 and 5");
        }

        if (!validateSurveyAnswers(answers)) {
            return ApiErrors.validationError("Invalid answers format");
        }

        const feedback = await prisma.peerFeedback.create({
            data: {
                userId: targetUserId,
                respondentName: session.user.name,
                scores: JSON.stringify(scores),
                answers: JSON.stringify(answers)
            }
        });

        return successResponse(
            { feedbackId: feedback.id },
            "Feedback submitted successfully"
        );
    } catch (error) {
        console.error("Failed to submit feedback:", error);
        return ApiErrors.internalError("Submission failed");
    }
}
