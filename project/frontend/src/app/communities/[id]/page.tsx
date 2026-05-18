import React from 'react';

export default async function CommunityPage({ params }: { params: { id: string } }) {
  // Await the params object (required in newer Next.js versions for async layouts/params)
  // const resolvedParams = await params;
  
  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      {/* Header Banner */}
      <div style={{ background: 'linear-gradient(to right, #1e293b, #0f172a)', padding: '3rem 2rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Elite Coders Squad</h1>
        <p style={{ color: 'var(--text-muted)' }}>A group for sharing advanced CP techniques and weekly mashups.</p>
      </div>

      {/* Admin Panel (Mocked visible for demo) */}
      <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid var(--accent-blue)', padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', color: 'var(--accent-blue)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>⚙️</span> Admin Panel
        </h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input type="text" placeholder="User ID to add..." style={{ flex: 1, padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)', background: 'var(--background)', color: 'var(--foreground)' }} />
          <button className="button-primary">Add Member</button>
        </div>
      </div>

      {/* Members Roster */}
      <div style={{ background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Members Roster</h3>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '0.75rem 0' }}>User</th>
              <th>Role</th>
              <th>Rating</th>
              <th style={{ textAlign: 'right' }}>Manage</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '1rem 0', fontWeight: 'bold' }}>algo_master</td>
              <td style={{ color: 'var(--accent-blue)' }}>Manager</td>
              <td>2400</td>
              <td style={{ textAlign: 'right', color: 'var(--text-muted)' }}>-</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '1rem 0' }}>trainee_01</td>
              <td style={{ color: 'var(--text-muted)' }}>Trainee</td>
              <td>1450</td>
              <td style={{ textAlign: 'right' }}>
                <button style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--foreground)', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', marginRight: '0.5rem', cursor: 'pointer' }}>Promote</button>
                <button style={{ background: 'transparent', border: '1px solid var(--accent-red)', color: 'var(--accent-red)', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', cursor: 'pointer' }}>Kick</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
