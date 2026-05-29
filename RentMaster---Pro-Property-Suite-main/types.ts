
export enum UserRole {
  ADMIN = 'ADMIN',
  OWNER = 'OWNER',
  MANAGER = 'MANAGER',
  TENANT = 'TENANT'
}

export enum PropertyType {
  HOTEL = 'Hotel',
  HOSTEL = 'Hostel',
  PG = 'PG',
  APARTMENT = 'Apartment',
  HOME = 'Home',
  FLAT = 'Flat'
}

export interface Amenity {
  id: string;
  name: string;
  icon: string;
}

export interface Room {
  id: string;
  number: string;
  type: string;
  capacity: number;
  availableBeds: number;
  pricePerMonth: number;
  isOccupied: boolean;
}

export interface Property {
  id: string;
  name: string;
  type: PropertyType;
  address: string;
  city: string;
  price: number;
  description: string;
  imageUrl: string;
  amenities: string[];
  ownerId: string;
  rooms?: Room[];
  rating: number;
  reviewsCount: number;
}

export interface Booking {
  id: string;
  propertyId: string;
  tenantId: string;
  checkIn: string;
  checkOut?: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  rentAmount: number;
}

export interface Complaint {
  id: string;
  propertyId: string;
  tenantId: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'resolved';
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}
