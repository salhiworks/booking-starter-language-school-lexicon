import type { DemoConfig } from './engine';
import { sitePreset } from '../lib/preset';

/**
 * The public Live Demo's sample business (`npm run dev:demo` / `npm run build:demo`).
 * Only demo builds read this file. Customizing the real website? Leave src/demo/ alone.
 * Sample notes are ordinary scheduling notes — a first name, a level, a goal; never anything sensitive.
 */
export const demoConfig: DemoConfig = {
  id: 'language-school-lexicon',
  preset: sitePreset,
  business: {
    name: 'Parole French Studio',
    timezone: 'America/Chicago',
    email: 'bonjour@parole-french.example',
    phone: '+1 504-555-0137',
    address: '2240 Chartres Street, second floor, New Orleans, LA 70117',
  },
  ownerEmail: 'owner@parole-french.example',
  referencePrefix: 'PA',
  sampleNotes: [
    'Level (my own guess): A2. Moving to Lyon for work in the spring.',
    'I studied French at school years ago and would like to speak again.',
    'Booking for my daughter, Maya (16) — she has a DELF B1 date in May.',
  ],
  // The site caches published content under this key (createSiteContentStore's default).
  resetKeys: ['pbe-site-content'],
  customers: [
    { name: 'Hannah Brooks', email: 'hannah.brooks@example.com', phone: '+1 504 555 0112' },
    { name: 'Marcus Delille', email: 'marcus.delille@example.com', phone: '+1 504 555 0126' },
    { name: 'Priya Raman', email: 'priya.raman@example.com', phone: '+1 504 555 0133' },
    { name: 'Jordan Ellis', email: 'jordan.ellis@example.com', phone: '+1 504 555 0148' },
    { name: 'Camille Ortiz', email: 'camille.ortiz@example.com', phone: '+1 504 555 0150' },
    { name: 'Theo Walsh', email: 'theo.walsh@example.com', phone: '+1 504 555 0161' },
    { name: 'Grace Okonkwo', email: 'grace.okonkwo@example.com', phone: '+1 504 555 0174' },
    { name: 'Sam Nguyen', email: 'sam.nguyen@example.com', phone: '+1 504 555 0187' },
    { name: 'Eleanor Pike', email: 'eleanor.pike@example.com', phone: '+1 504 555 0195' },
    { name: 'Luis Romero', email: 'luis.romero@example.com', phone: '+1 504 555 0109' },
  ],
};
