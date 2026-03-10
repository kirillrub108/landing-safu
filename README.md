# Лендинг · 09.03.01 Информатика и вычислительная техника
### САФУ · Северодвинский филиал (Севмашвтуз) · Северодвинск

> Рекламно-информационная страница для абитуриентов направления подготовки **09.03.01 «Информатика и вычислительная техника»** профиль **«Интегрированные автоматизированные информационные системы»**.

---

## Содержание

- [Запуск](#запуск)
- [Структура проекта](#структура-проекта)
- [Архитектура CSS](#архитектура-css)
- [Архитектура JS](#архитектура-js)
- [Секции страницы](#секции-страницы)
- [Темы оформления](#темы-оформления)
- [Ассеты](#ассеты)
- [Контакты](#контакты)

---

## Запуск

Никаких сборщиков, пакетных менеджеров и фреймворков — чистый HTML/CSS/JS.

Секции подключаются через `fetch` в `js/includes.js`, поэтому страница **требует HTTP-сервера**:

```bash
# Python (встроенный)
python -m http.server 8080

# VS Code
# Расширение Live Server → правая кнопка → "Open with Live Server"

# Node.js (если установлен)
npx serve .
```

Затем открыть [http://localhost:8080](http://localhost:8080).

> Прямое открытие `index.html` через `file://` тоже работает — `js/icons-inline.js` автоматически подставляет SVG-спрайт в обход ограничений браузера.

---

## Структура проекта

```
landing safu 1/
│
├── index.html                  # Точка входа. Подключает CSS и загружает секции
│
├── css/                        # Стили (подключаются в порядке нумерации)
│   ├── 00-variables.css        # Дизайн-токены: цвета, шрифты, радиусы, тени
│   ├── 01-base.css             # Сброс, базовые теги, иконки, зернистость
│   ├── 02-buttons.css          # Кнопки (.btn-*)
│   ├── 02-theme-toggle.css     # Переключатель темы
│   ├── 02-preloader.css        # Экран загрузки
│   ├── 02-nav.css              # Шапка / навигация
│   ├── 02-hero.css             # Hero-секция (видео + текст)
│   ├── 02-education-track.css  # Трек обучения (таймлайн)
│   ├── 02-about.css            # О направлении
│   ├── 02-advantages.css       # Карточки преимуществ
│   ├── 02-curriculum.css       # Учебный план (табы)
│   ├── 02-career.css           # Карьера: компании + вакансии
│   ├── 02-gallery.css          # Фотогалерея (слайдер)
│   ├── 02-cta.css              # Призыв к действию
│   ├── 02-footer.css           # Подвал
│   ├── 02-decor.css            # Декоративные фоновые элементы секций
│   ├── 02-animations.css       # Keyframe-анимации (@keyframes)
│   └── 03-responsive.css       # Адаптив: планшет (≤1200px), мобайл (≤768px)
│
├── js/                         # Скрипты (ES6-модули)
│   ├── main.js                 # Точка входа: импорт и запуск всех модулей
│   ├── includes.js             # Загрузка секций (fetch + data-include)
│   ├── theme.js                # Переключение тем (light / dark / accessible)
│   ├── nav.js                  # Sticky-навигация, бургер-меню
│   ├── slider.js               # Слайдер галереи (autoplay, touch, keyboard)
│   ├── others.js               # Прелоадер, видео, таймлайн, табы, scroll-reveal
│   ├── utils.js                # Вспомогательные: debounce, throttle
│   └── icons-inline.js         # SVG-спрайт для file:// протокола
│
├── sections/                   # HTML-секции (инжектируются через includes.js)
│   ├── preloader.html          # Экран загрузки
│   ├── nav.html                # Навигация
│   ├── hero.html               # Заглавный блок с видео
│   ├── about.html              # О направлении
│   ├── education-track.html    # Трек обучения (4 года)
│   ├── advantages.html         # 6 карточек преимуществ
│   ├── curriculum.html         # Учебный план по семестрам
│   ├── career.html             # Карьера: логотипы компаний + зарплаты
│   ├── gallery.html            # Фотогалерея
│   ├── cta.html                # Блок «Подать заявку»
│   ├── footer.html             # Подвал
│   └── theme-toggle.html       # Кнопки переключения темы
│
└── assets/
    ├── icons.svg               # SVG-спрайт (иконки через <use>)
    ├── MEDIA_GUIDE.txt         # Справка по медиа-ассетам
    │
    ├── images/
    │   ├── favicon/            # Фавиконки + web manifest
    │   ├── icons/              # PNG-иконки для карточек (512×512, белые на прозрачном)
    │   │   ├── brain.png       # ИИ / Машинное обучение
    │   │   ├── cloud.png       # Облачные технологии / DevOps
    │   │   ├── computer.png    # Web-разработка / Fullstack
    │   │   ├── korpsistems.png # Корпоративные системы
    │   │   ├── phone.png       # Мобильная разработка
    │   │   └── shield.png      # Информационная безопасность
    │   ├── logos/              # Логотипы САФУ, партнёров, работодателей, соцсетей
    │   ├── gallery/            # Фотографии для слайдера
    │   ├── features/           # Фото для блока «О направлении»
    │   ├── about-lab.webp       # Фото лаборатории
    │   └── hero-poster.webp     # Постер для hero-видео (fallback)
    │
    └── video/
        └── hero-background.mp4 # Фоновое видео (без звука, зациклено)
```

---

## Архитектура CSS

### Порядок подключения

Файлы подключаются в `index.html` строго в нумерованном порядке: `00` → `01` → `02-*` → `03`.

### Дизайн-токены (`00-variables.css`)

Все цвета, шрифты, отступы и тени — исключительно через CSS-переменные. Ничего не хардкодится напрямую в компонентах (кроме редких исключений со специфическими значениями).

| Переменная | Назначение |
|---|---|
| `--bg-primary` / `--bg-secondary` / `--bg-tertiary` | Фоновые оттенки |
| `--primary-blue` / `--primary-blue-light` | Акцентный синий САФУ |
| `--text-primary` / `--text-secondary` / `--text-muted` | Текстовые цвета |
| `--font-display` | Unbounded (заголовки) |
| `--font-body` | Raleway (текст) |
| `--radius-sm/md/lg/xl` | Радиусы скругления |
| `--shadow-sm/md/lg/xl` | Тени |
| `--transition` / `--transition-slow` | Длительности анимаций |
| `--z-bg/default/card/nav/...` | Z-index слои |

### Зернистость

`body::before` в `01-base.css` накладывает SVG-шум (`feTurbulence`) поверх всей страницы:
- Светлая тема: `opacity: 0.7`, `mix-blend-mode: overlay`
- Тёмная тема: `opacity: 0.2`, `mix-blend-mode: screen`
- Доступная тема: отключена

`img { position: relative; z-index: 10; }` поднимает изображения выше слоя зерна.

---

## Архитектура JS

Все скрипты — ES6-модули. Точка входа — `js/main.js`.

### Порядок инициализации

```
DOMContentLoaded
  └── loadIncludes()         // fetch секций → инжект в DOM
        └── initThemeToggle()
        └── initPreloader()
        └── initNavigation()
        └── initHeroVideo()
        └── initEducationTrack()
        └── initTabs()
        └── initFeaturePreview()
        └── initScrollAnimations()  // IntersectionObserver → .reveal
        └── initSmoothScroll()
        └── initGallerySlider()
```

### Ключевые паттерны

| Механизм | Реализация |
|---|---|
| Секции страницы | `data-include="sections/foo.html"` → `includes.js` делает `fetch` |
| Scroll-reveal | CSS-класс `.reveal` + `IntersectionObserver` добавляет `.visible` |
| Табы учебного плана | `data-tab` атрибуты + управление `aria-selected` / `hidden` |
| Слайдер | Autoplay + touch swipe + keyboard + точки навигации (генерируются динамически) |
| Темы | `data-theme` на `<html>` + `localStorage` для сохранения |

---

## Секции страницы

| # | ID | Файл | Описание |
|---|---|---|---|
| — | — | `preloader.html` | Анимированный экран загрузки |
| — | — | `nav.html` | Sticky-навигация с бургером |
| 1 | `#hero` | `hero.html` | Заголовок + видео-фон + кнопки |
| 2 | `#about` | `about.html` | О направлении, статистика, фото |
| 3 | `#track` | `education-track.html` | Трек обучения по годам (таймлайн) |
| 4 | `#advantages` | `advantages.html` | 6 карточек с направлениями |
| 5 | `#curriculum` | `curriculum.html` | Учебный план по семестрам (табы) |
| 6 | `#career` | `career.html` | Работодатели + должности + зарплаты |
| 7 | `#gallery` | `gallery.html` | Фотогалерея (слайдер) |
| 8 | `#cta` | `cta.html` | Призыв к действию + форма |
| — | — | `footer.html` | Контакты, навигация, соцсети, логотипы |

---

## Темы оформления

Переключаются кнопками в правом верхнем углу. Выбор сохраняется в `localStorage`.

| Тема | Атрибут | Описание |
|---|---|---|
| Светлая (по умолчанию) | нет / `data-theme` отсутствует | Тёмно-синяя палитра САФУ |
| Тёмная | `[data-theme="dark"]` | Тёмно-серая, OLED-friendly |
| Для слабовидящих | `[data-theme="accessible"]` | Белый фон, чёрный текст, шрифт 18px, без декора |

---

## Ассеты

Подробная справка по всем медиа-файлам — в [`assets/MEDIA_GUIDE.txt`](assets/MEDIA_GUIDE.txt).

### Иконки (`assets/images/icons/`)

PNG, 512×512px, белая иконка на прозрачном фоне. Отображаются внутри синей подложки `.card__icon` (advantages) и `.career__role-icon` (career).

### Логотипы (`assets/images/logos/`)

| Файл | Используется в |
|---|---|
| `safu.png` | Навигация, подвал |
| `fil safu.png` | Подвал |
| `ismart.png` | Навигация (дополнительный логотип) |
| `yandex.png`, `vk.png`, `sber.jpg`, ... | Блок работодателей в секции «Карьера» |
| `vk.png`, `max.png` | Кнопки соцсетей в подвале |

### SVG-спрайт (`assets/icons.svg`)

Иконки подключаются через `<use href="assets/icons.svg#icon-name">`. Для работы через `file://` — автоматически инлайнится скриптом `js/icons-inline.js`.

---

## Контакты

**Северодвинский филиал САФУ (Севмашвтуз)**

- Адрес: г. Северодвинск, ул. Воронина, 6
- Email: [sf@narfu.ru](mailto:sf@narfu.ru)
- Телефон: +7 (8184) 58-17-73
- Сайт: [narfu.ru/sf](https://narfu.ru/sf/)
- ВКонтакте: [vk.com/club228215646](https://vk.com/club228215646)
