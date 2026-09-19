import { useEffect, useState } from 'react';
import { Modal, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { surveyApi } from '../../api/survey.api';
import { departmentApi } from '../../api/department.api';

const TYPES = ['RATING_1_5', 'MULTIPLE_CHOICE', 'TEXT'];

let nextQuestionId = 0;
const newQuestion = () => ({
  id: `q-${++nextQuestionId}`,
  text: '',
  type: 'RATING_1_5',
  options: [], // array in state, joined only when submitting
});

function OptionsChipInput({ options, onChange }) {
  const [draft, setDraft] = useState('');

  const addOption = () => {
    // commas are stripped because options are sent as a comma-separated string
    const text = draft.replace(/,/g, ' ').replace(/\s+/g, ' ').trim();
    if (!text) return;
    if (!options.includes(text)) onChange([...options, text]);
    setDraft('');
  };

  const removeOption = (opt) => onChange(options.filter((o) => o !== opt));

  return (
    <div>
      <div className="d-flex flex-wrap gap-1 mb-1">
        {options.map((opt) => (
          <span key={opt} className="badge bg-light text-dark border d-flex align-items-center gap-1">
            {opt}
            <button
              type="button"
              className="btn btn-sm p-0 border-0 lh-1"
              aria-label={`Remove option ${opt}`}
              onClick={() => removeOption(opt)}
            >
              ✕
            </button>
          </span>
        ))}
      </div>
      <Form.Control
        size="sm"
        placeholder="Type option, press Enter"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={addOption}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            addOption();
          }
        }}
      />
    </div>
  );
}

export default function CreateSurveyModal({ show, onHide, onCreated }) {
  const [departments, setDepartments] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [anonymous, setAnonymous] = useState(true);
  const [closesAt, setClosesAt] = useState('');
  const [questions, setQuestions] = useState(() => [newQuestion()]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Every time the modal opens: reset the form and load departments
  useEffect(() => {
    if (!show) return;

    setTitle('');
    setDescription('');
    setDepartmentId('');
    setAnonymous(true);
    setClosesAt('');
    setQuestions([newQuestion()]);
    setSaving(false);
    setError('');

    let cancelled = false;
    departmentApi
      .getAll()
      .then((res) => {
        if (!cancelled) setDepartments(res.data || []);
      })
      .catch(() => {
        if (!cancelled) setError('Could not load departments.');
      });

    return () => {
      cancelled = true;
    };
  }, [show]);

  const updateQ = (id, field, value) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, [field]: value } : q)));
  };
  const addQ = () => setQuestions((prev) => [...prev, newQuestion()]);
  const removeQ = (id) => setQuestions((prev) => prev.filter((q) => q.id !== id));

  const isValid =
    title.trim() &&
    questions.every(
      (q) => q.text.trim() && (q.type !== 'MULTIPLE_CHOICE' || q.options.length >= 2)
    );

  const handleHide = () => {
    if (saving) return;
    onHide();
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError('');
    try {
      await surveyApi.create({
        title: title.trim(),
        description: description.trim(),
        anonymous,
        departmentId: departmentId ? Number(departmentId) : null,
        closesAt: closesAt || null,
        questions: questions.map((q, i) => ({
          text: q.text.trim(),
          type: q.type,
          sequenceOrder: i + 1,
          options: q.type === 'MULTIPLE_CHOICE' ? q.options.join(',') : null,
        })),
      });
      onCreated();
      onHide();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create survey. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={handleHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>New Survey</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Row className="g-3 mb-3">
          <Col md={6}>
            <Form.Group controlId="survey-title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Q3 Engagement Survey"
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="survey-closes-at">
              <Form.Label>Closes On</Form.Label>
              <Form.Control
                type="date"
                value={closesAt}
                onChange={(e) => setClosesAt(e.target.value)}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="survey-audience">
              <Form.Label>Audience</Form.Label>
              <Form.Select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}>
                <option value="">Company-wide</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6} className="d-flex align-items-end">
            <Form.Check
              id="survey-anonymous"
              type="checkbox"
              label="Anonymous (answers not linked to a name in results)"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
            />
          </Col>

          <Col md={12}>
            <Form.Group controlId="survey-description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="fw-semibold small mb-2">Questions</div>
        {questions.map((q) => (
          <Row key={q.id} className="g-2 mb-2 align-items-end">
            <Col md={5}>
              <Form.Control
                placeholder="Question text"
                value={q.text}
                onChange={(e) => updateQ(q.id, 'text', e.target.value)}
              />
            </Col>

            <Col md={3}>
              <Form.Select value={q.type} onChange={(e) => updateQ(q.id, 'type', e.target.value)}>
                {TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.replace(/_/g, ' ')}
                  </option>
                ))}
              </Form.Select>
            </Col>

            <Col md={3}>
              {q.type === 'MULTIPLE_CHOICE' && (
                <OptionsChipInput
                  options={q.options}
                  onChange={(val) => updateQ(q.id, 'options', val)}
                />
              )}
            </Col>

            <Col md={1}>
              <Button
                variant="outline-danger"
                size="sm"
                aria-label="Remove question"
                onClick={() => removeQ(q.id)}
                disabled={questions.length === 1}
              >
                ✕
              </Button>
            </Col>
          </Row>
        ))}

        <Button variant="outline-primary" size="sm" onClick={addQ}>
          + Add Question
        </Button>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleHide} disabled={saving}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={saving || !isValid}>
          {saving ? 'Saving…' : 'Create Draft'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}