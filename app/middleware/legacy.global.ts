import { sectionRedirects } from '~/data/navigation';

export default defineNuxtRouteMiddleware((to) => {
  const path = to.path.endsWith('/') ? to.path : `${to.path}/`;
  const section = sectionRedirects[path];
  if (section)
    return navigateTo(
      { path: '/', hash: `#${section}`, query: to.query },
      { redirectCode: 301, replace: true },
    );
});
