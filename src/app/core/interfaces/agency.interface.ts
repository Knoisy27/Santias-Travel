export interface AgencyInfo {
  name: string;
  description: string;
  logo: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  country: string;
  socialMedia: SocialMedia;
  statistics: AgencyStatistics;
  certifications: Certification[];
}

export interface SocialMedia {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  tiktok?: string;
}

export interface AgencyStatistics {
  yearsOfExperience: number;
  destinationsAvailable: number;
  happyClients: number;
  tripsCompleted: number;
}

export interface Certification {
  id: string;
  name: string;
  description: string;
  icon: string;
  validUntil?: Date;
}

export interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  message: string;
  destinationId?: string;
  preferredContactMethod: ContactMethod;
}

export enum ContactMethod {
  EMAIL = 'email',
  PHONE = 'telefono',
  WHATSAPP = 'whatsapp'
}

export interface NewsletterSubscription {
  email: string;
  preferences?: string[];
  acceptsTerms: boolean;
}
