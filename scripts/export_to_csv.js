const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const exportDir = path.join(__dirname, '..', 'exports');

if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir);
}

function toCSV(data) {
    if (!data || data.length === 0) return 'No Data';
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row =>
        Object.values(row).map(val => {
            if (val === null) return '';
            if (typeof val === 'object') return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
            if (typeof val === 'string') return `"${val.replace(/"/g, '""')}"`;
            return val;
        }).join(',')
    );
    return [headers, ...rows].join('\n');
}

async function main() {
    console.log("Exporting data...");

    // 1. Friends
    const friends = await prisma.friend.findMany();
    fs.writeFileSync(path.join(exportDir, 'friends.csv'), toCSV(friends));
    console.log("- friends.csv created");

    // 2. Letters
    const letters = await prisma.letter.findMany();
    fs.writeFileSync(path.join(exportDir, 'letters.csv'), toCSV(letters));
    console.log("- letters.csv created");

    // 3. Survey Responses
    const surveys = await prisma.surveyResponse.findMany();
    fs.writeFileSync(path.join(exportDir, 'surveys.csv'), toCSV(surveys));
    console.log("- surveys.csv created");

    console.log(`\nSuccess! Files saved in: ${exportDir}`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
