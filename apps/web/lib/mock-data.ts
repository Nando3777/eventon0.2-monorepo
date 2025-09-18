import {
  AssignmentStatus,
  AvailabilityType,
  ClientStatus,
  JobStatus,
  MemberStatus,
  ShiftStatus,
} from '@eventon/db/enums';

export interface DemoJob {
  id: string;
  title: string;
  status: JobStatus;
  client: string;
  location: string;
  startDate: string;
  budget: string;
  aiMatchScore: number;
  summary: string;
  aiRankings: Array<{ name: string; role: string; score: number; notes: string }>;
}

export const demoJobs: DemoJob[] = [
  {
    id: 'summer-gala',
    title: 'Summer Gala 2024',
    status: JobStatus.OPEN,
    client: 'Aurora Events',
    location: 'London, UK',
    startDate: '2024-06-12',
    budget: '£48,000',
    aiMatchScore: 87,
    summary:
      'High-profile corporate gala requiring bar leads, hosts, and VIP support teams with multilingual capability.',
    aiRankings: [
      { name: 'Ruby Carter', role: 'Event Host', score: 94, notes: 'Fluent in French and Spanish; 25 prior gala shifts.' },
      { name: 'Noah Patel', role: 'Bar Lead', score: 91, notes: 'Cocktail specialist with Level 3 food safety.' },
      { name: 'Mia Hernandez', role: 'VIP Liaison', score: 88, notes: 'Rated 4.9/5 by premium clients.' },
    ],
  },
  {
    id: 'tech-expo',
    title: 'Future Tech Expo',
    status: JobStatus.IN_PROGRESS,
    client: 'Bluebird Productions',
    location: 'Berlin, Germany',
    startDate: '2024-03-27',
    budget: '€65,000',
    aiMatchScore: 82,
    summary: 'Hands-on product specialists and demo staff to support interactive expo stands.',
    aiRankings: [
      { name: 'Elias Novak', role: 'Product Specialist', score: 90, notes: 'Native German speaker with tech background.' },
      { name: 'Harper Lee', role: 'Experience Host', score: 86, notes: 'Exceptional visitor feedback at 2023 expo.' },
      { name: 'Leo Martins', role: 'Operations Runner', score: 83, notes: 'Logistics certified with driving license.' },
    ],
  },
  {
    id: 'fashion-week',
    title: 'Fashion Week Showcase',
    status: JobStatus.DRAFT,
    client: 'Lumen Collective',
    location: 'Milan, Italy',
    startDate: '2024-09-05',
    budget: '€120,000',
    aiMatchScore: 75,
    summary: 'Premium hosts, backstage runners, and styling assistants for international fashion shows.',
    aiRankings: [
      { name: 'Ava Conti', role: 'Backstage Runner', score: 84, notes: 'Fluent Italian speaker with runway experience.' },
      { name: 'James Cole', role: 'Hospitality Lead', score: 79, notes: 'Managed luxury fashion receptions worldwide.' },
      { name: 'Mira Solis', role: 'Styling Assistant', score: 76, notes: 'Strong portfolio with couture houses.' },
    ],
  },
];

export function getJobById(jobId: string) {
  return demoJobs.find((job) => job.id === jobId);
}

export interface DemoStaffMember {
  id: string;
  name: string;
  role: string;
  status: MemberStatus;
  rating: number;
  recentAssignments: number;
  skills: string[];
}

export const demoStaff: DemoStaffMember[] = [
  {
    id: 'staff-ruby',
    name: 'Ruby Carter',
    role: 'Event Host',
    status: MemberStatus.ACTIVE,
    rating: 4.9,
    recentAssignments: 12,
    skills: ['Multilingual', 'Leadership', 'VIP Protocol'],
  },
  {
    id: 'staff-noah',
    name: 'Noah Patel',
    role: 'Bar Lead',
    status: MemberStatus.ACTIVE,
    rating: 4.8,
    recentAssignments: 18,
    skills: ['Mixology', 'Inventory', 'Food Safety'],
  },
  {
    id: 'staff-mia',
    name: 'Mia Hernandez',
    role: 'VIP Liaison',
    status: MemberStatus.INVITED,
    rating: 4.7,
    recentAssignments: 6,
    skills: ['Client Service', 'Crisis Management', 'Travel Logistics'],
  },
];

