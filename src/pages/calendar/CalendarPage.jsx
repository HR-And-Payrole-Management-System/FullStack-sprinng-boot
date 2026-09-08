import { useEffect, useMemo, useState } from 'react';
import { Button } from 'react-bootstrap';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { calendarService } from '../../services/calendar.service';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const TYPE_PILL = {
  PUBLIC: 'ent-pill-success',
  COMPANY: 'ent-pill-warning',
  OPTIONAL: 'ent-pill-neutral',
};

function CalendarPage() {
  const { showToast } = useToast();
  const today = new Date();

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1); // 1-12
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    calendarService
      .fetchMonth(year, month)
      .then(setEvents)
      .catch(() => showToast('មិនអាចទាញយកប្រតិទិនបានទេ', 'danger'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month]);

  const goPrevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const goNextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  const goToday = () => {
    setYear(today.getFullYear());
    setMonth(today.getMonth() + 1);
  };

  const sortedEvents = useMemo(
    () => [...events].sort((a, b) => (a.date > b.date ? 1 : -1)),
    [events]
  );

  return (
    <div>
      <div className="ent-toolbar align-items-start">
        <div>
          <div className="ent-page-title">Calendar</div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
            Company holidays and events
          </div>
        </div>
        <Button variant="light" onClick={goToday} style={{ background: 'var(--color-text-muted)'}}>
          Today
        </Button>
      </div>

      <div className="d-flex align-items-center gap-2 mb-3">
        <Button variant="light" onClick={goPrevMonth} aria-label="Previous month">
          <ChevronLeft size={16} />
        </Button>
        <div style={{ fontWeight: 600, minWidth: 160, textAlign: 'center' }}>
          {MONTH_NAMES[month - 1]} {year}
        </div>
        <Button variant="light" onClick={goNextMonth} aria-label="Next month">
          <ChevronRight size={16} />
        </Button>
      </div>

      <div className="ent-card p-3">
        {loading ? (
          <LoadingSpinner />
        ) : sortedEvents.length === 0 ? (
          <EmptyState
            icon="📅"
            title="No events this month"
            subtitle="Holidays and company events will show up here."
          />
        ) : (
          <div className="d-flex flex-column gap-2">
            {sortedEvents.map((e) => (
              <div
                key={e.id}
                className="d-flex align-items-center justify-content-between p-3"
                style={{
                  borderRadius: 'var(--radius-md, 8px)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>
                    {e.title}
                  </div>
                  <div className="small text-muted">
                    {new Date(e.date).toLocaleDateString(undefined, {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                    {e.paidHoliday && ' · Paid holiday'}
                  </div>
                </div>
                {e.eventType && (
                  <span className={`ent-pill ${TYPE_PILL[e.eventType] || 'ent-pill-neutral'}`}>
                    {e.eventType}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CalendarPage;