# SEO-аудит BRUKIVKA

Дата: 20.10.2026. Об’єкт — новий Nuxt-проєкт і локально згенерований HTML, а не вже опублікований сайт brukivka.org. Нічого не публікувалося, налаштування чинного сайту/Google-профілю не змінювалися.

## Висновок

Технічна основа була підготовлена: SSG із видимим HTML, сім контентних URL, унікальні title/description, self-canonical, sitemap, реальна 404 на локальному сервері, контакти та доступні фотографії. Під час аудиту усунено прогалини в метаданих, розмітці бізнесу/сайту, змісті категорій і контролі індексації.

Публічне SEO-приймання ще не завершено: потрібні фактичний HostPro, перевірка HTTPS/301, браузерні mobile/CWV-вимірювання та інструменти Google після запуску. Відсоток «SEO-готовності», бали Lighthouse й гарантовані позиції не заявляємо.

Локальні перевірки: typecheck, lint/Prettier, 13 тестів; generate/verify для семи маршрутів і 591 локального посилання/ресурсу, 125 галерейних записів. Перевірено окрему індексовану production-збірку через verify:release та demo /brukivka/ з прапорцем true, яке все одно зберігає noindex. У локальному HTTP перевірено прямі маршрути, п’ять іконок/MIME, фото, два справжні 404 й десять redirect-документів у / та /brukivka/. Ці redirect-документи мають HTTP 200 із meta refresh; вони не підмінюють майбутні Apache 301.

| Перевірена збірка                | Контентні URL    | 404              | Результат                                                            |
| -------------------------------- | ---------------- | ---------------- | -------------------------------------------------------------------- |
| production, прапорець false, /   | noindex/nofollow | noindex/nofollow | generate, verify:output, HTTP пройшли; це фінальний локальний output |
| production, прапорець true, /    | index/follow     | noindex/nofollow | generate, verify:release, HTTP пройшли; лише локальна перевірка      |
| demo, прапорець true, /brukivka/ | noindex/nofollow | noindex/nofollow | generate, verify:output, HTTP пройшли; demo не стає indexable        |

Негативні перевірки verify:release також пройшли: команда відхиляє відсутній/false прапорець та preview HTML, навіть якщо під час перевірки передали true. Під час generate залишаються попередження діагностичних console.time/timeEnd Nuxt, команди завершилися exit 0. Поточний .env не редагувався. Browser не надав доступного браузера, тому результати не містять Lighthouse або приймання client-side navigation.

## Що виявлено та змінено

| Ділянка                | До аудиту                                           | Після змін                                                                                                                       |
| ---------------------- | --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Метадані категорій     | Загальні назви на кшталт «Бордюр», без місця роботи | Окремі seoTitle з матеріалом/виробом і Житомиром; уточнені описи                                                                 |
| Зміст категорій        | Короткий вступ і фотогалерея                        | Унікальні поради з вибору та запитання для обговорення; факти зі збережених прикладів                                            |
| Canonical              | Був правильний для наявних шляхів                   | Спільна нормалізація, unit-перевірка підшляху/query/hash; узгоджені OG і schema URL                                              |
| Соціальні прев’ю       | Базові Open Graph                                   | Назва сайту, alt і фактичні розміри фото, Twitter large-image card; це оформлення прев’ю, не обіцянка зростання позицій          |
| Структуровані дані     | LocalBusiness і breadcrumbs                         | Новий logo 512px, image, hasMap за підтвердженою адресою, стабільні @id; WebSite/WebPage/CollectionPage та зв’язки з breadcrumbs |
| Індексація             | noindex одночасно з Disallow: /                     | Preview/demo зберігають noindex; robots дозволяє прочитати директиву. Індексована production-збірка потребує явного прапорця     |
| Передрелізна перевірка | Не перевіряла production robots на кожній сторінці  | verify:output перевіряє точну політику всіх семи URL; verify:release відхиляє preview/demo та помилковий noindex                 |
| Перенесення адрес      | Карта старих URL і шаблон Apache 301                | Також підготовлено /index.html-варіанти, нормалізацію явного index.html; HTTPS/www-приклад залишено до перевірки хостингу        |

Описи не містять вигаданих цін, залишків, сертифікатів, гарантій або точних умов доставки. Дані Product/Offer/AggregateRating не додавалися: галерейні записи не видаються за окремі підтверджені товарні пропозиції. Джерело прикладів — reference/legacy/productsandservices.html і збережені підписи. Рік 2001 та адреса підтверджені користувачкою. Є адреса для Google Maps search, але не отримано URL конкретного бізнес-профілю чи підтверджених годин роботи; ці відомості не вигадуються.

## Сім сторінок

