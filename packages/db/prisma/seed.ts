import crypto from 'node:crypto';

import {
  AvailabilityType,
  ConsentScope,
  DsrStatus,
  DsrType,
  EmbeddingSource,
  JobStatus,
  MemberStatus,
  OrgRole,
  Prisma,
  PrismaClient,
  ShiftStatus,
  type Client,
  type Organisation,
  type Shift,
  type StaffProfile,
  type User,
} from '@prisma/client';

const prisma = new PrismaClient();

type SeededCredential = {
  user: User;
  password: string;
};

type StaffSeedDefinition = {
  name: string;
  email: string;
  phone: string;
  role: OrgRole;
  title: string;
  headline: string;
  bio: string;
  skills: string[];
  languages: string[];
  yearsExperience: number;
  hourlyRate: number;
  profileScore: number;
  locationIndex: number;
  availabilityPattern: number;
};

type SeededStaff = SeededCredential & {
  seed: StaffSeedDefinition;
};

type LocationPoint = {
  area: string;
  latitude: number;
  longitude: number;
};

type AvailabilitySlot = {
  dayOffset: number;
  startHour: number;
  durationHours: number;
  notes: string;
};

type ShiftSeedDefinition = {
  title: string;
  dayOffset: number;
  startHour: number;
  durationHours: number;
  requiredStaff: number;
  notes: string;
};

type JobSeedDefinition = {
  title: string;
  description: string;
  tags: string[];
  location: string;
  remote: boolean;
  budget: number;
  shiftTemplates: ShiftSeedDefinition[];
};

const LOCATION_OPTIONS: LocationPoint[] = [
  { area: 'Central London', latitude: 51.5074, longitude: -0.1278 },
  { area: 'Canary Wharf', latitude: 51.5054, longitude: -0.0235 },
  { area: 'Wimbledon', latitude: 51.4214, longitude: -0.2065 },
  { area: 'Croydon', latitude: 51.3762, longitude: -0.0982 },
  { area: 'Richmond', latitude: 51.4613, longitude: -0.3037 },
  { area: 'Kingston upon Thames', latitude: 51.4123, longitude: -0.3007 },
  { area: 'Guildford', latitude: 51.2362, longitude: -0.5704 },
  { area: 'Epsom', latitude: 51.336, longitude: -0.2674 },
  { area: 'Woking', latitude: 51.319, longitude: -0.561 },
  { area: 'Bromley', latitude: 51.406, longitude: 0.0158 },
];

const AVAILABILITY_PATTERNS: AvailabilitySlot[][] = [
  [
    { dayOffset: 0, startHour: 9, durationHours: 4, notes: 'Morning availability for corporate setup support.' },
    { dayOffset: 2, startHour: 13, durationHours: 5, notes: 'Mid-week afternoon slots ideal for conferences.' },
    { dayOffset: 4, startHour: 17, durationHours: 5, notes: 'Evening coverage for live events.' },
  ],
  [
    { dayOffset: 1, startHour: 7, durationHours: 6, notes: 'Early start for venue preparation.' },
    { dayOffset: 3, startHour: 12, durationHours: 4, notes: 'Lunchtime service and reception support.' },
    { dayOffset: 5, startHour: 10, durationHours: 8, notes: 'Weekend all-day hospitality coverage.' },
  ],
  [
    { dayOffset: 0, startHour: 15, durationHours: 6, notes: 'Afternoon technical rehearsals.' },
    { dayOffset: 2, startHour: 8, durationHours: 4, notes: 'Morning break-down and logistics window.' },
    { dayOffset: 6, startHour: 11, durationHours: 6, notes: 'Sunday flexible support.' },
  ],
  [
    { dayOffset: 1, startHour: 16, durationHours: 5, notes: 'Evening hospitality shifts.' },
    { dayOffset: 3, startHour: 9, durationHours: 5, notes: 'Daytime conference coverage.' },
    { dayOffset: 5, startHour: 14, durationHours: 6, notes: 'Saturday receptions and weddings.' },
  ],
];

