'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

interface Topic {
  id: number
  name: string
  slug: string
  category: 'Data Structures' | 'Algorithms'
  solved: number
  total: number
}

const MOCK_TOPICS: Topic[] = [
  { id: 1, name: 'Arrays & Hashing', slug: 'arrays-hashing', category: 'Data Structures', solved: 45, total: 50 },
  { id: 2, name: 'Two Pointers', slug: 'two-pointers', category: 'Algorithms', solved: 18, total: 25 },
  { id: 3, name: 'Sliding Window', slug: 'sliding-window', category: 'Algorithms', solved: 12, total: 30 },
  { id: 4, name: 'Stack', slug: 'stack', category: 'Data Structures', solved: 22, total: 22 },
  { id: 5, name: 'Binary Search', slug: 'binary-search', category: 'Algorithms', solved: 5, total: 45 },
  { id: 6, name: 'Tries', slug: 'tries', category: 'Data Structures', solved: 0, total: 15 },
  { id: 7, name: 'Dynamic Programming', slug: 'dynamic-programming', category: 'Algorithms', solved: 28, total: 100 },
  { id: 8, name: 'Graphs & Trees', slug: 'graphs-trees', category: 'Data Structures', solved: 45, total: 50 },
]

const categoryStyles: Record<string, { label: string; labelClass: string }> = {
  'Data Structures': {
    label: 'Data Structures',
    labelClass: 'text-tertiary-fixed-dim bg-on-tertiary-fixed/30 border border-on-tertiary-fixed',
  },
  Algorithms: {
    label: 'Algorithms',
    labelClass: 'text-secondary-fixed-dim bg-on-secondary-fixed-variant/30 border border-on-secondary-fixed-variant',
  },
}

export default function TopicsPage() {
  const [topics, setTopics] = useState<Topic[]>(MOCK_TOPICS)
  const [query, setQuery] = useState('')

  const filtered = topics.filter((t) =>
    t.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow w-full px-md max-w-container-max mx-auto py-xl pt-[104px]">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-xl gap-md border-b border-outline-variant pb-md">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Directory</h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Master foundational structures and algorithmic patterns.
            </p>
          </div>
          <div className="flex gap-sm w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                search
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter topics..."
                className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface font-code-md text-code-md rounded-DEFAULT py-xs pl-xl pr-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
          {filtered.map((topic) => {
            const pct = topic.total > 0 ? Math.round((topic.solved / topic.total) * 100) : 0
            const style = categoryStyles[topic.category]
            const isComplete = pct === 100
            return (
              <Link
                key={topic.id}
                href={`/topics/${topic.slug}`}
                className={`group block bg-surface border border-outline-variant rounded-DEFAULT p-md hover:border-primary hover:bg-surface-container-low transition-all duration-200 relative overflow-hidden ${pct === 0 ? 'opacity-70 hover:opacity-100' : ''}`}
              >
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <div className="flex justify-between items-start mb-lg">
                  <span className={`font-label-caps text-label-caps px-2 py-1 rounded-sm ${style.labelClass}`}>
                    {style.label}
                  </span>
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors text-[20px]">
                    arrow_outward
                  </span>
                </div>
                <h2 className="font-headline-md text-headline-md text-on-surface mb-xl">{topic.name}</h2>
                <div className="flex flex-col gap-xs mt-auto">
                  <div className="flex justify-between items-end">
                    <span className="font-label-caps text-label-caps text-on-surface-variant">Mastery</span>
                    <span className="font-code-md text-code-md text-on-surface">
                      {topic.solved}/{topic.total}
                    </span>
                  </div>
                  <div className="w-full bg-surface-variant h-1 overflow-hidden">
                    <div
                      className={`h-full ${isComplete ? 'bg-secondary' : 'bg-primary'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </main>

      <Footer />
    </div>
  )
}
