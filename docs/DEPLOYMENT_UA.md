# Розміщення: GitHub Pages і HostPro

Одна кодова база, дві окремі статичні збірки. Публікація та зміна DNS ще не виконані й не є командою цього пакета.

| Налаштування | GitHub Pages                                      | HostPro                              |
| ------------ | ------------------------------------------------- | ------------------------------------ |
| Призначення  | Портфоліо-демо                                    | Основний бізнес-сайт                 |
| app.baseURL  | /<repository>/ для project Pages                  | / для кореня домену                  |
| Site URL     | Реальна повна адреса демо                         | Підтверджений production-домен       |
| Індексація   | noindex                                           | Дозволена після запуску              |
| Звернення    | Демонстраційна поведінка, без реального приймання | Реальні погоджені контакти           |
| Доставка     | GitHub Actions                                    | Вміст .output/public у document root |

Конкретну назву repository та доступи не задано. Не фіксувати вигаданий username або домен. Використати NUXT_APP_BASE_URL для Nuxt base path та окремі явно описані змінні проєкту для site URL/deployment target. Приклад env повинен містити тільки placeholders, без секретів. Всі параметри передавати під час generate: завантажений статичний output сам не перечитає змінні середовища хостингу.

## GitHub Pages

Готовий workflow — `.github/workflows/pages.yml`: Node із `.nvmrc`, npm ci, typecheck, lint/Prettier, тести, generate, verify:output і локальна HTTP-перевірка. Публікація використовує офіційні configure/upload/deploy Pages actions. Artifact — тільки `.output/public`, із `.nojekyll` та читабельним `404.html`; вихідні файли, локальні налаштування, symlink/hardlink не допускаються перевіркою output.

Workflow запускається виключно через `workflow_dispatch`. Параметр `publish` типово false: проходять перевірки та завантаження артефакту, deploy-job пропускається. Публікація відбудеться лише за явного ручного запуску з `publish=true`. Тригерів push/pull_request немає. Сама підготовка файлів нічого не публікує.

URL та підшлях беруться з `actions/configure-pages`: `base_url` і `base_path`, із доданим завершальним `/`. Це підтримує project Pages (`/<repository>/`) та Pages у корені (`/`) без вигаданого username чи ручних repository variables. `BRUKIVKA_TARGET=demo` і `BRUKIVKA_ALLOW_INDEXING=false` зафіксовані в workflow; основна локальна конфігурація production не змінюється.

### Підготовка репозиторію та ручний запуск

1. Створити GitHub-репозиторій для цього проєкту. Його URL ще не надано; не використовувати вигадану адресу remote.
2. Перед першим додаванням файлів переконатися, що це окремий Git-репозиторій проєкту. Під час локальної перевірки `git rev-parse --show-toplevel` повертав домашню папку `/Users/oksanarozbytska`, а не BRUKIVKA. Ініціалізацію виконує користувачка в папці проєкту:

   ```bash
   cd /Users/oksanarozbytska/Desktop/Work/Personal/brukivka
   git init
   git rev-parse --show-toplevel
   git status --short
   ```

   Очікуваний корінь після ініціалізації — саме папка `brukivka`. Далі перевірити список файлів, зробити commit, налаштувати реальний remote і виконати push. Не додавати домашню папку до репозиторію проєкту. Ці дії агент не виконував.

3. У репозиторії GitHub відкрити **Settings → Pages → Build and deployment → Source → GitHub Actions**. Workflow потрібно мати в default branch, щоб став доступним ручний запуск. Для цього workflow не потрібні власні secrets/PAT або DEMO_BASE_URL/DEMO_SITE_URL.
4. У **Actions → Verify and deploy GitHub Pages demo → Run workflow** залишити `publish` вимкненим. Переконатися, що build пройшов, артефакт `github-pages` створено, а deploy пропущено. Pages має бути налаштований навіть для такої перевірки: configure-pages читає URL сайту.
5. Коли публікація погоджена, запустити workflow повторно з увімкненим `publish`. URL опублікованого демо з’явиться у deploy-job/environment. Потім перевірити головну, refresh прямої категорії, невідому адресу з HTTP 404, `_nuxt`/фото/іконки, теми, галерею, мобільне меню, noindex і demo-обмеження звернень на реальному Pages.

Не обирати branch-based розміщення вихідного коду: GitHub Pages має отримати саме згенерований артефакт. Налаштування remote, push, запуск workflow і перевірка фактичного GitHub Pages ще не виконані.

Джерела: [custom workflows GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), [configure-pages v5 outputs](https://github.com/actions/configure-pages/blob/v5/action.yml).

Pages використовується як showcase проєкту. Реальні комерційні звернення та збір даних не виконувати в демо. Позначити демонстраційний статус. Правила Pages: https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits.

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

Окреме GitHub Pages-демо потребує `BRUKIVKA_TARGET=demo`, deployment base path і повного `BRUKIVKA_SITE_URL` із цим підшляхом. У `.github/workflows/pages.yml` вони визначаються автоматично з Pages metadata, а індексація примусово вимкнена. Версії офіційних Pages actions звірені з документацією GitHub; workflow підготовлено, але на GitHub ще не запускався.

Apache-приклад — `deployment/hostpro.htaccess.example`: ErrorDocument 404 без SPA rewrite. Для іншого сервера потрібен його еквівалент. Фактичний document root, тип сервера, HTTPS, redirects, backup/rollback та HTTP-поведінку хостингу ще не перевірено; нічого не опубліковано.

Шаблон також обробляє старі URL з /index.html та прибирає явний index.html у поточних адресах через THE_REQUEST, щоб не зачепити внутрішній DirectoryIndex. Нормалізація HTTP/www подана закоментованим прикладом: увімкнути лише після перевірки TLS/reverse proxy на фактичному HostPro, інакше можливий цикл. Локальні Node HTTP-перевірки не виконують .htaccess і не підтверджують ці 301.

Команди `verify:output` та `verify:http` читають змінні оболонки; параметри підшляху треба передати їм так само, як генерації.

## Перенесення інформаційних сторінок у лендинг

Поточний sitemap містить головну й шість категорій. Карту попередніх адрес задає `app/data/navigation.ts`: вони ведуть до секцій головної. Для Apache додано точні RewriteRule із HTTP 301 у `deployment/hostpro.htaccess.example`. Самостійний static output (включно з Pages) містить redirect HTML із meta refresh, посиланням і location.replace; відповідь такого документа на простому сервері — 200. На HostPro застосувати й перевірити серверні правила, а не називати HTML-перехід 301. Невідомі маршрути зберігають 404.