| URL                               | Заголовок пошуку без суфікса BRUKIVKA          |
| --------------------------------- | ---------------------------------------------- |
| /                                 | Гранітна бруківка та плитка в Житомирі         |
| /kataloh/brukivka-kolota/         | Колота гранітна бруківка в Житомирі            |
| /kataloh/brukivka-pyliana/        | Пиляна термооброблена бруківка — Житомир       |
| /kataloh/brukivka-pyliano-kolota/ | Пиляно-колота гранітна бруківка — Житомир      |
| /kataloh/plytka/                  | Гранітна плитка та фасадні матеріали — Житомир |
| /kataloh/fihurni-vyroby/          | Сходи та фігурні вироби з граніту — Житомир    |
| /kataloh/bordiur/                 | Гранітний бордюр — Житомир                     |

Секції #kamin/#roboty/#posluhy/#kontakty — частини лендингу, а не окремі індексовані документи. У sitemap залишаються лише реальні контентні сторінки, без вигаданих URL чи додаткових сторінок міст. Старі інформаційні адреси спрямовуються до відповідного перенесеного контенту. Браузерний canonical виключає рекламні параметри й fragment; не створюємо дублікати для кожного фільтра/фото.

## Перевірка перед публікацією

Індексація поточного передрелізного проєкту навмисно вимкнена. Для перевірки майбутнього публічного output локально:

```bash
BRUKIVKA_TARGET=production BRUKIVKA_ALLOW_INDEXING=true NUXT_APP_BASE_URL=/ BRUKIVKA_SITE_URL=https://brukivka.org/ npm run generate
BRUKIVKA_TARGET=production BRUKIVKA_ALLOW_INDEXING=true NUXT_APP_BASE_URL=/ BRUKIVKA_SITE_URL=https://brukivka.org/ npm run verify:release
```

Команди не змінюють .env і не публікують сайт. Для preview генерувати з BRUKIVKA_ALLOW_INDEXING=false. Demo залишається noindex навіть із прапорцем true. Параметри generate й verify мають збігатися; надісланий на сервер HTML не перечитає env після завантаження. robots.txt не використовується як захист приватних даних.

## Що ще потрібно перевірити

1. На HostPro застосувати погоджені 301 старих URL до перенесеного контенту, перевірити HTTP/HTTPS, www, /index.html, trailing slash та реальні 404. Звірити доступність robots.txt/sitemap і відсутність небажаного X-Robots-Tag: noindex у відповідях релізу. Node preview не виконує .htaccess. Не замінювати всі відсутні адреси відповіддю 200 з головною.
2. У браузері перевірити metadata/JSON-LD після Nuxt-навігації, Back/Forward і hash/query-переходів; відсутність hydration errors. Потрібні реальні mobile/reduced-motion/no-JS/zoom-перевірки.
3. Виміряти Lighthouse/PSI на production, далі польові LCP/INP/CLS за наявності даних. Вісім оригінальних текстур hero мають сумарно 992 510 байтів; це розмір вихідних файлів, не виміряний LCP або мережевий трафік. Фото не перекодовувалися; роботу анімацій/завантаження потрібно оцінити на телефоні.
4. Після запуску перевірити URL Inspection, індексацію й sitemap у Search Console. Локальний JSON.parse та перевірка узгодженості schema не є результатом Rich Results Test/Schema Markup Validator.
5. Для локального пошуку звірити фактичний Google Business Profile, контакти, адресу й години, коли власниця надасть підтверджені дані. Профіль не створювався й не редагувався агентом.

## Офіційні джерела

noindex має бути доступним роботу для читання, тому Disallow не поєднується з ним як засіб вилучення сторінки. [Google: Block indexing](https://developers.google.com/search/docs/crawling-indexing/block-indexing).

Заголовки мають стисло описувати конкретну сторінку; корисний зміст адресує вибір покупця. Фіксована кількість ключових слів або слів у тексті не є ціллю цього аудиту. [Google: Title links](https://developers.google.com/search/docs/appearance/title-link), [Helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).

Розмітка організації й локального бізнесу передає підтверджені відомості; WebSite задає назву на головній. Показ у результатах залежить від Google; site name для окремого підкаталогу demo не обіцяється. [Organization](https://developers.google.com/search/docs/appearance/structured-data/organization), [LocalBusiness](https://developers.google.com/search/docs/appearance/structured-data/local-business), [Site names](https://developers.google.com/search/docs/appearance/site-names).

Canonical узгоджується з sitemap та внутрішніми URL; перенесені старі адреси потребують постійних серверних redirect там, де вони доступні. Об’єднання інформаційних сторінок у лендинг відображає реальне перенесення контенту. [Canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [Site migration](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes).
