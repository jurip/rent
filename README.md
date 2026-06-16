<h1 align="center">
  <br>
  <img src="https://raw.githubusercontent.com/yourusername/rental-app/main/.github/logo.svg" alt="Ren Hub" width="200">
  <br>
  Ren Hub — Платформа для аренды жилья
  <br>
</h1>

<p align="center">
  <strong>Полнофункциональная платформа для аренды недвижимости</strong><br>
  Веб-приложение на React + мобильное Android-приложение
</p>

<p align="center">
  <img src="screenshots/01-home-mobile.png" alt="Главная страница" width="320">
  <img src="screenshots/02-listings-mobile.png" alt="Каталог" width="320">
  <img src="screenshots/03-property-detail-mobile.png" alt="Детали" width="320">
</p>

---

## ✨ Возможности

- 🔍 **Поиск и фильтрация** — поиск недвижимости по типу, цене, району и удобствам
- 🏠 **Детальные страницы объектов** — галерея изображений, карта, описание, удобства, арендодатель
- ❤️ **Избранное и сравнение** — сохраняйте варианты и сравнивайте их рядом
- 📅 **Бронирование** — запрос на бронирование, подтверждение/отклонение арендодателем
- 👤 **Два типа аккаунтов** — панели арендатора и арендодателя
- 🔐 **JWT-аутентификация** — регистрация, вход, подтверждение email, сброс пароля
- 📱 **Android-приложение** — нативное приложение с WebView для мобильного доступа
- 🌐 **Мультиязычность** — поддержка русского и английского языков
- 📊 **Панели управления** — статистика и управление для обеих ролей

---

## 🖼️ Скриншоты

### 📱 Мобильное приложение (Android)

<p align="center">
  <img src="screenshots/01-home-mobile.png" alt="Главная" width="280">
  <img src="screenshots/02-listings-mobile.png" alt="Каталог" width="280">
  <img src="screenshots/03-property-detail-mobile.png" alt="Детали" width="280">
</p>

<p align="center">
  <img src="screenshots/04-login-mobile.png" alt="Вход" width="280">
  <img src="screenshots/05-register-mobile.png" alt="Регистрация" width="280">
  <img src="screenshots/06-renter-dashboard-mobile.png" alt="Дашборд арендатора" width="280">
</p>

<p align="center">
  <img src="screenshots/07-favorites-mobile.png" alt="Избранное" width="280">
  <img src="screenshots/08-landlord-dashboard-mobile.png" alt="Дашборд арендодателя" width="280">
  <img src="screenshots/09-booking-requests-mobile.png" alt="Запросы" width="280">
</p>

<details>
<summary>📋 Описание страниц</summary>
<br>

| Страница | Описание |
|----------|----------|
| 🏠 **Главная** | Поисковая строка, популярные предложения, категории недвижимости |
| 🔍 **Каталог** | Сетка объектов с фильтрацией по цене, типу и району |
| 🏡 **Карточка** | Галерея изображений, карта, описание, удобства, контакты |
| 🔑 **Вход** | JWT-авторизация с валидацией и восстановлением пароля |
| 📝 **Регистрация** | Создание аккаунта с выбором роли |
| 📊 **Дашборд** | Обзор бронирований, избранного и рекомендаций |
| ❤️ **Избранное** | Сохранённые варианты с быстрым сравнением |
| 🏢 **Арендодатель** | Управление объявлениями и статистика |
| 📋 **Запросы** | Подтверждение и отклонение бронирований |

</details>

---

## 🛠️ Технологический стек

| Слой | Технологии |
|------|-------------|
| **Frontend** | React 18, TypeScript, Tailwind CSS, React Router 6 |
| **State** | TanStack Query 5, Zustand |
| **UI** | Radix UI (Dialog, Select, Tabs, Dropdown, Checkbox) |
| **HTTP** | Axios |
| **Backend** | Node.js, Express, TypeScript |
| **ORM** | Prisma |
| **Auth** | JWT (access + refresh токены), bcryptjs |
| **Валидация** | Zod |
| **Загрузка файлов** | Multer |
| **База данных** | SQLite (dev), PostgreSQL (production-ready) |
| **Мобильное** | Android (Kotlin + WebView) |
| **Тестирование** | Playwright (E2E) |

---

## 🚀 Быстрый старт

### Предварительные требования

- **Node.js** ≥ 18
- **npm** ≥ 9
- **Android Studio** (для сборки Android-приложения)

### Установка и запуск

```bash
# 1. Клонировать репозиторий
git clone https://github.com/yourusername/rental-app.git
cd rental-app

# 2. Установить зависимости
npm install

# 3. Применить миграции базы данных
npm run db:migrate

# 4. Заполнить тестовыми данными
npm run db:seed

# 5. Запустить сервер и клиент
npm run dev
```

После запуска:
- **Веб-приложение**: http://localhost:5173
- **API сервер**: http://localhost:8080

### Тестовые аккаунты

| Роль | Email | Пароль |
|------|-------|--------|
| Арендатор | `anna@example.com` | `password123` |
| Арендодатель | `sarah@example.com` | `password123` |

---

## 📱 Android-приложение

Приложение использует WebView для отображения веб-версии с нативными улучшениями:

```bash
cd android
./gradlew assembleDebug
```

Подробнее в [android/README.md](android/README.md)

---

## 📁 Структура проекта

```
rental-app/
├── client/          # React frontend (Vite)
│   └── src/
│       ├── components/  # UI компоненты
│       ├── pages/       # Страницы
│       ├── hooks/       # React-хуки
│       ├── store/       # Zustand-хранилище
│       └── lib/         # Утилиты, API-клиент
├── server/          # Express backend
│   └── src/
│       ├── routes/      # API маршруты
│       ├── services/    # Бизнес-логика
│       ├── middleware/  # Auth, валидация
│       └── db/          # Prisma-схема и сиды
├── shared/          # Общие типы и константы
└── android/         # Android-приложение (Kotlin)
```

---

## 📄 Лицензия

MIT
