'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import { problemsService } from '../../services/problems.service';
import { trackerService } from '../../services/tracker.service';
import styles from './page.module.css';

interface Problem {
  problem_id: number;
  title: string;
  problem_url: string;
  difficulty_rating: number; // e.g. 1000, 1500, etc.
  platform: string;
  tags: string | null;
  is_completed: boolean;
}

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const res = await problemsService.getProblems();
      if (res.success) {
        setProblems(res.data);
      }
    } catch (error) {
      console.error('Error fetching problems:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id: number, currentStatus: boolean, e: React.MouseEvent) => {
    e.preventDefault(); // Stop link redirect
    
    // Optimistic UI update
    setProblems(currentProblems => 
      currentProblems.map(p => p.problem_id === id ? { ...p, is_completed: !currentStatus } : p)
    );

    try {
      await trackerService.toggleProblem(id);
    } catch (error) {
      // Revert on failure
      setProblems(currentProblems => 
        currentProblems.map(p => p.problem_id === id ? { ...p, is_completed: currentStatus } : p)
      );
    }
  };

  // Helper to map rating numbers to string labels for styling
  const getDifficulty = (rating: number) => {
    if (rating < 1300) return { label: 'Easy', class: styles.textEasy };
    if (rating < 1800) return { label: 'Medium', class: styles.textMedium };
    return { label: 'Hard', class: styles.textHard };
  };

  if (loading) return <><Navbar /><div className={styles.loading}>ESTABLISHING CONNECTION...</div></>;

  return (
    <>
      <Navbar />
      <main className={styles.container}>
        
        {/* LEFT SIDEBAR: FILTERS */}
        <aside className={styles.sidebar}>
          <div className={styles.searchWrapper}>
            <span className={`material-symbols-outlined ${styles.searchIcon}`}>search</span>
            <input 
              type="text" 
              className={styles.searchInput} 
              placeholder="Search sequence..." 
            />
          </div>

          <div className={styles.filterBox}>
            <h3 className={styles.filterHeader}>Difficulty Parameters</h3>
            <div className={styles.difficultyPills}>
              <button className={`${styles.pill} ${styles.pillEasy}`}>Easy</button>
              <button className={`${styles.pill} ${styles.pillMedium}`}>Medium</button>
              <button className={`${styles.pill} ${styles.pillHard}`}>Hard</button>
            </div>
          </div>
          
          <div className={styles.filterBox}>
            <h3 className={styles.filterHeader}>Topics</h3>
            <span className={styles.metaInfo}>Coming soon.</span>
          </div>
        </aside>

        {/* MAIN LIST AREA */}
        <section className={styles.mainContent}>
          <div className={styles.listHeader}>
            <h1 className={styles.listTitle}>Problems Directory</h1>
            <span className={styles.listCount}>({problems.length} ENTRIES)</span>
          </div>

          <div className={styles.problemList}>
            {problems.length === 0 ? (
              <div className={styles.loading}>NO PROTOCOLS FOUND.</div>
            ) : (
              problems.map(problem => {
                const diff = getDifficulty(problem.difficulty_rating);
                
                return (
                  <a 
                    key={problem.problem_id}
                    href={problem.problem_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.itemRow} ${problem.is_completed ? styles.completed : ''}`}
                  >
                    <button 
                      className={`${styles.checkboxBtn} ${problem.is_completed ? styles.checkboxBtnChecked : ''}`}
                      onClick={(e) => handleToggle(problem.problem_id, problem.is_completed, e)}
                    >
                      {problem.is_completed && <span className={`material-symbols-outlined ${styles.checkmark}`}>check</span>}
                    </button>
                    
                    <div className={styles.rowContent}>
                      <span className={styles.linkText}>{problem.title}</span>
                      <span className={styles.metaInfo}>
                        {problem.tags ? problem.tags.replace(/,/g, ' • ') : problem.platform}
                      </span>
                    </div>

                    <div className={styles.rightData}>
                      <span className={`${styles.difficultyText} ${diff.class}`}>
                        {diff.label}
                      </span>
                      <span className={`material-symbols-outlined ${styles.metaInfo}`}>open_in_new</span>
                    </div>
                  </a>
                );
              })
            )}
          </div>
        </section>

      </main>
    </>
  );
}