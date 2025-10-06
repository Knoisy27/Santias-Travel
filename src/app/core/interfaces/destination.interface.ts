export interface Destination {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  country: string;
  continent: string;
  price: number;
  currency: string;
  duration: number; // días
  durationNights: number; // noches
  image: string;
  gallery: string[];
  highlights: string[];
  included: string[];
  notIncluded: string[];
  itinerary: ItineraryDay[];
  category: DestinationCategory;
  isGroupTravel: boolean;
  isCustomizable: boolean;
  maxCapacity: number;
  availability: boolean;
  departureDate?: Date;
  returnDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
  meals: MealType[];
  accommodation?: string;
}

export interface DestinationCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export enum MealType {
  BREAKFAST = 'desayuno',
  LUNCH = 'almuerzo',
  DINNER = 'cena'
}

export interface DestinationFilters {
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  minDuration?: number;
  maxDuration?: number;
  continents?: string[];
  countries?: string[];
  isGroupTravel?: boolean;
  isCustomizable?: boolean;
  availability?: boolean;
}
