'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

interface Problem {
  id: number
  number: number
  title: string
  topic: string
  topics: string[]
  difficulty: 'Easy' | 'Medium' | 'Hard'
  completed: boolean
  acceptance: number
}

const MOCK_PROBLEMS: Problem[] = [
  { id: 1, number: 1, title: 'Two Sum', topic: 'Arrays & Hashing', topics: ['Arrays & Hashing'], difficulty: 'Easy', completed: true, acceptance: 98 },
  { id: 2, number: 167, title: 'Two Sum II - Input Array Is Sorted', topic: 'Two Pointers', topics: ['Two Pointers'], difficulty: 'Medium', completed: false, acceptance: 87 },
  { id: 3, number: 15, title: '3Sum', topic: 'Two Pointers', topics: ['Two Pointers'], difficulty: 'Medium', completed: false, acceptance: 72 },
  { id: 4, number: 42, title: 'Trapping Rain Water', topic: 'Two Pointers', topics: ['Two Pointers', 'Stack'], difficulty: 'Hard', completed: false, acceptance: 94 },
  { id: 5, number: 20, title: 'Valid Parentheses', topic: 'Stack', topics: ['Stack'], difficulty: 'Easy', completed: false, acceptance: 89 },
]

const ALL_TOPICS = ['Arrays & Hashing', 'Two Pointers', 'Sliding Window', 'Stack', 'Binary Search']
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'] as const

const difficultyColor: Record<string, string> = {
  Easy: 'text-secondary',
  Medium: 'text-primary',
  Hard: 'text-error',
}

export default function ProblemsPage() {
  const [problems] = useState<Problem[]>(MOCK_PROBLEMS)
  const [search, setSearch] = useState('')
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const PER_PAGE = 20

  const toggleTopic = (t: string) =>
    setSelectedTopics((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t])

  const filtered = problems.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase())
    const matchTopic = selectedTopics.length === 0 || p.topics.some((t) => selectedTopics.includes(t))
    const matchDiff = !selectedDifficulty || p.difficulty === selectedDifficulty
    return matchSearch && matchTopic && matchDiff
  })

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow w-full max-w-container-max mx-auto px-md pt-[80px] pb-lg flex flex-col md:flex-row gap-lg">
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0 flex flex-col gap-md pt-lg">
          {/* Search */}
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search problems..."
              className="w-full bg-surface-container-lowest border border-outline-variant rounded pl-[40px] pr-sm py-xs text-on-surface font-code-md text-code-md placeholder:text-outline focus:border-primary focus:ring-0 focus:outline-none transition-colors"
            />
          </div>

          {/* Topics Filter */}
          <div className="bg-surface-container rounded border border-outline-variant p-sm flex flex-col gap-sm">
            <h3 className="font-label-caps text-label-caps text-outline uppercase tracking-wider mb-xs">Topics</h3>
            {ALL_TOPICS.map((t) => {
              const checked = selectedTopics.includes(t)
              return (
                <label key={t} className="flex items-center gap-xs cursor-pointer group" onClick={() => toggleTopic(t)}>
                  <div
                    className={`w-5 h-5 rounded-[6px] border flex items-center justify-center transition-colors ${
                      checked
                        ? 'bg-secondary-container border-secondary-container'
                        : 'border-outline-variant bg-surface-container-lowest group-hover:border-primary'
                    }`}
                  >
                    {checked && (
                      <span
                        className="material-symbols-outlined text-[14px] text-on-secondary-container"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        check
                      </span>
                    )}
                  </div>
                  <span className={`font-body-sm text-body-sm transition-colors ${checked ? 'text-on-surface' : 'text-on-surface-variant group-hover:text-on-surface'}`}>
                    {t}
                  </span>
                </label>
              )
            })}
          </div>

          {/* Difficulty Filter */}
          <div className="bg-surface-container rounded border border-outline-variant p-sm flex flex-col gap-sm">
            <h3 className="font-label-caps text-label-caps text-outline uppercase tracking-wider mb-xs">Difficulty</h3>
            <div className="flex gap-xs flex-wrap">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDifficulty(selectedDifficulty === d ? null : d)}
                  className={`px-sm py-[4px] rounded border font-label-caps text-label-caps transition-colors ${
                    selectedDifficulty === d
                      ? `${difficultyColor[d]} border-current bg-current/10`
                      : `${difficultyColor[d]} border-current hover:bg-current/10`
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Problem List */}
        <section className="flex-grow flex flex-col gap-sm pt-lg">
          <div className="flex items-center justify-between pb-xs border-b border-outline-variant mb-xs">
            <div className="font-headline-md text-headline-md text-on-surface">
              Problems{' '}
              <span className="text-outline font-body-sm text-body-sm ml-xs">({filtered.length})</span>
            </div>
            <div className="flex items-center gap-xs text-outline font-body-sm text-body-sm">
              <span>Sort by:</span>
              <button className="flex items-center gap-1 hover:text-on-surface transition-colors">
                Difficulty <span className="material-symbols-outlined text-[18px]">arrow_drop_down</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-unit">
            {filtered.map((p) => (
              <a
                key={p.id}
                href="#"
                className={`group flex items-center justify-between bg-surface-container-lowest border border-outline-variant rounded p-sm hover:border-primary transition-all duration-200 hover:bg-surface-container relative overflow-hidden ${p.completed ? 'opacity-50' : ''}`}
              >
                <div className="flex items-center gap-sm z-10">
                  <div
                    className={`w-5 h-5 rounded-[6px] flex-shrink-0 flex items-center justify-center transition-all ${
                      p.completed
                        ? 'bg-secondary-container border border-secondary-container'
                        : 'border border-outline-variant bg-surface-container-lowest group-hover:border-primary'
                    }`}
                  >
                    {p.completed && (
                      <span
                        className="material-symbols-outlined text-[14px] text-on-secondary-container"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        check
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-[2px]">
                    <span className={`font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors ${p.completed ? 'line-through' : ''}`}>
                      {p.number}. {p.title}
                    </span>
                    <div className="flex items-center gap-xs">
                      {p.topics.map((t, i) => (
                        <span key={t} className="font-code-md text-code-md text-outline">
                          {i > 0 && <span className="mr-xs">•</span>}
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-md z-10">
                  <span className={`font-label-caps text-label-caps ${difficultyColor[p.difficulty]}`}>
                    {p.difficulty}
                  </span>
                  <div className="hidden sm:flex items-center gap-1 text-outline">
                    <span className="material-symbols-outlined text-[16px]">thumb_up</span>
                    <span className="font-code-md text-code-md">{p.acceptance}%</span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-sm mt-md">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="w-8 h-8 rounded border border-outline-variant flex items-center justify-center text-outline hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <span className="font-code-md text-code-md text-on-surface">{page} / 15</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              className="w-8 h-8 rounded border border-outline-variant flex items-center justify-center text-on-surface hover:border-primary hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
