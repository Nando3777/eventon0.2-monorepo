import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedUsers() {
  await prisma.user.upsert({
    where: { email: 'founder@eventon.dev' },
    update: {},
    create: {
      email: 'founder@eventon.dev',
      name: 'EventOn Founder',
    },
  });
}

async function seedOrganisations() {
  console.info('Seed organisations: add initial organisations here');
}

async function seedClients() {
  console.info('Seed clients: add client records here');
}

async function seedStaffProfiles() {
  console.info('Seed staff profiles: add team data here');
}

async function seedScheduling() {
  console.info('Seed jobs/shifts: add scheduling data here');
}

async function seedCompliance() {
  console.info('Seed compliance: add GDPR related fixtures here');
}

async function main() {
  await seedUsers();
  await seedOrganisations();
  await seedClients();
  await seedStaffProfiles();
  await seedScheduling();
  await seedCompliance();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error('Seed failed', error);
    await prisma.$disconnect();
    process.exit(1);
  });
