import { useCallback, useEffect, useState } from 'react';
import { api } from './platform';
export function useTeacherData() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const reload = useCallback(async () => {
    setLoading(true); setError('');
    try { setData(await api('dashboard')); } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { reload(); }, [reload]);
  return { data, error, loading, reload };
}
