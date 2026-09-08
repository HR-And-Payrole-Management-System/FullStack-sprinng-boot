// src/hooks/useNotifications.js
import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '../services/notification.service';
import { useAuth } from '../context/AuthContext';

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(() => {
    setLoading(true);
    notificationService
      .fetchForEmployee(user?.employeeId)
      .then(setNotifications)
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // refresh every 60s
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAsRead = async (id) => {
    await notificationService.markRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllRead = async () => {
    if (!user?.employeeId) return;
    await notificationService.markAllRead(user.employeeId);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = async (id) => {
    await notificationService.remove(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const unreadCount = notificationService.countUnread(notifications);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllRead,
    deleteNotification,
    refetch: fetchNotifications,
  };
}