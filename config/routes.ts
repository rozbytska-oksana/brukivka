import { categories } from '../app/data/categories.ts';
export { sectionRedirects } from '../app/data/navigation.ts';

export const siteRoutes = ['/', ...categories.map((c) => `/kataloh/${c.slug}/`)];
