import { assetDimensions } from '~/data/available-assets';
import { editedImages, editedImageDimensions } from '~/data/edited-images';
import { absoluteSiteUrl, canonicalPageUrl, serializeJsonLd } from '~/utils/seo';

export function usePageSeo(
  title: string,
  description: string,
  image = 'images/obcekt/1_1.jpg',
  imageAlt = 'Гранітна бруківка та вироби з каменю BRUKIVKA',
) {
  const config = useRuntimeConfig().public;
  const route = useRoute();
  const canonical = computed(() => canonicalPageUrl(config.siteURL, route.path));
  const socialImage = editedImages[image]?.large ?? image;
  const absoluteImage = absoluteSiteUrl(config.siteURL, socialImage);
  const dimensions = editedImageDimensions[socialImage] ?? assetDimensions[socialImage];
  const pageTitle = `${title} · BRUKIVKA`;
  useSeoMeta({
    title,
    description,
    ogTitle: pageTitle,
    ogDescription: description,
    ogType: 'website',
    ogLocale: 'uk_UA',
    ogSiteName: 'BRUKIVKA',
    ogImage: absoluteImage,
    ogImageAlt: imageAlt,
    ogImageWidth: dimensions?.width,
    ogImageHeight: dimensions?.height,
    ogUrl: () => canonical.value,
    twitterCard: 'summary_large_image',
    twitterTitle: pageTitle,
    twitterDescription: description,
    twitterImage: absoluteImage,
    twitterImageAlt: imageAlt,
    robots: config.indexable ? 'index, follow' : 'noindex, nofollow',
  });
  useHead(() => ({
    link: canonical.value ? [{ rel: 'canonical', href: canonical.value }] : [],
    script: config.siteURL
      ? [
          {
            key: 'page-schema',
            type: 'application/ld+json' as const,
            innerHTML: serializeJsonLd({
              '@context': 'https://schema.org',
              '@type': route.path === '/' ? 'WebPage' : 'CollectionPage',
              '@id': `${canonical.value}#webpage`,
              url: canonical.value,
              name: pageTitle,
              description,
              inLanguage: 'uk-UA',
              isPartOf: { '@id': absoluteSiteUrl(config.siteURL, '#website') },
              ...(!config.demo
                ? { publisher: { '@id': absoluteSiteUrl(config.siteURL, '#business') } }
                : {}),
              primaryImageOfPage: {
                '@type': 'ImageObject',
                contentUrl: absoluteImage,
                caption: imageAlt,
                ...(dimensions ? { width: dimensions.width, height: dimensions.height } : {}),
              },
              ...(route.path !== '/'
                ? { breadcrumb: { '@id': `${canonical.value}#breadcrumbs` } }
                : {}),
            }),
          },
          ...(route.path === '/'
            ? [
                {
                  key: 'website-schema',
                  type: 'application/ld+json' as const,
                  innerHTML: serializeJsonLd({
                    '@context': 'https://schema.org',
                    '@type': 'WebSite',
                    '@id': absoluteSiteUrl(config.siteURL, '#website'),
                    url: config.siteURL,
                    name: 'BRUKIVKA',
                    alternateName: ['BRUKIVKA.ORG', new URL(config.siteURL).hostname],
                    inLanguage: 'uk-UA',
                    ...(!config.demo
                      ? { publisher: { '@id': absoluteSiteUrl(config.siteURL, '#business') } }
                      : {}),
                  }),
                },
              ]
            : []),
        ]
      : [],
  }));
}
