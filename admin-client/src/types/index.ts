export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  gender?: string;
  dateOfBirth?: string;
  role: "Admin" | "Manager" | "Staff" | "User";
  isEmailConfirmed: boolean;
  createdAt: string;
  lastLogin?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  country?: string;
}

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: "Male" | "Female" | "Other";
  address: string;
  city: string;
  postalCode: string;
  membershipStatus: "Active" | "Inactive" | "Suspended" | "Expired";
  joinDate: string;
  subscriptionId?: string;
  profileImage?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  notes?: string;
}

export interface Facility {
  id: string;
  name: string;
  description: string;
  city: string;
  address: string;
  postalCode: string;
  phone: string;
  email: string;
  status: "Open" | "Closed" | "ComingSoon" | "Renovating";
  openingHours: string;
  memberCount?: number;
  managerId?: string;
  managerName?: string;
  image?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  authorId: string;
  status: "Draft" | "Published" | "Archived";
  category: string;
  tags: string[];
  featuredImage?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  features: string[];
  isActive: boolean;
  createdAt: string;
}

export interface MemberSubscription {
  id: string;
  memberId: string;
  planId: string;
  startDate: string;
  endDate: string;
  status: "Active" | "Expired" | "Cancelled";
  paymentStatus: "Paid" | "Pending" | "Overdue";
}

export interface GymClass {
  id: string;
  name: string;
  description: string;
  instructorId: string;
  instructorName: string;
  facilityId?: string;
  facilityName?: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  capacity: number;
  enrolled: number;
  level: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  category: string;
  isActive: boolean;
  createdAt: string;
}

export interface ClassRegistration {
  id: string;
  classId: string;
  memberId: string;
  memberName: string;
  registeredAt: string;
  status: "Registered" | "Attended" | "NoShow" | "Cancelled";
}

export interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  totalSubscriptions: number;
  activeSubscriptions: number;
  totalFacilities: number;
  availableFacilities: number;
  totalBlogPosts: number;
  publishedPosts: number;
  totalClasses: number;
  activeClasses: number;
  recentMembers: Member[];
  recentPosts: BlogPost[];
}
