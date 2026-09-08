import { useEffect, useMemo, useState } from 'react';
import { Row, Col, Button } from 'react-bootstrap';

import { workforceInsightsService } from '../../services/workforceInsights.service';
import { useToast } from '../../context/ToastContext';
import { exportToCsv } from '../../utils/exportCsv';

import LoadingSpinner from '../../components/LoadingSpinner';
import TrendStatCard from '../../components/charts/TrendStatCard';
import DonutChart from '../../components/charts/DonutChart';
import LineTrendChart from '../../components/charts/LineTrendChart';
import HorizontalBarChart from '../../components/charts/HorizontalBarChart';
import InsightSummaryBar from '../../components/charts/InsightSummaryBar';

function ChartPlaceholder({ title, note }) {
  return (
    <div className="ent-card p-3 h-100">
      {title && <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }} className="mb-2">{title}</div>}
      <div className="ent-empty" style={{ padding: '2rem 1rem' }}>
        <div className="ent-empty-icon">📊</div>
        <div style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: 'var(--text-sm)' }}>No data yet</div>
        <div className="small">{note}</div>
      </div>
    </div>
  );
}

const TABS = [
  { key: 'all', label: 'Overview' },
  { key: 'attrition', label: 'Attrition' },
  { key: 'demographics', label: 'Demographics' },
];

function WorkforceInsightsPage() {
  const { showToast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  const load = () => {
    setLoading(true);
    workforceInsightsService
      .loadAll()
      .then(setData)
      .catch(() => showToast('មិនអាចទាញយកទិន្នន័យវិភាគកម្លាំងពលកម្មបានទេ', 'danger'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const hasAttrition = (data?.attritionByDept?.length || 0) > 0;
  const hasPosition = (data?.attritionByPosition?.length || 0) > 0;
  const hasAge = (data?.ageGroups || []).some((d) => d.value > 0);
  const hasGender = (data?.gender || []).some((d) => d.value > 0);
  const hasTenure = (data?.tenure || []).some((d) => d.value > 0);

  const showAttrition = activeTab === 'all' || activeTab === 'attrition';
  const showDemographics = activeTab === 'all' || activeTab === 'demographics';

  const handleExport = () => {
    if (!data) return;
    const stamp = new Date().toISOString().slice(0, 10);
    const rows = [
      ...data.trend.map((d) => ({ Section: 'Headcount Trend', Category: d.name, Value: d.value })),
      ...data.attritionByDept.map((d) => ({ Section: 'Attrition by Department', Category: d.name, Value: d.value })),
      ...data.attritionByPosition.map((d) => ({ Section: 'Attrition by Position', Category: d.name, Value: d.value })),
      ...data.ageGroups.map((d) => ({ Section: 'Age Group', Category: d.name, Value: d.value })),
      ...data.gender.map((d) => ({ Section: 'Gender', Category: d.name, Value: d.value })),
      ...data.tenure.map((d) => ({ Section: 'Tenure', Category: d.name, Value: d.value })),
    ];
    exportToCsv(`workforce-insights-${stamp}.csv`, rows);
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div>
      {/* ============ Header ============ */}
      <div className="ent-toolbar align-items-start">
        <div>
          <div className="ent-page-title">Workforce Insights</div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
            Headcount trends, attrition, and workforce demographics
          </div>
        </div>
        <Button variant="light" onClick={handleExport}>⬇ Export CSV</Button>
      </div>

      {/* ============ Enterprise summary strip ============ */}
      <InsightSummaryBar
        trend={data.trend}
        attritionByDept={data.attritionByDept}
        ageGroups={data.ageGroups}
        gender={data.gender}
      />

      {/* ============ Section tabs ============ */}
      <div className="d-flex gap-2 mb-3">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`ent-btn-tab ${activeTab === t.key ? 'active' : ''}`}
            style={{
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md, 8px)',
              padding: '0.4rem 0.9rem',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              background: activeTab === t.key ? 'var(--color-primary)' : 'var(--color-surface)',
              color: activeTab === t.key ? '#fff' : 'var(--color-text-muted)',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ============ Headcount trend (always visible in Overview) ============ */}
      {(activeTab === 'all') && (
        <Row className="g-3 mb-3">
          <Col lg={12}>
            <LineTrendChart data={data.trend} xKey="name" lineKey="value" title="Headcount Trend Over Time" height={300} />
          </Col>
        </Row>
      )}

      {/* ============ Attrition section ============ */}
      {showAttrition && (
        <>
          <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }} className="mb-2 mt-1">
            ATTRITION
          </div>
          <Row className="g-3 mb-3">
            <Col lg={6}>
              {hasAttrition
                ? <DonutChart data={data.attritionByDept} title="Attrition by Department" centerLabel="Total Attrition" height={280} />
                : <ChartPlaceholder title="Attrition by Department" note="No resigned employees recorded yet." />}
            </Col>
            <Col lg={6}>
              {hasPosition
                ? <HorizontalBarChart data={data.attritionByPosition} title="Attrition by Job Role" height={280} />
                : <ChartPlaceholder title="Attrition by Job Role" note="No resigned employees recorded yet." />}
            </Col>
          </Row>
        </>
      )}

      {/* ============ Demographics section ============ */}
      {showDemographics && (
        <>
          <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }} className="mb-2 mt-1">
            DEMOGRAPHICS
          </div>
          <Row className="g-3 mb-3">
            <Col lg={4}>
              {hasAge
                ? <DonutChart data={data.ageGroups} title="Employees by Age Group" centerLabel="Total" />
                : <ChartPlaceholder title="Employees by Age Group" note="No date of birth data recorded yet." />}
            </Col>
            <Col lg={4}>
              {hasGender
                ? <DonutChart data={data.gender} title="Gender Diversity" centerLabel="Total" />
                : <ChartPlaceholder title="Gender Diversity" note="No gender data recorded yet." />}
            </Col>
            <Col lg={4}>
              {hasTenure
                ? <HorizontalBarChart data={data.tenure} title="Tenure Distribution" />
                : <ChartPlaceholder title="Tenure Distribution" note="No hire date data recorded yet." />}
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}

export default WorkforceInsightsPage;