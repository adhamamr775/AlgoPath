'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../../components/layout/Navbar';
import apiClient from '../../../services/api-client';
import { trackerService } from '../../../services/tracker.service';
import styles from './page.module.css';

interface Resource {
  problem_id: number;
  title: string;
  problem_url: string;
  difficulty_rating: number;
  platform: string;
  is_completed: boolean;
}

export default function TopicHubPage() {
  const params = useParams();
  const topicSlug = params.topic as string;
  const formattedTitle = topicSlug.replace(/-/g, ' ');

  const [videos, setVideos] = useState<Resource[]>([]);
  const [problems, setProblems] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHubData = async () => {
      try {
        const res = await apiClient.get(`/topics/${topicSlug}`);
        if (res.data.success) {
          setVideos(res.data.data.videos || []);
          setProblems(res.data.data.problems || []);
        }
      } catch (error) {
        console.error('Failed to pull topic streams:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHubData();
  }, [topicSlug]);

  const handleToggle = async (id: number, type: 'video' | 'problem', currentStatus: boolean) => {
    const setter = type === 'video' ? setVideos : setProblems;
    setter(current => current.map(item => item.problem_id === id ? { ...item, is_completed: !currentStatus } : item));
    try {
      await trackerService.toggleProblem(id);
    } catch (error) {
      setter(current => current.map(item => item.problem_id === id ? { ...item, is_completed: currentStatus } : item));
    }
  };

  if (loading) return <><Navbar /><div className={styles.loading}>INITIALIZING SUBSYSTEM...</div></>;

  return (
    <>
      <Navbar />
      <main className={styles.container}>
        <Link href="/topics" className={styles.backLink}>
          <span className="material-symbols-outlined">arrow_back</span> Return to Directory
        </Link>
        <header className={styles.header}>
          <h1 className={styles.title}>{formattedTitle}</h1>
        </header>

        <div className={styles.splitLayout}>
          <section className={styles.column}>
            <div className={styles.columnHeader}>
              <span className={`material-symbols-outlined ${styles.columnIcon}`}>play_circle</span>
              <h2 className={styles.columnTitle}>Learning Matrix</h2>
            </div>
            {videos.length === 0 ? <p className={styles.loading}>No resources assigned yet.</p> : videos.map((video) => (
              <div key={video.problem_id} className={`${styles.card} ${video.is_completed ? styles.cardCompleted : ''}`}>
                <button className={`${styles.checkboxContainer} ${video.is_completed ? styles.checkboxCompleted : ''}`} onClick={() => handleToggle(video.problem_id, 'video', video.is_completed)}>
                  {video.is_completed && <span className={`material-symbols-outlined ${styles.checkIcon}`}>check</span>}
                </button>
                <div className={styles.cardContent}>
                  <div className={styles.cardTop}>
                    <a href={video.problem_url} target="_blank" rel="noopener noreferrer" className={`${styles.resourceTitle} ${video.is_completed ? styles.titleCompleted : ''}`}>{video.title}</a>
                    <span className={`${styles.badge} ${styles.platformBadge}`}>{video.platform}</span>
                  </div>
                </div>
              </div>
            ))}
          </section>

          <section className={styles.column}>
            <div className={styles.columnHeader}>
              <span className={`material-symbols-outlined ${styles.columnIcon}`}>code_blocks</span>
              <h2 className={styles.columnTitle}>Practice Array</h2>
            </div>
            {problems.length === 0 ? <p className={styles.loading}>No problems assigned yet.</p> : problems.map((problem) => (
              <div key={problem.problem_id} className={`${styles.card} ${problem.is_completed ? styles.cardCompleted : ''}`}>
                <button className={`${styles.checkboxContainer} ${problem.is_completed ? styles.checkboxCompleted : ''}`} onClick={() => handleToggle(problem.problem_id, 'problem', problem.is_completed)}>
                  {problem.is_completed && <span className={`material-symbols-outlined ${styles.checkIcon}`}>check</span>}
                </button>
                <div className={styles.cardContent}>
                  <div className={styles.cardTop}>
                    <a href={problem.problem_url} target="_blank" rel="noopener noreferrer" className={`${styles.resourceTitle} ${problem.is_completed ? styles.titleCompleted : ''}`}>{problem.title}</a>
                    <div className={styles.badgeGroup}>
                      <span className={`${styles.badge} ${styles.platformBadge}`}>{problem.platform}</span>
                      <span className={`${styles.badge} ${styles.difficultyBadge}`}>Rating: {problem.difficulty_rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </section>
        </div>
      </main>
    </>
  );
}