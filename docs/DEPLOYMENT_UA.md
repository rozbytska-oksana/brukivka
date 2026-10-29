# Розміщення: GitHub Pages і HostPro

## GitHub Pages: портфоліо-демо

За рішенням користувачки від 28.10.2026 GitHub Pages знову використовує `BRUKIVKA_TARGET=demo`: є позначка портфоліо-демо, поля звернення вимкнені, немає активних телефонних/email/messenger-посилань. Тимчасовий повний режим для клієнтського тестування від 27.10.2026 завершений. Основний сайт https://brukivka.org/ на HostPro продовжує працювати в production.

`BRUKIVKA_ALLOW_INDEXING=false` зберігає noindex. Canonical, OG URL, sitemap та ресурси демо використовують адресу Pages з підшляхом `/brukivka/`. `base_url` і `base_path` беруться з `actions/configure-pages`, із завершальним `/`.

Workflow `.github/workflows/pages.yml` запускається лише вручну: **Actions → Verify and deploy GitHub Pages → Run workflow**. `publish=false` типово виконує перевірки й завантажує артефакт без deploy. Для публікації користувачка вмикає `publish`. Автоматичного деплою після push немає. У **Settings → Pages → Source** має бути вибрано **GitHub Actions**.

Workflow запускає typecheck, lint/Prettier, тести, generate, verify:output і verify:http. Публікується лише `.output/public`, із `.nojekyll` та читабельним `404.html`. Після публікації перевірити прямі URL категорій і refresh, невідому адресу з HTTP 404, теми, галерею, мобільну навігацію, демо-позначки, вимкнені поля звернення, відсутність активних комерційних посилань та noindex. Перевірка реальних месенджерів стосується лише production на HostPro.

Локальна перевірка такої ж конфігурації:

```bash
export BRUKIVKA_TARGET=demo
export BRUKIVKA_ALLOW_INDEXING=false
export NUXT_APP_BASE_URL=/brukivka/
export BRUKIVKA_SITE_URL=https://rozbytska-oksana.github.io/brukivka/
npm run generate
npm run verify:output
npm run verify:http
```

Ці команди нічого не публікують. Змінні потрібні під час генерації й перевірок: готовий статичний output не перечитує налаштування хостингу.

## HostPro

Для статичного релізу достатньо хостингу HTML/CSS/JS: Node на production не потрібен. Конкретний тариф, панель і document root перевірити за наданим доступом. Не припускати, що public_html завжди є коренем потрібного домену.

Згенерувати production build із baseURL=/, правильними canonical і sitemap. Зробити backup старого сайту, перевірити HTML index кожної категорії, HTTPS, 404, кешування й перенаправлення. Правила .htaccess використовувати лише якщо фактичний сервер їх підтримує. Не ставити загальний rewrite всіх адрес на головну з 200.

Не включати noindex демо у production. Перед запуском перевірити поточні URL і підготувати точні 301. Файли зі стабільними назвами повинні оновлюватися без застарілого кешу; хешовані assets можна кешувати довго.

## Якщо знадобиться бекенд

Статичний output не запускає server/api Nuxt. Для доставки заявок прямо на email потрібен окремий endpoint (можливо PHP на HostPro або зовнішній сервіс) чи серверний deployment Nuxt із сумісним тарифом. Це окремий обсяг. Поки форма production відкриває погоджений месенджер/email із текстом.

Джерела: https://nuxt.com/deploy/github-pages ; https://nuxt.com/docs/4.x/getting-started/prerendering ; https://hostpro.ua/blog/ua/how-to-create-a-website-using-html/.

## Реалізовані налаштування — 20.10.2026

Основний режим за замовчуванням — `BRUKIVKA_TARGET=production`, `NUXT_APP_BASE_URL=/`, canonical/site URL — `https://brukivka.org/`. Обидва телефони, обидві пошти та адреса беруться з `app/data/contacts.ts`, за прямою вказівкою користувачки. Звернення активні: WhatsApp/email із підготовленим текстом; серверної доставки немає.

