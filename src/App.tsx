import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import './App.css'

type ThemeMode = 'light' | 'dark'

type TopicBranch = {
  title: string
  subtitle: string
  items: string[]
}

type ModuleCard = {
  id: string
  navLabel: string
  title: string
  subtitle: string
  description: string
  badge: string
  className: string
  prompt: string
  icon: ReactNode
  branches: TopicBranch[]
}

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

const modules: ModuleCard[] = [
  {
    id: 'finance',
    navLabel: 'Финансы',
    title: 'Финансы',
    subtitle: 'Бюджет • Кредиты • Инвестиции',
    description: 'Контроль расходов, подушка безопасности, долги, вложения и денежные решения на каждый этап жизни.',
    badge: 'AI forecast',
    className: 'finance large',
    prompt: 'Почти любые денежные инструкции: от базового бюджета до сложных финансовых сценариев.',
    icon: (
      <IconShell>
        <rect x="12" y="24" width="72" height="48" rx="18" fill="url(#iconGradient)" opacity="0.18" />
        <rect x="18" y="30" width="60" height="36" rx="14" fill="none" stroke="url(#iconGradient)" strokeWidth="4" />
        <path d="M30 54h14M52 54h14" stroke="url(#iconGradient)" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M42 38c6-6 18-6 24 0" stroke="url(#iconGradient)" strokeWidth="4" strokeLinecap="round" />
      </IconShell>
    ),
    branches: [
      {
        title: 'Личный бюджет',
        subtitle: 'Повседневные деньги и расходы',
        items: ['План бюджета на месяц', 'Учет трат по категориям', 'Подушка безопасности', 'Как сократить импульсные покупки'],
      },
      {
        title: 'Кредиты и долги',
        subtitle: 'Нагрузка, ставки и реструктуризация',
        items: ['Как закрывать долги по приоритету', 'Сравнение кредитов', 'Рефинансирование', 'Переговоры с банком'],
      },
      {
        title: 'Инвестиции',
        subtitle: 'Старт, риск и долгий горизонт',
        items: ['С чего начать инвестирование', 'Распределение портфеля', 'Риски и диверсификация', 'Инвестиции под цель'],
      },
      {
        title: 'Доход и цели',
        subtitle: 'Финансовые планы под жизнь',
        items: ['Накопить на переезд', 'План на крупную покупку', 'Рост дохода', 'Резерв на нестабильные месяцы'],
      },
    ],
  },
  {
    id: 'career',
    navLabel: 'Карьера',
    title: 'Карьера',
    subtitle: 'Вакансии • Резюме • Собеседования',
    description: 'Вход в профессию, рост, поиск лучших ролей, переговоры и системное развитие карьеры.',
    badge: 'Top roles',
    className: 'career tall',
    prompt: 'Маршруты для студентов, джунов, мидлов, менеджеров и тех, кто хочет сменить сферу.',
    icon: (
      <IconShell>
        <path d="M26 36h44a8 8 0 0 1 8 8v24a8 8 0 0 1-8 8H26a8 8 0 0 1-8-8V44a8 8 0 0 1 8-8Z" fill="none" stroke="url(#iconGradient)" strokeWidth="4" />
        <path d="M36 36v-4c0-6 4-10 10-10h4c6 0 10 4 10 10v4" fill="none" stroke="url(#iconGradient)" strokeWidth="4" />
        <path d="m58 24 18 10-18 10 6-10-6-10Z" fill="url(#iconGradient)" />
      </IconShell>
    ),
    branches: [
      {
        title: 'Поиск работы',
        subtitle: 'Вакансии и стратегия откликов',
        items: ['Как искать вакансии точечно', 'План откликов на 2 недели', 'Что писать в сопроводительном письме', 'Как анализировать требования вакансии'],
      },
      {
        title: 'Резюме и профиль',
        subtitle: 'Упаковка опыта',
        items: ['Резюме без опыта', 'Резюме для смены сферы', 'Оформление достижений', 'Прокачка LinkedIn и HH'],
      },
      {
        title: 'Собеседования',
        subtitle: 'Подготовка и уверенность',
        items: ['Ответы на сложные вопросы', 'Разбор кейсов', 'Техническое интервью', 'Поведение на финальном этапе'],
      },
      {
        title: 'Рост и переговоры',
        subtitle: 'Повышение, деньги, переходы',
        items: ['Как просить повышение', 'Переговоры по офферу', 'План развития на квартал', 'Когда менять компанию'],
      },
    ],
  },
  {
    id: 'education',
    navLabel: 'Образование',
    title: 'Образование',
    subtitle: 'ЕНТ/ЕГЭ • Курсы • Навыки',
    description: 'Подготовка к экзаменам, самообразование, учебные планы и сборка полезных навыков под реальные цели.',
    badge: 'Learning path',
    className: 'education tall',
    prompt: 'От школьной подготовки до переквалификации: понятные учебные ветки с конкретными действиями.',
    icon: (
      <IconShell>
        <path d="M18 34 48 20l30 14-30 14-30-14Z" fill="url(#iconGradient)" opacity="0.24" />
        <path d="M24 42v16c0 5 11 10 24 10s24-5 24-10V42" fill="none" stroke="url(#iconGradient)" strokeWidth="4" />
        <path d="M78 36v20" stroke="url(#iconGradient)" strokeWidth="4" strokeLinecap="round" />
      </IconShell>
    ),
    branches: [
      {
        title: 'Экзамены',
        subtitle: 'ЕНТ, ЕГЭ и вступительные',
        items: ['План подготовки на 90 дней', 'Как повторять без выгорания', 'Разбор слабых тем', 'Тренировочные варианты и тайминг'],
      },
      {
        title: 'Курсы и самообучение',
        subtitle: 'Освоение новой области',
        items: ['Как выбрать курс', 'Путь с нуля в новую профессию', 'Как не бросить обучение', 'Система заметок и конспектов'],
      },
      {
        title: 'Навыки',
        subtitle: 'Практика и закрепление',
        items: ['Английский по уровням', 'Цифровые навыки', 'Soft skills', 'Портфолио через мини-проекты'],
      },
      {
        title: 'Учебная система',
        subtitle: 'Дисциплина и организация',
        items: ['План недели для учебы', 'Как совмещать работу и обучение', 'Методы запоминания', 'Подготовка к дедлайнам и сессии'],
      },
    ],
  },
  {
    id: 'home',
    navLabel: 'Быт',
    title: 'Практика и дом',
    subtitle: 'Ремонт • Документы • Быт',
    description: 'Повседневная жизнь, дом, инструкции по ремонту, коммунальные вопросы, бумажные и цифровые дела.',
    badge: 'Daily ops',
    className: 'home wide',
    prompt: 'Практические инструкции для дома, документов, переезда, ремонта и бытовых проблем.',
    icon: (
      <IconShell>
        <path d="M18 50 48 24l30 26" fill="none" stroke="url(#iconGradient)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M28 46v24h40V46" fill="none" stroke="url(#iconGradient)" strokeWidth="4.5" strokeLinejoin="round" />
        <path d="m30 26 20 20" stroke="url(#iconGradient)" strokeWidth="6" strokeLinecap="round" />
        <path d="m46 22 8 8" stroke="url(#iconGradient)" strokeWidth="6" strokeLinecap="round" />
      </IconShell>
    ),
    branches: [
      {
        title: 'Ремонт',
        subtitle: 'Поломки и мелкие работы',
        items: ['Как починить кран', 'Электрика: базовая безопасность', 'Мелкий ремонт мебели', 'Список инструментов для дома'],
      },
      {
        title: 'Документы',
        subtitle: 'Справки, формы и процедуры',
        items: ['Какие документы нужны для разных задач', 'Проверка сроков и копий', 'Как собрать пакет документов', 'Цифровой архив дома'],
      },
      {
        title: 'Организация быта',
        subtitle: 'Рутина и порядок',
        items: ['План уборки', 'Покупки на неделю', 'Семейный календарь дел', 'Антикризисный домашний чек-лист'],
      },
      {
        title: 'Переезд и жилье',
        subtitle: 'Подготовка и контроль',
        items: ['Чек-лист переезда', 'Как выбрать аренду', 'Переезд без хаоса', 'Обязательные мелочи после заселения'],
      },
    ],
  },
  {
    id: 'mental',
    navLabel: 'Ментал',
    title: 'Ментальное здоровье',
    subtitle: 'Баланс • Сон • Медитация',
    description: 'Стабильность, режим, эмоциональная самопомощь, стресс-менеджмент и бережные повседневные практики.',
    badge: 'Mindful',
    className: 'mental',
    prompt: 'Повседневная поддержка для тревоги, усталости, сна, восстановления и личных границ.',
    icon: (
      <IconShell>
        <path d="M48 76c-18-10-28-22-28-34 0-10 8-18 18-18 6 0 10 3 14 8 4-5 8-8 14-8 10 0 18 8 18 18 0 12-10 24-28 34Z" fill="url(#iconGradient)" opacity="0.22" />
        <path d="M48 76c-18-10-28-22-28-34 0-10 8-18 18-18 6 0 10 3 14 8 4-5 8-8 14-8 10 0 18 8 18 18 0 12-10 24-28 34Z" fill="none" stroke="url(#iconGradient)" strokeWidth="4" />
        <path d="M34 50c5-4 10-6 14-6s9 2 14 6" stroke="url(#iconGradient)" strokeWidth="4" strokeLinecap="round" />
      </IconShell>
    ),
    branches: [
      {
        title: 'Эмоции и стресс',
        subtitle: 'Саморегуляция и устойчивость',
        items: ['Что делать при перегрузе', 'Техники заземления', 'Как проживать стресс', 'Мини-ритуалы восстановления'],
      },
      {
        title: 'Сон и энергия',
        subtitle: 'Режим и восстановление',
        items: ['Гигиена сна', 'Как восстановиться после бессонницы', 'Утренний запуск', 'Энергия без хаотичного режима'],
      },
      {
        title: 'Границы',
        subtitle: 'Люди и личное пространство',
        items: ['Как говорить нет', 'Сложные разговоры спокойно', 'Снижение эмоциональной нагрузки', 'Перестать брать лишнее на себя'],
      },
      {
        title: 'Осознанность',
        subtitle: 'Рефлексия и баланс',
        items: ['Ведение дневника', 'Базовые медитации', 'Чек-ин состояния', 'Неделя без выгорания'],
      },
    ],
  },
  {
    id: 'trends',
    navLabel: 'Тренды',
    title: 'Тренды и сленг',
    subtitle: 'Мемы • Культура • Digital',
    description: 'Новые слова, мемы, повестка, культурный контекст, цифровые явления и объяснение того, что сейчас обсуждают.',
    badge: 'Hot now',
    className: 'trends',
    prompt: 'Быстрые объяснения интернет-культуры, сленга, инфоповодов и того, как в этом ориентироваться.',
    icon: (
      <IconShell>
        <path d="M20 28h56a10 10 0 0 1 10 10v18a10 10 0 0 1-10 10H50L34 80v-14H20a10 10 0 0 1-10-10V38a10 10 0 0 1 10-10Z" fill="none" stroke="url(#iconGradient)" strokeWidth="4" strokeLinejoin="round" />
        <path d="m58 24 6 10h10l-8 8 4 12-12-7-12 7 4-12-8-8h10l6-10Z" fill="url(#iconGradient)" opacity="0.9" />
      </IconShell>
    ),
    branches: [
      {
        title: 'Сленг',
        subtitle: 'Новые слова и выражения',
        items: ['Что значит новое слово', 'Сленг поколений', 'Как использовать уместно', 'Разбор фраз из соцсетей'],
      },
      {
        title: 'Мемы',
        subtitle: 'Контекст и происхождение',
        items: ['Откуда мем появился', 'Почему это смешно', 'Как мем стал массовым', 'Словарь мем-культуры'],
      },
      {
        title: 'Digital-культура',
        subtitle: 'Платформы и форматы',
        items: ['Как работают новые платформы', 'Форматы контента', 'Паттерны внимания', 'Что важно для личного бренда'],
      },
      {
        title: 'Тренд-навигатор',
        subtitle: 'Быстро понять повестку',
        items: ['О чем все говорят', 'Как фильтровать шум', 'Тренды для работы', 'Тренды для учебы и контента'],
      },
    ],
  },
]

const stats = [
  { value: '24/7', label: 'под рукой' },
  { value: '6', label: 'ключевых сфер жизни' },
  { value: '96+', label: 'точек входа в инструкции' },
]

function App() {
  const [theme, setTheme] = useState<ThemeMode>('light')
  const [selectedModuleId, setSelectedModuleId] = useState<string>('finance')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const selectedModule = useMemo(
    () => modules.find((module) => module.id === selectedModuleId) ?? modules[0],
    [selectedModuleId],
  )

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
          {modules.map((module) => (
            <button
              key={module.id}
              className={`sidebar__link${selectedModuleId === module.id ? ' is-active' : ''}`}
              type="button"
              onClick={() => setSelectedModuleId(module.id)}
            >
              <span>{module.navLabel.slice(0, 2)}</span>
              <span>{module.navLabel}</span>
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
              Каждый модуль теперь раскрывается в полноценную карту подтем и практических
              сценариев, чтобы пользователь мог дойти от общего запроса до почти любой инструкции.
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
              <span>Сейчас открыт модуль</span>
              <strong>{selectedModule.title}</strong>
              <em>{selectedModule.prompt}</em>
            </div>
            <div className="preview-card preview-card--secondary">
              <span>Ветки внутри</span>
              <strong>{selectedModule.branches.length} направлений</strong>
            </div>
            <div className="orb orb--one" />
            <div className="orb orb--two" />
          </div>
        </section>

        <section className="bento-grid" aria-label="Главные модули">
          {modules.map((module) => (
            <button
              key={module.id}
              className={`module-card ${module.className}${selectedModuleId === module.id ? ' is-selected' : ''}`}
              type="button"
              onClick={() => setSelectedModuleId(module.id)}
            >
              <div className="module-card__glow" />
              <div className="module-card__header">
                {module.icon}
                <span className="module-card__badge">{module.badge}</span>
              </div>
              <div className="module-card__body">
                <h2>{module.title}</h2>
                <p className="module-card__subtitle">{module.subtitle}</p>
                <p className="module-card__description">{module.description}</p>
                <div className="module-card__microtopics">
                  {module.branches.slice(0, 3).map((branch) => (
                    <span key={branch.title}>{branch.title}</span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </section>

        <section className="topic-hub">
          <div className={`topic-hub__intro ${selectedModule.id}`}>
            <div>
              <p className="eyebrow">Подтемы</p>
              <h2>{selectedModule.title}</h2>
              <p>{selectedModule.prompt}</p>
            </div>
            <div className="topic-hub__summary">
              <span>Разветвленная структура</span>
              <strong>
                {selectedModule.branches.reduce((total, branch) => total + branch.items.length, 0)}+
                {' '}инструкций
              </strong>
            </div>
          </div>

          <div className="topic-grid" aria-label={`Подтемы модуля ${selectedModule.title}`}>
            {selectedModule.branches.map((branch) => (
              <button key={branch.title} type="button" className={`topic-card ${selectedModule.id}`}>
                <div className="topic-card__header">
                  <div>
                    <h3>{branch.title}</h3>
                    <p>{branch.subtitle}</p>
                  </div>
                  <span>{branch.items.length}</span>
                </div>
                <div className="topic-card__list">
                  {branch.items.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </button>
            ))}
          </div>
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
