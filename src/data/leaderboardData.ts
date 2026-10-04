import { KarmaUser } from '../types';

export const LEADERBOARD_USERS: KarmaUser[] = [
  {
    id: 'user-1',
    name: 'Aarav Sharma',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    role: 'B.Tech 3rd Year, Computer Science',
    points: 920,
    itemsReturned: 11,
    streakDays: 16,
    badges: [
      {
        id: 'badge-sherlock',
        name: 'Campus Byomkesh',
        icon: '🔍',
        description: 'Successfully matched and returned 5+ valuable student devices',
        color: 'from-amber-500 to-orange-600',
      },
      {
        id: 'badge-eagle',
        name: 'Garuda Eye',
        icon: '🦅',
        description: 'Reported and safely secured unattended belongings within 15 minutes',
        color: 'from-blue-500 to-indigo-600',
      },
      {
        id: 'badge-pillar',
        name: 'Campus Mitra',
        icon: '🏛️',
        description: 'Crossed 900+ Good Samaritan Karma points across semesters',
        color: 'from-purple-500 to-pink-600',
      }
    ],
    recentActivity: [
      {
        id: 'act-1',
        action: 'Returned boAt Airdopes 441',
        itemTitle: 'Annapurna Canteen Nescafe counter',
        timeAgo: 'Just now',
        pointsEarned: 100,
      },
      {
        id: 'act-2',
        action: 'Handed over Institute ID & Metro Card',
        itemTitle: 'Main Gate Proctor Office',
        timeAgo: 'Yesterday',
        pointsEarned: 50,
      },
      {
        id: 'act-3',
        action: 'Reported Unclaimed Milton Bottle',
        itemTitle: 'Gymkhana Sports Pavilion',
        timeAgo: '2 days ago',
        pointsEarned: 30,
      }
    ],
  },
  {
    id: 'user-2',
    name: 'Priya Patel',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    role: 'M.Tech 2nd Year, Hostel Prefect',
    points: 740,
    itemsReturned: 8,
    streakDays: 10,
    badges: [
      {
        id: 'badge-badger',
        name: 'Imandar Citizen',
        icon: '🌟',
        description: 'Safely deposited high-value electronics and wallets without delay',
        color: 'from-emerald-500 to-teal-600',
      },
      {
        id: 'badge-retriever',
        name: 'Hostel Guardian',
        icon: '🛡️',
        description: 'Recovered room keys and cycle locks across residential blocks',
        color: 'from-yellow-400 to-amber-500',
      }
    ],
    recentActivity: [
      {
        id: 'act-4',
        action: 'Secured Milton 750ml Thermosteel',
        itemTitle: 'Badminton Court 1',
        timeAgo: '5 hours ago',
        pointsEarned: 50,
      },
      {
        id: 'act-5',
        action: 'Reconnected Honda Activa Key Set',
        itemTitle: 'Aryabhatta Cycle Stand',
        timeAgo: '3 days ago',
        pointsEarned: 75,
      }
    ],
  },
  {
    id: 'user-3',
    name: 'Prof. R. Krishnamurthy',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    role: 'Faculty Advisor & Dean of Student Affairs',
    points: 560,
    itemsReturned: 5,
    streakDays: 7,
    badges: [
      {
        id: 'badge-mentor',
        name: 'Guru Guardian',
        icon: '🎓',
        description: 'Safeguarded scientific calculators, assignment sheets & lab records',
        color: 'from-cyan-500 to-blue-600',
      }
    ],
    recentActivity: [
      {
        id: 'act-6',
        action: 'Safely returned Casio fx-991CW',
        itemTitle: 'Lecture Hall Complex LH-101',
        timeAgo: '1 day ago',
        pointsEarned: 100,
      }
    ],
  },
  {
    id: 'user-4',
    name: 'Security Officer Ramesh Yadav',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    role: 'Head Security Inspector, Proctor Cell',
    points: 490,
    itemsReturned: 6,
    streakDays: 14,
    badges: [
      {
        id: 'badge-fast',
        name: 'Tez Guard',
        icon: '⚡',
        description: 'Logged and matched lost items within 10 minutes of drop-off',
        color: 'from-rose-500 to-red-600',
      }
    ],
    recentActivity: [
      {
        id: 'act-7',
        action: 'Logged Found College ID & Metro Pass',
        itemTitle: 'Main Gate 1 Security Counter',
        timeAgo: '30 mins ago',
        pointsEarned: 50,
      }
    ],
  }
];

export const SAFE_EXCHANGE_ZONES = [
  {
    title: 'Main Gate 1 — Security & Proctor Office',
    location: 'North Administrative Entrance, Security Control Booth',
    hours: '24/7 Monitored Safe Haven (CCTV Active)',
    features: ['Official security register & receipt', '24/7 guard on duty', 'High-security locker for laptops & phones'],
    recommendedFor: 'Laptops, mobile phones, wallets, cash & official ID cards',
    phone: '+91 94112 00199',
  },
  {
    title: 'Students Activity Centre (SAC) Help Desk',
    location: 'Ground Floor Atrium, Beside Stationery Shop',
    hours: '8:30 AM – 9:30 PM Daily',
    features: ['Student Council coordinated', 'Centrally accessible meeting point', 'Immediate ID verification assistance'],
    recommendedFor: 'Backpacks, cycle keys, sports gear, earphones',
    phone: '+91 98450 71239',
  },
  {
    title: 'Dr. APJ Abdul Kalam Central Library Help Desk',
    location: 'Ground Floor Circulation & Check-in Counter',
    hours: '8:00 AM – Midnight',
    features: ['Biometric check gate', 'Quiet monitored exchange area', 'Librarian on duty'],
    recommendedFor: 'Scientific calculators, textbooks, notebooks, tablets',
    phone: '+91 98410 01234',
  }
];