const STAFF_SEED_DATA: StaffSeedDefinition[] = [
  {
    name: 'Amelia Carter',
    email: 'amelia.carter@demo.eventon.dev',
    phone: '+447700900001',
    role: OrgRole.MANAGER,
    title: 'Senior Event Manager',
    headline: 'Senior event manager with decade of corporate experience.',
    bio: 'leads large-scale gala productions and coordinates multi-vendor teams.',
    skills: ['Event Management', 'Logistics', 'Vendor Coordination'],
    languages: ['English', 'French'],
    yearsExperience: 9,
    hourlyRate: 28,
    profileScore: 0.92,
    locationIndex: 0,
    availabilityPattern: 0,
  },
  {
    name: 'Oliver Hughes',
    email: 'oliver.hughes@demo.eventon.dev',
    phone: '+447700900002',
    role: OrgRole.ADMIN,
    title: 'Operations Coordinator',
    headline: 'Detail-oriented coordinator specialising in venue logistics.',
    bio: 'focuses on precise run-of-show documentation and supplier management.',
    skills: ['Venue Liaison', 'Logistics', 'Scheduling'],
    languages: ['English'],
    yearsExperience: 7,
    hourlyRate: 24,
    profileScore: 0.88,
    locationIndex: 1,
    availabilityPattern: 1,
  },
  {
    name: 'Sophie Bennett',
    email: 'sophie.bennett@demo.eventon.dev',
    phone: '+447700900003',
    role: OrgRole.MANAGER,
    title: 'Hospitality Lead',
    headline: 'Hospitality lead delivering premium guest experiences.',
    bio: 'drives premium guest experiences for hospitality-led events.',
    skills: ['Hospitality', 'Front of House', 'Team Leadership'],
    languages: ['English', 'Spanish'],
    yearsExperience: 8,
    hourlyRate: 23,
    profileScore: 0.9,
    locationIndex: 2,
    availabilityPattern: 2,
  },
  {
    name: 'Lucas Patel',
    email: 'lucas.patel@demo.eventon.dev',
    phone: '+447700900004',
    role: OrgRole.STAFF,
    title: 'Audio Visual Specialist',
    headline: 'AV technician experienced with hybrid conference setups.',
    bio: 'sets up and operates audio visual rigs for conferences and live streams.',
    skills: ['Audio Engineering', 'Lighting', 'Stage Management'],
    languages: ['English', 'Gujarati'],
    yearsExperience: 6,
    hourlyRate: 19,
    profileScore: 0.85,
    locationIndex: 3,
    availabilityPattern: 3,
  },
  {
    name: 'Grace Thompson',
    email: 'grace.thompson@demo.eventon.dev',
    phone: '+447700900005',
    role: OrgRole.STAFF,
    title: 'Front of House Supervisor',
    headline: 'Guest services specialist for premium brand activations.',
    bio: 'manages front-of-house teams delivering polished guest experiences.',
    skills: ['Front of House', 'Customer Service', 'VIP Management'],
    languages: ['English'],
    yearsExperience: 5,
    hourlyRate: 20,
    profileScore: 0.83,
    locationIndex: 4,
    availabilityPattern: 0,
  },
  {
    name: 'Noah Sinclair',
    email: 'noah.sinclair@demo.eventon.dev',
    phone: '+447700900006',
    role: OrgRole.STAFF,
    title: 'Logistics Coordinator',
    headline: 'Calm and efficient crew chief for quick turnarounds.',
    bio: 'specialises in overnight flips and complex load-ins across the city.',
    skills: ['Logistics', 'Crew Management', 'Inventory Control'],
    languages: ['English'],
    yearsExperience: 6,
    hourlyRate: 21.5,
    profileScore: 0.82,
    locationIndex: 5,
    availabilityPattern: 1,
  },
  {
    name: 'Chloe Ramirez',
    email: 'chloe.ramirez@demo.eventon.dev',
    phone: '+447700900007',
    role: OrgRole.STAFF,
    title: 'Catering Captain',
    headline: 'Hospitality professional ensuring seamless service.',
    bio: 'ensures seamless food and beverage execution for weddings and galas.',
    skills: ['Catering Service', 'Bar Management', 'Health & Safety'],
    languages: ['English', 'Spanish'],
    yearsExperience: 7,
    hourlyRate: 22,
    profileScore: 0.87,
    locationIndex: 6,
    availabilityPattern: 2,
  },
  {
    name: 'Ethan Ward',
    email: 'ethan.ward@demo.eventon.dev',
    phone: '+447700900008',
    role: OrgRole.STAFF,
    title: 'Event Porter',
    headline: 'Reliable porter supporting quick equipment turnarounds.',
    bio: 'handles equipment moves and onsite logistics support.',
    skills: ['Manual Handling', 'Logistics', 'Health & Safety'],
    languages: ['English'],
    yearsExperience: 4,
    hourlyRate: 18,
    profileScore: 0.78,
    locationIndex: 7,
    availabilityPattern: 3,
  },
  {
    name: 'Ruby Allen',
    email: 'ruby.allen@demo.eventon.dev',
    phone: '+447700900009',
    role: OrgRole.STAFF,
    title: 'Brand Ambassador',
    headline: 'Engaging ambassador for experiential campaigns.',
    bio: 'engages audiences for experiential campaigns and product launches.',
    skills: ['Brand Activation', 'Public Speaking', 'Customer Engagement'],
    languages: ['English', 'German'],
    yearsExperience: 5,
    hourlyRate: 20.5,
    profileScore: 0.81,
    locationIndex: 8,
    availabilityPattern: 0,
  },
  {
    name: 'Mason Clarke',
    email: 'mason.clarke@demo.eventon.dev',
    phone: '+447700900010',
    role: OrgRole.STAFF,
    title: 'Security Steward',
    headline: 'SIA-qualified steward for large public venues.',
    bio: 'provides safety oversight and calm crowd management at scale.',
    skills: ['Security', 'Crowd Management', 'First Aid'],
    languages: ['English'],
    yearsExperience: 6,
    hourlyRate: 19,
    profileScore: 0.8,
    locationIndex: 9,
    availabilityPattern: 1,
  },
  {
    name: 'Isla Murphy',
    email: 'isla.murphy@demo.eventon.dev',
    phone: '+447700900011',
    role: OrgRole.STAFF,
    title: 'Event Stylist',
    headline: 'Creative stylist aligning spaces with brand vision.',
    bio: 'designs visual environments and ensures brand alignment onsite.',
    skills: ['Styling', 'Set Dressing', 'Floral Design'],
    languages: ['English'],
    yearsExperience: 7,
    hourlyRate: 21,
    profileScore: 0.84,
    locationIndex: 0,
    availabilityPattern: 2,
  },
  {
    name: 'Leo Graham',
    email: 'leo.graham@demo.eventon.dev',
    phone: '+447700900012',
    role: OrgRole.STAFF,
    title: 'Stagehand',
    headline: 'Experienced stagehand supporting touring productions.',
    bio: 'supports touring productions with rigging and backstage coordination.',
    skills: ['Rigging', 'Stage Management', 'Lighting'],
    languages: ['English'],
    yearsExperience: 6,
    hourlyRate: 18,
    profileScore: 0.79,
    locationIndex: 1,
    availabilityPattern: 3,
  },
  {
    name: 'Poppy Edwards',
    email: 'poppy.edwards@demo.eventon.dev',
    phone: '+447700900013',
    role: OrgRole.STAFF,
    title: 'Registration Lead',
    headline: 'Registration expert for conferences and expos.',
    bio: 'runs efficient check-in processes for conferences and expos.',
    skills: ['Registration', 'Customer Service', 'Data Entry'],
    languages: ['English', 'French'],
    yearsExperience: 4,
    hourlyRate: 19,
    profileScore: 0.8,
    locationIndex: 2,
    availabilityPattern: 0,
  },
  {
    name: 'Alfie Shah',
    email: 'alfie.shah@demo.eventon.dev',
    phone: '+447700900014',
    role: OrgRole.STAFF,
    title: 'Lighting Designer',
    headline: 'Lighting designer crafting dynamic show atmospheres.',
    bio: 'programs lighting plots and ensures dynamic show atmospheres.',
    skills: ['Lighting Design', 'DMX Programming', 'Stagecraft'],
    languages: ['English'],
    yearsExperience: 8,
    hourlyRate: 22,
    profileScore: 0.88,
    locationIndex: 3,
    availabilityPattern: 1,
  },
  {
    name: 'Freya Collins',
    email: 'freya.collins@demo.eventon.dev',
    phone: '+447700900015',
    role: OrgRole.STAFF,
    title: 'Hospitality Supervisor',
    headline: 'Hospitality supervisor for premium guest journeys.',
    bio: 'leads hospitality teams delivering premium guest service standards.',
    skills: ['Hospitality', 'Team Leadership', 'Training'],
    languages: ['English', 'Italian'],
    yearsExperience: 7,
    hourlyRate: 20,
    profileScore: 0.86,
    locationIndex: 4,
    availabilityPattern: 2,
  },
  {
    name: 'Harvey Nolan',
    email: 'harvey.nolan@demo.eventon.dev',
    phone: '+447700900016',
    role: OrgRole.STAFF,
    title: 'Production Assistant',
    headline: 'Production assistant supporting schedule execution.',
    bio: 'supports producers with schedules and on-the-day coordination.',
    skills: ['Scheduling', 'Vendor Coordination', 'Production Support'],
    languages: ['English'],
    yearsExperience: 5,
    hourlyRate: 19,
    profileScore: 0.82,
    locationIndex: 5,
    availabilityPattern: 3,
  },
  {
    name: 'Imogen Hart',
    email: 'imogen.hart@demo.eventon.dev',
    phone: '+447700900017',
    role: OrgRole.STAFF,
    title: 'Talent Wrangler',
    headline: 'Talent wrangler coordinating performers and speakers.',
    bio: 'coordinates performers and speakers ensuring smooth stage transitions.',
    skills: ['Talent Management', 'Backstage Coordination', 'Communication'],
    languages: ['English'],
    yearsExperience: 6,
    hourlyRate: 21,
    profileScore: 0.85,
    locationIndex: 6,
    availabilityPattern: 0,
  },
  {
    name: 'Reuben Scott',
    email: 'reuben.scott@demo.eventon.dev',
    phone: '+447700900018',
    role: OrgRole.STAFF,
    title: 'Logistics Runner',
    headline: 'Logistics runner managing urgent venue requests.',
    bio: 'manages deliveries and last-minute tasks across venues.',
    skills: ['Logistics', 'Driving', 'Problem Solving'],
    languages: ['English'],
    yearsExperience: 4,
    hourlyRate: 18,
    profileScore: 0.77,
    locationIndex: 7,
    availabilityPattern: 1,
  },
  {
    name: 'Eliza Brooks',
    email: 'eliza.brooks@demo.eventon.dev',
    phone: '+447700900019',
    role: OrgRole.STAFF,
    title: 'Bar Manager',
    headline: 'Bar manager delivering premium beverage service.',
    bio: 'oversees beverage programs and compliance for pop-up bars.',
    skills: ['Bar Management', 'Cocktail Service', 'Inventory'],
    languages: ['English'],
    yearsExperience: 7,
    hourlyRate: 22.5,
    profileScore: 0.86,
    locationIndex: 8,
    availabilityPattern: 2,
  },
  {
    name: 'Callum Wade',
    email: 'callum.wade@demo.eventon.dev',
    phone: '+447700900020',
    role: OrgRole.STAFF,
    title: 'Event Technician',
    headline: 'Technical generalist covering mid-size productions.',
    bio: 'covers lighting, sound, and staging for mid-size events.',
    skills: ['Audio Visual', 'Troubleshooting', 'Stagehand'],
    languages: ['English'],
    yearsExperience: 5,
    hourlyRate: 18,
    profileScore: 0.8,
    locationIndex: 9,
    availabilityPattern: 3,
  },
];

