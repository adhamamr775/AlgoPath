'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../components/layout/Navbar';
import styles from './page.module.css';
import apiClient from '@/services/api-client';
import { useAuthStore } from '../../stores/authStore'; 

interface TopicStat {
  tag_id: number;
  name: string;      
  category?: string; 
  completed_count?: number; 
  total_problems?: number;  
}

export default function TopicsDirectoryPage() {
  const { user } = useAuthStore(); 
  const [topics, setTopics] = useState<TopicStat[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        // Bulletproof check: grab either format your store uses
        const currentUserId =  user?.user_id;

        const url = currentUserId 
          ? `/tags?category=algorithm&userId=${currentUserId}` 
          : `/tags?category=algorithm`;

        const res = await apiClient.get(url); 
        if (res.data.success) {
          setTopics(res.data.data);
        }
      } catch (error) {
        console.error('Failed to load topics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, [user]); // Re-run if user changes

  const filteredTopics = topics.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <><Navbar /><div className={styles.loading}>LOADING SYSTEM DATA...</div></>;

  return (
    <>
      <Navbar />
      <main className={styles.container}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Topics Directory</h1>
            <p className={styles.subtitle}>Select a core discipline sequence to begin processing.</p>
          </div>
          <div className={styles.searchBox}>
            <span className={`material-symbols-outlined ${styles.searchIcon}`}>search</span>
            <input 
              type="text" 
              className={styles.searchInput} 
              placeholder="Filter modules..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </header>

        <div className={styles.grid}>
          {filteredTopics.length === 0 ? (
            <div className={styles.emptyState}>NO MATCHING CHANNELS FOUND.</div>
          ) : (
            filteredTopics.map((item) => {
              const urlFriendlyName = item.name.toLowerCase().replace(/\s+/g, '-');
              
              const completedCount = item.completed_count || 0;
              const totalProblems = item.total_problems || 0;
              
              const mathTotal = totalProblems === 0 ? 1 : totalProblems;
              const percentage = Math.min((completedCount / mathTotal) * 100, 100);

              const dataStructures = ['data structures', 'arrays', 'graphs', 'trees', 'hash tables', 'linked lists', 'stacks', 'queues'];
              const isDataStructure = dataStructures.includes(item.name.toLowerCase());
              const tagClass = isDataStructure ? styles.tagDS : styles.tagAlgo;
              const tagLabel = isDataStructure ? 'DATA STRUCTURE' : 'ALGORITHMIC MODULE';

              return (
                <Link key={item.tag_id} href={`/topics/${urlFriendlyName}`} className={styles.card}>
                  <div className={styles.cardTop}>
                    <span className={`${styles.tag} ${tagClass}`}>{tagLabel}</span>
                    <span className={`material-symbols-outlined ${styles.cardIcon}`}>arrow_forward</span>
                  </div>
                  <h2 className={styles.cardTitle}>{item.name}</h2>
                  
                  <div className={styles.cardBottom}>
                    <div className={styles.progressLabel}>
                      <span>Mastery Level</span>
                      <span>{completedCount} / {totalProblems}</span>
                    </div>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </main>
    </>
  );
}