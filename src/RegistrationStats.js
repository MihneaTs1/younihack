import React from 'react';
import LoadingSpinner from './LoadingSpinner';

function RegistrationStats({ backendUrl }) {
  const [stats, setStats] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${backendUrl}/stats`);
        if (!res.ok) throw new Error('Failed to fetch stats');
        const data = await res.json();
        setStats(data);
      } catch (e) {
        setError('Could not load registration stats.');
        setStats(null);
      }
      setLoading(false);
    }
    fetchStats();
  }, [backendUrl]);

  if (loading) return <div style={{marginBottom: '1rem'}}><LoadingSpinner text="Loading stats..." /></div>;
  if (error) return <div style={{color: '#e17055', marginBottom: '1rem'}}>{error}</div>;
  if (!stats) return null;

  return (
    <div className="RegistrationStats">
      <span role="img" aria-label="users"></span> {stats.count || 0} registered participant{stats.count === 1 ? '' : 's'} so far!
    </div>
  );
}

export default RegistrationStats;
