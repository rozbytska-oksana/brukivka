export const sectionNavigation = [
  { id: 'kataloh', label: 'Каталог' },
  { id: 'kamin', label: 'Камінь' },
  { id: 'roboty', label: 'Наші роботи' },
  { id: 'posluhy', label: 'Послуги' },
  { id: 'kontakty', label: 'Контакти' },
] as const;

// Previous application URLs and the legacy site's URLs share one migration map.
export const sectionRedirects: Record<string, string> = {
  '/kataloh/': 'kataloh',
  '/kamin/': 'kamin',
  '/roboty/': 'roboty',
  '/posluhy/': 'posluhy',
  '/kontakty/': 'kontakty',
  '/productsandservices/': 'kataloh',
  '/typesofstone/': 'kamin',
  '/finishedobjects/': 'roboty',
  '/contact/': 'kontakty',
  '/aboutus/': 'pro-kamin',
};