const JOB_SEED_DATA: JobSeedDefinition[] = [
  {
    title: 'City Gala Production',
    description:
      'Three-day corporate gala at a Thames-side venue requiring setup, guest services, and evening support.',
    tags: ['corporate', 'gala', 'logistics', 'front-of-house'],
    location: 'Riverbank Pavilion, London',
    remote: false,
    budget: 9800,
    shiftTemplates: [
      {
        title: 'Venue Setup Crew',
        dayOffset: 0,
        startHour: 10,
        durationHours: 6,
        requiredStaff: 4,
        notes: 'Load-in, staging, and vendor coordination.',
      },
      {
        title: 'Registration & Guest Services',
        dayOffset: 1,
        startHour: 14,
        durationHours: 6,
        requiredStaff: 3,
        notes: 'Guest welcome desk and concierge coverage.',
      },
      {
        title: 'Evening Gala Support',
        dayOffset: 1,
        startHour: 17,
        durationHours: 7,
        requiredStaff: 5,
        notes: 'Dinner service, bar coordination, and VIP liaison.',
      },
      {
        title: 'Breakdown & Load-Out',
        dayOffset: 2,
        startHour: 8,
        durationHours: 5,
        requiredStaff: 4,
        notes: 'Equipment strike and logistics wrap-up.',
      },
    ],
  },
  {
    title: 'Surrey Wedding Weekend',
    description:
      'Outdoor marquee wedding in Surrey requiring hospitality, AV support, and day-of coordination across two days.',
    tags: ['wedding', 'surrey', 'hospitality', 'av'],
    location: 'Loseley Park, Guildford',
    remote: false,
    budget: 7200,
    shiftTemplates: [
      {
        title: 'Marquee Setup Team',
        dayOffset: 4,
        startHour: 7,
        durationHours: 7,
        requiredStaff: 4,
        notes: 'Tent rigging, decor placement, and supplier management.',
      },
      {
        title: 'Ceremony Coordination',
        dayOffset: 5,
        startHour: 11,
        durationHours: 6,
        requiredStaff: 3,
        notes: 'Guest ushering, ceremony timing, and vendor liaison.',
      },
      {
        title: 'Reception Hospitality',
        dayOffset: 5,
        startHour: 15,
        durationHours: 7,
        requiredStaff: 5,
        notes: 'Dinner service, bar management, and dancefloor support.',
      },
    ],
  },
];

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function buildBio(baseBio: string, location: LocationPoint): string {
  return `Based near ${location.area} (${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}), ${baseBio}`;
}

