/**
 * This website's identity — the ONE place for its name, time zone and the
 * placeholder contact details shown in preview mode (`npm run dev` without
 * Supabase). Everything the owner manages (lessons, prices, hours, real
 * contact details, text and photos) lives in the dashboard at /admin/.
 */
export const SITE = {
  /** The business name. The dashboard's Business page overrides it once connected. */
  name: 'Parole French Studio',
  /** IANA time zone of the business. */
  timezone: 'America/Chicago',
  /** Fictional contact details for preview mode only. */
  previewContact: {
    email: 'bonjour@parole-french.example',
    phone: '+1 504-555-0137',
    address: '2240 Chartres Street, second floor, New Orleans, LA 70117',
  },
};
