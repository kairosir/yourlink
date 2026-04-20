import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import './App.css'

type ThemeMode = 'light' | 'dark'
type SearchKind = 'all' | 'module' | 'topic' | 'guide'

type Stat = {
  value: string
  label: string
}

type TopicBranch = {
  id: string
  title: string
  subtitle: string
  items: string[]
}

type ModuleContent = {
  id: string
  title: string
  subtitle: string
  description: string
  badge: string
  prompt: string
  branches: TopicBranch[]
}

type SiteContent = {
  stats: Stat[]
  modules: ModuleContent[]
}

type GuideCard = {
  id: string
  title: string
  description: string
  summary: string
  outcome: string
  checklist: string[]
  materials: string[]
  steps: { title: string; body: string }[]
  templates: string[]
  imageTitle: string
  imageCaption: string
}

type SearchResult = {
  id: string
  kind: Exclude<SearchKind, 'all'>
  title: string
  subtitle: string
  href: string
}

type ModuleVisual = {
  className: string
  icon: ReactNode
}

const filterOptions: { value: SearchKind; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'module', label: 'Модули' },
  { value: 'topic', label: 'Подтемы' },
  { value: 'guide', label: 'Инструкции' },
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

const moduleVisuals: Record<string, ModuleVisual> = {
  finance: {
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
  career: {
    className: 'career tall',
    icon: (
      <IconShell>
        <path d="M26 36h44a8 8 0 0 1 8 8v24a8 8 0 0 1-8 8H26a8 8 0 0 1-8-8V44a8 8 0 0 1 8-8Z" fill="none" stroke="url(#iconGradient)" strokeWidth="4" />
        <path d="M36 36v-4c0-6 4-10 10-10h4c6 0 10 4 10 10v4" fill="none" stroke="url(#iconGradient)" strokeWidth="4" />
        <path d="m58 24 18 10-18 10 6-10-6-10Z" fill="url(#iconGradient)" />
      </IconShell>
    ),
  },
  education: {
    className: 'education tall',
    icon: (
      <IconShell>
        <path d="M18 34 48 20l30 14-30 14-30-14Z" fill="url(#iconGradient)" opacity="0.24" />
        <path d="M24 42v16c0 5 11 10 24 10s24-5 24-10V42" fill="none" stroke="url(#iconGradient)" strokeWidth="4" />
        <path d="M78 36v20" stroke="url(#iconGradient)" strokeWidth="4" strokeLinecap="round" />
      </IconShell>
    ),
  },
  home: {
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
  mental: {
    className: 'mental',
    icon: (
      <IconShell>
        <path d="M48 76c-18-10-28-22-28-34 0-10 8-18 18-18 6 0 10 3 14 8 4-5 8-8 14-8 10 0 18 8 18 18 0 12-10 24-28 34Z" fill="url(#iconGradient)" opacity="0.22" />
        <path d="M48 76c-18-10-28-22-28-34 0-10 8-18 18-18 6 0 10 3 14 8 4-5 8-8 14-8 10 0 18 8 18 18 0 12-10 24-28 34Z" fill="none" stroke="url(#iconGradient)" strokeWidth="4" />
        <path d="M34 50c5-4 10-6 14-6s9 2 14 6" stroke="url(#iconGradient)" strokeWidth="4" strokeLinecap="round" />
      </IconShell>
    ),
  },
  trends: {
    className: 'trends',
    icon: (
      <IconShell>
        <path d="M20 28h56a10 10 0 0 1 10 10v18a10 10 0 0 1-10 10H50L34 80v-14H20a10 10 0 0 1-10-10V38a10 10 0 0 1 10-10Z" fill="none" stroke="url(#iconGradient)" strokeWidth="4" strokeLinejoin="round" />
        <path d="m58 24 6 10h10l-8 8 4 12-12-7-12 7 4-12-8-8h10l6-10Z" fill="url(#iconGradient)" opacity="0.9" />
      </IconShell>
    ),
  },
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-zа-я0-9]+/gi, '-').replace(/^-+|-+$/g, '')
}

function moduleHref(moduleId: string) {
  return `/module/${moduleId}`
}

function topicHref(moduleId: string, topicId: string) {
  return `/module/${moduleId}/topic/${topicId}`
}

function guideHref(moduleId: string, topicId: string, guideId: string) {
  return `/module/${moduleId}/topic/${topicId}/guide/${guideId}`
}

