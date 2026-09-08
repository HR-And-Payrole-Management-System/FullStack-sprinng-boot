import { useEffect, useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';

import { performanceService } from '../../services/performance.service';
import CyclesPanel from './CyclesPanel';
import EmployeePerformancePanel from './EmployeePerformancePanel';

function PerformancePage() {
  const [activeTab, setActiveTab] = useState('cycles');
  const [cycles, setCycles] = useState([]);

  useEffect(() => {
    performanceService.listCycles().then(setCycles).catch(() => setCycles([]));
  }, [activeTab === 'goals']);

  return (
    <div>
      <div className="ent-toolbar align-items-start">
        <div>
          <div className="ent-page-title">Performance</div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
            Review cycles, employee goals, and self / manager evaluations
          </div>
        </div>
      </div>

      <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-3">
        <Tab eventKey="cycles" title="Cycles">
          <CyclesPanel />
        </Tab>
        <Tab eventKey="goals" title="Goals & Reviews">
          <EmployeePerformancePanel cycles={cycles} />
        </Tab>
      </Tabs>
    </div>
  );
}

export default PerformancePage;