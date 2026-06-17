import { useCallback, useEffect, useState } from 'react';

const POLL_INTERVAL_MS = 30000;

export default function useModules() {
  const [modules, setModules] = useState([]);

  const reload = useCallback(async () => {
    const res = await fetch('/api/modules');
    setModules(await res.json());
  }, []);

  useEffect(() => {
    reload();
    const interval = setInterval(reload, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [reload]);

  return { modules, reload };
}