function searchHref(query: string, filter: SearchKind = 'all') {
  const params = new URLSearchParams()
  if (query) params.set('q', query)
  if (filter !== 'all') params.set('type', filter)
  return `/search?${params.toString()}`
}

function getModuleVisual(moduleId: string) {
  return moduleVisuals[moduleId] ?? { className: '', icon: null }
}

function buildGuides(module: ModuleContent, branch: TopicBranch): GuideCard[] {
  return branch.items.map((item, index) => ({
    id: `${branch.id}-${index}`,
    title: item,
    description: `${module.title}: ${branch.title}. Полная инструкция с логикой подготовки, порядком действий и шаблонами.`,
    summary: `Эта инструкция помогает пройти тему «${item}» без хаоса: сначала подготовка, затем базовая реализация, проверка результата и фиксация следующего шага.`,
    outcome: `На выходе у пользователя есть понятный результат по теме «${item}», список действий и готовая структура для повторения сценария в будущем.`,
    checklist: [
      `Определи точную цель по теме «${item}»`,
      `Собери исходные данные и ограничения`,
      `Разбей задачу на 3 ближайших шага`,
      `Проверь риски, сроки и нужные ресурсы`,
      `Зафиксируй результат и следующий шаг`,
    ],
    materials: [
      `Базовая информация по теме «${item}»`,
      'Любые исходные документы, заметки или цифры',
      '15-30 минут на первичную настройку',
    ],
    steps: [
      {
        title: 'Подготовка контекста',
        body: `Сначала зафиксируй, зачем тебе нужен сценарий «${item}», какие есть ограничения и что уже готово. Это убирает лишние действия и помогает не расползаться по смежным задачам.`,
      },
      {
        title: 'Сбор ключевых данных',
        body: 'Собери минимальный набор данных, без которых нельзя двигаться дальше: цифры, сроки, документы, ссылки, прошлый опыт или текущие проблемы.',
      },
      {
        title: 'Запуск базового решения',
        body: `Сделай первую рабочую версию без перфекционизма. Для темы «${item}» важнее получить действующий черновик, чем пытаться сразу собрать идеальную систему.`,
      },
      {
        title: 'Проверка и улучшение',
        body: 'Проверь, что решение действительно работает в жизни: удобно ли им пользоваться, хватает ли информации, нет ли слабых мест. После этого улучши только 1-2 самых заметных участка.',
      },
    ],
    templates: [
      `Шаблон плана: ${item}`,
      `Чек-лист подготовки: ${branch.title}`,
      'Краткий сценарий действий на 15 минут',
    ],
    imageTitle: `Визуальная схема: ${item}`,
    imageCaption: `Иллюстрация показывает поток «подготовка → действие → проверка → результат» для темы «${item}».`,
  }))
}

function findModule(modules: ModuleContent[], moduleId?: string) {
  return modules.find((module) => module.id === moduleId)
}

function findTopic(module: ModuleContent | undefined, topicId?: string) {
  return module?.branches.find((branch) => branch.id === topicId)
}

function findGuide(module: ModuleContent | undefined, topic: TopicBranch | undefined, guideId?: string) {
  if (!module || !topic) return undefined
  return buildGuides(module, topic).find((guide) => guide.id === guideId)
}

function buildSearchIndex(modules: ModuleContent[]): SearchResult[] {
  return modules.flatMap((module) => {
    const moduleResult: SearchResult = {
      id: `module-${module.id}`,
      kind: 'module',
      title: module.title,
      subtitle: module.subtitle,
      href: moduleHref(module.id),
    }

    const nestedResults = module.branches.flatMap((branch) => {
      const topicResult: SearchResult = {
        id: `topic-${module.id}-${branch.id}`,
        kind: 'topic',
        title: branch.title,
        subtitle: `${module.title} • ${branch.subtitle}`,
        href: topicHref(module.id, branch.id),
      }

      const guideResults = buildGuides(module, branch).map((guide) => ({
        id: `guide-${module.id}-${branch.id}-${guide.id}`,
        kind: 'guide' as const,
        title: guide.title,
        subtitle: `${module.title} • ${branch.title}`,
        href: guideHref(module.id, branch.id, guide.id),
      }))

      return [topicResult, ...guideResults]
    })

    return [moduleResult, ...nestedResults]
  })
}

