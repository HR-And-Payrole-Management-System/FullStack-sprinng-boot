import { useEffect, useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';

function AssignRolesModal({ show, user, allRoles, onClose, onSubmit, submitting }) {
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (show && user) {
      setSelected((user.roles || []).map((r) => r.id));
    }
  }, [show, user]);

  const toggle = (roleId) => {
    setSelected((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]
    );
  };

  const handleSave = () => onSubmit(selected);

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>
          Assign Roles — {user?.firstName} {user?.lastName}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-2">
        {!allRoles.length ? (
          <div className="d-flex justify-content-center py-3">
            <Spinner size="sm" animation="border" />
          </div>
        ) : (
          <div className="d-flex flex-column gap-2">
            {allRoles.map((role) => (
              <Form.Check
                key={role.id}
                type="checkbox"
                id={`role-${role.id}`}
                label={
                  <span>
                    <strong>{role.name}</strong>
                    {role.description && (
                      <span className="text-muted small ms-2">{role.description}</span>
                    )}
                  </span>
                }
                checked={selected.includes(role.id)}
                onChange={() => toggle(role.id)}
              />
            ))}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer className="border-0 pt-0">
        <Button variant="light" onClick={onClose} disabled={submitting}>Cancel</Button>
        <Button className="ent-btn-primary" onClick={handleSave} disabled={submitting}>
          {submitting ? 'Saving...' : 'Save Roles'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AssignRolesModal;