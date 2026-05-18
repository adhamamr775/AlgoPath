'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import apiClient from '../../services/api-client';
import { useAuthStore } from '../../stores/authStore';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

interface Tag {
  tag_id: number;
  name: string;
}

export default function AdminPanel() {
  const { user } = useAuthStore();
  const router = useRouter();

  if (user && user.system_role !== 'Admin' && user.system_role !== 'Judge') {
    router.push('/dashboard');
    return null;
  }

  // State for Dropdown Tags
  const [tags, setTags] = useState<Tag[]>([]);

  // State for Resource Form
  const [resourceData, setResourceData] = useState({
    title: '', url: '', platform: 'YouTube', type: 'learning', tagId: '',
  });
  const [resourceStatus, setResourceStatus] = useState('');

  // State for Topic Form
  const [topicName, setTopicName] = useState('');
  const [topicCategory, setTopicCategory] = useState(''); // NEW: Category State
  const [topicStatus, setTopicStatus] = useState('');

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await apiClient.get('/tags');
        if (res.data.success) setTags(res.data.data);
      } catch (error) {
        console.error("Failed to load tags");
      }
    };
    fetchTags();
  }, []);

  // --- HANDLER: ADD TOPIC ---
  const handleAddTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    setTopicStatus('Initializing module...');
    try {
      // NEW: Sending category along with the name
      const res = await apiClient.post('/admin/add-topic', { 
        name: topicName, 
        category: topicCategory 
      });
      
      if (res.data.success) {
        setTopicStatus('Module initialized!');
        // Instantly add the new topic to the dropdown!
        setTags([...tags, res.data.data]); 
        setTopicName(''); 
        setTopicCategory(''); // Clear the category input
      }
    } catch (error: any) {
      setTopicStatus(error.response?.data?.message || 'Failed to initialize module.');
    }
  };

  // --- HANDLER: ADD RESOURCE ---
  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resourceData.tagId) {
      setResourceStatus('Error: Select a Target Topic.');
      return;
    }
    setResourceStatus('Injecting into Matrix...');
    try {
      const res = await apiClient.post('/admin/add-resource', resourceData);
      if (res.data.success) {
        setResourceStatus('Resource successfully injected!');
        setResourceData({ ...resourceData, title: '', url: '' });
      }
    } catch (error) {
      setResourceStatus('Failed to add resource. Check permissions.');
    }
  };

  return (
    <>
      <Navbar />
      <main className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>System Control // Admin</h1>
          <p className={styles.subtitle}>Authorized personnel only. Expand the learning matrix.</p>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* PANEL 1: ADD NEW TOPIC */}
          <section className={styles.formSection}>
            <h2 className={styles.subtitle} style={{ color: '#4edea3', marginBottom: '1.5rem', borderBottom: '1px dashed #4edea3', paddingBottom: '0.5rem' }}>
               [ 1 ] Initialize New Module
            </h2>
            <form onSubmit={handleAddTopic} className={styles.form}>
              <div className={styles.row}>
                
                <div className={styles.inputGroup} style={{ flex: 1.5 }}>
                  <label>Module / Topic Name</label>
                  <input 
                    type="text" required 
                    value={topicName} 
                    onChange={(e) => setTopicName(e.target.value)}
                    placeholder="e.g., Segment Trees"
                  />
                </div>

                {/* NEW: Manual Category Input */}
                <div className={styles.inputGroup} style={{ flex: 1.5 }}>
                  <label>Category (Manual Entry)</label>
                  <input 
                    type="text" required 
                    value={topicCategory} 
                    onChange={(e) => setTopicCategory(e.target.value)}
                    placeholder="e.g., algorithm, stack, database..."
                  />
                </div>

                <button type="submit" className={styles.submitBtn} style={{ flex: 1, borderColor: '#4edea3', color: '#4edea3' }}>
                  CREATE TOPIC
                </button>

              </div>
              {topicStatus && <p className={styles.statusMsg} style={{ color: '#4edea3' }}>{topicStatus}</p>}
            </form>
          </section>

          {/* PANEL 2: ADD NEW RESOURCE */}
          <section className={styles.formSection}>
            <h2 className={styles.subtitle} style={{ color: '#ffb4ab', marginBottom: '1.5rem', borderBottom: '1px dashed #ffb4ab', paddingBottom: '0.5rem' }}>
               [ 2 ] Inject Resource
            </h2>
            <form onSubmit={handleAddResource} className={styles.form}>
              <div className={styles.inputGroup}>
                <label>Resource Title</label>
                <input 
                  type="text" required value={resourceData.title} 
                  onChange={(e) => setResourceData({...resourceData, title: e.target.value})}
                  placeholder="e.g., Dynamic Programming Masterclass"
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Resource URL</label>
                <input 
                  type="url" required value={resourceData.url} 
                  onChange={(e) => setResourceData({...resourceData, url: e.target.value})}
                  placeholder="https://..."
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Target Topic / Stack</label>
                <select 
                  value={resourceData.tagId} 
                  onChange={(e) => setResourceData({...resourceData, tagId: e.target.value})} required
                >
                  <option value="" disabled>Select a target module...</option>
                  {tags.map(tag => (
                    <option key={tag.tag_id} value={tag.tag_id}>{tag.name}</option>
                  ))}
                </select>
              </div>

              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <label>Type</label>
                  <select value={resourceData.type} onChange={(e) => setResourceData({...resourceData, type: e.target.value})}>
                    <option value="learning">Learning (Video/Doc)</option>
                    <option value="practice">Practice (Problem)</option>
                  </select>
                </div>
                <div className={styles.inputGroup}>
                  <label>Platform</label>
                  <select value={resourceData.platform} onChange={(e) => setResourceData({...resourceData, platform: e.target.value})}>
                    <option value="YouTube">YouTube</option>
                    <option value="Codeforces">Codeforces</option>
                    <option value="LeetCode">LeetCode</option>
                    <option value="GitHub">GitHub Docs</option>
                  </select>
                </div>
              </div>

              <button type="submit" className={styles.submitBtn}>INJECT RESOURCE</button>
              {resourceStatus && <p className={styles.statusMsg}>{resourceStatus}</p>}
            </form>
          </section>

        </div>
      </main>
    </>
  );
}