'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../components/layout/Navbar';
import apiClient from '../../services/api-client';
import styles from './page.module.css';

interface Tag {
  tag_id: number;
  name: string;
}

export default function LearningHubPage() {
  const [stacks, setStacks] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  

  useEffect(() => {
    const fetchStacks = async () => {
      try {
        // FIX: Ask the backend ONLY for the 'stack' category
        const res = await apiClient.get('/tags?category=stack');
        if (res.data.success) {
          setStacks(res.data.data);
        }
      } catch (error) {
        console.error('Failed to load matrix:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStacks();
  }, []);

  if (loading) return <><Navbar /><div className={styles.loading}>ACCESSING REPOSITORIES...</div></>;

  return (
    <>
      <Navbar />
      <main className={styles.container}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Engineering Stack Matrix</h1>
            <p className={styles.subtitle}>Select a technology block to access curated blueprints and documentation.</p>
          </div>
        </header>

        <div className={styles.grid}>
          {stacks.length === 0 ? (
            <p style={{ color: '#8c909f' }}>No modules initialized yet.</p>
          ) : (
            stacks.map((stack) => {
              // Convert "Node.js" to "node-js" for the URL
              const slug = stack.name.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '-');
              
              return (
                <Link key={stack.tag_id} href={`/learning/${slug}`} className={styles.card}>
                  <div className={styles.cardTop}>
                    <span className={styles.categoryBadge}>MODULE</span>
                    <span className={`material-symbols-outlined ${styles.cardIcon}`}>arrow_forward</span>
                  </div>
                  <h2 className={styles.techName}>{stack.name}</h2>
                  <p className={styles.description}>Access curated resources for {stack.name}.</p>
                </Link>
              );
            })
          )}
        </div>
      </main>
    </>
  );
}