import { useState } from 'react';
import { resolveUploadUrl } from '../../utils/url';

// Deterministic color per person so the same name always gets the same
// initials-avatar color, instead of a random flash on every render.
const AVATAR_COLORS = ['#4F46E5', '#0EA5E9', '#059669', '#D97706', '#DC2626', '#7C3AED'];

function colorFor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function initials(name) {
  return name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join('');
}

export default function OrgChartNode({ node, depth = 0 }) {
  const [expanded, setExpanded] = useState(depth < 2);
  const [imgFailed, setImgFailed] = useState(false);
  const hasChildren = node.children?.length > 0;

  return (
    <div className="orgchart-branch">
      <div className="ent-card orgchart-node-card">
        {hasChildren && (
          <button
            type="button"
            className="orgchart-toggle"
            onClick={() => setExpanded((v) => !v)}
            aria-label={expanded ? 'Collapse team' : 'Expand team'}
          >
            {expanded ? '−' : '+'}
          </button>
        )}

        {node.photoUrl && !imgFailed ? (
          <img
            src={resolveUploadUrl(node.photoUrl)}
            alt={node.fullName}
            className="orgchart-avatar"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="orgchart-avatar-initials" style={{ background: colorFor(node.fullName) }}>
            {initials(node.fullName)}
          </div>
        )}

        <div>
          <div className="orgchart-name">{node.fullName}</div>
          <div className="orgchart-meta">{node.positionName || 'No position'} · {node.departmentName || 'No department'}</div>
        </div>

        {node.totalReportsCount > 0 && (
          <span className="orgchart-reports-badge">{node.totalReportsCount}</span>
        )}
      </div>

      {hasChildren && expanded && (
        <div className="orgchart-children">
          {node.children.map((child) => (
            <div key={child.employeeId} className="orgchart-child-row">
              <OrgChartNode node={child} depth={depth + 1} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}