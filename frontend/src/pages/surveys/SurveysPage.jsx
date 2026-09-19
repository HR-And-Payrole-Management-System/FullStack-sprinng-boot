import { useEffect, useState } from 'react';
import { Button, Badge } from 'react-bootstrap';
import { surveyApi } from '../../api/survey.api';
import CreateSurveyModal from '../../components/survey/CreateSurveyModal';
import SurveyResultsView from '../../components/survey/SurveyResultsView';

export default function SurveysPage() {
  const [surveys, setSurveys] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const load = () => surveyApi.getAll().then((res) => setSurveys(res.data));
  useEffect(() => { load(); }, []);

  return (
    <div className="p-6">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="ent-page-title">Surveys</div>
        <Button variant="primary" size="sm" onClick={() => setShowCreate(true)}>+ New Survey</Button>
      </div>

      {surveys.map((s) => (
        <div key={s.id} className="ent-card p-3 mb-3">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <div className="fw-semibold">{s.title}</div>
              <div className="text-muted small">{s.scopeLabel} · {s.anonymous ? 'Anonymous' : 'Named'}{s.closesAt && ` · Closes ${s.closesAt}`}</div>
            </div>
            <div className="text-end">
              <Badge bg={s.status === 'ACTIVE' ? 'success' : s.status === 'CLOSED' ? 'secondary' : 'warning'} text={s.status === 'DRAFT' ? 'dark' : undefined}>
                {s.status}
              </Badge>
              <div className="mt-1 d-flex gap-2 justify-content-end">
                {s.status === 'DRAFT' && (
                  <Button size="sm" variant="outline-success" onClick={async () => { await surveyApi.activate(s.id); load(); }}>Activate</Button>
                )}
                <Button size="sm" variant="outline-primary" onClick={() => setExpandedId(expandedId === s.id ? null : s.id)}>
                  {expandedId === s.id ? 'Hide Results' : 'View Results'}
                </Button>
              </div>
            </div>
          </div>

          {expandedId === s.id && (
            <div className="mt-3 pt-3 border-top">
              <SurveyResultsView surveyId={s.id} />
            </div>
          )}
        </div>
      ))}
      {surveys.length === 0 && <div className="text-muted small">No surveys created yet.</div>}

      <CreateSurveyModal show={showCreate} onHide={() => setShowCreate(false)} onCreated={load} />
    </div>
  );
}