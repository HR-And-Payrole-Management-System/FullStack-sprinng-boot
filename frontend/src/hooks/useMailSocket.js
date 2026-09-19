import { useEffect, useRef } from 'react';
import { storageService } from '../services/storage.service';

export function useMailSocket(onMessage) {
  const socketRef = useRef(null);
  const reconnectTimer = useRef(null);
  const cancelledRef = useRef(false);

  useEffect(() => {
    const token = storageService.getAccessToken();
    if (!token) return;

    cancelledRef.current = false;

    const connect = () => {
      const apiBase = import.meta.env.VITE_API_BASE_URL || '';
      const serverOrigin = apiBase.replace(/\/api\/v1\/?$/, '');
      const wsOrigin = serverOrigin.replace(/^http/, 'ws');

      const socket = new WebSocket(`${wsOrigin}/ws/mail?token=${encodeURIComponent(token)}`);

      socket.onmessage = (event) => {
        try {
          const envelope = JSON.parse(event.data);
          onMessage?.(envelope);
        } catch {
          // ignore malformed frame
        }
      };

      socket.onclose = () => {
        if (!cancelledRef.current) {
          reconnectTimer.current = setTimeout(connect, 3000);
        }
      };

      socketRef.current = socket;
    };

    connect();

    return () => {
      cancelledRef.current = true;
      clearTimeout(reconnectTimer.current);
      socketRef.current?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}