import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { recognitionApi } from '../../api/recognition.api';
import { useAuth } from '../../context/AuthContext';
import RecognitionCard from '../../components/recognition/RecognitionCard';
import GiveRecognitionModal from '../../components/recognition/GiveRecognitionModal';
import ManageCoreValuesModal from '../../components/recognition/ManageCoreValuesModal';
import Leaderboard from '../../components/recognition/Leaderboard';

export default function RecognitionPage() {
  const { user } = useAuth();
  const [feed, setFeed] = useState([]);
  const [budget, setBudget] = useState(null);
  const [showGive, setShowGive] = useState(false);
  const [showManageValues, setShowManageValues] = useState(false);

  const load = () => {
    recognitionApi.getFeed().then((res) => setFeed(res.data));
    if (user?.employeeId) recognitionApi.getBudget(user.employeeId).then((res) => setBudget(res.data));
  };
  useEffect(() => { load(); }, [user]);

  return (
    <div className="p-6">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <div className="ent-page-title mb-0">Recognition</div>
          {budget && <div className="text-muted small">You have {budget.pointsRemaining}/{budget.monthlyBudget} points left to give this month</div>}
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" size="sm" onClick={() => setShowManageValues(true)}>Manage Core Values</Button>
          <Button variant="primary" size="sm" onClick={() => setShowGive(true)}>+ Give Recognition</Button>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-8">
          {feed.map((r) => <RecognitionCard key={r.id} recognition={r} onUpdated={load} />)}
          {feed.length === 0 && <div className="text-muted small">No recognitions yet — be the first!</div>}
        </div>
        <div className="col-md-4">
          <Leaderboard />
        </div>
      </div>

      <GiveRecognitionModal show={showGive} onHide={() => setShowGive(false)} onGiven={load} />
      <ManageCoreValuesModal show={showManageValues} onHide={() => setShowManageValues(false)} onChanged={() => {}} />
    </div>
  );
}