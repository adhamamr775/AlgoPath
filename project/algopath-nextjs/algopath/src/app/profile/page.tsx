'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useAuthStore } from '@/stores/authStore'

interface ActivityItem {
  id: number
  title: string
  tag: string
  time: string
  completed: boolean
}

const MOCK_ACTIVITY: ActivityItem[] = [
  { id: 1, title: 'Longest Increasing Subsequence', tag: 'O(N log N)', time: '2 HRS AGO', completed: true },
  { id: 2, title: 'Network Delay Time', tag: 'DIJKSTRA', time: '5 HRS AGO', completed: true },
  { id: 3, title: 'Word Ladder II', tag: 'ATTEMPTED', time: '1 DAY AGO', completed: false },
]

const MASTERY = [
  { label: 'Dynamic Programming', pct: 82, color: 'bg-primary' },
  { label: 'Graph Theory', pct: 64, color: 'bg-secondary' },
]

// Generate 8 weeks of random heatmap data
const HEATMAP = Array.from({ length: 56 }, () => {
  const r = Math.random()
  if (r < 0.25) return 0
  if (r < 0.45) return 20
  if (r < 0.6) return 40
  if (r < 0.75) return 60
  if (r < 0.88) return 80
  return 100
})

export default function ProfilePage() {
  const { user } = useAuthStore()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow w-full max-w-container-max mx-auto px-md py-lg pt-[104px] grid grid-cols-1 md:grid-cols-12 gap-md">
        {/* Header / Operator ID */}
        <section className="col-span-1 md:col-span-12 bg-surface border border-outline-variant rounded p-md flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
          <div className="flex items-center gap-md">
            <div className="w-20 h-20 rounded-sm border border-outline-variant bg-surface-container overflow-hidden flex-shrink-0">
              <img
                src={user?.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${user?.username || 'operator'}`}
                alt="Avatar"
                className="w-full h-full object-cover grayscale opacity-80"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
                {user?.username || 'operator_42'}
              </h1>
              <span className="font-code-md text-code-md text-on-surface-variant mt-1">
                SYS.RANK // ALGORITHMIC_ENGINEER
              </span>
            </div>
          </div>

          <div className="flex gap-sm w-full md:w-auto">
            <div className="bg-surface-container-low border border-outline-variant rounded p-sm flex flex-col items-end flex-1 md:flex-none">
              <span className="font-label-caps text-label-caps text-on-surface-variant">CURRENT STREAK</span>
              <div className="flex items-baseline gap-xs mt-1">
                <span className="font-headline-md text-headline-md text-secondary">14</span>
                <span className="font-code-md text-code-md text-on-surface-variant">DAYS</span>
              </div>
            </div>
            <div className="bg-surface-container-low border border-outline-variant rounded p-sm flex flex-col items-end flex-1 md:flex-none">
              <span className="font-label-caps text-label-caps text-on-surface-variant">GLOBAL RATING</span>
              <div className="flex items-baseline gap-xs mt-1">
                <span className="font-headline-md text-headline-md text-primary">2140</span>
                <span className="font-code-md text-code-md text-on-surface-variant">ELO</span>
              </div>
            </div>
          </div>
        </section>

        {/* Mastery Trends */}
        <section className="col-span-1 md:col-span-8 flex flex-col gap-sm">
          <h2 className="font-label-caps text-label-caps text-on-surface-variant border-b border-outline-variant pb-xs">
            MASTERY TRENDS (LAST 60 DAYS)
          </h2>
          <div className="bg-surface border border-outline-variant rounded p-md flex flex-col gap-md">
            {/* Heatmap */}
            <div className="w-full overflow-x-auto no-scrollbar">
              <div
                className="inline-grid grid-rows-7 gap-[3px] grid-flow-col"
                style={{ minWidth: 'max-content' }}
              >
                {HEATMAP.map((intensity, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 rounded-[1px]"
                    style={{
                      backgroundColor:
                        intensity === 0
                          ? '#1a1c20'
                          : `rgba(173, 198, 255, ${intensity / 100})`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Topic breakdown */}
            {MASTERY.map((m) => (
              <div key={m.label} className="flex flex-col gap-xs">
                <div className="flex items-center justify-between text-on-surface-variant">
                  <span className="font-body-sm text-body-sm">{m.label}</span>
                  <span className="font-code-md text-code-md">{m.pct}%</span>
                </div>
                <div className="w-full h-1 bg-surface-container-high overflow-hidden">
                  <div className={`h-full ${m.color}`} style={{ width: `${m.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Badges */}
        <section className="col-span-1 md:col-span-4 flex flex-col gap-sm">
          <h2 className="font-label-caps text-label-caps text-on-surface-variant border-b border-outline-variant pb-xs">
            ACQUISITIONS
          </h2>
          <div className="flex flex-col gap-sm">
            <div className="bg-surface-container-low border border-outline-variant rounded p-sm flex items-center gap-sm">
              <div className="w-10 h-10 border border-primary text-primary flex items-center justify-center rounded-sm bg-primary/10">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
              </div>
              <div className="flex flex-col">
                <span className="font-body-sm text-body-sm font-semibold text-on-surface">Century Mark</span>
                <span className="font-label-caps text-label-caps text-on-surface-variant mt-[2px]">100 PROBLEMS SOLVED</span>
              </div>
            </div>
            <div className="bg-surface-container-low border border-outline-variant rounded p-sm flex items-center gap-sm">
              <div className="w-10 h-10 border border-secondary text-secondary flex items-center justify-center rounded-sm bg-secondary/10">
                <span className="material-symbols-outlined">memory</span>
              </div>
              <div className="flex flex-col">
                <span className="font-body-sm text-body-sm font-semibold text-on-surface">DP Specialist</span>
                <span className="font-label-caps text-label-caps text-on-surface-variant mt-[2px]">LEVEL 5 CLEARANCE</span>
              </div>
            </div>
            <div className="bg-surface border border-outline-variant border-dashed rounded p-sm flex items-center gap-sm opacity-50">
              <div className="w-10 h-10 border border-outline text-outline flex items-center justify-center rounded-sm">
                <span className="material-symbols-outlined">lock</span>
              </div>
              <div className="flex flex-col">
                <span className="font-body-sm text-body-sm font-semibold text-on-surface">Graph Master</span>
                <span className="font-label-caps text-label-caps text-on-surface-variant mt-[2px]">IN PROGRESS</span>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="col-span-1 md:col-span-12 mt-md flex flex-col gap-sm">
          <h2 className="font-label-caps text-label-caps text-on-surface-variant border-b border-outline-variant pb-xs">
            TRANSACTION LOG // RECENT
          </h2>
          <div className="flex flex-col gap-[1px] bg-outline-variant border border-outline-variant rounded overflow-hidden">
            {MOCK_ACTIVITY.map((item) => (
              <a
                key={item.id}
                href="#"
                className="bg-surface hover:bg-surface-container-high transition-colors p-sm flex flex-col md:flex-row justify-between md:items-center gap-sm border-l-2 border-l-transparent hover:border-l-primary group"
              >
                <div className="flex items-center gap-sm">
                  <span
                    className={`material-symbols-outlined ${item.completed ? 'text-secondary' : 'text-outline'}`}
                  >
                    {item.completed ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface group-hover:text-primary transition-colors">
                    {item.title}
                  </span>
                </div>
                <div className="flex items-center gap-md">
                  <span
                    className={`font-code-md text-code-md px-xs py-[2px] rounded border ${
                      item.completed
                        ? 'text-on-surface-variant bg-surface-container-low border-outline-variant'
                        : 'text-outline bg-surface-container-lowest border-outline-variant border-dashed'
                    }`}
                  >
                    {item.tag}
                  </span>
                  <span className="font-label-caps text-label-caps text-outline w-24 text-right">{item.time}</span>
                </div>
              </a>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
