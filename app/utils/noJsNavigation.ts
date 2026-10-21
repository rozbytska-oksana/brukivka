import { sectionNavigation } from '../data/navigation.ts';

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return entities[character]!;
  });
}

// With scripting enabled, browsers parse noscript contents as text. Keep this
// escaped, project-owned HTML opaque to Vue instead of hydrating child components.
export function renderNoJsNavigation(baseURL: string): string {
  const links = sectionNavigation
    .map(
      ({ id, label }) =>
        `<a class="link-effect" href="${escapeHtml(`${baseURL}#${id}`)}"><span class="text-link-label">${escapeHtml(label)}</span></a>`,
    )
    .join('');
  return `<nav class="nojs-nav" aria-label="Навігація без JavaScript">${links}</nav>`;
}
