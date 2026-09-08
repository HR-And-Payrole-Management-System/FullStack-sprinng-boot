import { useEffect, useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import {
  Building2,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  Eye,
  Pencil,
  Trash2,
  MoreVertical,
  ExternalLink,
  AlertTriangle,
} from 'lucide-react';

import { companyService } from '../../services/company.service';
import { useAuth } from '../../context/AuthContext';
import CompanyFormModal from '../../components/company/CompanyFormModal';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Dropdown } from 'react-bootstrap';
import { resolveUploadUrl } from '../../utils/url';

function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

// Palette taken from the reference dashboard: violet primary, green/blue/orange status accents.
const STATUS_STYLES = {
  ACTIVE: 'bg-emerald-50 text-emerald-700',
  APPROVED: 'bg-emerald-50 text-emerald-700',
  PENDING: 'bg-amber-50 text-amber-700',
  INACTIVE: 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400',
  REJECTED: 'bg-rose-50 text-rose-700',
};

const STATUS_DOT = {
  ACTIVE: 'bg-emerald-500',
  APPROVED: 'bg-emerald-500',
  PENDING: 'bg-amber-500',
  INACTIVE: 'bg-slate-400',
  REJECTED: 'bg-rose-500',
};

const DONUT_COLORS = ['#7C3AED', '#3B82F6', '#10B981', '#F97316', '#F43F5E'];

function StatusBadge({ status }) {
  const cls = STATUS_STYLES[status] || 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400';
  const dot = STATUS_DOT[status] || 'bg-slate-400';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${cls}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  );
}

function StatCard({ icon: Icon, iconBg, iconColor, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 py-4 shadow-sm">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${iconBg}`}>
        <Icon size={20} strokeWidth={2} className={iconColor} />
      </div>
      <div>
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">{label}</div>
        <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</div>
      </div>
    </div>
  );
}