function highlightText(text: string, query: string) {
  if (!query.trim()) return text
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const parts = text.split(new RegExp(`(${escaped})`, 'ig'))
  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? <mark key={`${part}-${index}`}>{part}</mark> : part,
  )
}

function filterResults(results: SearchResult[], query: string, filter: SearchKind) {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return []

  return results.filter((entry) => {
    const matchesType = filter === 'all' || entry.kind === filter
    const matchesText = `${entry.title} ${entry.subtitle}`.toLowerCase().includes(normalized)
    return matchesType && matchesText
  })
}

function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="breadcrumbs" aria-label="Хлебные крошки">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="breadcrumbs__item">
          {item.href ? <Link to={item.href}>{item.label}</Link> : <span>{item.label}</span>}
          {index < items.length - 1 ? <span className="breadcrumbs__sep">/</span> : null}
        </span>
      ))}
    </nav>
  )
}

function HomePage({ stats, modules }: { stats: Stat[]; modules: ModuleContent[] }) {
  return (
    <>
      <section className="hero-panel">
        <div className="hero-panel__copy">
          <p className="eyebrow">НейроЖизнь 2026</p>
          <h1>Твой универсальный помощник по жизни</h1>
          <p className="hero-panel__subheadline">
            Финансы • Карьера • Образование • Быт • Ментал • Тренды
          </p>
          <p className="hero-panel__description">
            Контент теперь живет отдельно от кода: модули, подтемы и инструкции можно
            редактировать через CMS, а сайт автоматически читает свежие данные из одного источника.
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
            <span>CMS режим</span>
            <strong>Контент редактируется отдельно от интерфейса</strong>
            <em>Главная, разделы, подтемы и страницы инструкций собираются из одного JSON-источника.</em>
          </div>
          <div className="preview-card preview-card--secondary">
            <span>Админка</span>
            <strong>/admin</strong>
          </div>
          <div className="orb orb--one" />
          <div className="orb orb--two" />
        </div>
      </section>

      <section className="bento-grid" aria-label="Главные модули">
        {modules.map((module) => {
          const visual = getModuleVisual(module.id)

          return (
            <Link key={module.id} className={`module-card ${visual.className}`} to={moduleHref(module.id)}>
              <div className="module-card__glow" />
              <div className="module-card__header">
                {visual.icon}
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
            </Link>
          )
        })}
      </section>
    </>
  )
}

function ModulePage({ modules }: { modules: ModuleContent[] }) {
  const { moduleId } = useParams()
  const module = findModule(modules, moduleId)

  if (!module) return <Navigate to="/" replace />

  return (
    <section className="page-shell">
      <div className={`page-hero ${module.id}`}>
        <Breadcrumbs items={[{ label: 'Главная', href: '/' }, { label: module.title }]} />
        <p className="eyebrow">Раздел</p>
        <h2>{module.title}</h2>
        <p>{module.prompt}</p>
      </div>

      <div className="topic-grid page-grid">
        {module.branches.map((branch) => (
          <Link key={branch.id} className={`topic-card ${module.id}`} to={topicHref(module.id, branch.id)}>
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
          </Link>
        ))}
      </div>
    </section>
  )
}

