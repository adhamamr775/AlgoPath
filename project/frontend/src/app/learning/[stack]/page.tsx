'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '../../../components/layout/Navbar';
import apiClient from '../../../services/api-client';
import styles from './page.module.css';

interface Resource {
  problem_id: number;
  title: string;
  problem_url: string;
  platform: string;
  resource_type: string;
}

export default function StackPage() {
  const params = useParams();
  const stackSlug = params.stack as string;
  
  // Display name: node-js -> NODE JS
  const stackName = stackSlug.replace(/-/g, ' ').toUpperCase();

  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await apiClient.get(`/topics/${stackSlug}`);
        
        if (res.data.success) {
          // FIX: The backend already filtered these into a 'videos' key!
          // We don't need to .filter() on the frontend anymore.
          setResources(res.data.data.videos || []);
        }
      } catch (error) {
        console.error("Failed to load stack resources:", error);
      } finally {
        setLoading(false);
      }
    };

    if (stackSlug) {
      fetchResources();
    }
  }, [stackSlug]);

  if (loading) return <><Navbar /><div className={styles.loading}>ACCESSING DATABANKS...</div></>;

  return (
    <>
      <Navbar />
      <main style={{ padding: '4rem 5%', minHeight: '100vh', backgroundColor: '#0a0a0f', color: '#e2e2e8' }}>
        <header style={{ borderBottom: '1px solid #2a2d35', paddingBottom: '2rem', marginBottom: '2rem' }}>
          <span style={{ color: '#4edea3', letterSpacing: '2px', fontSize: '0.8rem', fontWeight: 'bold' }}>
            SYSTEM MODULE // {stackSlug.toUpperCase()}
          </span>
          <h1 style={{ fontSize: '2.5rem', color: '#fff', marginTop: '0.5rem' }}>{stackName}</h1>
          <p style={{ color: '#8c909f', marginTop: '1rem' }}>Curated engineering masterclasses and technical documentation.</p>
        </header>

        <div>
          {resources.length === 0 ? (
            <div style={{ padding: '3rem', border: '1px dashed #2a2d35', borderRadius: '12px', textAlign: 'center' }}>
              <p style={{ color: '#8c909f', marginBottom: '1rem' }}>No learning resources detected in the database for this module.</p>
              <span style={{ color: '#4edea3', fontSize: '0.8rem' }}>AWAITING ADMIN INJECTION...</span>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {resources.map((res) => (
                <a 
                  key={res.problem_id} 
                  href={res.problem_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    display: 'block', 
                    padding: '1.5rem', 
                    backgroundColor: '#111317', 
                    border: '1px solid #2a2d35', 
                    borderRadius: '8px', 
                    textDecoration: 'none',
                    transition: 'transform 0.2s ease, border-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#4edea3';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#2a2d35';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{ color: '#4edea3', fontSize: '0.7rem', border: '1px solid #4edea3', padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase' }}>
                      {res.platform}
                    </span>
                  </div>
                  <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.8rem', lineHeight: '1.4' }}>{res.title}</h3>
                  <div style={{ color: '#4edea3', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Access Resource 
                    <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>open_in_new</span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}