// Small reusable action dropdown — click outside to close.
function ActionMenu({ onView, onEdit, onDelete, canUpdate, canDelete }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 dark:text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300"
      >
        <MoreVertical size={17} strokeWidth={2} />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-1 w-36 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-1 shadow-lg">
          <button
            onClick={() => {
              setOpen(false);
              onView();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60"
          >
            <Eye size={15} strokeWidth={2} />
            View
          </button>

          {canUpdate && (
            <button
              onClick={() => {
                setOpen(false);
                onEdit();
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60"
            >
              <Pencil size={15} strokeWidth={2} />
              Edit
            </button>
          )}

          {canDelete && (
            <button
              onClick={() => {
                setOpen(false);
                onDelete();
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
            >
              <Trash2 size={15} strokeWidth={2} />
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function CompanyList() {
  const { hasRole, hasPermission } = useAuth();
  const canCreate = hasRole('ADMIN') || hasPermission('COMPANY_CREATE');
  const canUpdate = hasRole('ADMIN') || hasPermission('COMPANY_UPDATE');
  const canDelete = hasRole('ADMIN') || hasPermission('COMPANY_DELETE');

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [search, setSearch] = useState('');

  const [modalMode, setModalMode] = useState(null); // 'create' | 'edit' | 'view' | null
  const [activeCompany, setActiveCompany] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCompanies = () => {
    setLoading(true);
    setLoadError('');

    companyService
      .list()
      .then(setCompanies)
      .catch((err) => {
        setLoadError(
          err.response?.status === 403
            ? 'You do not have permission to view companies.'
            : 'Failed to load companies. Please try again.'
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return companies;

    return companies.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.registrationNumber?.toLowerCase().includes(q)
    );
  }, [companies, search]);

  // --- Stats (derived client-side, no extra API calls) ---
  const stats = useMemo(() => {
    const total = companies.length;
    const active = companies.filter((c) => c.status === 'ACTIVE' || c.status === 'APPROVED').length;
    const pending = companies.filter((c) => c.status === 'PENDING').length;
    const inactive = companies.filter((c) => c.status === 'INACTIVE' || c.status === 'REJECTED').length;
    return { total, active, pending, inactive };
  }, [companies]);

  const statusChartData = useMemo(() => {
    const counts = {};
    companies.forEach((c) => {
      counts[c.status] = (counts[c.status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [companies]);

  // --- Modal handlers ---
  const openCreate = () => {
    setActiveCompany(null);
    setFormError('');
    setModalMode('create');
  };

  const openEdit = (company) => {
    setActiveCompany(company);
    setFormError('');
    setModalMode('edit');
  };

  const openView = (company) => {
    setActiveCompany(company);
    setFormError('');
    setModalMode('view');
  };

  const closeModal = () => {
    setModalMode(null);
    setActiveCompany(null);
  };

  const handleSubmit = async (data, logoFile) => {
    setSubmitting(true);
    setFormError('');

    try {
      let saved;

      if (modalMode === 'edit' && activeCompany) {
        saved = await companyService.update(activeCompany.id, data);
      } else {
        saved = await companyService.create(data);
      }

      if (logoFile) {
        saved = await companyService.uploadLogo(saved.id, logoFile);
      }

      if (modalMode === 'edit' && activeCompany) {
        setCompanies((prev) => prev.map((c) => (c.id === saved.id ? saved : c)));
      } else {
        setCompanies((prev) => [saved, ...prev]);
      }

      closeModal();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Could not save the company. Please check the form.');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      await companyService.remove(deleteTarget.id);
      setCompanies((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      setLoadError(err.response?.data?.message || 'Could not delete this company.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-900/60 px-6 py-6">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Companies</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Organization network overview</p>
        </div>

        {canCreate && (
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-violet-600/20 transition hover:bg-violet-700"
          >
            + New Company
          </button>
        )}
      </div>

      {/* Stat cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Building2} iconBg="bg-blue-50" iconColor="text-blue-500" label="Total Companies" value={stats.total} />
        <StatCard icon={CheckCircle2} iconBg="bg-emerald-50" iconColor="text-emerald-500" label="Active" value={stats.active} />
        <StatCard icon={Clock} iconBg="bg-teal-50" iconColor="text-teal-500" label="Pending" value={stats.pending} />
        <StatCard icon={XCircle} iconBg="bg-orange-50" iconColor="text-orange-500" label="Inactive" value={stats.inactive} />
      </div>

      {/* Content: donut + table */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        {/* Donut chart card */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-slate-800 dark:text-slate-200">Companies by Status</h2>

          {statusChartData.length === 0 ? (
            <div className="flex h-48 items-center justify-center text-sm text-slate-400 dark:text-slate-500">No data yet.</div>
          ) : (
            <>
              <div style={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusChartData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                    >
                      {statusChartData.map((_, i) => (
                        <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 space-y-1.5">
                {statusChartData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }}
                    />
                    {d.name} ({d.value})
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Table card */}
        
{/* Table card */}
<div className="min-w-0 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.06)]">

  {/* Search Header */}
  <div className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-5 py-4">
    <div className="relative max-w-sm">
      <Search
        size={16}
        strokeWidth={2}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
      />

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search name, email, registration..."
        className="
          w-full rounded-lg
          border border-slate-300 dark:border-slate-600
          bg-white dark:bg-slate-900
          py-2.5 pl-9 pr-3
          text-sm text-slate-800 dark:text-slate-200
          placeholder:text-slate-400 dark:placeholder:text-slate-500
          transition
          focus:border-slate-500
          focus:outline-none
          focus:ring-2
          focus:ring-slate-200 dark:focus:ring-slate-700
        "
      />
    </div>
  </div>

  {/* Error */}
  {loadError && (
    <div className="m-4 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/40 px-4 py-3 text-sm text-red-700 dark:text-red-400">
      {loadError}
    </div>
  )}

  {/* Empty State */}
  {filtered.length === 0 ? (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
        {search
          ? 'No companies match your search.'
          : 'No companies yet.'}
      </p>
    </div>
  ) : (
    <div className="w-full overflow-x-auto">

      <table className="w-full min-w-[900px] text-left text-sm">

        {/* Table Header */}
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60">

            <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Company
            </th>

            <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Company Info
            </th>

            <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Registration No.
            </th>

            <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Status
            </th>

            <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Action
            </th>

          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-slate-100">

          {filtered.map((c) => (
            <tr
              key={c.id}
              className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60"
            >

              {/* Company */}
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">

                  {c.logoUrl ? (
                    <img
                      src={resolveUploadUrl(c.logoUrl)}
                      alt={c.name}
                      className="
                        h-10 w-10
                        rounded-lg
                        object-cover
                        border border-slate-200 dark:border-slate-700
                        bg-slate-50 dark:bg-slate-900/60
                      "
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <span
                      className="
                        flex h-10 w-10 shrink-0
                        items-center justify-center
                        rounded-lg
                        bg-slate-100 dark:bg-slate-800
                        text-xs font-bold
                        text-slate-600 dark:text-slate-400
                        border border-slate-200 dark:border-slate-700
                      "
                    >
                      {initials(c.name)}
                    </span>
                  )}

                  <div className="min-w-0">

                    <div className="truncate font-semibold text-slate-900 dark:text-slate-100">
                      {c.name}
                    </div>

                    {c.website && (
                      
                      <a  href={c.website}
                        target="_blank"
                        rel="noreferrer"
                        className="
                          inline-flex
                          max-w-[220px]
                          items-center
                          gap-1
                          truncate
                          text-xs
                          text-slate-500 dark:text-slate-400
                          hover:text-slate-800 dark:hover:text-slate-100
                          hover:underline
                        "
                      >
                        {c.website}
                        <ExternalLink size={11} strokeWidth={2} />
                      </a>
                    )}

                  </div>
                </div>
              </td>

              {/* Company Info */}
              <td className="px-5 py-4">
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  {c.email}
                </div>

                <div className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                  {c.phone || '—'}
                </div>
              </td>

              {/* Registration */}
              <td className="px-5 py-4">
                <span className="font-mono text-xs text-slate-600 dark:text-slate-400">
                  {c.registrationNumber || '—'}
                </span>
              </td>

              {/* Status */}
              <td className="px-5 py-4">
                <StatusBadge status={c.status} />
              </td>

              {/* Action */}
              <td className="px-5 py-4 text-right">

                <Dropdown align="end">

                  <Dropdown.Toggle
                    size="sm"
                    variant="light"
                    className="
                      border
                      border-slate-200 dark:border-slate-700
                      bg-white dark:bg-slate-900
                      px-2.5
                      text-slate-500 dark:text-slate-400
                      shadow-none
                      hover:bg-slate-50 dark:hover:bg-slate-800/60
                      hover:text-slate-900 dark:hover:text-white
                    "
                  >
                    ⋮
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="border-slate-200 dark:border-slate-700 shadow-lg">

                    <Dropdown.Item
                      onClick={() => openView(c)}
                      className="text-sm text-slate-700 dark:text-slate-300"
                    >
                      View
                    </Dropdown.Item>

                    {canUpdate && (
                      <Dropdown.Item
                        onClick={() => openEdit(c)}
                        className="text-sm text-slate-700 dark:text-slate-300"
                      >
                        Edit
                      </Dropdown.Item>
                    )}

                    {canDelete && (
                      <Dropdown.Item
                        className="text-sm text-red-600 dark:text-red-400"
                        onClick={() => setDeleteTarget(c)}
                      >
                        Delete
                      </Dropdown.Item>
                    )}

                  </Dropdown.Menu>

                </Dropdown>

              </td>

            </tr>
          ))}

        </tbody>
      </table>
    </div>
  )}
</div>


      </div>

      <CompanyFormModal
        show={!!modalMode}
        mode={modalMode}
        onHide={closeModal}
        onSubmit={handleSubmit}
        initialData={activeCompany}
        submitting={submitting}
        serverError={formError}
      />

      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 dark:bg-black/70 backdrop-blur-sm"
          onClick={() => !deleting && setDeleteTarget(null)}
        >
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-600">
              <AlertTriangle size={18} strokeWidth={2} />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Delete company?</h3>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
              This will permanently remove <span className="font-medium text-slate-700 dark:text-slate-300">{deleteTarget.name}</span>. This action cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompanyList;