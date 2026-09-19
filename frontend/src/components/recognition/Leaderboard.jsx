import { useEffect, useState } from 'react';
import { recognitionApi } from '../../api/recognition.api';

export default function Leaderboard() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    recognitionApi.getLeaderboard().then((res) => setEntries(res.data));
  }, []);

  return (
    <div className="ent-card p-3">
      <div className="fw-semibold mb-2">This Month's Leaderboard</div>
      {entries.slice(0, 5).map((e, i) => (
        <div key={e.employeeId} className="d-flex justify-content-between align-items-center py-1">
          <span className="small">#{i + 1} {e.employeeName}</span>
          <span className="small fw-semibold">{e.totalPoints} pts</span>
        </div>
      ))}
      {entries.length === 0 && <div className="text-muted small">No recognitions given yet this month.</div>}
    </div>
  );
}