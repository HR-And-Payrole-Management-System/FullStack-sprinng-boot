import { useEffect, useState } from 'react';
import { orgChartApi } from '../api/orgChart.api';
import { employeeApi } from '../api/employee.api';
import { companyService } from '../services/company.service';
import OrgChartNode from '../components/orgchart/OrgChartNode';
import { useAuth } from '../context/AuthContext';
import { useHasPermission } from '../hooks/useHaspermission';
import '../styles/org-chart.css';

export default function OrgChart() {
  const { user } = useAuth();
  const canViewAllCompanies = useHasPermission('COMPANY_VIEW');

  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [roots, setRoots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!canViewAllCompanies) return;
    companyService.list().then(setCompanies);
  }, [canViewAllCompanies]);

  useEffect(() => {
    if (canViewAllCompanies) return;
    if (!user?.employeeId) { setLoading(false); return; }
    employeeApi.getById(user.employeeId)
      .then((res) => setSelectedCompanyId(res.data.companyId))
      .catch(() => setLoading(false));
  }, [user, canViewAllCompanies]);

  useEffect(() => {
    if (canViewAllCompanies && companies.length > 0 && !selectedCompanyId) {
      setSelectedCompanyId(companies[0].id);
    }
  }, [canViewAllCompanies, companies, selectedCompanyId]);

  useEffect(() => {
    if (!selectedCompanyId) return;
    setLoading(true);
    orgChartApi.getCompanyChart(selectedCompanyId)
      .then((res) => setRoots(res.data))
      .finally(() => setLoading(false));
  }, [selectedCompanyId]);

  const filterTree = (nodes, term) => {
    if (!term) return nodes;
    const lower = term.toLowerCase();
    const walk = (node) => {
      const children = node.children.map(walk).filter(Boolean);
      const matches = node.fullName.toLowerCase().includes(lower);
      return matches || children.length > 0 ? { ...node, children } : null;
    };
    return nodes.map(walk).filter(Boolean);
  };

  const countAll = (nodes) => nodes.reduce((sum, n) => sum + 1 + countAll(n.children), 0);
  const countManagers = (nodes) => nodes.reduce(
    (sum, n) => sum + (n.children.length > 0 ? 1 : 0) + countManagers(n.children), 0
  );

  if (loading) return <div className="ent-page-title">Loading org chart…</div>;

  const visible = filterTree(roots, search);
  const totalEmployees = countAll(roots);
  const totalManagers = countManagers(roots);

  return (
    <div className="orgchart-page">
      <div className="ent-toolbar">
        <div>
          <div className="ent-page-title mb-2">Org Chart</div>
          <div className="orgchart-stats">
            <div className="orgchart-stat">
              <span className="orgchart-stat-value">{totalEmployees}</span>
              <span className="orgchart-stat-label">People shown</span>
            </div>
            <div className="orgchart-stat">
              <span className="orgchart-stat-value">{totalManagers}</span>
              <span className="orgchart-stat-label">People managers</span>
            </div>
            <div className="orgchart-stat">
              <span className="orgchart-stat-value">{roots.length}</span>
              <span className="orgchart-stat-label">Top-level roots</span>
            </div>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
          {canViewAllCompanies && (
            <select
              className="form-select form-select-sm"
              style={{ width: 'auto' }}
              value={selectedCompanyId || ''}
              onChange={(e) => setSelectedCompanyId(Number(e.target.value))}
            >
              {companies.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          )}
          <div className="ent-search">
            <span className="ent-search-icon">⌕</span>
            <input
              type="text"
              name="orgchart-search"
              autoComplete="off"
              placeholder="Search employee…"
              className="form-control form-control-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="orgchart-forest">
        {visible.length === 0 && <div className="orgchart-empty">No matches.</div>}
        {visible.map((root) => (
          <div key={root.employeeId} className="orgchart-branch">
            <OrgChartNode node={root} />
          </div>
        ))}
      </div>
    </div>
  );
}