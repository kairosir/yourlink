import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import './App.css'

type ThemeMode = 'light' | 'dark'

type ModuleCard = {
  id: string
  title: string
  subtitle: string
  description: string
  badge: string
  className: string
  icon: ReactNode
}

const sidebarItems = [
  { label: 'Главная', short: 'NL', active: true },
  { label: 'Финансы', short: 'Fi' },
  { label: 'Карьера', short: 'Ca' },
  { label: 'Образование', short: 'Ed' },
  { label: 'Быт', short: 'Ho' },
  { label: 'Ментал', short: 'Me' },
  { label: 'Тренды', short: 'Tr' },
]

function IconShell({ children }: { children: ReactNode }) {
  return (
    <span className="icon-shell" aria-hidden="true">
      <svg viewBox="0 0 96 96" className="card-icon">
        <defs>
          <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--icon-start)" />
            <stop offset="100%" stopColor="var(--icon-end)" />
          </linearGradient>
        </defs>
        {children}
      </svg>
    </span>
  )
}

const cards: ModuleCard[] = [
  {
    id: 'finance',
    title: 'Финансы',
    subtitle: 'Бюджет • Кредиты • Инвестиции',
    description: 'Контроль расходов, напоминания и сценарии роста капитала.',
    badge: 'AI forecast',
    className: 'finance large',
    icon: (
      <IconShell>
        <rect x="12" y="24" width="72" height="48" rx="18" fill="url(#iconGradient)" opacity="0.18" />
        <rect x="18" y="30" width="60" height="36" rx="14" fill="none" stroke="url(#iconGradient)" strokeWidth="4" />
        <path d="M30 54h14M52 54h14" stroke="url(#iconGradient)" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M42 38c6-6 18-6 24 0" stroke="url(#iconGradient)" strokeWidth="4" strokeLinecap="round" />
      </IconShell>
    ),
  },
  {
    id: 'career',
    title: 'Карьера',
    subtitle: 'Вакансии • Резюме • Собеседования',
    description: 'План роста, подбор ролей и подготовка к интервью.',
    badge: 'Top roles',
    className: 'career tall',
    icon: (
      <IconShell>
        <path d="M26 36h44a8 8 0 0 1 8 8v24a8 8 0 0 1-8 8H26a8 8 0 0 1-8-8V44a8 8 0 0 1 8-8Z" fill="none" stroke="url(#iconGradient)" strokeWidth="4" />
        <path d="M36 36v-4c0-6 4-10 10-10h4c6 0 10 4 10 10v4" fill="none" stroke="url(#iconGradient)" strokeWidth="4" />
        <path d="m58 24 18 10-18 10 6-10-6-10Z" fill="url(#iconGradient)" />
      </IconShell>
    ),
  },
  {
    id: 'education',
    title: 'Образование',
    subtitle: 'ЕНТ/ЕГЭ • Курсы • Навыки',
    description: 'Учебные траектории и трекер прогресса по темам.',
    badge: 'Learning path',
    className: 'education',
    icon: (
      <IconShell>
        <path d="M18 34 48 20l30 14-30 14-30-14Z" fill="url(#iconGradient)" opacity="0.24" />
        <path d="M24 42v16c0 5 11 10 24 10s24-5 24-10V42" fill="none" stroke="url(#iconGradient)" strokeWidth="4" />
        <path d="M78 36v20" stroke="url(#iconGradient)" strokeWidth="4" strokeLinecap="round" />
      </IconShell>
    ),
  },
  {
    id: 'home',
    title: 'Практика и дом',
    subtitle: 'Ремонт • Документы • Быт',
    description: 'Пошаговые инструкции по дому, делам и повседневным задачам.',
    badge: 'Daily ops',
    className: 'home wide',
    icon: (
      <IconShell>
        <path d="M18 50 48 24l30 26" fill="none" stroke="url(#iconGradient)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M28 46v24h40V46" fill="none" stroke="url(#iconGradient)" strokeWidth="4.5" strokeLinejoin="round" />
        <path d="m30 26 20 20" stroke="url(#iconGradient)" strokeWidth="6" strokeLinecap="round" />
        <path d="m46 22 8 8" stroke="url(#iconGradient)" strokeWidth="6" strokeLinecap="round" />
      </IconShell>
    ),
  },
  {
    id: 'mental',
    title: 'Ментальное здоровье',
    subtitle: 'Баланс • Сон • Медитация',
    description: 'Спокойные ритуалы, чек-ины и бережные рекомендации.',
    badge: 'Mindful',
    className: 'mental',
    icon: (
      <IconShell>
        <path d="M48 76c-18-10-28-22-28-34 0-10 8-18 18-18 6 0 10 3 14 8 4-5 8-8 14-8 10 0 18 8 18 18 0 12-10 24-28 34Z" fill="url(#iconGradient)" opacity="0.22" />
        <path d="M48 76c-18-10-28-22-28-34 0-10 8-18 18-18 6 0 10 3 14 8 4-5 8-8 14-8 10 0 18 8 18 18 0 12-10 24-28 34Z" fill="none" stroke="url(#iconGradient)" strokeWidth="4" />
        <path d="M34 50c5-4 10-6 14-6s9 2 14 6" stroke="url(#iconGradient)" strokeWidth="4" strokeLinecap="round" />
      </IconShell>
    ),
  },
  {
    id: 'trends',
    title: 'Тренды и сленг',
    subtitle: 'Мемы • Культура • Digital',
    description: 'Разбор нового языка интернета и быстрые объяснения контекста.',
    badge: 'Hot now',
    className: 'trends',
    icon: (
      <IconShell>
        <path d="M20 28h56a10 10 0 0 1 10 10v18a10 10 0 0 1-10 10H50L34 80v-14H20a10 10 0 0 1-10-10V38a10 10 0 0 1 10-10Z" fill="none" stroke="url(#iconGradient)" strokeWidth="4" strokeLinejoin="round" />
        <path d="m58 24 6 10h10l-8 8 4 12-12-7-12 7 4-12-8-8h10l6-10Z" fill="url(#iconGradient)" opacity="0.9" />
      </IconShell>
    ),
  },
]

const stats = [
  { value: '24/7', label: 'под рукой' },
  { value: '6', label: 'ключевых сфер жизни' },
  { value: '1', label: 'единый AI-центр' },
]

function App() {
  const [theme, setTheme] = useState<ThemeMode>('light')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar__brand">
          <div className="sidebar__mark">N</div>
          <div>
            <p className="eyebrow">AI Life OS</p>
            <strong>NeuroLife</strong>
          </div>
        </div>

        <nav className="sidebar__nav" aria-label="Основная навигация">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              className={`sidebar__link${item.active ? ' is-active' : ''}`}
              type="button"
            >
              <span>{item.short}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <button
          type="button"
          className="theme-toggle"
          onClick={() => setTheme((value) => (value === 'light' ? 'dark' : 'light'))}
          aria-label="Переключить тему"
        >
          <span>{theme === 'light' ? 'Dark mode' : 'Light mode'}</span>
          <span className="theme-toggle__track">
            <span className="theme-toggle__thumb" />
          </span>
        </button>
      </aside>

      <main className="dashboard">
        <header className="topbar">
          <a href="/" className="logo">
            <span className="logo__spark" />
            <span>NeuroLife</span>
          </a>

          <label className="search">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14Zm9 16-4.2-4.2" />
            </svg>
            <input
              type="search"
              placeholder="Что нужно сегодня? (как починить кран, план бюджета...)"
              aria-label="Глобальный поиск"
            />
          </label>

          <div className="topbar__actions">
            <button type="button" className="icon-button" aria-label="Уведомления">
              <span className="notification-dot" />
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 4a4 4 0 0 1 4 4v2.2c0 .7.2 1.4.6 2l1.2 1.8c.8 1.2 0 2.8-1.5 2.8H7.7c-1.5 0-2.3-1.6-1.5-2.8l1.2-1.8c.4-.6.6-1.3.6-2V8a4 4 0 0 1 4-4Z" />
                <path d="M9.5 19a2.5 2.5 0 0 0 5 0" />
              </svg>
            </button>
            <button type="button" className="avatar" aria-label="Профиль пользователя">
              NK
            </button>
          </div>
        </header>

        <section className="hero-panel">
          <div className="hero-panel__copy">
            <p className="eyebrow">НейроЖизнь 2026</p>
            <h1>Твой универсальный помощник по жизни</h1>
            <p className="hero-panel__subheadline">
              Финансы • Карьера • Образование • Быт • Ментал • Тренды
            </p>
            <p className="hero-panel__description">
              Единый AI-интерфейс, который собирает важные решения, ежедневные задачи и
              персональные инсайты в одном чистом рабочем пространстве.
            </p>

            <div className="hero-panel__metrics" aria-label="Ключевые показатели">
              {stats.map((stat) => (
                <div key={stat.label} className="metric-chip">
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-panel__preview" aria-hidden="true">
            <div className="preview-card preview-card--primary">
              <span>Сегодня</span>
              <strong>План бюджета + подготовка к интервью + чек-лист дома</strong>
            </div>
            <div className="preview-card preview-card--secondary">
              <span>AI Focus</span>
              <strong>3 приоритета на день</strong>
            </div>
            <div className="orb orb--one" />
            <div className="orb orb--two" />
          </div>
        </section>

        <section className="bento-grid" aria-label="Главные модули">
          {cards.map((card) => (
            <button key={card.id} className={`module-card ${card.className}`} type="button">
              <div className="module-card__glow" />
              <div className="module-card__header">
                {card.icon}
                <span className="module-card__badge">{card.badge}</span>
              </div>
              <div className="module-card__body">
                <h2>{card.title}</h2>
                <p className="module-card__subtitle">{card.subtitle}</p>
                <p className="module-card__description">{card.description}</p>
              </div>
            </button>
          ))}
        </section>
      </main>

      <button type="button" className="chat-fab">
        <span className="chat-fab__icon">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3 14.2 8.4 20 10.2l-5 3.7 1.8 5.9L12 16.3 7.2 19.8 9 13.9l-5-3.7 5.8-1.8L12 3Z" />
          </svg>
        </span>
        <span>Спросить Нейро</span>
      </button>
    </div>
  )
}

export default App
