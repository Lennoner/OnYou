/**
 * Shared survey questions for friend evaluation
 * Used in both FriendSurvey (invite-based) and RegisteredFriendSurvey (direct friend feedback)
 */

type Section = "BASIC" | "PAST" | "PRESENT" | "FUTURE";
type QuestionType = "SCALE" | "MULTIPLE_CHOICE" | "TEXT";

export interface SurveyQuestion {
    id: string;
    section?: Section;
    type: QuestionType;
    text: string;
    subtext?: string;
    options?: string[];
    scaleLabel?: { min: string; max: string };
    placeholder?: string;
}

/**
 * Questions for evaluating a friend (peer feedback)
 * These questions ask about the friend's observed behavior and characteristics
 */
export const FRIEND_EVALUATION_QUESTIONS: SurveyQuestion[] = [
    // 1. Basic (Observed Mood)
    {
        id: "basic1",
        section: "BASIC",
        type: "SCALE",
        text: "요즘 이 친구는 전반적으로 어때 보이나요?",
        scaleLabel: { min: "무기력해 보임", max: "활기차 보임" }
    },
    // 2. Resilience
    {
        id: "past1",
        section: "PAST",
        type: "SCALE",
        text: "이 친구는 어려운 상황이 닥쳤을 때, 결국 스스로 극복해내는 편인가요?",
        scaleLabel: { min: "전혀 아니다", max: "매우 그렇다" }
    },
    // 3. Pride
    {
        id: "past2",
        section: "PAST",
        type: "SCALE",
        text: "이 친구는 자신이 이룬 성과에 대해 충분히 자부심을 느끼는 것 같나요?",
        scaleLabel: { min: "전혀 아니다", max: "매우 그렇다" }
    },
    // 4. Attribution (Multiple Choice)
    {
        id: "past-select",
        section: "PAST",
        type: "MULTIPLE_CHOICE",
        text: "이 친구가 좋은 결과를 만들어내는 비결은 무엇이라고 생각하나요?",
        subtext: "해당하는 것을 모두 선택해주세요.",
        options: ["운이나 타이밍", "주변 사람들의 도움", "본인의 노력과 역량"]
    },
    // 5. Text (Energy Moment)
    {
        id: "past-text",
        section: "PAST",
        type: "TEXT",
        text: "이 친구가 가장 에너지가 넘치거나 반짝였던 순간은 언제인가요?",
        placeholder: "구체적인 에피소드가 있다면 적어주세요."
    },
    // 6. Influence
    {
        id: "present1",
        section: "PRESENT",
        type: "SCALE",
        text: "이 친구는 주변 사람들에게 긍정적인 영향을 주고 있나요?",
        scaleLabel: { min: "전혀 아니다", max: "매우 그렇다" }
    },
    // 7. Belonging 1
    {
        id: "present2",
        section: "PRESENT",
        type: "SCALE",
        text: "이 친구는 모임이나 그룹에서 꼭 필요한 존재인가요?",
        scaleLabel: { min: "전혀 아니다", max: "매우 그렇다" }
    },
    // 8. Belonging 2
    {
        id: "present-select",
        section: "PRESENT",
        type: "SCALE",
        text: "나는 이 친구에게서 특별한 유대감을 느끼나요?",
        scaleLabel: { min: "전혀 아니다", max: "매우 그렇다" }
    },
    // 9. Text (Thanks/Reason)
    {
        id: "present-text",
        section: "PRESENT",
        type: "TEXT",
        text: "이 친구에게 고맙다고 말하고 싶거나, 자꾸 찾게 되는 이유는?",
        placeholder: "친구의 어떤 점이 당신에게 힘이 되나요?"
    },
    // 10. Potential
    {
        id: "future1",
        section: "FUTURE",
        type: "SCALE",
        text: "이 친구는 앞으로 자신이 원하는 분야에서 두각을 나타낼 잠재력이 있나요?",
        scaleLabel: { min: "전혀 아니다", max: "매우 그렇다" }
    },
    // 11. Growth
    {
        id: "future2",
        section: "FUTURE",
        type: "SCALE",
        text: "3년 뒤, 이 친구는 지금보다 더 멋지게 성장해 있을까요?",
        scaleLabel: { min: "전혀 아니다", max: "매우 그렇다" }
    },
    // 12. Text (Challenge)
    {
        id: "future-text",
        section: "FUTURE",
        type: "TEXT",
        text: "이 친구가 두려움 없이 도전했으면 하는 것은 무엇인가요?",
        placeholder: "친구의 가능성을 응원해주세요."
    }
];