До публічного запуску `BRUKIVKA_ALLOW_INDEXING=false`: це передрелізне обмеження індексації, а не режим демо. Для погодженого публічного релізу передати `BRUKIVKA_ALLOW_INDEXING=true` під час генерації — тоді отримуємо index/follow. robots.txt дозволяє обхід в усіх режимах: робот має прочитати noindex у preview/demo HTML. Disallow не є заміною noindex; підкаталожний robots.txt GitHub Pages не керує всім доменом. Приватне staging-середовище за потреби закривають авторизацією на хостингу, а не покладаються на noindex як контроль доступу. [Пояснення Google](https://developers.google.com/search/docs/crawling-indexing/block-indexing).

Локальна перевірка майбутнього індексованого релізу, без публікації:

```bash
BRUKIVKA_TARGET=production BRUKIVKA_ALLOW_INDEXING=true NUXT_APP_BASE_URL=/ BRUKIVKA_SITE_URL=https://brukivka.org/ npm run generate
BRUKIVKA_TARGET=production BRUKIVKA_ALLOW_INDEXING=true NUXT_APP_BASE_URL=/ BRUKIVKA_SITE_URL=https://brukivka.org/ npm run verify:release
```

verify:release вимагає production та явний прапорець індексації, потім перевіряє саме створений HTML: index/follow на контентних сторінках, noindex на 404, canonical/OG/schema/sitemap та ресурси. Вона не змінює .env, не публікує сайт і не запускає Search Console. Не завантажувати передрелізний output з noindex замість цієї збірки. Комерційна збірка, яка дозволяє індексацію, потребує HTTPS siteURL.

Окреме портфоліо-демо можна згенерувати з `BRUKIVKA_TARGET=demo`, власним base path і site URL. Поточний Pages workflow використовує саме портфоліо-демо з noindex, як описано вище.

Apache-приклад — `deployment/hostpro.htaccess.example`: ErrorDocument 404 без SPA rewrite. Для іншого сервера потрібен його еквівалент. Фактичний document root, тип сервера, HTTPS, redirects, backup/rollback та HTTP-поведінку хостингу ще не перевірено; нічого не опубліковано.

Шаблон також обробляє старі URL з /index.html та прибирає явний index.html у поточних адресах через THE_REQUEST, щоб не зачепити внутрішній DirectoryIndex. Нормалізація HTTP/www подана закоментованим прикладом: увімкнути лише після перевірки TLS/reverse proxy на фактичному HostPro, інакше можливий цикл. Локальні Node HTTP-перевірки не виконують .htaccess і не підтверджують ці 301.

Команди `verify:output` та `verify:http` читають змінні оболонки; параметри підшляху треба передати їм так само, як генерації.

## Перенесення інформаційних сторінок у лендинг

Поточний sitemap містить головну й шість категорій. Карту попередніх адрес задає `app/data/navigation.ts`: вони ведуть до секцій головної. Для Apache додано точні RewriteRule із HTTP 301 у `deployment/hostpro.htaccess.example`. Самостійний static output (включно з Pages) містить redirect HTML із meta refresh, посиланням і location.replace; відповідь такого документа на простому сервері — 200. На HostPro застосувати й перевірити серверні правила, а не називати HTML-перехід 301. Невідомі маршрути зберігають 404.

## Кешування статичних ресурсів — 29.10.2026

У `deployment/hostpro.htaccess.example` підготовлено Cache-Control: 7 днів для фото/іконок/WOFF2 і рік з immutable для JS/CSS із хешем у назві. HTML/XML/TXT зберігають no-cache. Це лише локальний приклад: на HostPro правила ще не застосовані. Додати тільки блоки кешування до чинного .htaccess після резервної копії, зберігши налаштовані підтримкою HTTPS/www-редиректи та cPanel PHP-директиви. Не замінювати чинний файл усім прикладом.

Після застосування перевірити Cache-Control на фото, шрифті, хешованих JS/CSS і HTML зовнішніми HTTP-запитами. Якщо nginx віддає ці ресурси напряму й не враховує .htaccess, потрібне відповідне налаштування HostPro. Для заміни фото/шрифтів під тим самим URL враховувати 7-денний браузерний кеш або змінювати URL. Кешування допомагає повторним візитам; воно не є виміряним прискоренням першого відкриття.
