import { useEffect, useState } from 'react';
import { ProgressBar } from 'react-bootstrap';
import { surveyApi } from '../../api/survey.api';

export default function SurveyResultsView({ surveyId }) {
  const [results, setResults] = useState(null);
  const handleExport = async () => {
  const res = await surveyApi.exportCsv(surveyId);
  const url = window.URL.createObjectURL(new Blob([res.data], { type: 'text/csv' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `survey-${surveyId}-results.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

  useEffect(() => {
    surveyApi.getResults(surveyId).then((res) => setResults(res.data));
  }, [surveyId]);

  if (!results) return <div className="text-muted small">Loading results…</div>;

  return (
    <div>
      <div className="small text-muted mb-3">
        {results.responseCount}/{results.totalInScope} responded ({results.responseRatePercent}%)
        {results.anonymous && ' · Responses are anonymous — no names shown below'}
      </div>

      {results.results.map((q) => (
        <div key={q.questionId} className="mb-3">
          <div className="fw-medium small mb-1">{q.text}</div>

          {q.averageRating != null && (
            <div className="d-flex align-items-center gap-2">
              <ProgressBar now={(q.averageRating / 5) * 100} style={{ height: 8, flexGrow: 1 }} />
              <span className="small fw-semibold">{q.averageRating} / 5</span>
            </div>
          )}

          {q.optionCounts && (
            <div>
              {Object.entries(q.optionCounts).map(([option, count]) => (
                <div key={option} className="d-flex align-items-center gap-2 mb-1">
                  <span className="small" style={{ width: 120 }}>{option}</span>
                  <ProgressBar now={count} max={Math.max(...Object.values(q.optionCounts))} style={{ height: 6, flexGrow: 1 }} />
                  <span className="small text-muted">{count}</span>
                </div>
              ))}
            </div>
          )}

          {q.textAnswers && (
            <div className="d-flex flex-column gap-1">
              {q.textAnswers.length === 0 && <span className="text-muted small">No responses yet.</span>}
              {q.textAnswers.map((a, i) => (
                <div key={i} className="border rounded p-2 small">{a}</div>
              ))}
            </div>
          )}
          <button className="btn btn-sm btn-outline-secondary mb-3" onClick={handleExport}>
            Export CSV
          </button>
        
        </div>
        
      ))}
    </div>
  );
}