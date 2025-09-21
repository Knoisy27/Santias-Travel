export interface Testimonial {
  id: string;
  clientName: string;
  clientCity: string;
  clientCountry: string;
  clientAvatar?: string;
  rating: number; // 1-5
  comment: string;
  destinationId: string;
  destinationName: string;
  travelDate: Date;
  images?: string[];
  isVerified: boolean;
  isHighlighted: boolean;
  createdAt: Date;
}

export interface TestimonialSummary {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    [key: number]: number; // rating: count
  };
}
