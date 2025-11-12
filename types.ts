export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}

export interface Member {
  id: number;
  telephoneNumber: string;
  email: string;
  planId: 'monthly' | 'quarterly' | 'yearly';
  planName: string;
  joinDate: string;
  expiryDate: string;
  status: 'Active' | 'Expired';
}
