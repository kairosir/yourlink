import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import './App.css'

type ThemeMode = 'light' | 'dark'
type ViewMode = 'home' | 'module' | 'topic'

type GuideCard = {
  id: string
  title: string
  description: string
  checklist: string[]
  templates: string[]
}

type TopicBranch = {
  id: string
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

type SearchResult = {
  id: string
  kind: 'module' | 'topic' | 'guide'
  title: string
  subtitle: string
  moduleId: string
  topicId?: string
  guideId?: string
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
        id: 'budget',
        title: 'Личный бюджет',
        subtitle: 'Повседневные деньги и расходы',
        items: ['План бюджета на месяц', 'Учет трат по категориям', 'Подушка безопасности', 'Как сократить импульсные покупки'],
      },
      {
        id: 'debts',
        title: 'Кредиты и долги',
        subtitle: 'Нагрузка, ставки и реструктуризация',
        items: ['Как закрывать долги по приоритету', 'Сравнение кредитов', 'Рефинансирование', 'Переговоры с банком'],
      },
      {
        id: 'invest',
        title: 'Инвестиции',
        subtitle: 'Старт, риск и долгий горизонт',
        items: ['С чего начать инвестирование', 'Распределение портфеля', 'Риски и диверсификация', 'Инвестиции под цель'],
      },
      {
        id: 'income',
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
        id: 'job-search',
        title: 'Поиск работы',
        subtitle: 'Вакансии и стратегия откликов',
        items: ['Как искать вакансии точечно', 'План откликов на 2 недели', 'Что писать в сопроводительном письме', 'Как анализировать требования вакансии'],
      },
      {
        id: 'resume',
        title: 'Резюме и профиль',
        subtitle: 'Упаковка опыта',
        items: ['Резюме без опыта', 'Резюме для смены сферы', 'Оформление достижений', 'Прокачка LinkedIn и HH'],
      },
      {
        id: 'interviews',
        title: 'Собеседования',
        subtitle: 'Подготовка и уверенность',
        items: ['Ответы на сложные вопросы', 'Разбор кейсов', 'Техническое интервью', 'Поведение на финальном этапе'],
      },
      {
        id: 'growth',
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
        id: 'exams',
        title: 'Экзамены',
        subtitle: 'ЕНТ, ЕГЭ и вступительные',
        items: ['План подготовки на 90 дней', 'Как повторять без выгорания', 'Разбор слабых тем', 'Тренировочные варианты и тайминг'],
      },
      {
        id: 'courses',
        title: 'Курсы и самообучение',
        subtitle: 'Освоение новой области',
        items: ['Как выбрать курс', 'Путь с нуля в новую профессию', 'Как не бросить обучение', 'Система заметок и конспектов'],
      },
      {
        id: 'skills',
        title: 'Навыки',
        subtitle: 'Практика и закрепление',
        items: ['Английский по уровням', 'Цифровые навыки', 'Soft skills', 'Портфолио через мини-проекты'],
      },
      {
        id: 'study-system',
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
        id: 'repair',
        title: 'Ремонт',
        subtitle: 'Поломки и мелкие работы',
        items: ['Как починить кран', 'Электрика: базовая безопасность', 'Мелкий ремонт мебели', 'Список инструментов для дома'],
      },
      {
        id: 'docs',
        title: 'Документы',
        subtitle: 'Справки, формы и процедуры',
        items: ['Какие документы нужны для разных задач', 'Проверка сроков и копий', 'Как собрать пакет документов', 'Цифровой архив дома'],
      },
      {
        id: 'routine',
        title: 'Организация быта',
        subtitle: 'Рутина и порядок',
        items: ['План уборки', 'Покупки на неделю', 'Семейный календарь дел', 'Антикризисный домашний чек-лист'],
      },
      {
        id: 'moving',
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
        id: 'stress',
        title: 'Эмоции и стресс',
        subtitle: 'Саморегуляция и устойчивость',
        items: ['Что делать при перегрузе', 'Техники заземления', 'Как проживать стресс', 'Мини-ритуалы восстановления'],
      },
      {
        id: 'sleep',
        title: 'Сон и энергия',
        subtitle: 'Режим и восстановление',
        items: ['Гигиена сна', 'Как восстановиться после бессонницы', 'Утренний запуск', 'Энергия без хаотичного режима'],
      },
      {
        id: 'borders',
        title: 'Границы',
        subtitle: 'Люди и личное пространство',
        items: ['Как говорить нет', 'Сложные разговоры спокойно', 'Снижение эмоциональной нагрузки', 'Перестать брать лишнее на себя'],
      },
      {
        id: 'mindfulness',
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
        id: 'slang',
        title: 'Сленг',
        subtitle: 'Новые слова и выражения',
        items: ['Что значит новое слово', 'Сленг поколений', 'Как использовать уместно', 'Разбор фраз из соцсетей'],
      },
      {
        id: 'memes',
        title: 'Мемы',
        subtitle: 'Контекст и происхождение',
        items: ['Откуда мем появился', 'Почему это смешно', 'Как мем стал массовым', 'Словарь мем-культуры'],
      },
      {
        id: 'digital',
        title: 'Digital-культура',
        subtitle: 'Платформы и форматы',
        items: ['Как работают новые платформы', 'Форматы контента', 'Паттерны внимания', 'Что важно для личного бренда'],
      },
      {
        id: 'trend-map',
        title: 'Тренд-навигатор',
        subtitle: 'Быстро понять повестку',
        items: ['О чем все говорят', 'Как фильтровать шум', 'Тренды для работы', 'Тренды для учебы и контента'],
      },
    ],
  },
]

