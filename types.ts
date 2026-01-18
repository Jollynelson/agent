
export enum PropertyType {
  Apartment = 'Apartment',
  SelfContained = 'Self-Contained',
  StudentHousing = 'Student Housing',
  ShortLet = 'Short-Let',
  FamilyHome = 'Family Home'
}

export enum ReviewerType {
  Tenant = 'Tenant',
  Landlord = 'Landlord'
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  reviewer: string;
  type: ReviewerType;
  date: string;
  propertyTitle?: string;
}

export interface Badge {
  id: string;
  label: string;
  icon: string;
  description: string;
  color: string;
}

export interface Listing {
  id: string;
  image: string;
  price: number;
  location: string;
  type: PropertyType;
  status: 'Available' | 'Leased';
  views: number;
  saves: number;
  shares: number;
  inquiries: number;
  conversion: number;
  datePosted: string; // ISO format
}

export interface AgentStats {
  activeListings: number;
  totalPosted: number;
  successfulRentals: number;
  profileViews: number;
  totalListingViews: number;
  avgRating: number;
  responseTime: string;
}

export interface AgentProfile {
  id: string;
  name: string;
  photo: string;
  title: string;
  coverage: string[];
  isVerified: boolean;
  bio: string;
  focusAreas: string[];
  experience: number;
  specializations: string[];
  lastActive: string;
  joined: string;
  badges: Badge[];
  stats: AgentStats;
  listings: Listing[];
  reviews: Review[];
}

export interface DashboardMetric {
  label: string;
  value: number | string;
  trend: number;
  period: string;
}
