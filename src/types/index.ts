// ===== Survey & Feedback Types =====

export interface RadarDataItem {
    subject: string;
    A: number;        // Self score
    B?: number;       // Peer average score
    fullMark: number;
}

export interface SurveyAnswers {
    [key: string]: string | number;
}

export interface SurveyScores {
    [key: string]: number;
}

export interface PeerTextAnswer {
    text: string;
    author: string;
}

export interface PeerAnswers {
    q1: PeerTextAnswer[];  // Energy moment
    q2: PeerTextAnswer[];  // Thanks
    q3: PeerTextAnswer[];  // Challenge
}

export interface AnalysisData {
    radarData: RadarDataItem[];
    answers: SurveyAnswers;
    peerAnswers?: PeerAnswers;
    peerCount?: number;
    createdAt?: Date | string;
}

// ===== Friend & Connection Types =====

export interface FriendNode {
    id: string;
    name: string;
    avatar: string | null;
    relation: string;
    closeness: number;
    status?: "online" | "offline";
    lastInteraction: string;
    tags?: string[];
    type?: "USER" | "GUEST";
}

// ===== API Response Types =====

export interface ApiSuccessResponse<T = unknown> {
    success: true;
    data?: T;
}

export interface ApiErrorResponse {
    error: string;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

// ===== Survey Question Types =====

export type QuestionType = "SCALE" | "TEXT" | "MULTIPLE_CHOICE";

export interface Question {
    id: string;
    type: QuestionType;
    label: string;
    options?: string[];
    required?: boolean;
}

export interface QuestionSection {
    title: string;
    description?: string;
    questions: Question[];
}

// ===== NextAuth Types Extension =====

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
        }
    }

    interface User {
        id: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        sub?: string;
    }
}
