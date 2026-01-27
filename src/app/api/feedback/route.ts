import prisma from "@/lib/prisma";
import { successResponse, ApiErrors } from "@/lib/api-response";
import { validateRequired, validateScores, validateSurveyAnswers, sanitizeString, checkRateLimit } from "@/lib/validation";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { inviteCode, respondentName, scores, answers } = body;

        // Validate required fields
        const validation = validateRequired(body, ['inviteCode', 'respondentName', 'scores', 'answers']);
        if (!validation.valid) {
            return ApiErrors.validationError(
                `Missing required fields: ${validation.missing.join(', ')}`
            );
        }

        // Validate data types and sanitize
        if (typeof inviteCode !== 'string' || typeof respondentName !== 'string') {
            return ApiErrors.validationError("Invalid data types for inviteCode or respondentName");
        }

        if (!validateScores(scores)) {
            return ApiErrors.validationError("Invalid scores format. All scores must be numbers between 1 and 5");
        }

        if (!validateSurveyAnswers(answers)) {
            return ApiErrors.validationError("Invalid answers format");
        }

        // Rate limiting by invite code
        const rateLimit = checkRateLimit(`feedback:${inviteCode}`, 100, 3600000); // 100 submissions per hour per invite
        if (!rateLimit.allowed) {
            return ApiErrors.tooManyRequests("Too many feedback submissions for this invite code");
        }

        // Sanitize input
        const sanitizedName = sanitizeString(respondentName);

        // 1. Verify Invite Code
        const invite = await prisma.invite.findUnique({
            where: { code: inviteCode }
        });

        if (!invite) {
            return ApiErrors.notFound("Invalid invite code");
        }

        // Check if invite is expired
        if (invite.expiresAt && invite.expiresAt < new Date()) {
            return ApiErrors.badRequest("This invite code has expired");
        }

        // Check if invite has reached max uses
        if (invite.usedCount >= invite.maxUses) {
            return ApiErrors.badRequest("This invite code has reached its maximum uses");
        }

        // 2. Create PeerFeedback
        const feedback = await prisma.peerFeedback.create({
            data: {
                userId: invite.creatorId,
                respondentName: sanitizedName,
                scores: JSON.stringify(scores),
                answers: JSON.stringify(answers)
            }
        });

        // 3. Update Invite usage
        await prisma.invite.update({
            where: { id: invite.id },
            data: { usedCount: { increment: 1 } }
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
