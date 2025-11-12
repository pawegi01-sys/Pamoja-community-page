import type { PricingPlan, Member } from './types';

export const WHATSAPP_COMMUNITY_LINK = "https://chat.whatsapp.com/your-community-invite-code";

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'monthly',
    name: 'Monthly Access',
    price: 12000,
    duration: 'per month',
    description: 'Perfect for getting started and experiencing the Pamoja Community benefits.',
    features: [
      '10-minute video call with investors',
      'Weekly Google Meet conference',
      'Max loan limit of UGX 400,000',
      'Loan paid before membership expires',
    ],
  },
  {
    id: 'quarterly',
    name: '4-Month Deal',
    price: 29000,
    duration: 'for 4 months',
    description: 'A great value plan to immerse yourself in the network and build connections.',
    features: [
      '15-minute video call with investors',
      'Weekly Google Meet conference',
      'Max loan limit of UGX 800,000',
      'Loan paid 3 days before membership expires',
      'A community to network with investors',
    ],
    isPopular: true,
  },
  {
    id: 'yearly',
    name: 'Annual Pro',
    price: 93000,
    duration: 'per year',
    description: 'The best value for long-term commitment to your professional growth.',
    features: [
      '15-minute video call with investors',
      'Google Meet video conference',
      'Max loan limit of UGX 3,000,000',
      'Loan paid 1 month before membership expires',
      'Community of fellow members and investors',
      'Alerts about available online jobs',
      'Alerts about available jobs in your city',
      'Mentorship and coaching',
    ],
  },
];

export const MOCK_MEMBERS: Member[] = [
  {
    id: 1,
    telephoneNumber: '+256772123456',
    email: 'user1@example.com',
    planId: 'yearly',
    planName: 'Annual Pro',
    joinDate: '2023-10-01',
    expiryDate: '2024-10-01',
    status: 'Active',
  },
  {
    id: 2,
    telephoneNumber: '+256755987654',
    email: 'user2@example.com',
    planId: 'quarterly',
    planName: '4-Month Deal',
    joinDate: '2024-03-15',
    expiryDate: '2024-07-15',
    status: 'Active',
  },
  {
    id: 3,
    telephoneNumber: '+256789123789',
    email: 'user3@example.com',
    planId: 'monthly',
    planName: 'Monthly Access',
    joinDate: '2024-05-20',
    expiryDate: '2024-06-20',
    status: 'Active',
  },
  {
    id: 4,
    telephoneNumber: '+256701234567',
    email: 'user4@example.com',
    planId: 'yearly',
    planName: 'Annual Pro',
    joinDate: '2022-01-10',
    expiryDate: '2023-01-10',
    status: 'Expired',
  },
  {
    id: 5,
    telephoneNumber: '+256798765432',
    email: 'user5@example.com',
    planId: 'monthly',
    planName: 'Monthly Access',
    joinDate: '2024-04-30',
    expiryDate: '2024-05-30',
    status: 'Expired',
  },
];
