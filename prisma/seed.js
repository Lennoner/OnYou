const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // 1. Upsert Main Mock User (Jisoo)
    const user = await prisma.user.upsert({
        where: { email: 'jisoo@example.com' },
        update: {},
        create: {
            id: '1',
            name: '지수',
            email: 'jisoo@example.com',
            image: 'https://ui-avatars.com/api/?name=Jisoo',
            onboardingCompleted: true,
        },
    });

    console.log('Upserted User:', user);

    // 2. Create Friends (Mock Data from PeerSurvey.tsx)
    const friendsData = [
        {
            id: "friend-1",
            name: "김민준",
            relation: "대학교 동기",
            avatar: "https://images.unsplash.com/photo-1617355453845-6996ffeee4de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHlvdW5nJTIwa29yZWFuJTIwbWFuJTIwbmF0dXJhbCUyMGxpZ2h0fGVufDF8fHx8MTc2ODk4NjMwM3ww&ixlib=rb-4.1.0&q=80&w=400",
            tags: ["열정적", "성실함"],
            closeness: 80
        },
        {
            id: "friend-2",
            name: "이서연",
            relation: "직장 동료",
            avatar: "https://images.unsplash.com/photo-1676083192960-2a4873858487?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHlvdW5nJTIwa29yZWFuJTIwd29tYW4lMjBzbWlsZXxlbnwxfHx8fDE3Njg5ODYzMDN8MA&ixlib=rb-4.1.0&q=80&w=400",
            tags: ["창의적", "센스쟁이"],
            closeness: 70
        },
        {
            id: "friend-3",
            name: "박준호",
            relation: "디자인 멘토",
            avatar: "https://images.unsplash.com/photo-1701463387028-3947648f1337?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMGNyZWF0aXZlJTIwcHJvZmVzc2lvbmFsJTIwYXNpYW4lMjBtYW58ZW58MXx8fHwxNzY4OTg2MzAzfDA&ixlib=rb-4.1.0&q=80&w=400",
            tags: ["통찰력", "리더십"],
            closeness: 60
        },
        {
            id: "friend-4",
            name: "최지우",
            relation: "스터디 모임",
            avatar: "https://images.unsplash.com/photo-1729337531424-198f880cb6c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMGZyaWVuZGx5JTIwYXNpYW4lMjB3b21hbiUyMHN0dWRlbnR8ZW58MXx8fHwxNzY4OTg2MzAzfDA&ixlib=rb-4.1.0&q=80&w=400",
            tags: ["긍정적", "에너지"],
            closeness: 50
        },
        {
            id: "friend-5",
            name: "정하늘",
            relation: "고등학교 친구",
            avatar: "https://images.unsplash.com/photo-1582888175787-df1caa0e0001?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMGFydGlzdGljJTIwYXNpYW4lMjBub24tYmluYXJ5fGVufDF8fHx8MTc2ODk4NjMwM3ww&ixlib=rb-4.1.0&q=80&w=400",
            tags: ["예술가", "자유로움"],
            closeness: 40
        }
    ];

    for (const f of friendsData) {
        // 1. Create Friend User Account if not exists
        const friendUser = await prisma.user.upsert({
            where: { id: f.id },
            update: {},
            create: {
                id: f.id,
                name: f.name,
                email: `mock_${f.id}@example.com`, // Fake email
                image: f.avatar,
            },
        });

        // 2. Create Connection (User -> Friend)
        await prisma.friendConnection.upsert({
            where: {
                userId_friendId: {
                    userId: user.id,
                    friendId: friendUser.id,
                },
            },
            update: {},
            create: {
                userId: user.id,
                friendId: friendUser.id,
                relation: f.relation,
                tags: JSON.stringify(f.tags),
                closeness: f.closeness,
            },
        });
    }

    console.log('Seeding finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
