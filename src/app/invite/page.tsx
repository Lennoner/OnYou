import { InviteCreator } from "@/components/invite/InviteCreator";
import { FriendSurvey } from "@/components/invite/FriendSurvey";
import { Suspense } from "react";

export default function InvitePage({ searchParams }: { searchParams: { code?: string } }) {
    if (searchParams.code) {
        return (
            <Suspense fallback={<div>Loading Survey...</div>}>
                <FriendSurvey />
            </Suspense>
        );
    }
    return <InviteCreator />;
}