function getUpcomingMonday(date = new Date()): Date {
  const result = new Date(date);
  const day = result.getDay();
  let diff = (1 + 7 - day) % 7;
  if (diff === 0) {
    diff = 7;
  }
  result.setDate(result.getDate() + diff);
  result.setHours(8, 0, 0, 0);
  return result;
}

function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateEmbedding(text: string, dimensions = 1536): number[] {
  const hash = crypto.createHash('sha256').update(text).digest();
  let seed = 0;
  for (let i = 0; i <= hash.length - 4; i += 4) {
    seed ^= hash.readUInt32LE(i);
  }
  if (seed === 0) {
    seed = 0x12345678;
  }
  const random = mulberry32(seed >>> 0);
  const vector: number[] = [];
  for (let i = 0; i < dimensions; i += 1) {
    const value = random() * 2 - 1;
    vector.push(Number(value.toFixed(6)));
  }
  return vector;
}

function embeddingToSqlLiteral(vector: number[]): Prisma.Sql {
  const vectorLiteral = `[${vector.map((value) => value.toFixed(6)).join(',')}]`;
  return Prisma.raw(`'${vectorLiteral}'::vector`);
}

type EmbeddingUpsertInput = {
  source: EmbeddingSource;
  entityId: string;
  text: string;
  staffProfileId?: string;
  jobId?: string;
  shiftId?: string;
  clientId?: string;
};

