'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import { trackerService } from '../../services/tracker.service';
import { useAuthStore } from '../../stores/authStore';
import styles from './page.module.css';

interface TopicStat {
  topic: string;
  completed_count: number;
}

interface Stats {
  total_completed: number;
  topics: TopicStat[];
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await trackerService.getStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard protocols:', error);
    } finally {
      setLoading(false);
    }
  };

  // Dynamically calculate progress bar filling based on an target of 20 problems per topic
  const calculateProgress = (count: number) => {
    return Math.min((count / 20) * 100, 100);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className={styles.container}>
          <div className={styles.loading}>QUERYING WORKSPACE STATS...</div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className={styles.container}>
        
        {/* PLATFORM STATUS BAR */}
        <header className={styles.header}>
          <div>
            <div className={styles.kicker}>Platform Status</div>
            <div className={styles.statusValue}>{stats?.total_completed ?? 0}</div>
            <div className={styles.statusLabel}>Total Problems Solved</div>
          </div>
          <div className={styles.profileCard}>
            <span>Operator Identity</span>
            <strong>{user?.username ?? 'Unassigned'}</strong>
          </div>
        </header>

        {/* TOPIC MASTERY CORE ENGINE */}
        <section className={styles.sectionBox}>
          <div className={styles.sectionHeadingRow}>
            <div>
              <h2 className={styles.sectionTitle}>Topic Mastery Directory</h2>
              <p className={styles.sectionSubtitle}>Real-time depth evaluation metrics from your transaction history.</p>
            </div>
            <a href="/topics" className={styles.viewAll}>View All Profiles</a>
          </div>

          {stats && stats.topics && stats.topics.length > 0 ? (
            <div className={styles.topicsGrid}>
              {stats.topics.map((item, index) => {
                const percentage = calculateProgress(item.completed_count);
                
                return (
                  <div key={index} className={styles.topicCard}>
                    <div className={styles.topicHeader}>
                      <span>{item.topic}</span>
                      <span>{item.completed_count} / 20</span>
                    </div>
                    <div className={styles.progressBarContainer}>
                      <div 
                        className={styles.progressBarFill} 
                        style={{ width: `${percentage}%` }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={styles.emptyState}>
              NO PROTOCOLS EXECUTED. COMMENCE SYSTEM TRAINING TO POPULATE TRACKER.
            </div>
          )}
        </section>
      </main>
    </>
  );
}