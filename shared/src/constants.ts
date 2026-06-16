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

export const PROPERTY_TYPE_LABELS: Record<string, string> = {
  apartment: 'Квартира',
  house: 'Дом',
  condo: 'Кондоминиум',
  studio: 'Студия',
};

export const AMENITY_LABELS: Record<string, string> = {
  parking: 'Парковка',
  gym: 'Тренажёрный зал',
  pool: 'Бассейн',
  'pet-friendly': 'Можно с животными',
  furnished: 'С мебелью',
  'in-unit-laundry': 'Стиральная машина',
  dishwasher: 'Посудомоечная машина',
  'air-conditioning': 'Кондиционер',
  balcony: 'Балкон',
  garden: 'Сад',
  security: 'Охрана',
  elevator: 'Лифт',
  storage: 'Кладовая',
  'bike-storage': 'Велосипедная парковка',
  concierge: 'Консьерж',
  rooftop: 'Терраса на крыше',
};

export const BOOKING_STATUS_LABELS: Record<string, string> = {
  pending: 'Ожидание',
  accepted: 'Подтверждено',
  rejected: 'Отклонено',
  cancelled: 'Отменено',
};

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Новые' },
  { value: 'price_asc', label: 'Цена: по возрастанию' },
  { value: 'price_desc', label: 'Цена: по убыванию' },
  { value: 'rating', label: 'По рейтингу' },
] as const;

export const PAGE_SIZE_DEFAULT = 12;

export const MAX_IMAGES_PER_PROPERTY = 20;
export const MAX_IMAGE_SIZE_MB = 10;

export const PASSWORD_MIN_LENGTH = 8;
export const REVIEW_MIN_LENGTH = 10;
export const MAX_COMPARE_PROPERTIES = 3;
