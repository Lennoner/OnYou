import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import type { RadarDataItem, SurveyAnswers, SurveyScores, PeerTextAnswer, PeerAnswers } from "@/types";

export async function POST(req: Request) {
    // Get user ID from session
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    try {
        const body = await req.json();
        const { answers } = body;

        // Validate required fields
        if (!answers || typeof answers !== 'object') {
            return NextResponse.json({ error: "Answers are required" }, { status: 400 });
        }

        // Simple Algorithm to map answers to Radar Dimensions
        const getScore = (key: string) => typeof answers[key] === 'number' ? answers[key] : 3;

        const recovery = getScore('basic1');
        const pride = (getScore('past1') + getScore('past2')) / 2;
        const influence = getScore('present1');
        const belonging = (getScore('present2') + getScore('present-select')) / 2;
        const potential = getScore('future1');
        const growth = getScore('future2');

        const radarData = [
            { subject: '회복탄력성', A: recovery, fullMark: 5 },
            { subject: '성취자부심', A: pride, fullMark: 5 },
            { subject: '긍정적 영향', A: influence, fullMark: 5 },
            { subject: '소속감', A: belonging, fullMark: 5 },
            { subject: '잠재력', A: potential, fullMark: 5 },
            { subject: '성장기대', A: growth, fullMark: 5 },
        ];

        // Create Survey Response
        await prisma.surveyResponse.create({
            data: {
                userId,
                radarData: JSON.stringify(radarData),
                answers: JSON.stringify(answers),
            }
        });

        return NextResponse.json({ success: true, radarData });

    } catch (error) {
        console.error("Failed to save survey:", error);
        return NextResponse.json({ error: "Failed to save survey" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    // Get user ID from session
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    try {
        // 1. Fetch Self Survey
        const selfResponse = await prisma.surveyResponse.findFirst({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });

        if (!selfResponse) {
            return NextResponse.json({ exists: false });
        }

        // Parse JSON with error handling
        let radarData: RadarDataItem[];
        let selfAnswers: SurveyAnswers;
        try {
            radarData = JSON.parse(selfResponse.radarData as string) as RadarDataItem[];
            selfAnswers = selfResponse.answers ? JSON.parse(selfResponse.answers) as SurveyAnswers : {};
        } catch (parseError) {
            console.error("Failed to parse survey data:", parseError);
            return NextResponse.json({ error: "Corrupted survey data" }, { status: 500 });
        }

        // 2. Fetch Peer Feedbacks
        const peerFeedbacks = await prisma.peerFeedback.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });

        const peerAnswers: PeerAnswers = {
            q1: [], // Energy
            q2: [], // Thanks
            q3: []  // Challenge
        };

        if (peerFeedbacks.length > 0) {
            // Aggregate Scores
            const totals = {
                recovery: 0, pride: 0, influence: 0, belonging: 0, potential: 0, growth: 0
            };
            const counts = peerFeedbacks.length;

            peerFeedbacks.forEach(pf => {
                try {
                    const scores = JSON.parse(pf.scores) as SurveyScores;
                    const answers = JSON.parse(pf.answers) as SurveyAnswers;
                    const name = pf.respondentName || '친구';

                    // Map Scores (Note: IDs must match FriendSurvey questions)
                    // FriendSurvey: past1(Resilience), past2(Pride), present1(Influence), present2(Belonging1), present-select(Belonging2), future1(Potential), future2(Growth)
                    totals.recovery += (scores['past1'] || 0); // Resilience maps to past1
                    totals.pride += (scores['past2'] || 0);
                    totals.influence += (scores['present1'] || 0);
                    totals.belonging += ((scores['present2'] || 0) + (scores['present-select'] || 0)) / 2;
                    totals.potential += (scores['future1'] || 0);
                    totals.growth += (scores['future2'] || 0);

                    // Collect Text
                    if (answers['past-text']) peerAnswers.q1.push({ text: answers['past-text'], author: name });
                    if (answers['present-text']) peerAnswers.q2.push({ text: answers['present-text'], author: name });
                    if (answers['future-text']) peerAnswers.q3.push({ text: answers['future-text'], author: name });
                } catch (parseError) {
                    console.error("Failed to parse peer feedback:", pf.id, parseError);
                    // Skip this feedback if parsing fails
                }
            });

            // Update Radar Data B (Peer)
            radarData = radarData.map((item): RadarDataItem => {
                let peerScore = 0;
                switch (item.subject) {
                    case '회복탄력성': peerScore = totals.recovery / counts; break;
                    case '성취자부심': peerScore = totals.pride / counts; break;
                    case '긍정적 영향': peerScore = totals.influence / counts; break;
                    case '소속감': peerScore = totals.belonging / counts; break;
                    case '잠재력': peerScore = totals.potential / counts; break;
                    case '성장기대': peerScore = totals.growth / counts; break;
                }
                return { ...item, B: Number(peerScore.toFixed(1)) };
            });
        } else {
            // No peer data yet, set B to 0 or null
            radarData = radarData.map((item): RadarDataItem => ({ ...item, B: 0 }));
        }

        return NextResponse.json({
            exists: true,
            radarData,
            answers: selfAnswers,
            peerAnswers, // New field
            peerCount: peerFeedbacks.length,
            createdAt: selfResponse.createdAt
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch survey" }, { status: 500 });
    }
}
