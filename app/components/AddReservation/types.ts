import type { ReactNode } from 'react';

export interface Step {
  name: string;
  icon: ReactNode;
  hasPage: boolean;
  fields: string[];
  step: number;
}

export interface ReservationData {
  // Client Info
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;

  // Date and Time
  date?: Date;
  time?: string;

  // Party Details
  partySize?: number;
  seatingPreference?: 'indoor' | 'outdoor' | 'bar';

  // Special Requirements
  accessibility?: boolean;
  dietaryRestrictions?: string[];
  specialRequests?: string;

  // Terms
  termsAccepted?: boolean;
}

export interface StepProps {
  data?: Partial<ReservationData>;
  onSubmit?: (data: Partial<ReservationData>) => void;
}

export interface ClientData {
  fullName: string;
  phone: string;
  email: string;
  birthday: string;
  address?: string;
  membership?: string;
}