function TopicPage({ modules }: { modules: ModuleContent[] }) {
  const { moduleId, topicId } = useParams()
  const module = findModule(modules, moduleId)
  const topic = findTopic(module, topicId)

  if (!module || !topic) return <Navigate to={module ? moduleHref(module.id) : '/'} replace />

  const guides = buildGuides(module, topic)

  return (
    <section className="page-shell">
      <div className={`page-hero ${module.id}`}>
        <Breadcrumbs
          items={[
            { label: 'Главная', href: '/' },
            { label: module.title, href: moduleHref(module.id) },
            { label: topic.title },
          ]}
        />
        <p className="eyebrow">Подтема</p>
        <h2>{topic.title}</h2>
        <p>{topic.subtitle}. Ниже каталог отдельных инструкций. Клик по любой карточке открывает полноценную страницу с детальным разбором.</p>
      </div>

      <div className="guide-grid">
        {guides.map((guide) => (
          <Link key={guide.id} to={guideHref(module.id, topic.id, guide.id)} className={`guide-card ${module.id}`}>
            <div className="guide-card__head">
              <span className="guide-card__eyebrow">Инструкция</span>
              <h3>{guide.title}</h3>
              <p>{guide.description}</p>
            </div>

            <div className="guide-card__section">
              <strong>Что внутри</strong>
              <div className="guide-card__templates">
                <span>Полная страница</span>
                <span>Пошаговый план</span>
                <span>Шаблоны и чек-листы</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

function GuidePage({ modules }: { modules: ModuleContent[] }) {
  const { moduleId, topicId, guideId } = useParams()
  const module = findModule(modules, moduleId)
  const topic = findTopic(module, topicId)
  const guide = findGuide(module, topic, guideId)

  if (!module || !topic || !guide) {
    return <Navigate to={topicId && module ? topicHref(module.id, topicId) : module ? moduleHref(module.id) : '/'} replace />
  }

  return (
    <section className="page-shell">
      <div className={`page-hero ${module.id}`}>
        <Breadcrumbs
          items={[
            { label: 'Главная', href: '/' },
            { label: module.title, href: moduleHref(module.id) },
            { label: topic.title, href: topicHref(module.id, topic.id) },
            { label: guide.title },
          ]}
        />
        <p className="eyebrow">Полная инструкция</p>
        <h2>{guide.title}</h2>
        <p>{guide.summary}</p>
      </div>

      <section className="instruction-layout">
        <article className={`instruction-page ${module.id}`}>
          <div className="instruction-page__hero">
            <div>
              <span className="guide-card__eyebrow">Подробный разбор</span>
              <h3>{guide.imageTitle}</h3>
              <p>{guide.imageCaption}</p>
            </div>
            <div className="instruction-visual" aria-hidden="true">
              <div className="instruction-visual__frame">
                <div className="instruction-visual__orbit instruction-visual__orbit--one" />
                <div className="instruction-visual__orbit instruction-visual__orbit--two" />
                <div className="instruction-visual__card">Start</div>
                <div className="instruction-visual__card">Build</div>
                <div className="instruction-visual__card">Check</div>
                <div className="instruction-visual__card">Done</div>
              </div>
            </div>
          </div>

          <div className="instruction-page__content">
            <section className="instruction-section">
              <h3>Что получится в итоге</h3>
              <p>{guide.outcome}</p>
            </section>

            <section className="instruction-section">
              <h3>Что подготовить заранее</h3>
              <ul>
                {guide.materials.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="instruction-section">
              <h3>Пошаговая инструкция</h3>
              <div className="instruction-steps">
                {guide.steps.map((step, index) => (
                  <article key={step.title} className="instruction-step">
                    <span className="instruction-step__number">{index + 1}</span>
                    <div>
                      <h4>{step.title}</h4>
                      <p>{step.body}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </article>

        <aside className="instruction-sidebar">
          <section className="instruction-sidecard">
            <h3>Быстрый чек-лист</h3>
            <ul>
              {guide.checklist.map((step) => (
                <li key={slugify(step)}>{step}</li>
              ))}
            </ul>
          </section>

          <section className="instruction-sidecard">
            <h3>Шаблоны</h3>
            <div className="guide-card__templates">
              {guide.templates.map((template) => (
                <span key={template}>{template}</span>
              ))}
            </div>
          </section>
        </aside>
      </section>
    </section>
  )
}

function SearchPage({ searchIndex }: { searchIndex: SearchResult[] }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const filter = (searchParams.get('type') as SearchKind | null) ?? 'all'
  const results = useMemo(() => filterResults(searchIndex, query, filter), [searchIndex, query, filter])

  return (
    <section className="page-shell">
      <div className="page-hero search-page-hero">
        <Breadcrumbs items={[{ label: 'Главная', href: '/' }, { label: 'Поиск' }]} />
        <p className="eyebrow">Поиск</p>
        <h2>Результаты по сайту</h2>
        <p>
          Запрос: <strong>{query || 'пусто'}</strong>. Найдено: {results.length}
        </p>
      </div>

      <div className="search-filters">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`filter-chip${filter === option.value ? ' is-active' : ''}`}
            onClick={() =>
              setSearchParams(
                query
                  ? { q: query, ...(option.value !== 'all' ? { type: option.value } : {}) }
                  : option.value !== 'all'
                    ? { type: option.value }
                    : {},
              )
            }
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="search-page-results">
        {results.length ? (
          results.map((result) => (
            <Link key={result.id} to={result.href} className={`search-page-card is-${result.kind}`}>
              <div className="search-page-card__meta">
                <span className={`search-result__kind is-${result.kind}`}>{result.kind}</span>
              </div>
              <h3>{highlightText(result.title, query)}</h3>
              <p>{highlightText(result.subtitle, query)}</p>
            </Link>
          ))
        ) : (
          <div className="search-empty search-empty--page">Ничего не найдено. Попробуй сократить запрос или сменить фильтр.</div>
        )}
      </div>
    </section>
  )
}

function ContentStatus({ error }: { error: string | null }) {
  return (
    <section className="page-shell">
      <div className="page-hero search-page-hero">
        <p className="eyebrow">Контент</p>
        <h2>{error ? 'Не удалось загрузить контент' : 'Загрузка контента'}</h2>
        <p>{error ?? 'Сайт поднимает структуру модулей и инструкций из CMS-источника.'}</p>
      </div>
    </section>
  )
}

function AppShell() {
  const [theme, setTheme] = useState<ThemeMode>('light')
  const [query, setQuery] = useState('')
  const [content, setContent] = useState<SiteContent | null>(null)
  const [contentError, setContentError] = useState<string | null>(null)
  const deferredQuery = useDeferredValue(query)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    if (!location.pathname.startsWith('/search')) setQuery('')
  }, [location.pathname])

  useEffect(() => {
    let cancelled = false

    async function loadContent() {
      try {
        const response = await fetch('/content/site.json')
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const data = (await response.json()) as SiteContent
        if (!cancelled) {
          setContent(data)
          setContentError(null)
        }
      } catch (error) {
        if (!cancelled) setContentError(error instanceof Error ? error.message : 'Unknown error')
      }
    }

    void loadContent()

    return () => {
      cancelled = true
    }
  }, [])

  const searchIndex = useMemo(() => buildSearchIndex(content?.modules ?? []), [content])
  const previewResults = useMemo(() => filterResults(searchIndex, deferredQuery, 'all').slice(0, 6), [searchIndex, deferredQuery])

  function openSearchResult(href: string) {
    navigate(href)
    setQuery('')
  }

  function submitSearch() {
    const normalized = query.trim()
    if (!normalized) return
    navigate(searchHref(normalized))
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
          <span className="sidebar__chip">CMS</span>
          <strong>Контент отдельно от кода</strong>
          <p>
            Основной источник данных: `/content/site.json`. Админка для редактирования:
            {' '}<a href="/admin/" className="sidebar__link-inline">/admin</a>
          </p>
        </div>

        <div className="sidebar__quickstats">
          {(content?.stats ?? []).map((stat) => (
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
          <Link to="/" className="logo">
            <span className="logo__spark" />
            <span>NeuroLife</span>
          </Link>

          <div className="search-wrap">
            <label className="search">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14Zm9 16-4.2-4.2" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    submitSearch()
                  }
                }}
                placeholder="Что нужно сегодня? Поиск по модулям, подтемам и инструкциям"
                aria-label="Глобальный поиск"
              />
              <button type="button" className="search-submit" onClick={submitSearch}>
                Найти
              </button>
            </label>

            {query.trim() ? (
              <div className="search-results" role="listbox" aria-label="Результаты поиска">
                {previewResults.length ? (
                  <>
                    {previewResults.map((result) => (
                      <button
                        key={result.id}
                        type="button"
                        className="search-result"
                        onClick={() => openSearchResult(result.href)}
                      >
                        <span className={`search-result__kind is-${result.kind}`}>{result.kind}</span>
                        <div>
                          <strong>{highlightText(result.title, query)}</strong>
                          <p>{highlightText(result.subtitle, query)}</p>
                        </div>
                      </button>
                    ))}
                    <button type="button" className="search-more" onClick={submitSearch}>
                      Показать все результаты
                    </button>
                  </>
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

        {!content ? (
          <ContentStatus error={contentError} />
        ) : (
          <Routes>
            <Route path="/" element={<HomePage stats={content.stats} modules={content.modules} />} />
            <Route path="/module/:moduleId" element={<ModulePage modules={content.modules} />} />
            <Route path="/module/:moduleId/topic/:topicId" element={<TopicPage modules={content.modules} />} />
            <Route path="/module/:moduleId/topic/:topicId/guide/:guideId" element={<GuidePage modules={content.modules} />} />
            <Route path="/search" element={<SearchPage searchIndex={searchIndex} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
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

export default function App() {
  return <AppShell />
}
