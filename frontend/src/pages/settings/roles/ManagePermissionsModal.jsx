import { useEffect, useState } from 'react';
import { Modal, Form, Button, Spinner } from 'react-bootstrap';

import { roleService } from '../../../services/role.service';
import { permissionService } from '../../../services/permission.service';

// "PAYROLL_CREATE" -> group key "PAYROLL"
function groupByPrefix(permissions) {
  const groups = {};
  permissions.forEach((p) => {
    const key = p.name.includes('_') ? p.name.split('_')[0] : 'OTHER';
    (groups[key] ||= []).push(p);
  });
  return groups;
}

function ManagePermissionsModal({ show, role, onClose, onSaved }) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [allPermissions, setAllPermissions] = useState([]);
  const [currentIds, setCurrentIds] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (!show || !role) return;
    setLoading(true);
    Promise.all([permissionService.list(), roleService.getById(role.id)])
      .then(([perms, fullRole]) => {
        setAllPermissions(perms);
        const ids = (fullRole.permissions || []).map((p) => p.id);
        setCurrentIds(ids);
        setSelected(ids);
      })
      .finally(() => setLoading(false));
  }, [show, role]);

  const toggle = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleGroup = (groupPerms, allChecked) => {
    const ids = groupPerms.map((p) => p.id);
    setSelected((prev) =>
      allChecked ? prev.filter((id) => !ids.includes(id)) : [...new Set([...prev, ...ids])]
    );
  };

  const handleSave = async () => {
    setSubmitting(true);
    try {
      await roleService.syncPermissions(role.id, currentIds, selected);
      onSaved();
    } finally {
      setSubmitting(false);
    }
  };

  const groups = groupByPrefix(allPermissions);

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>
          Permissions — {role?.name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-2" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
        {loading ? (
          <div className="d-flex justify-content-center py-4"><Spinner animation="border" /></div>
        ) : (
          Object.entries(groups).map(([groupName, perms]) => {
            const allChecked = perms.every((p) => selected.includes(p.id));
            return (
              <div key={groupName} className="mb-3 pb-2 border-bottom">
                <Form.Check
                  type="checkbox"
                  id={`group-${groupName}`}
                  label={<strong>{groupName}</strong>}
                  checked={allChecked}
                  onChange={() => toggleGroup(perms, allChecked)}
                  className="mb-2"
                />
                <div className="d-flex flex-wrap gap-3 ps-3">
                  {perms.map((p) => (
                    <Form.Check
                      key={p.id}
                      type="checkbox"
                      id={`perm-${p.id}`}
                      label={p.name}
                      checked={selected.includes(p.id)}
                      onChange={() => toggle(p.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </Modal.Body>
      <Modal.Footer className="border-0 pt-0">
        <Button variant="light" onClick={onClose} disabled={submitting}>Cancel</Button>
        <Button className="ent-btn-primary" onClick={handleSave} disabled={submitting || loading}>
          {submitting ? 'Saving...' : 'Save Permissions'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ManagePermissionsModal;