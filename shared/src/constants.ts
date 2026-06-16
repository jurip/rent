export const PROPERTY_TYPES = ['apartment', 'house', 'condo', 'studio'] as const;

export const AMENITIES_LIST = [
  'parking',
  'gym',
  'pool',
  'pet-friendly',
  'furnished',
  'in-unit-laundry',
  'dishwasher',
  'air-conditioning',
  'balcony',
  'garden',
  'security',
  'elevator',
  'storage',
  'bike-storage',
  'concierge',
  'rooftop',
] as const;

export const BOOKING_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
};

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
] as const;

export const PAGE_SIZE_DEFAULT = 12;

export const MAX_IMAGES_PER_PROPERTY = 20;
export const MAX_IMAGE_SIZE_MB = 10;

export const PASSWORD_MIN_LENGTH = 8;
export const REVIEW_MIN_LENGTH = 10;
export const MAX_COMPARE_PROPERTIES = 3;
