export type Section = "BASIC" | "PAST" | "PRESENT" | "FUTURE";
export type QuestionType = "SCALE" | "MULTIPLE_CHOICE" | "TEXT";

export interface Question {
    id: string;
    section: Section;
    type: QuestionType;
    text: string;
    subtext?: string;
    options?: string[];
    scaleLabel?: { min: string; max: string };
    placeholder?: string;
}

/** Self-survey questions (1st person perspective) */
export const selfSurveyQuestions: Question[] = [
    {
        id: "basic1",
        section: "BASIC",
        type: "SCALE",
        text: "요즘 전반적인 나의 심리적 상태는 어떤가요?",
        scaleLabel: { min: "무기력함", max: "활기참" }
    },
    {
        id: "past1",
        section: "PAST",
        type: "SCALE",
        text: "나는 과거에 어려운 상황이나 난관을 결국 내 힘으로 극복해본 적이 있다",
        scaleLabel: { min: "전혀 아니다", max: "매우 그렇다" }
    },
    {
        id: "past2",
        section: "PAST",
        type: "SCALE",
        text: "나는 내가 거둔 성과나 결과물에 대해 충분히 자부심을 느낀다",
        scaleLabel: { min: "전혀 아니다", max: "매우 그렇다" }
    },
    {
        id: "past-select",
        section: "PAST",
        type: "MULTIPLE_CHOICE",
        text: "내가 얻은 긍정적인 결과들은 주로 무엇 덕분이라고 생각하나요?",
        subtext: "해당하는 것을 모두 선택해주세요.",
        options: ["운이나 좋은 타이밍", "주변 사람들의 도움", "나의 노력과 역량"]
    },
    {
        id: "past-text",
        section: "PAST",
        type: "TEXT",
        text: "내 삶에서 가장 에너지가 넘치던 순간은?",
        placeholder: "그때의 상황과 기분을 떠올려보세요."
    },
    {
        id: "present1",
        section: "PRESENT",
        type: "SCALE",
        text: "나는 현재 주변 사람들의 삶에 긍정적인 영향을 주고 있다",
        scaleLabel: { min: "전혀 아니다", max: "매우 그렇다" }
    },
    {
        id: "present2",
        section: "PRESENT",
        type: "SCALE",
        text: "나는 내가 속한 그룹(친구, 팀, 직장 등)에서 꼭 필요한 사람이라고 느낀다",
        scaleLabel: { min: "전혀 아니다", max: "매우 그렇다" }
    },
    {
        id: "present-select",
        section: "PRESENT",
        type: "SCALE",
        text: "나는 친구나 동료에게 특별한 존재라고 느낀다",
        scaleLabel: { min: "전혀 아니다", max: "매우 그렇다" }
    },
    {
        id: "present-text",
        section: "PRESENT",
        type: "TEXT",
        text: "주변 사람들이 당신에게 고맙다고 말하거나 당신을 찾는 이유는?",
        subtext: "예: 고민 상담, 밥 같이 먹기, 기술적 도움, 분위기 메이커 등",
        placeholder: "구체적인 이유를 적어보세요."
    },
    {
        id: "future1",
        section: "FUTURE",
        type: "SCALE",
        text: "나는 미래에 내가 원하는 분야에서 나만의 가치를 증명할 잠재력이 충분하다",
        scaleLabel: { min: "전혀 아니다", max: "매우 그렇다" }
    },
    {
        id: "future2",
        section: "FUTURE",
        type: "SCALE",
        text: "3년 뒤 나는 내가 원하는 방향으로 성장해 있을 것이다",
        scaleLabel: { min: "전혀 아니다", max: "매우 그렇다" }
    },
    {
        id: "future-text",
        section: "FUTURE",
        type: "TEXT",
        text: "두려움 없이 도전하고 싶은 것은 무엇인가요?",
        subtext: "분야, 역할, 도전 등 자유롭게 적어주세요",
        placeholder: "가슴 뛰는 도전을 적어보세요."
    },
];

/** Peer-survey questions (3rd person perspective) */
export const peerSurveyQuestions: Question[] = [
    {
        id: "basic1",
        section: "BASIC",
        type: "SCALE",
        text: "요즘 이 친구는 전반적으로 어때 보이나요?",
        scaleLabel: { min: "무기력해 보임", max: "활기차 보임" }
    },
    {
        id: "past1",
        section: "PAST",
        type: "SCALE",
        text: "이 친구는 어려운 상황이 닥쳤을 때, 결국 스스로 극복해내는 편인가요?",
        scaleLabel: { min: "전혀 아니다", max: "매우 그렇다" }
    },
    {
        id: "past2",
        section: "PAST",
        type: "SCALE",
        text: "이 친구는 자신이 이룬 성과에 대해 충분히 자부심을 느끼는 것 같나요?",
        scaleLabel: { min: "전혀 아니다", max: "매우 그렇다" }
    },
    {
        id: "past-select",
        section: "PAST",
        type: "MULTIPLE_CHOICE",
        text: "이 친구가 좋은 결과를 만들어내는 비결은 무엇이라고 생각하나요?",
        subtext: "해당하는 것을 모두 선택해주세요.",
        options: ["운이나 타이밍", "주변 사람들의 도움", "본인의 노력과 역량"]
    },
    {
        id: "past-text",
        section: "PAST",
        type: "TEXT",
        text: "이 친구가 가장 에너지가 넘치거나 반짝였던 순간은 언제인가요?",
        placeholder: "구체적인 에피소드가 있다면 적어주세요."
    },
    {
        id: "present1",
        section: "PRESENT",
        type: "SCALE",
        text: "이 친구는 주변 사람들에게 긍정적인 영향을 주고 있나요?",
        scaleLabel: { min: "전혀 아니다", max: "매우 그렇다" }
    },
    {
        id: "present2",
        section: "PRESENT",
        type: "SCALE",
        text: "이 친구는 모임이나 그룹에서 꼭 필요한 존재인가요?",
        scaleLabel: { min: "전혀 아니다", max: "매우 그렇다" }
    },
    {
        id: "present-select",
        section: "PRESENT",
        type: "SCALE",
        text: "나는 이 친구에게서 특별한 유대감을 느끼나요?",
        scaleLabel: { min: "전혀 아니다", max: "매우 그렇다" }
    },
    {
        id: "present-text",
        section: "PRESENT",
        type: "TEXT",
        text: "이 친구에게 고맙다고 말하고 싶거나, 자꾸 찾게 되는 이유는?",
        placeholder: "친구의 어떤 점이 당신에게 힘이 되나요?"
    },
    {
        id: "future1",
        section: "FUTURE",
        type: "SCALE",
        text: "이 친구는 앞으로 자신이 원하는 분야에서 두각을 나타낼 잠재력이 있나요?",
        scaleLabel: { min: "전혀 아니다", max: "매우 그렇다" }
    },
    {
        id: "future2",
        section: "FUTURE",
        type: "SCALE",
        text: "3년 뒤, 이 친구는 지금보다 더 멋지게 성장해 있을까요?",
        scaleLabel: { min: "전혀 아니다", max: "매우 그렇다" }
    },
    {
        id: "future-text",
        section: "FUTURE",
        type: "TEXT",
        text: "이 친구가 두려움 없이 도전했으면 하는 것은 무엇인가요?",
        placeholder: "친구의 가능성을 응원해주세요."
    }
];
