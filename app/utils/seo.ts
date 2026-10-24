import { businessContacts } from '../data/contacts.ts';
import { editedImages } from '../data/edited-images.ts';

export function absoluteSiteUrl(siteURL: string, path = ''): string | undefined {
  return siteURL ? new URL(path.replace(/^\//, ''), siteURL).href : undefined;
}

export function canonicalPageUrl(siteURL: string, path: string): string | undefined {
  const pathname = path.split(/[?#]/)[0] || '/';
  return absoluteSiteUrl(siteURL, pathname.endsWith('/') ? pathname : `${pathname}/`);
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replaceAll('<', '\\u003c');
}

export function businessSchema(siteURL: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': absoluteSiteUrl(siteURL, '#business'),
    name: 'BRUKIVKA',
    url: siteURL,
    logo: {
      '@type': 'ImageObject',
      url: absoluteSiteUrl(siteURL, 'brand/icon-512.png'),
      width: 512,
      height: 512,
    },
    image: absoluteSiteUrl(siteURL, editedImages['images/obcekt/1_12.jpg']!.large),
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${businessContacts.address.city}, ${businessContacts.address.street}`)}`,
    foundingDate: String(businessContacts.sinceYear),
    telephone: businessContacts.phones.map((phone) => phone.number),
    email: businessContacts.emails,
    address: {
      '@type': 'PostalAddress',
      addressCountry: businessContacts.address.country,
      addressLocality: businessContacts.address.city,
      streetAddress: businessContacts.address.street,
    },
  };
}
