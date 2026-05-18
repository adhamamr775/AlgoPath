'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '../../../services/auth.service';
import styles from './page.module.css';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await authService.register({ username, email, password });
      if (res.success) {
        router.push('/login');
      } else {
        setError(res.message || 'Registration failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to establish new credentials');
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.heroPanel}>
        <div className={styles.brand}>ALGOPATH // CORE</div>
        <h1 className={styles.heroTitle}>Master the Path.</h1>
        <p className={styles.heroCopy}>
          Curated training sequences for algorithmic mastery. Track problems, analyze patterns, and clear engineering protocols with absolute authority.
        </p>
        <div className={styles.statusRow}>
          <span className={styles.statusDot}>SYS_ONLINE</span>
          <span className={styles.statusCopy}>LATENCY: 12ms</span>
        </div>
      </section>

      <section className={styles.authPanel}>
        <div className={styles.tabRow}>
          <Link href="/login" className={styles.tab}>LOGIN</Link>
          <Link href="/register" className={`${styles.tab} ${styles.active}`}>REGISTER</Link>
        </div>

        <div className={styles.formHeader}>
          <h2>New Operator Provisioning</h2>
          <p>Establish terminal credentials to allocate a private database profile.</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Username</label>
            <input
              type="text"
              className={styles.input}
              placeholder="e.g. algo_wave"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              className={styles.input}
              placeholder="operator@algopath.net"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>PASSWORD</label>
            <input
              type="password"
              className={styles.input}
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={styles.primaryButton}>Register →</button>
        </form>
      </section>
    </main>
  );
}