const stats = [
  { value: '24/7', label: 'под рукой' },
  { value: '6', label: 'главных направлений' },
  { value: '120+', label: 'тем и инструкций' },
]

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-zа-я0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
}

function buildGuides(module: ModuleCard, branch: TopicBranch): GuideCard[] {
  return branch.items.map((item, index) => ({
    id: `${branch.id}-${index}`,
    title: item,
    description: `${module.title}: ${branch.title}. Готовая карточка с последовательностью действий, быстрым чек-листом и шаблонами для старта без пустого экрана.`,
    checklist: [
      `Определи точную цель по теме «${item}»`,
      `Собери исходные данные и ограничения`,
      `Разбей задачу на 3 ближайших шага`,
      `Проверь риски, сроки и нужные ресурсы`,
      `Зафиксируй результат и следующий шаг`,
    ],
    templates: [
      `Шаблон плана: ${item}`,
      `Чек-лист подготовки: ${branch.title}`,
      `Краткий сценарий действий на 15 минут`,
    ],
  }))
}

function App() {
  const [theme, setTheme] = useState<ThemeMode>('light')
  const [view, setView] = useState<ViewMode>('home')
  const [selectedModuleId, setSelectedModuleId] = useState<string>('finance')
  const [selectedTopicId, setSelectedTopicId] = useState<string>('budget')
  const [query, setQuery] = useState('')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const deferredQuery = useDeferredValue(query)

  const selectedModule = useMemo(
    () => modules.find((module) => module.id === selectedModuleId) ?? modules[0],
    [selectedModuleId],
  )

  const selectedTopic = useMemo(
    () => selectedModule.branches.find((branch) => branch.id === selectedTopicId) ?? selectedModule.branches[0],
    [selectedModule, selectedTopicId],
  )

  const selectedGuides = useMemo(
    () => buildGuides(selectedModule, selectedTopic),
    [selectedModule, selectedTopic],
  )

  const searchIndex = useMemo<SearchResult[]>(() => {
    return modules.flatMap((module) => {
      const moduleResult: SearchResult = {
        id: `module-${module.id}`,
        kind: 'module',
        title: module.title,
        subtitle: module.subtitle,
        moduleId: module.id,
      }

      const topicResults = module.branches.flatMap((branch) => {
        const topicResult: SearchResult = {
          id: `topic-${module.id}-${branch.id}`,
          kind: 'topic',
          title: branch.title,
          subtitle: `${module.title} • ${branch.subtitle}`,
          moduleId: module.id,
          topicId: branch.id,
        }

        const guideResults = buildGuides(module, branch).map((guide) => ({
          id: `guide-${module.id}-${branch.id}-${guide.id}`,
          kind: 'guide' as const,
          title: guide.title,
          subtitle: `${module.title} • ${branch.title}`,
          moduleId: module.id,
          topicId: branch.id,
          guideId: guide.id,
        }))

        return [topicResult, ...guideResults]
      })

      return [moduleResult, ...topicResults]
    })
  }, [])

  const searchResults = useMemo(() => {
    const normalized = deferredQuery.trim().toLowerCase()
    if (!normalized) return []

    return searchIndex
      .filter((entry) => `${entry.title} ${entry.subtitle}`.toLowerCase().includes(normalized))
      .slice(0, 8)
  }, [deferredQuery, searchIndex])

  function openModule(moduleId: string) {
    const module = modules.find((entry) => entry.id === moduleId)
    if (!module) return

    setSelectedModuleId(module.id)
    setSelectedTopicId(module.branches[0].id)
    setView('module')
  }

  function openTopic(moduleId: string, topicId: string) {
    const module = modules.find((entry) => entry.id === moduleId)
    const topic = module?.branches.find((entry) => entry.id === topicId)
    if (!module || !topic) return

    setSelectedModuleId(module.id)
    setSelectedTopicId(topic.id)
    setView('topic')
  }

  function applySearchResult(result: SearchResult) {
    if (result.kind === 'module') {
      openModule(result.moduleId)
    } else {
      openTopic(result.moduleId, result.topicId ?? '')
    }

    setQuery('')
  }

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

        <div className="sidebar__compact">
          <span className="sidebar__chip">Home</span>
          <strong>Единый каталог инструкций</strong>
          <p>Главная, страницы модулей и страницы готовых карточек без раскрытия снизу.</p>
        </div>

        <div className="sidebar__quickstats">
          {stats.map((stat) => (
            <div key={stat.label} className="sidebar__stat">
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>

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
          <button type="button" className="logo logo--button" onClick={() => setView('home')}>
            <span className="logo__spark" />
            <span>NeuroLife</span>
          </button>

          <div className="search-wrap">
            <label className="search">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14Zm9 16-4.2-4.2" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Что нужно сегодня? Поиск по модулям, подтемам и инструкциям"
                aria-label="Глобальный поиск"
              />
            </label>

            {query.trim() ? (
              <div className="search-results" role="listbox" aria-label="Результаты поиска">
                {searchResults.length ? (
                  searchResults.map((result) => (
                    <button
                      key={result.id}
                      type="button"
                      className="search-result"
                      onClick={() => applySearchResult(result)}
                    >
                      <span className={`search-result__kind is-${result.kind}`}>{result.kind}</span>
                      <div>
                        <strong>{result.title}</strong>
                        <p>{result.subtitle}</p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="search-empty">Ничего не найдено. Попробуй другую формулировку.</div>
                )}
              </div>
            ) : null}
          </div>

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

        {view === 'home' ? (
          <>
            <section className="hero-panel">
              <div className="hero-panel__copy">
                <p className="eyebrow">НейроЖизнь 2026</p>
                <h1>Твой универсальный помощник по жизни</h1>
                <p className="hero-panel__subheadline">
                  Финансы • Карьера • Образование • Быт • Ментал • Тренды
                </p>
                <p className="hero-panel__description">
                  На главной только основные направления. Дальше каждый блок открывает свою
                  отдельную страницу с бенто-сеткой подтем, а затем отдельную страницу с готовыми
                  карточками-инструкциями, чек-листами и шаблонами.
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
                  <span>Маршрут</span>
                  <strong>Главный блок → Подтемы → Готовая инструкция</strong>
                  <em>Переход между уровнями идет как отдельные страницы внутри продукта.</em>
                </div>
                <div className="preview-card preview-card--secondary">
                  <span>Поиск</span>
                  <strong>Сразу ищет по всему сайту</strong>
                </div>
                <div className="orb orb--one" />
                <div className="orb orb--two" />
              </div>
            </section>

            <section className="bento-grid" aria-label="Главные модули">
              {modules.map((module) => (
                <button
                  key={module.id}
                  className={`module-card ${module.className}`}
                  type="button"
                  onClick={() => openModule(module.id)}
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
                        <span key={branch.id}>{branch.title}</span>
                      ))}
                    </div>
                  </div>
                </button>
              ))}
            </section>
          </>
        ) : null}

        {view === 'module' ? (
          <section className="page-shell">
            <div className={`page-hero ${selectedModule.id}`}>
              <button type="button" className="back-link" onClick={() => setView('home')}>
                ← Назад на главную
              </button>
              <p className="eyebrow">Раздел</p>
              <h2>{selectedModule.title}</h2>
              <p>{selectedModule.prompt}</p>
            </div>

            <div className="topic-grid page-grid">
              {selectedModule.branches.map((branch) => (
                <button
                  key={branch.id}
                  type="button"
                  className={`topic-card ${selectedModule.id}`}
                  onClick={() => openTopic(selectedModule.id, branch.id)}
                >
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
        ) : null}

        {view === 'topic' ? (
          <section className="page-shell">
            <div className={`page-hero ${selectedModule.id}`}>
              <div className="page-hero__breadcrumbs">
                <button type="button" className="back-link" onClick={() => setView('home')}>
                  Главная
                </button>
                <button type="button" className="back-link" onClick={() => setView('module')}>
                  {selectedModule.title}
                </button>
              </div>
              <p className="eyebrow">Подтема</p>
              <h2>{selectedTopic.title}</h2>
              <p>{selectedTopic.subtitle}. Ниже уже не список веток, а готовые карточки-инструкции и шаблоны.</p>
            </div>

            <div className="guide-grid">
              {selectedGuides.map((guide) => (
                <article key={guide.id} className={`guide-card ${selectedModule.id}`}>
                  <div className="guide-card__head">
                    <span className="guide-card__eyebrow">Инструкция</span>
                    <h3>{guide.title}</h3>
                    <p>{guide.description}</p>
                  </div>

                  <div className="guide-card__section">
                    <strong>Чек-лист</strong>
                    <ul>
                      {guide.checklist.map((step) => (
                        <li key={slugify(step)}>{step}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="guide-card__section">
                    <strong>Шаблоны</strong>
                    <div className="guide-card__templates">
                      {guide.templates.map((template) => (
                        <span key={template}>{template}</span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}
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