async function upsertEmbedding({
  source,
  entityId,
  text,
  staffProfileId,
  jobId,
  shiftId,
  clientId,
}: EmbeddingUpsertInput): Promise<void> {
  const vector = generateEmbedding(text);
  const vectorSql = embeddingToSqlLiteral(vector);

  await prisma.$executeRaw(
    Prisma.sql`
      INSERT INTO "Embedding" ("source", "entityId", "vector", "staffProfileId", "jobId", "shiftId", "clientId")
      VALUES (${source}, ${entityId}, ${vectorSql}, ${staffProfileId ?? null}, ${jobId ?? null}, ${shiftId ?? null}, ${clientId ?? null})
      ON CONFLICT ("source", "entityId") DO UPDATE
      SET "vector" = EXCLUDED."vector",
          "staffProfileId" = EXCLUDED."staffProfileId",
          "jobId" = EXCLUDED."jobId",
          "shiftId" = EXCLUDED."shiftId",
          "clientId" = EXCLUDED."clientId",
          "updatedAt" = ${Prisma.raw('NOW()')};
    `,
  );
}
async function seedUsers(): Promise<{ admin: SeededCredential; staff: SeededStaff[] }> {
  await prisma.user.upsert({
    where: { email: 'founder@eventon.dev' },
    update: {},
    create: {
      email: 'founder@eventon.dev',
      name: 'EventOn Founder',
    },
  });

  const adminPassword = 'demo-admin-pass';
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@londonevents.dev' },
    update: {
      name: 'London Events Admin',
      phone: '+447700900000',
    },
    create: {
      email: 'admin@londonevents.dev',
      name: 'London Events Admin',
      phone: '+447700900000',
    },
  });

  const staff: SeededStaff[] = [];
  for (let index = 0; index < STAFF_SEED_DATA.length; index += 1) {
    const seed = STAFF_SEED_DATA[index];
    const password = `demo-${toSlug(seed.name)}-pass`;
    const user = await prisma.user.upsert({
      where: { email: seed.email },
      update: {
        name: seed.name,
        phone: seed.phone,
      },
      create: {
        email: seed.email,
        name: seed.name,
        phone: seed.phone,
      },
    });

    staff.push({ user, password, seed });
  }

  return {
    admin: {
      user: adminUser,
      password: adminPassword,
    },
    staff,
  };
}

