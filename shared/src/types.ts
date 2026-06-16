// ---- Enums ----

export type UserRole = 'renter' | 'landlord';

export type PropertyType = 'apartment' | 'house' | 'condo' | 'studio';

export type ListingStatus = 'active' | 'inactive' | 'draft';

export type BookingStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled';

// ---- User ----

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: UserRole;
  avatarUrl: string | null;
  emailVerified: boolean;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  role: UserRole;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

// ---- Property ----

export interface PropertyImage {
  id: string;
  url: string;
  thumbnailUrl: string;
  order: number;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  propertyType: PropertyType;
  status: ListingStatus;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  yearBuilt: number | null;
  floorNumber: number | null;
  furnished: boolean;
  availableDate: string;
  address: string;
  city: string;
  neighborhood: string;
  latitude: number;
  longitude: number;
  amenities: string[];
  images: PropertyImage[];
  landlordId: string;
  landlord?: User;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyListResponse {
  properties: Property[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PropertyFilters {
  search?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: PropertyType[];
  minBedrooms?: number;
  minBathrooms?: number;
  amenities?: string[];
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'rating';
  page?: number;
  pageSize?: number;
}

export interface CreatePropertyRequest {
  title: string;
  description: string;
  price: number;
  propertyType: PropertyType;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  yearBuilt?: number;
  floorNumber?: number;
  furnished: boolean;
  availableDate: string;
  address: string;
  city: string;
  neighborhood: string;
  latitude: number;
  longitude: number;
  amenities: string[];
}

// ---- Booking ----

export interface BookingRequest {
  id: string;
  propertyId: string;
  property?: Property;
  renterId: string;
  renter?: User;
  landlordId: string;
  moveInDate: string;
  durationMonths: number;
  message: string;
  status: BookingStatus;
  responseMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingRequest {
  propertyId: string;
  moveInDate: string;
  durationMonths: number;
  message: string;
}

export interface UpdateBookingRequest {
  status: 'accepted' | 'rejected';
  responseMessage?: string;
}

// ---- Review ----

export interface Review {
  id: string;
  propertyId: string;
  renterId: string;
  renter?: User;
  rating: number;
  comment: string;
  landlordResponse: string | null;
  landlordResponseAt: string | null;
  edited: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewRequest {
  propertyId: string;
  rating: number;
  comment: string;
}

export interface LandlordResponseRequest {
  message: string;
}

// ---- Favorite ----

export interface Favorite {
  id: string;
  propertyId: string;
  property?: Property;
  userId: string;
  createdAt: string;
}

// ---- API Response wrapper ----

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}
