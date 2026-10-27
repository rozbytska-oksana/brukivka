import type { BusinessContacts } from '../types/catalog';

// Original contacts from https://brukivka.org/contact/.
// The user explicitly requested their reuse for the commercial site on 2026-10-20.
export const businessContacts = {
  siteURL: 'https://brukivka.org/',
  // The user confirmed the start of business in Zhytomyr on 2026-10-20.
  sinceYear: 2001,
  phones: [
    { number: '+380677093312', label: '+38 (067) 709-33-12' },
    { number: '+380632692696', label: '+38 (063) 269-26-96' },
  ],
  emails: ['info@brukivka.org', 'labradorites@gmail.com'],
  address: {
    country: 'UA',
    city: 'Житомир',
    street: 'вул. Покровська 239В',
    label: 'Україна, м. Житомир, вул. Покровська 239В',
  },
} as const satisfies BusinessContacts;

// Selected by the user for enquiries through WhatsApp and Viber on 2026-10-27.
export const enquiryPhone = businessContacts.phones[1];

export function enquiryLinks(text: string) {
  return {
    email: `mailto:${businessContacts.emails[0]}?subject=${encodeURIComponent('Запит щодо гранітних виробів')}&body=${encodeURIComponent(text)}`,
    whatsapp: `https://wa.me/${enquiryPhone.number.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`,
    viber: `viber://chat?number=${encodeURIComponent(enquiryPhone.number)}`,
  };
}

export function messengerLinks(phone: string) {
  return [
    { label: 'Viber', href: `viber://chat?number=${encodeURIComponent(phone)}` },
    { label: 'Telegram', href: `https://t.me/${phone}` },
    { label: 'WhatsApp', href: `https://wa.me/${phone.replace(/\D/g, '')}` },
  ];
}
