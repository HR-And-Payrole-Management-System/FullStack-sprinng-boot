import { useState, useEffect, useRef } from 'react';
import { Modal, Form, Button, Spinner } from 'react-bootstrap';

import { userApi } from '../api/user.api';

function LinkAccountModal({ show, onClose, onSubmit, submitting }) {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!show) {
      setKeyword('');
      setResults([]);
      setSelected(null);
    }
  }, [show]);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (keyword.trim().length < 2) {
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(() => {
      setSearching(true);
      userApi.search(keyword.trim())
        .then((res) => setResults(res.data || []))
        .catch(() => setResults([]))
        .finally(() => setSearching(false));
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [keyword]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selected) onSubmit(selected.id);
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>Link Login Account</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="pt-2">
          <Form.Group>
            <Form.Label className="small fw-semibold">Search by name or email *</Form.Label>
            <Form.Control
              autoFocus
              placeholder="Type at least 2 characters..."
              value={selected ? `${selected.firstName} ${selected.lastName} (${selected.email})` : keyword}
              onChange={(e) => { setSelected(null); setKeyword(e.target.value); }}
            />
          </Form.Group>

          {searching && <div className="text-muted small mt-2"><Spinner size="sm" animation="border" /> Searching...</div>}

          {!selected && results.length > 0 && (
            <div className="mt-2 border rounded" style={{ maxHeight: 220, overflowY: 'auto' }}>
              {results.map((u) => (
                <div
                  key={u.id}
                  onClick={() => { setSelected(u); setResults([]); }}
                  className="p-2"
                  style={{ cursor: 'pointer', borderBottom: '1px solid var(--color-border)' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-bg)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{u.firstName} {u.lastName}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{u.email}</div>
                </div>
              ))}
            </div>
          )}

          {!searching && keyword.trim().length >= 2 && results.length === 0 && !selected && (
            <div className="text-muted small mt-2">No matching accounts found.</div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="light" onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button type="submit" className="ent-btn-primary" disabled={submitting || !selected}>
            {submitting ? 'Linking...' : 'Link Account'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default LinkAccountModal;