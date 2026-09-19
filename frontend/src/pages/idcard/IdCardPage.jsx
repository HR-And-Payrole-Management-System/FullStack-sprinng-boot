import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IdCard as IdCardIcon,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Printer,
  Contact,
  Plus,
  Pencil,
} from 'lucide-react';

import { idCardService } from '../../services/idcard.service';
import { companyService } from '../../services/company.service';
import { resolveUploadUrl } from '../../utils/url';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import AppPagination from '../../components/AppPagination';
import EmployeeIdCard from '../../components/idcard/EmployeeIdCard';
import IssueCardModal from '../../components/idcard/IssueCardModal';
import EditCardModal from '../../components/idcard/EditCardModal';

const PAGE_SIZE = 8;
const STATUS_FILTERS = [
  { value: '', label: 'All Statuses' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'LOST', label: 'Lost' },
  { value: 'EXPIRED', label: 'Expired' },
  { value: 'REISSUED', label: 'Reissued' },
];

// A card can only be printed when it's in a valid, currently-usable state.
const PRINTABLE_STATUSES = ['ACTIVE', 'REISSUED'];

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

function IdCardPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [cards, setCards] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [companyLogo, setCompanyLogo] = useState(null);

  const [stats, setStats] = useState({ total: 0, active: 0, lost: 0, expired: 0 });

  const [showIssue, setShowIssue] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    companyService.list()
      .then((companies) => {
        const first = companies?.[0];
        if (first?.logoUrl) setCompanyLogo(resolveUploadUrl(first.logoUrl));
      })
      .catch(() => {});
  }, []);

  const loadStats = () => {
    Promise.all([
      idCardService.list({ page: 0, size: 1 }),
      idCardService.list({ page: 0, size: 1, status: 'ACTIVE' }),
      idCardService.list({ page: 0, size: 1, status: 'LOST' }),
      idCardService.list({ page: 0, size: 1, status: 'EXPIRED' }),
    ]).then(([all, active, lost, expired]) => {
      setStats({
        total: all.totalElements || 0,
        active: active.totalElements || 0,
        lost: lost.totalElements || 0,
        expired: expired.totalElements || 0,
      });
    }).catch(() => {});
  };

  const load = () => {
    setLoading(true);
    idCardService.list({ page, size: PAGE_SIZE, status })
      .then((res) => {
        setCards(res.content || []);
        setTotalPages(res.totalPages || 0);
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, [page, status]);
  useEffect(loadStats, []);

  const refreshAll = () => {
    load();
    loadStats();
  };

  const handleIssue = async (employeeId, payload) => {
    setSubmitting(true);
    try {
      await idCardService.create(employeeId, payload);
      showToast('ID card issued successfully.', 'success');
      setShowIssue(false);
      setPage(0);
      refreshAll();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to issue card.', 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (id, payload) => {
    setSubmitting(true);
    try {
      await idCardService.update(id, payload);
      showToast('Card updated successfully.', 'success');
      setEditingCard(null);
      refreshAll();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update card.', 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  const printCard = (card) => {
    if (!PRINTABLE_STATUSES.includes(card.status)) {
      showToast(`This card is marked "${card.status}" and can't be printed. Update its status first.`, 'warning');
      return;
    }
    navigate(`/id-card/${card.employeeId}/print`);
  };
  const printLanyard = (card) => { // NEW
    if (!PRINTABLE_STATUSES.includes(card.status)) {
      showToast(`This card is marked "${card.status}" and can't be printed. Update its status first.`, 'warning');
      return;
    }
    navigate(`/id-card/${card.employeeId}/print-lanyard`);
  };

  if (loading && cards.length === 0 && !status) return <LoadingSpinner fullPage />;

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-900/60 px-6 py-6">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">ID Card</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Employee badge issuance & access management</p>
        </div>

        <button
          onClick={() => setShowIssue(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-violet-600/20 transition hover:bg-violet-700"
        >
          <Plus size={16} strokeWidth={2.25} />
          Issue Card
        </button>
      </div>

      {/* Stat cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={IdCardIcon} iconBg="bg-blue-50" iconColor="text-blue-500" label="Total Cards" value={stats.total} />
        <StatCard icon={ShieldCheck} iconBg="bg-emerald-50" iconColor="text-emerald-500" label="Active" value={stats.active} />
        <StatCard icon={AlertTriangle} iconBg="bg-rose-50" iconColor="text-rose-500" label="Lost" value={stats.lost} />
        <StatCard icon={Clock} iconBg="bg-amber-50" iconColor="text-amber-500" label="Expired" value={stats.expired} />
      </div>

      {/* Content card */}
      <div className="min-w-0 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
        {/* Filter header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-5 py-4">
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(0); }}
            className="
              rounded-lg border border-slate-300 dark:border-slate-600
              bg-white dark:bg-slate-900
              py-2.5 px-3
              text-sm text-slate-800 dark:text-slate-200
              transition
              focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-700
            "
          >
            {STATUS_FILTERS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>

          {cards.length > 0 && (
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 transition hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <Printer size={15} strokeWidth={2.25} />
              Print This Page
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-5">
          {loading ? (
            <LoadingSpinner />
          ) : cards.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                <IdCardIcon size={22} strokeWidth={2} className="text-slate-400 dark:text-slate-500" />
              </div>
              <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">No ID cards found</div>
              <div className="text-sm text-slate-400 dark:text-slate-500">Issue a card for an employee to get started.</div>
            </div>
          ) : (
            <>
              <div
                className="grid gap-5"
                style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(338px, 1fr))' }}
              >
                {cards.map((card) => (
                  <div
                    key={card.id}
                    className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 p-4"
                  >
                    <EmployeeIdCard
                      employee={{
                        id: card.employeeId,
                        firstName: card.employeeName?.split(' ')[0],
                        lastName: card.employeeName?.split(' ').slice(1).join(' '),
                        employeeCode: card.employeeCode,
                        photoUrl: card.photoUrl,
                        companyName: card.companyName,
                        branchName: card.branchName,
                        departmentName: card.departmentName,
                        positionName: card.positionName,
                      }}
                      card={card}
                      companyLogo={companyLogo}
                    />
                    <div className="flex w-full gap-2">
                      <button
                        onClick={() => setEditingCard(card)}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 transition hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        <Pencil size={14} strokeWidth={2.25} />
                        Edit
                      </button>
                      <button
                        onClick={() => printCard(card)}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 transition hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        <Printer size={14} strokeWidth={2.25} />
                        Print
                      </button>
                      <button
                        onClick={() => printLanyard(card)}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 transition hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        <Contact size={14} strokeWidth={2.25} />
                        Lanyard
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex justify-end">
                <AppPagination page={page} totalPages={totalPages} onChange={setPage} />
              </div>
            </>
          )}
        </div>
      </div>

      <IssueCardModal
        show={showIssue}
        onClose={() => setShowIssue(false)}
        onSubmit={handleIssue}
        submitting={submitting}
      />
      <EditCardModal
        show={!!editingCard}
        card={editingCard}
        onClose={() => setEditingCard(null)}
        onSubmit={handleUpdate}
        submitting={submitting}
      />
    </div>
  );
}

export default IdCardPage;