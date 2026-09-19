import { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';

function AdvancedFiltersModal({ show, initialFilters, onClose, onApply }) {
  const [draft, setDraft] = useState(initialFilters);

  useEffect(() => {
    if (show) setDraft(initialFilters);
  }, [show, initialFilters]);

  const handleApply = () => {
    onApply(draft);
    onClose();
  };

  const handleReset = () => {
    const cleared = { dateRange: 'This Year', department: 'All', jobRole: 'All', location: 'All' };
    setDraft(cleared);
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>
          ⚙️ Advanced Filters
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-2">
        <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
          Fine-tune which data the dashboard displays.
        </p>
        <Row className="g-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label className="small fw-semibold">Date Range</Form.Label>
              <Form.Select
                value={draft.dateRange}
                onChange={(e) => setDraft((d) => ({ ...d, dateRange: e.target.value }))}
              >
                <option>This Month</option>
                <option>Last 3 Months</option>
                <option>This Year</option>
                <option>Last Year</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label className="small fw-semibold">Department</Form.Label>
              <Form.Select
                value={draft.department}
                onChange={(e) => setDraft((d) => ({ ...d, department: e.target.value }))}
              >
                <option>All</option>
              </Form.Select>
              <Form.Text className="text-muted">Same list as the Department chip on the toolbar.</Form.Text>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label className="small fw-semibold">
                Job Role <span className="text-muted">(not yet filterable)</span>
              </Form.Label>
              <Form.Select disabled value="All">
                <option>All</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label className="small fw-semibold">
                Location <span className="text-muted">(not yet filterable)</span>
              </Form.Label>
              <Form.Select disabled value="All">
                <option>All</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer className="border-0 pt-0 d-flex justify-content-between">
        <Button variant="link" className="text-muted" onClick={handleReset}>Reset all</Button>
        <div className="d-flex gap-2">
          <Button variant="light" onClick={onClose}>Cancel</Button>
          <Button className="ent-btn-primary" onClick={handleApply}>Apply Filters</Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default AdvancedFiltersModal;