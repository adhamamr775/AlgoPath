'use client';

import Navbar from '../../components/layout/Navbar';
import { useAuthStore } from '../../stores/authStore';
import styles from './page.module.css';

// Generate 60 days of mock heatmap data
const generateHeatmap = () => {
  return Array.from({ length: 60 }).map(() => Math.floor(Math.random() * 5));
};

export default function ProfilePage() {
  const { user } = useAuthStore();
  const heatmapData = generateHeatmap();

  const getHeatClass = (level: number) => {
    switch (level) {
      case 1: return styles.heatLevel1;
      case 2: return styles.heatLevel2;
      case 3: return styles.heatLevel3;
      case 4: return styles.heatLevel4;
      default: return '';
    }
  };

  return (
    <>
      <Navbar />
      <main className={styles.container}>
        
        {/* HERO */}
        <section className={`${styles.panel} ${styles.heroPanel}`}>
          <div className={styles.operatorInfo}>
            <div className={styles.avatar}>
              <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>terminal</span>
            </div>
            <div>
              <h1 className={styles.alias}>{user?.username || 'operator_42'}</h1>
              <div className={styles.rank}>SYS.RANK // ALGORITHMIC_ENGINEER</div>
            </div>
          </div>
          <div className={styles.statsGroup}>
            <div className={styles.statBox}>
              <span className={styles.statLabel}>Current Streak</span>
              <span className={`${styles.statValue} ${styles.emerald}`}>14 DAYS</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statLabel}>Global Rating</span>
              <span className={styles.statValue}>2140 ELO</span>
            </div>
          </div>
        </section>

        {/* TRENDS HEATMAP */}
        <section className={`${styles.panel} ${styles.trendsPanel}`}>
          <h2 className={styles.panelHeader}>Mastery Trends (Last 60 Days)</h2>
          <div className={styles.heatmapContainer}>
            <div className={styles.heatmapGrid}>
              {heatmapData.map((level, i) => (
                <div key={i} className={`${styles.heatCell} ${getHeatClass(level)}`} title={`${level} operations`} />
              ))}
            </div>
          </div>
        </section>

        {/* ACQUISITIONS */}
        <section className={`${styles.panel} ${styles.badgesPanel}`}>
          <h2 className={styles.panelHeader}>Acquisitions</h2>
          <div className={styles.badgeList}>
            <div className={styles.badge}>
              <div className={styles.badgeIcon}><span className="material-symbols-outlined">military_tech</span></div>
              <div className={styles.badgeInfo}>
                <strong>Century Mark</strong>
                <span>100 PROBLEMS SOLVED</span>
              </div>
            </div>
            <div className={styles.badge}>
              <div className={styles.badgeIcon} style={{ borderColor: '#4edea3', color: '#4edea3', backgroundColor: 'rgba(78, 222, 163, 0.1)' }}>
                <span className="material-symbols-outlined">memory</span>
              </div>
              <div className={styles.badgeInfo}>
                <strong>DP Specialist</strong>
                <span>LEVEL 5 CLEARANCE</span>
              </div>
            </div>
          </div>
        </section>

        {/* TRANSACTION LOG */}
        <section className={`${styles.panel} ${styles.logPanel}`}>
          <h2 className={styles.panelHeader}>Transaction Log // Recent</h2>
          <div className={styles.logList}>
            <div className={styles.logRow}>
              <div className={styles.logLeft}>
                <span className="material-symbols-outlined" style={{ color: '#4edea3' }}>check_circle</span>
                <span style={{ color: '#e2e2e8', fontWeight: 500 }}>Longest Increasing Subsequence</span>
              </div>
              <div className={styles.logRight}>
                <span className={styles.logTag}>O(N log N)</span>
                <span className={styles.time}>2 HRS AGO</span>
              </div>
            </div>
            <div className={styles.logRow}>
              <div className={styles.logLeft}>
                <span className="material-symbols-outlined" style={{ color: '#4edea3' }}>check_circle</span>
                <span style={{ color: '#e2e2e8', fontWeight: 500 }}>Network Delay Time</span>
              </div>
              <div className={styles.logRight}>
                <span className={styles.logTag}>DIJKSTRA</span>
                <span className={styles.time}>5 HRS AGO</span>
              </div>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}