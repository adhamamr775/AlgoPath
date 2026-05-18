'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation'; 
import { useAuthStore } from '../../stores/authStore';
import styles from './Navbar.module.css';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname(); 
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!mounted || !isAuthenticated) return null;

  // Helper function to dynamically add active styling rules
  const getLinkClass = (path: string) => {
    return pathname.startsWith(path) 
      ? `${styles.link} ${styles.activeLink}` 
      : styles.link;
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <Link href="/dashboard" className={styles.logo}>
          CODE_MASTERY
        </Link>
        <div className={styles.navLinks}>
          <Link href="/dashboard" className={getLinkClass('/dashboard')}>Dashboard</Link>
          <Link href="/problems" className={getLinkClass('/problems')}>Problems</Link>
          <Link href="/topics" className={getLinkClass('/topics')}>Topics</Link>
          <Link href="/learning" className={getLinkClass('/learning')}>Learning Hub</Link>
          
          {/* --- ADMIN & JUDGE HIDDEN GATEWAY --- */}
          {(user?.system_role === 'Admin' || user?.system_role === 'Judge') && (
            <Link 
              href="/admin" 
              className={getLinkClass('/admin')} 
              style={{ color: '#ffb4ab', fontWeight: 'bold' }}
            >
              [ ADMIN PANEL ]
            </Link>
          )}
        </div>
      </div>
      <div className={styles.right}>
        <button className={styles.iconButton} aria-label="Notifications">🔔</button>
        
        {/* --- FIXED: PROFILE IS NOW CLICKABLE --- */}
        <Link href="/profile" className={styles.profilePill}>
          <span>{user?.username?.charAt(0).toUpperCase() || 'O'}</span>
        </Link>
        
        <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
      </div>
    </nav>
  );
}