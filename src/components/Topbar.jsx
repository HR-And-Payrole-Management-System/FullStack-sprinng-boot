import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getPrimaryRole } from '../utils/roleUtils';
import { useDebounce } from '../hooks/useDebounce';
import { employeeApi } from '../api/employee.api';
import {
  Menu,
  Search,
  Calendar,
  Bell,
  Mail,
  Maximize,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Check,
  Sun,
  Moon,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../hooks/useNotifications';
import { resolveUploadUrl } from '../utils/url';
import { mailService } from '../services/mail.service';
import { calendarService } from '../services/calendar.service';

function initials(user) {
  if (!user) return '?';
  return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
}

function Topbar({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const handleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    } else {
      document.documentElement.requestFullscreen?.();
    }
  };

  const [mailUnread, setMailUnread] = useState(0);
  const [upcomingEventCount, setUpcomingEventCount] = useState(0);

  const refreshMailUnread = () => {
    mailService
      .unreadCount()
      .then(setMailUnread)
      .catch(() => setMailUnread(0));
  };

  const refreshUpcomingEvents = () => {
    const today = new Date();
    const in7Days = new Date();
    in7Days.setDate(today.getDate() + 7);

    const months = new Set([
      `${today.getFullYear()}-${today.getMonth() + 1}`,
      `${in7Days.getFullYear()}-${in7Days.getMonth() + 1}`,
    ]);

    Promise.all(
      [...months].map((key) => {
        const [y, m] = key.split('-').map(Number);
        return calendarService.fetchMonth(y, m).catch(() => []);
      })
    ).then((results) => {
      const allEvents = results.flat();
      const count = allEvents.filter((e) => {
        const d = new Date(e.date);
        return d >= today && d <= in7Days;
      }).length;
      setUpcomingEventCount(count);
    });
  };

  useEffect(() => {
    refreshMailUnread();
    refreshUpcomingEvents();

    // real-time: MainLayout's useMailSocket dispatches this on every new message
    const onNewMail = () => refreshMailUnread();
    window.addEventListener('mail:new-message', onNewMail);

    // no WebSocket push for calendar/notifications on the backend yet — poll instead
    const interval = setInterval(() => {
      refreshMailUnread();
      refreshUpcomingEvents();
    }, 60000); // every 60s

    return () => {
      window.removeEventListener('mail:new-message', onNewMail);
      clearInterval(interval);
    };
  }, []);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [resultsOpen, setResultsOpen] = useState(false);
  const searchRef = useRef(null);
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    const term = debouncedSearch.trim();
    if (term.length < 2) {
      setResults([]);
      setResultsOpen(false);
      return;
    }

    setSearching(true);
    employeeApi
      .getAll({ page: 0, size: 6, keyword: term })
      .then((res) => {
        setResults(res.data?.content || []);
        setResultsOpen(true);
      })
      .catch(() => setResults([]))
      .finally(() => setSearching(false));
  }, [debouncedSearch]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setResultsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const goToEmployee = (id) => {
    setResultsOpen(false);
    setSearch('');
    navigate(`/employee/${id}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    navigate('/login', { replace: true });
  };

  const goTo = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  const goToProfile = () => {
    if (!user?.employeeId) return; // account has no linked employee record
    goTo(`/employee/${user.employeeId}`);
  };

  return (
    <div className="ent-topbar">
      <button className="ent-topbar-icon-btn" onClick={onToggleSidebar} aria-label="Toggle sidebar">
        <Menu size={20} />
      </button>

      <div className="ent-topbar-search" ref={searchRef} style={{ position: 'relative' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'contents' }}>
          <Search size={16} />
          <input
            placeholder="Search employees, departments, reports..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => results.length > 0 && setResultsOpen(true)}
          />
          <span className="ent-topbar-search-kbd">Ctrl + K</span>
        </form>

        {resultsOpen && (
          <div className="ent-notif-panel" style={{ top: '110%' }}>
            <div className="ent-notif-header">
              <span>Employees</span>
              {searching && <span className="ent-notif-count">Searching…</span>}
            </div>
            <div className="ent-notif-list">
              {!searching && results.length === 0 && (
                <div className="ent-notif-empty">No matches found</div>
              )}
              {results.map((emp) => (
                <button
                  key={emp.id}
                  className="ent-notif-item"
                  onClick={() => goToEmployee(emp.id)}
                >
                  <div className="ent-notif-item-body">
                    <div className="ent-notif-item-title">
                      {emp.firstName} {emp.lastName}
                    </div>
                    <div className="ent-notif-item-time">
                      {emp.positionName || emp.email}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="d-flex align-items-center gap-1 ms-auto">
        <button
          className={`ent-topbar-icon-btn ${location.pathname.startsWith('/calendar') ? 'active' : ''}`}
          title="Calendar"
          onClick={() => navigate('/calendar')}
        >
          <Calendar size={19} />
          {upcomingEventCount > 0 && (
            <span className="ent-topbar-badge">{upcomingEventCount}</span>
          )}
        </button>

        <div className="ent-notif-wrapper" ref={notifRef}>
          <button
            className={`ent-topbar-icon-btn ${notifOpen ? 'active' : ''}`}
            title="Notifications"
            onClick={() => setNotifOpen((o) => !o)}
          >
            <Bell size={19} />
            {unreadCount > 0 && <span className="ent-topbar-badge">{unreadCount}</span>}
          </button>

          {notifOpen && (
            <div className="ent-notif-panel">
              <div className="ent-notif-header">
                <span>Notifications</span>
                {unreadCount > 0 && <span className="ent-notif-count">{unreadCount} new</span>}
              </div>

              <div className="ent-notif-list">
                {notifications.length === 0 && (
                  <div className="ent-notif-empty">No notifications</div>
                )}

                {notifications.slice(0, 8).map((n) => (
                  <button
                    key={n.id}
                    className={`ent-notif-item ${n.read ? '' : 'unread'}`}
                    onClick={() => markAsRead(n.id)}
                  >
                    <div className="ent-notif-item-body">
                      <div className="ent-notif-item-title">{n.title || n.message}</div>
                      {n.createdAt && (
                        <div className="ent-notif-item-time">
                          {new Date(n.createdAt).toLocaleString()}
                        </div>
                      )}
                    </div>
                    {!n.read && <Check size={14} className="ent-notif-item-check" />}
                  </button>
                  
                ))}
              </div>

              <button className="ent-notif-viewall" onClick={() => goTo('/notifications')}>
                View all
              </button>
            </div>
          )}
        </div>

        <button
          className={`ent-topbar-icon-btn ${location.pathname.startsWith('/mail') ? 'active' : ''}`}
          title="Mail"
          onClick={() => navigate('/mail')}
        >
          <Mail size={19} />
          {mailUnread > 0 && <span className="ent-topbar-badge">{mailUnread}</span>}
        </button>

        <button
          className={`ent-topbar-icon-btn ${isFullscreen ? 'active' : ''}`}
          title="Fullscreen"
          onClick={handleFullscreen}
        >
          <Maximize size={18} />
        </button>
        <button
            className="ent-theme-toggle"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
          </button>

        <div className="ent-topbar-divider mx-1" />

        <div className="ent-user-menu-wrapper" ref={menuRef}>
          <div className="ent-topbar-user" onClick={() => setMenuOpen((o) => !o)}>
            <div className="ent-topbar-user-avatar">
              {user?.photoUrl ? (
                <img
                  src={resolveUploadUrl(user.photoUrl)}
                  alt="avatar"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                />
              ) : (
                initials(user)
              )}
            </div>
            <div className="d-none d-md-block">
              <div className="ent-topbar-user-name">
                {user ? `${user.firstName} ${user.lastName}` : '—'}
              </div>
              <div className="ent-topbar-user-role">{getPrimaryRole(user?.roles)}</div>
            </div>
            <ChevronDown
              size={14}
              className="text-muted d-none d-md-block"
              style={{
                transform: menuOpen ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.15s ease',
              }}
            />
          </div>

          {menuOpen && (
            <div className="ent-user-menu">
              <div className="ent-user-menu-header">
                <div className="ent-user-menu-name">
                  {user ? `${user.firstName} ${user.lastName}` : '—'}
                </div>
                <div className="ent-user-menu-email">{user?.email}</div>
              </div>

              <button
                className="ent-user-menu-item"
                onClick={goToProfile}
                disabled={!user?.employeeId}
                title={!user?.employeeId ? 'No employee profile linked to this account' : undefined}
              >
                <User size={16} />
                My Profile
              </button>

              <button
                className="ent-user-menu-item"
                onClick={() => goTo('/account-settings')}
              >
                <Settings size={16} />
                Account Settings
              </button>

              <div className="ent-user-menu-divider" />

              <button className="ent-user-menu-item danger" onClick={handleLogout}>
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Topbar;