async function seedOrganisation(adminUser: User): Promise<Organisation> {
  const slug = 'london-event-specialists';
  const description =
    'Demo organisation representing a London-based events agency focused on corporate functions and premium hospitality.';
  const existing = await prisma.organisation.findUnique({ where: { slug } });

  let organisation: Organisation;
  if (existing) {
    organisation = await prisma.organisation.update({
      where: { id: existing.id },
      data: {
        name: 'London Event Specialists',
        description,
        industry: 'Events Services',
        timezone: 'Europe/London',
        ownerId: adminUser.id,
        updatedById: adminUser.id,
      },
    });
  } else {
    organisation = await prisma.organisation.create({
      data: {
        name: 'London Event Specialists',
        slug,
        description,
        industry: 'Events Services',
        timezone: 'Europe/London',
        ownerId: adminUser.id,
        createdById: adminUser.id,
      },
    });
  }

  const now = new Date();

  await prisma.orgMember.upsert({
    where: {
      organisationId_userId: {
        organisationId: organisation.id,
        userId: adminUser.id,
      },
    },
    update: {
      role: OrgRole.OWNER,
      status: MemberStatus.ACTIVE,
      title: 'Administrator',
      joinedAt: now,
      invitedAt: now,
      updatedById: adminUser.id,
    },
    create: {
      organisationId: organisation.id,
      userId: adminUser.id,
      role: OrgRole.OWNER,
      status: MemberStatus.ACTIVE,
      title: 'Administrator',
      invitedAt: now,
      joinedAt: now,
      createdById: adminUser.id,
    },
  });

  await prisma.featureWeights.upsert({
    where: { organisationId: organisation.id },
    update: {
      skillsWeight: 1.25,
      availabilityWeight: 1.1,
      certificationWeight: 0.9,
      distanceWeight: 1.05,
      updatedById: adminUser.id,
    },
    create: {
      organisationId: organisation.id,
      skillsWeight: 1.25,
      availabilityWeight: 1.1,
      certificationWeight: 0.9,
      distanceWeight: 1.05,
      performanceWeight: 1,
      customWeights: { emphasis: 'skills' },
      createdById: adminUser.id,
    },
  });

  return organisation;
}
async function seedClients(organisation: Organisation, adminUser: User): Promise<Client> {
  const clientName = 'Thames Financial Group';
  const existing = await prisma.client.findFirst({
    where: { organisationId: organisation.id, name: clientName },
  });

  let client: Client;
  if (existing) {
    client = await prisma.client.update({
      where: { id: existing.id },
      data: {
        email: 'events@thamesfinancial.co.uk',
        phone: '+442071234567',
        location: 'Canary Wharf, London',
        status: existing.status,
        notes: 'Corporate finance client hosting annual stakeholder events.',
        updatedById: adminUser.id,
      },
    });
  } else {
    client = await prisma.client.create({
      data: {
        organisationId: organisation.id,
        name: clientName,
        email: 'events@thamesfinancial.co.uk',
        phone: '+442071234567',
        location: 'Canary Wharf, London',
        status: 'ACTIVE',
        notes: 'Corporate finance client hosting annual stakeholder events.',
        createdById: adminUser.id,
      },
    });
  }

  const embeddingText = `${client.name} located at ${client.location}. Notes: ${client.notes ?? ''}`;
  await upsertEmbedding({
    source: EmbeddingSource.CLIENT,
    entityId: client.id,
    clientId: client.id,
    text: embeddingText,
  });

  return client;
}
async function seedStaffProfiles(
  organisation: Organisation,
  staffMembers: SeededStaff[],
): Promise<StaffProfile[]> {
  const monday = getUpcomingMonday();
  const profiles: StaffProfile[] = [];

  for (const staffMember of staffMembers) {
    const location = LOCATION_OPTIONS[staffMember.seed.locationIndex % LOCATION_OPTIONS.length];
    const preferredLocations = [
      `${location.area} (${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)})`,
      'Greater London',
      'Surrey',
    ];

    const now = new Date();
    const orgMember = await prisma.orgMember.upsert({
      where: {
        organisationId_userId: {
          organisationId: organisation.id,
          userId: staffMember.user.id,
        },
      },
      update: {
        role: staffMember.seed.role,
        status: MemberStatus.ACTIVE,
        title: staffMember.seed.title,
        joinedAt: now,
        updatedById: staffMember.user.id,
      },
      create: {
        organisationId: organisation.id,
        userId: staffMember.user.id,
        role: staffMember.seed.role,
        status: MemberStatus.ACTIVE,
        title: staffMember.seed.title,
        invitedAt: now,
        joinedAt: now,
        createdById: staffMember.user.id,
      },
    });

    const bio = buildBio(staffMember.seed.bio, location);

    const profile = await prisma.staffProfile.upsert({
      where: {
        organisationId_userId: {
          organisationId: organisation.id,
          userId: staffMember.user.id,
        },
      },
      update: {
        headline: staffMember.seed.headline,
        bio,
        skills: staffMember.seed.skills,
        yearsExperience: staffMember.seed.yearsExperience,
        hourlyRate: new Prisma.Decimal(staffMember.seed.hourlyRate),
        preferredLocations,
        languages: staffMember.seed.languages,
        profileScore: staffMember.seed.profileScore,
        orgMemberId: orgMember.id,
      },
      create: {
        organisationId: organisation.id,
        userId: staffMember.user.id,
        orgMemberId: orgMember.id,
        headline: staffMember.seed.headline,
        bio,
        skills: staffMember.seed.skills,
        yearsExperience: staffMember.seed.yearsExperience,
        hourlyRate: new Prisma.Decimal(staffMember.seed.hourlyRate),
        preferredLocations,
        languages: staffMember.seed.languages,
        profileScore: staffMember.seed.profileScore,
      },
    });

    profiles.push(profile);

    await prisma.availability.deleteMany({ where: { staffProfileId: profile.id } });

    const pattern = AVAILABILITY_PATTERNS[staffMember.seed.availabilityPattern % AVAILABILITY_PATTERNS.length];
    const availabilityData = pattern.map((slot) => {
      const start = new Date(monday);
      start.setDate(start.getDate() + slot.dayOffset);
      start.setHours(slot.startHour, 0, 0, 0);
      const end = new Date(start);
      end.setHours(end.getHours() + slot.durationHours);
      return {
        staffProfileId: profile.id,
        type: AvailabilityType.AVAILABLE,
        startTime: start,
        endTime: end,
        timezone: 'Europe/London',
        notes: `${slot.notes} Focus area: ${location.area}.`,
        createdById: staffMember.user.id,
      };
    });

    if (availabilityData.length > 0) {
      await prisma.availability.createMany({ data: availabilityData });
    }

    const embeddingText = `${staffMember.seed.headline} ${staffMember.seed.bio} Located near ${location.area} (${location.latitude.toFixed(
      4,
    )}, ${location.longitude.toFixed(4)}). Skills: ${staffMember.seed.skills.join(', ')}. Languages: ${staffMember.seed.languages.join(
      ', ',
    )}.`;

    await upsertEmbedding({
      source: EmbeddingSource.STAFF_PROFILE,
      entityId: profile.id,
      staffProfileId: profile.id,
      text: embeddingText,
    });
  }

  return profiles;
}
async function seedScheduling(
  organisation: Organisation,
  adminUser: User,
  client: Client,
): Promise<void> {
  const monday = getUpcomingMonday();

  for (const jobSeed of JOB_SEED_DATA) {
    let job = await prisma.job.findFirst({
      where: { organisationId: organisation.id, title: jobSeed.title },
    });

    if (job) {
      job = await prisma.job.update({
        where: { id: job.id },
        data: {
          description: jobSeed.description,
          status: JobStatus.OPEN,
          location: jobSeed.location,
          remote: jobSeed.remote,
          budget: new Prisma.Decimal(jobSeed.budget),
          tags: jobSeed.tags,
          clientId: client.id,
          updatedById: adminUser.id,
        },
      });
    } else {
      job = await prisma.job.create({
        data: {
          organisationId: organisation.id,
          clientId: client.id,
          title: jobSeed.title,
          description: jobSeed.description,
          status: JobStatus.OPEN,
          location: jobSeed.location,
          remote: jobSeed.remote,
          budget: new Prisma.Decimal(jobSeed.budget),
          tags: jobSeed.tags,
          createdById: adminUser.id,
        },
      });
    }

    await prisma.shift.deleteMany({ where: { jobId: job.id } });

    const createdShifts: Shift[] = [];
    for (const shiftSeed of jobSeed.shiftTemplates) {
      const start = new Date(monday);
      start.setDate(start.getDate() + shiftSeed.dayOffset);
      start.setHours(shiftSeed.startHour, 0, 0, 0);
      const end = new Date(start);
      end.setHours(end.getHours() + shiftSeed.durationHours);

      const shift = await prisma.shift.create({
        data: {
          jobId: job.id,
          title: shiftSeed.title,
          startTime: start,
          endTime: end,
          timezone: 'Europe/London',
          status: ShiftStatus.OPEN,
          requiredStaff: shiftSeed.requiredStaff,
          notes: shiftSeed.notes,
          createdById: adminUser.id,
        },
      });

      createdShifts.push(shift);

      const shiftEmbeddingText = `${shift.title ?? job.title} for ${job.title} at ${job.location}. Requires ${shift.requiredStaff} staff. Notes: ${
        shift.notes ?? ''
      }`;
      await upsertEmbedding({
        source: EmbeddingSource.SHIFT,
        entityId: shift.id,
        shiftId: shift.id,
        jobId: job.id,
        text: shiftEmbeddingText,
      });
    }

    if (createdShifts.length > 0) {
      const earliestStart = createdShifts.reduce(
        (earliest, current) => (current.startTime < earliest ? current.startTime : earliest),
        createdShifts[0].startTime,
      );
      const latestEnd = createdShifts.reduce(
        (latest, current) => (current.endTime > latest ? current.endTime : latest),
        createdShifts[0].endTime,
      );

      job = await prisma.job.update({
        where: { id: job.id },
        data: {
          startsAt: earliestStart,
          endsAt: latestEnd,
        },
      });
    }

    const jobEmbeddingText = `${job.title} located at ${job.location}. ${job.description} Tags: ${(job.tags ?? []).join(', ')}`;
    await upsertEmbedding({
      source: EmbeddingSource.JOB,
      entityId: job.id,
      jobId: job.id,
      text: jobEmbeddingText,
    });
  }
}
async function seedCompliance(
  organisation: Organisation,
  adminUser: User,
  staffProfiles: StaffProfile[],
): Promise<void> {
  await prisma.retentionPolicy.upsert({
    where: {
      organisationId_dataCategory: {
        organisationId: organisation.id,
        dataCategory: 'staff_profile',
      },
    },
    update: {
      description: 'Retain staff profile data for 24 months before anonymisation.',
      retentionPeriodDays: 730,
      enforcementAction: 'Anonymise personal data after retention period.',
      updatedById: adminUser.id,
    },
    create: {
      organisationId: organisation.id,
      dataCategory: 'staff_profile',
      description: 'Retain staff profile data for 24 months before anonymisation.',
      retentionPeriodDays: 730,
      enforcementAction: 'Anonymise personal data after retention period.',
      createdById: adminUser.id,
    },
  });

  const existingConsent = await prisma.consent.findFirst({
    where: {
      organisationId: organisation.id,
      userId: adminUser.id,
      scope: ConsentScope.DATA_PROCESSING,
    },
  });

  if (!existingConsent) {
    await prisma.consent.create({
      data: {
        organisationId: organisation.id,
        userId: adminUser.id,
        subjectIdentifier: adminUser.email,
        scope: ConsentScope.DATA_PROCESSING,
        metadata: { source: 'seed-script' },
        createdById: adminUser.id,
      },
    });
  }

  if (staffProfiles.length > 0) {
    const primaryProfile = staffProfiles[0];
    const staffUser = await prisma.user.findUnique({ where: { id: primaryProfile.userId } });
    if (staffUser) {
      const existingRequest = await prisma.dsrRequest.findFirst({
        where: {
          organisationId: organisation.id,
          subjectIdentifier: staffUser.email ?? staffUser.id,
          type: DsrType.ACCESS,
        },
      });

      if (!existingRequest) {
        await prisma.dsrRequest.create({
          data: {
            organisationId: organisation.id,
            userId: staffUser.id,
            subjectIdentifier: staffUser.email ?? staffUser.id,
            type: DsrType.ACCESS,
            status: DsrStatus.COMPLETED,
            notes: 'Seeded DSAR to demonstrate GDPR workflows.',
            metadata: { resolvedBy: adminUser.email },
            createdById: adminUser.id,
            updatedById: adminUser.id,
            completedAt: new Date(),
          },
        });
      }
    }
  }
}
async function main() {
  const { admin, staff } = await seedUsers();
  const organisation = await seedOrganisation(admin.user);
  const client = await seedClients(organisation, admin.user);
  const staffProfiles = await seedStaffProfiles(organisation, staff);
  await seedScheduling(organisation, admin.user, client);
  await seedCompliance(organisation, admin.user, staffProfiles);

  console.info('\nSeeded credentials:');
  console.info(`Admin: ${admin.user.email} / ${admin.password}`);
  if (staff.length > 0) {
    console.info(`Staff 1: ${staff[0].user.email} / ${staff[0].password}`);
  }
  if (staff.length > 1) {
    console.info(`Staff 2: ${staff[1].user.email} / ${staff[1].password}`);
  }
  console.info('Gate 3 done.');
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

