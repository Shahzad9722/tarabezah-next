import { z } from 'zod';

export const addGuestSchema = z.object({
  name: z.string().min(1, { message: 'Client name is required' }),
  phone: z.string().min(1, { message: 'Client phone is required' }),
  email: z.string().optional(),
  birthday: z.string().optional(),
  sources: z.array(z.number()).optional(),
  tags: z.array(z.number()).optional(),
  clientNotes: z.string().optional(),
});

export const addReservationFormSchema = z.object({
  clientId: z.string({ message: 'Please select guest first' }).min(1, { message: 'Please select guest first' }),
  eventDate: z.date().refine((date) => date >= new Date(new Date().setHours(0, 0, 0, 0)), {
    message: 'Date must be today or in the future',
  }),
  eventTime: z.string({ message: 'Please select time' }),
  numberOfGuests: z.number({ message: 'Please select number of guests' }),
  shiftId: z.string({ message: 'Shift is required' }),
  tags: z.array(z.number()).optional(),
  additionalNotes: z.string().optional(),
});
