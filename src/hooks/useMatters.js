import { useState, useEffect } from 'react';
import matterService from '../services/matterService';

export function useMatters({ search = '', startDate, endDate } = {}) {
  const [matters, setMatters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    matterService.fetchMatters({ search, startDate, endDate })
      .then(data => {
        if (isMounted) {
          setMatters(data);
        }
      })
      .catch(err => {
        if (isMounted) {
          setError(err.message || 'Failed to load matters');
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, [search, startDate, endDate]);

  return { matters, loading, error };
} 