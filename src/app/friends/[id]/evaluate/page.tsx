"use client";

import { RegisteredFriendSurvey } from "@/components/friends/RegisteredFriendSurvey";

export default function EvaluateFriendPage({ params }: { params: { id: string } }) {
    return <RegisteredFriendSurvey friendId={params.id} />;
}
