import { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { surveyApi } from '../../api/survey.api';
import { useAuth } from '../../context/AuthContext';

function SurveyForm({ survey, employeeId, onSubmitted }) {
  const [detail, setDetail] = useState(null);
  const [answers, setAnswers] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    surveyApi.getDetail(survey.id).then((res) => setDetail(res.data));
  }, [survey.id]);

  const setAnswer = (questionId, field, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: { ...(prev[questionId] || {}), [field]: value } }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const payload = Object.entries(answers).map(([questionId, val]) => ({ questionId: Number(questionId), ...val }));
      await surveyApi.submitResponse(survey.id, { employeeId, answers: payload });
      onSubmitted();
    } finally {
      setSaving(false);
    }
  };

  if (!detail) return <div className="text-muted small">Loading…</div>;

  return (
    <div className="ent-card p-3 mb-3">
      <div className="fw-semibold mb-1">{detail.title}</div>
      <div className="text-muted small mb-3">{detail.description}</div>

      {detail.questions.map((q) => (
        <Form.Group key={q.id} className="mb-3">
          <Form.Label className="small fw-medium">{q.text}</Form.Label>

          {q.type === 'RATING_1_5' && (
            <div className="d-flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <Button
                  key={n}
                  size="sm"
                  variant={answers[q.id]?.ratingValue === n ? 'primary' : 'outline-secondary'}
                  onClick={() => setAnswer(q.id, 'ratingValue', n)}
                >
                  {n}
                </Button>
              ))}
            </div>
          )}

          {q.type === 'MULTIPLE_CHOICE' && (
            <Form.Select value={answers[q.id]?.selectedOption || ''} onChange={(e) => setAnswer(q.id, 'selectedOption', e.target.value)}>
              <option value="">-- Select --</option>
              {q.options.map((o) => <option key={o} value={o}>{o}</option>)}
            </Form.Select>
          )}

          {q.type === 'TEXT' && (
            <Form.Control as="textarea" rows={2} value={answers[q.id]?.textAnswer || ''} onChange={(e) => setAnswer(q.id, 'textAnswer', e.target.value)} />
          )}
        </Form.Group>
      ))}

      <Button variant="primary" size="sm" onClick={handleSubmit} disabled={saving || Object.keys(answers).length === 0}>
        {saving ? 'Submitting…' : 'Submit Response'}
      </Button>
    </div>
  );
}

export default function MySurveysPage() {
  const { user } = useAuth();
  const [pending, setPending] = useState([]);

  const load = () => {
    if (!user?.employeeId) return;
    surveyApi.getPending(user.employeeId).then((res) => setPending(res.data));
  };
  useEffect(() => { load(); }, [user]);

  return (
    <div className="p-6">
      <div className="ent-page-title mb-1">My Surveys</div>
      <div className="text-muted small mb-4">Surveys awaiting your response</div>

      {pending.length === 0 && <div className="text-success small">Nothing pending — thanks for participating!</div>}

      {pending.map((s) => (
        <SurveyForm key={s.id} survey={s} employeeId={user.employeeId} onSubmitted={load} />
      ))}
    </div>
  );
}