'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { trackerService } from '@/services/tracker.service'

interface Stats {
  totalSolved: number
  categoryProgress: { name: string; percent: number; color: string }[]
  topics: { name: string; solved: number; total: number; slug: string }[]
}

const MOCK_STATS: Stats = {
  totalSolved: 142,
  categoryProgress: [
    { name: 'Algorithms', percent: 65, color: 'bg-primary-container' },
    { name: 'Data Structures', percent: 82, color: 'bg-secondary' },
    { name: 'Mathematics', percent: 30, color: 'bg-primary-container' },
  ],
  topics: [
    { name: 'Graphs & Trees', solved: 45, total: 50, slug: 'graphs-trees' },
    { name: 'Dynamic Programming', solved: 28, total: 100, slug: 'dynamic-programming' },
    { name: 'Greedy Algorithms', solved: 15, total: 20, slug: 'greedy-algorithms' },
    { name: 'String Manipulation', solved: 32, total: 40, slug: 'string-manipulation' },
    { name: 'Bit Manipulation', solved: 10, total: 15, slug: 'bit-manipulation' },
    { name: 'Two Pointers', solved: 12, total: 35, slug: 'two-pointers' },
  ],
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>(MOCK_STATS)

  useEffect(() => {
    trackerService.getStats()
      .then((data) => setStats(data))
      .catch(() => {/* use mock */})
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow w-full max-w-container-max mx-auto px-lg pt-[104px] pb-xl flex flex-col gap-xl">
        {/* Hero metric */}
        <section className="w-full border border-outline-variant bg-surface-container-low p-lg flex flex-col gap-unit">
          <h2 className="font-code-md text-code-md text-on-surface-variant uppercase tracking-widest">
            Platform Status
          </h2>
          <div className="flex items-baseline gap-sm">
            <span className="font-headline-lg text-headline-lg text-primary">{stats.totalSolved}</span>
            <span className="font-body-lg text-body-lg text-on-surface">Total Problems Solved</span>
          </div>
        </section>

        {/* Overall Progress */}
        <section className="flex flex-col gap-md">
          <h3 className="font-headline-md text-headline-md text-on-surface border-b border-outline-variant pb-xs">
            Overall Progress
          </h3>
          <div className="flex flex-col gap-sm">
            {stats.categoryProgress.map((cat) => (
              <div key={cat.name} className="flex items-center gap-md">
                <span className="w-[120px] font-body-sm text-body-sm text-on-surface-variant">{cat.name}</span>
                <div className="flex-grow h-[4px] bg-surface-variant overflow-hidden">
                  <div className={`h-full ${cat.color}`} style={{ width: `${cat.percent}%` }} />
                </div>
                <span
                  className={`w-[48px] text-right font-code-md text-code-md ${
                    cat.color === 'bg-secondary' ? 'text-secondary' : 'text-primary'
                  }`}
                >
                  {cat.percent}%
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Topic Mastery Grid */}
        <section className="flex flex-col gap-md">
          <div className="flex justify-between items-end border-b border-outline-variant pb-xs">
            <h3 className="font-headline-md text-headline-md text-on-surface">Topic Mastery</h3>
            <Link href="/topics" className="font-code-md text-code-md text-primary hover:underline">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-sm">
            {stats.topics.map((topic) => {
              const pct = Math.round((topic.solved / topic.total) * 100)
              return (
                <Link
                  key={topic.slug}
                  href={`/topics/${topic.slug}`}
                  className="group block bg-surface border border-outline-variant p-md hover:border-primary-container hover:bg-surface-container-highest transition-all duration-200"
                >
                  <div className="flex justify-between items-start mb-md">
                    <span className="font-body-lg text-body-lg text-on-surface group-hover:text-primary transition-colors">
                      {topic.name}
                    </span>
                    <span className="font-code-md text-code-md text-on-surface-variant">
                      {topic.solved}/{topic.total}
                    </span>
                  </div>
                  <div className="w-full h-[4px] bg-surface-variant overflow-hidden">
                    <div className="h-full bg-primary-container" style={{ width: `${pct}%` }} />
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
