import { useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';

import UsersPanel from './users/UsersPanel';
import RolesPanel from './roles/RolesPanel';

function UsersRolesPage() {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div>
      <div className="ent-toolbar align-items-start">
        <div>
          <div className="ent-page-title">Users & Roles</div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
            Manage user accounts, roles, and permission assignments
          </div>
        </div>
      </div>

      <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-3">
        <Tab eventKey="users" title="Users">
          <UsersPanel />
        </Tab>
        <Tab eventKey="roles" title="Roles">
          <RolesPanel />
        </Tab>
      </Tabs>
    </div>
  );
}

export default UsersRolesPage;