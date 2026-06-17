import { useCallback, useEffect, useState } from 'react';

const POLL_INTERVAL_MS = 2000;
const OPEN_STATUSES = new Set(['pending', 'cloning', 'pulling', 'building']);

export default function useDeployLog(route, active) {
  const [data, setData] = useState({ status: null, log: [] });

  const reload = useCallback(async () => {
    if (!route) return;
    const res = await fetch(`/api/modules${route}/deploy-log`);
    setData(await res.json());
  }, [route]);

  useEffect(() => {
    if (!active) return;
    reload();
  }, [active, reload]);

  useEffect(() => {
    if (!active || !OPEN_STATUSES.has(data.status)) return;
    const interval = setInterval(reload, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [active, data.status, reload]);

  return { ...data, reload };
}
