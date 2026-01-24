import { Suspense } from "react";
import { LetterWriter } from "@/components/letters/LetterWriter";

export default function LettersPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LetterWriter />
        </Suspense>
    );
}
