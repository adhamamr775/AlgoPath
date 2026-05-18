'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { trackerService } from '@/services/tracker.service'

interface Video {
  id: number
  title: string
  duration: string
  type: string
  completed: boolean
  url: string
}

interface Problem {
  id: number
  title: string
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  completed: boolean
  url: string
}

interface TopicData {
  name: string
  masteryPercent: number
  videos: Video[]
  problems: Problem[]
}

const MOCK_DATA: TopicData = {
  name: 'Dynamic Programming',
  masteryPercent: 45,
  videos: [
    { id: 1, title: 'Memoization Fundamentals', duration: '24:15', type: 'Theory', completed: false, url: 'https://youtube.com' },
    { id: 2, title: 'Tabulation vs Memoization', duration: '18:30', type: 'Deep Dive', completed: false, url: 'https://youtube.com' },
    { id: 3, title: 'Introduction to DP State', duration: '12:05', type: 'Basics', completed: true, url: 'https://youtube.com' },
  ],
  problems: [
    { id: 1, title: 'Climbing Stairs', difficulty: 'EASY', completed: false, url: 'https://leetcode.com' },
    { id: 2, title: 'Coin Change', difficulty: 'MEDIUM', completed: false, url: 'https://leetcode.com' },
    { id: 3, title: 'Fibonacci Number', difficulty: 'EASY', completed: true, url: 'https://leetcode.com' },
    { id: 4, title: 'Longest Increasing Subsequence', difficulty: 'HARD', completed: false, url: 'https://leetcode.com' },
  ],
}

const difficultyColor: Record<string, string> = {
  EASY: 'text-secondary-fixed-dim',
  MEDIUM: 'text-primary-fixed-dim',
  HARD: 'text-tertiary-fixed-dim',
}

export default function TopicHubPage() {
  const { topic } = useParams<{ topic: string }>()
  const [data] = useState<TopicData>(MOCK_DATA)
  const [problems, setProblems] = useState<Problem[]>(MOCK_DATA.problems)
  const [videos, setVideos] = useState<Video[]>(MOCK_DATA.videos)

  useEffect(() => {
    // TODO: topicsService.getTopic(topic).then(...)
  }, [topic])

  const toggleProblem = async (id: number) => {
    setProblems((prev) => prev.map((p) => p.id === id ? { ...p, completed: !p.completed } : p))
    try {
      await trackerService.toggleProblem(id)
    } catch {
      setProblems((prev) => prev.map((p) => p.id === id ? { ...p, completed: !p.completed } : p))
    }
  }

  const toggleVideo = async (id: number) => {
    setVideos((prev) => prev.map((v) => v.id === id ? { ...v, completed: !v.completed } : v))
    try {
      await trackerService.toggleVideo(id)
    } catch {
      setVideos((prev) => prev.map((v) => v.id === id ? { ...v, completed: !v.completed } : v))
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow max-w-container-max mx-auto w-full px-lg pt-[80px] pb-xl flex flex-col gap-xl">
        {/* Topic Header */}
        <section className="flex flex-col gap-sm pt-md">
          <h1 className="font-headline-lg text-headline-lg hidden md:block">{data.name}</h1>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:hidden">{data.name}</h1>
          <div className="flex items-center gap-sm w-full max-w-2xl mt-xs">
            <div className="flex-grow h-[4px] bg-surface-variant rounded-DEFAULT overflow-hidden">
              <div className="h-full bg-primary" style={{ width: `${data.masteryPercent}%` }} />
            </div>
            <span className="font-code-md text-code-md text-on-surface-variant">{data.masteryPercent}%</span>
          </div>
        </section>

        {/* Split View */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-xl">

          {/* Video Resources */}
          <section className="flex flex-col gap-sm">
            <h2 className="font-headline-md text-headline-md mb-xs">Video Resources</h2>
            <div className="flex flex-col gap-unit">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className={`group flex items-center justify-between p-sm border rounded-DEFAULT transition-all duration-200 ${
                    video.completed
                      ? 'bg-transparent border-surface-variant opacity-50'
                      : 'bg-surface-container-low border-surface-variant hover:border-primary hover:shadow-[inset_0_0_0_1px_#adc6ff]'
                  }`}
                >
                  {/* Title opens URL in new tab */}
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col gap-xs flex-grow min-w-0"
                  >
                    <span className={`font-body-lg text-body-lg transition-colors ${
                      video.completed ? 'text-on-surface line-through' : 'text-on-surface group-hover:text-primary'
                    }`}>
                      {video.title}
                    </span>
                    <span className="font-code-md text-code-md text-on-surface-variant">
                      {video.duration} • {video.type}
                    </span>
                  </a>

                  {/* Check button marks as watched */}
                  <button
                    onClick={() => toggleVideo(video.id)}
                    title={video.completed ? 'Mark as unwatched' : 'Mark as watched'}
                    className="ml-sm flex-shrink-0 text-on-surface-variant hover:text-primary transition-colors"
                  >
                    <span
                      className="material-symbols-outlined"
                      style={video.completed ? { fontVariationSettings: "'FILL' 1" } : undefined}
                    >
                      check_circle
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Practice Problems */}
          <section className="flex flex-col gap-sm">
            <h2 className="font-headline-md text-headline-md mb-xs">Practice Problems</h2>
            <div className="flex flex-col gap-unit">
              {problems.map((problem) => (
                <div
                  key={problem.id}
                  className={`group flex items-center gap-sm p-sm border rounded-DEFAULT transition-all duration-200 ${
                    problem.completed
                      ? 'bg-transparent border-surface-variant opacity-50'
                      : 'bg-surface-container-low border-surface-variant hover:border-primary hover:shadow-[inset_0_0_0_1px_#adc6ff]'
                  }`}
                >
                  {/* Checkbox toggles completion */}
                  <button onClick={() => toggleProblem(problem.id)} className="flex-shrink-0">
                    {problem.completed ? (
                      <div className="w-5 h-5 bg-secondary rounded-xl flex items-center justify-center">
                        <span
                          className="material-symbols-outlined text-[14px] text-surface-dim"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          check
                        </span>
                      </div>
                    ) : (
                      <div className="w-5 h-5 border border-outline rounded-xl group-hover:border-primary transition-colors" />
                    )}
                  </button>

                  {/* Title/difficulty — opens problem URL in new tab */}
                  <a
                    href={problem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-grow flex items-center justify-between min-w-0"
                  >
                    <span className={`font-body-lg text-body-lg transition-colors ${
                      problem.completed ? 'text-on-surface line-through' : 'text-on-surface group-hover:text-primary'
                    }`}>
                      {problem.title}
                    </span>
                    <span className={`font-code-md text-code-md ${problem.completed ? 'line-through' : ''} ${difficultyColor[problem.difficulty]}`}>
                      {problem.difficulty}
                    </span>
                  </a>

                  <span className="material-symbols-outlined text-on-surface-variant text-sm opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    open_in_new
                  </span>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  )
}