export interface DemoClient {
  id: string;
  name: string;
  location: string;
  status: ClientStatus;
  activeProjects: number;
}

export const demoClients: DemoClient[] = [
  { id: 'client-aurora', name: 'Aurora Events', location: 'London', status: ClientStatus.ACTIVE, activeProjects: 5 },
  { id: 'client-bluebird', name: 'Bluebird Productions', location: 'Berlin', status: ClientStatus.ACTIVE, activeProjects: 3 },
  { id: 'client-lumen', name: 'Lumen Collective', location: 'Milan', status: ClientStatus.INACTIVE, activeProjects: 1 },
];

export interface DemoShift {
  id: string;
  jobId: string;
  title: string;
  date: string;
  location: string;
  status: ShiftStatus;
  assignments: AssignmentStatus;
  notes: string;
}

export const demoShifts: DemoShift[] = [
  {
    id: 'shift-01',
    jobId: 'summer-gala',
    title: 'VIP Host Briefing',
    date: '2024-06-11T17:00:00Z',
    location: 'London HQ',
    status: ShiftStatus.PLANNED,
    assignments: AssignmentStatus.CONFIRMED,
    notes: 'On-site briefing with client leadership and hospitality team.',
  },
  {
    id: 'shift-02',
    jobId: 'tech-expo',
    title: 'Expo Floor Support',
    date: '2024-03-26T09:00:00Z',
    location: 'Berlin Messe',
    status: ShiftStatus.FILLED,
    assignments: AssignmentStatus.CONFIRMED,
    notes: 'Demo staff should arrive 90 minutes before gates open.',
  },
  {
    id: 'shift-03',
    jobId: 'summer-gala',
    title: 'Cocktail Service',
    date: '2024-06-12T18:00:00Z',
    location: 'Royal Exchange',
    status: ShiftStatus.OPEN,
    assignments: AssignmentStatus.PENDING,
    notes: 'Need 4 bartenders with craft cocktail experience.',
  },
];

export interface AvailabilityWindow {
  day: string;
  slots: Array<{ label: string; type: AvailabilityType }>;
}

export const demoAvailability: AvailabilityWindow[] = [
  {
    day: 'Monday',
    slots: [
      { label: 'Morning', type: AvailabilityType.AVAILABLE },
      { label: 'Afternoon', type: AvailabilityType.UNAVAILABLE },
      { label: 'Evening', type: AvailabilityType.AVAILABLE },
    ],
  },
  {
    day: 'Tuesday',
    slots: [
      { label: 'Morning', type: AvailabilityType.AVAILABLE },
      { label: 'Afternoon', type: AvailabilityType.AVAILABLE },
      { label: 'Evening', type: AvailabilityType.UNAVAILABLE },
    ],
  },
  {
    day: 'Wednesday',
    slots: [
      { label: 'Morning', type: AvailabilityType.UNAVAILABLE },
      { label: 'Afternoon', type: AvailabilityType.UNAVAILABLE },
      { label: 'Evening', type: AvailabilityType.AVAILABLE },
    ],
  },
  {
    day: 'Thursday',
    slots: [
      { label: 'Morning', type: AvailabilityType.AVAILABLE },
      { label: 'Afternoon', type: AvailabilityType.AVAILABLE },
      { label: 'Evening', type: AvailabilityType.AVAILABLE },
    ],
  },
  {
    day: 'Friday',
    slots: [
      { label: 'Morning', type: AvailabilityType.UNAVAILABLE },
      { label: 'Afternoon', type: AvailabilityType.AVAILABLE },
      { label: 'Evening', type: AvailabilityType.AVAILABLE },
    ],
  },
];
