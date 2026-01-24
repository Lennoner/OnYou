const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const exportDir = path.join(__dirname, 'csv_exports');

if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir);
}

function toCSV(data) {
    if (!data || !Array.isArray(data) || data.length === 0) {
        return 'No Data';
    }
    try {
        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(row =>
            Object.values(row).map(val => {
                if (val === null || val === undefined) return '';
                if (typeof val === 'object') return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
                if (typeof val === 'string') return `"${val.replace(/"/g, '""')}"`; // Escape quotes
                return val;
            }).join(',')
        );
        return [headers, ...rows].join('\n');
    } catch (e) {
        console.error("Error converting to CSV:", e);
        return 'Error';
    }
}

async function main() {
    console.log("Starting export...");

    try {
        const friends = await prisma.friendConnection.findMany(); // Corrected Model Name
        console.log(`Found ${friends.length} friend connections.`);
        fs.writeFileSync(path.join(exportDir, 'friends.csv'), toCSV(friends));
    } catch (e) {
        console.error("Error exporting friends:", e);
    }

    try {
        const letters = await prisma.letter.findMany();
        console.log(`Found ${letters.length} letters.`);
        fs.writeFileSync(path.join(exportDir, 'letters.csv'), toCSV(letters));
    } catch (e) {
        console.error("Error exporting letters:", e);
    }

    try {
        const surveys = await prisma.surveyResponse.findMany();
        console.log(`Found ${surveys.length} surveys.`);
        fs.writeFileSync(path.join(exportDir, 'surveys.csv'), toCSV(surveys));
    } catch (e) {
        console.error("Error exporting surveys:", e);
    }

    try {
        const users = await prisma.user.findMany();
        console.log(`Found ${users.length} users.`);
        fs.writeFileSync(path.join(exportDir, 'users.csv'), toCSV(users));
    } catch (e) {
        console.error("Error exporting users:", e);
    }

    try {
        const invites = await prisma.invite.findMany();
        console.log(`Found ${invites.length} invites.`);
        fs.writeFileSync(path.join(exportDir, 'invites.csv'), toCSV(invites));
    } catch (e) {
        console.error("Error exporting invites:", e);
    }

    console.log(`\nDONE. Check folder: ${exportDir}`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
